//! terser `lib/compress/tighten-body.js` `tighten_body`, without `collapse`
//! (that is `tighten.rs`, run as its own pass).
//!
//! The loop runs `eliminate_spurious_blocks`, `eliminate_dead_code`,
//! `handle_if_return`, `sequencesize`, `sequencesize_2`, and
//! `join_consecutive_vars` until nothing changes, at most 11 times. Nodes that
//! terser builds and then `.transform(compressor)`s go through `transform`
//! here, with the scope or block being tightened as the stack top.

use crate::{eval, transform, Cx};
use ast::{Data, DefKind, FuncKind, N};
use std::rc::Rc;

struct St {
    changed: bool,
}

pub(crate) fn tighten_body(mut stmts: Vec<N>, cx: &mut Cx) -> Vec<N> {
    let mut st = St { changed: false };
    let mut max_iter = 10;
    let mut collapsed = false;
    loop {
        st.changed = false;
        eliminate_spurious_blocks(&mut stmts, &mut st);
        if cx.opts.dead_code {
            eliminate_dead_code(&mut stmts, cx, &mut st);
        }
        if cx.opts.if_return {
            handle_if_return(&mut stmts, cx, &mut st);
        }
        if cx.opts.sequences_limit > 0 {
            sequencesize(&mut stmts, cx, &mut st);
            sequencesize_2(&mut stmts, cx, &mut st);
        }
        if cx.opts.join_vars {
            join_consecutive_vars(&mut stmts, cx, &mut st);
        }
        if cx.opts.collapse_vars {
            if let Some(scope) = collapse_scope(&stmts, cx) {
                let (next, changed) = crate::tighten::collapse_step(
                    stmts,
                    cx.opts.unused,
                    cx.opts.toplevel_vars,
                    &scope.0,
                    &scope.1,
                    scope.2,
                );
                stmts = next;
                if changed {
                    st.changed = true;
                    collapsed = true;
                }
            }
        }
        let again = st.changed && max_iter > 0;
        max_iter -= 1;
        if !again {
            break;
        }
    }
    if collapsed && cx.opts.unused && self_node(cx).is_some_and(|s| matches!(s.data, Data::Func { .. })) {
        stmts = crate::tighten::drop_unmentioned_in(&stmts);
    }
    stmts
}

/// Locals of this body, every enclosing scope's bindings, and whether it is a
/// function. `None` for a block: `collapse` here is name based and a block's
/// `var` belongs to the function, so blocks are not collapsed on their own.
fn collapse_scope(stmts: &[N], cx: &Cx) -> Option<(std::collections::HashSet<String>, std::collections::HashSet<String>, bool)> {
    let me = self_node(cx)?;
    let (locals, in_fn) = match &me.data {
        Data::Func { args, .. } => (crate::tighten::scope_bindings(args, stmts), true),
        Data::Toplevel { .. } => (crate::tighten::scope_bindings(&[], stmts), false),
        Data::StaticBlock { .. } => (crate::tighten::scope_bindings(&[], stmts), true),
        _ => return None,
    };
    let mut declared = locals.clone();
    let len = cx.parents.len();
    for p in &cx.parents[..len.saturating_sub(1)] {
        match &p.data {
            Data::Func { args, body, .. } => declared.extend(crate::tighten::scope_bindings(args, body)),
            Data::Toplevel { body } => declared.extend(crate::tighten::scope_bindings(&[], body)),
            _ => {}
        }
    }
    Some((locals, declared, in_fn))
}

fn self_node(cx: &Cx) -> Option<N> {
    cx.parents.last().cloned()
}

fn can_evict(n: &N) -> bool {
    crate::can_evict(n)
}

