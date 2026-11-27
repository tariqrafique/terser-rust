//! Constant folding and the side-effect drops that depend on it.
//!
//! Values follow JavaScript number and truthiness rules. A folded form is
//! kept only when it is not longer than the original expression.

use ast::{Data, FuncKind, Key, N, Node, Seg, SymKind};
use std::rc::Rc;

use crate::Cx;

#[derive(Clone, Debug)]
enum Lit {
    Num(f64),
    Str(String),
    Bool(bool),
    Null,
    Undef,
}

impl Lit {
    fn truthy(&self) -> bool {
        match self {
            Lit::Num(n) => *n != 0.0 && !n.is_nan(),
            Lit::Str(s) => !s.is_empty(),
            Lit::Bool(b) => *b,
            Lit::Null | Lit::Undef => false,
        }
    }
}

pub fn fold(n: &N, cx: &Cx) -> N {
    if cx.in_asm() {
        return Rc::clone(n);
    }
    if let Data::Unary { op, prefix: true, .. } = &n.data {
        if matches!(op.as_str(), "!" | "typeof" | "void" | "delete" | "+" | "-" | "~") {
            // terser `lib/compress/index.js` `def_optimize(AST_UnaryPrefix)`.
            return crate::unary::optimize(n, cx);
        }
    }
    if let Some(rewritten) = rewrite_global(n, cx) {
        return rewritten;
    }
    if let Some(rewritten) = fold_bool(n, cx) {
        return rewritten;
    }
    if cx.opts.evaluate {
        if let Some(rewritten) = fold_value(n, cx) {
            return rewritten;
        }
    }
    if cx.opts.dead_code {
        if let Some(rewritten) = fold_empty_switch(n, cx) {
            return rewritten;
        }
        if cx.opts.switches {
            if let Some(rewritten) = fold_switch_if(n, cx) {
                return rewritten;
            }
        }
    }
    if cx.opts.computed_props {
        if let Some(rewritten) = fold_computed(n, cx) {
            return rewritten;
        }
    }
    if cx.opts.conditionals {
        if let Some(rewritten) = fold_cond(n, cx) {
            return rewritten;
        }
    }
    // terser `lib/compress/index.js` `def_optimize(AST_If)`
    if let Some(rewritten) = optimize_if(n, cx) {
        return rewritten;
    }
    // terser `lib/compress/index.js` `def_optimize(AST_UnaryPrefix)` calls
    // `AST_Binary.negate` (`inference.js`) when `!` is in boolean context.
    if let Some(rewritten) = fold_not_binary(n, cx) {
        return rewritten;
    }
    // terser `lib/compress/index.js` `def_optimize(AST_Binary)`.
    if let Some(rewritten) = fold_binary(n, cx) {
        return rewritten;
    }
    // terser `lib/compress/index.js` `def_optimize(AST_Dot)` / `def_optimize(AST_Sub)`.
    if cx.opts.properties || cx.opts.evaluate {
        if let Some(rewritten) = fold_prop_access(n, cx) {
            return rewritten;
        }
    }
    if cx.opts.loops {
        if let Some(rewritten) = fold_while(n) {
            return rewritten;
        }
    }
    if let Some(rewritten) = crate::call::optimize(n, cx) {
        return rewritten;
    }
    if cx.opts.negate_iife {
        if let Some(rewritten) = negate_iife(n) {
            return rewritten;
        }
    }
    if cx.opts.side_effects {
        if let Some(rewritten) = unwrap_void_statement(n, cx) {
            return rewritten;
        }
        if let Some(rewritten) = drop_statement(n, cx) {
            return rewritten;
        }
        if let Some(rewritten) = trim_sequence(n, cx) {
            return rewritten;
        }
    }
    Rc::clone(n)
}

fn rewrite_global(n: &N, cx: &Cx) -> Option<N> {
    let Data::Symbol { name, kind: ast::SymKind::Ref, .. } = &n.data else {
        return None;
    };
    if cx.opts.reduce_vars && !cx.in_lhs {
        if let Some(table) = &cx.syms {
            if let Some(value) = crate::reduce_vars::inline_ref(
                n,
                table,
                &crate::reduce_vars::Env {
                    unused: cx.opts.unused,
                    evaluate: cx.opts.evaluate,
                    toplevel_vars: cx.opts.toplevel_vars,
                    toplevel_funcs: cx.opts.toplevel_funcs,
                },
            ) {
                return Some(value);
            }
        }
        if let Some(value) = cx.const_value(name) {
            return Some(Rc::clone(value));
        }
    }
    // terser `index.js` `def_optimize(AST_Undefined)` / `AST_Infinity` / `AST_NaN`:
    // the direct lhs of `delete`, an update, or an assignment keeps the identifier.
    if cx.shadowed(name) || cx.opts.ie8 || cx.in_lhs || identifier_lhs(cx) {
        return None;
    }
    match name.as_str() {
        "undefined" => Some(void0(n)),
        "NaN" => Some(nan_node(n, cx)),
        "Infinity" => Some(infinity(n, false)),
        _ => None,
    }
}

/// Direct child of `delete` / `++` / `--`. Nested operands (a sequence element,
/// a conditional branch) are not an lhs, so `undefined` there still becomes `void 0`.
fn identifier_lhs(cx: &Cx) -> bool {
    let len = cx.parents.len();
    if len < 2 {
        return false;
    }
    let self_n = &cx.parents[len - 1];
    let parent = &cx.parents[len - 2];
    match &parent.data {
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "delete" | "++" | "--") && Rc::ptr_eq(expr, self_n) => true,
        _ => false,
    }
}

fn fold_bool(n: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.booleans {
        return None;
    }
    let value = match &n.data {
        Data::True => 1.0,
        Data::False => 0.0,
        _ => return None,
    };
    if cx.in_bool || cx.eq_cmp {
        Some(num(n, value))
    } else {
        Some(unary(n, "!", num(n, 1.0 - value)))
    }
}

fn fold_switch_if(n: &N, cx: &Cx) -> Option<N> {
    let Data::Switch { expr, body } = &n.data else {
        return None;
    };
    if body.is_empty() || has_control_jump(body) {
        return None;
    }
    if break_only(body, cx) {
        return Some(if statement_pure(expr, cx) {
            empty(n)
        } else {
            simple(n, Rc::clone(expr))
        });
    }
    let mut case_test: Option<&N> = None;
    let mut case_body: Option<Vec<N>> = None;
    let mut default_body: Option<Vec<N>> = None;
    for arm in body {
        match &arm.data {
            Data::Case { expr: test, body } => {
                if case_test.is_some() {
                    return None;
                }
                case_test = Some(test);
                case_body = Some(strip_break(body));
            }
            Data::Default { body } => {
                if default_body.is_some() {
                    return None;
                }
                default_body = Some(strip_break(body));
            }
            _ => return None,
        }
    }
    let (Some(test), Some(case_body)) = (case_test, case_body) else {
        return None;
    };
    if case_body.is_empty() {
        return None;
    }
    let cond = eq_test(n, Rc::clone(expr), Rc::clone(test), cx);
    let body = stmt_list(n, &case_body, cx);
    let alt = default_body.and_then(|stmts| {
        if stmts.is_empty() {
            None
        } else {
            Some(stmt_list(n, &stmts, cx))
        }
    });
    Some(atom(n, Data::If { cond, body, alt }))
}

fn eq_test(span: &N, left: N, right: N, cx: &Cx) -> N {
    let node = binary(span, "===", left, right);
    fold_compare(&node, cx).unwrap_or(node)
}

fn break_only(body: &[N], cx: &Cx) -> bool {
    body.iter().all(|arm| match &arm.data {
        Data::Case { expr, body } => statement_pure(expr, cx) && strip_break(body).is_empty(),
        Data::Default { body } => strip_break(body).is_empty(),
        _ => false,
    })
}

fn strip_break(body: &[N]) -> Vec<N> {
    let mut out: Vec<N> = body.iter().cloned().collect();
    if let Some(Data::Break { label: None }) = out.last().map(|s| &s.data) {
        out.pop();
    }
    out
}

fn has_control_jump(body: &[N]) -> bool {
    body.iter().any(|arm| {
        let stmts = match &arm.data {
            Data::Case { body, .. } | Data::Default { body } => body.as_slice(),
            _ => &[],
        };
        stmts.iter().enumerate().any(|(i, stmt)| {
            let last = i + 1 == stmts.len();
            match &stmt.data {
                Data::Break { label: None } if last => false,
                Data::Break { .. } | Data::Continue { .. } => true,
                Data::If { .. } | Data::For { .. } | Data::While { .. } | Data::Do { .. } | Data::Switch { .. } | Data::Block { .. } | Data::Try { .. } => {
                    contains_jump(stmt)
                }
                _ => false,
            }
        })
    })
}

fn contains_jump(n: &N) -> bool {
    match &n.data {
        Data::Break { .. } | Data::Continue { .. } => true,
        Data::Func { .. } | Data::Class { .. } => false,
        other => walk_children(other, contains_jump),
    }
}

fn stmt_list(span: &N, stmts: &[N], cx: &Cx) -> N {
    let merged = if cx.opts.sequences_limit > 0 && stmts.len() > 1 && stmts.iter().all(|s| matches!(s.data, Data::Simple { .. })) {
        let exprs = stmts
            .iter()
            .map(|s| match &s.data {
                Data::Simple { body } => Rc::clone(body),
                _ => unreachable!(),
            })
            .collect();
        vec![simple(span, sequence(span, exprs))]
    } else {
        stmts.to_vec()
    };
    if merged.len() == 1 {
        merged.into_iter().next().unwrap()
    } else {
        atom(span, Data::Block { body: merged })
    }
}

fn fold_empty_switch(n: &N, cx: &Cx) -> Option<N> {
    let Data::Switch { expr, body } = &n.data else {
        return None;
    };
    if !body.is_empty() {
        return None;
    }
    if cx.opts.side_effects && is_pure(expr) {
        Some(atom(n, Data::Empty))
    } else {
        Some(simple(n, Rc::clone(expr)))
    }
}

fn fold_computed(n: &N, cx: &Cx) -> Option<N> {
    match &n.data {
        Data::Prop { method, key, value, static_, private, generator, async_ } => {
            let key = lift_key(key, cx)?;
            Some(atom(
                n,
                Data::Prop {
                    method: *method,
                    key,
                    value: Rc::clone(value),
                    static_: *static_,
                    private: *private,
                    generator: *generator,
                    async_: *async_,
                },
            ))
        }
        Data::Field { key, value, static_, private } => {
            let key = lift_key(key, cx)?;
            Some(atom(
                n,
                Data::Field {
                    key,
                    value: value.clone(),
                    static_: *static_,
                    private: *private,
                },
            ))
        }
        _ => None,
    }
}

/// terser `lib/compress/index.js` `lift_key`.
/// `["p"]:1` to `p:1`, `[42]:1` to `42:1`. `__proto__` and a class `constructor` stay computed.
fn lift_key(key: &Key, cx: &Cx) -> Option<Key> {
    let Key::Computed(expr) = key else {
        return None;
    };
    let (name, quote) = match &expr.data {
        Data::Number { value, .. } if value.is_finite() => (codegen::js_number(*value), None),
        Data::String { value, quote, .. } => (value.clone(), Some(*quote)),
        _ => return None,
    };
    if name == "__proto__" {
        return None;
    }
    if name == "constructor" && cx.parent().is_some_and(|p| matches!(p.data, Data::Class { .. })) {
        return None;
    }
    Some(Key::Static { name, quote })
}

fn fold_value(n: &N, cx: &Cx) -> Option<N> {
    if let Data::Binary { op, .. } = &n.data {
        if matches!(op.as_str(), "&&" | "||" | "??") {
            return None;
        }
    }
    // A conditional returns the chosen branch (`def_optimize(AST_Conditional)`),
    // which is already `!0` / `!1` when `booleans` rewrote `true` / `false`.
    if matches!(n.data, Data::Cond { .. }) {
        return None;
    }
    let lit = eval(n)?;
    if let Lit::Str(s) = &lit {
        if s.len() + 2 > print_len(n) {
            return None;
        }
    }
    let folded = lit_node(n, lit, cx);
    Some(prefer(n, folded))
}

/// terser `lib/compress/index.js` `def_optimize(AST_Conditional)`.
fn fold_cond(n: &N, cx: &Cx) -> Option<N> {
    crate::conditional::optimize(n, cx)
}

pub(crate) fn known_truth(n: &N) -> Option<bool> {
    let lit = eval(n)?;
    if !is_pure(n) {
        return None;
    }
    Some(lit.truthy())
}

