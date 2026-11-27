//! Port of terser `lib/compress/drop-unused.js`.
//!
//! `drop_unused` (`AST_Scope.drop_unused`) is three walks over one scope:
//! 1. `scan_ref_scoped` fills `in_use`. `assign_as_unused` is not a use.
//!    A definition's value is walked here only when it has side effects.
//!    `AST_Defun` / `AST_DefClass` are initializers, not walked until pass 2.
//! 2. Initializers of names that are in use are walked (`in_use_ids.forEach`).
//! 3. The `tt` transformer drops declarations that are not in use. A write-only
//!    `name = expr` becomes the rhs, or `0` when that value is discarded and pure.

use ast::{Data, DefKind, FuncKind, Key, N, Node, Seg, SymKind};
use crate::syms::{self, SymTable};
use crate::Cx;
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

/// `AST_Scope.drop_unused`.
pub fn drop_unused(root: &N, cx: &Cx) -> N {
    let table = syms::bind(root);
    scope(root, &table, cx, cx.opts.toplevel_vars, cx.opts.toplevel_funcs, false, false)
}

fn scope(n: &N, table: &SymTable, cx: &Cx, drop_vars: bool, drop_funcs: bool, strict: bool, iife: bool) -> N {
    match &n.data {
        Data::Toplevel { body } => {
            let strict = strict || has_strict(body);
            let body: Vec<N> = body.iter().map(|s| scope(s, table, cx, true, true, strict, false)).collect();
            let body = if pinned(&body) {
                body
            } else {
                let u = analyze(&body, &[], table, Some(0), drop_vars, drop_funcs, cx, strict);
                rewrite_list(&body, table, &u, Some(0), drop_vars, drop_funcs, cx)
            };
            node(cx, n, Data::Toplevel { body })
        }
        Data::Func { kind, name, args, body, async_, generator } => {
            let strict = strict || has_strict(body);
            let scope_id = table.node_scope.get(&ptr(n)).copied();
            let body: Vec<N> = body.iter().map(|s| scope(s, table, cx, true, true, strict, false)).collect();
            if pinned(&body) {
                return node(cx, n, Data::Func {
                    kind: *kind,
                    name: name.clone(),
                    args: args.clone(),
                    body,
                    async_: *async_,
                    generator: *generator,
                });
            }
            let u = analyze(&body, args, table, scope_id, true, true, cx, strict);
            let body = rewrite_list(&body, table, &u, scope_id, true, true, cx);
            let args = trim_args(args, &u, table, cx, iife, name.as_ref(), &body);
            let name = dropped_fname(*kind, name.as_ref(), &u, table, cx, scope_id);
            node(cx, n, Data::Func {
                kind: *kind,
                name,
                args,
                body,
                async_: *async_,
                generator: *generator,
            })
        }
        Data::StaticBlock { body } => {
            let scope_id = table.node_scope.get(&ptr(n)).copied();
            let body: Vec<N> = body.iter().map(|s| scope(s, table, cx, true, true, strict, false)).collect();
            let body = if pinned(&body) {
                body
            } else {
                let u = analyze(&body, &[], table, scope_id, true, true, cx, strict);
                rewrite_list(&body, table, &u, scope_id, true, true, cx)
            };
            node(cx, n, Data::StaticBlock { body })
        }
        Data::Block { body } => {
            let body: Vec<N> = body.iter().map(|s| scope(s, table, cx, drop_vars, drop_funcs, strict, false)).collect();
            let body = if let Some(scope_id) = table.node_scope.get(&ptr(n)).copied() {
                if pinned(&body) {
                    body
                } else {
                    let u = analyze(&body, &[], table, Some(scope_id), true, drop_funcs, cx, strict);
                    rewrite_list(&body, table, &u, Some(scope_id), true, drop_funcs, cx)
                }
            } else {
                body
            };
            node(cx, n, Data::Block { body })
        }
        Data::Catch { arg, body } => {
            let body = scope(body, table, cx, drop_vars, drop_funcs, strict, false);
            node(cx, n, Data::Catch { arg: arg.clone(), body })
        }
        other => map_scope(n, other, table, cx, drop_vars, drop_funcs, strict),
    }
}

struct Use {
    in_use: HashSet<usize>,
    /// def id → initializer nodes (`initializations`).
    inits: HashMap<usize, Vec<N>>,
    /// def id → declaration nodes still in `var_defs_by_id` (funargs and `var` defs).
    var_defs: HashMap<usize, Vec<usize>>,
}

