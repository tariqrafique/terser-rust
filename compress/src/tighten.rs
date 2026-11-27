//! Port of terser `lib/compress/tighten-body.js`.
//!
//! `tighten_body` repeats its steps until the statement list stops changing.
//! `collapse` is the scan from the end of the list: an assignment or `var`
//! initializer is folded into a later read only when the scan reaches that
//! read before a stop (a loop, `try`, `switch`, or a conditional branch when
//! the value has side effects).

use ast::{Data, DefKind, N, Node, SymKind};
use std::rc::Rc;

/// terser `tighten-body.js` `tighten_body` — the `do { ... } while (CHANGED && max_iter-- > 0)` loop.
/// Sequence joining, `if_return`, and `join_vars` already run in `compress/src/lib.rs`.
/// This loop is `collapse` until stable, which is the step that was still a heuristic.
pub fn collapse(root: &N, unused: bool, toplevel_vars: bool) -> N {
    walk(root, unused, toplevel_vars)
}

fn walk(n: &N, unused: bool, toplevel_vars: bool) -> N {
    match &n.data {
        Data::Toplevel { body } => node(n, Data::Toplevel { body: tighten_list(body, unused, toplevel_vars, &[], false) }),
        Data::StaticBlock { body } => node(n, Data::StaticBlock { body: tighten_list(body, unused, toplevel_vars, &[], true) }),
        Data::Func { kind, name, args, body, async_, generator } => node(
            n,
            Data::Func {
                kind: *kind,
                name: name.clone(),
                args: args.clone(),
                body: tighten_list(body, unused, toplevel_vars, args, true),
                async_: *async_,
                generator: *generator,
            },
        ),
        // A plain block is not a scope. `collapse` stops at it; nested
        // functions inside it still get their own `tighten_body`.
        Data::Block { body } => node(n, Data::Block { body: body.iter().map(|s| walk(s, unused, toplevel_vars)).collect() }),
        other => map_walk(n, other, unused, toplevel_vars),
    }
}

fn tighten_list(stmts: &[N], unused: bool, toplevel_vars: bool, params: &[N], in_fn: bool) -> Vec<N> {
    let mut stmts: Vec<N> = stmts.iter().map(|s| walk(s, unused, toplevel_vars)).collect();
    let mut locals = std::collections::HashSet::new();
    for param in params {
        if let Some(name) = sym_name(param) {
            locals.insert(name.to_string());
        }
    }
    collect_locals(&stmts, &mut locals);
    // terser `tighten_body`: `do { collapse } while (CHANGED && max_iter-- > 0)`
    for _ in 0..10 {
        let (next, changed) = collapse_statements(stmts, unused, toplevel_vars, in_fn, &locals);
        stmts = next;
        if !changed {
            break;
        }
    }
    // A local nobody reads or writes, whose initializer cannot run code, is
    // the part of `drop-unused.js` that runs after the reads have been inlined.
    // One walk records every remaining use. Toplevel stays (`toplevel` is false).
    if unused && in_fn {
        stmts = drop_unmentioned(&stmts);
    }
    stmts
}

fn drop_unmentioned(stmts: &[N]) -> Vec<N> {
    let used = names_used(stmts);
    stmts.iter().filter_map(|stmt| match &stmt.data {
        Data::Defs { kind, defs, await_ } => {
            let defs: Vec<N> = defs.iter().filter(|d| match &d.data {
                Data::VarDef { name, value } => {
                    let Some(sym) = sym_name(name) else { return true };
                    used.contains(sym) || value.as_ref().is_some_and(has_side_effects)
                }
                _ => true,
            }).cloned().collect();
            if defs.is_empty() { None } else { Some(node(stmt, Data::Defs { kind: *kind, defs, await_: *await_ })) }
        }
        _ => Some(Rc::clone(stmt)),
    }).collect()
}

fn names_used(stmts: &[N]) -> std::collections::HashSet<String> {
    let mut used = std::collections::HashSet::new();
    fn rec(n: &N, used: &mut std::collections::HashSet<String>) {
        if let Some(name) = ref_name(n) {
            used.insert(name.to_string());
        }
        match &n.data {
            Data::Func { body, .. } | Data::Block { body } | Data::Switch { body, .. } | Data::Default { body } | Data::Case { body, .. } => {
                body.iter().for_each(|s| rec(s, used));
            }
            Data::Class { extends, props, .. } => {
                if let Some(extends) = extends { rec(extends, used); }
                props.iter().for_each(|p| rec(p, used));
            }
            Data::Assign { left, right, .. } | Data::Binary { left, right, .. } | Data::DefaultAssign { left, right } => {
                rec(left, used);
                rec(right, used);
            }
            Data::Call { expr, args, .. } => {
                rec(expr, used);
                args.iter().for_each(|a| rec(a, used));
            }
            Data::Unary { expr, .. } | Data::Return { value: Some(expr) } | Data::Simple { body: expr } | Data::Throw { value: expr } | Data::Dot { expr, .. } | Data::Await { expr } | Data::Spread { expr } | Data::Chain { expr } | Data::Yield { expr: Some(expr), .. } => rec(expr, used),
            Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().for_each(|e| rec(e, used)),
            Data::If { cond, body, alt } => {
                rec(cond, used);
                rec(body, used);
                if let Some(alt) = alt { rec(alt, used); }
            }
            Data::Cond { cond, cons, alt } => {
                rec(cond, used);
                rec(cons, used);
                rec(alt, used);
            }
            Data::For { init, cond, step, body } => {
                if let Some(init) = init { rec(init, used); }
                if let Some(cond) = cond { rec(cond, used); }
                if let Some(step) = step { rec(step, used); }
                rec(body, used);
            }
            Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
                rec(init, used);
                rec(object, used);
                rec(body, used);
            }
            Data::While { cond, body } | Data::Do { body, cond } => {
                rec(cond, used);
                rec(body, used);
            }
            Data::Try { body, catch, finally } => {
                rec(body, used);
                if let Some(catch) = catch { rec(catch, used); }
                if let Some(finally) = finally { rec(finally, used); }
            }
            Data::Catch { body, .. } | Data::Finally { body } | Data::Labeled { body, .. } | Data::With { body, .. } => rec(body, used),
            Data::Defs { defs, .. } => defs.iter().for_each(|d| rec(d, used)),
            Data::VarDef { value: Some(value), .. } => rec(value, used),
            Data::Destructuring { names, .. } => names.iter().for_each(|n| rec(n, used)),
            Data::Prop { key, value, .. } => {
                if let ast::Key::Computed(expr) = key { rec(expr, used); }
                rec(value, used);
            }
            Data::Sub { expr, prop, .. } => {
                rec(expr, used);
                rec(prop, used);
            }
            Data::Field { value: Some(value), .. } => rec(value, used),
            _ => {}
        }
    }
    for stmt in stmts {
        rec(stmt, &mut used);
    }
    used
}

