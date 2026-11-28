//! terser `lib/compress/index.js` `def_optimize(AST_Conditional)`.
//!
//! The walk is `compress/src/lib.rs` `transform`. `Cx.parents` is terser's
//! compressor stack: the node being optimized is last, its parent is before that.

use ast::{Data, FuncKind, Key, N, Node, Seg, SymKind};
use std::rc::Rc;

use crate::eval::{self, is_pure};
use crate::Cx;

const PURE_GLOBALS: &[&str] = &["Number", "String", "Array", "Object", "Function", "Promise"];

/// terser `lib/compress/index.js` `def_optimize(AST_Conditional)`.
pub(crate) fn optimize(n: &N, cx: &Cx) -> Option<N> {
    opt_cond(n, cx, 0).filter(|out| !Rc::ptr_eq(out, n))
}

fn opt_cond(n: &N, cx: &Cx, depth: u32) -> Option<N> {
    if depth > 24 {
        return None;
    }
    let Data::Cond { cond, cons, alt } = &n.data else {
        return None;
    };
    // `(a, b) ? c : d` → `a, (b ? c : d)`. The sequence itself is not trimmed here;
    // terser flags the returned sequence `OPTIMIZED` without `AST_Sequence.optimize`.
    if let Data::Seq { exprs } = &cond.data {
        if exprs.len() >= 2 {
            let last = Rc::clone(exprs.last().unwrap());
            // keep: `self.condition = expressions.pop(); expressions.push(self)` (index.js 3235).
            let inner = n.rebuild(Data::Cond { cond: last, cons: Rc::clone(cons), alt: Rc::clone(alt) });
            let mut parts: Vec<N> = exprs[..exprs.len() - 1].iter().cloned().collect();
            parts.push(inner);
            return Some(make_seq(n, parts));
        }
    }
    if cx.opts.evaluate {
        if let Some(truthy) = eval::known_truth(cond, cx) {
            let branch = if truthy { Rc::clone(cons) } else { Rc::clone(alt) };
            return Some(maintain_this_binding(cx, branch));
        }
    }
    let orig_cond = Rc::clone(cond);
    let mut cond = Rc::clone(cond);
    let mut cons = Rc::clone(cons);
    let mut alt = Rc::clone(alt);
    let negated = negate(&cond, first_in_statement(cx), cx);
    if smaller_than(&cond, &negated, cx) {
        let new_cons = Rc::clone(&alt);
        let new_alt = Rc::clone(&cons);
        cond = negated;
        cons = new_cons;
        alt = new_alt;
    }
    let swapped = !Rc::ptr_eq(&cond, &orig_cond);

    // `x ? x : y` → `x || y` when both refs are the same binding.
    if same_def(&cond, &cons, cx) {
        return Some(binary(n, "||", cond, alt));
    }
    if let Some(node) = factor_assign(n, &cond, &cons, &alt, cx) {
        return Some(node);
    }
    if let Some(node) = factor_call(n, &cond, &cons, &alt, cx) {
        return Some(node);
    }
    // `a ? b : c ? b : d` → `(a || c) ? b : d`
    if let Data::Cond { cond: c2, cons: b2, alt: d } = &alt.data {
        if equivalent_to(&cons, b2) {
            let condition = binary(n, "||", Rc::clone(&cond), Rc::clone(c2));
            let node = cond_node(n, condition, Rc::clone(&cons), Rc::clone(d));
            return Some(reopt(node, cx, depth + 1));
        }
    }
    // `a == null ? b : a` → `a ?? b` when `ecma >= 2020`.
    if cx.opts.ecma >= 2020 && is_nullish_check(&cond, &alt, cx) {
        let node = binary(n, "??", Rc::clone(&alt), Rc::clone(&cons));
        return Some(reopt(node, cx, depth + 1));
    }
    // `a ? b : (c, b)` → `(a || c), b`
    if let Data::Seq { exprs } = &alt.data {
        if let Some(last) = exprs.last() {
            if equivalent_to(&cons, last) {
                let head = make_seq(n, exprs[..exprs.len() - 1].to_vec());
                return Some(crate::sequence::make_and_optimize(n, vec![binary(n, "||", Rc::clone(&cond), head), Rc::clone(&cons)], cx));
            }
        }
    }
    // `a ? b : (c && b)` → `(a || c) && b`
    if let Data::Binary { op, left, right } = &alt.data {
        if op == "&&" && equivalent_to(&cons, right) {
            let node = binary(
                n,
                "&&",
                binary(n, "||", Rc::clone(&cond), Rc::clone(left)),
                Rc::clone(&cons),
            );
            return Some(reopt(node, cx, depth + 1));
        }
    }
    // `x ? y ? z : a : a` → `x && y ? z : a`
    if let Data::Cond { cond: y, cons: z, alt: a } = &cons.data {
        if equivalent_to(a, &alt) {
            let condition = binary(n, "&&", Rc::clone(&cond), Rc::clone(y));
            return Some(cond_node(n, condition, Rc::clone(z), Rc::clone(&alt)));
        }
    }
    // `x ? y : y` → `x, y`
    if equivalent_to(&cons, &alt) {
        return Some(crate::sequence::make_and_optimize(n, vec![Rc::clone(&cond), Rc::clone(&cons)], cx));
    }
    // `x ? y || z : z` → `x && y || z`
    if let Data::Binary { op, left, right } = &cons.data {
        if op == "||" && equivalent_to(right, &alt) {
            let node = binary(
                n,
                "||",
                binary(n, "&&", Rc::clone(&cond), Rc::clone(left)),
                Rc::clone(&alt),
            );
            return Some(reopt(node, cx, depth + 1));
        }
    }
    let in_bool = in_boolean_context(cx);
    if is_true(&cons, in_bool) {
        if is_false(&alt, in_bool) {
            return Some(booleanize(&cond, cx));
        }
        return Some(binary(n, "||", booleanize(&cond, cx), alt));
    }
    if is_false(&cons, in_bool) {
        let neg = booleanize_negated(&cond, cx);
        if is_true(&alt, in_bool) {
            return Some(neg);
        }
        return Some(binary(n, "&&", neg, alt));
    }
    if is_true(&alt, in_bool) {
        return Some(binary(n, "||", booleanize_negated(&cond, cx), cons));
    }
    if is_false(&alt, in_bool) {
        return Some(binary(n, "&&", booleanize(&cond, cx), cons));
    }
    if swapped {
        Some(cond_node(n, cond, cons, alt))
    } else {
        None
    }
}

