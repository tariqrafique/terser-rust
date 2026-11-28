//! terser `lib/compress/index.js` `def_optimize(AST_UnaryPrefix)`
//! and `AST_Unary.lift_sequences`.
//!
//! Operators: `!`, `typeof`, `void`, `delete`, `+`, `-`, `~`.
//! Helpers: `inference.js` `negate` / `bitwise_negate`, `drop-side-effect-free.js`.

use ast::{Data, FuncKind, Key, N, Seg, SymKind};
use std::collections::HashSet;
use std::rc::Rc;

use crate::eval::{self, atom, binary, is_iife_call, is_number, num, to_int32, unary, void0};
use crate::Cx;

pub fn optimize(n: &N, cx: &Cx) -> N {
    let mut active = HashSet::new();
    optimize_inner(n, cx, &mut active)
}

fn optimize_inner(n: &N, cx: &Cx, active: &mut HashSet<usize>) -> N {
    let ptr = Rc::as_ptr(n) as usize;
    if !active.insert(ptr) {
        return Rc::clone(n);
    }
    let out = optimize_body(n, cx, active);
    active.remove(&ptr);
    out
}

fn optimize_body(n: &N, cx: &Cx, active: &mut HashSet<usize>) -> N {
    let Data::Unary { op, expr, prefix: true } = &n.data else {
        return Rc::clone(n);
    };
    if !is_target(op) {
        return Rc::clone(n);
    }

    if op == "delete" && !delete_keeps(expr) {
        let seq = sequence_node(n, vec![Rc::clone(expr), atom(n, Data::True)]);
        return optimize_sequence(&seq, cx, active);
    }

    if op == "void" {
        if let Data::Number { value, .. } = &expr.data {
            if *value == 0.0 {
                return Rc::clone(n);
            }
        }
    }

    if let Some(lifted) = lift_sequences(n, op, expr, cx, active) {
        return lifted;
    }

    if cx.opts.side_effects && op == "void" {
        return match drop_side_effect_free(expr, cx, false) {
            None => optimize_produced(void0(n), cx, active),
            Some(e) if Rc::ptr_eq(&e, expr) => Rc::clone(n),
            Some(e) => unary(n, "void", e),
        };
    }

    if in_boolean_context(cx) {
        match op.as_str() {
            "!" => {
                if let Data::Unary { op: inner, expr: value, prefix: true } = &expr.data {
                    if inner == "!" {
                        return Rc::clone(value);
                    }
                }
                if matches!(expr.data, Data::Binary { .. }) {
                    let neg = negate(expr, cx, first_in_statement(cx));
                    let chosen = best_of(cx, n, &neg);
                    if !Rc::ptr_eq(&chosen, n) {
                        if let Some(ev) = eval::best_constant(&chosen, cx) {
                            return ev;
                        }
                        return chosen;
                    }
                }
            }
            "typeof" => {
                if matches!(expr.data, Data::Symbol { kind: SymKind::Ref, .. }) {
                    return optimize_bool(true, n, cx);
                }
                let seq = sequence_node(n, vec![Rc::clone(expr), atom(n, Data::True)]);
                return optimize_sequence(&seq, cx, active);
            }
            _ => {}
        }
    }

    let mut operand = Rc::clone(expr);
    if op == "-" && matches!(operand.data, Data::Infinity) {
        operand = eval::infinity(expr, false);
    }

    if let Data::Binary { op: bop, left, right } = &operand.data {
        if matches!(op.as_str(), "+" | "-") && matches!(bop.as_str(), "*" | "/" | "%") {
            return binary(n, bop, unary(left, op, Rc::clone(left)), Rc::clone(right));
        }
    }

    if cx.opts.evaluate && op == "~" {
        if let Data::Unary { op: inner, expr: inner_expr, prefix: true } = &expr.data {
            if inner == "~" && (in_32_bit_context(cx) || is_32_bit_integer(inner_expr, cx)) {
                return Rc::clone(inner_expr);
            }
        }
        if let Data::Binary { op: bop, left, right } = &expr.data {
            if bop == "^" {
                let (left, right) = if matches!(&left.data, Data::Unary { op, prefix: true, .. } if op == "~") {
                    (bitwise_negate(left, true, cx), Rc::clone(right))
                } else {
                    (Rc::clone(left), bitwise_negate(right, true, cx))
                };
                return binary(n, "^", left, right);
            }
        }
    }

    if let Some(ev) = eval::prefix_constant(n, &operand, cx) {
        return ev;
    }
    Rc::clone(n)
}