/// terser `tighten-body.js` `collapse`.
fn collapse_statements(mut stmts: Vec<N>, unused: bool, toplevel_vars: bool, in_fn: bool, locals: &std::collections::HashSet<String>) -> (Vec<N>, bool) {
    let block_names = block_scoped_names(&stmts);
    let mut changed = false;
    let mut index = stmts.len();
    while index > 0 {
        index -= 1;
        // terser `extract_candidates`, then `candidates.pop()` so the last one runs first.
        let mut candidates = extract_candidates(&stmts[index]);
        while let Some(cand) = candidates.pop() {
            let cx = Collapse { unused, toplevel_vars, in_fn, locals, block_names: &block_names };
            if let Some(next) = apply_candidate(&stmts, index, &cand, &cx) {
                stmts = next;
                changed = true;
                // The list shrank. Scan again from the end.
                index = stmts.len();
                break;
            }
        }
    }
    (stmts, changed)
}

struct Cand {
    ptr: usize,
    name: String,
    value: N,
    vardef: bool,
}

/// terser `tighten-body.js` `extract_candidates`.
fn extract_candidates(n: &N) -> Vec<Cand> {
    let mut out = Vec::new();
    fn rec(n: &N, out: &mut Vec<Cand>) {
        match &n.data {
            Data::Assign { left, right, logical, op } => {
                if !*logical && op == "=" && !has_side_effects(left) && !matches!(right.data, Data::Chain { .. }) {
                    if let Some(name) = ref_name(left) {
                        out.push(Cand { ptr: ptr(n), name: name.to_string(), value: Rc::clone(right), vardef: false });
                    }
                }
                rec(right, out);
            }
            Data::VarDef { name, value: Some(value) } => {
                if !matches!(value.data, Data::Chain { .. }) {
                    if let Some(sym) = sym_name(name) {
                        out.push(Cand { ptr: ptr(n), name: sym.to_string(), value: Rc::clone(value), vardef: true });
                    }
                }
                rec(value, out);
            }
            Data::Binary { left, right, .. } => {
                rec(left, out);
                rec(right, out);
            }
            Data::Call { expr, args, .. } => {
                rec(expr, out);
                for a in args {
                    rec(a, out);
                }
            }
            Data::Cond { cond, cons, alt } => {
                rec(cond, out);
                rec(cons, out);
                rec(alt, out);
            }
            Data::Defs { defs, .. } => {
                let start = defs.len().saturating_sub(200);
                for d in &defs[start..] {
                    rec(d, out);
                }
            }
            Data::If { cond, body, alt } => {
                rec(cond, out);
                if !matches!(body.data, Data::Block { .. }) {
                    rec(body, out);
                }
                if let Some(alt) = alt {
                    if !matches!(alt.data, Data::Block { .. }) {
                        rec(alt, out);
                    }
                }
            }
            Data::Return { value: Some(v) } | Data::Throw { value: v } | Data::Simple { body: v } | Data::Unary { expr: v, .. } => rec(v, out),
            Data::Seq { exprs } => {
                for e in exprs {
                    rec(e, out);
                }
            }
            Data::For { init, cond, step, body } => {
                if let Some(init) = init {
                    rec(init, out);
                }
                if let Some(cond) = cond {
                    rec(cond, out);
                }
                if let Some(step) = step {
                    rec(step, out);
                }
                if !matches!(body.data, Data::Block { .. }) {
                    rec(body, out);
                }
            }
            _ => {}
        }
    }
    rec(n, &mut out);
    out
}

struct Collapse<'a> {
    unused: bool,
    toplevel_vars: bool,
    in_fn: bool,
    locals: &'a std::collections::HashSet<String>,
    block_names: &'a std::collections::HashSet<String>,
}

fn apply_candidate(stmts: &[N], index: usize, cand: &Cand, cx: &Collapse<'_>) -> Option<Vec<N>> {
    // terser `get_lhs` / `exposed`: a toplevel binding is not collapsed while
    // `toplevel` is false. The declaration's reads stay as names.
    if cand.vardef && !cx.in_fn && !cx.toplevel_vars {
        return None;
    }
    // terser `get_lhs`: assignments to `let` / `const` are not collapsed.
    // An undeclared or outer assignment target has side effects (`may_modify`).
    if !cand.vardef && (cx.block_names.contains(&cand.name) || !cx.locals.contains(&cand.name)) {
        return None;
    }
    if mentions(&cand.value, &cand.name) {
        return None;
    }
    // Lambda and class values have their own inlining rules (`noinline`, `this`).
    if matches!(cand.value.data, Data::Func { .. } | Data::Class { .. }) {
        return None;
    }
    let watched = watched_symbols(&cand.value);
    // terser `find_stop`: the candidate's value is already consumed (a
    // `return`, a call argument that is the tail, …) so it cannot move.
    let fence = match find_stop(&stmts[index], cand.ptr) {
        Stop::Candidate => return None,
        Stop::Ancestor(limit) => Some(limit),
        Stop::None => None,
    };
    let side_effects = has_side_effects(&cand.value);
    // terser `replace_all_symbols`: a side-effect-free value used once, or a value that is itself a symbol.
    let symbol_value = matches!(cand.value.data, Data::Symbol { kind: SymKind::Ref, .. });
    let reads = reads_after(stmts, index, cand, fence, side_effects, cx.locals, &watched);
    if reads.is_empty() {
        return None;
    }
    let replace_all = !side_effects && (symbol_value || reads.len() == 1);
    if side_effects && (reads.len() != 1 || reads.iter().any(|r| r.conditional || r.stopped)) {
        return None;
    }
    if !replace_all && reads.iter().any(|r| r.conditional || r.stopped) {
        return None;
    }
    if replace_all && reads.iter().any(|r| r.stopped) {
        return None;
    }
    // Whole-function reads must all be in the scan, otherwise a read before the
    // initializer or inside a nested function would be left behind.
    let total = count_reads(stmts, &cand.name);
    let in_scan = reads.len();
    // Every read has to sit in the scanned region, after the candidate.
    if total != in_scan {
        return None;
    }
    if !replace_all && in_scan != 1 {
        return None;
    }
    let replacement = if cand.vardef || in_scan == total {
        // VarDef with one remaining reference substitutes the value
        // (`tighten-body.js` `collapse`, the `AST_VarDef` arm).
        // An assignment whose name is otherwise unread substitutes the
        // right-hand side (`drop-unused.js` `assign_as_unused`).
        Rc::clone(&cand.value)
    } else {
        return None;
    };
    let mut next = rebuild_from(stmts, index, cand, &replacement);
    // A read we counted but did not rewrite must keep the candidate.
    if count_reads(&next, &cand.name) != 0 {
        return None;
    }
    // drop-unused.js: a `var` left with no initializer and no reads is dropped.
    if cx.unused && count_reads_deep(&next, &cand.name) == 0 {
        next = drop_unread_var(&next, &cand.name);
    }
    Some(next)
}

