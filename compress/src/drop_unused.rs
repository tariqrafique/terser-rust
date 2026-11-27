//! Port of terser `lib/compress/drop-unused.js`.
//!
//! `drop_unused` is three walks over one scope:
//! 1. `scan_ref_scoped` fills `in_use_ids`. `assign_as_unused` (`=` of a symbol)
//!    is not a use. A definition's value is walked here only when it has side effects.
//! 2. Initializers of names that are in use are walked, so `var a = b` keeps `b` when `a` is read.
//! 3. The `tt` transformer drops declarations that are not in use, and a write-only
//!    `name = expr` becomes `expr` (or is removed when the value is discarded and pure).
//!
//! `fixed_ids` records an initializer that is still the only write. A later `=` is
//! not that node, so it can be replaced only when the name was not written again.

use ast::{Data, DefKind, Key, N, Node, Seg, SymKind};
use crate::syms::{self, SymTable};
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

pub fn drop_unused(root: &N, toplevel_vars: bool, toplevel_funcs: bool) -> N {
    let table = syms::bind(root);
    let saved = NESTED.with(|d| d.replace(0));
    let saved_root = ROOT.with(|r| r.replace(ptr(root)));
    let out = scope(root, &table, toplevel_vars, toplevel_funcs);
    NESTED.with(|d| d.set(saved));
    ROOT.with(|r| r.set(saved_root));
    out
}

thread_local! {
    /// Depth of function scopes below the one `drop_unused` runs on.
    /// drop-unused.js `if (scope !== self) return;`: nested scopes only have
    /// their uses counted, their declarations are left for their own call.
    static NESTED: std::cell::Cell<u32> = const { std::cell::Cell::new(0) };
    static ROOT: std::cell::Cell<usize> = const { std::cell::Cell::new(0) };
}

fn nested() -> bool {
    NESTED.with(|d| d.get() > 0)
}

fn scope(n: &N, table: &SymTable, drop_vars: bool, drop_funcs: bool) -> N {
    match &n.data {
        Data::Toplevel { body } => {
            let body: Vec<N> = body.iter().map(|s| scope(s, table, true, true)).collect();
            node(n, Data::Toplevel { body: passes(&body, table, table.node_scope.get(&ptr(n)).copied(), drop_vars, drop_funcs) })
        }
        Data::Func { kind, name, args, body, async_, generator } => {
            let original = body;
            // The function `drop_unused` runs on is not nested; its body is not either.
            let is_root = ROOT.with(|r| r.get()) == ptr(n);
            let outer_nested = nested();
            if !is_root {
                NESTED.with(|d| d.set(d.get() + 1));
            }
            let body: Vec<N> = body.iter().map(|s| scope(s, table, true, true)).collect();
            if !is_root {
                NESTED.with(|d| d.set(d.get() - 1));
            }
            // drop-unused.js: an `AST_Function` name nothing reads is removed
            // (`keep_fnames` off), when the function sits in this scope.
            let name = match (kind, name) {
                (ast::FuncKind::Expr, Some(nm)) if !outer_nested && def_id(table, nm).is_some_and(|id| !name_read(original, args, table, id)) => None,
                _ => name.clone(),
            };
            let body = if is_root { passes(&body, table, table.node_scope.get(&ptr(n)).copied(), true, true) } else { body };
            node(n, Data::Func {
                kind: *kind,
                name,
                args: args.clone(),
                body,
                async_: *async_,
                generator: *generator,
            })
        }
        Data::Block { body } => {
            let body: Vec<N> = body.iter().map(|s| scope(s, table, drop_vars, drop_funcs)).collect();
            let body = if let (Some(&id), false) = (table.node_scope.get(&ptr(n)), nested()) {
                let _ = id;
                passes(&body, table, table.node_scope.get(&ptr(n)).copied(), true, drop_funcs)
            } else {
                body
            };
            node(n, Data::Block { body })
        }
        other => map_scope(n, other, table, drop_vars, drop_funcs),
    }
}