fn is_target(op: &str) -> bool {
    matches!(op, "!" | "typeof" | "void" | "delete" | "+" | "-" | "~")
}

fn delete_keeps(e: &N) -> bool {
    matches!(
        e.data,
        Data::Symbol { kind: SymKind::Ref, .. } | Data::Dot { .. } | Data::Sub { .. } | Data::Chain { .. } | Data::Infinity
    )
}

fn lift_sequences(n: &N, op: &str, expr: &N, cx: &Cx, active: &mut HashSet<usize>) -> Option<N> {
    if cx.opts.sequences_limit <= 0 {
        return None;
    }
    let Data::Seq { exprs } = &expr.data else {
        return None;
    };
    if exprs.is_empty() {
        return None;
    }
    let mut xs = Vec::with_capacity(exprs.len());
    let last = exprs.len() - 1;
    for (i, e) in exprs.iter().enumerate() {
        if i == last {
            xs.push(unary(n, op, Rc::clone(e)));
        } else {
            push_flat(&mut xs, Rc::clone(e));
        }
    }
    Some(optimize_sequence(&sequence_node(n, xs), cx, active))
}

fn optimize_sequence(n: &N, cx: &Cx, active: &mut HashSet<usize>) -> N {
    let Data::Seq { exprs } = &n.data else {
        return optimize_produced(Rc::clone(n), cx, active);
    };
    if !cx.opts.side_effects {
        return polish_tail(exprs.clone(), n, cx, active);
    }
    let mut kept = Vec::new();
    let last = exprs.len().saturating_sub(1);
    let mut first = first_in_statement(cx);
    for (i, e) in exprs.iter().enumerate() {
        if i < last {
            if let Some(part) = drop_side_effect_free(e, cx, first) {
                push_flat(&mut kept, part);
                first = false;
            }
        } else {
            push_flat(&mut kept, Rc::clone(e));
        }
    }
    let before_trim = kept.len();
    while kept.len() > 1 && is_undefined(kept.last().unwrap(), cx) {
        kept.pop();
    }
    if kept.len() < before_trim {
        if let Some(end) = kept.pop() {
            kept.push(unary(n, "void", end));
        }
    }
    if kept.is_empty() {
        return num(n, 0.0);
    }
    if kept.len() == 1 {
        let only = maintain_this_binding(kept.pop().unwrap(), cx);
        return optimize_produced(only, cx, active);
    }
    polish_tail(kept, n, cx, active)
}

fn polish_tail(mut exprs: Vec<N>, span: &N, cx: &Cx, active: &mut HashSet<usize>) -> N {
    if let Some(last) = exprs.pop() {
        exprs.push(optimize_produced(last, cx, active));
    }
    if exprs.len() == 1 {
        exprs.pop().unwrap()
    } else {
        sequence_node(span, exprs)
    }
}

fn optimize_produced(n: N, cx: &Cx, active: &mut HashSet<usize>) -> N {
    match &n.data {
        Data::True => optimize_bool(true, &n, cx),
        Data::False => optimize_bool(false, &n, cx),
        Data::Unary { op, prefix: true, .. } if is_target(op) => optimize_inner(&n, cx, active),
        Data::Seq { .. } => optimize_sequence(&n, cx, active),
        _ => n,
    }
}

/// terser `index.js` `def_optimize(AST_Boolean)`.
pub(crate) fn optimize_bool(value: bool, span: &N, cx: &Cx) -> N {
    if in_boolean_context(cx) {
        return num(span, if value { 1.0 } else { 0.0 });
    }
    if cx.opts.booleans {
        if let Some(parent) = parent_of_self(cx) {
            if let Data::Binary { op, .. } = &parent.data {
                if op == "==" || op == "!=" {
                    return num(span, if value { 1.0 } else { 0.0 });
                }
            }
        }
        let bit = if value { 0.0 } else { 1.0 };
        return unary(span, "!", num(span, bit));
    }
    atom(span, if value { Data::True } else { Data::False })
}