struct Read {
    conditional: bool,
    stopped: bool,
}

enum Stop {
    /// `find_stop` returned the candidate. Collapse aborts.
    Candidate,
    /// Scan may continue inside this ancestor, and not past it.
    Ancestor(usize),
    None,
}

/// terser `tighten-body.js` `find_stop`.
fn find_stop(stmt: &N, cand_ptr: usize) -> Stop {
    let Some(parents) = parent_chain(stmt, cand_ptr) else {
        return Stop::Candidate;
    };
    fn rec(parents: &[N], level: usize, write_only: bool, cand_ptr: usize) -> Stop {
        if level >= parents.len() {
            return Stop::None;
        }
        let here = |level: usize| {
            if level == 0 { Stop::Candidate } else { Stop::Ancestor(ptr(&parents[level - 1])) }
        };
        let node_ptr = if level == 0 { cand_ptr } else { ptr(&parents[level - 1]) };
        match &parents[level].data {
            Data::Assign { logical, left, .. } => {
                if write_only && !*logical && ref_name(left).is_some() {
                    rec(parents, level + 1, write_only, cand_ptr)
                } else {
                    here(level)
                }
            }
            Data::Return { .. } | Data::Throw { .. } => {
                if write_only { rec(parents, level + 1, write_only, cand_ptr) } else { here(level) }
            }
            Data::Simple { .. } => rec(parents, level + 1, true, cand_ptr),
            Data::Defs { .. } => rec(parents, level + 1, true, cand_ptr),
            Data::Seq { exprs } => {
                let tail = exprs.last().is_some_and(|e| ptr(e) == node_ptr);
                rec(parents, level + 1, !tail, cand_ptr)
            }
            Data::Call { .. } | Data::Switch { .. } | Data::For { .. } | Data::While { .. } | Data::Do { .. } | Data::ForIn { .. } | Data::ForOf { .. } | Data::VarDef { .. } => here(level),
            Data::Binary { op, left, .. } => {
                let lazy = matches!(op.as_str(), "&&" | "||" | "??");
                if write_only && (!lazy || ptr(left) == node_ptr) {
                    rec(parents, level + 1, write_only, cand_ptr)
                } else {
                    here(level)
                }
            }
            Data::Cond { cond, .. } | Data::If { cond, .. } => {
                if write_only && ptr(cond) == node_ptr {
                    rec(parents, level + 1, write_only, cand_ptr)
                } else {
                    here(level)
                }
            }
            _ => Stop::None,
        }
    }
    rec(&parents, 0, false, cand_ptr)
}

fn parent_chain(root: &N, cand_ptr: usize) -> Option<Vec<N>> {
    fn rec(n: &N, cand_ptr: usize, stack: &mut Vec<N>) -> bool {
        if ptr(n) == cand_ptr {
            return true;
        }
        let mark = stack.len();
        stack.push(Rc::clone(n));
        let hit = match &n.data {
            Data::Assign { left, right, .. } => rec(left, cand_ptr, stack) || rec(right, cand_ptr, stack),
            Data::Binary { left, right, .. } => rec(left, cand_ptr, stack) || rec(right, cand_ptr, stack),
            Data::Call { expr, args, .. } => rec(expr, cand_ptr, stack) || args.iter().any(|a| rec(a, cand_ptr, stack)),
            Data::Cond { cond, cons, alt } => rec(cond, cand_ptr, stack) || rec(cons, cand_ptr, stack) || rec(alt, cand_ptr, stack),
            Data::Defs { defs, .. } => defs.iter().any(|d| rec(d, cand_ptr, stack)),
            Data::VarDef { value, .. } => value.as_ref().is_some_and(|v| rec(v, cand_ptr, stack)),
            Data::If { cond, body, alt } => rec(cond, cand_ptr, stack) || rec(body, cand_ptr, stack) || alt.as_ref().is_some_and(|a| rec(a, cand_ptr, stack)),
            Data::Return { value } => value.as_ref().is_some_and(|v| rec(v, cand_ptr, stack)),
            Data::Throw { value } | Data::Simple { body: value } | Data::Unary { expr: value, .. } => rec(value, cand_ptr, stack),
            Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().any(|e| rec(e, cand_ptr, stack)),
            Data::For { init, cond, step, body } => {
                init.as_ref().is_some_and(|v| rec(v, cand_ptr, stack))
                    || cond.as_ref().is_some_and(|v| rec(v, cand_ptr, stack))
                    || step.as_ref().is_some_and(|v| rec(v, cand_ptr, stack))
                    || rec(body, cand_ptr, stack)
            }
            _ => false,
        };
        if !hit {
            stack.truncate(mark);
        }
        hit
    }
    let mut stack = Vec::new();
    if rec(root, cand_ptr, &mut stack) {
        stack.reverse();
        Some(stack)
    } else {
        None
    }
}

struct St<'a> {
    cand: &'a Cand,
    seen: bool,
    halt: bool,
    side_effects: bool,
    locals: &'a std::collections::HashSet<String>,
    watched: &'a std::collections::HashSet<String>,
    out: Vec<Read>,
}

