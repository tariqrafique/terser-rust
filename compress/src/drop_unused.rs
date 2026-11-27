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
    scope(root, &table, toplevel_vars, toplevel_funcs)
}

fn scope(n: &N, table: &SymTable, drop_vars: bool, drop_funcs: bool) -> N {
    match &n.data {
        Data::Toplevel { body } => {
            let body: Vec<N> = body.iter().map(|s| scope(s, table, true, true)).collect();
            node(n, Data::Toplevel { body: passes(&body, table, table.node_scope.get(&ptr(n)).copied(), drop_vars, drop_funcs) })
        }
        Data::Func { kind, name, args, body, async_, generator } => {
            let body: Vec<N> = body.iter().map(|s| scope(s, table, true, true)).collect();
            node(n, Data::Func {
                kind: *kind,
                name: name.clone(),
                args: args.clone(),
                body: passes(&body, table, table.node_scope.get(&ptr(n)).copied(), true, true),
                async_: *async_,
                generator: *generator,
            })
        }
        Data::Block { body } => {
            let body: Vec<N> = body.iter().map(|s| scope(s, table, drop_vars, drop_funcs)).collect();
            let body = if let Some(&id) = table.node_scope.get(&ptr(n)) {
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
}

/// Passes 1–3 of `AST_Scope.drop_unused`.
fn passes(stmts: &[N], table: &SymTable, scope_id: Option<usize>, drop_vars: bool, drop_funcs: bool) -> Vec<N> {
    // `self.pinned()`: `with` keeps every name.
    if contains_with(stmts) {
        return stmts.to_vec();
    }
    let mut u = Use { in_use: HashSet::new(), inits: HashMap::new(), fixed: HashSet::new(), wrote: HashSet::new() };
    for stmt in stmts {
        scan_ref_scoped(stmt, table, &mut u, true);
    }
    // Pass 2: walk initializers of names that are in use.
    let inits: Vec<(usize, N)> = u.inits.iter().flat_map(|(id, vs)| vs.iter().map(|v| (*id, Rc::clone(v)))).collect();
    for (id, init) in &inits {
        if u.in_use.contains(id) {
            scan_ref_scoped(init, table, &mut u, false);
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
    if let Some(id) = assign_as_unused(n).and_then(|sym| def_id(table, sym)) {
        u.wrote.insert(id);
        u.fixed.remove(&id);
        if let Data::Assign { right, .. } = &n.data {
            scan_ref_scoped(right, table, u, record_inits);
        }
        return;
    }
    match &n.data {
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
            if let Some(&id) = table.node_def.get(&ptr(n)) {
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

/// `assign_as_unused`: `=` of a symbol, not a logical assignment.
fn assign_as_unused(n: &N) -> Option<&N> {
    match &n.data {
        Data::Assign { op, left, logical, .. } if !*logical && op == "=" && is_ref(left) => Some(left),
        Data::Simple { body } => assign_as_unused(body),
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
        let mut kept = Vec::new();
        for def in defs {
            let Data::VarDef { name, value } = &def.data else {
                kept.push(Rc::clone(def));
                continue;
            };
            let id = owned(table, name, scope_id);
            let unused = drop_vars && id.is_some_and(|id| !u.in_use.contains(&id));
            if !unused {
                kept.push(Rc::clone(def));
                continue;
            }
            if let Some(value) = value {
                if has_side_effects(value) {
                    out.push(simple(n, Rc::clone(value)));
                }
            }
        }
        if !kept.is_empty() {
            out.push(node(n, Data::Defs { kind: *kind, defs: kept, await_: *await_ }));
        }
        return;
    }
    if drop_funcs {
        if let Data::Func { name: Some(name), .. } = &n.data {
            if owned(table, name, scope_id).is_some_and(|id| !u.in_use.contains(&id)) {
                return;
            }
        }
    }
    if let Some(stmt) = rewrite_expr(n, table, u, scope_id, drop_vars, true) {
        out.push(stmt);
    }
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
            let exprs: Vec<N> = exprs.iter().enumerate().filter_map(|(i, e)| rewrite_expr(e, table, u, scope_id, drop_vars, i != last)).collect();
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
        Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null | Data::This => false,
        Data::Symbol { kind: SymKind::Ref, .. } => false,
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "!" | "~" | "+" | "-" | "void" | "typeof") => has_side_effects(expr),
        Data::Binary { left, right, op } if !op.ends_with('=') => has_side_effects(left) || has_side_effects(right),
        Data::Func { .. } | Data::Array { .. } | Data::Object { .. } => false,
        _ => true,
    }
}

fn def_id(table: &SymTable, n: &N) -> Option<usize> {
    table.node_def.get(&ptr(n)).copied()
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
        _ => return Rc::clone(n),
    };
    node(n, rebuilt)
}