/// terser `lib/compress/index.js` `def_optimize(AST_If)`.
fn optimize_if(n: &N, cx: &Cx) -> Option<N> {
    let Data::If { cond, body, alt } = &n.data else {
        return None;
    };
    let orig_cond = Rc::clone(cond);
    let orig_body = Rc::clone(body);
    let orig_alt = alt.clone();
    let mut cond = Rc::clone(cond);
    let mut body = Rc::clone(body);
    // `is_empty(self.alternative)` clears an empty else before the option check.
    let mut alt = alt.clone().filter(|a| !is_empty_stmt(a));
    if !cx.opts.conditionals {
        return alt_changed(&orig_alt, &alt).then(|| if_node(n, cond, body, alt));
    }
    if !cx.opts.dead_code {
        if let Some(lit) = eval_if_cond(&cond, cx) {
            let made = fold(&lit_node(&cond, lit, cx), cx);
            if node_size(&made) <= node_size(&cond) {
                cond = made;
            }
        }
    }
    if cx.opts.dead_code {
        let lit = eval_if_cond(&cond, cx).or_else(|| eval_if_cond(tail_node(&cond), cx));
        if let Some(lit) = lit {
            return Some(dead_if(n, &cond, &body, alt.as_ref(), lit.truthy(), cx));
        }
    }
    let negated = negate_expr(&cond, cx);
    let self_len = node_size(&cond);
    let neg_len = node_size(&negated);
    let mut negated_is_best = neg_len < self_len;
    if alt.is_some() && negated_is_best {
        negated_is_best = false;
        let new_body = alt.take().unwrap();
        alt = Some(body);
        body = new_body;
        cond = Rc::clone(&negated);
    }
    let body_kind = stmt_kind(&body);
    let alt_kind = match &alt {
        None => StmtClass::Empty,
        Some(a) => stmt_kind(a),
    };
    match (body_kind, alt_kind) {
        (StmtClass::Empty, StmtClass::Empty) => {
            return Some(simple_opt(n, Rc::clone(&cond), cx));
        }
        (StmtClass::Expr(cons), StmtClass::Expr(alt_expr)) => {
            let expr = factor_conditional(n, Rc::clone(&cond), cons, alt_expr, cx);
            return Some(simple_opt(n, expr, cx));
        }
        (StmtClass::Expr(expr), StmtClass::Empty) => {
            let mut use_neg = negated_is_best;
            if self_len == neg_len && !use_neg && is_or(&cond) {
                // `||` needs parens as the left of `&&`; the negated form does not.
                // terser `index.js` `def_optimize(AST_If)` (UglifyJS2 #979).
                use_neg = true;
            }
            let expr = if use_neg {
                binary(n, "||", Rc::clone(&negated), expr)
            } else {
                binary(n, "&&", Rc::clone(&cond), expr)
            };
            return Some(simple_opt(n, expr, cx));
        }
        (StmtClass::Empty, StmtClass::Expr(expr)) => {
            return Some(simple_opt(n, binary(n, "||", Rc::clone(&cond), expr), cx));
        }
        _ => {}
    }
    if let (Some(left), Some(right)) = (as_exit(&body), alt.as_ref().and_then(as_exit)) {
        if left.kind == right.kind {
            return Some(exit_conditional(n, &cond, left, right, cx));
        }
    }
    if alt.is_none() {
        if let Data::If { cond: inner_cond, body: inner_body, alt: None } = &body.data {
            cond = binary(n, "&&", cond, Rc::clone(inner_cond));
            body = Rc::clone(inner_body);
        }
    }
    if aborts(&body) {
        if let Some(alt_stmt) = alt.take() {
            let iff = if_node(n, cond, body, None);
            return Some(finish_block(n, vec![iff, alt_stmt], cx));
        }
    }
    if alt.as_ref().is_some_and(|a| aborts(a)) {
        let orig_body = body;
        body = alt.take().unwrap();
        cond = if negated_is_best { Rc::clone(&negated) } else { negate_expr(&cond, cx) };
        let iff = if_node(n, cond, body, None);
        return Some(finish_block(n, vec![iff, orig_body], cx));
    }
    if Rc::ptr_eq(&cond, &orig_cond) && Rc::ptr_eq(&body, &orig_body) && !alt_changed(&orig_alt, &alt) {
        None
    } else {
        Some(if_node(n, cond, body, alt))
    }
}

enum StmtClass {
    Empty,
    Expr(N),
    Other,
}

fn stmt_kind(n: &N) -> StmtClass {
    match &n.data {
        Data::Empty => StmtClass::Empty,
        Data::Block { body } if body.iter().all(|s| matches!(s.data, Data::Empty)) => StmtClass::Empty,
        Data::Block { body } if body.len() == 1 => stmt_kind(&body[0]),
        Data::Simple { body } => StmtClass::Expr(Rc::clone(body)),
        _ => StmtClass::Other,
    }
}

fn factor_conditional(span: &N, cond: N, cons: N, alt: N, cx: &Cx) -> N {
    if let (Data::Call { expr: left, args: left_args, optional, is_new }, Data::Call { expr: right, args: right_args, .. }) =
        (&cons.data, &alt.data)
    {
        if !*is_new
            && left_args.len() == right_args.len()
            && !left_args.is_empty()
            && callee_ok(left, cx)
            && same_node(left, right)
        {
            let mut diff = None;
            let mut mismatches = 0;
            for (i, (a, b)) in left_args.iter().zip(right_args.iter()).enumerate() {
                if !same_node(a, b) {
                    mismatches += 1;
                    diff = Some(i);
                }
            }
            if mismatches == 1 {
                let i = diff.unwrap();
                let mut args = left_args.clone();
                args[i] = atom(
                    span,
                    Data::Cond {
                        cond,
                        cons: Rc::clone(&left_args[i]),
                        alt: Rc::clone(&right_args[i]),
                    },
                );
                return atom(
                    span,
                    Data::Call {
                        expr: Rc::clone(left),
                        args,
                        optional: *optional,
                        is_new: *is_new,
                    },
                );
            }
        }
    }
    atom(span, Data::Cond { cond, cons, alt })
}

fn callee_ok(expr: &N, cx: &Cx) -> bool {
    match &expr.data {
        Data::Symbol { name, kind: ast::SymKind::Ref, .. } => cx.shadowed(name),
        _ => false,
    }
}

fn same_node(a: &N, b: &N) -> bool {
    match (&a.data, &b.data) {
        (Data::Symbol { name: x, .. }, Data::Symbol { name: y, .. }) => x == y,
        (Data::Number { value: x, .. }, Data::Number { value: y, .. }) => x == y,
        (Data::String { value: x, .. }, Data::String { value: y, .. }) => x == y,
        (Data::True, Data::True) | (Data::False, Data::False) | (Data::Null, Data::Null) => true,
        _ => Rc::ptr_eq(a, b),
    }
}

pub(crate) fn simple(span: &N, body: N) -> N {
    atom(span, Data::Simple { body })
}

pub(crate) fn binary(span: &N, op: &str, left: N, right: N) -> N {
    atom(
        span,
        Data::Binary { op: op.into(), left, right },
    )
}

fn alt_changed(orig: &Option<N>, now: &Option<N>) -> bool {
    match (orig, now) {
        (None, None) => false,
        (Some(a), Some(b)) => !Rc::ptr_eq(a, b),
        _ => true,
    }
}

fn is_empty_stmt(n: &N) -> bool {
    match &n.data {
        Data::Empty => true,
        Data::Block { body } if body.is_empty() => true,
        _ => false,
    }
}

fn is_or(n: &N) -> bool {
    matches!(&n.data, Data::Binary { op, .. } if op == "||")
}

fn if_node(span: &N, cond: N, body: N, alt: Option<N>) -> N {
    atom(span, Data::If { cond, body, alt })
}

fn tail_node(n: &N) -> &N {
    match &n.data {
        Data::Seq { exprs } if !exprs.is_empty() => exprs.last().unwrap(),
        _ => n,
    }
}

/// terser `evaluate.js` `AST_Node.evaluate`: a constant, or nothing when the
/// expression is not a value (or the string would print longer).
fn eval_if_cond(n: &N, cx: &Cx) -> Option<Lit> {
    if !cx.opts.evaluate {
        return None;
    }
    let lit = eval(n)?;
    if let Lit::Str(s) = &lit {
        if !s.is_empty() && utf16_len(s) + 2 > node_size(n) {
            return None;
        }
    }
    Some(lit)
}

fn dead_if(span: &N, cond: &N, body: &N, alt: Option<&N>, truthy: bool, cx: &Cx) -> N {
    let mut stmts = Vec::new();
    if !truthy {
        extract_unreachable(body, &mut stmts, cx, true);
        stmts.push(simple(span, Rc::clone(cond)));
        if let Some(alt) = alt {
            stmts.push(Rc::clone(alt));
        }
    } else {
        stmts.push(simple(span, Rc::clone(cond)));
        stmts.push(Rc::clone(body));
        if let Some(alt) = alt {
            extract_unreachable(alt, &mut stmts, cx, true);
        }
    }
    finish_block(span, stmts, cx)
}

fn finish_block(span: &N, body: Vec<N>, cx: &Cx) -> N {
    let mut out = Vec::new();
    for stat in body {
        if matches!(stat.data, Data::Empty) {
            continue;
        }
        if cx.opts.side_effects {
            if let Data::Simple { body } = &stat.data {
                if statement_pure(body, cx) {
                    continue;
                }
            }
        }
        out.push(stat);
    }
    if out.is_empty() {
        return empty(span);
    }
    if out.len() == 1 && super::can_evict(&out[0]) {
        return out.pop().unwrap();
    }
    atom(span, Data::Block { body: out })
}

fn simple_opt(span: &N, body: N, cx: &Cx) -> N {
    if cx.opts.side_effects && statement_pure(&body, cx) {
        empty(span)
    } else {
        simple(span, body)
    }
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum ExitKind {
    Return,
    Throw,
}

struct ExitPair {
    kind: ExitKind,
    value: Option<N>,
}

fn as_exit(n: &N) -> Option<ExitPair> {
    match &n.data {
        Data::Return { value } => Some(ExitPair { kind: ExitKind::Return, value: value.clone() }),
        Data::Throw { value } => Some(ExitPair { kind: ExitKind::Throw, value: Some(Rc::clone(value)) }),
        _ => None,
    }
}

fn exit_conditional(span: &N, cond: &N, left: ExitPair, right: ExitPair, cx: &Cx) -> N {
    let cons = left.value.unwrap_or_else(|| void0(span));
    let alt = right.value.unwrap_or_else(|| void0(span));
    let value = fold(
        &atom(span, Data::Cond { cond: Rc::clone(cond), cons, alt }),
        cx,
    );
    match left.kind {
        ExitKind::Return => {
            let value = if is_undefined_like(&value) { None } else { Some(value) };
            atom(span, Data::Return { value })
        }
        ExitKind::Throw => atom(span, Data::Throw { value }),
    }
}

fn is_undefined_like(n: &N) -> bool {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "void" && is_pure(expr) => true,
        _ => false,
    }
}

/// terser `inference.js` `aborts`.
fn aborts(n: &N) -> bool {
    match &n.data {
        Data::Return { .. } | Data::Throw { .. } | Data::Break { .. } | Data::Continue { .. } => true,
        Data::Block { body } | Data::StaticBlock { body } => body.iter().any(aborts),
        Data::If { body, alt, .. } => alt.as_ref().is_some_and(|a| aborts(body) && aborts(a)),
        Data::Class { props, .. } => props.iter().any(|p| matches!(p.data, Data::StaticBlock { .. }) && aborts(p)),
        _ => false,
    }
}

/// terser `tighten-body.js` `extract_from_unreachable_code`.
fn extract_unreachable(stat: &N, target: &mut Vec<N>, cx: &Cx, is_root: bool) {
    match &stat.data {
        Data::Defs { kind: ast::DefKind::Var, defs, .. } => {
            if let Some(node) = strip_var_inits(stat, defs) {
                target.push(node);
            }
        }
        Data::Func { kind: ast::FuncKind::Decl, name, .. } => {
            if is_root || cx.lookup("use strict").is_none() {
                if is_root {
                    target.push(Rc::clone(stat));
                } else if let Some(name) = name {
                    target.push(var_from_name(stat, name));
                }
            }
        }
        Data::Export { .. } | Data::Import { .. } => target.push(Rc::clone(stat)),
        Data::Func { .. } | Data::Class { .. } | Data::StaticBlock { .. } | Data::Toplevel { .. } => {}
        Data::Block { body } | Data::Default { body } => {
            for stmt in body {
                extract_unreachable(stmt, target, cx, false);
            }
        }
        Data::If { body, alt, .. } => {
            extract_unreachable(body, target, cx, false);
            if let Some(alt) = alt {
                extract_unreachable(alt, target, cx, false);
            }
        }
        Data::Labeled { body, .. }
        | Data::While { body, .. }
        | Data::Do { body, .. }
        | Data::With { body, .. }
        | Data::Finally { body } => extract_unreachable(body, target, cx, false),
        Data::For { init, body, .. } => {
            if let Some(init) = init {
                extract_unreachable(init, target, cx, false);
            }
            extract_unreachable(body, target, cx, false);
        }
        Data::ForIn { init, body, .. } | Data::ForOf { init, body, .. } => {
            extract_unreachable(init, target, cx, false);
            extract_unreachable(body, target, cx, false);
        }
        Data::Switch { body, .. } => {
            for arm in body {
                extract_unreachable(arm, target, cx, false);
            }
        }
        Data::Case { body, .. } => {
            for stmt in body {
                extract_unreachable(stmt, target, cx, false);
            }
        }
        Data::Try { body, catch, finally } => {
            extract_unreachable(body, target, cx, false);
            if let Some(catch) = catch {
                extract_unreachable(catch, target, cx, false);
            }
            if let Some(finally) = finally {
                extract_unreachable(finally, target, cx, false);
            }
        }
        Data::Catch { body, .. } => extract_unreachable(body, target, cx, false),
        _ => {}
    }
}

fn strip_var_inits(span: &N, defs: &[N]) -> Option<N> {
    let mut out = Vec::new();
    for def in defs {
        let Data::VarDef { name, .. } = &def.data else {
            continue;
        };
        let mut syms = Vec::new();
        binding_symbols(name, &mut syms);
        for sym in syms {
            out.push(atom(def, Data::VarDef { name: sym, value: None }));
        }
    }
    if out.is_empty() {
        None
    } else {
        Some(atom(span, Data::Defs { kind: ast::DefKind::Var, defs: out, await_: false }))
    }
}

fn binding_symbols(n: &N, out: &mut Vec<N>) {
    match &n.data {
        Data::Symbol { .. } => out.push(Rc::clone(n)),
        Data::Destructuring { names, .. } => {
            for name in names {
                binding_symbols(name, out);
            }
        }
        Data::DefaultAssign { left, .. } | Data::Spread { expr: left } => binding_symbols(left, out),
        Data::Prop { value, .. } => binding_symbols(value, out),
        Data::Hole => {}
        _ => {}
    }
}

fn var_from_name(span: &N, name_node: &N) -> N {
    let sym = match &name_node.data {
        Data::Symbol { name, quote, .. } => atom(
            name_node,
            Data::Symbol { name: name.clone(), kind: ast::SymKind::Var, quote: *quote },
        ),
        _ => Rc::clone(name_node),
    };
    atom(
        span,
        Data::Defs {
            kind: ast::DefKind::Var,
            defs: vec![atom(span, Data::VarDef { name: sym, value: None })],
            await_: false,
        },
    )
}