fn reads_after(stmts: &[N], index: usize, cand: &Cand, fence: Option<usize>, side_effects: bool, locals: &std::collections::HashSet<String>, watched: &std::collections::HashSet<String>) -> Vec<Read> {
    let mut st = St { cand, seen: false, halt: false, side_effects, locals, watched, out: Vec::new() };
    if let Some(limit) = fence {
        if let Some(node) = find_node(&stmts[index], limit) {
            scan_stmt(node, &mut st, false, false);
        }
        return st.out;
    }
    scan_stmt(&stmts[index], &mut st, false, false);
    for stmt in &stmts[index + 1..] {
        if st.halt {
            break;
        }
        scan_stmt(stmt, &mut st, false, false);
    }
    st.out
}

fn find_node(n: &N, want: usize) -> Option<&N> {
    if ptr(n) == want {
        return Some(n);
    }
    match &n.data {
        Data::Assign { left, right, .. } => find_node(left, want).or_else(|| find_node(right, want)),
        Data::Binary { left, right, .. } => find_node(left, want).or_else(|| find_node(right, want)),
        Data::Call { expr, args, .. } => find_node(expr, want).or_else(|| args.iter().find_map(|a| find_node(a, want))),
        Data::Seq { exprs } => exprs.iter().find_map(|e| find_node(e, want)),
        Data::Simple { body } | Data::Return { value: Some(body) } | Data::Unary { expr: body, .. } | Data::Throw { value: body } => find_node(body, want),
        Data::Return { value: None } => None,
        Data::Defs { defs, .. } => defs.iter().find_map(|d| find_node(d, want)),
        Data::VarDef { value, .. } => value.as_ref().and_then(|v| find_node(v, want)),
        Data::If { cond, body, alt } => find_node(cond, want).or_else(|| find_node(body, want)).or_else(|| alt.as_ref().and_then(|a| find_node(a, want))),
        Data::Cond { cond, cons, alt } => find_node(cond, want).or_else(|| find_node(cons, want)).or_else(|| find_node(alt, want)),
        _ => None,
    }
}

fn scan_stmt(n: &N, st: &mut St<'_>, conditional: bool, stopped: bool) {
    if st.halt {
        return;
    }
    if ptr(n) == st.cand.ptr {
        st.seen = true;
        // Still walk the value; reads of other names don't matter. A read of
        // the lhs inside the value was rejected by `mentions`.
        if let Data::Assign { right, .. } = &n.data {
            scan_stmt(right, st, conditional, stopped);
        } else if let Data::VarDef { value: Some(v), .. } = &n.data {
            scan_stmt(v, st, conditional, stopped);
        }
        return;
    }
    if !st.seen {
        match &n.data {
            Data::Assign { right, .. } => scan_stmt(right, st, conditional, stopped),
            Data::VarDef { value: Some(v), .. } => scan_stmt(v, st, conditional, stopped),
            Data::Seq { exprs } | Data::Array { elements: exprs } => {
                for e in exprs {
                    scan_stmt(e, st, conditional, stopped);
                }
            }
            Data::Simple { body } | Data::Return { value: Some(body) } | Data::Unary { expr: body, .. } => {
                scan_stmt(body, st, conditional, stopped);
            }
            Data::Binary { left, right, .. } => {
                scan_stmt(left, st, conditional, stopped);
                scan_stmt(right, st, conditional, stopped);
            }
            Data::Call { expr, args, .. } => {
                scan_stmt(expr, st, conditional, stopped);
                for a in args {
                    scan_stmt(a, st, conditional, stopped);
                }
            }
            Data::Defs { defs, .. } => {
                for d in defs {
                    scan_stmt(d, st, conditional, stopped);
                }
            }
            _ => {}
        }
        return;
    }
    match &n.data {
        Data::Func { .. } | Data::Class { .. } => {}
        // `AST_Try` aborts the scan. The other nodes are not entered.
        // `AST_Yield` aborts: moving a `yield` past another changes order.
        Data::Yield { .. } | Data::Try { .. } | Data::With { .. } | Data::Switch { .. } => {
            st.halt = true;
            st.out.push(Read { conditional, stopped: true });
        }
        Data::ForIn { .. } | Data::ForOf { .. } | Data::Break { .. } | Data::Continue { .. } => {
            if count_reads_node(n, &st.cand.name) > 0 {
                st.out.push(Read { conditional, stopped: true });
            }
        }
        // A `while`/`for` that only reads the name can take a side-effect-free
        // value. A write of the name, or a value that runs code, stops the scan.
        Data::While { cond, body } => {
            if writes_name(n, &st.cand.name) || st.side_effects && count_reads_node(n, &st.cand.name) > 0 {
                st.out.push(Read { conditional, stopped: true });
            } else {
                scan_stmt(cond, st, conditional, stopped);
                scan_stmt(body, st, conditional, stopped);
            }
        }
        Data::Do { body, cond } => {
            if writes_name(n, &st.cand.name) || st.side_effects && count_reads_node(n, &st.cand.name) > 0 {
                st.out.push(Read { conditional, stopped: true });
            } else {
                scan_stmt(body, st, conditional, stopped);
                scan_stmt(cond, st, conditional, stopped);
            }
        }
        Data::For { init, cond, step, body } => {
            if writes_name(n, &st.cand.name) || st.side_effects && count_reads_node(n, &st.cand.name) > 0 {
                st.out.push(Read { conditional, stopped: true });
            } else {
                if let Some(init) = init { scan_stmt(init, st, conditional, stopped); }
                if let Some(cond) = cond { scan_stmt(cond, st, conditional, stopped); }
                if let Some(step) = step { scan_stmt(step, st, conditional, stopped); }
                scan_stmt(body, st, conditional, stopped);
            }
        }
        Data::Symbol { name, kind: SymKind::Ref, .. } => {
            // terser `may_modify`: a side-effecting value cannot move past a
            // symbol defined outside this function.
            if st.side_effects && !st.locals.contains(name) {
                st.halt = true;
                st.out.push(Read { conditional, stopped: true });
                return;
            }
            if name == &st.cand.name {
                st.out.push(Read { conditional, stopped });
            }
        }
        Data::If { cond, body, alt } => {
            scan_stmt(cond, st, conditional, stopped);
            scan_stmt(body, st, true, stopped);
            if let Some(alt) = alt {
                scan_stmt(alt, st, true, stopped);
            }
        }
        Data::Cond { cond, cons, alt } => {
            scan_stmt(cond, st, conditional, stopped);
            scan_stmt(cons, st, true, stopped);
            scan_stmt(alt, st, true, stopped);
        }
        Data::Binary { op, left, right } if matches!(op.as_str(), "&&" | "||" | "??") => {
            scan_stmt(left, st, conditional, stopped);
            scan_stmt(right, st, true, stopped);
        }
        Data::Assign { op, left, right, .. } => {
            // `+=`, a later write of the candidate, or a write of a symbol
            // that the value reads (`lvalues`) aborts the scan.
            let left_name = ref_name(left);
            if left_name == Some(st.cand.name.as_str()) && (op != "=" || ptr(n) != st.cand.ptr)
                || left_name.is_some_and(|name| st.watched.contains(name))
            {
                st.halt = true;
                st.out.push(Read { conditional, stopped: true });
                return;
            }
            if ref_name(left) != Some(st.cand.name.as_str()) {
                scan_stmt(left, st, conditional, stopped);
            }
            scan_stmt(right, st, conditional, stopped);
        }
        // `inference.js` `may_throw_on_access`: a property read on an unsafe
        // receiver stops the scan after the read, so `console.log(c)` does not
        // see `c`. The object's own reads are still visited.
        Data::Dot { expr, .. } => {
            scan_stmt(expr, st, conditional, stopped);
            if !safe_receiver(expr) {
                st.halt = true;
            }
        }
        Data::Sub { expr, prop, .. } => {
            scan_stmt(expr, st, conditional, stopped);
            if !st.halt {
                scan_stmt(prop, st, conditional, stopped);
            }
            if !safe_receiver(expr) {
                st.halt = true;
            }
        }
        Data::Unary { op, expr, .. } if op == "delete" && ref_name(expr) == Some(st.cand.name.as_str())
            || matches!(op.as_str(), "++" | "--") && ref_name(expr).is_some_and(|name| name == st.cand.name || st.watched.contains(name)) =>
        {
            st.halt = true;
            st.out.push(Read { conditional, stopped: true });
        }
        Data::Return { .. } | Data::Throw { .. } => {
            scan_children(&n.data, st, conditional, stopped);
            if st.side_effects {
                st.halt = true;
            }
        }
        other => scan_children(other, st, conditional, stopped),
    }
}