fn maintain_this_binding(val: N, cx: &Cx) -> N {
    let Some(orig) = cx.parents.last() else {
        return val;
    };
    let Some(parent) = parent_of_self(cx) else {
        return val;
    };
    let bind = match &parent.data {
        Data::Unary { op, prefix: true, .. } if op == "delete" => true,
        Data::Call { expr, is_new: false, .. } if Rc::ptr_eq(expr, orig) => {
            matches!(val.data, Data::Chain { .. } | Data::Dot { .. } | Data::Sub { .. })
                || matches!(&val.data, Data::Symbol { name, kind: SymKind::Ref, .. } if name == "eval")
        }
        _ => false,
    };
    if bind {
        let span = Rc::clone(&val);
        let zero = num(&span, 0.0);
        sequence_node(&span, vec![zero, val])
    } else {
        val
    }
}

fn is_undefined(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "void" && !may_side_effect(expr, cx) => true,
        Data::Symbol { name, kind: SymKind::Ref, .. } if name == "undefined" && !cx.declared_ref(n, name) => true,
        _ => false,
    }
}

pub(crate) fn in_boolean_context(cx: &Cx) -> bool {
    if !cx.opts.booleans || cx.parents.len() < 2 {
        return false;
    }
    let mut self_n = Rc::clone(cx.parents.last().unwrap());
    for i in (0..cx.parents.len() - 1).rev() {
        let p = &cx.parents[i];
        if bool_stop(p, &self_n) {
            return true;
        }
        if bool_propagate(p, &self_n) {
            self_n = Rc::clone(p);
        } else {
            return false;
        }
    }
    false
}

fn bool_stop(p: &N, self_n: &N) -> bool {
    match &p.data {
        Data::Simple { .. } => true,
        Data::Cond { cond, .. } if Rc::ptr_eq(cond, self_n) => true,
        Data::Do { cond, .. } | Data::While { cond, .. } if Rc::ptr_eq(cond, self_n) => true,
        Data::For { cond: Some(cond), .. } if Rc::ptr_eq(cond, self_n) => true,
        Data::If { cond, .. } if Rc::ptr_eq(cond, self_n) => true,
        Data::Unary { op, expr, prefix: true } if op == "!" && Rc::ptr_eq(expr, self_n) => true,
        _ => false,
    }
}

fn bool_propagate(p: &N, self_n: &N) -> bool {
    match &p.data {
        Data::Binary { op, .. } if op == "&&" || op == "||" => true,
        Data::Cond { .. } => true,
        Data::Seq { exprs } => exprs.last().is_some_and(|e| Rc::ptr_eq(e, self_n)),
        _ => false,
    }
}

fn in_32_bit_context(cx: &Cx) -> bool {
    in_32_bit_context_of(cx, false)
}

/// terser `Compressor.in_32_bit_context(other_operand_must_be_number)`.
pub(crate) fn in_32_bit_context_of(cx: &Cx, other_number: bool) -> bool {
    if !cx.opts.evaluate || cx.parents.len() < 2 {
        return false;
    }
    let mut self_n = Rc::clone(cx.parents.last().unwrap());
    for i in (0..cx.parents.len() - 1).rev() {
        let p = &cx.parents[i];
        if let Data::Binary { op, left, right } = &p.data {
            if bitwise_binop(op) {
                if other_number {
                    let other = if Rc::ptr_eq(left, &self_n) { right } else { left };
                    return is_number(other);
                }
                return true;
            }
        }
        if let Data::Unary { op, prefix: true, .. } = &p.data {
            return op == "~";
        }
        let propagate = match &p.data {
            Data::Binary { op, right, .. } if matches!(op.as_str(), "&&" | "||" | "??") && Rc::ptr_eq(right, &self_n) => true,
            Data::Cond { cond, .. } if !Rc::ptr_eq(cond, &self_n) => true,
            Data::Seq { exprs } => exprs.last().is_some_and(|e| Rc::ptr_eq(e, &self_n)),
            _ => false,
        };
        if propagate {
            self_n = Rc::clone(p);
        } else {
            return false;
        }
    }
    false
}

