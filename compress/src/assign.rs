//! terser `lib/compress/index.js` `def_optimize(AST_Assign)`.
//!
//! `x = x` drops the write. A write whose value is the tail of a `return` or
//! `throw` becomes the value, or the plain operator when the write is `+=`.
//! `x = (a, x - 2)` lifts to `a, x -= 2`.

use ast::{Data, DefKind, Key, N, Node, Seg, SymKind};
use std::rc::Rc;

use crate::eval::{self, has_side};
use crate::syms;
use crate::Cx;

const PURE_GLOBALS: &[&str] = &["Number", "String", "Array", "Object", "Function", "Promise"];

/// terser `lib/compress/index.js` `def_optimize(AST_Assign)`.
pub(crate) fn optimize(n: &N, cx: &Cx) -> Option<N> {
    let out = opt(n, cx, 0, true)?;
    if Rc::ptr_eq(&out, n) {
        None
    } else {
        Some(out)
    }
}

fn opt(n: &N, cx: &Cx, depth: u32, drop_exit_ok: bool) -> Option<N> {
    if depth > 24 {
        return None;
    }
    let Data::Assign { op, left, right, logical } = &n.data else {
        return None;
    };
    if *logical {
        return lift(n, cx, depth);
    }
    // `x = x` → `x` when `x` is a real binding and not `arguments`.
    if op == "=" && self_assign(left, right, cx) {
        return Some(Rc::clone(right));
    }
    if drop_exit_ok {
        if let Some(dropped) = drop_exit(n, cx) {
            return Some(dropped);
        }
    }
    if let Some(lifted) = lift(n, cx, depth) {
        return Some(lifted);
    }
    compound(n, cx)
}

fn self_assign(left: &N, right: &N, cx: &Cx) -> bool {
    let Data::Symbol { name, kind: SymKind::Ref, .. } = &left.data else {
        return false;
    };
    if name == "arguments" {
        return false;
    }
    if !is_declared(left, name, cx) {
        return false;
    }
    match &right.data {
        Data::Symbol { name: rname, kind: SymKind::Ref, .. } => rname == name,
        _ => false,
    }
}

fn is_declared(n: &N, name: &str, cx: &Cx) -> bool {
    if let Some(table) = &cx.syms {
        if let Some(&id) = table.node_def.get(&syms::ptr(n)) {
            let def = &table.defs[id];
            if !def.undeclared {
                return true;
            }
            return cx.opts.unsafe_opt && PURE_GLOBALS.contains(&name);
        }
    }
    cx.shadowed(name)
}

/// A symbol write that is the value of `return` / `throw`, only through the
/// right-hand side of binaries and the tail of sequences, does not escape.
fn drop_exit(n: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.dead_code || cx.parents.is_empty() {
        return None;
    }
    let Data::Assign { op, left, right, logical: false } = &n.data else {
        return None;
    };
    let Data::Symbol { kind: SymKind::Ref, .. } = &left.data else {
        return None;
    };
    let table = cx.syms.as_ref()?;
    let id = *table.node_def.get(&syms::ptr(left))?;
    let def = &table.defs[id];
    if def.undeclared {
        return None;
    }
    let lambda = find_lambda(cx)?;
    let lambda_scope = *table.node_scope.get(&syms::ptr(lambda))?;
    if def.scope != lambda_scope {
        return None;
    }
    // `for (let x)` is a block scope in terser. The binder keeps that `let` on the function.
    if def.block_scoped && !declared_on_lambda(lambda, id, table) {
        return None;
    }
    let mut index = cx.parents.len() - 1;
    loop {
        if index == 0 {
            return None;
        }
        let node = &cx.parents[index];
        let parent_index = index - 1;
        let parent = &cx.parents[parent_index];
        if is_exit(parent) {
            if in_try(cx, parent_index, parent, lambda) {
                return None;
            }
            if is_reachable(lambda, id, table) {
                return None;
            }
            if op == "=" {
                return Some(Rc::clone(right));
            }
            table.defs[id].suppress_fixed.set(true);
            let bin_op = op.strip_suffix('=').unwrap_or(op);
            let binary = eval::binary(n, bin_op, Rc::clone(left), Rc::clone(right));
            return Some(eval::fold(&binary, cx));
        }
        let cont = match &parent.data {
            Data::Binary { right: edge, .. } => Rc::ptr_eq(edge, node),
            Data::Seq { exprs } => exprs.last().is_some_and(|e| Rc::ptr_eq(e, node)),
            _ => false,
        };
        if !cont {
            return None;
        }
        index = parent_index;
    }
}

