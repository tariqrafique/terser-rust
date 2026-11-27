//! terser `lib/compress/index.js` `def_optimize` for loops, `switch`, and `try`.
//!
//! `AST_ForIn` and `AST_ForOf` do not define `optimize`; they use `AST_Node` and
//! stay as they are. `AST_Catch` and `AST_Finally` extend `AST_Block`, whose
//! `optimize` is `tighten_body`. That already runs on the inner block
//! (`after_descend`, `keep_block` so the braces stay).

use ast::{Data, N};
use std::rc::Rc;

use crate::eval::{self, Lit};
use crate::Cx;

/// Entry from `eval::fold`. `None` means the node is unchanged.
pub(crate) fn optimize(n: &N, cx: &Cx) -> Option<N> {
    match &n.data {
        // terser `def_optimize(AST_While)`
        Data::While { .. } => optimize_while(n, cx),
        // terser `def_optimize(AST_Do)`
        Data::Do { .. } => optimize_do(n, cx),
        // terser `def_optimize(AST_For)`
        Data::For { .. } => optimize_for(n, cx),
        // terser: no `def_optimize(AST_ForIn)` / `def_optimize(AST_ForOf)`.
        Data::ForIn { .. } | Data::ForOf { .. } => None,
        // terser `def_optimize(AST_Switch)`
        Data::Switch { .. } => optimize_switch(n, cx, 0),
        // terser `def_optimize(AST_Try)`
        Data::Try { .. } => optimize_try(n, cx),
        // terser: `AST_Catch` / `AST_Finally` inherit `def_optimize(AST_Block)`.
        Data::Catch { .. } | Data::Finally { .. } => None,
        _ => None,
    }
}

/// terser `def_optimize(AST_While)`: `make_node(AST_For, self, self).optimize`.
fn optimize_while(n: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.loops {
        return None;
    }
    let Data::While { cond, body } = &n.data else {
        return None;
    };
    let for_n = for_node(n, None, Some(Rc::clone(cond)), None, Rc::clone(body));
    Some(optimize_for(&for_n, cx).unwrap_or(for_n))
}

/// terser `def_optimize(AST_Do)`.
fn optimize_do(n: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.loops {
        return None;
    }
    let Data::Do { body, cond } = &n.data else {
        return None;
    };
    // `condition.tail_node().evaluate`
    let lit = eval::eval_if_cond(tail(cond), cx)?;
    let cond_stmt = eval::simple(n, Rc::clone(cond));
    if lit.truthy() {
        let inner = eval::atom(
            body,
            Data::Block { body: vec![Rc::clone(body), cond_stmt] },
        );
        let for_n = for_node(n, None, None, None, inner);
        return Some(optimize_for(&for_n, cx).unwrap_or(for_n));
    }
    // falsy, and `common.js` `has_break_or_continue` is clear
    if has_loop_control(body) {
        return None;
    }
    Some(eval::atom(
        n,
        Data::Block { body: vec![Rc::clone(body), cond_stmt] },
    ))
}

/// terser `def_optimize(AST_For)` and `if_break_in_loop`.
fn optimize_for(n: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.loops {
        return None;
    }
    let Data::For { init, cond, step, body } = &n.data else {
        return None;
    };
    let mut init = init.clone();
    let mut cond = cond.clone();
    let step = step.clone();
    let mut body = Rc::clone(body);
    let mut changed = false;

    if cx.opts.side_effects {
        if let Some(i) = &init {
            if !matches!(i.data, Data::Defs { .. }) {
                let dropped = drop_expr(i, cx);
                if !opt_eq(&dropped, &init) {
                    init = dropped;
                    changed = true;
                }
            }
        }
    }

    if let Some(c) = cond.clone() {
        let direct = eval::eval_if_cond(&c, cx);
        if let Some(lit) = &direct {
            if lit.truthy() {
                cond = None;
                changed = true;
            } else if !cx.opts.dead_code {
                let made = smaller_constant(&c, lit.clone(), cx);
                if !Rc::ptr_eq(&made, &c) {
                    cond = Some(made);
                    changed = true;
                }
            }
        }
        if cx.opts.dead_code {
            let lit = direct.or_else(|| eval::eval_if_cond(tail(&c), cx));
            if let Some(lit) = lit {
                if !lit.truthy() {
                    // Falsy test: the loop body does not run.
                    let mut stmts = Vec::new();
                    eval::extract_unreachable(&body, &mut stmts, cx, true);
                    if let Some(i) = &init {
                        stmts.push(as_statement(i));
                    }
                    stmts.push(eval::simple(n, c));
                    return Some(eval::atom(n, Data::Block { body: stmts }));
                }
            }
        }
    }

    if let Some(out) = if_break(n, &init, &cond, &step, &body, cx, 0) {
        return Some(out);
    }
    if !changed {
        return None;
    }
    let _ = &mut body;
    Some(for_node(n, init, cond, step, body))
}