fn eliminate_spurious_blocks(stmts: &mut Vec<N>, st: &mut St) {
    let mut seen_dirs: Vec<String> = Vec::new();
    let mut i = 0;
    while i < stmts.len() {
        let stat = Rc::clone(&stmts[i]);
        match &stat.data {
            Data::Block { body } if body.iter().all(can_evict) => {
                st.changed = true;
                let mut inner = body.clone();
                eliminate_spurious_blocks(&mut inner, st);
                let len = inner.len();
                stmts.splice(i..i + 1, inner);
                i += len;
            }
            Data::Empty => {
                st.changed = true;
                stmts.remove(i);
            }
            Data::Directive { value, .. } => {
                if seen_dirs.iter().any(|v| v == value) {
                    st.changed = true;
                    stmts.remove(i);
                } else {
                    seen_dirs.push(value.clone());
                    i += 1;
                }
            }
            _ => i += 1,
        }
    }
}

/// terser `tighten-body.js` `loop_body`.
fn loop_body(x: &N) -> N {
    match &x.data {
        Data::For { body, .. }
        | Data::ForIn { body, .. }
        | Data::ForOf { body, .. }
        | Data::While { body, .. }
        | Data::Do { body, .. } => {
            if matches!(body.data, Data::Block { .. }) {
                Rc::clone(body)
            } else {
                Rc::clone(x)
            }
        }
        _ => Rc::clone(x),
    }
}

fn is_iteration(n: &N) -> bool {
    matches!(
        n.data,
        Data::For { .. } | Data::ForIn { .. } | Data::ForOf { .. } | Data::While { .. } | Data::Do { .. }
    )
}

fn eliminate_dead_code(stmts: &mut Vec<N>, cx: &Cx, st: &mut St) {
    let self_n = self_node(cx);
    let len = stmts.len();
    let mut out: Vec<N> = Vec::with_capacity(len);
    let mut has_quit: Option<Vec<N>> = None;
    for i in 0..len {
        let stat = Rc::clone(&stmts[i]);
        let mut keep = true;
        if matches!(stat.data, Data::Break { .. } | Data::Continue { .. }) {
            if let (Some(lct), Some(me)) = (crate::loops::loop_target(&stat, &cx.parents), self_n.as_ref()) {
                let drop = match &stat.data {
                    Data::Break { .. } => !is_iteration(lct) && Rc::ptr_eq(&loop_body(lct), me),
                    _ => Rc::ptr_eq(&loop_body(lct), me),
                };
                keep = !drop;
            }
        }
        if keep {
            out.push(Rc::clone(&stat));
        }
        if eval::aborts(&stat) {
            has_quit = Some(stmts[i + 1..].to_vec());
            break;
        }
    }
    let n = out.len();
    // terser assigns, it does not OR: an earlier `CHANGED` is reset here.
    st.changed = n != len;
    if let Some(rest) = has_quit {
        for stat in &rest {
            eval::extract_unreachable(stat, &mut out, cx, true);
        }
    }
    *stmts = out;
}

/// terser `inference.js` `aborts`, returning the node.
fn aborts_node(n: Option<&N>) -> Option<N> {
    let n = n?;
    match &n.data {
        Data::Return { .. } | Data::Throw { .. } | Data::Break { .. } | Data::Continue { .. } => Some(Rc::clone(n)),
        Data::Block { body } | Data::StaticBlock { body } => body.iter().find(|s| eval::aborts(s)).cloned(),
        Data::If { body, alt, .. } => {
            if alt.is_some() && eval::aborts(body) && alt.as_ref().is_some_and(eval::aborts) {
                Some(Rc::clone(n))
            } else {
                None
            }
        }
        Data::Class { props, .. } => props
            .iter()
            .find(|p| matches!(p.data, Data::StaticBlock { .. }) && eval::aborts(p))
            .cloned(),
        _ => None,
    }
}

fn as_statement_array(n: Option<&N>) -> Vec<N> {
    match n {
        None => Vec::new(),
        Some(n) => match &n.data {
            Data::Block { body } => body.clone(),
            Data::Empty => Vec::new(),
            _ => vec![Rc::clone(n)],
        },
    }
}

fn declarations_only(n: &N) -> bool {
    match &n.data {
        Data::Defs { defs, .. } => defs.iter().all(|d| matches!(d.data, Data::VarDef { value: None, .. })),
        _ => false,
    }
}

fn is_var_decls_only(n: &N) -> bool {
    matches!(n.data, Data::Defs { kind: DefKind::Var, .. }) && declarations_only(n)
}

