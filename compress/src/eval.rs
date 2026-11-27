//! Constant folding and the side-effect drops that depend on it.
//!
//! Values follow JavaScript number and truthiness rules. A folded form is
//! kept only when it is not longer than the original expression.

use ast::{Data, N, Node};
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
    if let Some(rewritten) = fold_bool(n, cx) {
        return rewritten;
    }
    if cx.opts.evaluate {
        if let Some(rewritten) = fold_value(n, cx) {
            return rewritten;
        }
    }
    if cx.opts.conditionals {
        if let Some(rewritten) = fold_cond(n) {
            return rewritten;
        }
    }
    if cx.opts.dead_code {
        if let Some(rewritten) = fold_if(n) {
            return rewritten;
        }
    }
    if cx.opts.evaluate {
        if let Some(rewritten) = fold_and_or(n) {
            return rewritten;
        }
    }
    if cx.opts.side_effects {
        if let Some(rewritten) = drop_statement(n) {
            return rewritten;
        }
        if let Some(rewritten) = trim_sequence(n) {
            return rewritten;
        }
    }
    Rc::clone(n)
}

fn rewrite_global(n: &N, cx: &Cx) -> Option<N> {
    let Data::Symbol { name, kind: ast::SymKind::Ref, .. } = &n.data else {
        return None;
    };
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

fn fold_value(n: &N, cx: &Cx) -> Option<N> {
    if let Data::Binary { op, .. } = &n.data {
        if matches!(op.as_str(), "&&" | "||" | "??") {
            return None;
        }
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

fn fold_cond(n: &N) -> Option<N> {
    let Data::Cond { cond, cons, alt } = &n.data else {
        return None;
    };
    let lit = eval(cond)?;
    if !is_pure(cond) {
        return None;
    }
    Some(Rc::clone(if lit.truthy() { cons } else { alt }))
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

fn drop_statement(n: &N) -> Option<N> {
    let Data::Simple { body } = &n.data else {
        return None;
    };
    if is_pure(body) {
        Some(empty(n))
    } else {
        None
    }
}

fn trim_sequence(n: &N) -> Option<N> {
    let Data::Seq { exprs } = &n.data else {
        return None;
    };
    if exprs.len() < 2 {
        return None;
    }
    let mut kept: Vec<N> = Vec::new();
    for (i, e) in exprs.iter().enumerate() {
        let last = i + 1 == exprs.len();
        if !last && is_pure(e) {
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
        return Some(kept.pop().unwrap());
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
                "typeof" => Some(Lit::Str(type_of(&inner))),
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

fn type_of(lit: &Lit) -> String {
    match lit {
        Lit::Num(_) => "number",
        Lit::Str(_) => "string",
        Lit::Bool(_) => "boolean",
        Lit::Undef => "undefined",
        Lit::Null => "object",
    }
    .into()
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