fn bitwise_binop(op: &str) -> bool {
    matches!(op, "<<" | ">>" | "&" | "|" | "^" | "<<<")
}

pub(crate) fn is_32_bit_integer(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Number { value, .. } => value.is_finite() && *value == (to_int32(*value) as f64),
        Data::Unary { op, expr, prefix: true } if op == "~" => is_number(expr),
        Data::Unary { op, expr, prefix: true } if op == "+" => is_32_bit_integer(expr, cx),
        Data::Binary { op, left, right } if bitwise_binop(op) => is_number(left) || is_number(right),
        _ => false,
    }
}

pub(crate) fn bitwise_negate(node: &N, force_32: bool, cx: &Cx) -> N {
    if let Data::Number { value, .. } = &node.data {
        let neg = !to_int32(*value);
        let neg_s = codegen::js_number(neg as f64);
        let val_s = codegen::js_number(*value);
        if neg_s.len() > val_s.len() {
            return unary(node, "~", Rc::clone(node));
        }
        return num(node, neg as f64);
    }
    if let Data::Unary { op, expr, prefix: true } = &node.data {
        if op == "~" && (force_32 || is_32_bit_integer(expr, cx)) {
            return Rc::clone(expr);
        }
    }
    unary(node, "~", Rc::clone(node))
}

pub(crate) fn first_in_statement(cx: &Cx) -> bool {
    crate::conditional::first_in_statement(cx)
}

pub(crate) fn best_of(cx: &Cx, a: &N, b: &N) -> N {
    crate::size::best_of(first_in_statement(cx), a, b)
}

/// terser `inference.js` `negate`.
pub(crate) fn negate(n: &N, cx: &Cx, first: bool) -> N {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "!" => Rc::clone(expr),
        Data::Seq { exprs } if !exprs.is_empty() => {
            let mut xs = exprs.clone();
            let last = xs.pop().unwrap();
            xs.push(negate(&last, cx, false));
            sequence_node(n, xs)
        }
        Data::Cond { cond, cons, alt } => {
            let alt_node = atom(n, Data::Cond {
                cond: Rc::clone(cond),
                cons: negate(cons, cx, false),
                alt: negate(alt, cx, false),
            });
            best_negation(n, alt_node, first)
        }
        Data::Binary { op, left, right } => negate_binary(n, op, left, right, cx, first),
        _ => unary(n, "!", Rc::clone(n)),
    }
}

fn negate_binary(n: &N, op: &str, left: &N, right: &N, cx: &Cx, first: bool) -> N {
    if cx.opts.unsafe_comps {
        let flipped = match op {
            "<=" => Some(">"),
            "<" => Some(">="),
            ">=" => Some("<"),
            ">" => Some("<="),
            _ => None,
        };
        if let Some(flipped) = flipped {
            return binary(n, flipped, Rc::clone(left), Rc::clone(right));
        }
    }
    let flipped = match op {
        "==" => "!=",
        "!=" => "==",
        "===" => "!==",
        "!==" => "===",
        "&&" => "||",
        "||" => "&&",
        _ => return unary(n, "!", Rc::clone(n)),
    };
    if op == "&&" || op == "||" {
        let node = binary(n, flipped, negate(left, cx, first), negate(right, cx, false));
        return best_negation(n, node, first);
    }
    binary(n, flipped, Rc::clone(left), Rc::clone(right))
}

/// terser `inference.js` `negate` `best`: only `alt` is wrapped in a statement when first.
fn best_negation(orig: &N, alt: N, first: bool) -> N {
    let negated = unary(orig, "!", Rc::clone(orig));
    let alt_size = if first { crate::size::statement_size(&alt) } else { crate::size::size(&alt) };
    if crate::size::size(&negated) > alt_size { alt } else { negated }
}

fn parent_of_self(cx: &Cx) -> Option<&N> {
    let len = cx.parents.len();
    if len < 2 { None } else { Some(&cx.parents[len - 2]) }
}

fn sequence_node(span: &N, exprs: Vec<N>) -> N {
    let mut flat = Vec::new();
    for e in exprs {
        push_flat(&mut flat, e);
    }
    if flat.len() == 1 {
        flat.pop().unwrap()
    } else if flat.is_empty() {
        num(span, 0.0)
    } else {
        atom(span, Data::Seq { exprs: flat })
    }
}