/// terser `if_break_in_loop`.
fn if_break(
    span: &N,
    init: &Option<N>,
    cond: &Option<N>,
    step: &Option<N>,
    body: &N,
    cx: &Cx,
    depth: u8,
) -> Option<N> {
    if depth > 8 {
        return None;
    }
    let Some(first) = first_stmt(body) else {
        return None;
    };
    if cx.opts.dead_code && is_break_stmt(first, cx) {
        let mut stmts = Vec::new();
        if let Some(i) = init {
            stmts.push(as_statement(i));
        }
        if let Some(c) = cond {
            stmts.push(eval::simple(span, Rc::clone(c)));
        }
        eval::extract_unreachable(body, &mut stmts, cx, true);
        return Some(eval::atom(span, Data::Block { body: stmts }));
    }
    let Data::If { cond: if_cond, body: if_body, alt } = &first.data else {
        return None;
    };
    let (new_cond, dropped) = if is_break_stmt(if_body, cx) {
        let right = eval::negate_expr(if_cond, cx);
        let cond = and_cond(span, cond, right);
        (cond, alt.clone())
    } else if alt.as_ref().is_some_and(|a| is_break_stmt(a, cx)) {
        let cond = and_cond(span, cond, Rc::clone(if_cond));
        (cond, Some(Rc::clone(if_body)))
    } else {
        return None;
    };
    let new_body = drop_broken(body, dropped);
    let again_init = init.clone();
    let mut again_cond = Some(new_cond);
    let mut again_body = new_body;
    if let Some(out) = if_break(span, &again_init, &again_cond, step, &again_body, cx, depth + 1) {
        return Some(out);
    }
    // The recursive call saw no further break. Still a new loop.
    let cond = again_cond.take().unwrap();
    let body = std::mem::replace(&mut again_body, eval::empty(span));
    let _ = again_init;
    Some(for_node(span, init.clone(), Some(cond), step.clone(), body))
}

fn and_cond(span: &N, cond: &Option<N>, right: N) -> N {
    match cond {
        Some(left) => eval::binary(span, "&&", Rc::clone(left), right),
        None => right,
    }
}

/// terser `drop_it`: the broken `if` is replaced by `rest`, then the tail of a block.
fn drop_broken(body: &N, rest: Option<N>) -> N {
    let mut stmts = as_statement_array(rest);
    if let Data::Block { body } = &body.data {
        stmts.extend(body.iter().skip(1).cloned());
    }
    normalize_stmts(body, stmts)
}

fn normalize_stmts(span: &N, stmts: Vec<N>) -> N {
    let stmts = flatten_evictable(stmts);
    if stmts.is_empty() {
        eval::empty(span)
    } else if stmts.len() == 1 && crate::can_evict(&stmts[0]) {
        stmts.into_iter().next().unwrap()
    } else {
        eval::atom(span, Data::Block { body: stmts })
    }
}

fn first_stmt(body: &N) -> Option<&N> {
    match &body.data {
        Data::Block { body } => body.first(),
        _ => Some(body),
    }
}

fn as_statement_array(rest: Option<N>) -> Vec<N> {
    let Some(rest) = rest else {
        return Vec::new();
    };
    match &rest.data {
        Data::Empty => Vec::new(),
        Data::Block { body } => body.clone(),
        _ => vec![rest],
    }
}

fn as_statement(n: &N) -> N {
    if matches!(n.data, Data::Defs { .. } | Data::Empty | Data::Simple { .. } | Data::Block { .. }) {
        Rc::clone(n)
    } else {
        eval::simple(n, Rc::clone(n))
    }
}

/// `drop_side_effect_free` for a `for` init that is an expression.
fn drop_expr(n: &N, cx: &Cx) -> Option<N> {
    if eval::statement_pure(n, cx) {
        return None;
    }
    let Data::Seq { exprs } = &n.data else {
        return Some(Rc::clone(n));
    };
    let mut kept = Vec::new();
    for (i, e) in exprs.iter().enumerate() {
        let last = i + 1 == exprs.len();
        if last {
            kept.push(Rc::clone(e));
        } else if let Some(d) = drop_expr(e, cx) {
            kept.push(d);
        }
    }
    match kept.len() {
        0 => None,
        1 => kept.pop(),
        _ => Some(eval::atom(n, Data::Seq { exprs: kept })),
    }
}