/// terser `inference.js` `negate`. `first_in_statement` is false for an `if` test.
fn negate_expr(n: &N, cx: &Cx) -> N {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "!" => Rc::clone(expr),
        Data::Seq { exprs } if exprs.len() >= 2 => {
            let mut exprs = exprs.clone();
            let last = exprs.pop().unwrap();
            exprs.push(negate_expr(&last, cx));
            sequence(n, exprs)
        }
        Data::Cond { cond, cons, alt } => {
            let flipped = atom(
                n,
                Data::Cond {
                    cond: Rc::clone(cond),
                    cons: negate_expr(cons, cx),
                    alt: negate_expr(alt, cx),
                },
            );
            best_expr(&basic_negate(n), &flipped)
        }
        Data::Binary { op, left, right } => match op.as_str() {
            "==" => binary(n, "!=", Rc::clone(left), Rc::clone(right)),
            "!=" => binary(n, "==", Rc::clone(left), Rc::clone(right)),
            "===" => binary(n, "!==", Rc::clone(left), Rc::clone(right)),
            "!==" => binary(n, "===", Rc::clone(left), Rc::clone(right)),
            "&&" | "||" => {
                let nop = if op == "&&" { "||" } else { "&&" };
                let flipped = binary(n, nop, negate_expr(left, cx), negate_expr(right, cx));
                best_expr(&basic_negate(n), &flipped)
            }
            _ => basic_negate(n),
        },
        _ => basic_negate(n),
    }
}

fn basic_negate(n: &N) -> N {
    unary(n, "!", Rc::clone(n))
}

fn best_expr(a: &N, b: &N) -> N {
    if node_size(a) > node_size(b) { Rc::clone(b) } else { Rc::clone(a) }
}

/// terser `size.js` `AST_Node.size`. Parentheses follow `output.js` `needs_parens`
/// for binaries; the root's parent is the `if`, which adds none.
fn node_size(n: &N) -> usize {
    size_at(n, None)
}

fn size_at(n: &N, parent: Option<&N>) -> usize {
    let own = own_size(n, parent);
    let mut kids = 0usize;
    each_size_child(n, |child| kids += size_at(child, Some(n)));
    own + kids
}

fn own_size(n: &N, parent: Option<&N>) -> usize {
    match &n.data {
        Data::Binary { op, right, .. } | Data::Assign { op, right, .. } => {
            let mut size = if op == "in" { 4 } else { op.len() };
            if op == "+" || op == "-" {
                if let Data::Unary { op: rop, prefix: true, .. } = &right.data {
                    if rop == op {
                        size += 1;
                    }
                }
            }
            size + binary_paren_cost(parent, n, op)
        }
        Data::Unary { op, .. } => match op.as_str() {
            "typeof" => 7,
            "void" => 5,
            _ => op.len(),
        },
        Data::Number { value, .. } => number_size(*value),
        Data::String { value, .. } => utf16_len(value) + 2,
        Data::True => 4,
        Data::False => 5,
        Data::Null => 4,
        Data::Infinity => 8,
        Data::This => 4,
        Data::Symbol { name, .. } => {
            if name == "arguments" { 9 } else { name.chars().count() }
        }
        Data::Cond { .. } => 3,
        Data::Seq { exprs } => exprs.len().saturating_sub(1),
        Data::Array { elements } => 2 + elements.len().saturating_sub(1),
        Data::Call { args, optional, is_new, .. } => {
            let base = if *is_new { 6 } else if *optional { 4 } else { 2 };
            base + args.len().saturating_sub(1)
        }
        Data::Dot { prop, optional, private, .. } => prop.len() + 1 + usize::from(*optional) + usize::from(*private),
        Data::Sub { optional, .. } => {
            if *optional { 4 } else { 2 }
        }
        Data::Object { props } => 2 + props.len().saturating_sub(1),
        _ => 0,
    }
}

fn each_size_child(n: &N, mut f: impl FnMut(&N)) {
    match &n.data {
        Data::Unary { expr, .. }
        | Data::Dot { expr, .. }
        | Data::Chain { expr, .. }
        | Data::Spread { expr, .. }
        | Data::Await { expr, .. } => f(expr),
        Data::Binary { left, right, .. }
        | Data::Assign { left, right, .. }
        | Data::DefaultAssign { left, right } => {
            f(left);
            f(right);
        }
        Data::Cond { cond, cons, alt } => {
            f(cond);
            f(cons);
            f(alt);
        }
        Data::Seq { exprs } | Data::Array { elements: exprs } => {
            for expr in exprs {
                f(expr);
            }
        }
        Data::Call { expr, args, .. } => {
            f(expr);
            for arg in args {
                f(arg);
            }
        }
        Data::Sub { expr, prop, .. } => {
            f(expr);
            f(prop);
        }
        Data::Object { props } => {
            for prop in props {
                f(prop);
            }
        }
        Data::Prop { key, value, .. } => {
            if let Key::Computed(expr) = key {
                f(expr);
            }
            f(value);
        }
        _ => {}
    }
}

fn binary_paren_cost(parent: Option<&N>, node: &N, op: &str) -> usize {
    let Some(p) = parent else {
        return 0;
    };
    let needs = match &p.data {
        Data::Call { expr, .. } if Rc::ptr_eq(expr, node) => true,
        Data::Unary { .. } => true,
        Data::Dot { expr, .. } | Data::Sub { expr, .. } if Rc::ptr_eq(expr, node) => true,
        Data::Binary { op: pop, right, .. } | Data::Assign { op: pop, right, .. } => {
            let mixed = (op == "??" && (pop == "||" || pop == "&&")) || (pop == "??" && (op == "||" || op == "&&"));
            if mixed {
                true
            } else {
                match (prec_rank(pop), prec_rank(op)) {
                    (Some(pp), Some(sp)) => pp > sp || (pp == sp && (Rc::ptr_eq(right, node) || pop == "**")),
                    _ => false,
                }
            }
        }
        Data::PrivateIn { value, .. } => match (prec_rank("in"), prec_rank(op)) {
            (Some(pp), Some(sp)) => pp > sp || (pp == sp && Rc::ptr_eq(value, node)),
            _ => false,
        },
        _ => false,
    };
    if needs { 2 } else { 0 }
}

fn prec_rank(op: &str) -> Option<i32> {
    Some(match op {
        "||" => 1,
        "??" => 2,
        "&&" => 3,
        "|" => 4,
        "^" => 5,
        "&" => 6,
        "==" | "===" | "!=" | "!==" => 7,
        "<" | ">" | "<=" | ">=" | "in" | "instanceof" => 8,
        ">>" | "<<" | ">>>" => 9,
        "+" | "-" => 10,
        "*" | "/" | "%" => 11,
        "**" => 12,
        _ => return None,
    })
}

fn number_size(value: f64) -> usize {
    if value == 0.0 {
        return 1;
    }
    if value > 0.0 && value.is_finite() && value.fract() == 0.0 && value < 1e21 {
        return (value.log10().floor() as usize) + 1;
    }
    if value.is_nan() {
        return 3;
    }
    if value.is_infinite() {
        return if value.is_sign_negative() { 9 } else { 8 };
    }
    let text = format!("{value}");
    let text = text.strip_suffix(".0").unwrap_or(&text);
    let mut len = text.len();
    if text.contains('e') && !text.contains("e-") && !text.contains("e+") {
        len += 1;
    }
    len
}

fn utf16_len(s: &str) -> usize {
    s.encode_utf16().count()
}

/// terser `lib/compress/index.js` `def_optimize(AST_Binary)`.
///
/// Comparisons, `&&` / `||` / `??`, the commutative lhs swap, and `===` → `==`.
/// String-concat, bitwise De Morgan, and template joins stay out of this pass.
fn fold_binary(n: &N, cx: &Cx) -> Option<N> {
    let Data::Binary { .. } = &n.data else {
        return None;
    };
    let mut cur = apply_lhs(n, cx);
    if let Some(lifted) = lift_sequences(&cur, cx) {
        return Some(lifted);
    }
    if cx.opts.comparisons || cx.opts.lhs_constants {
        if let Some(next) = fold_compare(&cur, cx) {
            if !matches!(next.data, Data::Binary { .. }) {
                return Some(next);
            }
            cur = next;
        }
    }
    if let Some(next) = unsafe_comp_reverse(&cur, cx) {
        cur = next;
    }
    if cx.opts.evaluate {
        if let Some(next) = eval_logical(&cur, cx) {
            return Some(next);
        }
        if let Some(next) = plus_to_minus(&cur, cx) {
            return Some(next);
        }
        if let Some(next) = numeric_swap(&cur, cx) {
            cur = next;
        }
    }
    if let Some(next) = reassoc_lazy(&cur) {
        cur = next;
    }
    if Rc::ptr_eq(&cur, n) { None } else { Some(cur) }
}

/// terser `def_optimize(AST_Binary)` `lhs_constants` + `commutativeOperators`.
fn apply_lhs(n: &N, cx: &Cx) -> N {
    let Data::Binary { op, left, right } = &n.data else {
        return Rc::clone(n);
    };
    if !(cx.opts.lhs_constants && commutative(op) && is_constant(right) && !is_constant(left)) {
        return Rc::clone(n);
    }
    let blocked = match &left.data {
        Data::Binary { op: left_op, .. } => prec(left_op) >= prec(op),
        _ => false,
    };
    if blocked {
        Rc::clone(n)
    } else {
        binary(n, op, Rc::clone(right), Rc::clone(left))
    }
}

/// terser `index.js` `AST_Binary.lift_sequences`.
fn lift_sequences(n: &N, cx: &Cx) -> Option<N> {
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
        parts.push(binary(n, op, tail, Rc::clone(right)));
        return Some(tighten_seq(n, parts, cx));
    }
    if let Data::Seq { exprs } = &right.data {
        if exprs.is_empty() || has_side(left, cx) {
            return None;
        }
        let last = exprs.len() - 1;
        let mut i = 0;
        while i < last && !has_side(&exprs[i], cx) {
            i += 1;
        }
        if i == 0 {
            return None;
        }
        if i == last {
            let mut parts = exprs.clone();
            let tail = parts.pop().unwrap();
            parts.push(binary(n, op, Rc::clone(left), tail));
            return Some(tighten_seq(n, parts, cx));
        }
        let mut parts = exprs[..i].to_vec();
        let rest = atom(n, Data::Seq { exprs: exprs[i..].to_vec() });
        parts.push(binary(n, op, Rc::clone(left), rest));
        return Some(tighten_seq(n, parts, cx));
    }
    None
}

/// terser `common.js` `make_sequence` + `def_optimize(AST_Sequence)` side-effect trim.
fn tighten_seq(span: &N, exprs: Vec<N>, cx: &Cx) -> N {
    let mut flat = Vec::new();
    for e in exprs {
        if let Data::Seq { exprs } = &e.data {
            flat.extend(exprs.iter().cloned());
        } else {
            flat.push(e);
        }
    }
    if cx.opts.side_effects && !flat.is_empty() {
        let last = flat.len() - 1;
        flat = flat
            .into_iter()
            .enumerate()
            .filter(|(i, e)| *i == last || has_side(e, cx))
            .map(|(_, e)| e)
            .collect();
    }
    match flat.len() {
        0 => num(span, 0.0),
        1 => maintain_this(cx, flat.pop().unwrap()),
        _ => atom(span, Data::Seq { exprs: flat }),
    }
}

/// terser `common.js` `maintain_this_binding`.
fn maintain_this(cx: &Cx, val: N) -> N {
    let len = cx.stack.len();
    if len < 2 {
        return val;
    }
    let self_n = &cx.stack[len - 1];
    let parent = &cx.stack[len - 2];
    let needs = match &parent.data {
        Data::Unary { op, expr, prefix: true } if op == "delete" && Rc::ptr_eq(expr, self_n) => true,
        Data::Call { expr, .. } if Rc::ptr_eq(expr, self_n) => match &val.data {
            Data::Chain { .. } | Data::Dot { .. } | Data::Sub { .. } => true,
            Data::Symbol { name, kind: ast::SymKind::Ref, .. } if name == "eval" => true,
            _ => false,
        },
        _ => false,
    };
    if needs {
        let zero = num(self_n, 0.0);
        atom(self_n, Data::Seq { exprs: vec![zero, val] })
    } else {
        val
    }
}

/// terser `Compressor.in_boolean_context`.
fn in_boolean_context(cx: &Cx) -> bool {
    if !cx.opts.booleans || cx.stack.len() < 2 {
        return false;
    }
    let mut self_n = cx.stack.last().unwrap().clone();
    for i in (0..cx.stack.len() - 1).rev() {
        let parent = &cx.stack[i];
        if bool_producer(parent, &self_n) {
            return true;
        }
        if bool_continues(parent, &self_n) {
            self_n = Rc::clone(parent);
        } else {
            return false;
        }
    }
    false
}

fn bool_producer(parent: &N, self_n: &N) -> bool {
    match &parent.data {
        Data::Simple { body } => Rc::ptr_eq(body, self_n),
        Data::Cond { cond, .. } | Data::Do { cond, .. } | Data::While { cond, .. } | Data::If { cond, .. } => {
            Rc::ptr_eq(cond, self_n)
        }
        Data::For { cond: Some(cond), .. } => Rc::ptr_eq(cond, self_n),
        Data::Unary { op, expr, prefix: true } if op == "!" => Rc::ptr_eq(expr, self_n),
        _ => false,
    }
}

fn bool_continues(parent: &N, self_n: &N) -> bool {
    match &parent.data {
        Data::Binary { op, .. } if op == "&&" || op == "||" => true,
        Data::Cond { .. } => true,
        Data::Seq { exprs } => exprs.last().is_some_and(|e| Rc::ptr_eq(e, self_n)),
        _ => false,
    }
}