struct Use {
    in_use: HashSet<usize>,
    /// def id → initializer nodes (`initializations` in drop-unused.js).
    inits: HashMap<usize, Vec<N>>,
    /// def id → the vardef that is still the fixed value (`fixed_ids`).
    fixed: HashSet<usize>,
    wrote: HashSet<usize>,
    /// terser `var_defs_by_id`: each `var` definition of a name, in source
    /// order, by `VarDef` pointer. The index plus `orig_offset` is the
    /// position in `sym.orig`.
    var_defs: std::cell::RefCell<HashMap<usize, Vec<usize>>>,
    orig_index: HashMap<usize, usize>,
    /// terser `sym.eliminated`.
    eliminated: std::cell::RefCell<HashMap<usize, usize>>,
}

/// Passes 1–3 of `AST_Scope.drop_unused`.
fn passes(stmts: &[N], table: &SymTable, scope_id: Option<usize>, drop_vars: bool, drop_funcs: bool) -> Vec<N> {
    // `self.pinned()`: `with` keeps every name.
    if contains_with(stmts) {
        return stmts.to_vec();
    }
    let mut u = Use {
        in_use: HashSet::new(),
        inits: HashMap::new(),
        fixed: HashSet::new(),
        wrote: HashSet::new(),
        var_defs: Default::default(),
        orig_index: HashMap::new(),
        eliminated: Default::default(),
    };
    {
        let mut by_id: HashMap<usize, Vec<usize>> = HashMap::new();
        for stmt in stmts {
            collect_var_defs(stmt, table, &mut by_id);
        }
        for (id, list) in &by_id {
            // A parameter or function name is `orig[0]` before the `var`s.
            let offset = usize::from(table.defs[*id].funarg || table.defs[*id].is_defun);
            for (i, p) in list.iter().enumerate() {
                u.orig_index.insert(*p, i + offset);
            }
        }
        *u.var_defs.borrow_mut() = by_id;
    }
    for stmt in stmts {
        scan_ref_scoped(stmt, table, &mut u, true);
    }
    // terser `compressor.exposed(def)`: an exported binding is always in use.
    if let Some(scope_id) = scope_id {
        if let Some(ids) = table.scope_defs.get(&scope_id) {
            for id in ids {
                if table.defs[*id].exported {
                    u.in_use.insert(*id);
                }
            }
        }
    }
    // Pass 2: walk initializers of names that are in use.
    // terser `in_use_ids.forEach` also visits ids added during the walk, so
    // this runs until no new name is marked.
    let mut done: HashSet<usize> = HashSet::new();
    loop {
        let mut ready: Vec<usize> = u.in_use.iter().copied().filter(|id| !done.contains(id) && u.inits.contains_key(id)).collect();
        if ready.is_empty() {
            break;
        }
        ready.sort_unstable();
        for id in ready {
            done.insert(id);
            let inits = u.inits.get(&id).cloned().unwrap_or_default();
            for init in &inits {
                scan_ref_scoped(init, table, &mut u, false);
            }
        }
    }
    // A non-strict function that reads `arguments` uses every parameter.
    if mentions_arguments(stmts) {
        if let Some(scope_id) = scope_id {
            if let Some(ids) = table.scope_defs.get(&scope_id) {
                for id in ids {
                    if table.defs[*id].funarg {
                        u.in_use.insert(*id);
                    }
                }
            }
        }
    }
    let mut out = Vec::new();
    for stmt in stmts {
        rewrite_stmt(stmt, table, &u, scope_id, drop_vars, drop_funcs, &mut out);
    }
    out
}