fn push_flat(out: &mut Vec<N>, e: N) {
    if let Data::Seq { exprs } = &e.data {
        for inner in exprs {
            push_flat(out, Rc::clone(inner));
        }
    } else {
        out.push(e);
    }
}

/// terser `inference.js` `has_side_effects` for nodes this pass asks about.
pub(crate) fn may_side_effect(n: &N, cx: &Cx) -> bool {
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
        Data::Func { kind: FuncKind::Expr | FuncKind::Arrow, .. } => false,
        Data::Unary { op, expr, .. } => matches!(op.as_str(), "delete" | "++" | "--") || may_side_effect(expr, cx),
        Data::Binary { left, right, .. } => may_side_effect(left, cx) || may_side_effect(right, cx),
        Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().any(|e| may_side_effect(e, cx)),
        Data::Cond { cond, cons, alt } => may_side_effect(cond, cx) || may_side_effect(cons, cx) || may_side_effect(alt, cx),
        Data::Symbol { .. } => !symbol_read_is_pure(n, cx),
        Data::Object { props } => props.iter().any(|p| prop_may_effect(p, cx)),
        // `AST_Class`: the heritage and the properties.
        Data::Class { extends, props, .. } => {
            extends.as_ref().is_some_and(|e| may_side_effect(e, cx)) || props.iter().any(|p| prop_may_effect(p, cx))
        }
        Data::Spread { expr } | Data::Chain { expr } => may_side_effect(expr, cx),
        // `AST_Dot` / `AST_Sub`: a nullish short-circuit only runs the receiver;
        // otherwise a read that may throw on access is an effect.
        Data::Dot { expr, optional, .. } => {
            if crate::eval::is_nullish(n, cx) {
                return may_side_effect(expr, cx);
            }
            (!*optional && crate::eval::may_throw_on_access(expr, cx)) || may_side_effect(expr, cx)
        }
        Data::Sub { expr, prop, optional } => {
            if crate::eval::is_nullish(n, cx) {
                return may_side_effect(expr, cx);
            }
            (!*optional && crate::eval::may_throw_on_access(expr, cx)) || may_side_effect(prop, cx) || may_side_effect(expr, cx)
        }
        _ => true,
    }
}

fn prop_may_effect(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Prop { method, key, value, .. } => {
            let key_fx = match key {
                Key::Computed(expr) => may_side_effect(expr, cx),
                _ => false,
            };
            key_fx || (method.is_none() && may_side_effect(value, cx))
        }
        Data::Spread { expr } => may_side_effect(expr, cx),
        // `AST_ClassProperty`: a computed key, or a static initializer.
        Data::Field { key, value, static_, .. } => {
            matches!(key, Key::Computed(expr) if may_side_effect(expr, cx))
                || (*static_ && value.as_ref().is_some_and(|v| may_side_effect(v, cx)))
        }
        // `AST_ClassStaticBlock`: its statements.
        Data::StaticBlock { body } => body.iter().any(|st| match &st.data {
            Data::Empty => false,
            Data::Simple { body } => may_side_effect(body, cx),
            _ => true,
        }),
        _ => true,
    }
}

fn symbol_read_is_pure(n: &N, cx: &Cx) -> bool {
    let Data::Symbol { name, kind: SymKind::Ref, .. } = &n.data else {
        return false;
    };
    if cx.declared_ref(n, name) || matches!(name.as_str(), "Number" | "String" | "Array" | "Object" | "Function" | "Promise") {
        return true;
    }
    // terser `AST_Lambda.init_scope_vars` defines `arguments` in every function but an
    // arrow, so a read inside one is declared. The binder does not define it.
    name == "arguments" && cx.parents.iter().any(|p| matches!(p.data, Data::Func { kind: FuncKind::Decl | FuncKind::Expr | FuncKind::Accessor, .. }))
}