fn smaller_constant(orig: &N, lit: Lit, cx: &Cx) -> N {
    let made = eval::fold(&eval::lit_node(orig, lit, cx), cx);
    if eval::node_size(&made) > eval::node_size(orig) {
        Rc::clone(orig)
    } else {
        made
    }
}

fn for_node(span: &N, init: Option<N>, cond: Option<N>, step: Option<N>, body: N) -> N {
    eval::atom(span, Data::For { init, cond, step, body })
}

fn opt_eq(a: &Option<N>, b: &Option<N>) -> bool {
    match (a, b) {
        (None, None) => true,
        (Some(a), Some(b)) => Rc::ptr_eq(a, b),
        _ => false,
    }
}

/// A break or continue anywhere under `body`, outside nested functions.
/// Used by `has_break_or_continue`: an inner-loop control also blocks the unroll,
/// which only skips an optimization.
fn has_loop_control(n: &N) -> bool {
    match &n.data {
        Data::Func { .. } | Data::Class { .. } | Data::StaticBlock { .. } => false,
        Data::Break { .. } | Data::Continue { .. } => true,
        _ => stmt_kids(n).iter().any(has_loop_control),
    }
}

/// terser `TreeWalker.loopcontrol_target` against the compressor stack.
fn is_break_stmt(n: &N, cx: &Cx) -> bool {
    if !matches!(n.data, Data::Break { .. }) {
        return false;
    }
    let Some(top) = cx.parents.last() else {
        return false;
    };
    loop_target(n, &cx.parents).is_some_and(|t| Rc::ptr_eq(t, top))
}

pub(crate) fn loop_target<'a>(jump: &N, stack: &'a [N]) -> Option<&'a N> {
    let label = match &jump.data {
        Data::Break { label } | Data::Continue { label } => label.as_ref(),
        _ => return None,
    };
    if let Some(lab) = label {
        let name = sym_name(lab)?;
        for node in stack.iter().rev() {
            if let Data::Labeled { label, body } = &node.data {
                if sym_name(label) == Some(name) {
                    return Some(body);
                }
            }
        }
        return None;
    }
    let is_break = matches!(jump.data, Data::Break { .. });
    for node in stack.iter().rev() {
        match &node.data {
            Data::While { .. }
            | Data::Do { .. }
            | Data::For { .. }
            | Data::ForIn { .. }
            | Data::ForOf { .. } => return Some(node),
            Data::Switch { .. } if is_break => return Some(node),
            _ => {}
        }
    }
    None
}

fn sym_name(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name.as_str()),
        _ => None,
    }
}

fn tail(n: &N) -> &N {
    match &n.data {
        Data::Seq { exprs } if !exprs.is_empty() => exprs.last().unwrap(),
        _ => n,
    }
}

/// terser `def_optimize(AST_Try)`.
fn optimize_try(n: &N, cx: &Cx) -> Option<N> {
    let Data::Try { body, catch, finally } = &n.data else {
        return None;
    };
    let mut finally = finally.clone();
    let mut changed = false;
    if catch.is_some() {
        if finally.as_ref().is_some_and(finally_all_empty) {
            finally = None;
            changed = true;
        }
    }
    if cx.opts.dead_code && block_all_empty(body) {
        let mut stmts = Vec::new();
        if let Some(c) = catch {
            eval::extract_unreachable(c, &mut stmts, cx, true);
        }
        if let Some(fin) = &finally {
            if let Data::Finally { body } = &fin.data {
                if let Data::Block { body } = &body.data {
                    stmts.extend(body.iter().cloned());
                } else {
                    stmts.push(Rc::clone(body));
                }
            }
        }
        return Some(eval::atom(n, Data::Block { body: stmts }));
    }
    if !changed {
        return None;
    }
    Some(eval::atom(
        n,
        Data::Try { body: Rc::clone(body), catch: catch.clone(), finally },
    ))
}

fn finally_all_empty(n: &N) -> bool {
    let Data::Finally { body } = &n.data else {
        return false;
    };
    block_all_empty(body)
}

fn block_all_empty(n: &N) -> bool {
    let Data::Block { body } = &n.data else {
        return eval::is_empty_stmt(n);
    };
    body.iter().all(eval::is_empty_stmt)
}

