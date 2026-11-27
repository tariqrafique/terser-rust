//! Port of terser `lib/compress/reduce-vars.js`.
//!
//! `analyze` is `AST_Toplevel.reset_opt_flags`: it walks in execution order
//! and fills each `SymbolDef`'s `fixed`, `references`, `assignments`,
//! `single_use`, and `escaped`. `inline_ref` is `inline_into_symbolref` in
//! `lib/compress/inline.js` for values that are constant expressions.

use ast::{Data, N, Node, SymKind};
use std::collections::HashMap;
use std::rc::Rc;

use crate::syms::{self, SingleUse, SymbolDef, SymTable};

pub struct Env {
    pub unused: bool,
    pub evaluate: bool,
    pub toplevel_vars: bool,
    pub toplevel_funcs: bool,
}

struct Tw<'a> {
    table: &'a mut SymTable,
    env: &'a Env,
    /// Prototype chain of `tw.safe_ids`.
    safe: Vec<HashMap<usize, bool>>,
    in_loop: u32,
    in_try: u32,
    /// `var` initialized here does not dominate later reads.
    conditional_var: u32,
    loop_ids: HashMap<usize, u32>,
    parents: Vec<usize>,
}

/// terser `lib/compress/index.js` `AST_Toplevel.reset_opt_flags`.
pub fn analyze(table: &mut SymTable, root: &N, env: &Env) {
    let mut tw = Tw {
        table,
        env,
        safe: vec![HashMap::new()],
        in_loop: 0,
        in_try: 0,
        conditional_var: 0,
        loop_ids: HashMap::new(),
        parents: Vec::new(),
    };
    walk(root, &mut tw);
}

/// terser `lib/compress/inline.js` `inline_into_symbolref`.
/// Constant fixed values only; lambda and class inlining is the rest of that function.
pub fn inline_ref(n: &N, table: &SymTable, env: &Env) -> Option<N> {
    let Data::Symbol { kind: SymKind::Ref, .. } = &n.data else { return None };
    let id = *table.node_def.get(&syms::ptr(n))?;
    let def = &table.defs[id];
    if def.fixed.is_none() {
        return None;
    }
    let fixed = def.fixed.clone()?;
    if !is_constant_expr(&fixed) {
        return None;
    }
    // single_use path: one read, `unused` on, value has no side effects.
    if matches!(def.single_use, SingleUse::Yes) && !has_side_effects(&fixed) && !may_throw(&fixed) {
        def.replaced.set(def.replaced.get().saturating_add(1));
        return Some(Rc::clone(&fixed));
    }
    // Multiple reads of an evaluable constant, kept when it is not longer
    // than the name plus the declaration overhead `unused` can remove.
    if !env.evaluate || !is_literal(&fixed) {
        return None;
    }
    let reads = def.references.len() as u32;
    let reads = reads.saturating_sub(def.assignments);
    if reads == 0 {
        return None;
    }
    let name_len = def.name.len();
    let value_len = codegen::print(&fixed).len();
    let overhead = if env.unused && !exposed(def, env) {
        (name_len + 2 + value_len) / reads as usize
    } else {
        0
    };
    if value_len <= name_len + overhead {
        def.replaced.set(def.replaced.get().saturating_add(1));
        return Some(Rc::clone(&fixed));
    }
    None
}