/// `scan_ref_scoped` in drop-unused.js. `record_inits` is pass 1; pass 2 only marks refs.
fn scan_ref_scoped(n: &N, table: &SymTable, u: &mut Use, record_inits: bool) {
    if let Some(id) = assign_as_unused(n, table).and_then(|sym| def_id(table, sym)) {
        u.wrote.insert(id);
        u.fixed.remove(&id);
        if let Data::Assign { right, .. } = &n.data {
            scan_ref_scoped(right, table, u, record_inits);
        }
        return;
    }
    match &n.data {
        // drop-unused.js `scan_ref_scoped`: a function declaration's body is
        // walked only once its name is in use (an `initializations` entry).
        Data::Func { kind: ast::FuncKind::Decl, name: Some(nm), .. } | Data::Class { stmt: true, name: Some(nm), .. }
            if record_inits && def_id(table, nm).is_some() && class_pure(n) =>
        {
            let id = def_id(table, nm).unwrap();
            u.inits.entry(id).or_default().push(Rc::clone(n));
        }
        Data::Defs { defs, .. } if record_inits => {
            for def in defs {
                let Data::VarDef { name, value } = &def.data else { continue };
                if let Some(id) = def_id(table, name) {
                    if let Some(value) = value {
                        u.inits.entry(id).or_default().push(Rc::clone(value));
                        if !u.wrote.contains(&id) {
                            u.fixed.insert(id);
                        }
                        // Pass 1 walks the value only when it has side effects.
                        if has_side_effects(value) {
                            scan_ref_scoped(value, table, u, record_inits);
                        }
                    }
                } else {
                    // `def.name instanceof AST_Destructuring`: walk the pattern and the value.
                    scan_ref_scoped(name, table, u, record_inits);
                    if let Some(value) = value {
                        scan_ref_scoped(value, table, u, record_inits);
                    }
                }
            }
        }
        Data::Symbol { kind: SymKind::Ref, .. } => {
            if let Some(id) = table.lookup(&ptr(n)) {
                u.in_use.insert(id);
            }
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            mark_names(init, table, u);
            scan_ref_scoped(object, table, u, record_inits);
            scan_ref_scoped(body, table, u, record_inits);
        }
        _ => descend(n, |c| scan_ref_scoped(c, table, u, record_inits)),
    }
}

/// `assign_as_unused`: `=` of a `var` symbol. A `let`/`const` (`AST_SymbolBlockDeclaration`)
/// stays a use, so the binding is not dropped.
fn assign_as_unused<'a>(n: &'a N, table: &SymTable) -> Option<&'a N> {
    match &n.data {
        Data::Assign { op, left, logical, .. } if !*logical && op == "=" && is_ref(left) => {
            if def_id(table, left).is_some_and(|id| table.defs[id].block_scoped) {
                return None;
            }
            Some(left)
        }
        Data::Simple { body } => assign_as_unused(body, table),
        _ => None,
    }
}

fn owned(table: &SymTable, n: &N, scope_id: Option<usize>) -> Option<usize> {
    let id = def_id(table, n)?;
    if scope_id.is_some_and(|s| table.defs[id].scope != s) {
        return None;
    }
    Some(id)
}

