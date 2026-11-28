//! terser `lib/compress/index.js` `def_optimize(AST_Array)`,
//! `def_optimize(AST_Object)`, and `def_optimize(AST_ObjectKeyVal)`.
//!
//! Arrays and objects in boolean context become `literals_in_boolean_context`
//! (`(expr, true)` via `make_sequence` + `def_optimize(AST_Sequence)`, then `best_of`).
//! `inline_array_like_spread` / `inline_object_prop_spread` run when that rewrite
//! does not replace the node. `AST_ObjectKeyVal` calls `lift_key`, then
//! `unsafe_methods` turns an anonymous function or block arrow into `AST_ConciseMethod`.

use ast::{Data, FuncKind, Key, MethodKind, N};
use std::rc::Rc;

use crate::eval::{self, atom};
use crate::unary;
use crate::{Cx, UnsafeMethods};

/// terser `def_optimize(AST_Array)` / `def_optimize(AST_Object)` / `def_optimize(AST_ObjectKeyVal)`.
pub(crate) fn optimize(n: &N, cx: &Cx) -> Option<N> {
    match &n.data {
        Data::Array { elements } => optimize_array(n, elements, cx),
        Data::Object { props } => optimize_object(n, props, cx),
        Data::Prop { method: None, .. } => optimize_keyval(n, cx),
        Data::Prop { method: Some(ast::MethodKind::Method), .. } => optimize_concise_method(n, cx),
        // terser `def_optimize(AST_RegExp)` is `literals_in_boolean_context`.
        Data::RegExp { .. } => literals_in_boolean_context(n, cx),
        _ => None,
    }
}

/// terser `def_optimize(AST_Array)`.
fn optimize_array(n: &N, elements: &[N], cx: &Cx) -> Option<N> {
    if let Some(rewritten) = literals_in_boolean_context(n, cx) {
        return Some(rewritten);
    }
    let elements = inline_array_like_spread(elements)?;
    // keep: `inline_array_like_spread(self.elements)` splices in place (index.js 3799-3819).
    Some(eval::edit(n, Data::Array { elements }))
}

/// terser `def_optimize(AST_Object)`.
fn optimize_object(n: &N, props: &[N], cx: &Cx) -> Option<N> {
    if let Some(rewritten) = literals_in_boolean_context(n, cx) {
        return Some(rewritten);
    }
    let props = inline_object_prop_spread(props)?;
    // keep: `inline_object_prop_spread(self.properties)` splices in place (index.js 3827-3850).
    Some(eval::edit(n, Data::Object { props }))
}

/// terser `def_optimize(AST_ConciseMethod)`: `p(){return x}` is `p:()=>x`.
fn optimize_concise_method(n: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.arrows || !cx.parent().is_some_and(|p| matches!(p.data, Data::Object { .. })) {
        return None;
    }
    let Data::Prop { key, value, static_, private, generator, async_, .. } = &n.data else { return None };
    let Data::Func { args, body, async_: fn_async, generator: fn_gen, .. } = &value.data else { return None };
    if *generator || *fn_gen || *private || *static_ {
        return None;
    }
    if body.len() != 1 || !matches!(body[0].data, Data::Return { value: Some(_) }) {
        return None;
    }
    if crate::eval::contains_this(value) || mentions_arguments_or_pinned(value) {
        return None;
    }
    let arrow = atom(value, Data::Func {
        kind: ast::FuncKind::Arrow,
        name: None,
        args: args.clone(),
        body: body.clone(),
        async_: *fn_async || *async_,
        generator: false,
    });
    // `lift_key(self, compressor)` runs first, so the arrow's key is the lifted one.
    let key = if cx.opts.computed_props { eval::lift_key(key, cx).unwrap_or_else(|| key.clone()) } else { key.clone() };
    Some(atom(n, Data::Prop {
        method: None,
        key,
        value: arrow,
        static_: false,
        private: false,
        generator: false,
        async_: false,
    }))
}

/// `uses_arguments`, `pinned()` (direct `eval` or `with`), or `super` in a
/// method body: none of them survive the move to an arrow.
fn mentions_arguments_or_pinned(func: &N) -> bool {
    fn rec(n: &N, top: bool) -> bool {
        match &n.data {
            Data::Symbol { name, kind: ast::SymKind::Ref, .. } if name == "arguments" || name == "eval" => true,
            Data::With { .. } | Data::Super => true,
            Data::Func { kind, .. } if !top && !matches!(kind, ast::FuncKind::Arrow) => false,
            _ => {
                let mut hit = false;
                ast::transform_children(n, &mut |c| hit = hit || rec(c, false));
                hit
            }
        }
    }
    rec(func, true)
}

