//! Constant folding and the side-effect drops that depend on it.
//!
//! Values follow JavaScript number and truthiness rules. A folded form is
//! kept only when it is not longer than the original expression.

use ast::{Data, Key, N, Node, Seg};
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
    if let Some(rewritten) = rewrite_global(n, cx) {
        return rewritten;
    }
    if cx.in_bool {
        if let Some(rewritten) = fold_bool_unary(n) {
            return rewritten;
        }
    }
    if let Some(rewritten) = fold_bool(n, cx) {
        return rewritten;
    }
    if cx.opts.evaluate {
        if let Some(rewritten) = fold_delete(n, cx) {
            return rewritten;
        }
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
        if let Some(rewritten) = fold_computed(n) {
            return rewritten;
        }
    }
    if cx.opts.conditionals {
        if let Some(rewritten) = fold_cond(n, cx) {
            return rewritten;
        }
    }
    if cx.opts.dead_code && cx.opts.conditionals {
        if let Some(rewritten) = fold_if(n) {
            return rewritten;
        }
    }
    if cx.opts.conditionals {
        if let Some(rewritten) = fold_if_shape(n, cx) {
            return rewritten;
        }
    }
    if cx.opts.evaluate {
        if let Some(rewritten) = fold_and_or(n) {
            return rewritten;
        }
    }
    if cx.opts.comparisons || cx.opts.lhs_constants {
        if let Some(rewritten) = fold_compare(n, cx) {
            return rewritten;
        }
    }
    if cx.opts.properties {
        if let Some(rewritten) = fold_property(n) {
            return rewritten;
        }
    }
    if cx.opts.loops {
        if let Some(rewritten) = fold_while(n) {
            return rewritten;
        }
    }
    if cx.opts.inline > 0 {
        if let Some(rewritten) = fold_inline(n) {
            return rewritten;
        }
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
    if cx.shadowed(name) || cx.opts.ie8 {
        return None;
    }
    match name.as_str() {
        "undefined" => Some(void0(n)),
        "NaN" => Some(nan_node(n, cx)),
        "Infinity" => Some(infinity(n, false)),
        _ => None,
    }
}