/// Passes 1–2 of `AST_Scope.drop_unused`.
fn analyze(stmts: &[N], args: &[N], table: &SymTable, scope_id: Option<usize>, drop_vars: bool, drop_funcs: bool, cx: &Cx, strict: bool) -> Use {
    let mut u = Use { in_use: HashSet::new(), inits: HashMap::new(), var_defs: HashMap::new() };
    // `compressor.top_retain` on a toplevel scope.
    if scope_id == Some(0) && cx.opts.top_retain.active() {
        if let Some(ids) = table.scope_defs.get(&0) {
            for id in ids {
                if cx.opts.top_retain.hit(&table.defs[*id].name) {
                    u.in_use.insert(*id);
                }
            }
        }
    }
    for arg in args {
        note_funarg(arg, table, &mut u);
    }
    for stmt in stmts {
        scan_ref_scoped(stmt, table, &mut u, true, true, drop_vars, drop_funcs, cx);
    }
    // Pass 2. `Map.forEach` visits ids added while walking an initializer.
    let mut seen = HashSet::new();
    let mut queue: Vec<usize> = u.in_use.iter().copied().collect();
    while let Some(id) = queue.pop() {
        if !seen.insert(id) {
            continue;
        }
        let inits: Vec<N> = u.inits.get(&id).map(|v| v.clone()).unwrap_or_default();
        for init in &inits {
            scan_ref_scoped(init, table, &mut u, false, false, drop_vars, drop_funcs, cx);
        }
        for id in u.in_use.iter() {
            if !seen.contains(id) {
                queue.push(*id);
            }
        }
    }
    // A non-strict function that reads `arguments` uses every parameter.
    if !strict && mentions_arguments(stmts) {
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
    u
}

/// `scan_ref_scoped`. `record_inits` is pass 1. `in_root` is `scope === self`.
fn scan_ref_scoped(n: &N, table: &SymTable, u: &mut Use, record_inits: bool, in_root: bool, drop_vars: bool, drop_funcs: bool, cx: &Cx) {
    if let Some(id) = assign_as_unused(n, table, cx).and_then(|sym| def_id(table, sym)) {
        if record_inits && in_root {
            if let Data::Assign { right, .. } = &n.data {
                if !table.defs[id].undeclared {
                    if let Some(fixed) = table.defs[id].fixed.as_ref() {
                        if Rc::ptr_eq(fixed, right) {
                            // `fixed_ids` is the single write. Not applied: the fresh
                            // bind has no reduce-vars `fixed` pointer into this tree.
                            let _ = fixed;
                        }
                    }
                }
            }
        }
        if let Data::Assign { right, .. } = &n.data {
            scan_ref_scoped(right, table, u, record_inits, in_root, drop_vars, drop_funcs, cx);
        } else if let Data::Unary { expr, .. } = &n.data {
            let _ = expr;
        }
        return;
    }
    match &n.data {
        Data::Func { kind: FuncKind::Decl, name, .. } if record_inits => {
            // `AST_Defun`: record the function as an initializer and do not walk it yet.
            if let Some(name) = name {
                if let Some(id) = def_id(table, name) {
                    u.inits.entry(id).or_default().push(Rc::clone(n));
                    if table.defs[id].global && !drop_funcs && in_root {
                        u.in_use.insert(id);
                    }
                }
            }
            return;
        }
        Data::Class { stmt: true, name, .. } if record_inits => {
            // `AST_DefClass`.
            if let Some(name) = name {
                if let Some(id) = def_id(table, name) {
                    u.inits.entry(id).or_default().push(Rc::clone(n));
                    if table.defs[id].global && !drop_funcs && in_root {
                        u.in_use.insert(id);
                    }
                }
            }
            if class_has_effects(n) {
                if class_self_ref(n, table) {
                    descend(n, |c| scan_ref_scoped(c, table, u, record_inits, false, drop_vars, drop_funcs, cx));
                } else {
                    scan_class_now(n, table, u, record_inits, drop_vars, drop_funcs, cx);
                }
            }
            return;
        }
        Data::Defs { kind, defs, .. } if record_inits && in_root => {
            for def in defs {
                let Data::VarDef { name, value } = &def.data else { continue };
                if let Some(id) = def_id(table, name) {
                    if matches!(kind, DefKind::Var) {
                        u.var_defs.entry(id).or_default().push(ptr(def));
                    }
                    if !drop_vars && table.defs[id].global {
                        u.in_use.insert(id);
                    }
                    if let Some(value) = value {
                        u.inits.entry(id).or_default().push(Rc::clone(value));
                        if has_side_effects(value) {
                            scan_ref_scoped(value, table, u, record_inits, in_root, drop_vars, drop_funcs, cx);
                        }
                    }
                } else {
                    scan_ref_scoped(name, table, u, record_inits, in_root, drop_vars, drop_funcs, cx);
                    if let Some(value) = value {
                        scan_ref_scoped(value, table, u, record_inits, in_root, drop_vars, drop_funcs, cx);
                    }
                }
            }
        }
        Data::Simple { body } if write_only_update(body, table).is_some() => {
            // The update's value is discarded, so the variable is not read here.
        }
        Data::Symbol { kind: SymKind::Ref, .. } => {
            if let Some(&id) = table.node_def.get(&ptr(n)) {
                u.in_use.insert(id);
                // A catch binding also keeps the `var` of the same name in the function.
                if table.defs[id].block_scoped {
                    if let Some(ids) = table.scope_defs.get(&table.defs[id].fn_scope) {
                        for other in ids {
                            if *other != id && table.defs[*other].name == table.defs[id].name && !table.defs[*other].block_scoped {
                                u.in_use.insert(*other);
                            }
                        }
                    }
                }
            }
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            mark_names(init, table, u);
            scan_ref_scoped(object, table, u, record_inits, in_root, drop_vars, drop_funcs, cx);
            scan_ref_scoped(body, table, u, record_inits, in_root, drop_vars, drop_funcs, cx);
        }
        Data::Func { .. } => {
            // Function expression: walk it, but its declarations belong to its own scope.
            descend(n, |c| scan_ref_scoped(c, table, u, record_inits, false, drop_vars, drop_funcs, cx));
        }
        _ => descend(n, |c| scan_ref_scoped(c, table, u, record_inits, in_root, drop_vars, drop_funcs, cx)),
    }
}

fn note_funarg(n: &N, table: &SymTable, u: &mut Use) {
    match &n.data {
        Data::Symbol { kind: SymKind::Funarg, .. } => {
            if let Some(id) = def_id(table, n) {
                u.var_defs.entry(id).or_default().push(ptr(n));
            }
        }
        Data::DefaultAssign { left, .. } | Data::Spread { expr: left } => note_funarg(left, table, u),
        Data::Destructuring { names, .. } => names.iter().for_each(|d| note_funarg(d, table, u)),
        _ => {}
    }
}

/// `assign_as_unused`. `keep_assign` makes this a no-op.
/// Only `=` ignores the variable as a read. `++`/`--` are write-only when the
/// update's value is discarded (`WRITE_ONLY`); a `return n++` still reads `n`.
fn assign_as_unused<'a>(n: &'a N, table: &SymTable, cx: &Cx) -> Option<&'a N> {
    if cx.opts.keep_assign {
        return None;
    }
    match &n.data {
        Data::Assign { op, left, logical, .. } if !*logical && op == "=" && is_var_write(left, table) => Some(left),
        _ => None,
    }
}