fn walk(n: &N, tw: &mut Tw) {
    tw.parents.push(syms::ptr(n));
    match &n.data {
        Data::Toplevel { body } => {
            // terser `reduce-vars.js` `AST_Toplevel`: reset variables on the root frame.
            if let Some(&scope) = tw.table.node_scope.get(&syms::ptr(n)) {
                reset_variables(tw, scope);
            }
            for stmt in body {
                walk(stmt, tw);
            }
        }
        Data::Func { body, .. } => {
            // terser `reduce-vars.js` `mark_lambda`: push a safe_ids frame, reset this function's variables, descend, pop.
            // The function body is a block in terser (`AST_Block.reduce_vars` calls
            // `reset_block_variables`). Our body is the statement list on the function,
            // so the body's `let`/`const` live on this scope and are reset here.
            push(tw);
            if let Some(&scope) = tw.table.node_scope.get(&syms::ptr(n)) {
                reset_variables(tw, scope);
                reset_block_variables(tw, scope);
            }
            for stmt in body {
                walk(stmt, tw);
            }
            // terser `reduce-vars.js` `handle_defined_after_hoist`: a hoisted
            // function can run before a `var` initializer it reads.
            clear_use_before_init(body, tw);
            pop(tw);
        }
        Data::Block { body } | Data::StaticBlock { body } => {
            if let Some(&scope) = tw.table.node_scope.get(&syms::ptr(n)) {
                reset_block_variables(tw, scope);
            }
            for stmt in body {
                walk(stmt, tw);
            }
        }
        Data::If { cond, body, alt } => {
            walk(cond, tw);
            push(tw);
            tw.conditional_var += 1;
            walk(body, tw);
            tw.conditional_var -= 1;
            pop(tw);
            if let Some(alt) = alt {
                push(tw);
                tw.conditional_var += 1;
                walk(alt, tw);
                tw.conditional_var -= 1;
                pop(tw);
            }
        }
        Data::Cond { cond, cons, alt } => {
            walk(cond, tw);
            push(tw);
            walk(cons, tw);
            pop(tw);
            push(tw);
            walk(alt, tw);
            pop(tw);
        }
        Data::Binary { op, left, right } if matches!(op.as_str(), "&&" | "||" | "??") => {
            // terser `reduce-vars.js` `AST_Binary` for lazy operators.
            walk(left, tw);
            push(tw);
            walk(right, tw);
            pop(tw);
        }
        Data::While { cond, body } | Data::Do { body, cond } => {
            let saved = tw.in_loop;
            tw.in_loop = tw.in_loop.saturating_add(1);
            push(tw);
            walk(cond, tw);
            walk(body, tw);
            pop(tw);
            tw.in_loop = saved;
        }
        Data::For { init, cond, step, body } => {
            if let Some(init) = init {
                walk(init, tw);
            }
            let saved = tw.in_loop;
            tw.in_loop = tw.in_loop.saturating_add(1);
            push(tw);
            if let Some(cond) = cond {
                walk(cond, tw);
            }
            if let Some(step) = step {
                walk(step, tw);
            }
            walk(body, tw);
            pop(tw);
            tw.in_loop = saved;
        }
        Data::Try { body, catch, finally } => {
            push(tw);
            tw.in_try += 1;
            walk(body, tw);
            tw.in_try -= 1;
            pop(tw);
            if let Some(catch) = catch {
                push(tw);
                walk(catch, tw);
                pop(tw);
            }
            if let Some(finally) = finally {
                walk(finally, tw);
            }
        }
        Data::VarDef { name, value } => {
            // terser `reduce-vars.js` `AST_VarDef`.
            if let Some(value) = value {
                if let Some(id) = def_of(tw, name) {
                    // A `let`/`const` inside a loop is a fresh binding each iteration.
            // terser keeps it (reduce_vars does not inline it); `var` is hoisted once and can be.
            // `arguments` is the arguments object, not an ordinary binding.
            // A block binding inside a loop or `try`, or a `var` that might not run, is not fixed.
            let block = tw.table.defs[id].block_scoped;
            let special = tw.table.defs[id].name == "arguments"
                || (block && (tw.in_loop != 0 || tw.in_try != 0))
                || (!block && tw.conditional_var != 0);
            if special {
                        tw.table.defs[id].fixed = None;
                        walk(value, tw);
                        tw.parents.pop();
                        return;
                    }
                    if safe_to_assign(tw, id) {
                        tw.table.defs[id].fixed = Some(Rc::clone(value));
                        tw.loop_ids.insert(id, tw.in_loop);
                        mark(tw, id, false);
                        walk(value, tw);
                        mark(tw, id, true);
                        tw.parents.pop();
                        return;
                    } else {
                        tw.table.defs[id].fixed = None;
                    }
                }
                walk(value, tw);
            }
        }
        Data::Assign { op, left, right, logical } => {
            // terser `reduce-vars.js` `AST_Assign`.
            // The right-hand side of `&&=` / `||=` / `??=` runs only sometimes.
            if *logical {
                tw.conditional_var += 1;
            }
            let mut done = false;
            if let Some(id) = sym_ref(left).and_then(|()| def_of(tw, left)) {
                // An assignment inside `&&` / `if` / a label that can break may not run,
                // so it must not become the value later reads inline.
                // `safe_to_assign` rejects `const` (its `orig` is `AST_SymbolConst`):
                // `const n=1; return n=2, n` keeps the read as `n`.
                let safe = !*logical
                    && op == "="
                    && tw.conditional_var == 0
                    && !tw.table.defs[id].is_const
                    && safe_to_assign(tw, id);
                tw.table.defs[id].assignments = tw.table.defs[id].assignments.saturating_add(1);
                if safe {
                    tw.table.defs[id].fixed = Some(Rc::clone(right));
                    tw.table.defs[id].references.push(syms::ptr(left));
                    mark(tw, id, false);
                    walk(right, tw);
                    mark(tw, id, true);
                    done = true;
                } else {
                    // The left-hand reference is modified, which clears `fixed`.
                    tw.table.defs[id].fixed = None;
                }
            }
            if !done {
                walk(left, tw);
                walk(right, tw);
            }
            if *logical {
                tw.conditional_var -= 1;
            }
        }
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "++" | "--") => {
            // terser `reduce-vars.js` `AST_Unary` for `++` / `--`.
            if let Some(id) = def_of(tw, expr) {
                tw.table.defs[id].assignments = tw.table.defs[id].assignments.saturating_add(1);
                tw.table.defs[id].fixed = None;
            }
            walk(expr, tw);
        }
        Data::Symbol { kind: SymKind::Ref, .. } => {
            // terser `reduce-vars.js` `AST_SymbolRef`.
            if let Some(id) = def_of(tw, n) {
                on_ref(tw, id, n);
            }
        }
        Data::Symbol { kind: SymKind::Catch, .. } => {
            // terser `reduce-vars.js` `AST_SymbolCatch`: a catch binding is not fixed.
            if let Some(id) = def_of(tw, n) {
                tw.table.defs[id].fixed = None;
            }
        }
        other => walk_children(other, tw),
    }
    tw.parents.pop();
}