/// terser `lib/compress/drop-side-effect-free.js` `AST_Node#drop_side_effect_free`.
pub(crate) fn drop_side_effect_free(n: &N, cx: &Cx, first: bool) -> Option<N> {
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
        | Data::Hole => None,
        Data::Func { kind: FuncKind::Expr | FuncKind::Arrow, .. } => None,
        Data::Class { stmt: false, name, extends, props } => drop_class(n, name.as_ref(), extends.as_ref(), props, cx),
        Data::Unary { op, expr, .. } => drop_unary(n, op, expr, cx, first),
        Data::Binary { op, left, right } => drop_binary(n, op, left, right, cx, first),
        Data::Assign { logical, left, right, .. } => drop_assign(n, *logical, left, right, cx, first),
        Data::Yield { .. } | Data::Await { .. } => Some(Rc::clone(n)),
        Data::Call { expr, is_new, .. } => drop_call(n, expr, *is_new, cx),
        Data::Seq { exprs } => drop_sequence(n, exprs, cx),
        Data::Cond { cond, cons, alt } => drop_cond(n, cond, cons, alt, cx),
        Data::Symbol { .. } => if symbol_read_is_pure(n, cx) { None } else { Some(Rc::clone(n)) },
        Data::Array { elements } => seq_from_parts(n, trim_list(elements, cx, first)),
        Data::Object { props } => {
            let mut parts = Vec::new();
            let mut first_flag = first;
            for p in props {
                if let Some(k) = drop_prop(p, cx, first_flag) {
                    push_flat(&mut parts, k);
                    first_flag = false;
                }
            }
            seq_from_parts(n, parts)
        }
        Data::Dot { expr, optional, .. } => drop_access(n, expr, None, *optional, cx, first),
        Data::Sub { expr, prop, optional } => drop_access(n, expr, Some(prop), *optional, cx, first),
        Data::Chain { expr } | Data::Spread { expr } => drop_side_effect_free(expr, cx, first),
        Data::Template { segments } => {
            let mut parts = Vec::new();
            let mut first_flag = first;
            for seg in segments {
                if let Seg::Expr(e) = seg {
                    if let Some(k) = drop_side_effect_free(e, cx, first_flag) {
                        push_flat(&mut parts, k);
                        first_flag = false;
                    }
                }
            }
            seq_from_parts(n, parts)
        }
        _ => Some(Rc::clone(n)),
    }
}

/// terser `drop-side-effect-free.js` `AST_Assign`: a write to a property of a constant
/// expression (`(class{}).v = 1`) keeps only the value's effects.
fn drop_assign(n: &N, logical: bool, left: &N, right: &N, cx: &Cx, first: bool) -> Option<N> {
    if logical {
        return Some(Rc::clone(n));
    }
    let strict_const = cx.lookup("use strict").is_some()
        && matches!(&left.data, Data::Dot { expr, .. } | Data::Sub { expr, .. } if crate::eval::is_constant(expr));
    if may_side_effect(left, cx) || strict_const {
        return Some(Rc::clone(n));
    }
    let mut obj = left;
    while let Data::Dot { expr, .. } | Data::Sub { expr, .. } = &obj.data {
        obj = expr;
    }
    // `left.is_constant_expression(compressor.find_parent(AST_Scope))`
    let constant = cx.syms.as_ref().is_some_and(|table| {
        let scope = cx
            .parents
            .iter()
            .rev()
            .skip(1)
            .filter(|p| matches!(p.data, Data::Func { .. } | Data::Class { .. } | Data::Toplevel { .. }))
            .find_map(|p| table.scope_of(p))
            .or(Some(0));
        crate::reduce_vars::is_constant_expression(obj, table, scope)
    });
    if constant {
        return drop_side_effect_free(right, cx, first);
    }
    Some(Rc::clone(n))
}