fn reopt(n: N, cx: &Cx, depth: u32) -> N {
    if depth > 24 {
        return n;
    }
    match &n.data {
        Data::Cond { .. } => opt_cond(&n, cx, depth).unwrap_or(n),
        Data::Seq { .. } => optimize_sequence(n, cx, depth),
        Data::Binary { op, .. } if matches!(op.as_str(), "&&" | "||" | "??") => fold_lazy(n, cx),
        _ => n,
    }
}

fn optimize_sequence(n: N, cx: &Cx, depth: u32) -> N {
    if !cx.opts.side_effects {
        return n;
    }
    let Data::Seq { exprs } = &n.data else {
        return n;
    };
    let mut kept = Vec::new();
    for (i, e) in exprs.iter().enumerate() {
        let last = i + 1 == exprs.len();
        if !last && expr_pure(e, cx) {
            continue;
        }
        if let Data::Seq { exprs: inner } = &e.data {
            kept.extend(inner.iter().cloned());
        } else {
            kept.push(Rc::clone(e));
        }
    }
    if kept.len() == exprs.len() && kept.iter().zip(exprs).all(|(a, b)| Rc::ptr_eq(a, b)) {
        return n;
    }
    if kept.is_empty() {
        return num(n.span_node(), 0.0);
    }
    if kept.len() == 1 {
        let only = kept.pop().unwrap();
        let bound = maintain_this_binding(cx, only);
        return if matches!(bound.data, Data::Seq { .. }) {
            bound
        } else {
            reopt(bound, cx, depth + 1)
        };
    }
    // keep: `self.expressions = expressions` (def_optimize(AST_Sequence)).
    n.rebuild(Data::Seq { exprs: kept })
}

trait SpanNode {
    fn span_node(&self) -> &N;
}

impl SpanNode for N {
    fn span_node(&self) -> &N {
        self
    }
}

fn fold_lazy(n: N, cx: &Cx) -> N {
    let Data::Binary { op, left, right } = &n.data else {
        return n;
    };
    let Some(truthy) = eval::known_truth(left, cx) else {
        return n;
    };
    match op.as_str() {
        "&&" => {
            if !truthy {
                Rc::clone(left)
            } else {
                Rc::clone(right)
            }
        }
        "||" => {
            if truthy {
                Rc::clone(left)
            } else {
                Rc::clone(right)
            }
        }
        "??" => {
            if is_nullish_lit(left) {
                Rc::clone(right)
            } else {
                Rc::clone(left)
            }
        }
        _ => n,
    }
}