fn write_only_update<'a>(n: &'a N, table: &SymTable) -> Option<&'a N> {
    match &n.data {
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "++" | "--") && is_var_write(expr, table) => Some(expr),
        _ => None,
    }
}

fn is_var_write(n: &N, table: &SymTable) -> bool {
    let Some(id) = def_id(table, n) else { return false };
    let def = &table.defs[id];
    !def.block_scoped && !def.undeclared && is_ref(n)
}

fn owned(table: &SymTable, n: &N, scope_id: Option<usize>) -> Option<usize> {
    let id = def_id(table, n)?;
    if scope_id.is_some_and(|s| table.defs[id].scope != s) {
        return None;
    }
    Some(id)
}

/// Pass 3, the `tt` transformer, over a statement list.
fn rewrite_list(stmts: &[N], table: &SymTable, u: &Use, scope_id: Option<usize>, drop_vars: bool, drop_funcs: bool, cx: &Cx) -> Vec<N> {
    let mut eliminated: HashMap<usize, u32> = HashMap::new();
    let mut left: HashMap<usize, usize> = u.var_defs.iter().map(|(id, defs)| (*id, defs.len())).collect();
    let mut out = Vec::new();
    for stmt in stmts {
        rewrite_stmt(stmt, table, u, scope_id, drop_vars, drop_funcs, cx, &mut eliminated, &mut left, false, &mut out);
    }
    out
}

fn rewrite_stmt(
    n: &N,
    table: &SymTable,
    u: &Use,
    scope_id: Option<usize>,
    drop_vars: bool,
    drop_funcs: bool,
    cx: &Cx,
    eliminated: &mut HashMap<usize, u32>,
    left: &mut HashMap<usize, usize>,
    in_catch: bool,
    out: &mut Vec<N>,
) {
    if let Data::Defs { kind, defs, await_ } = &n.data {
        if matches!(kind, DefKind::Using) {
            out.push(Rc::clone(n));
            return;
        }
        let mut head = Vec::new();
        let mut tail = Vec::new();
        let mut side: Vec<N> = Vec::new();
        for def in defs {
            let Data::VarDef { name, value } = &def.data else {
                tail.push(Rc::clone(def));
                continue;
            };
            let value = value.as_ref().and_then(|v| rewrite_expr(v, table, u, scope_id, drop_vars, drop_funcs, cx, false, false));
            let id = owned(table, name, scope_id);
            let drop_block = !matches!(kind, DefKind::Var);
            let destructure = matches!(name.data, Data::Destructuring { .. });
            let keep_destructure = destructure && match &name.data {
                Data::Destructuring { array, names } => !names.is_empty() || *array || !matches!(cx.opts.pure_getters, crate::PureGetters::On),
                _ => true,
            };
            let in_use = id.is_some_and(|id| u.in_use.contains(&id));
            let can_drop = (drop_vars || drop_block) && !keep_destructure && !in_use;
            if id.is_some() && matches!(kind, DefKind::Var) && !in_catch && can_drop_duplicate(id, value.as_ref(), name, table, eliminated, left) {
                if let (Some(id), Some(value)) = (id, value.clone()) {
                    side.push(assign_stmt(cx, name, value));
                    *eliminated.entry(id).or_default() += 1;
                    if let Some(count) = left.get_mut(&id) {
                        *count = count.saturating_sub(1);
                    }
                } else if let Some(id) = id {
                    *eliminated.entry(id).or_default() += 1;
                    if let Some(count) = left.get_mut(&id) {
                        *count = count.saturating_sub(1);
                    }
                }
                continue;
            }
            if can_drop && id.is_some() {
                if let Some(value) = value.clone() {
                    if has_side_effects(&value) {
                        side.push(value);
                    }
                }
                continue;
            }
            let mut value = value;
            if let Some(ref mut value) = value {
                if !side.is_empty() {
                    if !tail.is_empty() {
                        let mut exprs = std::mem::take(&mut side);
                        exprs.push(Rc::clone(value));
                        *value = seq_node(cx, value, exprs);
                    } else {
                        out.push(simple(cx, n, seq_node(cx, n, std::mem::take(&mut side))));
                    }
                }
            }
            let def = node(cx, def, Data::VarDef { name: Rc::clone(name), value: value.clone() });
            if value.is_some() {
                tail.push(def);
            } else {
                head.push(def);
            }
        }
        head.append(&mut tail);
        if !head.is_empty() {
            out.push(node(cx, n, Data::Defs { kind: *kind, defs: head, await_: *await_ }));
        }
        if !side.is_empty() {
            out.push(simple(cx, n, seq_node(cx, n, side)));
        }
        return;
    }
    if let Data::Class { stmt: true, name, .. } = &n.data {
        if let Some(id) = name.as_ref().and_then(|name| owned(table, name, scope_id)) {
            let keep = table.defs[id].global && !drop_funcs || u.in_use.contains(&id);
            if !keep {
                if let Some(stmt) = class_as_effects(cx, n, table) {
                    out.push(stmt);
                }
                return;
            }
        }
    }
    if drop_funcs {
        if let Data::Func { kind: FuncKind::Decl, name: Some(name), .. } = &n.data {
            if owned(table, name, scope_id).is_some_and(|id| !u.in_use.contains(&id)) {
                return;
            }
        }
    }
    if let Some(stmt) = rewrite_expr(n, table, u, scope_id, drop_vars, drop_funcs, cx, true, false) {
        out.push(stmt);
    }
}