fn fold_bool_unary(n: &N) -> Option<N> {
    let Data::Unary { op, expr, prefix: true } = &n.data else {
        return None;
    };
    if op == "!" {
        if let Data::Unary { op: inner, expr: value, prefix: true } = &expr.data {
            if inner == "!" {
                return Some(Rc::clone(value));
            }
        }
    }
    if op == "typeof" && is_pure(expr) {
        return Some(atom(n, Data::True));
    }
    None
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

fn fold_delete(n: &N, cx: &Cx) -> Option<N> {
    let Data::Unary { op, expr, prefix: true } = &n.data else {
        return None;
    };
    if op != "delete" || is_reference(expr) {
        return None;
    }
    if !is_pure(expr) {
        return None;
    }
    Some(truth(n, cx))
}

fn is_reference(n: &N) -> bool {
    match &n.data {
        Data::Symbol { kind: ast::SymKind::Ref, .. } | Data::Dot { .. } | Data::Sub { .. } => true,
        Data::Seq { exprs } => exprs.last().is_some_and(is_reference),
        Data::Cond { cons, alt, .. } => is_reference(cons) || is_reference(alt),
        _ => false,
    }
}

fn truth(n: &N, cx: &Cx) -> N {
    if cx.opts.booleans && (cx.in_bool || cx.eq_cmp) {
        num(n, 1.0)
    } else if cx.opts.booleans {
        unary(n, "!", num(n, 0.0))
    } else {
        atom(n, Data::True)
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

fn fold_computed(n: &N) -> Option<N> {
    match &n.data {
        Data::Prop { method, key, value, static_, private, generator, async_ } => {
            let key = static_key(key)?;
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
            let key = static_key(key)?;
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

fn static_key(key: &Key) -> Option<Key> {
    let Key::Computed(expr) = key else {
        return None;
    };
    match &expr.data {
        Data::Number { value, .. } if value.is_finite() => Some(Key::Static {
            name: codegen::js_number(*value),
            quote: None,
        }),
        Data::String { value, .. } if value != "__proto__" => Some(Key::Static {
            name: value.clone(),
            quote: None,
        }),
        _ => None,
    }
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

fn fold_if_shape(n: &N, cx: &Cx) -> Option<N> {
    let Data::If { cond, body, alt } = &n.data else {
        return None;
    };
    let body_kind = stmt_kind(body);
    let alt_kind = match alt {
        None => StmtClass::Empty,
        Some(a) => stmt_kind(a),
    };
    match (body_kind, alt_kind) {
        (StmtClass::Empty, StmtClass::Empty) => Some(simple(n, Rc::clone(cond))),
        (StmtClass::Expr(expr), StmtClass::Empty) => {
            Some(simple(n, binary(n, "&&", Rc::clone(cond), expr)))
        }
        (StmtClass::Empty, StmtClass::Expr(expr)) => {
            Some(simple(n, binary(n, "||", Rc::clone(cond), expr)))
        }
        (StmtClass::Expr(cons), StmtClass::Expr(alt_expr)) => Some(simple(
            n,
            factor_conditional(n, Rc::clone(cond), cons, alt_expr, cx),
        )),
        _ => None,
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

fn simple(span: &N, body: N) -> N {
    atom(span, Data::Simple { body })
}

fn binary(span: &N, op: &str, left: N, right: N) -> N {
    atom(
        span,
        Data::Binary { op: op.into(), left, right },
    )
}

fn fold_if(n: &N) -> Option<N> {
    let Data::If { cond, body, alt } = &n.data else {
        return None;
    };
    let lit = eval(cond)?;
    if !is_pure(cond) {
        return None;
    }
    if lit.truthy() {
        Some(Rc::clone(body))
    } else if let Some(alt) = alt {
        Some(Rc::clone(alt))
    } else {
        Some(empty(n))
    }
}

fn fold_and_or(n: &N) -> Option<N> {
    let Data::Binary { op, left, right } = &n.data else {
        return None;
    };
    if op != "&&" && op != "||" && op != "??" {
        return None;
    }
    let lit = eval(left)?;
    match op.as_str() {
        "&&" => {
            if !lit.truthy() {
                Some(Rc::clone(left))
            } else if is_pure(left) {
                Some(Rc::clone(right))
            } else {
                None
            }
        }
        "||" => {
            if lit.truthy() {
                Some(Rc::clone(left))
            } else if is_pure(left) {
                Some(Rc::clone(right))
            } else {
                None
            }
        }
        "??" => {
            let nullish = matches!(lit, Lit::Null | Lit::Undef);
            if nullish {
                if is_pure(left) {
                    Some(Rc::clone(right))
                } else {
                    None
                }
            } else {
                Some(Rc::clone(left))
            }
        }
        _ => None,
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
            if !still_strict && is_undefined_value(&left_n, cx) {
                left_n = atom(n, Data::Null);
            } else if !still_strict && is_undefined_value(&right_n, cx) {
                right_n = atom(n, Data::Null);
            } else if cx.opts.typeofs {
                if let Some((left, right, op)) = fold_typeof(&left_n, &right_n, &op_s, n, cx) {
                    left_n = left;
                    right_n = right;
                    op_s = op;
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

fn is_number(n: &N) -> bool {
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

fn fold_property(n: &N) -> Option<N> {
    let Data::Sub { expr, prop, optional, .. } = &n.data else {
        return None;
    };
    let Data::String { value, .. } = &prop.data else {
        return None;
    };
    if is_basic_ident(value) && value.len() <= print_len(prop) + 1 {
        return Some(atom(
            n,
            Data::Dot {
                expr: Rc::clone(expr),
                prop: value.clone(),
                optional: *optional,
                quote: None,
                private: false,
            },
        ));
    }
    if let Ok(num_v) = value.parse::<f64>() {
        if value == &codegen::js_number(num_v) && !num_v.is_nan() {
            let as_num = num(n, num_v);
            if print_len(&as_num) < print_len(prop) {
                return Some(atom(
                    n,
                    Data::Sub {
                        expr: Rc::clone(expr),
                        prop: as_num,
                        optional: *optional,
                    },
                ));
            }
        }
    }
    None
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

fn fold_inline(n: &N) -> Option<N> {
    let Data::Call { expr, args, optional, is_new } = &n.data else {
        return None;
    };
    if *optional || *is_new || args.iter().any(|a| matches!(a.data, Data::Spread { .. })) {
        return None;
    }
    let Data::Func { kind, name, args: params, body, async_, generator } = &expr.data else {
        return None;
    };
    if *async_ || *generator || name.is_some() || !matches!(kind, ast::FuncKind::Expr | ast::FuncKind::Arrow) {
        return None;
    }
    let params = simple_params(params)?;
    let returned = inline_result(body)?;
    if blocked_inline(&returned) {
        return None;
    }
    if params.len() == 1 && args.len() == 1 {
        if let Data::Symbol { name, kind: ast::SymKind::Ref, .. } = &returned.data {
            if name == &params[0] {
                return Some(Rc::clone(&args[0]));
            }
        }
    }
    if uses_any(&returned, &params) {
        return None;
    }
    let mut exprs: Vec<N> = args.iter().cloned().collect();
    exprs.push(returned);
    Some(sequence(n, exprs))
}

fn simple_params(params: &[N]) -> Option<Vec<String>> {
    let mut names = Vec::new();
    for param in params {
        let Data::Symbol { name, kind: ast::SymKind::Funarg, .. } = &param.data else {
            return None;
        };
        names.push(name.clone());
    }
    Some(names)
}

fn inline_result(body: &[N]) -> Option<N> {
    let mut meaningful = body.iter().filter(|s| !matches!(s.data, Data::Empty | Data::Directive { .. }));
    let stat = meaningful.next()?;
    if meaningful.next().is_some() {
        return None;
    }
    match &stat.data {
        Data::Return { value: Some(value) } => Some(Rc::clone(value)),
        Data::Return { value: None } => Some(void0(stat)),
        Data::Simple { body } => Some(unary(stat, "void", Rc::clone(body))),
        _ => None,
    }
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

fn blocked_inline(n: &N) -> bool {
    match &n.data {
        Data::This | Data::Super | Data::NewTarget => true,
        Data::Symbol { name, .. } if name == "arguments" => true,
        Data::Func { .. } | Data::Class { .. } => true,
        other => walk_children(other, blocked_inline),
    }
}

fn uses_any(n: &N, params: &[String]) -> bool {
    match &n.data {
        Data::Symbol { name, kind: ast::SymKind::Ref, .. } => params.iter().any(|p| p == name),
        Data::Func { .. } | Data::Class { .. } => false,
        other => walk_children(other, |c| uses_any(c, params)),
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

fn is_iife_call(n: &N) -> bool {
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
    let Data::Simple { body } = &n.data else {
        return None;
    };
    if statement_pure(body, cx) {
        Some(empty(n))
    } else {
        None
    }
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
    for (i, e) in exprs.iter().enumerate() {
        let last = i + 1 == exprs.len();
        if !last && statement_pure(e, cx) {
            continue;
        }
        kept.push(Rc::clone(e));
    }
    if kept.len() == exprs.len() {
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

fn print_len(n: &N) -> usize {
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

fn atom(orig: &N, data: Data) -> N {
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

fn num(orig: &N, value: f64) -> N {
    atom(orig, Data::Number { value, raw: String::new() })
}

fn unary(orig: &N, op: &str, expr: N) -> N {
    atom(orig, Data::Unary { op: op.into(), expr, prefix: true })
}

fn void0(orig: &N) -> N {
    unary(orig, "void", num(orig, 0.0))
}

fn infinity(orig: &N, neg: bool) -> N {
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

fn to_int32(n: f64) -> i32 {
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