fn walk_children(data: &Data, tw: &mut Tw) {
    match data {
        Data::Simple { body } | Data::Throw { value: body } | Data::Return { value: Some(body) } | Data::Dot { expr: body, .. } | Data::Await { expr: body } | Data::Spread { expr: body } | Data::Chain { expr: body } | Data::Unary { expr: body, .. } => {
            walk(body, tw);
        }
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } => {
            walk(left, tw);
            walk(right, tw);
        }
        Data::Seq { exprs } | Data::Array { elements: exprs } => {
            for e in exprs {
                walk(e, tw);
            }
        }
        Data::Call { expr, args, .. } => {
            walk(expr, tw);
            for a in args {
                walk(a, tw);
            }
        }
        Data::If { .. } | Data::Cond { .. } | Data::Func { .. } | Data::Toplevel { .. } | Data::Block { .. } | Data::While { .. } | Data::Do { .. } | Data::For { .. } | Data::Try { .. } | Data::VarDef { .. } | Data::Symbol { .. } => {}
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            // terser `reduce-vars.js` `AST_ForIn`: `suppress(this.init)` clears `fixed`.
            suppress(init, tw);
            walk(object, tw);
            let saved = tw.in_loop;
            tw.in_loop = tw.in_loop.saturating_add(1);
            push(tw);
            walk(body, tw);
            pop(tw);
            tw.in_loop = saved;
        }
        Data::Switch { expr, body } => {
            walk(expr, tw);
            for s in body {
                walk(s, tw);
            }
        }
        Data::Case { expr, body } => {
            walk(expr, tw);
            for s in body {
                walk(s, tw);
            }
        }
        Data::Default { body } | Data::StaticBlock { body } => {
            for s in body {
                walk(s, tw);
            }
        }
        Data::Catch { body, .. } | Data::Finally { body } => walk(body, tw),
        Data::Labeled { body, .. } => {
            let skips = contains_break(body);
            if skips {
                tw.conditional_var += 1;
            }
            walk(body, tw);
            if skips {
                tw.conditional_var -= 1;
            }
        }
        Data::Object { props } => {
            for p in props {
                walk(p, tw);
            }
        }
        Data::Prop { value, .. } => walk(value, tw),
        Data::Class { extends, props, .. } => {
            if let Some(extends) = extends {
                walk(extends, tw);
            }
            for p in props {
                walk(p, tw);
            }
        }
        Data::Defs { defs, .. } => {
            for d in defs {
                walk(d, tw);
            }
        }
        _ => {}
    }
}