fn can_drop_duplicate(id: Option<usize>, value: Option<&N>, name: &N, table: &SymTable, eliminated: &HashMap<usize, u32>, left: &HashMap<usize, usize>) -> bool {
    let Some(id) = id else { return false };
    if !matches!(name.data, Data::Symbol { kind: SymKind::Var, .. }) {
        return false;
    }
    let count = left.get(&id).copied().unwrap_or(0);
    if count <= 1 {
        return false;
    }
    let index = table.defs[id].origins.iter().position(|p| *p == ptr(name)).unwrap_or(0) as u32;
    let elim = eliminated.get(&id).copied().unwrap_or(0);
    value.is_none() || index > elim
}

/// `tt` for one node. `discarded` is `!is_used_in_expression`. `in_list` is a
/// sequence element or a statement-list splice (`MAP.skip`).
fn rewrite_expr(
    n: &N,
    table: &SymTable,
    u: &Use,
    scope_id: Option<usize>,
    drop_vars: bool,
    drop_funcs: bool,
    cx: &Cx,
    discarded: bool,
    in_list: bool,
) -> Option<N> {
            if drop_vars {
        if let Some(sym) = assign_as_unused(n, table, cx).or_else(|| discarded.then(|| write_only_update(n, table)).flatten()) {
            if let Some(id) = owned(table, sym, scope_id) {
                if !u.in_use.contains(&id) {
                    let rhs = match &n.data {
                        Data::Assign { right, .. } => rewrite_expr(right, table, u, scope_id, drop_vars, drop_funcs, cx, false, false)?,
                        Data::Unary { .. } => num0(cx, n),
                        _ => Rc::clone(n),
                    };
                    if !has_side_effects(&rhs) && discarded {
                        return if in_list { None } else { Some(num0(cx, n)) };
                    }
                    return Some(rhs);
                }
            }
        }
    }
    let go = |c: &N, discarded: bool, in_list: bool| {
        rewrite_expr(c, table, u, scope_id, drop_vars, drop_funcs, cx, discarded, in_list).unwrap_or_else(|| num0(cx, c))
    };
    let data = match &n.data {
        Data::Simple { body } => {
            let body = rewrite_expr(body, table, u, scope_id, drop_vars, drop_funcs, cx, true, false)?;
            Data::Simple { body }
        }
        Data::Return { value } => Data::Return { value: value.as_ref().and_then(|v| rewrite_expr(v, table, u, scope_id, drop_vars, drop_funcs, cx, false, false)) },
        Data::Throw { value } => Data::Throw { value: go(value, false, false) },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr, false, false), prefix: *prefix },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left, false, false), right: go(right, false, false) },
        Data::Assign { op, left, right, logical } => Data::Assign { op: op.clone(), left: Rc::clone(left), right: go(right, false, false), logical: *logical },
        Data::Seq { exprs } => {
            let last = exprs.len().saturating_sub(1);
            let exprs: Vec<N> = exprs.iter().enumerate().filter_map(|(i, e)| rewrite_expr(e, table, u, scope_id, drop_vars, drop_funcs, cx, i != last, i != last)).collect();
            if exprs.is_empty() {
                return if in_list { None } else { Some(num0(cx, n)) };
            }
            if exprs.len() == 1 {
                return Some(exprs.into_iter().next().unwrap());
            }
            Data::Seq { exprs }
        }
        Data::Call { expr, args, optional, is_new } => Data::Call {
            expr: go(expr, false, false),
            args: args.iter().map(|a| go(a, false, false)).collect(),
            optional: *optional,
            is_new: *is_new,
        },
        Data::Dot { expr, prop, optional, quote, private } => Data::Dot {
            expr: go(expr, false, false), prop: prop.clone(), optional: *optional, quote: *quote, private: *private,
        },
        Data::Sub { expr, prop, optional } => Data::Sub { expr: go(expr, false, false), prop: go(prop, false, false), optional: *optional },
        Data::Object { props } => Data::Object { props: props.iter().map(|p| go(p, false, false)).collect() },
        Data::Prop { method, key, value, static_, private, generator, async_ } => Data::Prop {
            method: *method,
            key: match key {
                Key::Computed(e) => Key::Computed(go(e, false, false)),
                other => other.clone(),
            },
            value: go(value, false, false),
            static_: *static_,
            private: *private,
            generator: *generator,
            async_: *async_,
        },
        Data::Field { key, value, static_, private } => Data::Field {
            key: match key {
                Key::Computed(e) => Key::Computed(go(e, false, false)),
                other => other.clone(),
            },
            value: value.as_ref().map(|v| go(v, false, false)),
            static_: *static_,
            private: *private,
        },
        Data::Array { elements } => Data::Array { elements: elements.iter().map(|e| go(e, false, false)).collect() },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond, false, false), cons: go(cons, false, false), alt: go(alt, false, false) },
        Data::If { cond, body, alt } => Data::If { cond: go(cond, false, false), body: go(body, true, false), alt: alt.as_ref().map(|a| go(a, true, false)) },
        Data::For { init, cond, step, body } => Data::For {
            init: init.as_ref().and_then(|v| rewrite_expr(v, table, u, scope_id, drop_vars, drop_funcs, cx, true, false)),
            cond: cond.as_ref().map(|v| go(v, false, false)),
            step: step.as_ref().map(|v| go(v, true, false)),
            body: go(body, true, false),
        },
        Data::While { cond, body } => Data::While { cond: go(cond, false, false), body: go(body, true, false) },
        Data::Do { body, cond } => Data::Do { body: go(body, true, false), cond: go(cond, false, false) },
        Data::ForIn { init, object, body } => Data::ForIn { init: go(init, false, false), object: go(object, false, false), body: go(body, true, false) },
        Data::ForOf { init, object, body, await_ } => Data::ForOf { init: go(init, false, false), object: go(object, false, false), body: go(body, true, false), await_: *await_ },
        Data::Switch { expr, body } => Data::Switch { expr: go(expr, false, false), body: body.iter().map(|s| go(s, true, false)).collect() },
        Data::Case { expr, body } => Data::Case { expr: go(expr, false, false), body: rewrite_nested(body, table, u, scope_id, drop_vars, drop_funcs, cx) },
        Data::Default { body } => Data::Default { body: rewrite_nested(body, table, u, scope_id, drop_vars, drop_funcs, cx) },
        Data::Try { body, catch, finally } => Data::Try {
            body: go(body, true, false),
            catch: catch.as_ref().map(|c| go(c, true, false)),
            finally: finally.as_ref().map(|c| go(c, true, false)),
        },
        Data::Catch { arg, body } => {
            let mut eliminated = HashMap::new();
            let mut left: HashMap<usize, usize> = u.var_defs.iter().map(|(id, defs)| (*id, defs.len())).collect();
            let mut stmts = Vec::new();
            let body_stmts = match &body.data {
                Data::Block { body } => body.clone(),
                _ => vec![Rc::clone(body)],
            };
            for stmt in &body_stmts {
                rewrite_stmt(stmt, table, u, scope_id, drop_vars, drop_funcs, cx, &mut eliminated, &mut left, true, &mut stmts);
            }
            let body = match &body.data {
                Data::Block { .. } => node(cx, body, Data::Block { body: stmts }),
                _ => stmts.into_iter().next().unwrap_or_else(|| Rc::clone(body)),
            };
            Data::Catch { arg: arg.clone(), body }
        }
        Data::Finally { body } => Data::Finally { body: go(body, true, false) },
        Data::Labeled { label, body } => Data::Labeled { label: Rc::clone(label), body: go(body, true, false) },
        Data::With { expr, body } => Data::With { expr: go(expr, false, false), body: go(body, true, false) },
        Data::Block { body } => Data::Block { body: rewrite_nested(body, table, u, scope_id, drop_vars, drop_funcs, cx) },
        Data::Func { kind, name, args, body, async_, generator } => {
            let name = if *kind == FuncKind::Expr {
                dropped_fname(*kind, name.as_ref(), u, table, cx, table.node_scope.get(&ptr(n)).copied())
            } else {
                name.clone()
            };
            let body = body.iter().map(|s| go(s, true, false)).collect();
            Data::Func { kind: *kind, name, args: args.clone(), body, async_: *async_, generator: *generator }
        }
        Data::Class { stmt, name, extends, props } => {
            let name = if *stmt { name.clone() } else { dropped_cname(name.as_ref(), u, table, cx) };
            Data::Class {
                stmt: *stmt,
                name,
                extends: extends.as_ref().map(|e| go(e, false, false)),
                props: props.iter().map(|p| go(p, false, false)).collect(),
            }
        }
        Data::Template { segments } => Data::Template {
            segments: segments.iter().map(|seg| match seg {
                Seg::Expr(e) => Seg::Expr(go(e, false, false)),
                other => other.clone(),
            }).collect(),
        },
        Data::TaggedTemplate { tag, template } => Data::TaggedTemplate { tag: go(tag, false, false), template: go(template, false, false) },
        Data::Export { is_default, names, value, definition, module_name, attributes } => Data::Export {
            is_default: *is_default,
            names: names.clone(),
            value: value.as_ref().map(|v| go(v, false, false)),
            definition: definition.as_ref().map(|v| go(v, false, false)),
            module_name: module_name.clone(),
            attributes: attributes.clone(),
        },
        _ => return Some(Rc::clone(n)),
    };
    Some(node(cx, n, data))
}