fn factor_assign(span: &N, cond: &N, cons: &N, alt: &N, cx: &Cx) -> Option<N> {
    let Data::Assign { op: op1, left: l1, right: r1, logical: g1 } = &cons.data else {
        return None;
    };
    let Data::Assign { op: op2, left: l2, right: r2, logical: g2 } = &alt.data else {
        return None;
    };
    if op1 != op2 || g1 != g2 || !equivalent_to(l1, l2) {
        return None;
    }
    let ok = !has_side_effects(cond, cx) || (op1 == "=" && !has_side_effects(l1, cx));
    if !ok {
        return None;
    }
    let right = cond_node(span, Rc::clone(cond), Rc::clone(r1), Rc::clone(r2));
    Some(atom(
        span,
        Data::Assign {
            op: op1.clone(),
            left: Rc::clone(l1),
            right,
            logical: *g1,
        },
    ))
}

fn factor_call(span: &N, cond: &N, cons: &N, alt: &N, cx: &Cx) -> Option<N> {
    let Data::Call { expr: e1, args: a1, optional: o1, is_new: n1 } = &cons.data else {
        return None;
    };
    let Data::Call { expr: e2, args: a2, optional: o2, is_new: n2 } = &alt.data else {
        return None;
    };
    if n1 != n2 || o1 != o2 || a1.len() != a2.len() || a1.is_empty() {
        return None;
    }
    if !equivalent_to(e1, e2) || has_side_effects(cond, cx) || has_side_effects(e1, cx) {
        return None;
    }
    let i = single_arg_diff(a1, a2)?;
    let mut args = a1.clone();
    args[i] = cond_node(span, Rc::clone(cond), Rc::clone(&a1[i]), Rc::clone(&a2[i]));
    Some(atom(
        span,
        Data::Call {
            expr: Rc::clone(e1),
            args,
            optional: *o1,
            is_new: *n1,
        },
    ))
}

fn single_arg_diff(a: &[N], b: &[N]) -> Option<usize> {
    let mut diff = None;
    for (i, (x, y)) in a.iter().zip(b).enumerate() {
        if matches!(x.data, Data::Spread { .. }) {
            return None;
        }
        if !equivalent_to(x, y) {
            if matches!(y.data, Data::Spread { .. }) || diff.is_some() {
                return None;
            }
            diff = Some(i);
        }
    }
    diff
}

fn booleanize(node: &N, cx: &Cx) -> N {
    if is_boolean_node(node) {
        return Rc::clone(node);
    }
    unary(node, "!", negate(node, false, cx))
}

fn booleanize_negated(node: &N, cx: &Cx) -> N {
    let neg = negate(node, false, cx);
    booleanize(&neg, cx)
}

fn is_true(n: &N, in_bool: bool) -> bool {
    if matches!(n.data, Data::True) {
        return true;
    }
    if in_bool && const_truth(n) == Some(true) {
        return true;
    }
    if let Data::Unary { op, expr, prefix: true } = &n.data {
        if op == "!" && const_truth(expr) == Some(false) {
            return true;
        }
    }
    false
}

fn is_false(n: &N, in_bool: bool) -> bool {
    if matches!(n.data, Data::False) {
        return true;
    }
    if in_bool && const_truth(n) == Some(false) {
        return true;
    }
    if let Data::Unary { op, expr, prefix: true } = &n.data {
        if op == "!" && const_truth(expr) == Some(true) {
            return true;
        }
    }
    false
}

fn const_truth(n: &N) -> Option<bool> {
    Some(match &n.data {
        Data::True | Data::Infinity | Data::RegExp { .. } => true,
        Data::False | Data::Null => false,
        Data::Number { value, .. } => *value != 0.0 && !value.is_nan(),
        Data::String { value, .. } => !value.is_empty(),
        Data::BigInt { value } => value != "0",
        _ => return None,
    })
}

fn is_nullish_lit(n: &N) -> bool {
    match &n.data {
        Data::Null => true,
        Data::Unary { op, expr, prefix: true } if op == "void" && is_pure(expr) => true,
        _ => false,
    }
}