fn scan_children(data: &Data, st: &mut St<'_>, conditional: bool, stopped: bool) {
    if st.halt {
        return;
    }
    match data {
        Data::Simple { body } | Data::Return { value: Some(body) } | Data::Throw { value: body } | Data::Unary { expr: body, .. } | Data::Dot { expr: body, .. } | Data::Await { expr: body } | Data::Spread { expr: body } | Data::Chain { expr: body } => {
            scan_stmt(body, st, conditional, stopped);
        }
        Data::Binary { left, right, .. } => {
            scan_stmt(left, st, conditional, stopped);
            scan_stmt(right, st, conditional, stopped);
        }
        Data::Call { expr, args, .. } => {
            scan_stmt(expr, st, conditional, stopped);
            if !st.halt {
                for a in args {
                    if st.halt {
                        break;
                    }
                    scan_stmt(a, st, conditional, stopped);
                }
            }
            // A call is `stop_after`: reads inside it count, reads after it do not.
            st.halt = true;
        }
        Data::Seq { exprs } | Data::Array { elements: exprs } => {
            for e in exprs {
                scan_stmt(e, st, conditional, stopped);
            }
        }
        Data::Block { body } | Data::Default { body } => {
            for s in body {
                scan_stmt(s, st, conditional, stopped);
            }
        }
        Data::Defs { defs, .. } => {
            for d in defs {
                scan_stmt(d, st, conditional, stopped);
            }
        }
        Data::VarDef { value: Some(value), .. } => scan_stmt(value, st, conditional, stopped),
        _ => {}
    }
}

fn collect_locals(stmts: &[N], names: &mut std::collections::HashSet<String>) {
    fn rec(n: &N, names: &mut std::collections::HashSet<String>) {
        match &n.data {
            Data::Func { name, .. } => {
                if let Some(name) = name {
                    if let Some(sym) = sym_name(name) {
                        names.insert(sym.to_string());
                    }
                }
            }
            Data::Class { name, .. } => {
                if let Some(name) = name {
                    if let Some(sym) = sym_name(name) {
                        names.insert(sym.to_string());
                    }
                }
            }
            Data::Defs { defs, .. } => {
                for d in defs {
                    if let Data::VarDef { name, .. } = &d.data {
                        if let Some(sym) = sym_name(name) {
                            names.insert(sym.to_string());
                        }
                    }
                }
            }
            Data::Symbol { name, kind, .. } if !matches!(kind, SymKind::Ref | SymKind::Label | SymKind::LabelRef) => {
                names.insert(name.clone());
            }
            other => {
                let walk = |c: &N, names: &mut std::collections::HashSet<String>| rec(c, names);
                match other {
                    Data::Block { body } | Data::Default { body } => body.iter().for_each(|s| walk(s, names)),
                    Data::If { body, alt, .. } => {
                        walk(body, names);
                        if let Some(alt) = alt { walk(alt, names); }
                    }
                    Data::For { init, body, .. } => {
                        if let Some(init) = init { walk(init, names); }
                        walk(body, names);
                    }
                    Data::While { body, .. } | Data::Do { body, .. } | Data::Labeled { body, .. } | Data::With { body, .. } | Data::Finally { body } => walk(body, names),
                    Data::ForIn { init, body, .. } | Data::ForOf { init, body, .. } => {
                        walk(init, names);
                        walk(body, names);
                    }
                    Data::Switch { body, .. } => body.iter().for_each(|s| walk(s, names)),
                    Data::Case { body, .. } => body.iter().for_each(|s| walk(s, names)),
                    Data::Try { body, catch, finally } => {
                        walk(body, names);
                        if let Some(c) = catch { walk(c, names); }
                        if let Some(f) = finally { walk(f, names); }
                    }
                    Data::Catch { arg, body } => {
                        if let Some(arg) = arg { walk(arg, names); }
                        walk(body, names);
                    }
                    Data::Simple { body } | Data::Return { value: Some(body) } | Data::Throw { value: body } => walk(body, names),
                    _ => {}
                }
            }
        }
    }
    for s in stmts {
        rec(s, names);
    }
}