/// terser `drop-side-effect-free.js` `AST_Class`.
fn drop_class(n: &N, name: Option<&N>, extends: Option<&N>, props: &[N], cx: &Cx) -> Option<N> {
    let mut effects = Vec::new();
    // `is_self_referential() && has_side_effects()`: the class name read in a
    // part that runs at definition time.
    let self_name = name.and_then(|nm| match &nm.data {
        Data::Symbol { name, .. } => Some(name.clone()),
        _ => None,
    });
    if let Some(e) = extends {
        if let Some(k) = drop_side_effect_free(e, cx, false) {
            push_flat(&mut effects, k);
        }
    }
    for p in props {
        match &p.data {
            // `AST_ClassStaticBlock`: any body is treated as a side effect.
            Data::StaticBlock { body } => {
                if !body.is_empty() {
                    return Some(Rc::clone(n));
                }
            }
            Data::Field { key, value, static_, .. } => {
                if let ast::Key::Computed(k) = key {
                    if let Some(k) = drop_side_effect_free(k, cx, false) {
                        push_flat(&mut effects, k);
                    }
                }
                if *static_ {
                    if let Some(v) = value {
                        // A static initializer that reads the class through
                        // `this` keeps the class (`is_self_referential`).
                        if crate::eval::contains_this(v) {
                            return Some(Rc::clone(n));
                        }
                        if let Some(v) = drop_side_effect_free(v, cx, false) {
                            push_flat(&mut effects, v);
                        }
                    }
                }
            }
            Data::Prop { key: ast::Key::Computed(k), .. } => {
                if let Some(k) = drop_side_effect_free(k, cx, false) {
                    push_flat(&mut effects, k);
                }
            }
            _ => {}
        }
    }
    if !effects.is_empty() {
        if let Some(sn) = &self_name {
            let reads_self = |v: &N| reads_name(v, sn);
            let referential = extends.is_some_and(reads_self)
                || props.iter().any(|p| match &p.data {
                    Data::Field { key, value, static_, .. } => {
                        matches!(key, ast::Key::Computed(k) if reads_self(k)) || (*static_ && value.as_ref().is_some_and(reads_self))
                    }
                    Data::Prop { key: ast::Key::Computed(k), .. } => reads_self(k),
                    _ => false,
                });
            if referential {
                return Some(Rc::clone(n));
            }
        }
    }
    seq_from_parts(n, effects)
}

fn reads_name(n: &N, name: &str) -> bool {
    if matches!(&n.data, Data::Symbol { name: got, kind: SymKind::Ref, .. } if got == name) {
        return true;
    }
    let mut hit = false;
    ast::transform_children(n, &mut |c| hit = hit || reads_name(c, name));
    hit
}

/// terser `drop_side_effect_free(AST_Call)`. A pure annotation keeps argument
/// effects. An unreferenced function expression drops its completion value
/// (`process_expression(false)`).
fn drop_call(n: &N, expr: &N, is_new: bool, cx: &Cx) -> Option<N> {
    if let Some(effects) = crate::call::pure_effects(n) {
        return seq_from_parts(n, effects);
    }
    if !is_new && func_expr_unreferenced(expr, cx) {
        // terser `this.clone()`: the call is a new node even when
        // `process_expression` leaves the function as it was.
        // `process_expression` edits the function in place (it keeps its id and flags).
        let rewritten = crate::eval::process_expression(expr, false, Some(cx));
        let Data::Call { args, optional, is_new, .. } = &n.data else {
            return Some(Rc::clone(n));
        };
        return Some(atom(
            n,
            Data::Call {
                expr: rewritten,
                args: args.clone(),
                optional: *optional,
                is_new: *is_new,
            },
        ));
    }
    Some(Rc::clone(n))
}

fn func_expr_unreferenced(expr: &N, cx: &Cx) -> bool {
    let Data::Func { kind, name, .. } = &expr.data else {
        return false;
    };
    if !matches!(kind, FuncKind::Expr | FuncKind::Arrow) {
        return false;
    }
    let Some(name) = name else {
        return true;
    };
    let Some(table) = &cx.syms else {
        return false;
    };
    let Some(id) = table.def_of(name) else {
        return false;
    };
    table.defs.get(id).is_some_and(|d| d.ref_count() == 0)
}

/// terser `drop_side_effect_free(AST_Dot)` / `AST_Sub`.
fn drop_access(n: &N, expr: &N, prop: Option<&N>, optional: bool, cx: &Cx, first: bool) -> Option<N> {
    if !optional && crate::eval::may_throw_on_access(expr, cx) {
        return Some(Rc::clone(n));
    }
    let property = prop.and_then(|p| drop_side_effect_free(p, cx, false));
    if property.is_some() && optional {
        return Some(Rc::clone(n));
    }
    match (drop_side_effect_free(expr, cx, first), property) {
        (Some(e), Some(p)) => Some(sequence_node(n, vec![e, p])),
        (Some(e), None) => Some(e),
        (None, Some(p)) => Some(p),
        (None, None) => None,
    }
}