fn is_nullish_check(check: &N, subject: &N, cx: &Cx) -> bool {
    if may_throw(subject, cx) {
        return false;
    }
    let Data::Binary { op, left, right } = &check.data else {
        return false;
    };
    if op == "==" {
        if is_nullish_value(left, cx) && equivalent_to(right, subject) {
            return true;
        }
        if is_nullish_value(right, cx) && equivalent_to(left, subject) {
            return true;
        }
    }
    if op == "||" {
        return null_and_undefined(left, right, subject, cx);
    }
    false
}

fn is_nullish_value(n: &N, cx: &Cx) -> bool {
    if matches!(n.data, Data::Null) || is_undefined(n, cx) {
        return true;
    }
    if let Data::Symbol { kind: SymKind::Ref, .. } = &n.data {
        if let Some(table) = &cx.syms {
            if let Some(id) = table.def_of(n).filter(|_| !table.unfixed_ref(n)) {
                if let Some(fixed) = &table.defs[id].fixed {
                    return matches!(fixed.data, Data::Null) || is_undefined(fixed, cx);
                }
            }
        }
    }
    false
}

fn is_undefined(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "void" && !has_side_effects(expr, cx) => true,
        Data::Symbol { name, kind: SymKind::Ref, .. } if name == "undefined" && !cx.declared_ref(n, name) => true,
        _ => false,
    }
}

fn null_and_undefined(left: &N, right: &N, subject: &N, cx: &Cx) -> bool {
    let (left_null, left_undef) = cmp_nullish(left, subject, cx);
    let (right_null, right_undef) = cmp_nullish(right, subject, cx);
    (left_null && right_undef) || (left_undef && right_null)
}

fn cmp_nullish(cmp: &N, subject: &N, cx: &Cx) -> (bool, bool) {
    let Data::Binary { op, left, right } = &cmp.data else {
        return (false, false);
    };
    if op != "===" && op != "==" {
        return (false, false);
    }
    let mut null_side = false;
    let mut undef_side = false;
    let mut defined = None;
    if matches!(left.data, Data::Null) {
        null_side = true;
        defined = Some(right);
    }
    if matches!(right.data, Data::Null) {
        null_side = true;
        defined = Some(left);
    }
    if is_undefined(left, cx) {
        undef_side = true;
        defined = Some(right);
    }
    if is_undefined(right, cx) {
        undef_side = true;
        defined = Some(left);
    }
    if null_side == undef_side {
        return (false, false);
    }
    let Some(defined) = defined else {
        return (false, false);
    };
    if !equivalent_to(defined, subject) {
        return (false, false);
    }
    (null_side, undef_side)
}

fn may_throw(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::BigInt { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Infinity
        | Data::This
        | Data::RegExp { .. } => false,
        Data::Func { .. } => false,
        Data::Symbol { name, kind: SymKind::Ref, .. } => symbol_side(n, name, cx),
        Data::Unary { op, expr, prefix: true } if op == "typeof" && matches!(expr.data, Data::Symbol { .. }) => false,
        Data::Unary { expr, .. } => may_throw(expr, cx),
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } => {
            may_throw(left, cx) || may_throw(right, cx)
        }
        Data::Cond { cond, cons, alt } => may_throw(cond, cx) || may_throw(cons, cx) || may_throw(alt, cx),
        Data::Seq { exprs } => exprs.iter().any(|e| may_throw(e, cx)),
        Data::Dot { .. } | Data::Sub { .. } if crate::eval::is_nullish(n, cx) => false,
        Data::Dot { expr, optional, .. } => {
            (!*optional && may_throw_on_access(expr, cx)) || may_throw(expr, cx)
        }
        Data::Sub { expr, prop, optional } => {
            (!*optional && may_throw_on_access(expr, cx)) || may_throw(expr, cx) || may_throw(prop, cx)
        }
        _ => true,
    }
}

pub(crate) fn maintain_this_binding(cx: &Cx, val: N) -> N {
    let Some(orig) = cx.parents.last() else {
        return val;
    };
    let Some(parent) = cx.parents.iter().rev().nth(1) else {
        return val;
    };
    if needs_binding_seq(parent, orig, &val) {
        make_seq(orig, vec![num(orig, 0.0), val])
    } else {
        val
    }
}