fn rebuild_from(stmts: &[N], index: usize, cand: &Cand, replacement: &N) -> Vec<N> {
    let mut out = Vec::new();
    for (i, stmt) in stmts.iter().enumerate() {
        if i < index {
            out.push(Rc::clone(stmt));
            continue;
        }
        if let Some(stmt) = rewrite_stmt(stmt, cand, replacement) {
            out.push(stmt);
        }
    }
    out
}

fn rewrite_stmt(n: &N, cand: &Cand, replacement: &N) -> Option<N> {
    if ptr(n) == cand.ptr {
        return None;
    }
    match &n.data {
        Data::Defs { kind, defs, await_ } => {
            let defs: Vec<N> = defs.iter().filter_map(|d| rewrite_stmt(d, cand, replacement)).collect();
            if defs.is_empty() {
                return None;
            }
            return Some(node(n, Data::Defs { kind: *kind, defs, await_: *await_ }));
        }
        Data::VarDef { name, value } => {
            if ptr(n) == cand.ptr {
                return None;
            }
            let value = value.as_ref().map(|v| rewrite_expr(v, cand, replacement));
            return Some(node(n, Data::VarDef { name: Rc::clone(name), value }));
        }
        Data::Simple { body } => {
            if ptr(body) == cand.ptr {
                return None;
            }
            let body = rewrite_expr(body, cand, replacement);
            if matches!(body.data, Data::Seq { .. }) {
                if let Data::Seq { exprs } = &body.data {
                    if exprs.is_empty() {
                        return None;
                    }
                }
            }
            return Some(node(n, Data::Simple { body }));
        }
        _ => {}
    }
    Some(rewrite_expr(n, cand, replacement))
}

fn rewrite_expr(n: &N, cand: &Cand, replacement: &N) -> N {
    if ptr(n) == cand.ptr {
        // Dropped assignment inside a sequence.
        return node(n, Data::Seq { exprs: vec![] });
    }
    if ref_name(n) == Some(cand.name.as_str()) {
        // Don't replace a write.
        return Rc::clone(replacement);
    }
    let go = |c: &N| rewrite_expr(c, cand, replacement);
    let data = match &n.data {
        Data::Assign { op, left, right, logical } => {
            let left = if ref_name(left) == Some(cand.name.as_str()) { Rc::clone(left) } else { go(left) };
            Data::Assign { op: op.clone(), left, right: go(right), logical: *logical }
        }
        Data::Seq { exprs } => {
            let exprs: Vec<N> = exprs
                .iter()
                .filter(|e| ptr(e) != cand.ptr)
                .map(go)
                .filter(|e| !matches!(&e.data, Data::Seq { exprs } if exprs.is_empty()))
                .collect();
            if exprs.len() == 1 {
                return Rc::clone(&exprs[0]);
            }
            Data::Seq { exprs }
        }
        Data::Call { expr, args, optional, is_new } => Data::Call {
            expr: go(expr),
            args: args.iter().map(go).collect(),
            optional: *optional,
            is_new: *is_new,
        },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left), right: go(right) },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr), prefix: *prefix },
        Data::Return { value } => Data::Return { value: value.as_ref().map(go) },
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::If { cond, body, alt } => Data::If { cond: go(cond), body: go(body), alt: alt.as_ref().map(go) },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond), cons: go(cons), alt: go(alt) },
        Data::Sub { expr, prop, optional } => Data::Sub { expr: go(expr), prop: go(prop), optional: *optional },
        Data::Dot { expr, prop, optional, quote, private } => Data::Dot {
            expr: go(expr),
            prop: prop.clone(),
            optional: *optional,
            quote: *quote,
            private: *private,
        },
        Data::Array { elements } => Data::Array { elements: elements.iter().map(go).collect() },
        Data::Block { body } => Data::Block { body: body.iter().filter_map(|s| rewrite_stmt(s, cand, replacement)).collect() },
        _ => return Rc::clone(n),
    };
    node(n, data)
}

fn block_scoped_names(stmts: &[N]) -> std::collections::HashSet<String> {
    let mut names = std::collections::HashSet::new();
    fn rec(n: &N, names: &mut std::collections::HashSet<String>) {
        match &n.data {
            Data::Defs { kind: DefKind::Let | DefKind::Const, defs, .. } => {
                for d in defs {
                    if let Data::VarDef { name, .. } = &d.data {
                        if let Some(sym) = sym_name(name) {
                            names.insert(sym.to_string());
                        }
                    }
                }
            }
            Data::Block { body } | Data::Func { body, .. } => {
                for s in body {
                    rec(s, names);
                }
            }
            Data::If { body, alt, .. } => {
                rec(body, names);
                if let Some(alt) = alt {
                    rec(alt, names);
                }
            }
            _ => {}
        }
    }
    for s in stmts {
        rec(s, &mut names);
    }
    names
}

fn writes_name(n: &N, name: &str) -> bool {
    fn rec(n: &N, name: &str) -> bool {
        match &n.data {
            Data::Func { .. } | Data::Class { .. } => false,
            Data::Assign { left, right, .. } => ref_name(left) == Some(name) || rec(left, name) || rec(right, name),
            Data::Unary { op, expr, .. } if matches!(op.as_str(), "++" | "--") => ref_name(expr) == Some(name) || rec(expr, name),
            Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => rec(init, name) || rec(object, name) || rec(body, name),
            Data::VarDef { name: bound, value } => sym_name(bound) == Some(name) || value.as_ref().is_some_and(|v| rec(v, name)),
            other => count_child_writes(other, name, rec),
        }
    }
    fn count_child_writes(data: &Data, name: &str, rec: fn(&N, &str) -> bool) -> bool {
        match data {
            Data::Block { body } | Data::Defs { defs: body, .. } => body.iter().any(|s| rec(s, name)),
            Data::If { cond, body, alt } => rec(cond, name) || rec(body, name) || alt.as_ref().is_some_and(|a| rec(a, name)),
            Data::While { cond, body } | Data::Do { body, cond } => rec(cond, name) || rec(body, name),
            Data::For { init, cond, step, body } => {
                init.as_ref().is_some_and(|v| rec(v, name)) || cond.as_ref().is_some_and(|v| rec(v, name)) || step.as_ref().is_some_and(|v| rec(v, name)) || rec(body, name)
            }
            Data::Binary { left, right, .. } | Data::Assign { left, right, .. } => rec(left, name) || rec(right, name),
            Data::Call { expr, args, .. } => rec(expr, name) || args.iter().any(|a| rec(a, name)),
            Data::Seq { exprs } => exprs.iter().any(|e| rec(e, name)),
            Data::Unary { expr, .. } | Data::Return { value: Some(expr) } | Data::Simple { body: expr } | Data::Dot { expr, .. } => rec(expr, name),
            Data::Cond { cond, cons, alt } => rec(cond, name) || rec(cons, name) || rec(alt, name),
            _ => false,
        }
    }
    rec(n, name)
}