// --- switch -----------------------------------------------------------------

struct Arm {
    id: u32,
    span: N,
    /// `None` is `default`.
    expr: Option<N>,
    body: Vec<N>,
}

/// terser `def_optimize(AST_Switch)`.
fn optimize_switch(n: &N, cx: &Cx, depth: u8) -> Option<N> {
    if depth > 4 || !cx.opts.switches {
        return None;
    }
    let Data::Switch { expr, body } = &n.data else {
        return None;
    };
    let direct = eval::eval_if_cond(expr, cx);
    let mut expr_n = Rc::clone(expr);
    if let Some(lit) = &direct {
        let next = smaller_constant(expr, lit.clone(), cx);
        if !Rc::ptr_eq(&next, expr) {
            expr_n = next;
        }
    }
    if !cx.opts.dead_code {
        if Rc::ptr_eq(&expr_n, expr) {
            return None;
        }
        return Some(switch_node(n, expr_n, body.clone()));
    }
    let value = direct.or_else(|| eval::eval_if_cond(tail(&expr_n), cx));

    let mut arms: Vec<Arm> = Vec::new();
    let mut decl: Vec<N> = Vec::new();
    let mut default_id: Option<u32> = None;
    let mut exact_id: Option<u32> = None;
    let mut next_id = 1u32;
    let mut i = 0;
    while i < body.len() && exact_id.is_none() {
        let branch = &body[i];
        i += 1;
        let arm = match arm_of(branch, next_id) {
            Some(a) => a,
            None => continue,
        };
        next_id += 1;
        if arm.expr.is_none() {
            if default_id.is_none() {
                default_id = Some(arm.id);
            } else {
                let prev = arms.len().checked_sub(1);
                eliminate(&arm, prev, &mut arms, &mut decl, cx);
                continue;
            }
        } else if let Some(value) = &value {
            if let Some(case_expr) = &arm.expr {
                let mut exp = eval::eval_if_cond(case_expr, cx);
                if exp.as_ref().is_some_and(|e| !e.js_eq(value)) {
                    let prev = arms.len().checked_sub(1);
                    eliminate(&arm, prev, &mut arms, &mut decl, cx);
                    continue;
                }
                if exp.is_none() && !eval::statement_pure(case_expr, cx) {
                    // keep; side effects mean we cannot use the tail value
                } else if exp.is_none() {
                    exp = eval::eval_if_cond(tail(case_expr), cx);
                }
                if exp.as_ref().is_some_and(|e| e.js_eq(value)) {
                    exact_id = Some(arm.id);
                    if let Some(did) = default_id.take() {
                        if let Some(di) = arms.iter().position(|a| a.id == did) {
                            let removed = arms.remove(di);
                            let prev = di.checked_sub(1);
                            eliminate(&removed, prev, &mut arms, &mut decl, cx);
                        }
                    }
                }
            }
        }
        arms.push(arm);
    }
    while i < body.len() {
        if let Some(arm) = arm_of(&body[i], next_id) {
            next_id += 1;
            let prev = arms.len().checked_sub(1);
            eliminate(&arm, prev, &mut arms, &mut decl, cx);
        }
        i += 1;
    }

    let mut marker = default_id.or(exact_id);

    if arms_are_simple(&arms, marker) {
        group_equivalent(&mut arms, marker);
    }
    merge_equivalent(&mut arms);

    prune_trailing(&mut arms, &mut marker, &mut decl, cx);
    if let Some(out) = fold_into_default(n, &expr_n, &mut arms, &mut marker, &mut decl, cx, depth) {
        return Some(out);
    }

    if !arms.is_empty() && !decl.is_empty() {
        let extra = std::mem::take(&mut decl);
        let mut body = extra;
        body.append(&mut arms[0].body);
        arms[0].body = body;
    }
    if arms.is_empty() {
        let mut stmts = decl;
        stmts.push(eval::simple(n, expr_n));
        return Some(finish_switch_block(n, stmts, cx));
    }
    if arms.len() == 1 && arms[0].expr.is_some() && !nested_break(&arms, n) {
        let branch = &arms[0];
        let cond = eval::binary(n, "===", expr_n, Rc::clone(branch.expr.as_ref().unwrap()));
        let body = stable_body(&branch.span, branch.body.clone(), cx);
        return Some(sealed_if(n, cond, body, None, cx));
    }
    if arms.len() == 2 {
        if let Some(mid) = marker {
            if !nested_break(&arms, n) {
                if let Some(out) = switch_two(n, &expr_n, &arms, mid, cx) {
                    return Some(out);
                }
            }
        }
    }
    let body: Vec<N> = arms.iter().map(arm_node).collect();
    if Rc::ptr_eq(&expr_n, expr) && same_arms(body.as_slice(), &n_body(n)) {
        None
    } else {
        Some(switch_node(n, expr_n, body))
    }
}