fn needs_binding_seq(parent: &N, orig: &N, val: &N) -> bool {
    match &parent.data {
        Data::Unary { op, prefix: true, .. } if op == "delete" => true,
        Data::Call { expr, .. } if Rc::ptr_eq(expr, orig) => match &val.data {
            Data::Chain { .. } | Data::Dot { .. } | Data::Sub { .. } => true,
            Data::Symbol { name, kind: SymKind::Ref, .. } if name == "eval" => true,
            _ => false,
        },
        _ => false,
    }
}

fn same_def(a: &N, b: &N, cx: &Cx) -> bool {
    let (Data::Symbol { kind: SymKind::Ref, .. }, Data::Symbol { kind: SymKind::Ref, .. }) = (&a.data, &b.data) else {
        return false;
    };
    let Some(table) = &cx.syms else {
        return false;
    };
    match (
        table.def_of(a),
        table.def_of(b),
    ) {
        (Some(x), Some(y)) => x == y,
        _ => false,
    }
}

pub(crate) fn has_side_effects(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::BigInt { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Infinity
        | Data::This
        | Data::Super
        | Data::RegExp { .. }
        | Data::Hole => false,
        Data::Func { kind: FuncKind::Expr | FuncKind::Arrow, .. } => false,
        Data::Unary { op, expr, .. } => {
            matches!(op.as_str(), "delete" | "++" | "--") || has_side_effects(expr, cx)
        }
        Data::Binary { op, left, right } => {
            is_assign_op(op) || has_side_effects(left, cx) || has_side_effects(right, cx)
        }
        Data::Assign { .. } => true,
        Data::Cond { cond, cons, alt } => {
            has_side_effects(cond, cx) || has_side_effects(cons, cx) || has_side_effects(alt, cx)
        }
        Data::Seq { exprs } => exprs.iter().any(|e| has_side_effects(e, cx)),
        Data::Symbol { name, kind: SymKind::Ref, .. } => symbol_side(n, name, cx),
        // `AST_Dot` / `AST_Sub`: a nullish short-circuit only runs the receiver;
        // otherwise a read that may throw on access is an effect.
        Data::Dot { expr, optional, .. } => {
            if crate::eval::is_nullish(n, cx) {
                return has_side_effects(expr, cx);
            }
            (!*optional && may_throw_on_access(expr, cx)) || has_side_effects(expr, cx)
        }
        Data::Sub { expr, prop, optional } => {
            if crate::eval::is_nullish(n, cx) {
                return has_side_effects(expr, cx);
            }
            (!*optional && may_throw_on_access(expr, cx)) || has_side_effects(prop, cx) || has_side_effects(expr, cx)
        }
        Data::Array { elements } => elements.iter().any(|e| has_side_effects(e, cx)),
        Data::Object { props } => props.iter().any(|p| prop_side(p, cx)),
        Data::Chain { expr } => has_side_effects(expr, cx),
        // `AST_DynamicImport`: `import.source(x)` only compiles the module.
        Data::DynImport { phase, .. } => phase.as_deref() != Some("source"),
        Data::Template { segments } => segments.iter().any(|seg| match seg {
            Seg::Expr(e) => has_side_effects(e, cx),
            Seg::Cooked { .. } => false,
        }),
        _ => true,
    }
}

fn prop_side(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Prop { key, value, .. } => key_side(key, cx) || has_side_effects(value, cx),
        Data::Field { key, value, static_, .. } => {
            key_side(key, cx) || (*static_ && value.as_ref().is_some_and(|v| has_side_effects(v, cx)))
        }
        Data::Spread { expr } => has_side_effects(expr, cx),
        _ => true,
    }
}

fn key_side(key: &Key, cx: &Cx) -> bool {
    match key {
        Key::Computed(expr) => has_side_effects(expr, cx),
        _ => false,
    }
}

fn symbol_side(n: &N, name: &str, cx: &Cx) -> bool {
    if let Some(table) = &cx.syms {
        if let Some(id) = table.def_of(n) {
            if !table.defs[id].undeclared {
                return false;
            }
            return !PURE_GLOBALS.contains(&name);
        }
    }
    if cx.shadowed(name) {
        return false;
    }
    !PURE_GLOBALS.contains(&name)
}

fn may_throw_on_access(n: &N, cx: &Cx) -> bool {
    crate::eval::may_throw_on_access(n, cx)
}