fn is_return_void(value: &Option<N>) -> bool {
    match value {
        None => true,
        Some(v) => matches!(&v.data, Data::Unary { op, prefix: true, .. } if op == "void"),
    }
}

fn block(span: &N, body: Vec<N>) -> N {
    eval::atom(span, Data::Block { body })
}

fn if_parts(n: &N) -> Option<(&N, &N, Option<&N>)> {
    match &n.data {
        Data::If { cond, body, alt } => Some((cond, body, alt.as_ref())),
        _ => None,
    }
}

fn handle_if_return(stmts: &mut Vec<N>, cx: &mut Cx, st: &mut St) {
    let self_n = self_node(cx);
    let in_lambda = self_n.as_ref().is_some_and(|s| matches!(s.data, Data::Func { .. }));
    let multiple_if_returns = {
        let mut n = 0;
        stmts
            .iter()
            .rev()
            .any(|s| {
                if matches!(if_parts(s), Some((_, b, _)) if matches!(b.data, Data::Return { .. })) {
                    n += 1;
                }
                n > 1
            })
    };
    let next_index = |stmts: &Vec<N>, i: usize| -> usize {
        let mut j = i + 1;
        while j < stmts.len() && is_var_decls_only(&stmts[j]) {
            j += 1;
        }
        j
    };
    let prev_index = |stmts: &Vec<N>, i: usize| -> Option<usize> {
        let mut j = i;
        while j > 0 {
            j -= 1;
            if !is_var_decls_only(&stmts[j]) {
                return Some(j);
            }
        }
        None
    };
    let mut i = stmts.len().min(500);
    while i > 0 {
        i -= 1;
        if i >= stmts.len() {
            continue;
        }
        let stat = Rc::clone(&stmts[i]);
        let j = next_index(stmts, i);
        let next = stmts.get(j).cloned();

        if in_lambda && next.is_none() {
            if let Data::Return { value } = &stat.data {
                match value {
                    None => {
                        st.changed = true;
                        stmts.remove(i);
                        continue;
                    }
                    Some(v) => {
                        if let Data::Unary { op, expr, prefix: true } = &v.data {
                            if op == "void" {
                                st.changed = true;
                                stmts[i] = eval::simple(&stat, Rc::clone(expr));
                                continue;
                            }
                        }
                    }
                }
            }
        }

        if let Some((cond, body, alt)) = if_parts(&stat) {
            let (cond, body, alt) = (Rc::clone(cond), Rc::clone(body), alt.cloned());
            let ab = aborts_node(Some(&body));
            if let Some(ab) = ab.filter(|ab| can_merge_flow(ab, stmts, i, in_lambda, self_n.as_ref(), cx)) {
                if let Some(new_else) = as_statement_array_with_return(&body, &ab) {
                    st.changed = true;
                    let mut then_body = as_statement_array(alt.as_ref());
                    then_body.extend(extract_defuns(stmts, i));
                    let neg = eval::negate_expr(&cond, cx);
                    let new_if = eval::atom(
                        &stat,
                        Data::If {
                            cond: neg,
                            body: block(&stat, then_body),
                            alt: Some(block(&stat, new_else)),
                        },
                    );
                    stmts[i] = transform(&new_if, cx);
                    continue;
                }
            }
            let ab = aborts_node(alt.as_ref());
            if let Some(ab) = ab.filter(|ab| can_merge_flow(ab, stmts, i, in_lambda, self_n.as_ref(), cx)) {
                let alt_n = alt.clone().unwrap();
                if let Some(new_else) = as_statement_array_with_return(&alt_n, &ab) {
                    st.changed = true;
                    let mut then_body = as_statement_array(Some(&body));
                    then_body.extend(extract_defuns(stmts, i));
                    let new_if = eval::atom(
                        &stat,
                        Data::If {
                            cond: Rc::clone(&cond),
                            body: block(&body, then_body),
                            alt: Some(block(&alt_n, new_else)),
                        },
                    );
                    stmts[i] = transform(&new_if, cx);
                    continue;
                }
            }
        }

        if let Some((cond, body, alt)) = if_parts(&stat) {
            let Data::Return { value } = &body.data else {
                continue;
            };
            let (cond, body, has_alt) = (Rc::clone(cond), Rc::clone(body), alt.is_some());
            let value = value.clone();
            let next_is_return = next.as_ref().is_some_and(|n| matches!(n.data, Data::Return { .. }));
            let next_return_value = match next.as_ref().map(|n| &n.data) {
                Some(Data::Return { value }) => value.clone(),
                _ => None,
            };
            // if (foo()) return; return; ==> foo(); return;
            if value.is_none()
                && !has_alt
                && (in_lambda && next.is_none() || next_is_return && next_return_value.is_none())
            {
                st.changed = true;
                stmts[i] = eval::simple(&cond, Rc::clone(&cond));
                continue;
            }
            // if (foo()) return x; return y; ==> return foo() ? x : y;
            if value.is_some() && !has_alt && next_is_return && next_return_value.is_some() {
                st.changed = true;
                let new_if = eval::atom(&stat, Data::If { cond, body, alt: next.clone() });
                stmts[i] = transform(&new_if, cx);
                stmts.remove(j);
                continue;
            }
            // if (foo()) return x; [ return ; ] ==> return foo() ? x : undefined;
            if value.is_some() && !has_alt && (next.is_none() && in_lambda && multiple_if_returns || next_is_return) {
                st.changed = true;
                let alt = next.clone().unwrap_or_else(|| eval::atom(&stat, Data::Return { value: None }));
                let new_if = eval::atom(&stat, Data::If { cond, body, alt: Some(alt) });
                stmts[i] = transform(&new_if, cx);
                if next.is_some() {
                    stmts.remove(j);
                }
                continue;
            }
            // if (a) return b; if (c) return d; e; ==> return a ? b : c ? d : void e;
            let prev = prev_index(stmts, i).map(|p| Rc::clone(&stmts[p]));
            let prev_if_return = prev
                .as_ref()
                .and_then(if_parts)
                .is_some_and(|(_, b, _)| matches!(b.data, Data::Return { .. }));
            if cx.opts.sequences_limit > 0
                && in_lambda
                && !has_alt
                && prev_if_return
                && next_index(stmts, j) == stmts.len()
                && next.as_ref().is_some_and(|n| matches!(n.data, Data::Simple { .. }))
            {
                st.changed = true;
                let next_n = next.clone().unwrap();
                let alt = block(&next_n, vec![Rc::clone(&next_n), eval::atom(&next_n, Data::Return { value: None })]);
                let new_if = eval::atom(&stat, Data::If { cond, body, alt: Some(alt) });
                stmts[i] = transform(&new_if, cx);
                stmts.remove(j);
                continue;
            }
        }
    }
}