fn n_body(n: &N) -> Vec<N> {
    match &n.data {
        Data::Switch { body, .. } => body.clone(),
        _ => Vec::new(),
    }
}

fn same_arms(a: &[N], b: &[N]) -> bool {
    a.len() == b.len() && a.iter().zip(b).all(|(x, y)| Rc::ptr_eq(x, y))
}

fn arm_of(n: &N, id: u32) -> Option<Arm> {
    match &n.data {
        Data::Case { expr, body } => Some(Arm {
            id,
            span: Rc::clone(n),
            expr: Some(Rc::clone(expr)),
            body: body.clone(),
        }),
        Data::Default { body } => Some(Arm {
            id,
            span: Rc::clone(n),
            expr: None,
            body: body.clone(),
        }),
        _ => None,
    }
}

fn arm_node(arm: &Arm) -> N {
    match &arm.expr {
        Some(expr) => eval::atom(
            &arm.span,
            Data::Case { expr: Rc::clone(expr), body: arm.body.clone() },
        ),
        None => eval::atom(&arm.span, Data::Default { body: arm.body.clone() }),
    }
}

/// terser `eliminate_branch`.
fn eliminate(arm: &Arm, prev: Option<usize>, arms: &mut Vec<Arm>, decl: &mut Vec<N>, cx: &Cx) {
    if let Some(i) = prev {
        if i < arms.len() && !list_aborts(&arms[i].body) {
            let extra = arm.body.clone();
            arms[i].body.extend(extra);
            return;
        }
    }
    let node = arm_node(arm);
    eval::extract_unreachable(&node, decl, cx, true);
}

fn list_aborts(stmts: &[N]) -> bool {
    stmts.iter().any(eval::aborts)
}

fn is_constant_node(n: &N) -> bool {
    matches!(
        n.data,
        Data::Number { .. }
            | Data::String { .. }
            | Data::BigInt { .. }
            | Data::True
            | Data::False
            | Data::Null
            | Data::Infinity
            | Data::RegExp { .. }
    )
}

fn arms_are_simple(arms: &[Arm], marker: Option<u32>) -> bool {
    arms.iter().enumerate().all(|(i, arm)| {
        let const_ok = marker == Some(arm.id) || arm.expr.as_ref().is_some_and(|e| is_constant_node(e));
        let shape = arm.body.is_empty() || list_aborts(&arm.body) || i + 1 == arms.len();
        const_ok && shape
    })
}

fn group_equivalent(arms: &mut Vec<Arm>, marker: Option<u32>) {
    let _ = marker;
    let mut i = 0;
    while i < arms.len() {
        let mut j = i + 1;
        while j < arms.len() {
            if arms[j].body.is_empty() {
                j += 1;
                continue;
            }
            let last = j + 1 == arms.len();
            let eq = bodies_eq(&arms[j].body, &arms[i].body, &arms[j].span, false);
            let eq_last = last && bodies_eq(&arms[j].body, &arms[i].body, &arms[j].span, true);
            if eq || eq_last {
                if !eq && eq_last {
                    let span = Rc::clone(&arms[j].span);
                    arms[j].body.push(eval::atom(&span, Data::Break { label: None }));
                }
                let mut x = j;
                let mut fall = 0usize;
                while x > i + 1 {
                    x -= 1;
                    if is_inert(&arms[x]) {
                        fall += 1;
                    } else {
                        break;
                    }
                }
                let at = j - fall;
                let plucked: Vec<Arm> = arms.drain(at..j + 1).collect();
                let n = plucked.len();
                for (k, arm) in plucked.into_iter().enumerate() {
                    arms.insert(i + 1 + k, arm);
                }
                i += n;
                j = i + 1;
            } else {
                j += 1;
            }
        }
        i += 1;
    }
}