/// terser `reduce-vars.js` `reset_def`.
fn reset_def(tw: &mut Tw, id: usize) {
    let exposed = exposed(&tw.table.defs[id], tw.env);
    let d = &mut tw.table.defs[id];
    d.assignments = 0;
    d.references.clear();
    d.single_use = SingleUse::No;
    d.escaped = 0;
    d.recursive_refs = 0;
    d.replaced.set(0);
    if d.pinned {
        d.fixed = None;
    } else if d.is_const || !exposed {
        d.fixed = d.init.clone();
    } else {
        d.fixed = None;
    }
}

/// terser `reduce-vars.js` `reset_variables`.
fn reset_variables(tw: &mut Tw, scope: usize) {
    let ids = tw.table.scope_defs.get(&scope).cloned().unwrap_or_default();
    for id in ids {
        if tw.table.defs[id].block_scoped {
            continue;
        }
        reset_def(tw, id);
        if tw.table.defs[id].fixed.is_some() {
            tw.loop_ids.insert(id, tw.in_loop);
            mark(tw, id, true);
        }
    }
}

/// terser `reduce-vars.js` `reset_block_variables`.
fn reset_block_variables(tw: &mut Tw, scope: usize) {
    let ids = tw.table.scope_defs.get(&scope).cloned().unwrap_or_default();
    for id in ids {
        reset_def(tw, id);
        if tw.table.defs[id].fixed.is_some() {
            tw.loop_ids.insert(id, tw.in_loop);
            mark(tw, id, true);
        }
    }
}

/// terser `reduce-vars.js` `push`.
fn push(tw: &mut Tw) {
    tw.safe.push(HashMap::new());
}

/// terser `reduce-vars.js` `pop`.
fn pop(tw: &mut Tw) {
    tw.safe.pop();
}

/// terser `reduce-vars.js` `mark`.
fn mark(tw: &mut Tw, id: usize, safe: bool) {
    if let Some(frame) = tw.safe.last_mut() {
        frame.insert(id, safe);
    }
}

fn safe_flag(tw: &Tw, id: usize) -> Option<bool> {
    for frame in tw.safe.iter().rev() {
        if let Some(v) = frame.get(&id) {
            return Some(*v);
        }
    }
    None
}

/// terser `reduce-vars.js` `safe_to_read`.
fn safe_to_read(tw: &Tw, id: usize) -> bool {
    if matches!(tw.table.defs[id].single_use, SingleUse::Modified) {
        return false;
    }
    matches!(safe_flag(tw, id), Some(true))
}

/// terser `reduce-vars.js` `safe_to_assign`.
fn safe_to_assign(tw: &Tw, id: usize) -> bool {
    let d = &tw.table.defs[id];
    if d.fixed.is_none() && d.init.is_none() && d.assignments == 0 && d.references.is_empty() && !safe_flag(tw, id).unwrap_or(false) {
        // `fixed === undefined` in terser means the def was never reset. Treat a known def as reset.
    }
    // `HOP` is hasOwnProperty: only a mark on the current frame counts.
    // A nested function's frame does not own the outer variable's mark.
    if !tw.safe.last().is_some_and(|frame| frame.contains_key(&id)) {
        return false;
    }
    if !safe_to_read(tw, id) {
        return false;
    }
    if d.fixed.is_none() {
        return false;
    }
    if d.references.len() as u32 > d.assignments {
        return false;
    }
    true
}

/// terser `reduce-vars.js` `ref_once`.
fn ref_once(tw: &Tw, id: usize) -> bool {
    let d = &tw.table.defs[id];
    tw.env.unused
        && !d.pinned
        && d.references.len() as u32 - d.recursive_refs == 1
        && tw.loop_ids.get(&id).copied() == Some(tw.in_loop)
}

