//! terser `lib/compress/index.js` `def_optimize(AST_Sequence)`.
//!
//! `side_effects` drops non-tail expressions through `drop-side-effect-free.js`,
//! flattens with `common.js` `merge_sequence`, then `trim_right_for_undefined`.
//! A single survivor is `common.js` `maintain_this_binding` and, when it is not
//! itself a sequence, `optimize`. `AST_Binary.lift_sequences` builds that sequence
//! and optimizes it the same way. The conditional's own sequence lift stays in
//! `conditional.rs`.

use ast::{Data, N};
use std::cell::Cell;
use std::rc::Rc;

use crate::eval::{self, statement_pure};
use crate::unary;
use crate::Cx;

thread_local! {
    static DEPTH: Cell<u32> = const { Cell::new(0) };
}

struct DepthGuard;

impl Drop for DepthGuard {
    fn drop(&mut self) {
        DEPTH.with(|d| d.set(d.get().saturating_sub(1)));
    }
}

fn enter() -> Option<DepthGuard> {
    DEPTH.with(|d| {
        if d.get() >= 8 {
            return None;
        }
        d.set(d.get() + 1);
        Some(DepthGuard)
    })
}

/// terser `lib/compress/index.js` `def_optimize(AST_Sequence)`.
pub(crate) fn optimize(n: &N, cx: &Cx) -> Option<N> {
    let Data::Seq { exprs } = &n.data else {
        return None;
    };
    if exprs.len() < 2 || !cx.opts.side_effects {
        return None;
    }
    let out = trim(n, exprs.iter().cloned().collect(), cx, true);
    if Rc::ptr_eq(&out, n) { None } else { Some(out) }
}

/// terser `lib/compress/common.js` `make_sequence` followed by
/// `def_optimize(AST_Sequence)`.
pub(crate) fn make_and_optimize(span: &N, exprs: Vec<N>, cx: &Cx) -> N {
    let flat = flatten(exprs);
    if flat.is_empty() {
        return eval::num(span, 0.0);
    }
    if flat.len() == 1 {
        let only = flat.into_iter().next().unwrap();
        return reopt(only, cx);
    }
    if !cx.opts.side_effects {
        return eval::atom(span, Data::Seq { exprs: flat });
    }
    trim(span, flat, cx, false)
}

/// terser `lib/compress/index.js` `AST_Binary.lift_sequences`.
pub(crate) fn lift_binary(n: &N, cx: &Cx) -> Option<N> {
    if cx.opts.sequences_limit <= 0 {
        return None;
    }
    let Data::Binary { op, left, right } = &n.data else {
        return None;
    };
    if let Data::Seq { exprs } = &left.data {
        if exprs.is_empty() {
            return None;
        }
        let mut parts = exprs.clone();
        let tail = parts.pop().unwrap();
        parts.push(eval::binary(n, op, tail, Rc::clone(right)));
        return Some(make_and_optimize(n, parts, cx));
    }
    if let Data::Seq { exprs } = &right.data {
        if exprs.is_empty() || eval::has_side(left, cx) {
            return None;
        }
        let last = exprs.len() - 1;
        let mut i = 0;
        while i < last && !eval::has_side(&exprs[i], cx) {
            i += 1;
        }
        if i == 0 {
            return None;
        }
        if i == last {
            let mut parts = exprs.clone();
            let tail = parts.pop().unwrap();
            parts.push(eval::binary(n, op, Rc::clone(left), tail));
            return Some(make_and_optimize(n, parts, cx));
        }
        let mut parts = exprs[..i].to_vec();
        let rest = eval::atom(n, Data::Seq { exprs: exprs[i..].to_vec() });
        parts.push(eval::binary(n, op, Rc::clone(left), rest));
        return Some(make_and_optimize(n, parts, cx));
    }
    None
}

/// `preserve` keeps the input `Rc` when the expression list did not change.
fn trim(span: &N, exprs: Vec<N>, cx: &Cx, preserve: bool) -> N {
    let original = if preserve { Some(exprs.clone()) } else { None };
    let mut kept = Vec::new();
    let last = exprs.len() - 1;
    let mut first = unary::first_in_statement(cx);
    for (i, e) in exprs.into_iter().enumerate() {
        if i < last {
            if let Some(effects) = crate::call::pure_effects(&e) {
                if !effects.is_empty() {
                    for effect in effects {
                        merge(&mut kept, effect);
                    }
                    first = false;
                }
                continue;
            }
            if statement_pure(&e, cx) || !eval::has_side(&e, cx) {
                continue;
            }
            match unary::drop_side_effect_free(&e, cx, first) {
                None => continue,
                Some(part) if !Rc::ptr_eq(&part, &e) => {
                    merge(&mut kept, part);
                    first = false;
                }
                Some(_) => {
                    merge(&mut kept, e);
                    first = false;
                }
            }
        } else {
            merge(&mut kept, e);
        }
    }
    if kept.is_empty() {
        return eval::num(span, 0.0);
    }
    // terser `trim_right_for_undefined`: a trailing `undefined` becomes `void` of
    // the previous expression so the sequence value stays `undefined`.
    let mut end = kept.len() - 1;
    while end > 0 && is_undefined(&kept[end], cx) {
        end -= 1;
    }
    if end < kept.len() - 1 {
        let wrapped = eval::unary(span, "void", Rc::clone(&kept[end]));
        kept.truncate(end);
        kept.push(wrapped);
    }
    if let Some(original) = original {
        if kept.len() == original.len() && kept.iter().zip(&original).all(|(a, b)| Rc::ptr_eq(a, b)) {
            return Rc::clone(span);
        }
    }
    if kept.len() == 1 {
        let only = kept.pop().unwrap();
        // `(0, a.b)()` must stay a sequence. A new `void` tail is optimized once.
        let bound = crate::conditional::maintain_this_binding(cx, only);
        if matches!(bound.data, Data::Seq { .. }) {
            return bound;
        }
        return reopt(bound, cx);
    }
    if preserve {
        // keep: `self.expressions = expressions` (index.js 2061).
        eval::edit(span, Data::Seq { exprs: kept })
    } else {
        // new: the sequence `make_sequence` made, optimized where it is made.
        eval::atom(span, Data::Seq { exprs: kept })
    }
}

fn reopt(n: N, cx: &Cx) -> N {
    let flagged = cx.is_optimized(&n) || cx.squeezed.contains(&n.id());
    crate::audit_flags(cx, "reopt", &n, flagged, true, true);
    if flagged {
        return n;
    }
    let Some(_guard) = enter() else {
        return n;
    };
    eval::fold(&n, cx)
}

/// terser `lib/compress/inference.js` `is_undefined`.
fn is_undefined(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "void" && !unary::may_side_effect(expr, cx) => true,
        Data::Symbol { name, kind: ast::SymKind::Ref, .. } if name == "undefined" && !cx.declared_ref(n, name) => true,
        _ => false,
    }
}

fn flatten(exprs: Vec<N>) -> Vec<N> {
    let mut flat = Vec::new();
    for e in exprs {
        merge(&mut flat, e);
    }
    flat
}

/// terser `lib/compress/common.js` `merge_sequence`.
fn merge(out: &mut Vec<N>, expr: N) {
    if let Data::Seq { exprs } = &expr.data {
        out.extend(exprs.iter().cloned());
    } else {
        out.push(expr);
    }
}