fn rewrite_stmt(n: &N, table: &SymTable, u: &Use, scope_id: Option<usize>, drop_vars: bool, drop_funcs: bool, out: &mut Vec<N>) {
    if let Data::Defs { kind, defs, await_ } = &n.data {
        if matches!(kind, DefKind::Using) {
            out.push(Rc::clone(n));
            return;
        }
        // drop-unused.js `tt` `AST_Definitions`: `head` (no value), `tail`
        // (with value), and side effects of dropped or repeated definitions.
        let mut head: Vec<N> = Vec::new();
        let mut tail: Vec<N> = Vec::new();
        let mut body: Vec<N> = Vec::new();
        let mut side: Vec<N> = Vec::new();
        let mut changed = false;
        for def in defs {
            let Data::VarDef { name, value } = &def.data else {
                head.push(Rc::clone(def));
                continue;
            };
            let value2 = value.as_ref().map(|v| rewrite_expr(v, table, u, scope_id, drop_vars, false).unwrap_or_else(|| num0(v)));
            if let (Some(a), Some(b)) = (value, &value2) {
                if !Rc::ptr_eq(a, b) {
                    changed = true;
                }
            }
            let is_sym = matches!(name.data, Data::Symbol { .. });
            let id = owned(table, name, scope_id);
            let in_use = !drop_vars || !is_sym || id.is_none_or(|id| u.in_use.contains(&id));
            if in_use {
                if let (DefKind::Var, Some(id), true) = (kind, id, is_sym) {
                    let dp = ptr(def);
                    let listed = u.var_defs.borrow().get(&id).is_some_and(|v| v.contains(&dp));
                    let count = if listed { u.var_defs.borrow().get(&id).map_or(0, |v| v.len()) } else { 0 };
                    let elim = u.eliminated.borrow().get(&id).copied().unwrap_or(0);
                    let idx = u.orig_index.get(&dp).copied().unwrap_or(0);
                    if count > 1 && (value2.is_none() || idx > elim) {
                        if let Some(v) = value2 {
                            let sym = match &name.data {
                                Data::Symbol { name: nm, quote, .. } => node(name, Data::Symbol { name: nm.clone(), kind: SymKind::Ref, quote: *quote }),
                                _ => Rc::clone(name),
                            };
                            side.push(node(def, Data::Assign { op: "=".into(), left: sym, right: v, logical: false }));
                        }
                        if let Some(list) = u.var_defs.borrow_mut().get_mut(&id) {
                            list.retain(|p| *p != dp);
                        }
                        *u.eliminated.borrow_mut().entry(id).or_insert(0) += 1;
                        changed = true;
                        continue;
                    }
                }
                match value2 {
                    Some(v) => {
                        let mut v = v;
                        if !side.is_empty() {
                            if !tail.is_empty() {
                                side.push(v);
                                v = seq(def, std::mem::take(&mut side));
                            } else {
                                body.push(simple(n, seq(n, std::mem::take(&mut side))));
                            }
                            changed = true;
                        }
                        let same = value.as_ref().is_some_and(|a| Rc::ptr_eq(a, &v));
                        tail.push(if same { Rc::clone(def) } else { node(def, Data::VarDef { name: Rc::clone(name), value: Some(v) }) });
                    }
                    None => {
                        if !tail.is_empty() {
                            changed = true;
                        }
                        head.push(Rc::clone(def));
                    }
                }
            } else {
                changed = true;
                if let Some(v) = value2 {
                    if has_side_effects(&v) {
                        side.push(v);
                    }
                }
                if let Some(id) = id {
                    *u.eliminated.borrow_mut().entry(id).or_insert(0) += 1;
                }
            }
        }
        if !changed {
            out.push(Rc::clone(n));
            return;
        }
        if !head.is_empty() || !tail.is_empty() {
            head.extend(tail);
            body.push(node(n, Data::Defs { kind: *kind, defs: head, await_: *await_ }));
        }
        if !side.is_empty() {
            body.push(simple(n, seq(n, side)));
        }
        out.extend(body);
        return;
    }
    // drop-unused.js `tt` `AST_For`: the init is rewritten like a statement.
    // Side effects of dropped definitions move in front of the loop.
    if let Data::For { init: Some(init), cond, step, body } = &n.data {
        if matches!(init.data, Data::Defs { .. }) {
            let mut tmp = Vec::new();
            rewrite_stmt(init, table, u, scope_id, drop_vars, drop_funcs, &mut tmp);
            let same = tmp.len() == 1 && Rc::ptr_eq(&tmp[0], init);
            if !same {
                let last = tmp.pop();
                out.extend(tmp);
                let new_init = last.map(|l| match &l.data {
                    Data::Simple { body } => Rc::clone(body),
                    _ => l,
                });
                out.push(node(n, Data::For { init: new_init, cond: cond.clone(), step: step.clone(), body: Rc::clone(body) }));
                return;
            }
        }
    }
    // drop-unused.js: an unused `class` declaration goes when it has no side effects.
    if drop_funcs {
        if let Data::Class { stmt: true, name: Some(name), .. } = &n.data {
            if class_pure(n) && owned(table, name, scope_id).is_some_and(|id| !u.in_use.contains(&id)) {
                return;
            }
        }
    }
    if drop_funcs {
        if let Data::Func { name: Some(name), .. } = &n.data {
            if owned(table, name, scope_id).is_some_and(|id| !u.in_use.contains(&id)) {
                return;
            }
        }
    }
    if let Some(stmt) = rewrite_expr(n, table, u, scope_id, drop_vars, true) {
        // drop-unused.js `tt` `AST_BlockStatement`: in a list, a block whose
        // statements can all leave it is spliced.
        if let Data::Block { body } = &stmt.data {
            if body.iter().all(evictable) {
                out.extend(body.iter().cloned());
                return;
            }
        }
        out.push(stmt);
    }
}

/// terser `common.js` `can_be_evicted_from_block`.
fn evictable(n: &N) -> bool {
    !matches!(
        n.data,
        Data::Class { stmt: true, .. }
            | Data::Func { kind: ast::FuncKind::Decl, .. }
            | Data::Defs { kind: DefKind::Let | DefKind::Const | DefKind::Using, .. }
            | Data::Import { .. }
            | Data::Export { .. }
    )
}