fn merge_equivalent(arms: &mut Vec<Arm>) {
    let mut i = 0;
    while i < arms.len() {
        if arms[i].body.is_empty() || !list_aborts(&arms[i].body) {
            i += 1;
            continue;
        }
        let mut cur = i;
        let mut j = i + 1;
        while j < arms.len() {
            if arms[j].body.is_empty() {
                i += 1;
                j += 1;
                continue;
            }
            let last = j + 1 == arms.len();
            let eq = bodies_eq(&arms[j].body, &arms[cur].body, &arms[j].span, false);
            let eq_last = last && bodies_eq(&arms[j].body, &arms[cur].body, &arms[j].span, true);
            if eq || eq_last {
                arms[cur].body.clear();
                cur = j;
                i += 1;
                j += 1;
                continue;
            }
            break;
        }
        i += 1;
    }
}

fn bodies_eq(branch: &[N], prev: &[N], span: &N, insert_break: bool) -> bool {
    let mut b = branch.to_vec();
    if insert_break {
        b.push(eval::atom(span, Data::Break { label: None }));
    }
    if b.len() != prev.len() {
        return false;
    }
    let left = eval::atom(span, Data::Block { body: b });
    let right = eval::atom(span, Data::Block { body: prev.to_vec() });
    codegen::print(&left) == codegen::print(&right)
}

fn is_inert(arm: &Arm) -> bool {
    !list_aborts(&arm.body) && !block_side(&arm.body)
}

fn block_side(stmts: &[N]) -> bool {
    stmts.iter().any(stmt_side)
}

fn stmt_side(n: &N) -> bool {
    match &n.data {
        Data::Empty | Data::Directive { .. } | Data::Func { .. } => false,
        Data::Simple { body } => !eval::is_pure(body) && !pure_read(body),
        Data::Block { body } | Data::Default { body } => block_side(body),
        Data::Case { expr, body } => stmt_side_expr(expr) || block_side(body),
        Data::Defs { defs, .. } => defs.iter().any(|d| matches!(d.data, Data::VarDef { value: Some(_), .. })),
        _ => true,
    }
}

fn stmt_side_expr(n: &N) -> bool {
    !eval::is_pure(n) && !pure_read(n)
}

fn pure_read(n: &N) -> bool {
    match &n.data {
        Data::Symbol { .. } => true,
        Data::Unary { op, expr, prefix: true } if matches!(op.as_str(), "!" | "~" | "-" | "+" | "void" | "typeof") => {
            pure_read(expr) || eval::is_pure(expr)
        }
        Data::Binary { left, right, .. } => (pure_read(left) || eval::is_pure(left)) && (pure_read(right) || eval::is_pure(right)),
        _ => false,
    }
}

fn prune_trailing(arms: &mut Vec<Arm>, marker: &mut Option<u32>, decl: &mut Vec<N>, cx: &Cx) {
    if arms.is_empty() {
        return;
    }
    let mut i = arms.len() as isize - 1;
    while i >= 0 {
        let idx = i as usize;
        pop_switch_breaks(&mut arms[idx].body, cx);
        if !is_inert(&arms[idx]) {
            break;
        }
        i -= 1;
    }
    let start = (i + 1) as usize;
    let marker_at = marker.and_then(|id| arms.iter().position(|a| a.id == id));
    if marker.is_some() && marker_at.is_some_and(|at| at < start) {
        return;
    }
    while arms.len() > start {
        let arm = arms.pop().unwrap();
        if marker == &Some(arm.id) {
            *marker = None;
        } else if arm.expr.as_ref().is_some_and(|e| stmt_side_expr(e)) {
            arms.push(arm);
            break;
        }
        eliminate(&arm, None, arms, decl, cx);
    }
}

fn pop_switch_breaks(body: &mut Vec<N>, cx: &Cx) {
    while body.last().is_some_and(|s| is_break_stmt(s, cx)) {
        body.pop();
    }
}