fn is_exit(n: &N) -> bool {
    matches!(n.data, Data::Return { .. } | Data::Throw { .. })
}

fn find_lambda(cx: &Cx) -> Option<&N> {
    cx.parents.iter().rev().find(|n| matches!(n.data, Data::Func { .. }))
}

/// terser `in_try`: a `finally`, or a `catch` that can see this exit throw, keeps the write.
fn in_try(cx: &Cx, exit_index: usize, exit: &N, stop: &N) -> bool {
    let mut index = exit_index;
    while index > 0 {
        index -= 1;
        let parent = &cx.parents[index];
        if Rc::ptr_eq(parent, stop) {
            return false;
        }
        if let Data::Try { catch, finally, .. } = &parent.data {
            if finally.is_some() {
                return true;
            }
            if catch.is_some() && exit_may_throw(exit, cx) {
                return true;
            }
        }
    }
    true
}

fn exit_may_throw(exit: &N, cx: &Cx) -> bool {
    let assign = cx.parents.last();
    match &exit.data {
        Data::Throw { .. } => true,
        Data::Return { value: None } => false,
        Data::Return { value: Some(value) } => match assign {
            Some(assign) => value_may_throw(value, assign, cx),
            None => true,
        },
        _ => true,
    }
}

/// `may_throw` with this assignment's right treated as `null`.
fn value_may_throw(n: &N, assign: &N, cx: &Cx) -> bool {
    if Rc::ptr_eq(n, assign) {
        return assign_without_right(n, cx);
    }
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::BigInt { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Infinity
        | Data::This
        | Data::RegExp { .. }
        | Data::Hole => false,
        Data::Func { .. } => false,
        Data::Symbol { name, kind: SymKind::Ref, .. } => !is_declared(n, name, cx) && !PURE_GLOBALS.contains(&name.as_str()),
        Data::Unary { op, expr, .. } if op == "typeof" && matches!(expr.data, Data::Symbol { .. }) => false,
        Data::Unary { expr, .. } => value_may_throw(expr, assign, cx),
        Data::Binary { left, right, .. } => value_may_throw(left, assign, cx) || value_may_throw(right, assign, cx),
        Data::Seq { exprs } => exprs.iter().any(|e| value_may_throw(e, assign, cx)),
        Data::Cond { cond, cons, alt } => {
            value_may_throw(cond, assign, cx) || value_may_throw(cons, assign, cx) || value_may_throw(alt, assign, cx)
        }
        Data::Array { elements } => elements.iter().any(|e| value_may_throw(e, assign, cx)),
        Data::Object { props } => props.iter().any(|p| prop_may_throw(p, assign, cx)),
        Data::Dot { expr, optional, .. } => {
            (!*optional && access_may_throw(expr)) || value_may_throw(expr, assign, cx)
        }
        Data::Sub { expr, prop, optional } => {
            (!*optional && access_may_throw(expr)) || value_may_throw(expr, assign, cx) || value_may_throw(prop, assign, cx)
        }
        Data::Chain { expr } => value_may_throw(expr, assign, cx),
        _ => true,
    }
}

fn prop_may_throw(n: &N, assign: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Prop { key, value, .. } => key_may_throw(key, assign, cx) || value_may_throw(value, assign, cx),
        Data::Spread { expr } => value_may_throw(expr, assign, cx),
        _ => true,
    }
}

fn key_may_throw(key: &Key, assign: &N, cx: &Cx) -> bool {
    match key {
        Key::Computed(expr) => value_may_throw(expr, assign, cx),
        _ => false,
    }
}

/// Property reads throw under `pure_getters: "strict"` unless the receiver is a constant.
fn access_may_throw(n: &N) -> bool {
    !matches!(
        n.data,
        Data::Number { .. }
            | Data::String { .. }
            | Data::BigInt { .. }
            | Data::True
            | Data::False
            | Data::Infinity
            | Data::RegExp { .. }
            | Data::Func { .. }
            | Data::Array { .. }
            | Data::Class { .. }
    )
}

fn assign_without_right(n: &N, cx: &Cx) -> bool {
    let Data::Assign { op, left, logical, .. } = &n.data else {
        return true;
    };
    if !*logical && op == "=" && is_ref(left) && cx.lookup("use strict").is_none() {
        return false;
    }
    value_may_throw(left, n, cx)
}