fn rewrite_nested(body: &[N], table: &SymTable, u: &Use, scope_id: Option<usize>, drop_vars: bool, drop_funcs: bool, cx: &Cx) -> Vec<N> {
    let mut eliminated = HashMap::new();
    let mut left: HashMap<usize, usize> = u.var_defs.iter().map(|(id, defs)| (*id, defs.len())).collect();
    let mut out = Vec::new();
    for stmt in body {
        rewrite_stmt(stmt, table, u, scope_id, drop_vars, drop_funcs, cx, &mut eliminated, &mut left, false, &mut out);
    }
    out
}

/// `keep_fargs` and the IIFE trim in `tt` (`AST_Lambda` argnames).
fn trim_args(args: &[N], u: &Use, table: &SymTable, cx: &Cx, iife: bool, name: Option<&N>, body: &[N]) -> Vec<N> {
    let name_used = name.and_then(|n| def_id(table, n)).is_some_and(|id| u.in_use.contains(&id));
    let trim = !cx.opts.keep_fargs || (iife && !pinned(body) && !name_used);
    if !trim {
        return args.to_vec();
    }
    let mut out = args.to_vec();
    while let Some(last) = out.last() {
        if matches!(binding_sym(last).map(|n| &n.data), Some(Data::Destructuring { .. })) || matches!(last.data, Data::Destructuring { .. }) {
            break;
        }
        let Some(sym) = binding_sym(last) else { break };
        let Some(id) = def_id(table, sym) else { break };
        if u.in_use.contains(&id) {
            break;
        }
        out.pop();
    }
    out
}