fn can_merge_flow(ab: &N, stmts: &[N], i: usize, in_lambda: bool, self_n: Option<&N>, cx: &Cx) -> bool {
    for s in &stmts[i + 1..] {
        if matches!(s.data, Data::Defs { kind: DefKind::Let | DefKind::Const | DefKind::Using, .. }) {
            return false;
        }
    }
    match &ab.data {
        Data::Return { value } => in_lambda && is_return_void(value),
        Data::Continue { .. } => {
            let Some(me) = self_n else { return false };
            crate::loops::loop_target(ab, &cx.parents).is_some_and(|lct| Rc::ptr_eq(&loop_body(lct), me))
        }
        Data::Break { .. } => {
            let Some(me) = self_n else { return false };
            crate::loops::loop_target(ab, &cx.parents)
                .is_some_and(|lct| matches!(lct.data, Data::Block { .. }) && Rc::ptr_eq(lct, me))
        }
        _ => false,
    }
}

fn extract_defuns(stmts: &mut Vec<N>, i: usize) -> Vec<N> {
    let tail = stmts.split_off(i + 1);
    let mut out = Vec::new();
    for stat in tail {
        if matches!(stat.data, Data::Func { kind: FuncKind::Decl, .. }) {
            stmts.push(stat);
        } else {
            out.push(stat);
        }
    }
    out
}