fn left_of(cx: &Cx, op: &str) -> bool {
    let len = cx.stack.len();
    if len < 2 {
        return false;
    }
    let self_n = &cx.stack[len - 1];
    match &cx.stack[len - 2].data {
        Data::Binary { op: pop, left, .. } => pop == op && Rc::ptr_eq(left, self_n),
        _ => false,
    }
}

/// terser `def_optimize(AST_Binary)` `evaluate` switch for `&&`, `||`, and `??`.
fn eval_logical(n: &N, cx: &Cx) -> Option<N> {
    let Data::Binary { op, left, right } = &n.data else {
        return None;
    };
    match op.as_str() {
        "&&" => eval_and(n, left, right, cx),
        "||" => eval_or(n, left, right, cx),
        "??" => eval_nullish(n, left, right, cx),
        _ => None,
    }
}

fn eval_and(span: &N, left: &N, right: &N, cx: &Cx) -> Option<N> {
    if let Some(ll) = eval(left) {
        if !ll.truthy() {
            return Some(maintain_this(cx, Rc::clone(left)));
        }
        return Some(tighten_seq(span, vec![Rc::clone(left), Rc::clone(right)], cx));
    }
    if let Some(rr) = eval(right) {
        if !rr.truthy() {
            if in_boolean_context(cx) {
                return Some(tighten_seq(span, vec![Rc::clone(left), num(span, 0.0)], cx));
            }
        } else if left_of(cx, "&&") || in_boolean_context(cx) {
            return Some(maintain_this(cx, Rc::clone(left)));
        }
    }
    // `(x || false) && y` => `x ? y : false`
    if let Data::Binary { op, left: ll, right: lr } = &left.data {
        if op == "||" {
            if let Some(v) = eval(lr) {
                if !v.truthy() {
                    let node = atom(
                        span,
                        Data::Cond {
                            cond: Rc::clone(ll),
                            cons: Rc::clone(right),
                            alt: Rc::clone(lr),
                        },
                    );
                    return Some(fold_cond(&node).unwrap_or(node));
                }
            }
        }
    }
    None
}

fn eval_or(span: &N, left: &N, right: &N, cx: &Cx) -> Option<N> {
    if let Some(ll) = eval(left) {
        if !ll.truthy() {
            return Some(tighten_seq(span, vec![Rc::clone(left), Rc::clone(right)], cx));
        }
        return Some(maintain_this(cx, Rc::clone(left)));
    }
    if let Some(rr) = eval(right) {
        if !rr.truthy() {
            if left_of(cx, "||") || in_boolean_context(cx) {
                return Some(maintain_this(cx, Rc::clone(left)));
            }
        } else if in_boolean_context(cx) {
            return Some(tighten_seq(span, vec![Rc::clone(left), num(span, 1.0)], cx));
        }
    }
    // `(x && true) || y` => `x ? true : y`
    if let Data::Binary { op, left: ll, right: lr } = &left.data {
        if op == "&&" {
            if let Some(v) = eval(lr) {
                if v.truthy() {
                    let node = atom(
                        span,
                        Data::Cond {
                            cond: Rc::clone(ll),
                            cons: Rc::clone(lr),
                            alt: Rc::clone(right),
                        },
                    );
                    return Some(fold_cond(&node).unwrap_or(node));
                }
            }
        }
    }
    None
}

fn eval_nullish(span: &N, left: &N, right: &N, cx: &Cx) -> Option<N> {
    let _ = span;
    if is_nullish_node(left, cx) {
        return Some(Rc::clone(right));
    }
    if let Some(ll) = eval(left) {
        return Some(if matches!(ll, Lit::Null | Lit::Undef) {
            Rc::clone(right)
        } else {
            Rc::clone(left)
        });
    }
    if in_boolean_context(cx) {
        if let Some(rr) = eval(right) {
            if !rr.truthy() {
                return Some(Rc::clone(left));
            }
        }
    }
    None
}

fn is_nullish_node(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Null => true,
        Data::Unary { op, expr, prefix: true } if op == "void" => !has_side(expr, cx),
        Data::Symbol { name, kind: ast::SymKind::Ref, .. } if name == "undefined" => !cx.shadowed(name),
        _ => false,
    }
}

/// terser `def_optimize(AST_Binary)` `a + -b => a - b` and `-a + b => b - a`.
fn plus_to_minus(n: &N, cx: &Cx) -> Option<N> {
    let Data::Binary { op, left, right } = &n.data else {
        return None;
    };
    if op != "+" {
        return None;
    }
    if let Data::Unary { op: uop, expr, prefix: true } = &right.data {
        if uop == "-" && is_number_or_bigint(left) {
            return Some(binary(n, "-", Rc::clone(left), Rc::clone(expr)));
        }
    }
    if let Data::Unary { op: uop, expr, prefix: true } = &left.data {
        if uop == "-" && reversible(left, right, cx) && is_number_or_bigint(right) {
            return Some(binary(n, "-", Rc::clone(right), Rc::clone(expr)));
        }
    }
    None
}

/// terser `def_optimize(AST_Binary)` `a + +b => +b + a` (`best_of` on `+ * & | ^`).
fn numeric_swap(n: &N, cx: &Cx) -> Option<N> {
    let Data::Binary { op, left, right } = &n.data else {
        return None;
    };
    if !matches!(op.as_str(), "+" | "*" | "&" | "|" | "^") {
        return None;
    }
    if !(is_number_or_bigint(left) && is_number_or_bigint(right) && reversible(left, right, cx)) {
        return None;
    }
    let blocked = match &left.data {
        Data::Binary { op: lop, .. } if lop != op && prec(lop) >= prec(op) => true,
        _ => false,
    };
    if blocked {
        return None;
    }
    let reversed = binary(n, op, Rc::clone(right), Rc::clone(left));
    let prefer_reversed = is_constant(right) && !is_constant(left);
    let pick = if prefer_reversed {
        if print_len(n) > print_len(&reversed) { reversed } else if print_len(n) == print_len(&reversed) { reversed } else { Rc::clone(n) }
    } else if print_len(&reversed) < print_len(n) {
        reversed
    } else {
        Rc::clone(n)
    };
    if Rc::ptr_eq(&pick, n) { None } else { Some(pick) }
}

/// terser `def_optimize(AST_Binary)` `unsafe_comps` reversal of `<` / `<=`.
fn unsafe_comp_reverse(n: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.comparisons || !cx.opts.unsafe_comps || !is_boolean_node(n) {
        return None;
    }
    let Data::Binary { op, left, right } = &n.data else {
        return None;
    };
    let flipped = match op.as_str() {
        "<" => ">",
        "<=" => ">=",
        _ => return None,
    };
    if !reversible(left, right, cx) {
        return None;
    }
    Some(binary(n, flipped, Rc::clone(right), Rc::clone(left)))
}

fn reversible(left: &N, right: &N, cx: &Cx) -> bool {
    is_constant(left) || is_constant(right) || (!has_side(left, cx) && !has_side(right, cx))
}

/// `x && (y && z)` => `(x && y) && z`, and the same for `||` and `??`.
fn reassoc_lazy(n: &N) -> Option<N> {
    let Data::Binary { op, left, right } = &n.data else {
        return None;
    };
    if !matches!(op.as_str(), "&&" | "||" | "??") {
        return None;
    }
    let Data::Binary { op: rop, left: rl, right: rr } = &right.data else {
        return None;
    };
    if rop != op {
        return None;
    }
    let mut cur_left = binary(n, op, Rc::clone(left), Rc::clone(rl));
    let mut cur_right = Rc::clone(rr);
    while let Data::Binary { op: rop, left: rl, right: rr } = &cur_right.data {
        if rop != op {
            break;
        }
        cur_left = binary(n, op, cur_left, Rc::clone(rl));
        cur_right = Rc::clone(rr);
    }
    Some(binary(n, op, cur_left, cur_right))
}

/// terser `inference.js` `AST_Binary.negate`, used from `AST_UnaryPrefix` `!`.
fn fold_not_binary(n: &N, cx: &Cx) -> Option<N> {
    let Data::Unary { op, expr, prefix: true } = &n.data else {
        return None;
    };
    if op != "!" || !matches!(expr.data, Data::Binary { .. }) || !in_boolean_context(cx) {
        return None;
    }
    let neg = negate_binary(expr, cx);
    if print_len(n) > print_len(&neg) {
        Some(neg)
    } else {
        None
    }
}

fn negate_binary(n: &N, cx: &Cx) -> N {
    let Data::Binary { op, left, right } = &n.data else {
        return unary(n, "!", Rc::clone(n));
    };
    if cx.opts.unsafe_comps {
        let flipped = match op.as_str() {
            "<=" => Some(">"),
            "<" => Some(">="),
            ">=" => Some("<"),
            ">" => Some("<="),
            _ => None,
        };
        if let Some(nop) = flipped {
            return binary(n, nop, Rc::clone(left), Rc::clone(right));
        }
    }
    match op.as_str() {
        "==" => binary(n, "!=", Rc::clone(left), Rc::clone(right)),
        "!=" => binary(n, "==", Rc::clone(left), Rc::clone(right)),
        "===" => binary(n, "!==", Rc::clone(left), Rc::clone(right)),
        "!==" => binary(n, "===", Rc::clone(left), Rc::clone(right)),
        "&&" | "||" => {
            let nop = if op == "&&" { "||" } else { "&&" };
            let nl = negate_node(left, cx);
            let nr = negate_node(right, cx);
            let alt = binary(n, nop, nl, nr);
            let wrapped = unary(n, "!", Rc::clone(n));
            if print_len(&wrapped) > print_len(&alt) { alt } else { wrapped }
        }
        _ => unary(n, "!", Rc::clone(n)),
    }
}

fn negate_node(n: &N, cx: &Cx) -> N {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "!" => Rc::clone(expr),
        Data::Binary { .. } => negate_binary(n, cx),
        _ => unary(n, "!", Rc::clone(n)),
    }
}

fn is_boolean_node(n: &N) -> bool {
    is_boolean(n)
}

/// terser `def_optimize(AST_Binary)` object identity and 32-bit `== 0` / mask checks.
fn fold_cmp_bits(span: &N, op: &str, left: &N, right: &N, cx: &Cx) -> Option<N> {
    if same_object_ref(left, right, cx) {
        return Some(bool_value(span, op.starts_with('='), cx));
    }
    if is_32_bit(left) && is_32_bit(right) {
        // Constant comparisons belong to evaluate. `0 == 0` => `!0` here
        // leaves a switch-built `if` unchanged, so `fold_if` never runs.
        if eval(left).is_some() && eval(right).is_some() {
            return None;
        }
        if num_is_zero(left) {
            return Some(booleanify(span, Rc::clone(right), op.starts_with('!'), cx));
        }
        if num_is_zero(right) {
            return Some(booleanify(span, Rc::clone(left), op.starts_with('!'), cx));
        }
        if let Some(masked) = mask_bits(span, op, left, right, cx) {
            if print_len(&masked) < print_len(span) {
                return Some(masked);
            }
        }
    }
    None
}

fn same_object_ref(left: &N, right: &N, cx: &Cx) -> bool {
    let (Data::Symbol { kind: ast::SymKind::Ref, .. }, Data::Symbol { kind: ast::SymKind::Ref, .. }) =
        (&left.data, &right.data)
    else {
        return false;
    };
    let Some(table) = &cx.syms else {
        return false;
    };
    let Some(&idl) = table.node_def.get(&crate::syms::ptr(left)) else {
        return false;
    };
    let Some(&idr) = table.node_def.get(&crate::syms::ptr(right)) else {
        return false;
    };
    if idl != idr {
        return false;
    }
    let Some(fixed) = table.defs.get(idl).and_then(|d| d.fixed.as_ref()) else {
        return false;
    };
    matches!(
        fixed.data,
        Data::Array { .. } | Data::Object { .. } | Data::Func { .. } | Data::Class { .. }
    )
}

fn bool_value(span: &N, truth: bool, cx: &Cx) -> N {
    if cx.opts.booleans && in_boolean_context(cx) {
        num(span, if truth { 1.0 } else { 0.0 })
    } else if cx.opts.booleans {
        unary(span, "!", num(span, if truth { 0.0 } else { 1.0 }))
    } else if truth {
        atom(span, Data::True)
    } else {
        atom(span, Data::False)
    }
}

fn booleanify(span: &N, node: N, truthy: bool, cx: &Cx) -> N {
    if truthy {
        if in_boolean_context(cx) {
            node
        } else {
            unary(span, "!", unary(span, "!", node))
        }
    } else {
        unary(span, "!", node)
    }
}

fn num_is_zero(n: &N) -> bool {
    match &n.data {
        Data::Number { value, .. } => *value == 0.0 && !value.is_nan(),
        _ => false,
    }
}

fn is_32_bit(n: &N) -> bool {
    match &n.data {
        Data::Number { value, .. } => *value == to_int32(*value) as f64,
        Data::Unary { op, expr, prefix: true } if op == "~" => is_number(expr),
        Data::Unary { op, expr, prefix: true } if op == "+" => is_32_bit(expr),
        Data::Binary { op, left, right } if matches!(op.as_str(), "&" | "|" | "^" | "<<" | ">>" | ">>>" | "~") => {
            is_number(left) || is_number(right)
        }
        _ => false,
    }
}

fn mask_bits(span: &N, op: &str, left: &N, right: &N, cx: &Cx) -> Option<N> {
    let (and_op, mask) = if matches!(&left.data, Data::Binary { .. }) {
        (left, right)
    } else if matches!(&right.data, Data::Binary { .. }) {
        (right, left)
    } else {
        return None;
    };
    let Data::Binary { op: aop, left: al, right: ar } = &and_op.data else {
        return None;
    };
    if aop != "&" {
        return None;
    }
    let Data::Number { value, .. } = &mask.data else {
        return None;
    };
    if *value != to_int32(*value) as f64 {
        return None;
    }
    let x = if equivalent(al, mask) {
        ar
    } else if equivalent(ar, mask) {
        al
    } else {
        return None;
    };
    let inner = binary(
        span,
        "&",
        Rc::clone(mask),
        unary(span, "~", Rc::clone(x)),
    );
    Some(booleanify(span, inner, op.starts_with('!'), cx))
}