fn binding_sym(n: &N) -> Option<&N> {
    match &n.data {
        Data::Spread { expr } | Data::DefaultAssign { left: expr, .. } => binding_sym(expr),
        Data::Symbol { .. } => Some(n),
        _ => None,
    }
}

/// `keep_name(keep_fnames)` for a function expression.
fn dropped_fname(kind: FuncKind, name: Option<&N>, u: &Use, table: &SymTable, cx: &Cx, scope_id: Option<usize>) -> Option<N> {
    let name = name?;
    if kind != FuncKind::Expr {
        return Some(Rc::clone(name));
    }
    let text = sym_text(name).unwrap_or("");
    if cx.opts.keep_fnames.keeps(text) {
        return Some(Rc::clone(name));
    }
    // The binding is recorded on the function scope. The name symbol itself is
    // not always in `node_def` (`syms.rs` defines it from the function node).
    let id = def_id(table, name).or_else(|| {
        let scope_id = scope_id?;
        table.scope_defs.get(&scope_id)?.iter().copied().find(|id| table.defs[*id].name == text && table.defs[*id].is_defun)
    });
    let Some(id) = id else { return Some(Rc::clone(name)) };
    if !u.in_use.contains(&id) || table.defs[id].origins.len() > 1 {
        None
    } else {
        Some(Rc::clone(name))
    }
}

/// `keep_name(keep_classnames)` for a class expression.
fn dropped_cname(name: Option<&N>, u: &Use, table: &SymTable, cx: &Cx) -> Option<N> {
    let name = name?;
    let text = sym_text(name).unwrap_or("");
    if cx.opts.keep_classnames.keeps(text) {
        return Some(Rc::clone(name));
    }
    let Some(id) = def_id(table, name) else { return Some(Rc::clone(name)) };
    if !u.in_use.contains(&id) || table.defs[id].origins.len() > 1 {
        None
    } else {
        Some(Rc::clone(name))
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

/// `AST_Scope.pinned`: direct `eval` (`scope.js` pass 2) or `with`.
fn pinned(stmts: &[N]) -> bool {
    fn rec(n: &N) -> bool {
        if is_direct_eval(n) || matches!(n.data, Data::With { .. }) {
            return true;
        }
        let mut hit = false;
        descend(n, |c| hit |= rec(c));
        hit
    }
    stmts.iter().any(rec)
}

/// A call whose callee is the identifier `eval`. terser sets `uses_eval` for that shape.
fn is_direct_eval(n: &N) -> bool {
    let Data::Call { expr, is_new: false, .. } = &n.data else { return false };
    matches!(&expr.data, Data::Symbol { name, kind: SymKind::Ref, .. } if name == "eval")
}

fn has_strict(stmts: &[N]) -> bool {
    stmts.iter().any(|s| matches!(&s.data, Data::Directive { value, .. } if value == "use strict"))
}

fn has_side_effects(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null | Data::This | Data::Hole => false,
        Data::Symbol { kind: SymKind::Ref, .. } => false,
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "!" | "~" | "+" | "-" | "void" | "typeof") => has_side_effects(expr),
        Data::Binary { left, right, op } if !op.ends_with('=') => has_side_effects(left) || has_side_effects(right),
        Data::Func { .. } => false,
        Data::Array { elements } => elements.iter().any(has_side_effects),
        Data::Object { props } => props.iter().any(has_side_effects),
        Data::Prop { key, value, .. } => {
            matches!(key, Key::Computed(e) if has_side_effects(e)) || has_side_effects(value)
        }
        Data::Seq { exprs } => exprs.iter().any(has_side_effects),
        Data::Class { .. } => class_has_effects(n),
        _ => true,
    }
}