/// terser `reduce-vars.js` `AST_SymbolRef`.
fn on_ref(tw: &mut Tw, id: usize, node: &N) {
    tw.table.defs[id].references.push(syms::ptr(node));
    if tw.table.defs[id].fixed.is_none() || !safe_to_read(tw, id) {
        tw.table.defs[id].fixed = None;
        tw.table.defs[id].single_use = SingleUse::No;
        return;
    }
    let fixed = tw.table.defs[id].fixed.clone();
    if let Some(fixed) = fixed {
        if tw.env.unused && !exposed(&tw.table.defs[id], tw.env) && ref_once(tw, id) {
            // terser sets single_use when the fixed value is a constant expression in this scope.
            tw.table.defs[id].single_use = if is_constant_expr(&fixed) { SingleUse::Yes } else { SingleUse::No };
        } else {
            tw.table.defs[id].single_use = SingleUse::No;
        }
        if is_lhs_parent(tw, node) {
            if matches!(tw.table.defs[id].single_use, SingleUse::Yes) {
                tw.table.defs[id].single_use = SingleUse::Modified;
            } else {
                tw.table.defs[id].fixed = None;
            }
        }
    }
}

/// terser `lib/compress/inference.js` `is_lhs` for a reference sitting on an assignment or update.
fn is_lhs_parent(tw: &Tw, node: &N) -> bool {
    let Some(parent) = tw.parents.iter().rev().nth(1) else { return false };
    let _ = parent;
    // The parent pointer is only an address. The walk pushes the node itself before children,
    // so the previous parent is the container we are currently matching in `walk`. Updates and
    // assignments are handled in their own arms and do not call `on_ref` for the left-hand symbol.
    let _ = node;
    false
}

/// terser `lib/compress/inference.js` `is_constant_expression` for constants, unary, and binary.
fn is_constant_expr(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null => true,
        Data::Unary { expr, .. } => is_constant_expr(expr),
        Data::Binary { left, right, .. } => is_constant_expr(left) && is_constant_expr(right),
        _ => false,
    }
}

fn is_literal(n: &N) -> bool {
    matches!(n.data, Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null)
}

/// terser `lib/compress/inference.js` `has_side_effects` for the nodes a fixed value can be.
fn has_side_effects(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null | Data::This => false,
        Data::Unary { op, expr, .. } => matches!(op.as_str(), "delete" | "++" | "--") || has_side_effects(expr),
        Data::Binary { left, right, .. } => has_side_effects(left) || has_side_effects(right),
        Data::Symbol { kind: SymKind::Ref, .. } => false,
        _ => true,
    }
}

/// terser `lib/compress/inference.js` `may_throw` for literals.
fn may_throw(n: &N) -> bool {
    !is_literal(n) && !matches!(n.data, Data::Unary { .. } | Data::Binary { .. })
}

/// terser `lib/compress/index.js` `Compressor.exposed`.
fn exposed(def: &SymbolDef, env: &Env) -> bool {
    if !def.global {
        return false;
    }
    if def.is_defun { !env.toplevel_funcs } else { !env.toplevel_vars }
}

/// terser `reduce-vars.js` `suppress`: every symbol under `node` loses `fixed`.
fn suppress(n: &N, tw: &mut Tw) {
    match &n.data {
        Data::Symbol { .. } => {
            if let Some(id) = def_of(tw, n) {
                tw.table.defs[id].fixed = None;
                if matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. }) {
                    tw.table.defs[id].references.push(syms::ptr(n));
                }
            }
        }
        Data::Defs { defs, .. } => {
            for def in defs {
                suppress(def, tw);
            }
        }
        Data::VarDef { name, .. } => suppress(name, tw),
        _ => {}
    }
}

/// A hoisted `function` can observe a `var` before its initializer runs.
/// terser `reduce-vars.js` `handle_defined_after_hoist`.
fn clear_use_before_init(stmts: &[N], tw: &mut Tw) {
    let mut reads: HashMap<String, Vec<usize>> = HashMap::new();
    for stmt in stmts {
        if let Data::Func { kind: ast::FuncKind::Decl, name: Some(name), body, .. } = &stmt.data {
            if let Some(fname) = sym_str(name) {
                let mut ids = Vec::new();
                collect_local_refs(body, tw, &mut ids);
                reads.insert(fname, ids);
            }
        }
    }
    if reads.is_empty() {
        return;
    }
    let mut init_at: HashMap<usize, usize> = HashMap::new();
    let mut calls: Vec<(usize, String)> = Vec::new();
    for (i, stmt) in stmts.iter().enumerate() {
        if let Data::Defs { defs, .. } = &stmt.data {
            for def in defs {
                if let Data::VarDef { name, value: Some(_) } = &def.data {
                    if let Some(id) = def_of(tw, name) {
                        init_at.insert(id, i);
                    }
                }
            }
        }
        collect_calls(stmt, &reads, i, &mut calls);
    }
    for (at, fname) in calls {
        if let Some(ids) = reads.get(&fname) {
            for id in ids {
                if init_at.get(id).is_some_and(|init| at < *init) {
                    tw.table.defs[*id].fixed = None;
                }
            }
        }
    }
}