fn has_side(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::BigInt { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Hole
        | Data::This
        | Data::Infinity
        | Data::RegExp { .. } => false,
        Data::Func { .. } => false,
        Data::Array { elements } => elements.iter().any(|e| has_side(e, cx)),
        Data::Object { props } => props.iter().any(|p| prop_side(p, cx)),
        Data::Class { extends, props, .. } => {
            extends.as_ref().is_some_and(|e| has_side(e, cx)) || props.iter().any(|p| prop_side(p, cx))
        }
        Data::Symbol { name, kind: ast::SymKind::Ref, .. } => !cx.shadowed(name),
        Data::Unary { op, expr, prefix: true } => {
            matches!(op.as_str(), "delete" | "++" | "--") || has_side(expr, cx)
        }
        Data::Unary { .. } => true,
        Data::Binary { op, left, right } if !is_assign(op) => has_side(left, cx) || has_side(right, cx),
        Data::Seq { exprs } => exprs.iter().any(|e| has_side(e, cx)),
        Data::Cond { cond, cons, alt } => has_side(cond, cx) || has_side(cons, cx) || has_side(alt, cx),
        _ => true,
    }
}

fn prop_side(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Prop { key, value, .. } => key_side(key, cx) || has_side(value, cx),
        Data::Field { key, value, .. } => {
            key_side(key, cx) || value.as_ref().is_some_and(|v| has_side(v, cx))
        }
        Data::Spread { expr } => has_side(expr, cx),
        _ => true,
    }
}

fn key_side(key: &ast::Key, cx: &Cx) -> bool {
    match key {
        ast::Key::Computed(expr) => has_side(expr, cx),
        _ => false,
    }
}

fn fold_compare(n: &N, cx: &Cx) -> Option<N> {
    let Data::Binary { op, left, right } = &n.data else {
        return None;
    };
    if cx.opts.comparisons && matches!(op.as_str(), "&&" | "||") {
        if let Some(rewritten) = fold_nullish(n, op, left, right, cx) {
            return Some(rewritten);
        }
    }
    let mut op_s = op.clone();
    let mut left_n = Rc::clone(left);
    let mut right_n = Rc::clone(right);
    if cx.opts.lhs_constants && commutative(&op_s) && is_constant(&right_n) && !is_constant(&left_n) {
        let blocked = match &left_n.data {
            Data::Binary { op: left_op, .. } => prec(left_op) >= prec(&op_s),
            _ => false,
        };
        if !blocked {
            std::mem::swap(&mut left_n, &mut right_n);
        }
    }
    if cx.opts.comparisons {
        let strict = op_s == "===" || op_s == "!==";
        if strict
            && (same_compare_type(&left_n, &right_n) || equivalent(&left_n, &right_n))
        {
            op_s.truncate(2);
        }
        let still_strict = op_s.len() == 3 && (op_s == "===" || op_s == "!==");
        if matches!(op_s.as_str(), "==" | "!=" | "===" | "!==") {
            let mut took = false;
            if !still_strict && is_undefined_value(&left_n, cx) {
                left_n = atom(n, Data::Null);
                took = true;
            } else if !still_strict && is_undefined_value(&right_n, cx) {
                right_n = atom(n, Data::Null);
                took = true;
            } else if cx.opts.typeofs {
                if let Some((left, right, op)) = fold_typeof(&left_n, &right_n, &op_s, n, cx) {
                    left_n = left;
                    right_n = right;
                    op_s = op;
                    took = true;
                }
            }
            // terser `def_optimize(AST_Binary)` `==` / `!=` fall-through:
            // same object ref, and 32-bit compares with `0` or a full mask.
            if !took {
                if let Some(done) = fold_cmp_bits(n, &op_s, &left_n, &right_n, cx) {
                    return Some(done);
                }
            }
        }
    }
    if op_s == *op && Rc::ptr_eq(&left_n, left) && Rc::ptr_eq(&right_n, right) {
        None
    } else {
        Some(binary(n, &op_s, left_n, right_n))
    }
}

fn fold_nullish(span: &N, op: &str, left: &N, right: &N, cx: &Cx) -> Option<N> {
    let want = if op == "&&" { "!==" } else { "===" };
    let (chain, cmp_l): (Option<N>, &N) = match &left.data {
        Data::Binary { op: chain_op, left: chain_left, right: chain_right } if chain_op == op => {
            (Some(Rc::clone(chain_left)), chain_right)
        }
        _ => (None, left),
    };
    let Data::Binary { op: left_op, left: left_l, right: left_r } = &cmp_l.data else {
        return None;
    };
    let Data::Binary { op: right_op, left: right_l, right: right_r } = &right.data else {
        return None;
    };
    if left_op != want || right_op != want || !read_is_pure(left_r, cx) || !equivalent(left_r, right_r) {
        return None;
    }
    let paired = is_undefined_value(left_l, cx) && matches!(right_l.data, Data::Null)
        || matches!(left_l.data, Data::Null) && is_undefined_value(right_l, cx);
    if !paired {
        return None;
    }
    let combined_op = if want == "===" { "==" } else { "!=" };
    let combined = binary(span, combined_op, atom(span, Data::Null), Rc::clone(left_r));
    Some(match chain {
        Some(chain) => binary(span, op, chain, combined),
        None => combined,
    })
}

fn fold_typeof(left: &N, right: &N, op: &str, span: &N, cx: &Cx) -> Option<(N, N, String)> {
    let strict = if op.len() == 2 { format!("{op}=") } else { op.to_string() };
    if let Data::String { value, .. } = &left.data {
        if value == "undefined" {
            if let Data::Unary { op: top, expr, prefix: true } = &right.data {
                if top == "typeof" && typeof_target_ok(expr, cx) {
                    return Some((void0(span), Rc::clone(expr), strict));
                }
            }
        }
    }
    if let Data::Unary { op: top, expr, prefix: true } = &left.data {
        if top == "typeof" {
            if let Data::String { value, .. } = &right.data {
                if value == "undefined" && typeof_target_ok(expr, cx) {
                    return Some((Rc::clone(expr), void0(span), strict));
                }
            }
        }
    }
    None
}

fn typeof_target_ok(expr: &N, cx: &Cx) -> bool {
    match &expr.data {
        Data::Symbol { name, kind: ast::SymKind::Ref, .. } => cx.shadowed(name),
        Data::Dot { .. } | Data::Sub { .. } => !cx.opts.ie8,
        _ => true,
    }
}

fn commutative(op: &str) -> bool {
    matches!(op, "==" | "===" | "!=" | "!==" | "*" | "&" | "|" | "^")
}

fn prec(op: &str) -> i32 {
    match op {
        "**" => 15,
        "*" | "/" | "%" => 14,
        "+" | "-" => 13,
        "<<" | ">>" | ">>>" => 12,
        "<" | "<=" | ">" | ">=" | "in" | "instanceof" => 11,
        "==" | "!=" | "===" | "!==" => 10,
        "&" => 9,
        "^" => 8,
        "|" => 7,
        "&&" => 6,
        "||" | "??" => 5,
        _ => 0,
    }
}

fn is_constant(n: &N) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::BigInt { .. }
        | Data::True
        | Data::False
        | Data::Null => true,
        Data::Unary { op, expr, prefix: true } => {
            matches!(op.as_str(), "!" | "~" | "-" | "+" | "void") && is_constant(expr)
        }
        _ => false,
    }
}

fn is_undefined_value(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "void" && is_pure(expr) => true,
        Data::Symbol { name, kind: ast::SymKind::Ref, .. } if name == "undefined" && !cx.shadowed(name) => true,
        _ => false,
    }
}

fn read_is_pure(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Symbol { name, kind: ast::SymKind::Ref, .. } => cx.shadowed(name),
        _ => is_pure(n),
    }
}

fn same_compare_type(left: &N, right: &N) -> bool {
    is_string(left) && is_string(right)
        || is_number(left) && is_number(right)
        || is_bigint(left) && is_bigint(right)
        || is_boolean(left) && is_boolean(right)
}

fn is_boolean(n: &N) -> bool {
    match &n.data {
        Data::True | Data::False => true,
        Data::Unary { op, prefix: true, .. } => matches!(op.as_str(), "!" | "delete"),
        Data::Binary { op, left, right } => {
            matches!(op.as_str(), "in" | "instanceof" | "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">=")
                || matches!(op.as_str(), "&&" | "||" | "??") && is_boolean(left) && is_boolean(right)
        }
        _ => false,
    }
}

pub(crate) fn is_number(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } => true,
        Data::Unary { op, expr, prefix: true } => {
            matches!(op.as_str(), "+" | "-" | "~") && is_number(expr)
        }
        Data::Binary { op, left, right } => {
            if op == "+" {
                is_number(left) && is_number_or_bigint(right) || is_number(right) && is_number_or_bigint(left)
            } else if matches!(op.as_str(), "-" | "*" | "/" | "%" | "&" | "|" | "^" | "<<" | ">>" | ">>>") {
                is_number(left) || is_number(right)
            } else {
                false
            }
        }
        _ => false,
    }
}

fn is_number_or_bigint(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::BigInt { .. } => true,
        Data::Unary { op, prefix: true, .. } => matches!(op.as_str(), "+" | "-" | "~"),
        Data::Binary { op, left, right } => {
            if op == "+" {
                is_number_or_bigint(left) && is_number_or_bigint(right)
            } else {
                matches!(op.as_str(), "-" | "*" | "/" | "%" | "&" | "|" | "^" | "<<" | ">>")
            }
        }
        _ => false,
    }
}

fn is_bigint(n: &N) -> bool {
    matches!(n.data, Data::BigInt { .. })
}

fn is_string(n: &N) -> bool {
    match &n.data {
        Data::String { .. } => true,
        Data::Unary { op, prefix: true, .. } => op == "typeof",
        Data::Binary { op, left, right } if op == "+" => is_string(left) || is_string(right),
        _ => false,
    }
}

fn equivalent(a: &N, b: &N) -> bool {
    match (&a.data, &b.data) {
        (Data::Symbol { name: n1, kind: k1, .. }, Data::Symbol { name: n2, kind: k2, .. }) => n1 == n2 && k1 == k2,
        (
            Data::Dot { expr: e1, prop: p1, optional: o1, private: v1, .. },
            Data::Dot { expr: e2, prop: p2, optional: o2, private: v2, .. },
        ) => p1 == p2 && o1 == o2 && v1 == v2 && equivalent(e1, e2),
        (Data::Sub { expr: e1, prop: p1, optional: o1 }, Data::Sub { expr: e2, prop: p2, optional: o2 }) => {
            o1 == o2 && equivalent(e1, e2) && equivalent(p1, p2)
        }
        (Data::Unary { op: o1, expr: e1, prefix: p1 }, Data::Unary { op: o2, expr: e2, prefix: p2 }) => {
            o1 == o2 && p1 == p2 && equivalent(e1, e2)
        }
        (Data::Binary { op: o1, left: l1, right: r1 }, Data::Binary { op: o2, left: l2, right: r2 }) => {
            o1 == o2 && equivalent(l1, l2) && equivalent(r1, r2)
        }
        (Data::Call { expr: e1, args: a1, optional: o1, is_new: n1 }, Data::Call { expr: e2, args: a2, optional: o2, is_new: n2 }) => {
            o1 == o2 && n1 == n2 && equivalent(e1, e2) && a1.len() == a2.len() && a1.iter().zip(a2).all(|(x, y)| equivalent(x, y))
        }
        (Data::Number { value: v1, .. }, Data::Number { value: v2, .. }) => v1.to_bits() == v2.to_bits(),
        (Data::String { value: s1, .. }, Data::String { value: s2, .. }) => s1 == s2,
        (Data::BigInt { value: v1 }, Data::BigInt { value: v2 }) => v1 == v2,
        (Data::True, Data::True) | (Data::False, Data::False) | (Data::Null, Data::Null) | (Data::This, Data::This) => true,
        _ => false,
    }
}

/// terser `lib/compress/index.js` `def_optimize(AST_Dot)` and `def_optimize(AST_Sub)`.
fn fold_prop_access(n: &N, cx: &Cx) -> Option<N> {
    match &n.data {
        Data::Sub { .. } => fold_sub(n, cx, 0),
        Data::Dot { .. } => fold_dot(n, cx, 0),
        _ => None,
    }
}

/// terser `lib/compress/index.js` `def_optimize(AST_Sub)`.
fn fold_sub(n: &N, cx: &Cx, depth: u8) -> Option<N> {
    if depth > 6 {
        return None;
    }
    let Data::Sub { expr, prop, optional } = &n.data else {
        return None;
    };
    let mut prop_node = Rc::clone(prop);
    let mut evaluated = false;
    let mut property = String::new();
    if cx.opts.properties && cx.opts.evaluate {
        if let Some(lit) = eval(prop) {
            let key = normalize_prop_key(lit);
            let constant = lit_node(prop, prop_key_lit(&key), cx);
            prop_node = best_of_expr(prop, constant);
            property = prop_key_string(&key);
            evaluated = true;
            if is_basic_ident(&property) && property.len() <= terser_size(&prop_node) + 1 {
                let quote = match &prop_node.data {
                    Data::String { quote, .. } => Some(*quote),
                    _ => None,
                };
                let dot = atom(
                    n,
                    Data::Dot {
                        expr: Rc::clone(expr),
                        prop: property,
                        optional: *optional,
                        quote,
                        private: false,
                    },
                );
                return Some(fold_dot(&dot, cx, depth + 1).unwrap_or(dot));
            }
        }
    }
    if cx.in_lhs {
        return changed_sub(n, expr, &prop_node, *optional, prop);
    }
    if evaluated && cx.opts.properties {
        if let Some(flat) = flatten_object(expr, &property, n, cx) {
            return Some(fold_sub(&flat, cx, depth + 1).unwrap_or(flat));
        }
    }
    if let Some(extracted) = extract_array(n, expr, &prop_node, cx) {
        return Some(extracted);
    }
    if cx.opts.evaluate && !*optional {
        if let Some(folded) = eval_length_sub(n, expr, &prop_node, cx) {
            return Some(folded);
        }
    }
    changed_sub(n, expr, &prop_node, *optional, prop)
}