/// Pass 3 `tt` for `assign_as_unused`. `discarded` is `!is_used_in_expression`.
fn rewrite_expr(n: &N, table: &SymTable, u: &Use, scope_id: Option<usize>, drop_vars: bool, discarded: bool) -> Option<N> {
    if drop_vars {
        if let Data::Assign { op, left, right, logical } = &n.data {
            if !*logical && op == "=" {
                // Only this scope's bindings (`self.variables.get(name) === def`).
                if let Some(id) = owned(table, left, scope_id) {
                    if !u.in_use.contains(&id) {
                        let rhs = rewrite_expr(right, table, u, scope_id, drop_vars, false)?;
                        if !has_side_effects(&rhs) && discarded {
                            return None;
                        }
                        return Some(rhs);
                    }
                }
            }
        }
    }
    let go = |c: &N, discarded: bool| rewrite_expr(c, table, u, scope_id, drop_vars, discarded).unwrap_or_else(|| num0(c));
    let data = match &n.data {
        Data::Simple { body } => {
            let body = rewrite_expr(body, table, u, scope_id, drop_vars, true)?;
            Data::Simple { body }
        }
        Data::Return { value } => Data::Return { value: value.as_ref().and_then(|v| rewrite_expr(v, table, u, scope_id, drop_vars, false)) },
        Data::Throw { value } => Data::Throw { value: go(value, false) },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr, false), prefix: *prefix },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left, false), right: go(right, false) },
        Data::Assign { op, left, right, logical } => Data::Assign { op: op.clone(), left: Rc::clone(left), right: go(right, false), logical: *logical },
        Data::Seq { exprs } => {
            let last = exprs.len().saturating_sub(1);
            let exprs: Vec<N> = exprs.iter().enumerate().filter_map(|(i, e)| rewrite_expr(e, table, u, scope_id, drop_vars, i != last || discarded)).collect();
            if exprs.len() == 1 {
                return Some(exprs.into_iter().next().unwrap());
            }
            Data::Seq { exprs }
        }
        Data::Call { expr, args, optional, is_new } => Data::Call {
            expr: go(expr, false),
            args: args.iter().map(|a| go(a, false)).collect(),
            optional: *optional,
            is_new: *is_new,
        },
        Data::Dot { expr, prop, optional, quote, private } => Data::Dot {
            expr: go(expr, false), prop: prop.clone(), optional: *optional, quote: *quote, private: *private,
        },
        Data::Sub { expr, prop, optional } => Data::Sub { expr: go(expr, false), prop: go(prop, false), optional: *optional },
        Data::Object { props } => Data::Object { props: props.iter().map(|p| go(p, false)).collect() },
        Data::Prop { method, key, value, static_, private, generator, async_ } => Data::Prop {
            method: *method,
            key: match key {
                Key::Computed(e) => Key::Computed(go(e, false)),
                other => other.clone(),
            },
            value: go(value, false),
            static_: *static_,
            private: *private,
            generator: *generator,
            async_: *async_,
        },
        Data::Array { elements } => Data::Array { elements: elements.iter().map(|e| go(e, false)).collect() },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond, false), cons: go(cons, false), alt: go(alt, false) },
        Data::If { cond, body, alt } => Data::If { cond: go(cond, false), body: go(body, false), alt: alt.as_ref().map(|a| go(a, false)) },
        Data::Block { body } => {
            let mut stmts = Vec::new();
            for stmt in body {
                rewrite_stmt(stmt, table, u, scope_id, drop_vars, false, &mut stmts);
            }
            Data::Block { body: stmts }
        }
        Data::Try { body, catch, finally } => Data::Try {
            body: one(body, table, u, scope_id, drop_vars),
            catch: catch.as_ref().map(|c| one(c, table, u, scope_id, drop_vars)),
            finally: finally.as_ref().map(|f| one(f, table, u, scope_id, drop_vars)),
        },
        Data::Catch { arg, body } => Data::Catch { arg: arg.clone(), body: one(body, table, u, scope_id, drop_vars) },
        Data::Finally { body } => Data::Finally { body: one(body, table, u, scope_id, drop_vars) },
        Data::While { cond, body } => Data::While { cond: go(cond, false), body: one(body, table, u, scope_id, drop_vars) },
        Data::Do { body, cond } => Data::Do { body: one(body, table, u, scope_id, drop_vars), cond: go(cond, false) },
        Data::For { init, cond, step, body } => Data::For {
            init: init.as_ref().map(|i| if matches!(i.data, Data::Defs { .. }) { Rc::clone(i) } else { go(i, true) }),
            cond: cond.as_ref().map(|c| go(c, false)),
            step: step.as_ref().map(|c| go(c, true)),
            body: one(body, table, u, scope_id, drop_vars),
        },
        Data::ForIn { init, object, body } => Data::ForIn { init: Rc::clone(init), object: go(object, false), body: one(body, table, u, scope_id, drop_vars) },
        Data::ForOf { init, object, body, await_ } => Data::ForOf { init: Rc::clone(init), object: go(object, false), body: one(body, table, u, scope_id, drop_vars), await_: *await_ },
        Data::Labeled { label, body } => Data::Labeled { label: Rc::clone(label), body: one(body, table, u, scope_id, drop_vars) },
        Data::Switch { expr, body } => Data::Switch { expr: go(expr, false), body: body.iter().map(|c| go(c, false)).collect() },
        Data::Case { expr, body } => {
            let mut stmts = Vec::new();
            for stmt in body {
                rewrite_stmt(stmt, table, u, scope_id, drop_vars, false, &mut stmts);
            }
            Data::Case { expr: go(expr, false), body: stmts }
        }
        Data::Default { body } => {
            let mut stmts = Vec::new();
            for stmt in body {
                rewrite_stmt(stmt, table, u, scope_id, drop_vars, false, &mut stmts);
            }
            Data::Default { body: stmts }
        }
        Data::Template { segments } => Data::Template {
            segments: segments.iter().map(|seg| match seg {
                Seg::Expr(e) => Seg::Expr(go(e, false)),
                other => other.clone(),
            }).collect(),
        },
        _ => return Some(Rc::clone(n)),
    };
    Some(node(n, data))
}