fn fold_into_default(
    n: &N,
    expr: &N,
    arms: &mut Vec<Arm>,
    marker: &mut Option<u32>,
    decl: &mut Vec<N>,
    cx: &Cx,
    depth: u8,
) -> Option<N> {
    let mid = (*marker)?;
    let Some(mi) = arms.iter().position(|a| a.id == mid) else {
        return None;
    };
    let i = arms.iter().position(|a| !is_inert(a)).map(|p| p as isize).unwrap_or(-1);
    let mut case_body: Option<N> = None;
    if i == arms.len() as isize - 1 {
        if nested_break(arms, n) {
            return None;
        }
        let branch = &mut arms[i as usize];
        case_body = Some(eval::atom(&branch.span, Data::Block { body: branch.body.clone() }));
        branch.body.clear();
    } else if i != -1 {
        return None;
    }
    let side = arms.iter().any(|a| a.id != mid && a.expr.as_ref().is_some_and(|e| stmt_side_expr(e)));
    if !side {
        let mut stmts = std::mem::take(decl);
        stmts.push(eval::simple(n, Rc::clone(expr)));
        if let Some(e) = arms.iter().find(|a| a.id == mid).and_then(|a| a.expr.clone()) {
            stmts.push(eval::simple(n, e));
        }
        if let Some(body) = case_body {
            stmts.push(body);
        }
        return Some(finish_switch_block(n, stmts, cx));
    }
    if let Some(di) = arms.iter().position(|a| a.id == mid) {
        arms.remove(di);
    }
    *marker = None;
    if let Some(body) = case_body {
        let switched = switch_node(n, Rc::clone(expr), arms.iter().map(arm_node).collect());
        let again = optimize_switch(&switched, cx, depth + 1).unwrap_or(switched);
        let mut stmts = std::mem::take(decl);
        stmts.push(again);
        stmts.push(body);
        return Some(finish_switch_block(n, stmts, cx));
    }
    let _ = (mi, i);
    None
}

fn switch_two(span: &N, expr: &N, arms: &[Arm], marker: u32, cx: &Cx) -> Option<N> {
    let mark = arms.iter().find(|a| a.id == marker)?;
    let branch = if arms[0].id == marker { &arms[1] } else { &arms[0] };
    let case_expr = branch.expr.clone()?;
    let exact_exp = mark.expr.clone().map(|e| eval::simple(span, e));
    if list_aborts(&arms[0].body) {
        let mut first_body = arms[0].body.clone();
        if first_body.last().is_some_and(|s| is_break_stmt(s, cx)) {
            first_body.pop();
        }
        let (if_body, alt_body) = if arms[0].id == branch.id {
            (first_body, mark.body.clone())
        } else {
            (branch.body.clone(), first_body)
        };
        let _ = exact_exp;
        let mut marked_stmts = mark.body.clone();
        if arms[0].id == mark.id {
            marked_stmts = alt_body.clone();
        }
        if let Some(e) = mark.expr.clone() {
            marked_stmts.insert(0, eval::simple(span, e));
        }
        let cond = eval::binary(span, "===", Rc::clone(expr), case_expr);
        let body = stable_body(&branch.span, if_body, cx);
        let alt = stable_body(&mark.span, marked_stmts, cx);
        // `AST_If.optimize`: an aborting body splits off the alternative into
        // a block, so the returned node is the block and the `if` is not
        // `OPTIMIZED`. A later descend optimizes it again.
        if eval::aborts(&body) {
            let iff = eval::atom(span, Data::If { cond, body, alt: None });
            return Some(finish_switch_block(span, vec![iff, alt], cx));
        }
        return Some(sealed_if(span, cond, body, Some(alt), cx));
    }
    let mut operator = "===";
    let mut consequent = stable_body(&branch.span, branch.body.clone(), cx);
    let mut always_stmts = mark.body.clone();
    if let Some(e) = mark.expr.clone() {
        always_stmts.insert(0, eval::simple(span, e));
    }
    let mut always = stable_body(&mark.span, always_stmts, cx);
    if arms[0].id == marker {
        operator = "!==";
        std::mem::swap(&mut always, &mut consequent);
    }
    let cond = eval::binary(span, operator, Rc::clone(expr), case_expr);
    let iff = sealed_if(span, cond, consequent, None, cx);
    Some(finish_switch_block(span, vec![iff, always], cx))
}

/// One statement stays a statement so the second descend does not rebuild the `if`.
fn stable_body(span: &N, stmts: Vec<N>, cx: &Cx) -> N {
    let mut stmts = crate::tighten(stmts, cx);
    stmts.retain(|s| !matches!(s.data, Data::Empty));
    if stmts.is_empty() {
        eval::empty(span)
    } else if stmts.len() == 1 && crate::can_evict(&stmts[0]) {
        stmts.pop().unwrap()
    } else {
        eval::atom(span, Data::Block { body: stmts })
    }
}

fn sealed_if(span: &N, cond: N, body: N, alt: Option<N>, cx: &Cx) -> N {
    let iff = eval::atom(span, Data::If { cond, body, alt });
    cx.seal_optimized(&iff);
    iff
}