fn changed_sub(span: &N, expr: &N, prop: &N, optional: bool, orig_prop: &N) -> Option<N> {
    if Rc::ptr_eq(prop, orig_prop) {
        return None;
    }
    Some(atom(
        span,
        Data::Sub { expr: Rc::clone(expr), prop: Rc::clone(prop), optional },
    ))
}

/// terser `lib/compress/index.js` `def_optimize(AST_Dot)`.
fn fold_dot(n: &N, cx: &Cx, depth: u8) -> Option<N> {
    if depth > 6 {
        return None;
    }
    let Data::Dot { expr, prop, optional, private, .. } = &n.data else {
        return None;
    };
    if cx.in_lhs || *private {
        return None;
    }
    if cx.opts.properties && !skip_flatten(cx) {
        if let Some(flat) = flatten_object(expr, prop, n, cx) {
            return Some(fold_sub(&flat, cx, depth + 1).unwrap_or(flat));
        }
    }
    // A chain `a.b.c` evaluates at the outer access. The middle read stays.
    if expr.is_prop_access() && cx.parent().is_some_and(|p| p.is_prop_access()) {
        return None;
    }
    if cx.opts.evaluate && !*optional && prop == "length" {
        if let Some(folded) = eval_length(n, expr, cx) {
            return Some(folded);
        }
    }
    None
}

/// terser `lib/compress/index.js` `AST_PropAccess.flatten_object`.
fn flatten_object(expr: &N, key: &str, span: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.properties || key == "__proto__" {
        return None;
    }
    let Data::Object { props } = &expr.data else {
        return None;
    };
    if props.is_empty() || !props.iter().all(plain_keyval) {
        return None;
    }
    let mut found = None;
    for (i, prop) in props.iter().enumerate().rev() {
        let Data::Prop { key: prop_key, .. } = &prop.data else {
            return None;
        };
        let Key::Static { name, .. } = prop_key else {
            return None;
        };
        if name == key {
            found = Some(i);
            break;
        }
    }
    let i = found?;
    let Data::Prop { value, .. } = &props[i].data else {
        return None;
    };
    if !safe_to_flatten(value, cx) {
        return None;
    }
    let elements = props
        .iter()
        .map(|prop| match &prop.data {
            Data::Prop { value, .. } => Rc::clone(value),
            _ => unreachable!(),
        })
        .collect();
    Some(atom(
        span,
        Data::Sub {
            expr: atom(expr, Data::Array { elements }),
            prop: num(span, i as f64),
            optional: false,
        },
    ))
}

fn plain_keyval(n: &N) -> bool {
    matches!(n.data, Data::Prop { method: None, key: Key::Static { .. }, .. })
}

/// terser `lib/compress/index.js` `safe_to_flatten`.
fn safe_to_flatten(value: &N, cx: &Cx) -> bool {
    let resolved = if matches!(value.data, Data::Symbol { kind: SymKind::Ref, .. }) {
        match fixed_of(value, cx) {
            Some(v) => v,
            None => return false,
        }
    } else {
        value
    };
    if matches!(resolved.data, Data::Func { .. }) && contains_this(resolved) {
        return cx.parent().is_some_and(|p| matches!(p.data, Data::Call { is_new: true, .. }));
    }
    true
}

fn fixed_of<'a>(n: &N, cx: &'a Cx) -> Option<&'a N> {
    let table = cx.syms.as_ref()?;
    let id = *table.node_def.get(&crate::syms::ptr(n))?;
    table.defs.get(id)?.fixed.as_ref()
}

/// terser `lib/compress/inference.js` `contains_this`. Nested functions hide their own `this`.
fn contains_this(root: &N) -> bool {
    fn rec(n: &N) -> bool {
        match &n.data {
            Data::This => return true,
            Data::Func { kind, .. } if *kind != FuncKind::Arrow => return false,
            Data::Class { .. } => return false,
            _ => {}
        }
        any_child(n, rec)
    }
    match &root.data {
        Data::Func { body, .. } => body.iter().any(rec),
        Data::Class { .. } => false,
        _ => rec(root),
    }
}

fn any_child(n: &N, mut f: impl FnMut(&N) -> bool) -> bool {
    let mut hit = false;
    let mut go = |c: &N| {
        if !hit {
            hit = f(c);
        }
    };
    match &n.data {
        Data::Toplevel { body } | Data::Block { body } | Data::StaticBlock { body } | Data::Default { body } => {
            body.iter().for_each(&mut go);
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
            if let Some(v) = init { go(v); }
            if let Some(v) = cond { go(v); }
            if let Some(v) = step { go(v); }
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
        Data::Catch { arg, body } => {
            if let Some(arg) = arg {
                go(arg);
            }
            go(body);
        }
        Data::If { cond, body, alt } => {
            go(cond);
            go(body);
            if let Some(a) = alt { go(a); }
        }
        Data::Switch { expr, body } => {
            go(expr);
            body.iter().for_each(&mut go);
        }
        Data::Case { expr, body } => {
            go(expr);
            body.iter().for_each(&mut go);
        }
        Data::Try { body, catch, finally } => {
            go(body);
            if let Some(v) = catch { go(v); }
            if let Some(v) = finally { go(v); }
        }
        Data::Defs { defs, .. } => defs.iter().for_each(&mut go),
        Data::VarDef { name, value } => {
            go(name);
            if let Some(v) = value { go(v); }
        }
        Data::Func { name, args, body, .. } => {
            if let Some(name) = name { go(name); }
            args.iter().for_each(&mut go);
            body.iter().for_each(&mut go);
        }
        Data::Class { name, extends, props, .. } => {
            if let Some(name) = name { go(name); }
            if let Some(e) = extends { go(e); }
            props.iter().for_each(&mut go);
        }
        Data::Array { elements } | Data::Seq { exprs: elements } | Data::DynImport { args: elements, .. } => {
            elements.iter().for_each(&mut go);
        }
        Data::Object { props } => props.iter().for_each(&mut go),
        Data::Prop { key, value, .. } => {
            if let Key::Computed(e) = key { go(e); }
            go(value);
        }
        Data::Field { key, value, .. } => {
            if let Key::Computed(e) = key { go(e); }
            if let Some(v) = value { go(v); }
        }
        Data::Sub { expr, prop, .. } => {
            go(expr);
            go(prop);
        }
        Data::Call { expr, args, .. } => {
            go(expr);
            args.iter().for_each(&mut go);
        }
        Data::Binary { left, right, .. }
        | Data::Assign { left, right, .. }
        | Data::DefaultAssign { left, right }
        | Data::PrivateIn { key: left, value: right } => {
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
                if let Seg::Expr(e) = seg { go(e); }
            }
        }
        Data::TaggedTemplate { tag, template } => {
            go(tag);
            go(template);
        }
        Data::Destructuring { names, .. } => names.iter().for_each(&mut go),
        _ => {}
    }
    hit
}

/// terser `lib/compress/index.js` `def_optimize(AST_Sub)` array-index arm.
fn extract_array(span: &N, expr: &N, prop: &N, cx: &Cx) -> Option<N> {
    if !(cx.opts.properties && cx.opts.side_effects) {
        return None;
    }
    let Data::Number { value, .. } = &prop.data else {
        return None;
    };
    let index = array_index(*value)?;
    let Data::Array { elements } = &expr.data else {
        return None;
    };
    if index >= elements.len() {
        return None;
    }
    let ret_value = &elements[index];
    if matches!(ret_value.data, Data::Spread { .. }) || !safe_to_flatten(ret_value, cx) {
        return None;
    }
    for (i, el) in elements.iter().enumerate() {
        if i == index {
            continue;
        }
        if matches!(el.data, Data::Spread { .. } | Data::Hole) {
            return None;
        }
        if i > index && expr_has_side_effects(el, cx) {
            return None;
        }
    }
    let ret_node = if matches!(ret_value.data, Data::Hole) {
        void0(ret_value)
    } else {
        Rc::clone(ret_value)
    };
    let mut values = Vec::new();
    for el in elements.iter().take(index) {
        if expr_has_side_effects(el, cx) {
            values.push(Rc::clone(el));
        }
    }
    values.push(ret_node);
    Some(make_seq(span, values))
}

fn array_index(n: f64) -> Option<usize> {
    if !n.is_finite() || n < 0.0 || n.fract() != 0.0 || n > usize::MAX as f64 {
        return None;
    }
    let i = n as usize;
    if i as f64 == n { Some(i) } else { None }
}

fn make_seq(span: &N, exprs: Vec<N>) -> N {
    let mut flat = Vec::new();
    for e in exprs {
        if let Data::Seq { exprs } = &e.data {
            flat.extend(exprs.iter().cloned());
        } else {
            flat.push(e);
        }
    }
    sequence(span, flat)
}

/// terser `lib/compress/evaluate.js` `def_eval(AST_PropAccess)` for `.length`.
fn eval_length(span: &N, expr: &N, cx: &Cx) -> Option<N> {
    if let Some(Lit::Str(s)) = eval(expr) {
        let len = js_str_len(&s, string_units(expr));
        return Some(prefer(span, lit_node(span, Lit::Num(len), cx)));
    }
    let Data::Array { elements } = &expr.data else {
        return None;
    };
    if elements.iter().any(|el| matches!(el.data, Data::Spread { .. }) || expr_has_side_effects(el, cx)) {
        return None;
    }
    Some(prefer(span, lit_node(span, Lit::Num(elements.len() as f64), cx)))
}

fn eval_length_sub(span: &N, expr: &N, prop: &N, cx: &Cx) -> Option<N> {
    let Data::String { value, .. } = &prop.data else {
        return None;
    };
    if value != "length" {
        return None;
    }
    eval_length(span, expr, cx)
}

fn string_units(n: &N) -> Option<&Vec<u16>> {
    match &n.data {
        Data::String { units, .. } => units.as_ref(),
        _ => None,
    }
}

fn js_str_len(value: &str, units: Option<&Vec<u16>>) -> f64 {
    if let Some(units) = units {
        return units.len() as f64;
    }
    value.chars().map(|c| if (c as u32) > 0xFFFF { 2 } else { 1 }).sum::<usize>() as f64
}

fn skip_flatten(cx: &Cx) -> bool {
    cx.parent().is_some_and(|p| matches!(p.data, Data::Call { .. }) && has_noinline(p))
}

fn has_noinline(n: &N) -> bool {
    n.start.as_ref().is_some_and(|t| {
        t.comments_before.iter().any(|c| {
            c.value.contains("@__NOINLINE__") || c.value.contains("#__NOINLINE__")
        })
    })
}

enum PropKey {
    Str(String),
    Num(f64),
    Bool(bool),
    Null,
    Undef,
}

/// terser `lib/compress/index.js` `def_optimize(AST_Sub)` string-key rewrite.
fn normalize_prop_key(lit: Lit) -> PropKey {
    match lit {
        Lit::Str(s) if s == "undefined" => PropKey::Undef,
        Lit::Str(s) => {
            if let Some(n) = canonical_number(&s) {
                PropKey::Num(n)
            } else {
                PropKey::Str(s)
            }
        }
        Lit::Num(n) => PropKey::Num(n),
        Lit::Bool(b) => PropKey::Bool(b),
        Lit::Null => PropKey::Null,
        Lit::Undef => PropKey::Undef,
    }
}

fn prop_key_lit(key: &PropKey) -> Lit {
    match key {
        PropKey::Str(s) => Lit::Str(s.clone()),
        PropKey::Num(n) => Lit::Num(*n),
        PropKey::Bool(b) => Lit::Bool(*b),
        PropKey::Null => Lit::Null,
        PropKey::Undef => Lit::Undef,
    }
}

fn prop_key_string(key: &PropKey) -> String {
    match key {
        PropKey::Str(s) => s.clone(),
        PropKey::Num(n) => js_num_tostring(*n),
        PropKey::Bool(true) => "true".into(),
        PropKey::Bool(false) => "false".into(),
        PropKey::Null => "null".into(),
        PropKey::Undef => "undefined".into(),
    }
}

/// `parseFloat(key).toString() == key`.
fn canonical_number(key: &str) -> Option<f64> {
    if key.is_empty() {
        return None;
    }
    let n: f64 = key.parse().ok()?;
    if js_num_tostring(n) == key { Some(n) } else { None }
}

/// JavaScript `Number.prototype.toString`.
fn js_num_tostring(n: f64) -> String {
    if n.is_nan() {
        return "NaN".into();
    }
    if n == 0.0 {
        return "0".into();
    }
    if n.is_infinite() {
        return if n.is_sign_negative() { "-Infinity".into() } else { "Infinity".into() };
    }
    let neg = n.is_sign_negative();
    let mut buf = ryu::Buffer::new();
    let body = reformat_ryu(buf.format_finite(n.abs()));
    if neg { format!("-{body}") } else { body }
}

fn reformat_ryu(raw: &str) -> String {
    let (mant, exp10) = match raw.split_once('e') {
        Some((m, e)) => (m, e.parse::<i32>().unwrap_or(0)),
        None => (raw, 0),
    };
    let mut digits = String::new();
    let mut point = None;
    for c in mant.chars() {
        if c == '.' {
            point = Some(digits.len());
        } else if c.is_ascii_digit() {
            digits.push(c);
        }
    }
    if digits.is_empty() {
        return "0".into();
    }
    let point = point.unwrap_or(digits.len());
    let mut exp = exp10 - (digits.len() as i32 - point as i32);
    while digits.len() > 1 && digits.ends_with('0') {
        digits.pop();
        exp += 1;
    }
    let leading = digits.chars().take_while(|c| *c == '0').count();
    if leading > 0 {
        if leading == digits.len() {
            return "0".into();
        }
        digits = digits[leading..].to_string();
    }
    let k = digits.len() as i32;
    let n = exp + k;
    if k <= n && n <= 21 {
        let mut out = digits;
        for _ in 0..(n - k) {
            out.push('0');
        }
        return out;
    }
    if n > 0 && n <= 21 {
        let n = n as usize;
        let mut out = String::new();
        out.push_str(&digits[..n]);
        out.push('.');
        out.push_str(&digits[n..]);
        return out;
    }
    if n > -6 && n <= 0 {
        let mut out = String::from("0.");
        for _ in 0..(-n) {
            out.push('0');
        }
        out.push_str(&digits);
        return out;
    }
    let exp_s = format_exp(n - 1);
    if k == 1 {
        format!("{digits}{exp_s}")
    } else {
        format!("{}.{}{exp_s}", &digits[..1], &digits[1..])
    }
}