fn name_read(body: &[N], args: &[N], table: &SymTable, id: usize) -> bool {
    fn rec(n: &N, table: &SymTable, id: usize) -> bool {
        if matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. }) && def_id(table, n) == Some(id) {
            return true;
        }
        let mut hit = false;
        descend(n, |c| hit = hit || rec(c, table, id));
        hit
    }
    body.iter().chain(args.iter()).any(|s| rec(s, table, id))
}

/// A statement slot: several results become a block, none an empty statement.
fn one(n: &N, table: &SymTable, u: &Use, scope_id: Option<usize>, drop_vars: bool) -> N {
    // Not a list: a block stays a block (`in_list` is false in terser).
    if matches!(n.data, Data::Block { .. }) {
        return rewrite_expr(n, table, u, scope_id, drop_vars, true).unwrap_or_else(|| node(n, Data::Empty));
    }
    let mut out = Vec::new();
    rewrite_stmt(n, table, u, scope_id, drop_vars, false, &mut out);
    match out.len() {
        0 => node(n, Data::Empty),
        1 => out.pop().unwrap(),
        _ => node(n, Data::Block { body: out }),
    }
}

/// A class whose definition runs no code: no `extends` with effects, no
/// static block, computed key, or static initializer with effects.
fn class_pure(n: &N) -> bool {
    let Data::Class { extends, props, .. } = &n.data else { return true };
    if extends.as_ref().is_some_and(has_side_effects) {
        return false;
    }
    props.iter().all(|p| match &p.data {
        Data::StaticBlock { body } => body.is_empty(),
        Data::Field { key, value, static_, .. } => {
            !matches!(key, Key::Computed(k) if has_side_effects(k)) && !(*static_ && value.as_ref().is_some_and(has_side_effects))
        }
        Data::Prop { key: Key::Computed(k), .. } => !has_side_effects(k),
        _ => true,
    })
}

fn seq(span: &N, mut exprs: Vec<N>) -> N {
    if exprs.len() == 1 {
        return exprs.pop().unwrap();
    }
    node(span, Data::Seq { exprs })
}

/// `var` definitions of this scope, outside nested functions and classes.
fn collect_var_defs(n: &N, table: &SymTable, out: &mut HashMap<usize, Vec<usize>>) {
    collect_var_defs_in(n, table, out, &mut Vec::new());
}