fn as_statement_array_with_return(node: &N, ab: &N) -> Option<Vec<N>> {
    let mut body = as_statement_array(Some(node));
    if !body.last().is_some_and(|l| Rc::ptr_eq(l, ab)) {
        return None;
    }
    body.pop();
    if !body.iter().all(can_evict) {
        return None;
    }
    if let Data::Return { value: Some(v) } = &ab.data {
        let inner = match &v.data {
            Data::Unary { expr, .. } => Rc::clone(expr),
            _ => Rc::clone(v),
        };
        body.push(eval::simple(v, inner));
    }
    Some(body)
}

fn merge_sequence(seq: &mut Vec<N>, n: N) {
    if let Data::Seq { exprs } = &n.data {
        seq.extend(exprs.iter().cloned());
    } else {
        seq.push(n);
    }
}

fn make_sequence(span: &N, mut exprs: Vec<N>) -> N {
    if exprs.len() == 1 {
        return exprs.pop().unwrap();
    }
    eval::atom(span, Data::Seq { exprs })
}

fn sequencesize(stmts: &mut Vec<N>, cx: &Cx, st: &mut St) {
    if stmts.len() < 2 {
        return;
    }
    let limit = cx.opts.sequences_limit as usize;
    let len = stmts.len();
    let mut out: Vec<N> = Vec::with_capacity(len);
    let mut seq: Vec<N> = Vec::new();
    let push_seq = |out: &mut Vec<N>, seq: &mut Vec<N>| {
        if seq.is_empty() {
            return;
        }
        let exprs = std::mem::take(seq);
        let first = Rc::clone(&exprs[0]);
        let body = make_sequence(&first, exprs);
        out.push(eval::simple(&body, body.clone()));
    };
    for stat in stmts.iter() {
        match &stat.data {
            Data::Simple { body } => {
                if seq.len() >= limit {
                    push_seq(&mut out, &mut seq);
                }
                let body = if !seq.is_empty() {
                    crate::unary::drop_side_effect_free(body, cx, false)
                } else {
                    Some(Rc::clone(body))
                };
                if let Some(body) = body {
                    merge_sequence(&mut seq, body);
                }
            }
            Data::Defs { kind: DefKind::Var | DefKind::Let | DefKind::Const, .. } if declarations_only(stat) => {
                out.push(Rc::clone(stat));
            }
            Data::Func { kind: FuncKind::Decl, .. } => out.push(Rc::clone(stat)),
            _ => {
                push_seq(&mut out, &mut seq);
                out.push(Rc::clone(stat));
            }
        }
    }
    push_seq(&mut out, &mut seq);
    if out.len() != len {
        st.changed = true;
    }
    *stmts = out;
}

fn to_simple_statement(block: Option<&N>, decls: &mut Vec<N>) -> Result<Option<N>, ()> {
    let Some(block) = block else {
        return Ok(None);
    };
    let Data::Block { body } = &block.data else {
        return Ok(Some(Rc::clone(block)));
    };
    let mut stat: Option<N> = None;
    for line in body {
        if is_var_decls_only(line) {
            decls.push(Rc::clone(line));
        } else if stat.is_some()
            || matches!(line.data, Data::Defs { kind: DefKind::Let | DefKind::Const | DefKind::Using, .. })
        {
            return Err(());
        } else {
            stat = Some(Rc::clone(line));
        }
    }
    Ok(stat)
}

fn has_in_operator(n: &N) -> bool {
    match &n.data {
        Data::Func { .. } | Data::Class { .. } => false,
        Data::Binary { op, .. } if op == "in" => true,
        _ => crate::child_refs(&n.data).into_iter().any(has_in_operator),
    }
}