fn format_exp(exp: i32) -> String {
    if exp >= 0 { format!("e+{exp}") } else { format!("e{exp}") }
}

fn best_of_expr(orig: &N, alt: N) -> N {
    if terser_size(&alt) < terser_size(orig) { alt } else { Rc::clone(orig) }
}

/// terser `lib/size.js` `AST_Node.size` for a property key.
fn terser_size(n: &N) -> usize {
    let here = match &n.data {
        Data::String { value, .. } => value.len() + 2,
        Data::Number { value, .. } => number_size(*value),
        Data::BigInt { value } => value.len(),
        Data::Null => 4,
        Data::True => 4,
        Data::False => 5,
        Data::Infinity => 8,
        Data::This => 4,
        Data::Hole => 0,
        Data::Unary { op, .. } => match op.as_str() {
            "typeof" => 7,
            "void" => 5,
            _ => op.len(),
        },
        Data::Binary { op, right, .. } => {
            let mut s = if op == "in" { 4 } else { op.len() };
            if matches!(op.as_str(), "+" | "-") {
                if let Data::Unary { op: rop, .. } = &right.data {
                    if rop == op {
                        s += 1;
                    }
                }
            }
            s
        }
        Data::Symbol { name, .. } => if name == "arguments" { 9 } else { name.len() },
        Data::Dot { prop, optional, private, .. } => {
            prop.len() + if *private { if *optional { 3 } else { 2 } } else if *optional { 2 } else { 1 }
        }
        Data::Sub { optional, .. } => if *optional { 4 } else { 2 },
        Data::Array { elements } => 2 + list_overhead(elements.len()),
        Data::Seq { exprs } => list_overhead(exprs.len()),
        Data::Cond { .. } => 3,
        Data::Call { args, is_new, optional, .. } => {
            (if *is_new { 6 } else { 2 }) + if *optional { 2 } else { 0 } + list_overhead(args.len())
        }
        _ => return print_len(n),
    };
    here + match &n.data {
        Data::Unary { expr, .. } | Data::Dot { expr, .. } | Data::Await { expr } | Data::Spread { expr } | Data::Chain { expr } => {
            terser_size(expr)
        }
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } => terser_size(left) + terser_size(right),
        Data::Sub { expr, prop, .. } => terser_size(expr) + terser_size(prop),
        Data::Cond { cond, cons, alt } => terser_size(cond) + terser_size(cons) + terser_size(alt),
        Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().map(terser_size).sum(),
        Data::Call { expr, args, .. } => terser_size(expr) + args.iter().map(terser_size).sum::<usize>(),
        _ => 0,
    }
}

fn list_overhead(len: usize) -> usize {
    len.saturating_sub(1)
}

/// terser `lib/compress/inference.js` `has_side_effects` for receivers and array elements.
fn expr_has_side_effects(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Infinity
        | Data::BigInt { .. }
        | Data::RegExp { .. }
        | Data::This
        | Data::Func { .. } => false,
        Data::Hole | Data::Spread { .. } => true,
        Data::Symbol { name, kind: SymKind::Ref, .. } => !symbol_read_pure(name, cx),
        Data::Unary { op, expr, prefix: true } => {
            matches!(op.as_str(), "delete" | "++" | "--") || expr_has_side_effects(expr, cx)
        }
        Data::Unary { .. } => true,
        Data::Binary { op, left, right } => {
            is_assign(op) || expr_has_side_effects(left, cx) || expr_has_side_effects(right, cx)
        }
        Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().any(|e| expr_has_side_effects(e, cx)),
        Data::Object { props } => props.iter().any(|p| match &p.data {
            Data::Prop { key, value, method, .. } => {
                method.is_some()
                    || matches!(key, Key::Computed(e) if expr_has_side_effects(e, cx))
                    || expr_has_side_effects(value, cx)
            }
            _ => true,
        }),
        Data::Cond { cond, cons, alt } => {
            expr_has_side_effects(cond, cx) || expr_has_side_effects(cons, cx) || expr_has_side_effects(alt, cx)
        }
        Data::Dot { expr, optional, .. } => {
            (!*optional && may_throw_on_access(expr, cx)) || expr_has_side_effects(expr, cx)
        }
        Data::Sub { expr, prop, optional } => {
            (!*optional && may_throw_on_access(expr, cx))
                || expr_has_side_effects(expr, cx)
                || expr_has_side_effects(prop, cx)
        }
        _ => true,
    }
}

fn symbol_read_pure(name: &str, cx: &Cx) -> bool {
    if cx.in_with {
        return false;
    }
    cx.shadowed(name) || matches!(name, "Number" | "String" | "Array" | "Object" | "Function" | "Promise")
}

/// terser `lib/compress/inference.js` `may_throw_on_access`.
fn may_throw_on_access(n: &N, cx: &Cx) -> bool {
    if cx.opts.pure_getters == crate::PureGetters::Off {
        return true;
    }
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::True
        | Data::False
        | Data::BigInt { .. }
        | Data::Infinity
        | Data::RegExp { .. }
        | Data::Array { .. }
        | Data::Func { .. }
        | Data::Class { .. } => false,
        Data::Unary { op, .. } if op == "void" => true,
        Data::Unary { .. } => false,
        Data::Null => true,
        Data::Object { props } => props.iter().any(|p| !plain_keyval(p)),
        Data::Seq { exprs } => exprs.last().is_some_and(|e| may_throw_on_access(e, cx)),
        _ => true,
    }
}

fn is_basic_ident(value: &str) -> bool {
    let mut chars = value.chars();
    match chars.next() {
        Some(c) if c.is_ascii_alphabetic() || c == '_' || c == '$' => {}
        _ => return false,
    }
    chars.all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '$')
}

fn fold_while(n: &N) -> Option<N> {
    let Data::While { cond, body } = &n.data else {
        return None;
    };
    Some(atom(
        n,
        Data::For {
            init: None,
            cond: Some(Rc::clone(cond)),
            step: None,
            body: Rc::clone(body),
        },
    ))
}


pub(crate) fn only_pure_decls(body: &[N], cx: &Cx) -> bool {
    !body.is_empty() && body.iter().all(|s| pure_decl(s, cx))
}

fn pure_decl(n: &N, cx: &Cx) -> bool {
    match &n.data {
        Data::Empty => true,
        Data::Defs { kind: ast::DefKind::Let | ast::DefKind::Const, defs, .. } => defs.iter().all(|d| match &d.data {
            Data::VarDef { value: None, .. } => true,
            Data::VarDef { value: Some(v), .. } => statement_pure(v, cx),
            _ => false,
        }),
        Data::Class { extends: None, props, .. } => props.iter().all(|p| match &p.data {
            Data::Prop { key, value, .. } => pure_key(key, cx) && matches!(value.data, Data::Func { .. }),
            Data::Field { key, value, .. } => {
                pure_key(key, cx) && value.as_ref().map(|v| statement_pure(v, cx)).unwrap_or(true)
            }
            _ => false,
        }),
        _ => false,
    }
}

fn pure_key(key: &Key, cx: &Cx) -> bool {
    match key {
        Key::Computed(expr) => statement_pure(expr, cx),
        _ => true,
    }
}

fn unwrap_void_statement(n: &N, cx: &Cx) -> Option<N> {
    let Data::Simple { body } = &n.data else {
        return None;
    };
    let Data::Unary { op, expr, prefix: true } = &body.data else {
        return None;
    };
    if op != "void" {
        return None;
    }
    if statement_pure(expr, cx) {
        Some(empty(n))
    } else {
        Some(simple(n, Rc::clone(expr)))
    }
}