fn is_ref(n: &N) -> bool {
    matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. })
}

/// `let` / `const` directly in the function body. A `for` / `switch` / block is a different scope.
fn declared_on_lambda(func: &N, id: usize, table: &syms::SymTable) -> bool {
    let Data::Func { body, .. } = &func.data else {
        return false;
    };
    body.iter().any(|stmt| decl_here(stmt, id, table, 0))
}

fn decl_here(n: &N, id: usize, table: &syms::SymTable, depth: u32) -> bool {
    match &n.data {
        Data::Defs { kind, defs, .. } if depth == 0 && matches!(kind, DefKind::Let | DefKind::Const) => {
            defs.iter().any(|def| {
                let Data::VarDef { name, .. } = &def.data else {
                    return false;
                };
                table.node_def.get(&syms::ptr(name)) == Some(&id)
            })
        }
        Data::Block { body } | Data::StaticBlock { body } => body.iter().any(|s| decl_here(s, id, table, depth + 1)),
        Data::For { init, body, .. } => {
            init.as_ref().is_some_and(|i| decl_here(i, id, table, depth + 1)) || decl_here(body, id, table, depth + 1)
        }
        Data::ForIn { init, body, .. } | Data::ForOf { init, body, .. } => {
            decl_here(init, id, table, depth + 1) || decl_here(body, id, table, depth + 1)
        }
        Data::While { body, .. } | Data::Do { body, .. } | Data::Labeled { body, .. } | Data::With { body, .. } => {
            decl_here(body, id, table, depth + 1)
        }
        Data::If { body, alt, .. } => {
            decl_here(body, id, table, depth) || alt.as_ref().is_some_and(|a| decl_here(a, id, table, depth))
        }
        Data::Switch { body, .. } => body.iter().any(|s| decl_here(s, id, table, depth + 1)),
        Data::Case { body, .. } | Data::Default { body } => body.iter().any(|s| decl_here(s, id, table, depth + 1)),
        Data::Try { body, catch, finally } => {
            decl_here(body, id, table, depth + 1)
                || catch.as_ref().is_some_and(|c| decl_here(c, id, table, depth + 1))
                || finally.as_ref().is_some_and(|f| decl_here(f, id, table, depth + 1))
        }
        Data::Catch { body, .. } | Data::Finally { body } => decl_here(body, id, table, depth + 1),
        _ => false,
    }
}

/// terser `common.js` `is_reachable`: a nested function or class reads `def`.
/// A synchronous IIFE is not a boundary.
fn is_reachable(scope: &N, id: usize, table: &syms::SymTable) -> bool {
    fn rec(node: &N, scope: &N, parent: Option<&N>, id: usize, table: &syms::SymTable) -> bool {
        if is_nested_scope(node) && !Rc::ptr_eq(node, scope) {
            let iife = parent.is_some_and(|p| match &p.data {
                Data::Call { expr, .. } => Rc::ptr_eq(expr, node),
                _ => false,
            });
            let deferred = match &node.data {
                Data::Func { async_, generator, .. } => *async_ || *generator,
                _ => false,
            };
            if iife && !deferred {
                return each_child(node, |child| rec(child, scope, Some(node), id, table));
            }
            return contains_ref(node, id, table);
        }
        each_child(node, |child| rec(child, scope, Some(node), id, table))
    }
    rec(scope, scope, None, id, table)
}

fn is_nested_scope(n: &N) -> bool {
    matches!(n.data, Data::Func { .. } | Data::Class { .. })
}

fn contains_ref(n: &N, id: usize, table: &syms::SymTable) -> bool {
    if let Data::Symbol { kind: SymKind::Ref, .. } = &n.data {
        if table.node_def.get(&syms::ptr(n)) == Some(&id) {
            return true;
        }
    }
    each_child(n, |child| contains_ref(child, id, table))
}