fn expr_pure(n: &N, cx: &Cx) -> bool {
    if cx.in_with {
        return is_pure(n);
    }
    match &n.data {
        Data::Symbol { name, kind: SymKind::Ref, .. } => cx.declared_ref(n, name),
        Data::Unary { op, expr, prefix: true }
            if matches!(op.as_str(), "!" | "~" | "-" | "+" | "void" | "typeof") =>
        {
            expr_pure(expr, cx)
        }
        Data::Binary { op, left, right } if !is_assign_op(op) => expr_pure(left, cx) && expr_pure(right, cx),
        Data::Seq { exprs } => exprs.iter().all(|e| expr_pure(e, cx)),
        Data::Cond { cond, cons, alt } => expr_pure(cond, cx) && expr_pure(cons, cx) && expr_pure(alt, cx),
        _ => is_pure(n),
    }
}

fn is_assign_op(op: &str) -> bool {
    matches!(
        op,
        "=" | "+="
            | "-="
            | "*="
            | "/="
            | "%="
            | "**="
            | "<<="
            | ">>="
            | ">>>="
            | "|="
            | "&="
            | "^="
            | "&&="
            | "||="
            | "??="
    )
}

fn negate(n: &N, first: bool, cx: &Cx) -> N {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "!" => Rc::clone(expr),
        Data::Seq { exprs } if exprs.len() >= 2 => {
            let mut exprs = exprs.clone();
            let last = exprs.pop().unwrap();
            exprs.push(negate(&last, false, cx));
            make_seq(n, exprs)
        }
        Data::Cond { cond, cons, alt } => {
            let flipped = cond_node(n, Rc::clone(cond), negate(cons, false, cx), negate(alt, false, cx));
            best_negation(n, flipped, first, cx)
        }
        Data::Binary { op, left, right } => match op.as_str() {
            "==" => binary(n, "!=", Rc::clone(left), Rc::clone(right)),
            "!=" => binary(n, "==", Rc::clone(left), Rc::clone(right)),
            "===" => binary(n, "!==", Rc::clone(left), Rc::clone(right)),
            "!==" => binary(n, "===", Rc::clone(left), Rc::clone(right)),
            "&&" => {
                let flipped = binary(n, "||", negate(left, first, cx), negate(right, false, cx));
                best_negation(n, flipped, first, cx)
            }
            "||" => {
                let flipped = binary(n, "&&", negate(left, first, cx), negate(right, false, cx));
                best_negation(n, flipped, first, cx)
            }
            _ => unary(n, "!", Rc::clone(n)),
        },
        _ => unary(n, "!", Rc::clone(n)),
    }
}

/// terser `inference.js` `negate` `best`: only `alt` is wrapped in a statement when first.
fn best_negation(orig: &N, alt: N, first: bool, cx: &Cx) -> N {
    let _ = cx;
    let negated = unary(orig, "!", Rc::clone(orig));
    let alt_size = if first { crate::size::statement_size(&alt) } else { crate::size::size(&alt) };
    if crate::size::size(&negated) > alt_size { alt } else { negated }
}

/// terser `lib/compress/common.js` `best_of`. Equal sizes keep `left`.
pub(crate) fn best_of(cx: &Cx, left: &N, right: &N) -> N {
    crate::size::best_of(first_in_statement(cx), left, right)
}

/// `best_of(compressor, orig, negated) === negated`.
fn smaller_than(orig: &N, negated: &N, cx: &Cx) -> bool {
    Rc::ptr_eq(&best_of(cx, orig, negated), negated)
}

fn in_boolean_context(cx: &Cx) -> bool {
    if !cx.opts.booleans {
        return false;
    }
    let stack = &cx.parents;
    if stack.is_empty() {
        return false;
    }
    let mut current = stack.last().unwrap();
    for parent in stack[..stack.len() - 1].iter().rev() {
        if bool_root(parent, current) {
            return true;
        }
        if bool_bubble(parent, current) {
            current = parent;
        } else {
            return false;
        }
    }
    false
}

fn bool_root(parent: &N, node: &N) -> bool {
    match &parent.data {
        Data::Simple { .. } => true,
        Data::Cond { cond, .. } if Rc::ptr_eq(cond, node) => true,
        Data::Do { cond, .. } | Data::While { cond, .. } if Rc::ptr_eq(cond, node) => true,
        Data::For { cond: Some(cond), .. } if Rc::ptr_eq(cond, node) => true,
        Data::If { cond, .. } if Rc::ptr_eq(cond, node) => true,
        Data::Unary { op, expr, prefix: true } if op == "!" && Rc::ptr_eq(expr, node) => true,
        _ => false,
    }
}