/// A `var` that redeclares an enclosing `catch` parameter belongs to that
/// parameter in terser (`redefined_catch_def`), so it is not counted.
fn collect_var_defs_in(n: &N, table: &SymTable, out: &mut HashMap<usize, Vec<usize>>, catch_names: &mut Vec<String>) {
    match &n.data {
        Data::Func { .. } | Data::Class { .. } => {}
        Data::Catch { arg, body } => {
            let pushed = match arg.as_ref().map(|a| &a.data) {
                Some(Data::Symbol { name, .. }) => {
                    catch_names.push(name.clone());
                    true
                }
                _ => false,
            };
            collect_var_defs_in(body, table, out, catch_names);
            if pushed {
                catch_names.pop();
            }
        }
        Data::Defs { kind: DefKind::Var, defs, .. } => {
            for d in defs {
                if let Data::VarDef { name, value } = &d.data {
                    let redef = matches!(&name.data, Data::Symbol { name: nm, .. } if catch_names.contains(nm));
                    if !redef {
                        if let Some(id) = def_id(table, name) {
                            out.entry(id).or_default().push(ptr(d));
                        }
                    }
                    if let Some(v) = value {
                        collect_var_defs_in(v, table, out, catch_names);
                    }
                }
            }
        }
        _ => descend(n, |c| collect_var_defs_in(c, table, out, catch_names)),
    }
}

fn descend(n: &N, mut f: impl FnMut(&N)) {
    let one = |c: &N, f: &mut dyn FnMut(&N)| f(c);
    match &n.data {
        Data::Simple { body } | Data::Return { value: Some(body) } | Data::Throw { value: body }
        | Data::Unary { expr: body, .. } | Data::Dot { expr: body, .. } | Data::Await { expr: body }
        | Data::Spread { expr: body } | Data::Chain { expr: body } => one(body, &mut f),
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } | Data::DefaultAssign { left, right }
        | Data::PrivateIn { key: left, value: right } => { f(left); f(right); }
        Data::Call { expr, args, .. } => {
            f(expr);
            args.iter().for_each(|a| f(a));
        }
        Data::DynImport { args, .. } => args.iter().for_each(|a| f(a)),
        Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().for_each(|e| f(e)),
        Data::Object { props } => props.iter().for_each(|p| f(p)),
        Data::Prop { key, value, .. } => {
            if let Key::Computed(e) = key { f(e); }
            f(value);
        }
        Data::Field { key, value, .. } => {
            if let Key::Computed(e) = key { f(e); }
            if let Some(value) = value { f(value); }
        }
        Data::Class { extends, props, .. } => {
            if let Some(extends) = extends { f(extends); }
            props.iter().for_each(|p| f(p));
        }
        Data::If { cond, body, alt } => {
            f(cond); f(body);
            if let Some(alt) = alt { f(alt); }
        }
        Data::Cond { cond, cons, alt } => { f(cond); f(cons); f(alt); }
        Data::For { init, cond, step, body } => {
            if let Some(v) = init { f(v); }
            if let Some(v) = cond { f(v); }
            if let Some(v) = step { f(v); }
            f(body);
        }
        Data::While { cond, body } | Data::Do { body, cond } => { f(cond); f(body); }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => { f(init); f(object); f(body); }
        Data::Switch { expr, body } => { f(expr); body.iter().for_each(|s| f(s)); }
        Data::Case { expr, body } => { f(expr); body.iter().for_each(|s| f(s)); }
        Data::Block { body } | Data::Func { body, .. } | Data::StaticBlock { body } | Data::Default { body } => body.iter().for_each(|s| f(s)),
        Data::Try { body, catch, finally } => {
            f(body);
            if let Some(c) = catch { f(c); }
            if let Some(fnode) = finally { f(fnode); }
        }
        Data::Catch { arg, body } => {
            if let Some(arg) = arg { f(arg); }
            f(body);
        }
        Data::Labeled { body, .. } | Data::Finally { body } | Data::With { body, .. } => f(body),
        Data::Defs { defs, .. } => defs.iter().for_each(|d| f(d)),
        Data::VarDef { value, .. } => { if let Some(v) = value { f(v); } }
        Data::Destructuring { names, .. } => names.iter().for_each(|d| f(d)),
        Data::Sub { expr, prop, .. } => { f(expr); f(prop); }
        Data::Template { segments } => {
            for seg in segments {
                if let Seg::Expr(e) = seg { f(e); }
            }
        }
        Data::TaggedTemplate { tag, template } => { f(tag); f(template); }
        Data::Export { value, definition, .. } => {
            if let Some(v) = value { f(v); }
            if let Some(d) = definition { f(d); }
        }
        _ => {}
    }
}