fn count_reads(stmts: &[N], name: &str) -> usize {
    stmts.iter().map(|s| count_reads_node(s, name)).sum()
}

fn count_reads_node(n: &N, name: &str) -> usize {
    if ref_name(n) == Some(name) {
        return 1;
    }
    match &n.data {
        // Reads inside a nested function count, so a straight-line scan
        // that cannot see them refuses the collapse.
        Data::Func { body, .. } => body.iter().map(|s| count_reads_node(s, name)).sum(),
        Data::Class { .. } => 0,
        Data::Assign { left, right, .. } => {
            let left_n = if ref_name(left) == Some(name) { 0 } else { count_reads_node(left, name) };
            left_n + count_reads_node(right, name)
        }
        Data::Call { expr, args, .. } => count_reads_node(expr, name) + args.iter().map(|a| count_reads_node(a, name)).sum::<usize>(),
        Data::Binary { left, right, .. } => count_reads_node(left, name) + count_reads_node(right, name),
        Data::Unary { expr, .. } | Data::Return { value: Some(expr) } | Data::Simple { body: expr } | Data::Dot { expr, .. } | Data::Await { expr } | Data::Spread { expr } => count_reads_node(expr, name),
        Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().map(|e| count_reads_node(e, name)).sum(),
        Data::If { cond, body, alt } => {
            count_reads_node(cond, name) + count_reads_node(body, name) + alt.as_ref().map(|a| count_reads_node(a, name)).unwrap_or(0)
        }
        Data::Cond { cond, cons, alt } => count_reads_node(cond, name) + count_reads_node(cons, name) + count_reads_node(alt, name),
        Data::Block { body } => body.iter().map(|s| count_reads_node(s, name)).sum(),
        Data::VarDef { value, .. } => value.as_ref().map(|v| count_reads_node(v, name)).unwrap_or(0),
        Data::Defs { defs, .. } => defs.iter().map(|d| count_reads_node(d, name)).sum(),
        Data::For { init, cond, step, body } => {
            init.as_ref().map(|v| count_reads_node(v, name)).unwrap_or(0)
                + cond.as_ref().map(|v| count_reads_node(v, name)).unwrap_or(0)
                + step.as_ref().map(|v| count_reads_node(v, name)).unwrap_or(0)
                + count_reads_node(body, name)
        }
        Data::ForIn { init, object, body } => count_reads_node(init, name) + count_reads_node(object, name) + count_reads_node(body, name),
        Data::ForOf { init, object, body, .. } => count_reads_node(init, name) + count_reads_node(object, name) + count_reads_node(body, name),
        Data::While { cond, body } | Data::Do { body, cond } => count_reads_node(cond, name) + count_reads_node(body, name),
        Data::Switch { expr, body } => count_reads_node(expr, name) + body.iter().map(|s| count_reads_node(s, name)).sum::<usize>(),
        Data::Try { body, catch, finally } => {
            count_reads_node(body, name)
                + catch.as_ref().map(|v| count_reads_node(v, name)).unwrap_or(0)
                + finally.as_ref().map(|v| count_reads_node(v, name)).unwrap_or(0)
        }
        Data::Catch { body, .. } | Data::Finally { body } | Data::Labeled { body, .. } => count_reads_node(body, name),
        Data::Yield { expr, .. } => expr.as_ref().map(|v| count_reads_node(v, name)).unwrap_or(0),
        _ => 0,
    }
}

/// Receiver whose property read cannot throw under `pure_getters: "strict"`.
fn safe_receiver(n: &N) -> bool {
    matches!(
        n.data,
        Data::Number { .. }
            | Data::String { .. }
            | Data::True
            | Data::False
            | Data::Null
            | Data::Array { .. }
            | Data::Object { .. }
            | Data::Func { .. }
            | Data::Class { .. }
    )
}

fn mentions(n: &N, name: &str) -> bool {
    count_reads_node(n, name) > 0
}

/// Symbols the candidate value reads. A later write of one of them changes
/// the value, so the scan stops (`lvalues` in `tighten-body.js`).
fn watched_symbols(n: &N) -> std::collections::HashSet<String> {
    let mut out = std::collections::HashSet::new();
    fn rec(n: &N, out: &mut std::collections::HashSet<String>) {
        if let Some(name) = ref_name(n) {
            out.insert(name.to_string());
        }
        match &n.data {
            Data::Func { .. } | Data::Class { .. } => {}
            Data::Assign { left, right, .. } => {
                rec(left, out);
                rec(right, out);
            }
            Data::Binary { left, right, .. } => {
                rec(left, out);
                rec(right, out);
            }
            Data::Call { expr, args, .. } => {
                rec(expr, out);
                args.iter().for_each(|a| rec(a, out));
            }
            Data::Unary { expr, .. } | Data::Dot { expr, .. } | Data::Return { value: Some(expr) } => rec(expr, out),
            Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().for_each(|e| rec(e, out)),
            Data::Cond { cond, cons, alt } => {
                rec(cond, out);
                rec(cons, out);
                rec(alt, out);
            }
            _ => {}
        }
    }
    rec(n, &mut out);
    out
}

fn has_side_effects(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null | Data::This => false,
        Data::Symbol { kind: SymKind::Ref, .. } => false,
        Data::Unary { op, expr, prefix: true } if matches!(op.as_str(), "void" | "!" | "~" | "-" | "+") => has_side_effects(expr),
        Data::Binary { op, left, right } if !matches!(op.as_str(), "=" | "+=" | "-=") => has_side_effects(left) || has_side_effects(right),
        _ => true,
    }
}