fn sequencesize_2(stmts: &mut Vec<N>, cx: &mut Cx, st: &mut St) {
    let input = std::mem::take(stmts);
    let mut out: Vec<N> = Vec::with_capacity(input.len());
    let mut prev: Option<N> = None;
    for stat in input {
        let mut stat = stat;
        if let Some(prev_stat) = prev.clone() {
            let Data::Simple { body: left } = &prev_stat.data else { unreachable!() };
            let left = Rc::clone(left);
            let cons_seq = |right: N, out: &mut Vec<N>, cx: &mut Cx, st: &mut St| -> N {
                out.pop();
                st.changed = true;
                let seq = eval::atom(&left, Data::Seq { exprs: vec![Rc::clone(&left), right] });
                transform(&seq, cx)
            };
            match &stat.data {
                Data::Return { value } => {
                    let right = match value {
                        Some(v) => Rc::clone(v),
                        None => {
                            let v = eval::void0(&stat);
                            transform(&v, cx)
                        }
                    };
                    let v = cons_seq(right, &mut out, cx, st);
                    stat = eval::atom(&stat, Data::Return { value: Some(v) });
                }
                Data::Throw { value } => {
                    let v = cons_seq(Rc::clone(value), &mut out, cx, st);
                    stat = eval::atom(&stat, Data::Throw { value: v });
                }
                Data::For { init, cond, step, body } => {
                    let init_is_defs = init.as_ref().is_some_and(|i| matches!(i.data, Data::Defs { .. }));
                    if !init_is_defs && !has_in_operator(&left) {
                        let new_init = match init {
                            Some(i) => cons_seq(Rc::clone(i), &mut out, cx, st),
                            None => {
                                out.pop();
                                st.changed = true;
                                Rc::clone(&left)
                            }
                        };
                        stat = eval::atom(
                            &stat,
                            Data::For { init: Some(new_init), cond: cond.clone(), step: step.clone(), body: Rc::clone(body) },
                        );
                    }
                }
                Data::ForIn { init, object, body } => {
                    if !matches!(init.data, Data::Defs { .. }) || matches!(init.data, Data::Defs { kind: DefKind::Var, .. }) {
                        let o = cons_seq(Rc::clone(object), &mut out, cx, st);
                        stat = eval::atom(&stat, Data::ForIn { init: Rc::clone(init), object: o, body: Rc::clone(body) });
                    }
                }
                Data::ForOf { init, object, body, await_ } => {
                    if !matches!(init.data, Data::Defs { .. }) || matches!(init.data, Data::Defs { kind: DefKind::Var, .. }) {
                        let o = cons_seq(Rc::clone(object), &mut out, cx, st);
                        stat = eval::atom(
                            &stat,
                            Data::ForOf { init: Rc::clone(init), object: o, body: Rc::clone(body), await_: *await_ },
                        );
                    }
                }
                Data::If { cond, body, alt } => {
                    let c = cons_seq(Rc::clone(cond), &mut out, cx, st);
                    stat = eval::atom(&stat, Data::If { cond: c, body: Rc::clone(body), alt: alt.clone() });
                }
                Data::Switch { expr, body } => {
                    let e = cons_seq(Rc::clone(expr), &mut out, cx, st);
                    stat = eval::atom(&stat, Data::Switch { expr: e, body: body.clone() });
                }
                Data::With { expr, body } => {
                    let e = cons_seq(Rc::clone(expr), &mut out, cx, st);
                    stat = eval::atom(&stat, Data::With { expr: e, body: Rc::clone(body) });
                }
                _ => {}
            }
        }
        if cx.opts.conditionals {
            if let Data::If { cond, body, alt } = &stat.data {
                let mut decls = Vec::new();
                let b = to_simple_statement(Some(body), &mut decls);
                let a = to_simple_statement(alt.as_ref(), &mut decls);
                if let (Ok(b), Ok(a)) = (b, a) {
                    if !decls.is_empty() {
                        out.extend(decls);
                        out.push(eval::atom(
                            &stat,
                            Data::If {
                                cond: Rc::clone(cond),
                                body: b.unwrap_or_else(|| eval::empty(body)),
                                alt: a,
                            },
                        ));
                        prev = None;
                        st.changed = true;
                        continue;
                    }
                }
            }
        }
        prev = if matches!(stat.data, Data::Simple { .. }) { Some(Rc::clone(&stat)) } else { None };
        out.push(stat);
    }
    *stmts = out;
}