fn class_has_effects(n: &N) -> bool {
    let Data::Class { extends, props, .. } = &n.data else { return false };
    if extends.as_ref().is_some_and(has_side_effects) {
        return true;
    }
    props.iter().any(|p| match &p.data {
        Data::StaticBlock { body } => body.iter().any(has_side_effects),
        Data::Field { key, value, static_, .. } => {
            matches!(key, Key::Computed(e) if has_side_effects(e)) || *static_ && value.as_ref().is_some_and(has_side_effects)
        }
        Data::Prop { key, .. } => matches!(key, Key::Computed(e) if has_side_effects(e)),
        _ => false,
    })
}

fn class_self_ref(n: &N, table: &SymTable) -> bool {
    let Data::Class { name, extends, props, .. } = &n.data else { return false };
    let id = name.as_ref().and_then(|name| def_id(table, name));
    fn hit(n: &N, table: &SymTable, id: Option<usize>, in_fn: bool) -> bool {
        if !in_fn && matches!(n.data, Data::This) {
            return true;
        }
        if matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. }) && def_id(table, n) == id && id.is_some() {
            return true;
        }
        let enter = matches!(n.data, Data::Func { kind: FuncKind::Expr | FuncKind::Decl, .. });
        let mut found = false;
        descend(n, |c| found |= hit(c, table, id, in_fn || enter));
        found
    }
    if extends.as_ref().is_some_and(|e| hit(e, table, id, false)) {
        return true;
    }
    props.iter().any(|p| match &p.data {
        Data::StaticBlock { body } => body.iter().any(|s| hit(s, table, id, false)),
        Data::Field { key, value, static_, .. } => {
            matches!(key, Key::Computed(e) if hit(e, table, id, false))
                || *static_ && value.as_ref().is_some_and(|v| hit(v, table, id, false))
        }
        Data::Prop { key, .. } => matches!(key, Key::Computed(e) if hit(e, table, id, false)),
        _ => false,
    })
}

fn scan_class_now(n: &N, table: &SymTable, u: &mut Use, record_inits: bool, drop_vars: bool, drop_funcs: bool, cx: &Cx) {
    let Data::Class { extends, props, .. } = &n.data else { return };
    if let Some(extends) = extends {
        scan_ref_scoped(extends, table, u, record_inits, false, drop_vars, drop_funcs, cx);
    }
    for prop in props {
        match &prop.data {
            Data::StaticBlock { body } => {
                for stmt in body {
                    scan_ref_scoped(stmt, table, u, record_inits, false, drop_vars, drop_funcs, cx);
                }
            }
            Data::Field { key, value, static_, .. } => {
                if let Key::Computed(e) = key {
                    scan_ref_scoped(e, table, u, record_inits, false, drop_vars, drop_funcs, cx);
                }
                if *static_ {
                    if let Some(value) = value {
                        scan_ref_scoped(value, table, u, record_inits, false, drop_vars, drop_funcs, cx);
                    }
                }
            }
            Data::Prop { key, .. } => {
                if let Key::Computed(e) = key {
                    scan_ref_scoped(e, table, u, record_inits, false, drop_vars, drop_funcs, cx);
                }
            }
            _ => {}
        }
    }
}

/// `drop_side_effect_free(AST_Class)` for an unused class declaration.
fn class_as_effects(cx: &Cx, n: &N, table: &SymTable) -> Option<N> {
    if class_self_ref(n, table) && class_has_effects(n) {
        return Some(Rc::clone(n));
    }
    let Data::Class { extends, props, .. } = &n.data else { return None };
    let mut effects = Vec::new();
    if let Some(extends) = extends {
        if has_side_effects(extends) {
            effects.push(Rc::clone(extends));
        }
    }
    for prop in props {
        match &prop.data {
            Data::StaticBlock { body } if body.iter().any(has_side_effects) => return Some(Rc::clone(n)),
            Data::Field { key, value, static_, .. } => {
                if let Key::Computed(e) = key {
                    if has_side_effects(e) {
                        effects.push(Rc::clone(e));
                    }
                }
                if *static_ {
                    if let Some(value) = value {
                        if has_side_effects(value) {
                            effects.push(Rc::clone(value));
                        }
                    }
                }
            }
            Data::Prop { key, .. } => {
                if let Key::Computed(e) = key {
                    if has_side_effects(e) {
                        effects.push(Rc::clone(e));
                    }
                }
            }
            _ => {}
        }
    }
    if effects.is_empty() {
        None
    } else {
        Some(simple(cx, n, seq_node(cx, n, effects)))
    }
}

fn def_id(table: &SymTable, n: &N) -> Option<usize> {
    table.node_def.get(&ptr(n)).copied()
}