/// terser `def_optimize(AST_ObjectKeyVal)`.
fn optimize_keyval(n: &N, cx: &Cx) -> Option<N> {
    let Data::Prop {
        method: None,
        key: orig_key,
        value,
        static_,
        private,
        generator,
        async_,
    } = &n.data
    else {
        return None;
    };
    // `lift_key`: `["p"]:1` → `p:1`, `[42]:1` → `42:1`.
    let key = if cx.opts.computed_props {
        eval::lift_key(orig_key, cx).unwrap_or_else(|| orig_key.clone())
    } else {
        orig_key.clone()
    };
    if let Some(concise) = concise_method(n, &key, value, *static_, *private, cx) {
        return Some(concise);
    }
    if keys_same(&key, orig_key) {
        return None;
    }
    // keep: `lift_key` sets `self.key` (index.js 4009-4018).
    Some(eval::edit(
        n,
        Data::Prop {
            method: None,
            key,
            value: Rc::clone(value),
            static_: *static_,
            private: *private,
            generator: *generator,
            async_: *async_,
        },
    ))
}

/// terser `literals_in_boolean_context`.
///
/// `best_of` sees the sequence whose tail is still `true` (size 4). A single
/// survivor is `true.optimize`, which is `1` in boolean context. A longer
/// sequence keeps `true` through `best_of`; the following descend turns that
/// tail into `1`, so the node we return already has the `1`.
fn literals_in_boolean_context(n: &N, cx: &Cx) -> Option<N> {
    if !unary::in_boolean_context(cx) || !cx.opts.side_effects {
        return None;
    }
    let alt = bool_sequence(n, cx);
    let chosen = crate::conditional::best_of(cx, n, &alt);
    if Rc::ptr_eq(&chosen, n) {
        return None;
    }
    Some(bool_tail_to_one(chosen))
}

/// `make_sequence(self, [self, true]).optimize(compressor)`.
fn bool_sequence(n: &N, cx: &Cx) -> N {
    let mut kept = Vec::new();
    let first = unary::first_in_statement(cx);
    if let Some(part) = unary::drop_side_effect_free(n, cx, first) {
        merge_sequence(&mut kept, part);
    }
    kept.push(atom(n, Data::True));
    if kept.len() == 1 {
        // `end == 0`: `true.optimize` while `self` is still this literal.
        return unary::optimize_bool(true, n, cx);
    }
    atom(n, Data::Seq { exprs: kept })
}

fn bool_tail_to_one(n: N) -> N {
    let Data::Seq { exprs } = &n.data else {
        return n;
    };
    if !exprs.last().is_some_and(|e| matches!(e.data, Data::True)) {
        return n;
    }
    let mut exprs = exprs.clone();
    let last = exprs.len() - 1;
    exprs[last] = eval::num(&n, 1.0);
    // keep: the sequence's own `true` optimizes to `1` in place.
    eval::edit(&n, Data::Seq { exprs })
}

/// terser `common.js` `merge_sequence`.
fn merge_sequence(out: &mut Vec<N>, expr: N) {
    if let Data::Seq { exprs } = &expr.data {
        out.extend(exprs.iter().cloned());
    } else {
        out.push(expr);
    }
}

/// terser `inline_array_like_spread`.
///
/// A spread of an array with no holes is spliced in place. A non-array spread
/// stays: spreading a non-iterable throws.
fn inline_array_like_spread(elements: &[N]) -> Option<Vec<N>> {
    let mut out = elements.to_vec();
    let mut changed = false;
    let mut i = 0;
    while i < out.len() {
        let repl = match &out[i].data {
            Data::Spread { expr } => match &expr.data {
                Data::Array { elements } if elements.iter().all(|el| !matches!(el.data, Data::Hole)) => {
                    Some(elements.clone())
                }
                _ => None,
            },
            _ => None,
        };
        if let Some(repl) = repl {
            out.splice(i..i + 1, repl);
            changed = true;
            continue;
        }
        i += 1;
    }
    changed.then_some(out)
}

/// terser `inline_object_prop_spread`.
fn inline_object_prop_spread(props: &[N]) -> Option<Vec<N>> {
    let mut out = props.to_vec();
    let mut changed = false;
    let mut i = 0;
    while i < out.len() {
        let Data::Spread { expr } = &out[i].data else {
            i += 1;
            continue;
        };
        if let Data::Object { props } = &expr.data {
            if props.iter().all(is_object_keyval) {
                let repl = props.clone();
                out.splice(i..i + 1, repl);
                changed = true;
                continue;
            }
        } else if spread_constant_drops(expr) {
            // Object spread of a non-iterable constant is a no-op.
            // `AST_String` is the only iterable constant, so it stays.
            out.remove(i);
            changed = true;
            continue;
        }
        i += 1;
    }
    changed.then_some(out)
}

