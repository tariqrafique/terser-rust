//! Port of terser `lib/compress/drop-unused.js` `AST_Scope.drop_unused`.
//!
//! Three passes, matching that function:
//! 1. `scan_ref_scoped` records names that are read. `assign_as_unused`
//!    (`=` with a symbol on the left, or a write-only update) is not a read.
//! 2. Values of names that are read are not dropped.
//! 3. An unread declaration with a pure initializer is removed. A write-only
//!    `name = expr` becomes `expr`, or `0` when that value is discarded and pure.

use ast::{Data, FuncKind, N, Node, Seg, SymKind};
use std::collections::HashSet;
use std::rc::Rc;

pub fn drop_unused(root: &N, toplevel_vars: bool, toplevel_funcs: bool) -> N {
    walk(root, true, toplevel_vars, toplevel_funcs)
}

fn walk(n: &N, in_fn: bool, toplevel_vars: bool, toplevel_funcs: bool) -> N {
    match &n.data {
        Data::Toplevel { body } => node(n, Data::Toplevel {
            body: drop_list(body, toplevel_vars, toplevel_funcs, false),
        }),
        Data::Func { kind, name, args, body, async_, generator } => node(n, Data::Func {
            kind: *kind,
            name: name.clone(),
            args: args.clone(),
            body: drop_list(body, true, true, true),
            async_: *async_,
            generator: *generator,
        }),
        Data::Block { body } => node(n, Data::Block { body: body.iter().map(|s| walk(s, in_fn, toplevel_vars, toplevel_funcs)).collect() }),
        other => map_walk(n, other, in_fn, toplevel_vars, toplevel_funcs),
    }
}

/// terser `drop-unused.js` passes 1–3 on one statement list.
fn drop_list(stmts: &[N], drop_vars: bool, drop_funcs: bool, in_fn: bool) -> Vec<N> {
    let stmts: Vec<N> = stmts.iter().map(|s| walk(s, in_fn, drop_vars, drop_funcs)).collect();
    // `with` pins the scope: `drop_unused` returns immediately.
    if contains_with(&stmts) {
        return stmts;
    }
    let read = read_names(&stmts);
    // Only names declared in this list. An assignment to an outer binding
    // is that outer scope's decision (`self.variables.get(name) === def`).
    let declared = declared_names(&stmts);
    let mut out = Vec::new();
    for stmt in &stmts {
        rewrite_stmt(stmt, &read, &declared, drop_vars, drop_funcs, &mut out);
    }
    out
}

fn declared_names(stmts: &[N]) -> HashSet<String> {
    let mut names = HashSet::new();
    for stmt in stmts {
        match &stmt.data {
            Data::Defs { defs, .. } => {
                for def in defs {
                    if let Data::VarDef { name, .. } = &def.data {
                        if let Some(sym) = sym_name(name) {
                            names.insert(sym.to_string());
                        }
                    }
                }
            }
            Data::Func { kind: FuncKind::Decl, name: Some(name), .. } => {
                if let Some(sym) = sym_name(name) {
                    names.insert(sym.to_string());
                }
            }
            _ => {}
        }
    }
    names
}

fn rewrite_stmt(n: &N, read: &HashSet<String>, declared: &HashSet<String>, drop_vars: bool, drop_funcs: bool, out: &mut Vec<N>) {
    match &n.data {
        Data::Defs { kind, defs, await_ } => {
            if matches!(kind, ast::DefKind::Using) {
                out.push(Rc::clone(n));
                return;
            }
            let mut kept = Vec::new();
            for def in defs {
                let Data::VarDef { name, value } = &def.data else {
                    kept.push(Rc::clone(def));
                    continue;
                };
                let sym = sym_name(name);
                let unused_name = sym.is_some_and(|s| declared.contains(s) && !read.contains(s));
                if !drop_vars || !unused_name {
                    kept.push(Rc::clone(def));
                    continue;
                }
                // Unread initializer that runs code is kept as a statement.
                if let Some(value) = value {
                    if has_side_effects(value) {
                        out.push(simple(n, Rc::clone(value)));
                    }
                }
            }
            if !kept.is_empty() {
                out.push(node(n, Data::Defs { kind: *kind, defs: kept, await_: *await_ }));
            }
        }
        Data::Func { kind: FuncKind::Decl, name: Some(name), .. } if drop_funcs && sym_name(name).is_some_and(|s| !read.contains(s)) => {}
        _ => {
            if !drop_vars {
                out.push(Rc::clone(n));
            } else if let Some(rhs) = write_only(n, read, declared) {
                let rhs = rewrite_expr(&rhs, read, declared);
                // A pure write in a statement list is skipped. An impure one stays.
                if has_side_effects(&rhs) {
                    out.push(simple(n, rhs));
                }
            } else {
                out.push(rewrite_expr(n, read, declared));
            }
        }
    }
}

