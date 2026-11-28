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
    /// terser `def.references` still counts writes that `join_object_assignments`
    /// moved into the literal. Name → removed references, for `collapse`.
    phantom: std::collections::HashMap<String, usize>,
}

pub(crate) fn tighten_body(mut stmts: Vec<N>, cx: &mut Cx) -> Vec<N> {
    let mut st = St { changed: false, phantom: Default::default() };
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
                let before = stmts.clone();
                crate::tighten::set_injected(cx.injected_refs.borrow().clone());
                // Function-statement names visible here, innermost declaration wins.
                {
                    let mut defuns: std::collections::HashSet<String> = Default::default();
                    let len = cx.parents.len();
                    let parents: Vec<N> = cx.parents[..len.saturating_sub(1)].to_vec();
                    for p in &parents {
                        let (args, body): (&[N], &[N]) = match &p.data {
                            Data::Func { args, body, .. } => (args, body),
                            Data::Toplevel { body } => (&[], body),
                            _ => continue,
                        };
                        let bound = cx.cached_names(p, 0, |_| crate::tighten::scope_bindings(args, body));
                        let own = cx.cached_names(p, 2, |_| {
                            let (d, shadow) = crate::tighten::defun_names(args, body);
                            d.into_iter().filter(|n| !shadow.contains(n)).collect()
                        });
                        defuns.retain(|n| !bound.contains(n));
                        defuns.extend(own.iter().cloned());
                    }
                    let own_args = match self_node(cx).map(|n| n.data.clone()) {
                        Some(Data::Func { args, .. }) => args,
                        _ => Vec::new(),
                    };
                    let (d, shadow) = crate::tighten::defun_names(&own_args, &stmts);
                    let bound = crate::tighten::scope_bindings(&own_args, &stmts);
                    defuns.retain(|n| !bound.contains(n));
                    defuns.extend(d.into_iter().filter(|n| !shadow.contains(n)));
                    crate::tighten::set_defuns(defuns);
                    // terser `is_lhs_read_only`: a function expression's own name
                    // (`AST_SymbolLambda`), unless a binding inside shadows it.
                    let mut lambdas: std::collections::HashSet<String> = Default::default();
                    let mut chain: Vec<N> = parents.clone();
                    if let Some(me) = self_node(cx) {
                        chain.push(me);
                    }
                    for p in &chain {
                        let Data::Func { kind, name, args, body, .. } = &p.data else { continue };
                        if !matches!(kind, ast::FuncKind::Decl) {
                            if let Some(Data::Symbol { name, .. }) = name.as_ref().map(|n| &n.data) {
                                lambdas.insert(name.clone());
                            }
                        }
                        let body: &[N] = if Rc::ptr_eq(p, chain.last().unwrap()) { &stmts } else { body };
                        let bound = crate::tighten::scope_bindings(args, body);
                        lambdas.retain(|n| !bound.contains(n));
                    }
                    crate::tighten::set_lambdas(lambdas);
                }
                if let Some(table) = cx.syms.as_ref() {
                    let mut map = std::collections::HashMap::new();
                    for st in &stmts {
                        collect_vardef_refs(st, table, &mut map);
                    }
                    crate::tighten::set_referenced(map);
                }
                let (next, changed) = crate::tighten::collapse_step(
                    stmts,
                    cx.opts.unused,
                    cx.opts.toplevel_vars,
                    &scope.0,
                    &scope.1,
                    scope.2,
                    &st.phantom,
                    scope.3,
                );
                stmts = next;
                if changed {
                    st.changed = true;
                    collapsed = true;
                    // terser's collapse edits nodes in place, so their
                    // `SQUEEZED` / `OPTIMIZED` flags stay.
                    let block_old = ast::Node::new(Data::Block { body: before });
                    let block_new = ast::Node::new(Data::Block { body: stmts.clone() });
                    crate::transfer_flags(&block_old, &block_new, cx);
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
#[allow(clippy::type_complexity)]
fn collapse_scope(stmts: &[N], cx: &Cx) -> Option<(std::collections::HashSet<String>, std::collections::HashSet<String>, bool, Option<(bool, bool)>)> {
    let me = self_node(cx)?;
    let (locals, in_fn, block) = match &me.data {
        Data::Func { args, .. } => (crate::tighten::scope_bindings(args, stmts), true, None),
        Data::Toplevel { .. } => (crate::tighten::scope_bindings(&[], stmts), false, None),
        Data::StaticBlock { .. } => (crate::tighten::scope_bindings(&[], stmts), true, None),
        // A nested block: only its own `let` / `const` (they cannot be read
        // outside it). terser `find_loop_scope_try` gives the loop and try state.
        Data::Block { .. } => {
            let names = crate::tighten::block_lexicals(stmts);
            // A `var` with a value here can collapse too, when its counts
            // are all in this block (`tighten.rs` `block_var`).
            let has_var = stmts.iter().any(|s| matches!(&s.data, Data::Defs { kind: DefKind::Var, defs, .. }
                if defs.iter().any(|d| matches!(d.data, Data::VarDef { value: Some(_), .. }))));
            if names.is_empty() && !has_var {
                return None;
            }
            let (mut in_loop, mut in_try) = (false, false);
            let len = cx.parents.len();
            for (i, p) in cx.parents[..len.saturating_sub(1)].iter().enumerate().rev() {
                match &p.data {
                    Data::Func { .. } | Data::Toplevel { .. } | Data::StaticBlock { .. } | Data::Class { .. } => break,
                    Data::For { .. } | Data::ForIn { .. } | Data::ForOf { .. } | Data::While { .. } | Data::Do { .. } => in_loop = true,
                    Data::Try { body, .. } => {
                        if cx.parents.get(i + 1).is_some_and(|c| Rc::ptr_eq(c, body)) {
                            in_try = true;
                        }
                    }
                    _ => {}
                }
            }
            crate::tighten::set_block_candidates(names.clone());
            // `may_modify` measures against the enclosing function.
            let mut locals = names;
            let mut block_in_fn = true;
            for p in cx.parents[..len.saturating_sub(1)].iter().rev() {
                if matches!(p.data, Data::Toplevel { .. }) {
                    block_in_fn = false;
                }
                let own = match &p.data {
                    Data::Func { .. } | Data::Toplevel { .. } => cx.cached_names(p, 0, |p| match &p.data {
                        Data::Func { args, body, .. } => crate::tighten::scope_bindings(args, body),
                        Data::Toplevel { body } => crate::tighten::scope_bindings(&[], body),
                        _ => Default::default(),
                    }),
                    _ => continue,
                };
                locals.extend(own.iter().cloned());
                let lets = cx.cached_names(p, 3, |p| match &p.data {
                    Data::Func { body, .. } | Data::Toplevel { body } => crate::tighten::lexical_names_deep(body),
                    _ => Default::default(),
                });
                crate::tighten::set_block_lets(lets.iter().cloned().collect());
                break;
            }
            (locals, block_in_fn, Some((in_loop, in_try)))
        }
        _ => return None,
    };
    let mut declared = locals.clone();
    let len = cx.parents.len();
    for p in &cx.parents[..len.saturating_sub(1)] {
        let names = match &p.data {
            Data::Func { .. } | Data::Toplevel { .. } => cx.cached_names(p, 0, |p| match &p.data {
                Data::Func { args, body, .. } => crate::tighten::scope_bindings(args, body),
                Data::Toplevel { body } => crate::tighten::scope_bindings(&[], body),
                _ => Default::default(),
            }),
            _ => continue,
        };
        declared.extend(names.iter().cloned());
    }
    Some((locals, declared, in_fn, block))
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
                        // terser `make_node(AST_If, ...)`: a fresh node with no flags.
                        let made = eval::atom(
                            &stat,
                            Data::If {
                                cond: Rc::clone(cond),
                                body: b.unwrap_or_else(|| eval::empty(body)),
                                alt: a,
                            },
                        );
                        cx.fresh.borrow_mut().insert(Rc::as_ptr(&made) as usize, Rc::clone(&made));
                        out.push(made);
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

/// terser `tighten-body.js` `join_object_assignments`: leading `name.prop = const`
/// writes after `var name = {...}` move into the literal. Returns the new
/// definitions and the expressions left over.
fn join_object_assignments(defn: &N, body: &N, cx: &Cx, phantom: &mut std::collections::HashMap<String, usize>) -> Option<(N, Vec<N>)> {
    let Data::Defs { kind, defs, await_ } = &defn.data else { return None };
    if *kind == DefKind::Using {
        return None;
    }
    let last = defs.last()?;
    let Data::VarDef { name: def_name, value: Some(obj) } = &last.data else { return None };
    let Data::Object { props } = &obj.data else { return None };
    let Data::Symbol { name: def_name_str, .. } = &def_name.data else { return None };
    let mut exprs: Vec<N> = match &body.data {
        Data::Assign { logical: false, .. } => vec![Rc::clone(body)],
        Data::Seq { exprs } => exprs.clone(),
        _ => return None,
    };
    let mut props = props.clone();
    let strict_es5 = cx.opts.ecma < 2015 && cx.lookup("use strict").is_some();
    let mut trimmed = false;
    while let Some(node) = exprs.first() {
        let Data::Assign { op, left, right, logical: false } = &node.data else { break };
        if op != "=" {
            break;
        }
        let (sym, key) = match &left.data {
            Data::Dot { expr, prop, optional: false, private: false, .. } => (expr, prop.clone()),
            Data::Sub { expr, prop, optional: false } => {
                let key = match &prop.data {
                    Data::String { value, .. } => value.clone(),
                    Data::Number { value, .. } => crate::eval::js_num_tostring(*value),
                    _ => match crate::eval::eval_lit(prop) {
                        Some(crate::eval::Lit::Num(v)) => crate::eval::js_num_tostring(v),
                        Some(crate::eval::Lit::Str(v)) => v,
                        _ => break,
                    },
                };
                (expr, key)
            }
            _ => break,
        };
        let Data::Symbol { name: sname, kind: ast::SymKind::Ref, .. } = &sym.data else { break };
        if sname != def_name_str {
            break;
        }
        if !object_const_expr(right) {
            break;
        }
        // `diff`: no method or computed key may already use the name.
        let clash = props.iter().any(|p| match &p.data {
            Data::Prop { key: ast::Key::Static { name, .. }, method: Some(_), .. } => *name == key,
            Data::Prop { key: ast::Key::Static { name, .. }, method: None, .. } => strict_es5 && *name == key,
            Data::Prop { key: ast::Key::Computed(k), .. } => matches!(&k.data, Data::Symbol { name, .. } if *name == key),
            Data::Prop { .. } => false,
            // `node.key && ...`: a spread has no key.
            _ => true,
        });
        if clash {
            break;
        }
        let existing = props.iter().position(|p| matches!(&p.data, Data::Prop { key: ast::Key::Static { name, .. }, method: None, .. } if *name == key));
        match existing {
            Some(i) => {
                let Data::Prop { method, key: k, value, static_, private, generator, async_ } = &props[i].data else { break };
                let joined = eval::atom(value, Data::Seq { exprs: vec![Rc::clone(value), Rc::clone(right)] });
                props[i] = eval::atom(&props[i], Data::Prop { method: *method, key: k.clone(), value: joined, static_: *static_, private: *private, generator: *generator, async_: *async_ });
            }
            None => {
                let quote = if is_identifier_name(&key) { None } else { Some('"') };
                props.push(eval::atom(node, Data::Prop {
                    method: None,
                    key: ast::Key::Static { name: key, quote },
                    value: Rc::clone(right),
                    static_: false,
                    private: false,
                    generator: false,
                    async_: false,
                }));
            }
        }
        exprs.remove(0);
        *phantom.entry(def_name_str.clone()).or_insert(0) += 1;
        trimmed = true;
    }
    if !trimmed {
        return None;
    }
    let new_obj = eval::atom(obj, Data::Object { props });
    let new_last = eval::atom(last, Data::VarDef { name: Rc::clone(def_name), value: Some(new_obj) });
    let mut new_defs = defs.clone();
    *new_defs.last_mut().unwrap() = new_last;
    Some((eval::atom(defn, Data::Defs { kind: *kind, defs: new_defs, await_: *await_ }), exprs))
}

fn is_identifier_name(s: &str) -> bool {
    let mut chars = s.chars();
    matches!(chars.next(), Some(c) if c.is_ascii_alphabetic() || c == '_' || c == '$')
        && chars.all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '$')
}

/// terser `is_constant_expression` without lambdas.
fn object_const_expr(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::BigInt { .. } | Data::RegExp { .. } | Data::True | Data::False | Data::Null | Data::Infinity => true,
        Data::Unary { expr, .. } => object_const_expr(expr),
        Data::Binary { left, right, .. } => object_const_expr(left) && object_const_expr(right),
        Data::Array { elements } => elements.iter().all(object_const_expr),
        Data::Object { props } => props.iter().all(|p| matches!(&p.data, Data::Prop { key: ast::Key::Static { .. }, method: None, value, .. } if object_const_expr(value))),
        _ => false,
    }
}

fn join_consecutive_vars(stmts: &mut Vec<N>, cx: &Cx, st: &mut St) {
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
            Data::Simple { body } => {
                let joined = prev_idx.and_then(|p| join_object_assignments(&out[p], body, cx, &mut st.phantom));
                match joined {
                    Some((defs_node, rest)) => {
                        st.changed = true;
                        out[prev_idx.unwrap()] = defs_node;
                        if !rest.is_empty() {
                            out.push(eval::simple(&stat, make_sequence(body, rest)));
                        }
                    }
                    None => out.push(Rc::clone(&stat)),
                }
            }
            Data::Return { value: Some(v) } | Data::Throw { value: v } | Data::If { cond: v, .. } | Data::Switch { expr: v, .. } | Data::With { expr: v, .. } | Data::ForIn { object: v, .. } | Data::ForOf { object: v, .. } => {
                // `extract_object_assignments`
                let joined = prev_idx.and_then(|p| join_object_assignments(&out[p], v, cx, &mut st.phantom));
                match joined {
                    Some((defs_node, rest)) => {
                        st.changed = true;
                        out[prev_idx.unwrap()] = defs_node;
                        let new_v = if !rest.is_empty() {
                            make_sequence(v, rest)
                        } else {
                            match &v.data {
                                Data::Seq { exprs } => match &exprs.last().unwrap().data {
                                    Data::Assign { left, .. } => Rc::clone(left),
                                    _ => Rc::clone(v),
                                },
                                Data::Assign { left, .. } => Rc::clone(left),
                                _ => Rc::clone(v),
                            }
                        };
                        out.push(replace_slot(&stat, new_v));
                    }
                    None => out.push(Rc::clone(&stat)),
                }
            }
            _ => out.push(Rc::clone(&stat)),
        }
    }
    *stmts = out;
}