fn walk_children(data: &Data, mut f: impl FnMut(&N) -> bool) -> bool {
    let mut hit = false;
    let mut go = |n: &N| {
        if !hit {
            hit = f(n);
        }
    };
    match data {
        Data::Simple { body }
        | Data::Throw { value: body }
        | Data::Spread { expr: body }
        | Data::Unary { expr: body, .. }
        | Data::Await { expr: body }
        | Data::Return { value: Some(body) }
        | Data::Chain { expr: body }
        | Data::Dot { expr: body, .. } => go(body),
        Data::Binary { left, right, .. }
        | Data::Assign { left, right, .. }
        | Data::DefaultAssign { left, right }
        | Data::PrivateIn { key: left, value: right } => {
            go(left);
            go(right);
        }
        Data::Sub { expr, prop, .. } => {
            go(expr);
            go(prop);
        }
        Data::Cond { cond, cons, alt } => {
            go(cond);
            go(cons);
            go(alt);
        }
        Data::Call { expr, args, .. } => {
            go(expr);
            args.iter().for_each(&mut go);
        }
        Data::DynImport { args, .. } => args.iter().for_each(&mut go),
        Data::Array { elements } | Data::Seq { exprs: elements } => elements.iter().for_each(&mut go),
        Data::Object { props } => props.iter().for_each(&mut go),
        Data::Prop { key, value, .. } => {
            if let Key::Computed(expr) = key {
                go(expr);
            }
            go(value);
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
        Data::If { cond, body, alt } => {
            go(cond);
            go(body);
            if let Some(alt) = alt {
                go(alt);
            }
        }
        Data::Yield { expr, .. } => {
            if let Some(expr) = expr {
                go(expr);
            }
        }
        _ => {}
    }
    hit
}

fn sequence(span: &N, exprs: Vec<N>) -> N {
    if exprs.len() == 1 {
        return exprs.into_iter().next().unwrap();
    }
    atom(span, Data::Seq { exprs })
}

fn negate_iife(n: &N) -> Option<N> {
    let Data::Simple { body } = &n.data else {
        return None;
    };
    if !is_iife_call(body) {
        return None;
    }
    Some(simple(n, unary(n, "!", Rc::clone(body))))
}

pub(crate) fn is_iife_call(n: &N) -> bool {
    let Data::Call { expr, is_new: false, .. } = &n.data else {
        return false;
    };
    match &expr.data {
        Data::Func { kind: ast::FuncKind::Expr, .. } => true,
        Data::Call { .. } => is_iife_call(expr),
        _ => false,
    }
}

pub(crate) fn drop_trailing_return(mut body: Vec<N>, cx: &Cx) -> Vec<N> {
    let Some(last) = body.last() else {
        return body;
    };
    let Data::Return { value } = &last.data else {
        return body;
    };
    match value {
        None => {
            body.pop();
            body
        }
        Some(v) => {
            let Data::Unary { op, expr, prefix: true } = &v.data else {
                return body;
            };
            if op != "void" {
                return body;
            }
            let expr = Rc::clone(expr);
            body.pop();
            if !statement_pure(&expr, cx) {
                let stmt = simple(&expr, Rc::clone(&expr));
                body.push(stmt);
            }
            body
        }
    }
}

fn drop_statement(n: &N, cx: &Cx) -> Option<N> {
    if let Some(out) = drop_pure_call(n) {
        return Some(out);
    }
    let Data::Simple { body } = &n.data else {
        return None;
    };
    if statement_pure(body, cx) {
        Some(empty(n))
    } else {
        None
    }
}

/// terser `inference.js` `AST_Call.is_callee_pure` when a pure annotation is already on the call.
fn drop_pure_call(n: &N) -> Option<N> {
    let Data::Simple { body } = &n.data else {
        return None;
    };
    let effects = crate::call::pure_effects(body)?;
    if effects.is_empty() {
        return Some(empty(n));
    }
    if effects.len() == 1 {
        return Some(simple(n, effects.into_iter().next().unwrap()));
    }
    Some(simple(n, sequence(n, effects)))
}

fn statement_pure(n: &N, cx: &Cx) -> bool {
    if cx.in_with {
        return is_pure(n);
    }
    match &n.data {
        Data::Symbol { name, kind: ast::SymKind::Ref, .. } => cx.shadowed(name),
        Data::Unary { op, expr, prefix: true } if matches!(op.as_str(), "!" | "~" | "-" | "+" | "void" | "typeof") => {
            statement_pure(expr, cx)
        }
        Data::Binary { op, left, right } if !is_assign(op) => statement_pure(left, cx) && statement_pure(right, cx),
        Data::Seq { exprs } => exprs.iter().all(|e| statement_pure(e, cx)),
        Data::Cond { cond, cons, alt } => statement_pure(cond, cx) && statement_pure(cons, cx) && statement_pure(alt, cx),
        _ => is_pure(n),
    }
}

fn trim_sequence(n: &N, cx: &Cx) -> Option<N> {
    let Data::Seq { exprs } = &n.data else {
        return None;
    };
    if exprs.len() < 2 {
        return None;
    }
    let mut kept: Vec<N> = Vec::new();
    let mut changed = false;
    for (i, e) in exprs.iter().enumerate() {
        let last = i + 1 == exprs.len();
        if !last {
            if let Some(effects) = crate::call::pure_effects(e) {
                changed = true;
                kept.extend(effects);
                continue;
            }
            if statement_pure(e, cx) {
                changed = true;
                continue;
            }
        }
        kept.push(Rc::clone(e));
    }
    if !changed {
        return None;
    }
    if kept.is_empty() {
        return Some(num(n, 0.0));
    }
    if kept.len() == 1 {
        // terser `def_optimize(AST_Sequence)`: a single remaining expression
        // is `maintain_this_binding`'d, so `(0, a.b)()` stays a sequence.
        return Some(crate::conditional::maintain_this_binding(cx, kept.pop().unwrap()));
    }
    Some(Rc::new(Node {
        start: n.start.clone(),
        end: n.end.clone(),
        data: Data::Seq { exprs: kept },
    }))
}

fn eval(n: &N) -> Option<Lit> {
    match &n.data {
        Data::Number { value, .. } => Some(Lit::Num(*value)),
        Data::String { value, .. } => Some(Lit::Str(value.clone())),
        Data::True => Some(Lit::Bool(true)),
        Data::False => Some(Lit::Bool(false)),
        Data::Null => Some(Lit::Null),
        Data::Infinity => Some(Lit::Num(f64::INFINITY)),
        Data::Unary { op, expr, prefix: true } => {
            let inner = eval(expr)?;
            match op.as_str() {
                "!" => Some(Lit::Bool(!inner.truthy())),
                "void" => Some(Lit::Undef),
                // terser keeps `typeof 42` instead of folding it to `"number"`.
                "typeof" => None,
                "~" => Some(Lit::Num((!to_int32(inner.num()?)) as f64)),
                "-" => Some(neg(inner.num()?)),
                "+" => Some(Lit::Num(inner.num()?)),
                _ => None,
            }
        }
        Data::Binary { op, left, right } => {
            if op == "&&" || op == "||" || op == "??" {
                let l = eval(left)?;
                return match op.as_str() {
                    "&&" => {
                        if !l.truthy() {
                            Some(l)
                        } else {
                            eval(right)
                        }
                    }
                    "||" => {
                        if l.truthy() {
                            Some(l)
                        } else {
                            eval(right)
                        }
                    }
                    _ => {
                        if matches!(l, Lit::Null | Lit::Undef) {
                            eval(right)
                        } else {
                            Some(l)
                        }
                    }
                };
            }
            let l = eval(left)?;
            let r = eval(right)?;
            eval_bin(op, l, r)
        }
        Data::Cond { cond, cons, alt } => {
            let c = eval(cond)?;
            if c.truthy() { eval(cons) } else { eval(alt) }
        }
        _ => None,
    }
}

impl Lit {
    fn num(&self) -> Option<f64> {
        Some(match self {
            Lit::Num(n) => *n,
            Lit::Bool(true) => 1.0,
            Lit::Bool(false) => 0.0,
            Lit::Null => 0.0,
            Lit::Undef => f64::NAN,
            Lit::Str(s) => {
                let t = s.trim();
                if t.is_empty() {
                    0.0
                } else {
                    t.parse::<f64>().unwrap_or(f64::NAN)
                }
            }
        })
    }
}

fn neg(n: f64) -> Lit {
    if n == 0.0 {
        Lit::Num(if n.is_sign_negative() { 0.0 } else { -0.0 })
    } else {
        Lit::Num(-n)
    }
}

fn eval_bin(op: &str, l: Lit, r: Lit) -> Option<Lit> {
    if op == "+" {
        if matches!(l, Lit::Str(_)) || matches!(r, Lit::Str(_)) {
            return Some(Lit::Str(format!("{}{}", js_str(&l), js_str(&r))));
        }
        return Some(Lit::Num(l.num()? + r.num()?));
    }
    let ln = l.num()?;
    let rn = r.num()?;
    Some(match op {
        "-" => Lit::Num(ln - rn),
        "*" => Lit::Num(ln * rn),
        "/" => Lit::Num(ln / rn),
        "%" => Lit::Num(ln % rn),
        "**" => Lit::Num(ln.powf(rn)),
        "|" => Lit::Num((to_int32(ln) | to_int32(rn)) as f64),
        "&" => Lit::Num((to_int32(ln) & to_int32(rn)) as f64),
        "^" => Lit::Num((to_int32(ln) ^ to_int32(rn)) as f64),
        "<<" => Lit::Num(to_int32(ln).wrapping_shl(to_uint32(rn) & 31) as f64),
        ">>" => Lit::Num(to_int32(ln).wrapping_shr(to_uint32(rn) & 31) as f64),
        ">>>" => Lit::Num(to_uint32(ln).wrapping_shr(to_uint32(rn) & 31) as f64),
        "==" => Lit::Bool(abstract_eq(&l, &r)),
        "===" => Lit::Bool(strict_eq(&l, &r)),
        "!=" => Lit::Bool(!abstract_eq(&l, &r)),
        "!==" => Lit::Bool(!strict_eq(&l, &r)),
        "<" => Lit::Bool(cmp(&l, &r).is_some_and(|c| c < 0.0)),
        "<=" => Lit::Bool(cmp(&l, &r).is_some_and(|c| c <= 0.0)),
        ">" => Lit::Bool(cmp(&l, &r).is_some_and(|c| c > 0.0)),
        ">=" => Lit::Bool(cmp(&l, &r).is_some_and(|c| c >= 0.0)),
        _ => return None,
    })
}

fn abstract_eq(l: &Lit, r: &Lit) -> bool {
    match (l, r) {
        (Lit::Null, Lit::Undef) | (Lit::Undef, Lit::Null) => true,
        (Lit::Bool(_), _) => abstract_eq(&Lit::Num(l.num().unwrap_or(f64::NAN)), r),
        (_, Lit::Bool(_)) => abstract_eq(l, &Lit::Num(r.num().unwrap_or(f64::NAN))),
        (Lit::Str(_), Lit::Num(_)) | (Lit::Num(_), Lit::Str(_)) => {
            let a = l.num().unwrap_or(f64::NAN);
            let b = r.num().unwrap_or(f64::NAN);
            a == b
        }
        _ => strict_eq(l, r),
    }
}

fn strict_eq(l: &Lit, r: &Lit) -> bool {
    match (l, r) {
        (Lit::Num(a), Lit::Num(b)) => a == b,
        (Lit::Str(a), Lit::Str(b)) => a == b,
        (Lit::Bool(a), Lit::Bool(b)) => a == b,
        (Lit::Null, Lit::Null) | (Lit::Undef, Lit::Undef) => true,
        _ => false,
    }
}

fn cmp(l: &Lit, r: &Lit) -> Option<f64> {
    if matches!(l, Lit::Str(_)) && matches!(r, Lit::Str(_)) {
        let Lit::Str(a) = l else { return None };
        let Lit::Str(b) = r else { return None };
        return Some(if a < b { -1.0 } else if a > b { 1.0 } else { 0.0 });
    }
    let a = l.num()?;
    let b = r.num()?;
    if a.is_nan() || b.is_nan() {
        return None;
    }
    Some(if a < b { -1.0 } else if a > b { 1.0 } else { 0.0 })
}

fn js_str(lit: &Lit) -> String {
    match lit {
        Lit::Str(s) => s.clone(),
        Lit::Num(n) => codegen::js_number(*n),
        Lit::Bool(true) => "true".into(),
        Lit::Bool(false) => "false".into(),
        Lit::Null => "null".into(),
        Lit::Undef => "undefined".into(),
    }
}

pub fn is_pure(n: &N) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Infinity
        | Data::This
        | Data::Hole => true,
        Data::Unary { op, expr, prefix: true } => {
            matches!(op.as_str(), "!" | "~" | "-" | "+" | "void" | "typeof") && is_pure(expr)
        }
        Data::Binary { op, left, right } => {
            !is_assign(op) && is_pure(left) && is_pure(right)
        }
        Data::Cond { cond, cons, alt } => is_pure(cond) && is_pure(cons) && is_pure(alt),
        Data::Seq { exprs } => exprs.iter().all(is_pure),
        Data::Array { elements } => elements.iter().all(is_pure),
        Data::Func { kind: ast::FuncKind::Expr | ast::FuncKind::Arrow, .. } => true,
        _ => false,
    }
}

fn is_assign(op: &str) -> bool {
    matches!(
        op,
        "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "**=" | "<<=" | ">>=" | ">>>=" | "|=" | "&=" | "^=" | "&&=" | "||=" | "??="
    )
}

fn prefer(orig: &N, folded: N) -> N {
    if print_len(&folded) > print_len(orig) {
        Rc::clone(orig)
    } else {
        folded
    }
}

pub(crate) fn print_len(n: &N) -> usize {
    codegen::print(n).len()
}

fn lit_node(orig: &N, lit: Lit, cx: &Cx) -> N {
    match lit {
        Lit::Num(n) if n.is_nan() => nan_node(orig, cx),
        Lit::Num(n) if n.is_infinite() => {
            if cx.shadowed("Infinity") {
                let node = atom(orig, Data::Infinity);
                if n.is_sign_negative() { unary(orig, "-", node) } else { node }
            } else {
                infinity(orig, n.is_sign_negative())
            }
        }
        Lit::Num(n) if n == 0.0 && n.is_sign_negative() => unary(orig, "-", num(orig, 0.0)),
        Lit::Num(n) => num(orig, n),
        Lit::Str(s) => string(orig, s),
        Lit::Bool(true) => atom(orig, Data::True),
        Lit::Bool(false) => atom(orig, Data::False),
        Lit::Null => atom(orig, Data::Null),
        Lit::Undef => void0(orig),
    }
}

pub(crate) fn atom(orig: &N, data: Data) -> N {
    Rc::new(Node { start: orig.start.clone(), end: orig.end.clone(), data })
}

fn nan_node(orig: &N, cx: &Cx) -> N {
    if cx.shadowed("NaN") {
        atom(
            orig,
            Data::Binary { op: "/".into(), left: num(orig, 0.0), right: num(orig, 0.0) },
        )
    } else {
        num(orig, f64::NAN)
    }
}

pub(crate) fn num(orig: &N, value: f64) -> N {
    atom(orig, Data::Number { value, raw: String::new() })
}

pub(crate) fn unary(orig: &N, op: &str, expr: N) -> N {
    atom(orig, Data::Unary { op: op.into(), expr, prefix: true })
}

pub(crate) fn void0(orig: &N) -> N {
    unary(orig, "void", num(orig, 0.0))
}

pub(crate) fn infinity(orig: &N, neg: bool) -> N {
    let one = if neg { unary(orig, "-", num(orig, 1.0)) } else { num(orig, 1.0) };
    atom(
        orig,
        Data::Binary { op: "/".into(), left: one, right: num(orig, 0.0) },
    )
}

fn string(orig: &N, value: String) -> N {
    let quote = if value.contains('"') && !value.contains('\'') { '\'' } else { '"' };
    atom(orig, Data::String { value, quote, units: None })
}

fn empty(orig: &N) -> N {
    atom(orig, Data::Empty)
}

pub(crate) fn to_int32(n: f64) -> i32 {
    to_uint32(n) as i32
}

fn to_uint32(n: f64) -> u32 {
    if !n.is_finite() || n == 0.0 {
        return 0;
    }
    let n = n.trunc();
    let div = 4294967296.0;
    let mut m = n % div;
    if m < 0.0 {
        m += div;
    }
    m as u32
}

/// terser `evaluate.js` `AST_Node.evaluate` + `def_eval(AST_UnaryPrefix)`,
/// then `make_node_from_constant(...).optimize()` and `best_of`.
pub(crate) fn prefix_constant(n: &N, skip_expr: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.evaluate {
        return None;
    }
    let Data::Unary { op, expr, prefix: true } = &n.data else {
        return None;
    };
    // `-(number|Infinity|bigint)` is left alone so numeral printing cannot recurse.
    if op == "-" && matches!(skip_expr.data, Data::Number { .. } | Data::Infinity | Data::BigInt { .. }) {
        return None;
    }
    let lit = if op == "typeof" { eval_typeof(expr, cx)? } else { apply_unary(op, eval(expr)?)? };
    finish_constant(n, lit, cx)
}

/// Constant-fold a replacement the way `evaluate` + `best_of` does.
pub(crate) fn best_constant(n: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.evaluate {
        return None;
    }
    finish_constant(n, eval(n)?, cx)
}

fn finish_constant(orig: &N, lit: Lit, cx: &Cx) -> Option<N> {
    if let Lit::Str(s) = &lit {
        if s.len() + 2 > print_len(orig) {
            return None;
        }
    }
    let folded = lit_node(orig, lit, cx);
    let folded = match &folded.data {
        Data::True => crate::unary::optimize_bool(true, &folded, cx),
        Data::False => crate::unary::optimize_bool(false, &folded, cx),
        _ => folded,
    };
    if print_len(&folded) > print_len(orig) { None } else { Some(folded) }
}

fn apply_unary(op: &str, inner: Lit) -> Option<Lit> {
    Some(match op {
        "!" => Lit::Bool(!inner.truthy()),
        "void" => Lit::Undef,
        "~" => Lit::Num((!to_int32(inner.num()?)) as f64),
        "-" => neg(inner.num()?),
        "+" => Lit::Num(inner.num()?),
        _ => return None,
    })
}

fn eval_typeof(expr: &N, cx: &Cx) -> Option<Lit> {
    if let Some(kind) = typeof_ast(expr, cx) {
        return Some(Lit::Str(kind));
    }
    // `typeof 1n` does not need the `typeofs` option.
    if matches!(expr.data, Data::BigInt { .. }) {
        return Some(Lit::Str("bigint".into()));
    }
    if matches!(expr.data, Data::RegExp { .. }) {
        return None;
    }
    let lit = eval(expr)?;
    Some(Lit::Str(match &lit {
        Lit::Num(_) => "number",
        Lit::Str(_) => "string",
        Lit::Bool(_) => "boolean",
        Lit::Null => "object",
        Lit::Undef => "undefined",
    }.into()))
}

fn typeof_ast(expr: &N, cx: &Cx) -> Option<String> {
    if !cx.opts.typeofs {
        return None;
    }
    if is_lambda(expr) || fixed_of(expr, cx).is_some_and(is_lambda) {
        return Some("function".into());
    }
    let objectish = is_object_or_array(expr) || fixed_of(expr, cx).is_some_and(is_object_or_array);
    if objectish && !crate::unary::may_side_effect(expr, cx) {
        return Some("object".into());
    }
    None
}

fn is_lambda(n: &N) -> bool {
    matches!(n.data, Data::Func { .. })
}

fn is_object_or_array(n: &N) -> bool {
    matches!(n.data, Data::Object { .. } | Data::Array { .. })
}