/// terser `drop-unused.js` `assign_as_unused` plus the pass-3 replacement.
fn rewrite_expr(n: &N, read: &HashSet<String>, declared: &HashSet<String>) -> N {
    let go = |c: &N| rewrite_expr(c, read, declared);
    let data = match &n.data {
        Data::Assign { op, left, right, logical } if !*logical && op == "=" && ref_name(left).is_some_and(|s| declared.contains(s) && !read.contains(s)) => {
            return go(right);
        }
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::Return { value } => Data::Return { value: value.as_ref().map(|v| go(v)) },
        Data::Throw { value } => Data::Throw { value: go(value) },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr), prefix: *prefix },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left), right: go(right) },
        Data::Assign { op, left, right, logical } => Data::Assign { op: op.clone(), left: Rc::clone(left), right: go(right), logical: *logical },
        Data::Seq { exprs } => {
            let exprs: Vec<N> = exprs.iter().map(go).collect();
            if exprs.len() == 1 {
                return exprs.into_iter().next().unwrap();
            }
            Data::Seq { exprs }
        }
        Data::Call { expr, args, optional, is_new } => Data::Call { expr: go(expr), args: args.iter().map(go).collect(), optional: *optional, is_new: *is_new },
        Data::If { cond, body, alt } => Data::If { cond: go(cond), body: go(body), alt: alt.as_ref().map(|a| go(a)) },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond), cons: go(cons), alt: go(alt) },
        Data::For { init, cond, step, body } => Data::For {
            init: init.as_ref().map(|v| go(v)),
            cond: cond.as_ref().map(|v| go(v)),
            step: step.as_ref().map(|v| go(v)),
            body: go(body),
        },
        Data::While { cond, body } => Data::While { cond: go(cond), body: go(body) },
        Data::Do { body, cond } => Data::Do { body: go(body), cond: go(cond) },
        Data::Block { body } => Data::Block { body: body.iter().map(go).collect() },
        _ => return Rc::clone(n),
    };
    node(n, data)
}

/// A discarded `name = expr` whose name is unread. `expr` is the value to keep.
fn write_only(n: &N, read: &HashSet<String>, declared: &HashSet<String>) -> Option<N> {
    let Data::Simple { body } = &n.data else { return None };
    let Data::Assign { op, left, right, logical } = &body.data else { return None };
    if *logical || op != "=" {
        return None;
    }
    if ref_name(left).is_some_and(|s| declared.contains(s) && !read.contains(s)) {
        Some(Rc::clone(right))
    } else {
        None
    }
}

/// terser `scan_ref_scoped`: a symbol is read unless it is only the left of `=`.
fn read_names(stmts: &[N]) -> HashSet<String> {
    let mut read = HashSet::new();
    for stmt in stmts {
        scan(stmt, &mut read);
    }
    read
}

fn scan(n: &N, read: &mut HashSet<String>) {
    match &n.data {
        Data::Assign { op, left, right, logical } if !*logical && op == "=" => {
            if ref_name(left).is_none() {
                scan(left, read);
            }
            scan(right, read);
        }
        Data::Symbol { name, .. } => {
            read.insert(name.clone());
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            // The loop target is a write, but the binding has to stay.
            if let Some(name) = ref_name(init).or_else(|| sym_name(init)) {
                read.insert(name.to_string());
            }
            scan(init, read);
            scan(object, read);
            scan(body, read);
        }
        other => scan_children(other, read),
    }
}