fn drop_unary(n: &N, op: &str, expr: &N, cx: &Cx, first: bool) -> Option<N> {
    if matches!(op, "delete" | "++" | "--") {
        return Some(Rc::clone(n));
    }
    if op == "typeof" && matches!(expr.data, Data::Symbol { kind: SymKind::Ref, .. }) {
        return None;
    }
    let inner = drop_side_effect_free(expr, cx, first);
    if first {
        if let Some(ref e) = inner {
            if is_iife_call(e) {
                if Rc::ptr_eq(e, expr) && op == "!" {
                    return Some(Rc::clone(n));
                }
                return Some(negate(e, cx, first));
            }
        }
    }
    inner
}

fn drop_binary(n: &N, op: &str, left: &N, right: &N, cx: &Cx, first: bool) -> Option<N> {
    let Some(right_d) = drop_side_effect_free(right, cx, false) else {
        return drop_side_effect_free(left, cx, first);
    };
    if matches!(op, "&&" | "||" | "??") {
        if Rc::ptr_eq(&right_d, right) {
            return Some(Rc::clone(n));
        }
        return Some(binary(n, op, Rc::clone(left), right_d));
    }
    match drop_side_effect_free(left, cx, first) {
        None => drop_side_effect_free(&right_d, cx, first),
        Some(l) => Some(sequence_node(n, vec![l, right_d])),
    }
}

fn drop_sequence(n: &N, exprs: &[N], cx: &Cx) -> Option<N> {
    let Some(last) = exprs.last() else {
        return None;
    };
    let tail = drop_side_effect_free(last, cx, false);
    if tail.as_ref().is_some_and(|t| Rc::ptr_eq(t, last)) {
        return Some(Rc::clone(n));
    }
    let mut kept: Vec<N> = exprs[..exprs.len() - 1].iter().cloned().collect();
    if let Some(tail) = tail {
        kept.push(tail);
    }
    seq_from_parts(n, kept)
}

fn drop_cond(n: &N, cond: &N, cons: &N, alt: &N, cx: &Cx) -> Option<N> {
    let c = drop_side_effect_free(cons, cx, false);
    let a = drop_side_effect_free(alt, cx, false);
    let same = c.as_ref().is_some_and(|x| Rc::ptr_eq(x, cons)) && a.as_ref().is_some_and(|x| Rc::ptr_eq(x, alt));
    if same {
        return Some(Rc::clone(n));
    }
    match (c, a) {
        (None, None) => drop_side_effect_free(cond, cx, false),
        (None, Some(a)) => Some(binary(n, "||", Rc::clone(cond), a)),
        (Some(c), None) => Some(binary(n, "&&", Rc::clone(cond), c)),
        (Some(c), Some(a)) => Some(atom(n, Data::Cond { cond: Rc::clone(cond), cons: c, alt: a })),
    }
}

fn drop_prop(n: &N, cx: &Cx, first: bool) -> Option<N> {
    match &n.data {
        Data::Prop { method, key, value, .. } => {
            let key_fx = match key {
                Key::Computed(expr) => drop_side_effect_free(expr, cx, first),
                _ => None,
            };
            let val_fx = if method.is_some() { None } else { drop_side_effect_free(value, cx, first && key_fx.is_none()) };
            match (key_fx, val_fx) {
                (Some(k), Some(v)) => Some(sequence_node(n, vec![k, v])),
                (Some(k), None) => Some(k),
                (None, Some(v)) => Some(v),
                (None, None) => None,
            }
        }
        Data::Spread { expr } => drop_side_effect_free(expr, cx, first),
        _ => Some(Rc::clone(n)),
    }
}

fn trim_list(nodes: &[N], cx: &Cx, mut first: bool) -> Vec<N> {
    let mut out = Vec::new();
    for n in nodes {
        if let Some(k) = drop_side_effect_free(n, cx, first) {
            push_flat(&mut out, k);
            first = false;
        }
    }
    out
}

fn seq_from_parts(span: &N, parts: Vec<N>) -> Option<N> {
    if parts.is_empty() {
        None
    } else if parts.len() == 1 {
        parts.into_iter().next()
    } else {
        Some(sequence_node(span, parts))
    }
}