fn collect_local_refs(stmts: &[N], tw: &Tw, ids: &mut Vec<usize>) {
    fn walk(n: &N, tw: &Tw, ids: &mut Vec<usize>) {
        match &n.data {
            Data::Symbol { kind: SymKind::Ref, .. } => {
                if let Some(id) = def_of(tw, n) {
                    ids.push(id);
                }
            }
            Data::Func { body, .. } => {
                for s in body {
                    walk(s, tw, ids);
                }
            }
            Data::Block { body } | Data::Default { body } => {
                for s in body {
                    walk(s, tw, ids);
                }
            }
            Data::Return { value: Some(v) } | Data::Simple { body: v } | Data::Unary { expr: v, .. } => walk(v, tw, ids),
            Data::Binary { left, right, .. } | Data::Assign { left, right, .. } => {
                walk(left, tw, ids);
                walk(right, tw, ids);
            }
            Data::Call { expr, args, .. } => {
                walk(expr, tw, ids);
                for a in args {
                    walk(a, tw, ids);
                }
            }
            _ => {}
        }
    }
    for s in stmts {
        walk(s, tw, ids);
    }
}

fn collect_calls(n: &N, funs: &HashMap<String, Vec<usize>>, at: usize, calls: &mut Vec<(usize, String)>) {
    match &n.data {
        Data::Call { expr, args, .. } => {
            if let Data::Symbol { name, kind: SymKind::Ref, .. } = &expr.data {
                if funs.contains_key(name) {
                    calls.push((at, name.clone()));
                }
            }
            collect_calls(expr, funs, at, calls);
            for a in args {
                collect_calls(a, funs, at, calls);
            }
        }
        Data::Func { .. } => {}
        Data::Block { body } | Data::Default { body } => {
            for s in body {
                collect_calls(s, funs, at, calls);
            }
        }
        Data::Simple { body } | Data::Return { value: Some(body) } | Data::Unary { expr: body, .. } => {
            collect_calls(body, funs, at, calls);
        }
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } => {
            collect_calls(left, funs, at, calls);
            collect_calls(right, funs, at, calls);
        }
        Data::If { cond, body, alt } => {
            collect_calls(cond, funs, at, calls);
            collect_calls(body, funs, at, calls);
            if let Some(alt) = alt {
                collect_calls(alt, funs, at, calls);
            }
        }
        Data::VarDef { value, .. } => {
            if let Some(value) = value {
                collect_calls(value, funs, at, calls);
            }
        }
        Data::Defs { defs, .. } => {
            for d in defs {
                collect_calls(d, funs, at, calls);
            }
        }
        _ => {}
    }
}

fn sym_str(n: &N) -> Option<String> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name.clone()),
        _ => None,
    }
}

fn contains_break(n: &N) -> bool {
    match &n.data {
        Data::Break { .. } | Data::Continue { .. } => true,
        Data::Func { .. } | Data::Class { .. } => false,
        Data::Block { body } | Data::Default { body } => body.iter().any(contains_break),
        Data::If { body, alt, .. } => contains_break(body) || alt.as_ref().is_some_and(|a| contains_break(a)),
        Data::Labeled { body, .. } | Data::Simple { body } | Data::Return { value: Some(body) } => contains_break(body),
        _ => false,
    }
}

fn def_of(tw: &Tw, n: &N) -> Option<usize> {
    tw.table.node_def.get(&syms::ptr(n)).copied()
}

fn sym_ref(n: &N) -> Option<()> {
    match &n.data {
        Data::Symbol { kind: SymKind::Ref, .. } => Some(()),
        _ => None,
    }
}