fn scan_children(data: &Data, read: &mut HashSet<String>) {
    match data {
        Data::Func { body, .. } => body.iter().for_each(|s| scan(s, read)),
        Data::Block { body } | Data::Switch { body, .. } | Data::Default { body } | Data::Case { body, .. } => body.iter().for_each(|s| scan(s, read)),
        Data::Defs { defs, .. } => defs.iter().for_each(|d| scan(d, read)),
        Data::Destructuring { names, .. } => names.iter().for_each(|n| scan(n, read)),
        Data::Prop { value, .. } => scan(value, read),
        Data::Template { segments } => {
            for seg in segments {
                if let Seg::Expr(expr) = seg {
                    scan(expr, read);
                }
            }
        }
        Data::TaggedTemplate { tag, template } => {
            scan(tag, read);
            scan(template, read);
        }
        Data::VarDef { value, .. } => {
            if let Some(value) = value {
                scan(value, read);
            }
        }
        Data::Call { expr, args, .. } => {
            scan(expr, read);
            args.iter().for_each(|a| scan(a, read));
        }
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } => {
            scan(left, read);
            scan(right, read);
        }
        Data::Unary { expr, .. } | Data::Return { value: Some(expr) } | Data::Simple { body: expr } | Data::Throw { value: expr } | Data::Dot { expr, .. } | Data::Await { expr } | Data::Spread { expr } | Data::Chain { expr } => scan(expr, read),
        Data::Sub { expr, prop, .. } => {
            scan(expr, read);
            scan(prop, read);
        }
        Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().for_each(|e| scan(e, read)),
        Data::If { cond, body, alt } => {
            scan(cond, read);
            scan(body, read);
            if let Some(alt) = alt { scan(alt, read); }
        }
        Data::Cond { cond, cons, alt } => {
            scan(cond, read);
            scan(cons, read);
            scan(alt, read);
        }
        Data::For { init, cond, step, body } => {
            if let Some(init) = init { scan(init, read); }
            if let Some(cond) = cond { scan(cond, read); }
            if let Some(step) = step { scan(step, read); }
            scan(body, read);
        }
        Data::While { cond, body } | Data::Do { body, cond } => {
            scan(cond, read);
            scan(body, read);
        }
        Data::Try { body, catch, finally } => {
            scan(body, read);
            if let Some(c) = catch { scan(c, read); }
            if let Some(f) = finally { scan(f, read); }
        }
        Data::Catch { arg, body } => {
            if let Some(arg) = arg { scan(arg, read); }
            scan(body, read);
        }
        Data::Class { extends, props, name, .. } => {
            if let Some(name) = name.as_ref().and_then(sym_name) {
                read.insert(name.to_string());
            }
            if let Some(extends) = extends { scan(extends, read); }
            props.iter().for_each(|p| scan(p, read));
        }
        Data::Prop { value, .. } | Data::Field { value: Some(value), .. } => scan(value, read),
        _ => {}
    }
}

fn contains_with(stmts: &[N]) -> bool {
    fn rec(n: &N) -> bool {
        match &n.data {
            Data::With { .. } => true,
            Data::Func { body, .. } | Data::Block { body } => body.iter().any(rec),
            Data::If { cond, body, alt } => rec(cond) || rec(body) || alt.as_ref().is_some_and(|a| rec(a)),
            Data::Call { expr, args, .. } => rec(expr) || args.iter().any(rec),
            Data::Return { value: Some(v) } | Data::Simple { body: v } | Data::Throw { value: v } => rec(v),
            _ => false,
        }
    }
    stmts.iter().any(rec)
}

fn has_side_effects(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null | Data::This => false,
        Data::Symbol { kind: SymKind::Ref, .. } => false,
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "!" | "~" | "+" | "-" | "void" | "typeof") => has_side_effects(expr),
        Data::Binary { left, right, op } if !matches!(op.as_str(), "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "&=" | "|=" | "^=" | "<<=" | ">>=" | ">>>=") => {
            has_side_effects(left) || has_side_effects(right)
        }
        Data::Func { .. } | Data::Array { .. } | Data::Object { .. } => false,
        _ => true,
    }
}

fn ref_name(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, kind: SymKind::Ref, .. } => Some(name),
        _ => None,
    }
}

fn sym_name(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name),
        _ => None,
    }
}

fn simple(orig: &N, body: N) -> N {
    node(orig, Data::Simple { body })
}

fn node(orig: &N, data: Data) -> N {
    Rc::new(Node { start: orig.start.clone(), end: orig.end.clone(), data })
}

fn map_walk(n: &N, data: &Data, in_fn: bool, toplevel_vars: bool, toplevel_funcs: bool) -> N {
    let go = |c: &N| walk(c, in_fn, toplevel_vars, toplevel_funcs);
    let rebuilt = match data {
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::Return { value } => Data::Return { value: value.as_ref().map(go) },
        Data::Throw { value } => Data::Throw { value: go(value) },
        Data::Call { expr, args, optional, is_new } => Data::Call { expr: go(expr), args: args.iter().map(go).collect(), optional: *optional, is_new: *is_new },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left), right: go(right) },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond), cons: go(cons), alt: go(alt) },
        Data::For { init, cond, step, body } => Data::For { init: init.as_ref().map(go), cond: cond.as_ref().map(go), step: step.as_ref().map(go), body: go(body) },
        Data::While { cond, body } => Data::While { cond: go(cond), body: go(body) },
        Data::Do { body, cond } => Data::Do { body: go(body), cond: go(cond) },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr), prefix: *prefix },
        Data::Seq { exprs } => Data::Seq { exprs: exprs.iter().map(go).collect() },
        Data::If { cond, body, alt } => Data::If { cond: go(cond), body: go(body), alt: alt.as_ref().map(go) },
        Data::Class { stmt, name, extends, props } => Data::Class { stmt: *stmt, name: name.clone(), extends: extends.as_ref().map(go), props: props.iter().map(go).collect() },
        Data::Prop { method, key, value, static_, private, generator, async_ } => Data::Prop {
            method: *method,
            key: key.clone(),
            value: go(value),
            static_: *static_,
            private: *private,
            generator: *generator,
            async_: *async_,
        },
        _ => return Rc::clone(n),
    };
    node(n, rebuilt)
}