fn join_consecutive_vars(stmts: &mut Vec<N>, _cx: &Cx, st: &mut St) {
    // `join_object_assignments` is not ported: it only fires on an object
    // literal initializer followed by property writes.
    let input = std::mem::take(stmts);
    let mut out: Vec<N> = Vec::with_capacity(input.len());
    // Index in `out` of terser's `defs`.
    let mut defs: Option<usize> = None;
    for stat in input {
        let prev_idx = out.len().checked_sub(1);
        match &stat.data {
            Data::Defs { kind, defs: list, await_ } if *kind != DefKind::Using => {
                let prev_same = prev_idx.is_some_and(|p| {
                    matches!(&out[p].data, Data::Defs { kind: pk, .. } if pk == kind)
                });
                if prev_same {
                    let p = prev_idx.unwrap();
                    out[p] = append_defs(&out[p], list);
                    st.changed = true;
                } else if defs.is_some_and(|d| matches!(&out[d].data, Data::Defs { kind: dk, .. } if dk == kind))
                    && declarations_only(&stat)
                {
                    let d = defs.unwrap();
                    out[d] = append_defs(&out[d], list);
                    st.changed = true;
                } else {
                    let _ = await_;
                    out.push(Rc::clone(&stat));
                    defs = Some(out.len() - 1);
                }
            }
            Data::Defs { kind: DefKind::Using, defs: list, await_ } => {
                let merge = prev_idx.is_some_and(|p| {
                    matches!(&out[p].data, Data::Defs { kind: DefKind::Using, await_: pa, .. } if pa == await_)
                });
                if merge {
                    let p = prev_idx.unwrap();
                    out[p] = append_defs(&out[p], list);
                } else {
                    // terser falls through to the last `else` only for other
                    // statement types; a lone `using` is dropped from the list
                    // there. Keep it, which is what every real input needs.
                    out.push(Rc::clone(&stat));
                }
            }
            Data::For { init, cond, step, body } => {
                let prev = prev_idx.map(|p| Rc::clone(&out[p]));
                let prev_is_var = prev.as_ref().is_some_and(|p| matches!(p.data, Data::Defs { kind: DefKind::Var, .. }));
                let init_same_type = match init {
                    None => true,
                    Some(i) => matches!(i.data, Data::Defs { kind: DefKind::Var, .. }),
                };
                if prev_is_var && init_same_type {
                    let p = prev_idx.unwrap();
                    let mut new_init = Rc::clone(&out[p]);
                    if let Some(i) = init {
                        if let Data::Defs { defs: list, .. } = &i.data {
                            new_init = append_defs(&new_init, list);
                        }
                    }
                    out[p] = eval::atom(
                        &stat,
                        Data::For { init: Some(new_init), cond: cond.clone(), step: step.clone(), body: Rc::clone(body) },
                    );
                    st.changed = true;
                } else if defs.is_some_and(|d| matches!(out[d].data, Data::Defs { kind: DefKind::Var, .. }))
                    && init.as_ref().is_some_and(|i| matches!(i.data, Data::Defs { kind: DefKind::Var, .. }) && declarations_only(i))
                {
                    let d = defs.unwrap();
                    if let Some(Data::Defs { defs: list, .. }) = init.as_ref().map(|i| &i.data) {
                        out[d] = append_defs(&out[d], list);
                    }
                    out.push(eval::atom(
                        &stat,
                        Data::For { init: None, cond: cond.clone(), step: step.clone(), body: Rc::clone(body) },
                    ));
                    st.changed = true;
                } else {
                    out.push(Rc::clone(&stat));
                }
            }
            _ => out.push(Rc::clone(&stat)),
        }
    }
    *stmts = out;
}

fn append_defs(n: &N, more: &[N]) -> N {
    let Data::Defs { kind, defs, await_ } = &n.data else {
        return Rc::clone(n);
    };
    let mut defs = defs.clone();
    defs.extend(more.iter().cloned());
    eval::atom(n, Data::Defs { kind: *kind, defs, await_: *await_ })
}