/// terser `AST_ObjectKeyVal`: plain `key: value`, not a method, getter, or setter.
fn is_object_keyval(n: &N) -> bool {
    matches!(n.data, Data::Prop { method: None, .. })
}

/// `expr instanceof AST_Constant || expr.is_constant()`, excluding `AST_String`.
fn spread_constant_drops(expr: &N) -> bool {
    if matches!(expr.data, Data::String { .. }) {
        return false;
    }
    is_ast_constant(expr) || is_constant_expr(expr)
}

fn is_ast_constant(expr: &N) -> bool {
    matches!(
        expr.data,
        Data::Number { .. }
            | Data::BigInt { .. }
            | Data::RegExp { .. }
            | Data::True
            | Data::False
            | Data::Null
            | Data::Infinity
            | Data::String { .. }
    )
}

/// terser `evaluate.js` `AST_Node.is_constant`. `AST_RegExp` is a constant node
/// but `is_constant()` is false for it; a unary of a regexp still counts.
fn is_constant_expr(expr: &N) -> bool {
    match &expr.data {
        Data::Number { .. }
        | Data::BigInt { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Infinity
        | Data::String { .. } => true,
        Data::Unary { op, expr, prefix: true } if matches!(op.as_str(), "!" | "~" | "-" | "+" | "void") => {
            is_ast_constant(expr) || is_constant_expr(expr)
        }
        _ => false,
    }
}

/// `p: function(){}` → `p(){}`, and a block arrow that does not use `this`.
fn concise_method(span: &N, key: &Key, value: &N, static_: bool, private: bool, cx: &Cx) -> Option<N> {
    if !method_allowed(cx, key) {
        return None;
    }
    let (async_, generator) = method_flags(value)?;
    Some(atom(
        span,
        Data::Prop {
            method: Some(MethodKind::Method),
            key: key.clone(),
            value: Rc::clone(value),
            static_,
            private,
            generator,
            async_,
        },
    ))
}

fn method_flags(value: &N) -> Option<(bool, bool)> {
    match &value.data {
        Data::Func { kind: FuncKind::Expr, name: None, async_, generator, .. } => Some((*async_, *generator)),
        Data::Func { kind: FuncKind::Arrow, body, async_, generator, .. } => {
            // `Array.isArray(value.body)`: a braceless arrow's body is one expression.
            // Our printer treats a single `return <expr>` as that braceless form.
            if is_braceless_arrow(body) || eval::contains_this(value) {
                return None;
            }
            Some((*async_, *generator))
        }
        _ => None,
    }
}

fn is_braceless_arrow(body: &[N]) -> bool {
    matches!(body, [n] if matches!(n.data, Data::Return { value: Some(_) }))
}

fn method_allowed(cx: &Cx, key: &Key) -> bool {
    if cx.opts.ecma < 2015 {
        return false;
    }
    match &cx.opts.unsafe_methods {
        UnsafeMethods::Off => false,
        UnsafeMethods::All => true,
        UnsafeMethods::Pattern { source, flags } => regex_test(source, flags, &key_text(key)),
    }
}

/// `self.key + ""`. A computed key is an AST node, whose default string is `[object Object]`.
fn key_text(key: &Key) -> String {
    match key {
        Key::Static { name, .. } | Key::Private(name) => name.clone(),
        Key::Computed(_) => "[object Object]".into(),
    }
}

fn regex_test(source: &str, flags: &str, text: &str) -> bool {
    let mut pattern = String::new();
    if flags.contains('i') {
        pattern.push_str("(?i)");
    }
    if flags.contains('m') {
        pattern.push_str("(?m)");
    }
    pattern.push_str(source);
    regex::Regex::new(&pattern).is_ok_and(|re| re.is_match(text))
}

fn keys_same(a: &Key, b: &Key) -> bool {
    match (a, b) {
        (Key::Static { name: n1, quote: q1 }, Key::Static { name: n2, quote: q2 }) => n1 == n2 && q1 == q2,
        (Key::Private(n1), Key::Private(n2)) => n1 == n2,
        (Key::Computed(e1), Key::Computed(e2)) => Rc::ptr_eq(e1, e2),
        _ => false,
    }
}