fn ref_name(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, kind: SymKind::Ref, .. } => Some(name),
        _ => None,
    }
}

fn sym_name(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name),
        _ => None,
    }
}

fn ptr(n: &N) -> usize {
    Rc::as_ptr(n) as usize
}

fn node(orig: &N, data: Data) -> N {
    Rc::new(Node { start: orig.start.clone(), end: orig.end.clone(), data })
}

fn drop_unread_var(stmts: &[N], name: &str) -> Vec<N> {
    stmts.iter().filter_map(|stmt| match &stmt.data {
        Data::Defs { kind, defs, await_ } => {
            let defs: Vec<N> = defs.iter().filter(|d| match &d.data {
                Data::VarDef { name: sym, value: None } => sym_name(sym) != Some(name),
                _ => true,
            }).cloned().collect();
            if defs.is_empty() {
                None
            } else {
                Some(node(stmt, Data::Defs { kind: *kind, defs, await_: *await_ }))
            }
        }
        _ => Some(Rc::clone(stmt)),
    }).collect()
}

fn count_reads_deep(stmts: &[N], name: &str) -> usize {
    fn rec(n: &N, name: &str) -> usize {
        let here = if ref_name(n) == Some(name) { 1 } else { 0 };
        let nested = match &n.data {
            Data::Assign { left, right, .. } => {
                let left_n = if ref_name(left) == Some(name) { 0 } else { rec(left, name) };
                left_n + rec(right, name)
            }
            Data::Func { body, .. } | Data::Block { body } => body.iter().map(|s| rec(s, name)).sum(),
            Data::Call { expr, args, .. } => rec(expr, name) + args.iter().map(|a| rec(a, name)).sum::<usize>(),
            Data::Binary { left, right, .. } => rec(left, name) + rec(right, name),
            Data::Seq { exprs } => exprs.iter().map(|e| rec(e, name)).sum(),
            Data::If { cond, body, alt } => rec(cond, name) + rec(body, name) + alt.as_ref().map(|a| rec(a, name)).unwrap_or(0),
            Data::VarDef { value, .. } => value.as_ref().map(|v| rec(v, name)).unwrap_or(0),
            Data::Defs { defs, .. } => defs.iter().map(|d| rec(d, name)).sum(),
            Data::Return { value } => value.as_ref().map(|v| rec(v, name)).unwrap_or(0),
            Data::Simple { body } | Data::Unary { expr: body, .. } => rec(body, name),
            _ => 0,
        };
        here + nested
    }
    stmts.iter().map(|s| rec(s, name)).sum()
}

fn map_walk(n: &N, data: &Data, unused: bool, toplevel_vars: bool) -> N {
    let go = |c: &N| walk(c, unused, toplevel_vars);
    let rebuilt = match data {
        Data::If { cond, body, alt } => Data::If { cond: go(cond), body: go(body), alt: alt.as_ref().map(go) },
        Data::For { init, cond, step, body } => Data::For {
            init: init.as_ref().map(go),
            cond: cond.as_ref().map(go),
            step: step.as_ref().map(go),
            body: go(body),
        },
        Data::While { cond, body } => Data::While { cond: go(cond), body: go(body) },
        Data::Do { body, cond } => Data::Do { body: go(body), cond: go(cond) },
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::Return { value } => Data::Return { value: value.as_ref().map(go) },
        Data::Throw { value } => Data::Throw { value: go(value) },
        Data::Switch { expr, body } => Data::Switch { expr: go(expr), body: body.iter().map(go).collect() },
        Data::Case { expr, body } => Data::Case { expr: go(expr), body: body.iter().map(go).collect() },
        Data::Default { body } => Data::Default { body: body.iter().map(go).collect() },
        Data::Try { body, catch, finally } => Data::Try {
            body: go(body),
            catch: catch.as_ref().map(go),
            finally: finally.as_ref().map(go),
        },
        Data::Catch { arg, body } => Data::Catch { arg: arg.clone(), body: go(body) },
        Data::Finally { body } => Data::Finally { body: go(body) },
        Data::Labeled { label, body } => Data::Labeled { label: Rc::clone(label), body: go(body) },
        Data::ForIn { init, object, body } => Data::ForIn { init: go(init), object: go(object), body: go(body) },
        Data::ForOf { init, object, body, await_ } => Data::ForOf { init: go(init), object: go(object), body: go(body), await_: *await_ },
        Data::With { expr, body } => Data::With { expr: go(expr), body: go(body) },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr), prefix: *prefix },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left), right: go(right) },
        Data::Assign { op, left, right, logical } => Data::Assign { op: op.clone(), left: go(left), right: go(right), logical: *logical },
        Data::Seq { exprs } => Data::Seq { exprs: exprs.iter().map(go).collect() },
        Data::Call { expr, args, optional, is_new } => Data::Call { expr: go(expr), args: args.iter().map(go).collect(), optional: *optional, is_new: *is_new },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond), cons: go(cons), alt: go(alt) },
        Data::Array { elements } => Data::Array { elements: elements.iter().map(go).collect() },
        Data::Object { props } => Data::Object { props: props.iter().map(go).collect() },
        Data::Defs { kind, defs, await_ } => Data::Defs { kind: *kind, defs: defs.iter().map(go).collect(), await_: *await_ },
        Data::VarDef { name, value } => Data::VarDef { name: Rc::clone(name), value: value.as_ref().map(go) },
        Data::Class { stmt, name, extends, props } => Data::Class { stmt: *stmt, name: name.clone(), extends: extends.as_ref().map(go), props: props.iter().map(go).collect() },
        Data::Prop { method, key, value, static_, private, generator, async_ } => Data::Prop {
            method: *method,
            key: match key {
                ast::Key::Computed(expr) => ast::Key::Computed(go(expr)),
                other => other.clone(),
            },
            value: go(value),
            static_: *static_,
            private: *private,
            generator: *generator,
            async_: *async_,
        },
        Data::Field { key, value, static_, private } => Data::Field {
            key: match key {
                ast::Key::Computed(expr) => ast::Key::Computed(go(expr)),
                other => other.clone(),
            },
            value: value.as_ref().map(go),
            static_: *static_,
            private: *private,
        },
        _ => return Rc::clone(n),
    };
    node(n, rebuilt)
}