fn is_ref(n: &N) -> bool {
    matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. })
}

fn sym_text(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name.as_str()),
        _ => None,
    }
}

fn num0(cx: &Cx, orig: &N) -> N {
    node(cx, orig, Data::Number { value: 0.0, raw: "0".into() })
}

fn simple(cx: &Cx, orig: &N, body: N) -> N {
    node(cx, orig, Data::Simple { body })
}

fn assign_stmt(cx: &Cx, name: &N, value: N) -> N {
    let assign = node(cx, name, Data::Assign { op: "=".into(), left: Rc::clone(name), right: value, logical: false });
    simple(cx, name, assign)
}

fn seq_node(cx: &Cx, orig: &N, exprs: Vec<N>) -> N {
    if exprs.len() == 1 {
        exprs.into_iter().next().unwrap()
    } else {
        node(cx, orig, Data::Seq { exprs })
    }
}

fn ptr(n: &N) -> usize {
    Rc::as_ptr(n) as usize
}

fn node(cx: &Cx, orig: &N, data: Data) -> N {
    // A nested function terser already squeezed stays squeezed when an outer
    // `drop_unused` rewrites an assignment inside it, so `function(){0}` is kept.
    let scope_node = matches!(data, Data::Func { .. } | Data::Class { .. } | Data::StaticBlock { .. } | Data::Toplevel { .. });
    let n = Rc::new(Node { start: orig.start.clone(), end: orig.end.clone(), data });
    if scope_node && cx.squeezed.borrow().contains(&ptr(orig)) {
        cx.squeezed.borrow_mut().insert(ptr(&n));
    }
    n
}

fn map_scope(n: &N, data: &Data, table: &SymTable, cx: &Cx, drop_vars: bool, drop_funcs: bool, strict: bool) -> N {
    let go = |c: &N| scope(c, table, cx, drop_vars, drop_funcs, strict, false);
    let iife = |c: &N| {
        let direct = matches!(c.data, Data::Func { kind: FuncKind::Expr | FuncKind::Arrow, .. });
        scope(c, table, cx, drop_vars, drop_funcs, strict, direct)
    };
    let rebuilt = match data {
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::Return { value } => Data::Return { value: value.as_ref().map(go) },
        Data::Throw { value } => Data::Throw { value: go(value) },
        Data::If { cond, body, alt } => Data::If { cond: go(cond), body: go(body), alt: alt.as_ref().map(go) },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left), right: go(right) },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond), cons: go(cons), alt: go(alt) },
        Data::Call { expr, args, optional, is_new } => Data::Call {
            expr: iife(expr),
            args: args.iter().map(go).collect(),
            optional: *optional,
            is_new: *is_new,
        },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr), prefix: *prefix },
        Data::Seq { exprs } => Data::Seq { exprs: exprs.iter().map(go).collect() },
        Data::Assign { op, left, right, logical } => Data::Assign { op: op.clone(), left: go(left), right: go(right), logical: *logical },
        Data::For { init, cond, step, body } => Data::For {
            init: init.as_ref().map(go),
            cond: cond.as_ref().map(go),
            step: step.as_ref().map(go),
            body: go(body),
        },
        Data::While { cond, body } => Data::While { cond: go(cond), body: go(body) },
        Data::Do { body, cond } => Data::Do { body: go(body), cond: go(cond) },
        Data::ForIn { init, object, body } => Data::ForIn { init: go(init), object: go(object), body: go(body) },
        Data::ForOf { init, object, body, await_ } => Data::ForOf { init: go(init), object: go(object), body: go(body), await_: *await_ },
        Data::Switch { expr, body } => Data::Switch { expr: go(expr), body: body.iter().map(go).collect() },
        Data::Case { expr, body } => Data::Case { expr: go(expr), body: body.iter().map(go).collect() },
        Data::Default { body } => Data::Default { body: body.iter().map(go).collect() },
        Data::Try { body, catch, finally } => Data::Try { body: go(body), catch: catch.as_ref().map(go), finally: finally.as_ref().map(go) },
        Data::Finally { body } => Data::Finally { body: go(body) },
        Data::Labeled { label, body } => Data::Labeled { label: Rc::clone(label), body: go(body) },
        Data::With { expr, body } => Data::With { expr: go(expr), body: go(body) },
        Data::Class { stmt, name, extends, props } => Data::Class {
            stmt: *stmt, name: name.clone(), extends: extends.as_ref().map(go), props: props.iter().map(go).collect(),
        },
        Data::Object { props } => Data::Object { props: props.iter().map(go).collect() },
        Data::Prop { method, key, value, static_, private, generator, async_ } => Data::Prop {
            method: *method,
            key: key.clone(),
            value: go(value),
            static_: *static_, private: *private, generator: *generator, async_: *async_,
        },
        Data::Array { elements } => Data::Array { elements: elements.iter().map(go).collect() },
        Data::Export { is_default, names, value, definition, module_name, attributes } => Data::Export {
            is_default: *is_default,
            names: names.clone(),
            value: value.as_ref().map(go),
            definition: definition.as_ref().map(go),
            module_name: module_name.clone(),
            attributes: attributes.clone(),
        },
        _ => return Rc::clone(n),
    };
    node(cx, n, rebuilt)
}