fn each_child(n: &N, mut f: impl FnMut(&N) -> bool) -> bool {
    let mut stop = false;
    let mut go = |c: &N| {
        if !stop && f(c) {
            stop = true;
        }
    };
    match &n.data {
        Data::Toplevel { body }
        | Data::Block { body }
        | Data::StaticBlock { body }
        | Data::Default { body }
        | Data::Case { body, .. } => {
            for s in body {
                go(s);
            }
        }
        Data::Simple { body }
        | Data::Throw { value: body }
        | Data::Spread { expr: body }
        | Data::Chain { expr: body }
        | Data::Await { expr: body }
        | Data::Unary { expr: body, .. }
        | Data::Dot { expr: body, .. }
        | Data::Finally { body } => go(body),
        Data::Return { value } | Data::Yield { expr: value, .. } => {
            if let Some(v) = value {
                go(v);
            }
        }
        Data::Labeled { label, body } => {
            go(label);
            go(body);
        }
        Data::Do { body, cond } | Data::While { cond: body, body: cond } => {
            go(body);
            go(cond);
        }
        Data::For { init, cond, step, body } => {
            if let Some(v) = init {
                go(v);
            }
            if let Some(v) = cond {
                go(v);
            }
            if let Some(v) = step {
                go(v);
            }
            go(body);
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            go(init);
            go(object);
            go(body);
        }
        Data::With { expr, body } => {
            go(expr);
            go(body);
        }
        Data::If { cond, body, alt } => {
            go(cond);
            go(body);
            if let Some(a) = alt {
                go(a);
            }
        }
        Data::Switch { expr, body } => {
            go(expr);
            for s in body {
                go(s);
            }
        }
        Data::Try { body, catch, finally } => {
            go(body);
            if let Some(v) = catch {
                go(v);
            }
            if let Some(v) = finally {
                go(v);
            }
        }
        Data::Catch { arg, body } => {
            if let Some(a) = arg {
                go(a);
            }
            go(body);
        }
        Data::Defs { defs, .. } => {
            for d in defs {
                go(d);
            }
        }
        Data::VarDef { name, value } => {
            go(name);
            if let Some(v) = value {
                go(v);
            }
        }
        Data::Func { name, args, body, .. } => {
            if let Some(name) = name {
                go(name);
            }
            for a in args {
                go(a);
            }
            for s in body {
                go(s);
            }
        }
        Data::Class { name, extends, props, .. } => {
            if let Some(name) = name {
                go(name);
            }
            if let Some(extends) = extends {
                go(extends);
            }
            for p in props {
                go(p);
            }
        }
        Data::Break { label } | Data::Continue { label } => {
            if let Some(l) = label {
                go(l);
            }
        }
        Data::Import { imported_name, imported_names, module_name, attributes, .. } => {
            if let Some(v) = imported_name {
                go(v);
            }
            if let Some(vs) = imported_names {
                for v in vs {
                    go(v);
                }
            }
            go(module_name);
            if let Some(v) = attributes {
                go(v);
            }
        }
        Data::Export { names, value, definition, module_name, attributes, .. } => {
            if let Some(vs) = names {
                for v in vs {
                    go(v);
                }
            }
            if let Some(v) = value {
                go(v);
            }
            if let Some(v) = definition {
                go(v);
            }
            if let Some(v) = module_name {
                go(v);
            }
            if let Some(v) = attributes {
                go(v);
            }
        }
        Data::NameMap { foreign, name } => {
            go(foreign);
            go(name);
        }
        Data::Array { elements } | Data::Seq { exprs: elements } => {
            for e in elements {
                go(e);
            }
        }
        Data::Object { props } => {
            for p in props {
                go(p);
            }
        }
        Data::Prop { key, value, .. } => {
            if let Key::Computed(expr) = key {
                go(expr);
            }
            go(value);
        }
        Data::Field { key, value, .. } => {
            if let Key::Computed(expr) = key {
                go(expr);
            }
            if let Some(v) = value {
                go(v);
            }
        }
        Data::Destructuring { names, .. } => {
            for name in names {
                go(name);
            }
        }
        Data::Sub { expr, prop, .. } => {
            go(expr);
            go(prop);
        }
        Data::Call { expr, args, .. } => {
            go(expr);
            for a in args {
                go(a);
            }
        }
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } | Data::DefaultAssign { left, right } => {
            go(left);
            go(right);
        }
        Data::Cond { cond, cons, alt } => {
            go(cond);
            go(cons);
            go(alt);
        }
        Data::Template { segments } => {
            for seg in segments {
                if let Seg::Expr(expr) = seg {
                    go(expr);
                }
            }
        }
        Data::TaggedTemplate { tag, template } => {
            go(tag);
            go(template);
        }
        Data::DynImport { args, .. } => {
            for a in args {
                go(a);
            }
        }
        Data::PrivateIn { key, value } => {
            go(key);
            go(value);
        }
        Data::Directive { .. }
        | Data::Empty
        | Data::Debugger
        | Data::Symbol { .. }
        | Data::This
        | Data::Super
        | Data::NewTarget
        | Data::Null
        | Data::True
        | Data::False
        | Data::Infinity
        | Data::Number { .. }
        | Data::BigInt { .. }
        | Data::String { .. }
        | Data::RegExp { .. }
        | Data::Hole
        | Data::ImportMeta => {}
    }
    stop
}