fn bool_bubble(parent: &N, node: &N) -> bool {
    match &parent.data {
        Data::Binary { op, .. } if op == "&&" || op == "||" => true,
        Data::Cond { .. } => true,
        Data::Seq { exprs } => exprs.last().is_some_and(|e| Rc::ptr_eq(e, node)),
        _ => false,
    }
}

pub(crate) fn first_in_statement(cx: &Cx) -> bool {
    let stack = &cx.parents;
    if stack.is_empty() {
        return false;
    }
    let mut node = stack.last().unwrap();
    for parent in stack[..stack.len() - 1].iter().rev() {
        if statement_body(parent, node) {
            return true;
        }
        if left_edge(parent, node) {
            node = parent;
        } else {
            return false;
        }
    }
    false
}

fn statement_body(parent: &N, node: &N) -> bool {
    match &parent.data {
        Data::Simple { body }
        | Data::Labeled { body, .. }
        | Data::Do { body, .. }
        | Data::While { body, .. }
        | Data::For { body, .. }
        | Data::ForIn { body, .. }
        | Data::ForOf { body, .. }
        | Data::With { body, .. }
        | Data::If { body, .. }
        | Data::Try { body, .. }
        | Data::Finally { body }
        | Data::Catch { body, .. } => Rc::ptr_eq(body, node),
        _ => false,
    }
}

fn left_edge(parent: &N, node: &N) -> bool {
    match &parent.data {
        Data::Seq { exprs } => exprs.first().is_some_and(|e| Rc::ptr_eq(e, node)),
        Data::Call { expr, is_new: false, .. } => Rc::ptr_eq(expr, node),
        Data::TaggedTemplate { tag, .. } => Rc::ptr_eq(tag, node),
        Data::Dot { expr, .. } | Data::Sub { expr, .. } | Data::Chain { expr } => Rc::ptr_eq(expr, node),
        Data::Cond { cond, .. } => Rc::ptr_eq(cond, node),
        Data::Binary { left, .. } | Data::Assign { left, .. } | Data::DefaultAssign { left, .. } => {
            Rc::ptr_eq(left, node)
        }
        Data::Unary { expr, prefix: false, .. } => Rc::ptr_eq(expr, node),
        _ => false,
    }
}

fn is_boolean_node(n: &N) -> bool {
    match &n.data {
        Data::True | Data::False => true,
        Data::Unary { op, prefix: true, .. } if op == "!" || op == "delete" => true,
        Data::Binary { op, left, right } => {
            matches!(
                op.as_str(),
                "in" | "instanceof" | "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">="
            ) || matches!(op.as_str(), "&&" | "||" | "??") && is_boolean_node(left) && is_boolean_node(right)
        }
        Data::Cond { cons, alt, .. } => is_boolean_node(cons) && is_boolean_node(alt),
        Data::Assign { op, logical, right, .. } if op == "=" && !*logical => is_boolean_node(right),
        Data::Seq { exprs } => exprs.last().is_some_and(is_boolean_node),
        _ => false,
    }
}

fn equivalent_to(a: &N, b: &N) -> bool {
    crate::eval::equivalent_to(a, b)
}

fn cond_node(span: &N, cond: N, cons: N, alt: N) -> N {
    atom(span, Data::Cond { cond, cons, alt })
}

fn binary(span: &N, op: &str, left: N, right: N) -> N {
    atom(span, Data::Binary { op: op.into(), left, right })
}

fn unary(span: &N, op: &str, expr: N) -> N {
    atom(span, Data::Unary { op: op.into(), expr, prefix: true })
}

fn num(span: &N, value: f64) -> N {
    atom(span, Data::Number { value, raw: String::new() })
}

fn make_seq(span: &N, exprs: Vec<N>) -> N {
    let mut flat = Vec::new();
    for expr in exprs {
        if let Data::Seq { exprs } = &expr.data {
            flat.extend(exprs.iter().cloned());
        } else {
            flat.push(expr);
        }
    }
    match flat.len() {
        0 => num(span, 0.0),
        1 => flat.pop().unwrap(),
        _ => atom(span, Data::Seq { exprs: flat }),
    }
}

fn atom(span: &N, data: Data) -> N {
    Node::make(span, data)
}