/// The statement with its `extract_object_assignments` slot replaced.
fn replace_slot(stat: &N, v: N) -> N {
    let data = match &stat.data {
        Data::Return { .. } => Data::Return { value: Some(v) },
        Data::Throw { .. } => Data::Throw { value: v },
        Data::If { body, alt, .. } => Data::If { cond: v, body: Rc::clone(body), alt: alt.clone() },
        Data::Switch { body, .. } => Data::Switch { expr: v, body: body.clone() },
        Data::With { body, .. } => Data::With { expr: v, body: Rc::clone(body) },
        Data::ForIn { init, body, .. } => Data::ForIn { init: Rc::clone(init), object: v, body: Rc::clone(body) },
        Data::ForOf { init, body, await_, .. } => Data::ForOf { init: Rc::clone(init), object: v, body: Rc::clone(body), await_: *await_ },
        _ => return Rc::clone(stat),
    };
    eval::atom(stat, data)
}

fn append_defs(n: &N, more: &[N]) -> N {
    let Data::Defs { kind, defs, await_ } = &n.data else {
        return Rc::clone(n);
    };
    let mut defs = defs.clone();
    defs.extend(more.iter().cloned());
    eval::atom(n, Data::Defs { kind: *kind, defs, await_: *await_ })
}

fn collect_vardef_refs(n: &N, table: &crate::syms::SymTable, out: &mut std::collections::HashMap<usize, usize>) {
    match &n.data {
        Data::Func { .. } | Data::Class { .. } => {}
        Data::VarDef { name, .. } => {
            if let Some(id) = table.lookup(&crate::syms::ptr(name)) {
                let d = &table.defs[id];
                out.insert(crate::syms::ptr(name), d.references.len().saturating_sub(d.replaced.get() as usize));
            }
        }
        _ => {
            ast::transform_children(n, &mut |c| collect_vardef_refs(c, table, out));
        }
    }
}