/// terser `AST_Binary.lift_sequences`, including `x = (a, b)` → `a, x = b`.
fn lift(n: &N, cx: &Cx, depth: u32) -> Option<N> {
    if cx.opts.sequences_limit <= 0 {
        return None;
    }
    let Data::Assign { op, left, right, logical } = &n.data else {
        return None;
    };
    if let Data::Seq { exprs } = &left.data {
        if exprs.is_empty() {
            return None;
        }
        let mut parts = exprs.clone();
        let tail = parts.pop().unwrap();
        let inner = assign_node(n, op, tail, Rc::clone(right), *logical);
        let inner = opt(&inner, cx, depth + 1, false).unwrap_or(inner);
        parts.push(inner);
        return Some(eval::tighten_seq(n, parts, cx));
    }
    if let Data::Seq { exprs } = &right.data {
        if exprs.is_empty() || has_side(left, cx) {
            return None;
        }
        // terser `AST_Binary.lift_sequences`: `x = (a(), b)` still lifts, because
        // `assign` skips the side-effect break. A global read is a side effect
        // for every other operator.
        let symbol_assign = op == "=" && !*logical && is_ref(left);
        let last = exprs.len() - 1;
        let mut i = 0;
        while i < last && (symbol_assign || !has_side(&exprs[i], cx)) {
            i += 1;
        }
        if i == 0 {
            return None;
        }
        if i == last {
            let mut parts = exprs.clone();
            let tail = parts.pop().unwrap();
            let inner = assign_node(n, op, Rc::clone(left), tail, *logical);
            let inner = opt(&inner, cx, depth + 1, false).unwrap_or(inner);
            parts.push(inner);
            return Some(eval::tighten_seq(n, parts, cx));
        }
        let mut parts = exprs[..i].to_vec();
        let rest = eval::atom(n, Data::Seq { exprs: exprs[i..].to_vec() });
        let inner = assign_node(n, op, Rc::clone(left), rest, *logical);
        let inner = opt(&inner, cx, depth + 1, false).unwrap_or(inner);
        parts.push(inner);
        return Some(eval::tighten_seq(n, parts, cx));
    }
    None
}

/// `x = x - 2` → `x -= 2`, and `x = 2 * x` → `x *= 2`.
fn compound(n: &N, cx: &Cx) -> Option<N> {
    let Data::Assign { op, left, right, logical: false } = &n.data else {
        return None;
    };
    if op != "=" {
        return None;
    }
    let Data::Symbol { name, kind: SymKind::Ref, .. } = &left.data else {
        return None;
    };
    let Data::Binary { op: bop, left: bl, right: br } = &right.data else {
        return None;
    };
    if let Data::Symbol { name: rname, kind: SymKind::Ref, .. } = &bl.data {
        if rname == name && assign_ops(bop) {
            let next = format!("{bop}=");
            return Some(assign_node(n, &next, Rc::clone(left), Rc::clone(br), false));
        }
    }
    if let Data::Symbol { name: rname, kind: SymKind::Ref, .. } = &br.data {
        if rname == name && assign_ops_commutative(bop) && !has_side(bl, cx) {
            let next = format!("{bop}=");
            return Some(assign_node(n, &next, Rc::clone(left), Rc::clone(bl), false));
        }
    }
    None
}

fn assign_ops(op: &str) -> bool {
    matches!(op, "+" | "-" | "/" | "*" | "%" | ">>" | "<<" | ">>>" | "|" | "^" | "&")
}

fn assign_ops_commutative(op: &str) -> bool {
    matches!(op, "*" | "|" | "^" | "&")
}

fn assign_node(span: &N, op: &str, left: N, right: N, logical: bool) -> N {
    Rc::new(Node {
        start: span.start.clone(),
        end: span.end.clone(),
        data: Data::Assign { op: op.into(), left, right, logical },
    })
}