fn nested_break(arms: &[Arm], root: &N) -> bool {
    let mut found = false;
    let mut stack = vec![Rc::clone(root)];
    for arm in arms {
        let node = arm_node(arm);
        stack.push(Rc::clone(&node));
        for stmt in &arm.body {
            walk_break(stmt, &mut stack, root, &mut found, true);
        }
        stack.pop();
    }
    found
}

fn walk_break(n: &N, stack: &mut Vec<N>, root: &N, found: &mut bool, direct: bool) {
    if *found {
        return;
    }
    match &n.data {
        Data::Func { .. } | Data::Simple { .. } => return,
        Data::Break { .. } => {
            if loop_target(n, stack).is_some_and(|t| Rc::ptr_eq(t, root)) {
                let trailing = direct
                    && stack.last().is_some_and(|p| {
                        arm_last(p).is_some_and(|s| Rc::ptr_eq(s, n))
                    });
                if !trailing {
                    *found = true;
                }
            }
            return;
        }
        _ => {}
    }
    stack.push(Rc::clone(n));
    for child in stmt_kids(n) {
        walk_break(&child, stack, root, found, false);
    }
    stack.pop();
}

fn arm_last(n: &N) -> Option<&N> {
    match &n.data {
        Data::Case { body, .. } | Data::Default { body } => body.last(),
        _ => None,
    }
}

fn finish_switch_block(span: &N, stmts: Vec<N>, cx: &Cx) -> N {
    let mut stmts = stmts;
    for _ in 0..6 {
        let flat = flatten_evictable(stmts);
        let next = drop_switch_aborts(flat, cx);
        if next.len() == 0 {
            stmts = next;
            break;
        }
        stmts = next;
        if !stmts.iter().any(|s| matches!(s.data, Data::Block { .. })) {
            break;
        }
    }
    stmts.retain(|s| !matches!(s.data, Data::Empty));
    if stmts.is_empty() {
        eval::empty(span)
    } else if stmts.len() == 1 && crate::can_evict(&stmts[0]) {
        stmts.into_iter().next().unwrap()
    } else {
        eval::atom(span, Data::Block { body: stmts })
    }
}

fn drop_switch_aborts(stmts: Vec<N>, cx: &Cx) -> Vec<N> {
    let mut out = Vec::new();
    for (i, stat) in stmts.iter().enumerate() {
        if !is_break_stmt(stat, cx) {
            out.push(Rc::clone(stat));
        }
        if eval::aborts(stat) {
            for rest in &stmts[i + 1..] {
                eval::extract_unreachable(rest, &mut out, cx, false);
            }
            break;
        }
    }
    out
}

fn flatten_evictable(stmts: Vec<N>) -> Vec<N> {
    let mut out = Vec::new();
    for stat in stmts {
        if let Data::Block { body } = &stat.data {
            if body.iter().all(crate::can_evict) {
                out.extend(flatten_evictable(body.clone()));
                continue;
            }
        }
        if !matches!(stat.data, Data::Empty) {
            out.push(stat);
        }
    }
    out
}

fn switch_node(span: &N, expr: N, body: Vec<N>) -> N {
    eval::atom(span, Data::Switch { expr, body })
}

fn stmt_kids(n: &N) -> Vec<N> {
    match &n.data {
        Data::Block { body } | Data::Default { body } | Data::StaticBlock { body } => body.clone(),
        Data::Case { body, .. } => body.clone(),
        Data::If { body, alt, .. } => {
            let mut v = vec![Rc::clone(body)];
            if let Some(a) = alt {
                v.push(Rc::clone(a));
            }
            v
        }
        Data::Labeled { body, .. }
        | Data::While { body, .. }
        | Data::Do { body, .. }
        | Data::With { body, .. }
        | Data::Finally { body } => vec![Rc::clone(body)],
        Data::For { init, body, .. } => {
            let mut v = vec![Rc::clone(body)];
            if let Some(i) = init {
                v.push(Rc::clone(i));
            }
            v
        }
        Data::ForIn { init, body, .. } | Data::ForOf { init, body, .. } => {
            vec![Rc::clone(init), Rc::clone(body)]
        }
        Data::Switch { body, .. } => body.clone(),
        Data::Try { body, catch, finally } => {
            let mut v = vec![Rc::clone(body)];
            if let Some(c) = catch {
                v.push(Rc::clone(c));
            }
            if let Some(f) = finally {
                v.push(Rc::clone(f));
            }
            v
        }
        Data::Catch { body, .. } => vec![Rc::clone(body)],
        _ => Vec::new(),
    }
}