fn mark_names(n: &N, table: &SymTable, u: &mut Use) {
    if let Some(id) = def_id(table, n) {
        u.in_use.insert(id);
    }
    descend(n, |c| mark_names(c, table, u));
}

fn mentions_arguments(stmts: &[N]) -> bool {
    fn rec(n: &N) -> bool {
        match &n.data {
            Data::Symbol { name, kind: SymKind::Ref, .. } if name == "arguments" => true,
            Data::Func { .. } => false,
            _ => {
                let mut hit = false;
                descend(n, |c| hit |= rec(c));
                hit
            }
        }
    }
    stmts.iter().any(rec)
}

fn contains_with(stmts: &[N]) -> bool {
    fn rec(n: &N) -> bool {
        match &n.data {
            Data::With { .. } => true,
            // A nested `with` sets `uses_with` on the enclosing scope, so `pinned()` is true.
            Data::Func { body, .. } => body.iter().any(rec),
            _ => {
                let mut hit = false;
                descend(n, |c| hit |= rec(c));
                hit
            }
        }
    }
    stmts.iter().any(rec)
}

fn has_side_effects(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::BigInt { .. } | Data::RegExp { .. } | Data::True | Data::False | Data::Null | Data::This | Data::Infinity => false,
        Data::Symbol { kind: SymKind::Ref, .. } => false,
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "!" | "~" | "+" | "-" | "void" | "typeof") => has_side_effects(expr),
        Data::Binary { left, right, .. } => has_side_effects(left) || has_side_effects(right),
        Data::Func { .. } | Data::Array { .. } | Data::Object { .. } => false,
        _ => true,
    }
}

fn def_id(table: &SymTable, n: &N) -> Option<usize> {
    table.lookup(&ptr(n))
}

fn is_ref(n: &N) -> bool {
    matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. })
}

fn num0(orig: &N) -> N {
    node(orig, Data::Number { value: 0.0, raw: "0".into() })
}

fn simple(orig: &N, body: N) -> N {
    node(orig, Data::Simple { body })
}

fn ptr(n: &N) -> usize {
    Rc::as_ptr(n) as usize
}

fn node(orig: &N, data: Data) -> N {
    Rc::new(Node { start: orig.start.clone(), end: orig.end.clone(), data })
}

fn map_scope(n: &N, data: &Data, table: &SymTable, drop_vars: bool, drop_funcs: bool) -> N {
    let go = |c: &N| scope(c, table, drop_vars, drop_funcs);
    let rebuilt = match data {
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::Return { value } => Data::Return { value: value.as_ref().map(go) },
        Data::Throw { value } => Data::Throw { value: go(value) },
        Data::If { cond, body, alt } => Data::If { cond: go(cond), body: go(body), alt: alt.as_ref().map(go) },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left), right: go(right) },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond), cons: go(cons), alt: go(alt) },
        Data::Call { expr, args, optional, is_new } => Data::Call { expr: go(expr), args: args.iter().map(go).collect(), optional: *optional, is_new: *is_new },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr), prefix: *prefix },
        Data::Seq { exprs } => Data::Seq { exprs: exprs.iter().map(go).collect() },
        Data::Class { stmt, name, extends, props } => {
            // drop-unused.js: an `AST_ClassExpression` name nothing reads is
            // removed (`keep_classnames` off).
            let name = match (stmt, name) {
                (false, Some(nm)) if def_id(table, nm).is_some_and(|id| {
                    !props.iter().chain(extends.iter()).any(|p| name_read(std::slice::from_ref(p), &[], table, id))
                }) => None,
                _ => name.clone(),
            };
            Data::Class { stmt: *stmt, name, extends: extends.as_ref().map(go), props: props.iter().map(go).collect() }
        }
        Data::Object { props } => Data::Object { props: props.iter().map(go).collect() },
        Data::Prop { method, key, value, static_, private, generator, async_ } => Data::Prop {
            method: *method,
            key: key.clone(),
            value: go(value),
            static_: *static_, private: *private, generator: *generator, async_: *async_,
        },
        // Every other node: descend so nested scopes and blocks are reached.
        _ => {
            let mut changed = false;
            let out = ast::map_children(n, &mut |c| {
                let m = go(c);
                if !Rc::ptr_eq(&m, c) {
                    changed = true;
                }
                m
            });
            return if changed { out } else { Rc::clone(n) };
        }
    };
    node(n, rebuilt)
}
