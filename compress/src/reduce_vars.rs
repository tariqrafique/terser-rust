//! Port of terser `lib/compress/reduce-vars.js`.
//!
//! `analyze` is `AST_Toplevel.reset_opt_flags`: it walks in execution order
//! and fills each `SymbolDef`'s `fixed`, `references`, `assignments`,
//! `single_use`, and `escaped`. `inline_ref` is `inline_into_symbolref` in
//! `lib/compress/inline.js`: constants, and a single-use lambda or class.

use ast::{Data, FuncKind, Key, N, Node, SymKind};
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
    /// terser `defs_to_safe_ids`: the `safe_ids` frame a `fixed === null` def was marked in.
    null_safe: HashMap<usize, usize>,
    /// Node stack. The last entry is the node being walked. `mark_escaped` reads parents off it.
    parents: Vec<N>,
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
        null_safe: HashMap::new(),
        parents: Vec::new(),
    };
    walk(root, &mut tw);
    syms::index_func_fixed(table);
}

/// Parents and options `inline_into_symbolref` reads off the compressor.
pub struct At<'a> {
    pub env: &'a Env,
    pub parents: &'a [N],
    pub in_loop: bool,
    pub reduce_funcs: bool,
    pub in_computed_key: bool,
    pub top_retain: Option<&'a str>,
}

/// terser `lib/compress/inline.js` `inline_into_symbolref`.
pub fn inline_ref(n: &N, table: &SymTable, at: &At) -> Option<N> {
    if at.in_computed_key {
        return None;
    }
    let Data::Symbol { kind: SymKind::Ref, .. } = &n.data else { return None };
    let id = table.lookup(&syms::ptr(n))?;
    let (scope, mut single, assignments, references, name_len, exposed_now) = {
        let def = &table.defs[id];
        if def.suppress_fixed.get() || def.fixed.is_none() {
            return None;
        }
        (
            def.scope,
            // terser `single_use` is `true` or `"m"`; both are truthy here.
            matches!(def.single_use, SingleUse::Yes | SingleUse::Modified),
            def.assignments,
            def.references.len() as u32,
            // terser `self.size(compressor)`: one character when it will be mangled.
            if crate::eval::mangled_size(n) { 1 } else { def.name.len() },
            exposed(def, at.env),
        )
    };
    let fixed = table.defs[id].fixed.clone()?;
    // terser `inline.js` `dont_inline_lambda_in_loop`.
    if at.in_loop && is_lambda_or_class(&fixed) {
        return None;
    }
    let parent = at.parents.iter().rev().nth(1);
    if single && parent.is_some_and(is_pure_or_noinline_call) {
        single = false;
    }
    if single && parent.is_some_and(|p| matches!(p.data, Data::Export { .. })) && is_lambda(&fixed) && func_name(&fixed).is_some() {
        single = false;
    }
    if single && (value_side_effects(&fixed) || value_may_throw(&fixed)) {
        single = false;
    }
    // A class is not inlined into another scope (`inline.js`).
    if matches!(fixed.data, Data::Class { .. }) && symbol_scope(table, at.parents) != Some(scope) {
        return None;
    }
    if single && is_lambda_or_class(&fixed) {
        single = lambda_inline_ok(table, at, id, &fixed);
    }
    if single && is_lambda_or_class(&fixed) {
        let sym_scope = symbol_scope(table, at.parents);
        let conflict = sym_scope.is_some_and(|s| scope_encloses_conflict(table, s, &fixed));
        let direct_call = parent.is_some_and(|p| call_targets(p, n));
        let recursive_name = named_recursive(table, &fixed);
        single = (sym_scope == Some(scope) && !conflict) || (direct_call && !conflict && !recursive_name);
    }
    if single {
        let def = &table.defs[id];
        def.replaced.set(def.replaced.get().saturating_add(1));
        // terser `fixed.clone(true)` when the lambda moves to another scope:
        // fresh nodes (no optimizer flags) that keep their definitions.
        if (is_lambda_or_class(&fixed) && symbol_scope(table, at.parents) != Some(scope))
            || matches!(fixed.data, Data::Func { kind: FuncKind::Decl, .. })
        {
            let copy = ast::deep_clone(&fixed);
            table.alias_copy(&fixed, &copy);
            let out = expr_value(&copy);
            if let Some(sc) = table.scope_lookup(&syms::ptr(&fixed)) {
                table.alias_scope.borrow_mut().insert(syms::ptr(&out), (sc, Rc::clone(&out)));
            }
            return Some(out);
        }
        return Some(expr_value(&fixed));
    }
    // Multiple reads: terser `fixed.evaluate` and `make_node_from_constant`,
    // kept when it is not longer than the name plus the declaration overhead
    // `unused` can remove.
    if !at.env.evaluate {
        return None;
    }
    use crate::eval::Lit;
    let lit = if is_literal(&fixed) { None } else { crate::eval::eval_lit(&fixed).or_else(|| eval_num(&fixed).map(Lit::Num)) };
    let (replace, replace_len) = if is_literal(&fixed) {
        (Rc::clone(&fixed), codegen::print(&fixed).len())
    } else {
        match lit? {
            Lit::Num(num) if num.is_finite() => {
                let node = if num < 0.0 || (num == 0.0 && num.is_sign_negative()) {
                    span_node(&fixed, Data::Unary { op: "-".into(), expr: span_node(&fixed, Data::Number { value: -num, raw: String::new() }), prefix: true })
                } else {
                    span_node(&fixed, Data::Number { value: num, raw: String::new() })
                };
                let len = codegen::print(&node).len();
                (node, len)
            }
            Lit::Str(v) => {
                let node = span_node(&fixed, Data::String { value: v, quote: '"', units: None });
                let len = codegen::print(&node).len();
                (node, len)
            }
            // `make_node_from_constant` gives `AST_True` / `AST_False`. The
            // replacement is `OPTIMIZED`, so it prints as `true` / `false`.
            Lit::Bool(b) => (span_node(&fixed, if b { Data::True } else { Data::False }), if b { 4 } else { 5 }),
            Lit::Null => (span_node(&fixed, Data::Null), 4),
            Lit::Undef => (void0(&fixed), 6),
            _ => return None,
        }
    };
    let reads = references.saturating_sub(assignments);
    if reads == 0 {
        return None;
    }
    let fixed_len = codegen::print(&fixed).len();
    let overhead = if at.env.unused && !exposed_now {
        (name_len + 2 + fixed_len) as f64 / reads as f64
    } else {
        0.0
    };
    if replace_len as f64 <= name_len as f64 + overhead {
        let def = &table.defs[id];
        def.replaced.set(def.replaced.get().saturating_add(1));
        return Some(replace);
    }
    None
}

/// Numeric value of a fixed constant expression. terser `evaluate.js` for `+`, `-`, and arithmetic.
fn eval_num(n: &N) -> Option<f64> {
    match &n.data {
        Data::Number { value, .. } => Some(*value),
        Data::Unary { op, expr, prefix: true } => {
            let v = eval_num(expr)?;
            match op.as_str() {
                "+" => Some(v),
                "-" => Some(-v),
                _ => None,
            }
        }
        Data::Binary { op, left, right } => {
            let l = eval_num(left)?;
            let r = eval_num(right)?;
            match op.as_str() {
                "+" => Some(l + r),
                "-" => Some(l - r),
                "*" => Some(l * r),
                "/" if r != 0.0 => Some(l / r),
                _ => None,
            }
        }
        _ => None,
    }
}

fn walk(n: &N, tw: &mut Tw) {
    tw.parents.push(Rc::clone(n));
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
        Data::Func { args, body, .. } => {
            // terser `reduce-vars.js` `mark_lambda`: push a safe_ids frame, reset this function's variables, descend, pop.
            // The function body is a block in terser (`AST_Block.reduce_vars` calls
            // `reset_block_variables`). Our body is the statement list on the function,
            // so the body's `let`/`const` live on this scope and are reset here.
            push(tw);
            if let Some(&scope) = tw.table.node_scope.get(&syms::ptr(n)) {
                reset_variables(tw, scope);
            }
            // terser `reduce-vars.js` `mark_lambda`: IIFE parameters become fixed values.
            bind_iife_params(tw, n);
            // `descend()` walks the parameters first: default values and
            // computed keys are reads.
            for arg in args {
                if !matches!(arg.data, Data::Symbol { .. }) {
                    walk(arg, tw);
                }
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
            // terser `reduce-vars.js` `AST_VarDef`: a destructuring pattern is
            // `suppress`ed (its symbols lose `fixed`, its reads are counted),
            // then descended.
            if !matches!(name.data, Data::Symbol { .. }) {
                suppress(name, tw);
                walk(name, tw);
                if let Some(value) = value {
                    walk(value, tw);
                }
                tw.parents.pop();
                return;
            }
            if let Some(value) = value {
                if let Some(id) = def_of(tw, name) {
                    // A `let`/`const` inside a loop is a fresh binding each iteration.
            // terser keeps it (reduce_vars does not inline it); `var` is hoisted once and can be.
            // `arguments` is the arguments object, not an ordinary binding.
            // A block binding inside a loop or `try`, or a `var` that might not run, is not fixed.
            let block = tw.table.defs[id].block_scoped;
            let special = tw.table.defs[id].name == "arguments"
                || (block && (tw.in_loop != 0 || tw.in_try != 0))
                ;
            if special {
                        tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
                        walk(value, tw);
                        tw.parents.pop();
                        return;
                    }
                    if safe_to_assign(tw, id) {
                        tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = Some(Rc::clone(value));
                        tw.loop_ids.insert(id, tw.in_loop);
                        mark(tw, id, false);
                        walk(value, tw);
                        mark(tw, id, true);
                        tw.parents.pop();
                        return;
                    } else {
                        tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
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
            // terser `reduce-vars.js` `AST_Assign`: a destructuring target is suppressed.
            if matches!(left.data, Data::Destructuring { .. }) {
                suppress(left, tw);
                walk(right, tw);
                done = true;
            }
            if done {
            } else if let Some(id) = sym_ref(left).and_then(|()| def_of(tw, left)) {
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
                    tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = Some(Rc::clone(right));
                    tw.table.defs[id].references.push(syms::ptr(left));
                    mark(tw, id, false);
                    walk(right, tw);
                    mark(tw, id, true);
                    // terser `reduce-vars.js` `AST_Assign`: the assignment expression can escape.
                    mark_escaped(tw, id, n, Some(Rc::clone(right)), 0, 1, ref_scope(tw, 0));
                    done = true;
                } else {
                    // The left-hand reference is modified, which clears `fixed`.
                    tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
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
            // A safe update keeps `fixed` as `+previous ± 1` instead of clearing it.
            let handled = if let Some(id) = sym_ref(expr).and_then(|_| def_of(tw, expr)) {
                // `++` on a `const` drops `fixed`. The read stays the name (`reassign_const`).
                if tw.table.defs[id].is_const {
                    tw.table.defs[id].assignments = tw.table.defs[id].assignments.saturating_add(1);
                    tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
                    walk(expr, tw);
                    tw.parents.pop();
                    return;
                }
                let safe = safe_to_assign(tw, id);
                tw.table.defs[id].assignments = tw.table.defs[id].assignments.saturating_add(1);
                if safe {
                    if let Some(fixed) = tw.table.defs[id].fixed.clone() {
                        tw.table.defs[id].references.push(syms::ptr(expr));
                        let bin_op = if op == "++" { "+" } else { "-" };
                        let value = span_node(
                            n,
                            Data::Binary {
                                op: bin_op.into(),
                                left: span_node(n, Data::Unary { op: "+".into(), expr: fixed, prefix: true }),
                                right: span_node(n, Data::Number { value: 1.0, raw: "1".into() }),
                            },
                        );
                        tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = Some(value);
                        mark(tw, id, true);
                        true
                    } else {
                        false
                    }
                } else {
                    tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
                    false
                }
            } else {
                false
            };
            if !handled {
                walk(expr, tw);
            }
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
                tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
            }
        }
        _ => walk_children(n, tw),
    }
    tw.parents.pop();
}

/// The visitors that `walk` leaves to its caller's match, then terser's `_walk` order for every
/// node without a `def_reduce_vars` visitor.
fn walk_children(n: &N, tw: &mut Tw) {
    match &n.data {
        // terser `reduce-vars.js` `AST_Call`: the callee, then the arguments (not `_walk`'s order).
        Data::Call { expr, args, .. } => {
            walk(expr, tw);
            for a in args {
                walk(a, tw);
            }
        }
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
        Data::Case { expr, body } => {
            // terser `reduce-vars.js` `AST_Case`: the test and the body are separate safe frames.
            // A `case x--` does not assign `fixed` for code after the switch.
            push(tw);
            walk(expr, tw);
            pop(tw);
            push(tw);
            for s in body {
                walk(s, tw);
            }
            pop(tw);
        }
        Data::Default { body } => {
            // terser `reduce-vars.js` `AST_Default`.
            push(tw);
            for s in body {
                walk(s, tw);
            }
            pop(tw);
        }
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
        Data::Export { value, definition, names, module_name, .. } => {
            if let Some(v) = value {
                walk(v, tw);
            }
            if let Some(d) = definition {
                walk(d, tw);
            }
            // `AST_SymbolExport` is an `AST_SymbolRef`: `export { c }` is a
            // reference to `c` (its own optimizer leaves it alone).
            if let (Some(names), None) = (names, module_name) {
                for m in names {
                    let Data::NameMap { name, .. } = &m.data else { continue };
                    if let Some(id) = tw.table.lookup(&syms::ptr(name)) {
                        on_ref(tw, id, name);
                    }
                }
            }
        }
        _ => ast::walk_children(n, &mut |c| walk(c, tw)),
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
    d.direct_access = false;
    d.recursive_refs = 0;
    d.replaced.set(0);
    // terser `reset_def`: a funarg named `arguments` in a function that uses
    // `arguments` is not fixed. A `function arguments(){}` shares that binding.
    if d.pinned || (d.name == "arguments" && (d.is_defun || d.funarg)) {
        d.fixed = None;
    } else if d.is_const || !exposed {
        // terser scope.js defines a `var` with `init` null, so it resets to
        // `fixed === null` and `AST_VarDef` assigns the initializer.
        if d.var_decl && !d.is_defun {
            d.fixed = None;
            d.fixed_null = true;
        } else {
            d.fixed = d.init.clone();
            d.fixed_null = false;
        }
        return;
    } else {
        d.fixed = None;
    }
    d.fixed_null = false;
}

/// terser `reduce-vars.js` `reset_variables`.
fn reset_variables(tw: &mut Tw, scope: usize) {
    let ids = tw.table.scope_defs.get(&scope).cloned().unwrap_or_default();
    for id in ids {
        reset_def(tw, id);
        if tw.table.defs[id].fixed_null {
            tw.null_safe.insert(id, tw.safe.len() - 1);
            mark(tw, id, true);
        } else if tw.table.defs[id].fixed.is_some() {
            tw.loop_ids.insert(id, tw.in_loop);
            mark(tw, id, true);
        }
    }
}

/// terser `reduce-vars.js` `reset_block_variables`.
fn reset_block_variables(tw: &mut Tw, scope: usize) {
    let ids = tw.table.scope_defs.get(&scope).cloned().unwrap_or_default();
    for id in ids {
        // terser only resets here. A `let`/`const` in a nested block is
        // `fixed === null` but not marked safe, so its initializer is not fixed.
        reset_def(tw, id);
        if !tw.table.defs[id].fixed_null && tw.table.defs[id].fixed.is_some() {
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
fn safe_to_read(tw: &mut Tw, id: usize) -> bool {
    if matches!(tw.table.defs[id].single_use, SingleUse::Modified) {
        return false;
    }
    if !matches!(safe_flag(tw, id), Some(true)) {
        return false;
    }
    // terser: a safe read of `fixed == null` fixes the value to `void 0`.
    let d = &mut tw.table.defs[id];
    if d.fixed_null {
        if d.funarg || d.name == "arguments" {
            return false;
        }
        let zero = Rc::new(Node { start: None, end: None, data: Data::Number { value: 0.0, raw: "0".into() } });
        d.fixed = Some(Rc::new(Node { start: None, end: None, data: Data::Unary { op: "void".into(), expr: zero, prefix: true } }));
        d.fixed_null = false;
    }
    true
}

/// terser `reduce-vars.js` `safe_to_assign`.
fn safe_to_assign(tw: &mut Tw, id: usize) -> bool {
    if tw.table.defs[id].fixed_null {
        if let Some(frame) = tw.null_safe.remove(&id) {
            if let Some(f) = tw.safe.get_mut(frame) {
                f.insert(id, false);
            }
            return true;
        }
    }
    // terser `reduce-vars.js` `safe_to_assign`: a function or class name is not a fixed write target.
    // `const` is rejected by the caller that would overwrite `fixed`.
    // `safe_to_assign` itself still accepts the initializer (`AST_VarDef`).
    if tw.table.defs[id].is_defun {
        return false;
    }
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
    let d = &tw.table.defs[id];
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
    let mut fixed_value = None;
    if (tw.table.defs[id].fixed.is_none() && !tw.table.defs[id].fixed_null) || !safe_to_read(tw, id) {
        tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
        tw.table.defs[id].single_use = SingleUse::No;
    } else if let Some(fixed) = tw.table.defs[id].fixed.clone() {
        fixed_value = Some(Rc::clone(&fixed));
        // terser `reduce-vars.js` `AST_SymbolRef`: a recursive lambda counts, otherwise
        // one read of an unpinned lambda, a class, or a same-scope constant is single-use.
        if is_lambda(&fixed) && is_recursive_ref(tw, id) {
            // Leave `single_use` alone. An earlier read in this walk may already be the one use.
            tw.table.defs[id].recursive_refs = tw.table.defs[id].recursive_refs.saturating_add(1);
        } else if tw.env.unused && !exposed(&tw.table.defs[id], tw.env) && ref_once(tw, id) {
            let same = ref_scope(tw, 0) == Some(tw.table.defs[id].scope);
            let yes = (is_lambda(&fixed) && !func_scope_pinned(tw.table, &fixed))
                || matches!(fixed.data, Data::Class { .. })
                || (same && const_expr_truthy(&fixed, tw.table, None));
            tw.table.defs[id].single_use = if yes { SingleUse::Yes } else { SingleUse::No };
        } else {
            tw.table.defs[id].single_use = SingleUse::No;
        }
        if is_modified(tw, node, Some(&fixed), 0, is_immutable(&fixed)) {
            if matches!(tw.table.defs[id].single_use, SingleUse::Yes) {
                tw.table.defs[id].single_use = SingleUse::Modified;
            } else {
                tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
            }
        }
    }
    // terser `reduce-vars.js` `mark_escaped`, called for every reference.
    mark_escaped(tw, id, node, fixed_value, 0, 1, ref_scope(tw, 0));
}

/// terser `reduce-vars.js` `mark_escaped`.
///
/// `scope` is the reference's scope, passed through every recursive step and
/// used only by `is_constant_expression`. Depth greater than 1 is how many
/// property reads happen before the value escapes. Transparent parents
/// (array, `&&`, object value, property read) recurse and then fall through,
/// so a value use still sets `direct_access`.
fn mark_escaped(tw: &mut Tw, id: usize, node: &N, value: Option<N>, level: usize, depth: u32, scope: Option<usize>) {
    if let Some(v) = &value {
        if is_constant_value(v) || matches!(v.data, Data::Class { stmt: false, .. }) {
            return;
        }
    }
    let Some(parent) = parent_at(tw, level).map(Rc::clone) else {
        if level == 0 {
            tw.table.defs[id].direct_access = true;
        }
        return;
    };
    let node_ptr = syms::ptr(node);
    let def_scope = tw.table.defs[id].scope;
    let escapes = match &parent.data {
        Data::Assign { op, right, logical, .. } if (*logical || op == "=") && syms::ptr(right) == node_ptr => true,
        Data::Call { expr, is_new, .. } if *is_new || syms::ptr(expr) != node_ptr => true,
        Data::Return { value: Some(v) } | Data::Throw { value: v } if syms::ptr(v) == node_ptr && node_scope_differs(tw, node, level, def_scope) => true,
        Data::Yield { expr: Some(v), .. } if syms::ptr(v) == node_ptr && node_scope_differs(tw, node, level, def_scope) => true,
        Data::VarDef { value: Some(v), .. } if syms::ptr(v) == node_ptr => true,
        _ => false,
    };
    if escapes {
        set_escaped(tw, id, value.as_ref(), depth, scope);
        return;
    }
    let mut held = false;
    if matches!(parent.data, Data::Array { .. } | Data::Await { .. } | Data::Spread { .. })
        || matches!(&parent.data, Data::Binary { op, .. } if matches!(op.as_str(), "&&" | "||" | "??"))
        || matches!(&parent.data, Data::Cond { cond, .. } if syms::ptr(cond) != node_ptr)
        || matches!(&parent.data, Data::Seq { exprs } if exprs.last().is_some_and(|e| syms::ptr(e) == node_ptr))
    {
        mark_escaped(tw, id, &parent, Some(Rc::clone(&parent)), level + 1, depth, scope);
    } else if matches!(&parent.data, Data::Prop { value: v, .. } if syms::ptr(v) == node_ptr) {
        if let Some(obj) = parent_at(tw, level + 1).map(Rc::clone) {
            mark_escaped(tw, id, &obj, Some(Rc::clone(&obj)), level + 2, depth, scope);
        }
    } else if let Some(next) = prop_read(tw, &parent, node_ptr, value.as_ref()) {
        let (found, next_value) = next;
        mark_escaped(tw, id, &parent, next_value, level + 1, depth + 1, scope);
        if found {
            held = true;
        }
    }
    if held || level > 0 {
        return;
    }
    if let Data::Seq { exprs } = &parent.data {
        if exprs.last().is_some_and(|e| syms::ptr(e) != node_ptr) {
            return;
        }
    }
    if matches!(parent.data, Data::Simple { .. }) {
        return;
    }
    tw.table.defs[id].direct_access = true;
}

/// A symbol has a scope. Other nodes do not, so `node.scope !== d.scope` is true.
fn node_scope_differs(tw: &Tw, node: &N, level: usize, def_scope: usize) -> bool {
    if matches!(node.data, Data::Symbol { .. }) {
        ref_scope(tw, level) != Some(def_scope)
    } else {
        true
    }
}

fn set_escaped(tw: &mut Tw, id: usize, value: Option<&N>, mut depth: u32, scope: Option<usize>) {
    // terser `reduce-vars.js` `mark_escaped`: depth past 1 only stays when the
    // value is a constant expression. Otherwise the escape is immediate.
    if depth > 1 && !value.is_some_and(|v| const_expr_truthy(v, tw.table, scope)) {
        depth = 1;
    }
    let escaped = tw.table.defs[id].escaped;
    if escaped == 0 || escaped > depth {
        tw.table.defs[id].escaped = depth;
    }
}

/// Immediate parent is level 0. The node being walked is the last stack entry.
fn parent_at<'a>(tw: &'a Tw<'_>, level: usize) -> Option<&'a N> {
    let len = tw.parents.len();
    let index = len.checked_sub(2 + level)?;
    tw.parents.get(index)
}

fn ref_scope(tw: &Tw, level: usize) -> Option<usize> {
    let len = tw.parents.len();
    let start = len.checked_sub(1 + level)?;
    for parent in tw.parents[..=start].iter().rev() {
        if let Some(&id) = tw.table.node_scope.get(&syms::ptr(parent)) {
            return Some(id);
        }
    }
    None
}

fn is_constant_value(n: &N) -> bool {
    matches!(
        n.data,
        Data::Number { .. } | Data::String { .. } | Data::BigInt { .. } | Data::RegExp { .. } | Data::True | Data::False | Data::Null | Data::Infinity
    )
}

fn const_key(n: &N) -> Option<String> {
    match &n.data {
        Data::String { value, .. } => Some(value.clone()),
        Data::Number { value, .. } if value.is_finite() => Some(codegen_number(*value)),
        _ => None,
    }
}

fn codegen_number(value: f64) -> String {
    if value == 0.0 { "0".into() } else { value.to_string() }
}

/// terser `common.js` `read_property`. A symbol value is replaced by its `fixed` once.
fn read_property(tw: &Tw, obj: &N, key: &str, numeric: bool) -> Option<N> {
    let obj = chase_fixed(tw, obj);
    match &obj.data {
        Data::Array { elements } => {
            if key == "length" {
                return Some(num_node(elements.len() as f64));
            }
            if !numeric {
                return None;
            }
            let i = key.parse::<usize>().ok()?;
            let el = elements.get(i)?;
            if matches!(el.data, Data::Hole) {
                return None;
            }
            Some(chase_fixed(tw, el))
        }
        Data::Object { props } => {
            let mut found = None;
            for prop in props.iter().rev() {
                let Data::Prop { method: None, key: Key::Static { name, .. }, value, .. } = &prop.data else {
                    return None;
                };
                if found.is_none() && name == key {
                    found = Some(Rc::clone(value));
                }
            }
            found.map(|v| chase_fixed(tw, &v))
        }
        _ => None,
    }
}

/// `Some((found, value))` when `parent` reads a property of `node`.
/// Missing properties still walk (`found` is false) so depth can escape.
fn prop_read(tw: &Tw, parent: &N, node_ptr: usize, value: Option<&N>) -> Option<(bool, Option<N>)> {
    match &parent.data {
        Data::Dot { expr, prop, .. } if syms::ptr(expr) == node_ptr => {
            let next = value.and_then(|v| read_property(tw, v, prop, false));
            let found = next.is_some();
            Some((found, next))
        }
        Data::Sub { expr, prop, .. } if syms::ptr(expr) == node_ptr => {
            let numeric = matches!(prop.data, Data::Number { .. });
            let next = const_key(prop).and_then(|key| value.and_then(|v| read_property(tw, v, &key, numeric)));
            let found = next.is_some();
            Some((found, next))
        }
        _ => None,
    }
}

/// terser `lib/compress/inference.js` `is_lhs` for a reference sitting on an assignment or update.
/// terser `inference.js` `is_modified`. `level` 0 is the reference's parent.
fn is_modified(tw: &Tw, node: &N, value: Option<&N>, level: usize, immutable: bool) -> bool {
    let Some(parent) = parent_at(tw, level) else { return false };
    let np = syms::ptr(node);
    // `is_lhs`
    match &parent.data {
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "++" | "--" | "delete") && syms::ptr(expr) == np => return true,
        Data::Assign { left, .. } if syms::ptr(left) == np => return true,
        Data::ForIn { init, .. } | Data::ForOf { init, .. } if syms::ptr(init) == np => return true,
        _ => {}
    }
    if !immutable {
        if let Data::Call { expr, is_new, .. } = &parent.data {
            if syms::ptr(expr) == np {
                let arrow = value.is_some_and(|v| matches!(v.data, Data::Func { kind: FuncKind::Arrow, .. }));
                let class = value.is_some_and(|v| matches!(v.data, Data::Class { .. }));
                let pure = crate::call::pure_effects(parent).is_some();
                let function = value.is_some_and(|v| matches!(v.data, Data::Func { kind: FuncKind::Expr, .. }));
                if !arrow && !class && !pure && (!function || (!*is_new && value.is_some_and(crate::eval::contains_this))) {
                    return true;
                }
            }
        }
    }
    match &parent.data {
        Data::Array { .. } => {
            let parent = Rc::clone(parent);
            is_modified(tw, &parent, Some(&parent), level + 1, false)
        }
        Data::Prop { value: v, .. } if syms::ptr(v) == np => {
            let Some(obj) = parent_at(tw, level + 1).map(Rc::clone) else { return false };
            is_modified(tw, &obj, Some(&obj), level + 2, false)
        }
        Data::Dot { expr, prop, .. } if syms::ptr(expr) == np => {
            if immutable {
                return false;
            }
            let parent = Rc::clone(parent);
            let read = value.and_then(|v| read_prop_lit(v, &PropKey::Name(prop.clone())));
            is_modified(tw, &parent, read.as_ref(), level + 1, false)
        }
        Data::Sub { expr, prop, .. } if syms::ptr(expr) == np => {
            if immutable {
                return false;
            }
            let parent = Rc::clone(parent);
            let key = match &prop.data {
                Data::String { value, .. } => Some(PropKey::Name(value.clone())),
                Data::Number { value, .. } => Some(PropKey::Index(*value)),
                _ => None,
            };
            let read = value.zip(key).and_then(|(v, k)| read_prop_lit(v, &k));
            is_modified(tw, &parent, read.as_ref(), level + 1, false)
        }
        _ => false,
    }
}

enum PropKey {
    Name(String),
    Index(f64),
}

/// terser `common.js` `read_property` on an array or object literal.
fn read_prop_lit(obj: &N, key: &PropKey) -> Option<N> {
    match (&obj.data, key) {
        (Data::Array { elements }, PropKey::Index(i)) if i.fract() == 0.0 && *i >= 0.0 => elements.get(*i as usize).cloned(),
        (Data::Array { elements }, PropKey::Name(n)) => n.parse::<usize>().ok().and_then(|i| elements.get(i).cloned()),
        (Data::Object { props }, _) => {
            let want = match key {
                PropKey::Name(n) => n.clone(),
                PropKey::Index(i) => crate::eval::js_num_tostring(*i),
            };
            let mut found = None;
            for p in props.iter().rev() {
                match &p.data {
                    Data::Prop { key: Key::Static { name, .. }, value, method: None, .. } if *name == want => {
                        found = Some(Rc::clone(value));
                        break;
                    }
                    Data::Prop { key: Key::Static { .. }, method: None, .. } => {}
                    _ => return None,
                }
            }
            found
        }
        _ => None,
    }
}

/// terser `reduce-vars.js` `is_immutable`.
fn is_immutable(v: &N) -> bool {
    is_constant_value(v) || matches!(v.data, Data::Func { .. } | Data::This) || matches!(&v.data, Data::Unary { op, expr, .. } if op != "++" && op != "--" && is_constant_value(expr))
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
        Data::Hole => false,
        Data::Array { elements } => elements.iter().any(|e| matches!(e.data, Data::Spread { .. }) || has_side_effects(e)),
        Data::Object { props } => props.iter().any(|p| match &p.data {
            Data::Prop { key: Key::Static { .. }, value, method: None, .. } => has_side_effects(value),
            _ => true,
        }),
        _ => true,
    }
}

/// terser `lib/compress/inference.js` `may_throw` for literals.
fn may_throw(n: &N) -> bool {
    match &n.data {
        Data::Array { elements } => elements.iter().any(|e| matches!(e.data, Data::Spread { .. }) || may_throw(e)),
        Data::Object { props } => props.iter().any(|p| match &p.data {
            Data::Prop { key: Key::Static { .. }, value, method: None, .. } => may_throw(value),
            _ => true,
        }),
        Data::Hole => false,
        _ => !is_literal(n) && !matches!(n.data, Data::Unary { .. } | Data::Binary { .. }),
    }
}

/// terser `lib/compress/index.js` `Compressor.exposed`.
fn exposed(def: &SymbolDef, env: &Env) -> bool {
    if def.exported {
        return true;
    }
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
                tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
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
        // terser walks every symbol under the node (destructuring patterns,
        // defaults, property values).
        _ => {
            let _ = ast::map_children(n, &mut |c| {
                suppress(c, tw);
                Rc::clone(c)
            });
        }
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
                    tw.table.defs[*id].fixed_null = false; tw.table.defs[*id].fixed = None;
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
    tw.table.lookup(&syms::ptr(n))
}

fn sym_ref(n: &N) -> Option<()> {
    match &n.data {
        Data::Symbol { kind: SymKind::Ref, .. } => Some(()),
        _ => None,
    }
}

/// terser `lib/compress/reduce-vars.js` `mark_lambda`.
///
/// An anonymous IIFE's parameters become fixed to the call arguments so the
/// body can inline them: `(function(a){ return a })(1)`.
fn bind_iife_params(tw: &mut Tw, func: &N) {
    let Data::Func { kind, name, args, body, .. } = &func.data else { return };
    if name.is_some() || matches!(kind, FuncKind::Decl) {
        return;
    }
    if func_scope_pinned(tw.table, func) || uses_arguments(kind, body) {
        return;
    }
    let Some(parent) = tw.parents.iter().rev().nth(1).cloned() else { return };
    let Data::Call { expr, args: call_args, .. } = &parent.data else { return };
    if !Rc::ptr_eq(expr, func) || call_args.iter().any(|a| matches!(a.data, Data::Spread { .. })) {
        return;
    }
    if args.iter().any(|a| !matches!(a.data, Data::Symbol { kind: SymKind::Funarg, .. })) {
        return;
    }
    for (i, arg) in args.iter().enumerate() {
        let Some(id) = def_of(tw, arg) else { continue };
        if tw.table.defs[id].orig_count > 1 {
            continue;
        }
        if tw.table.defs[id].fixed.is_some() {
            tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = None;
            continue;
        }
        let value = call_args.get(i).cloned().unwrap_or_else(|| void0(func));
        tw.table.defs[id].fixed_null = false; tw.table.defs[id].fixed = Some(value);
        tw.loop_ids.insert(id, tw.in_loop);
        mark(tw, id, true);
    }
}

fn uses_arguments(kind: &FuncKind, body: &[N]) -> bool {
    if matches!(kind, FuncKind::Arrow) {
        return false;
    }
    body.iter().any(mentions_arguments)
}

fn mentions_arguments(n: &N) -> bool {
    match &n.data {
        Data::Symbol { name, kind: SymKind::Ref, .. } if name == "arguments" => true,
        Data::Func { kind: FuncKind::Arrow, args, body, .. } => args.iter().any(mentions_arguments) || body.iter().any(mentions_arguments),
        Data::Func { .. } => false,
        other => each_child(other, mentions_arguments),
    }
}

fn is_lambda(n: &N) -> bool {
    matches!(n.data, Data::Func { .. })
}

fn is_lambda_or_class(n: &N) -> bool {
    matches!(n.data, Data::Func { .. } | Data::Class { .. })
}

fn func_name(n: &N) -> Option<String> {
    match &n.data {
        Data::Func { name: Some(name), .. } | Data::Class { name: Some(name), .. } => sym_str(name),
        _ => None,
    }
}

fn func_scope_pinned(table: &SymTable, func: &N) -> bool {
    // A direct `eval` or `with` inside pins the function (`uses_eval`).
    fn pins(n: &N, top: bool) -> bool {
        match &n.data {
            Data::With { .. } => true,
            Data::Call { expr, .. } if matches!(&expr.data, Data::Symbol { name, kind: SymKind::Ref, .. } if name == "eval") => true,
            Data::Func { .. } if !top => false,
            _ => {
                let mut hit = false;
                let _ = ast::map_children(n, &mut |c| {
                    hit = hit || pins(c, false);
                    Rc::clone(c)
                });
                hit
            }
        }
    }
    if pins(func, true) {
        return true;
    }
    table
        .node_scope
        .get(&syms::ptr(func))
        .copied()
        .and_then(|s| table.scope_pinned.get(s).copied())
        .unwrap_or(false)
}

/// terser `lib/compress/common.js` `is_recursive_ref`.
fn is_recursive_ref(tw: &Tw, id: usize) -> bool {
    is_recursive_at(tw.table, &tw.parents, id)
}

fn is_recursive_at(table: &SymTable, parents: &[N], id: usize) -> bool {
    let name = table.defs[id].name.clone();
    parents.iter().rev().skip(1).any(|parent| name_defines(table, parent, id, &name))
}

fn name_defines(table: &SymTable, node: &N, id: usize, name: &str) -> bool {
    let named = match &node.data {
        Data::Func { name: Some(n), .. } | Data::Class { name: Some(n), .. } => n,
        _ => return false,
    };
    if sym_str(named).as_deref() != Some(name) {
        return false;
    }
    if table.lookup(&syms::ptr(named)) == Some(id) {
        return true;
    }
    match table.node_scope.get(&syms::ptr(node)).copied() {
        Some(scope) => scope == table.defs[id].scope,
        // A function expression built from the declaration (`expr_value`):
        // terser points its recursive refs at the new lambda name.
        None => matches!(named.data, Data::Symbol { kind: SymKind::Lambda, .. }),
    }
}

fn symbol_scope(table: &SymTable, parents: &[N]) -> Option<usize> {
    // The root is scope 0. `hoist` may have rebuilt the toplevel node, so its
    // pointer is not in `node_scope`.
    parents.iter().rev().skip(1).find_map(|n| table.scope_lookup(&syms::ptr(n))).or(Some(0))
}

/// terser `lib/compress/inline.js` `inline_into_symbolref` lambda and class checks.
fn lambda_inline_ok(table: &SymTable, at: &At, id: usize, fixed: &N) -> bool {
    if retain_top(at, fixed) {
        return false;
    }
    let (def_scope, escaped, funarg) = {
        let def = &table.defs[id];
        (def.scope, def.escaped, def.funarg)
    };
    let sym_scope = symbol_scope(table, at.parents);
    let cross = sym_scope != Some(def_scope);
    if cross && (escaped == 1 || scope_is_inlined(table, fixed) || within_array_or_object(at.parents) || !at.reduce_funcs) {
        return false;
    }
    if is_recursive_at(table, at.parents, id) {
        return false;
    }
    if cross || funarg {
        let result = const_expr(fixed, table, sym_scope);
        if matches!(result, CExpr::Free) {
            mark_inlined(table, sym_scope);
        }
        return !matches!(result, CExpr::No);
    }
    true
}

fn retain_top(at: &At, func: &N) -> bool {
    let Some(keep) = at.top_retain else { return false };
    let Data::Func { kind: FuncKind::Decl, name: Some(name), .. } = &func.data else { return false };
    sym_str(name).as_deref() == Some(keep)
}

fn scope_is_inlined(table: &SymTable, func: &N) -> bool {
    table
        .node_scope
        .get(&syms::ptr(func))
        .copied()
        .is_some_and(|s| table.inlined_scopes.borrow().contains(&s))
}

fn mark_inlined(table: &SymTable, mut scope: Option<usize>) {
    let mut flagged = table.inlined_scopes.borrow_mut();
    while let Some(id) = scope {
        if id != 0 && table.fn_of.get(id).copied() == Some(id) {
            flagged.insert(id);
        }
        scope = table.scope_parent.get(id).copied().flatten();
    }
}

fn within_array_or_object(parents: &[N]) -> bool {
    for node in parents.iter().rev().skip(1) {
        if is_statement(&node.data) {
            return false;
        }
        if matches!(node.data, Data::Array { .. } | Data::Object { .. } | Data::Prop { .. }) {
            return true;
        }
    }
    false
}

fn is_statement(data: &Data) -> bool {
    matches!(
        data,
        Data::Simple { .. }
            | Data::If { .. }
            | Data::Return { .. }
            | Data::Throw { .. }
            | Data::Defs { .. }
            | Data::Func { kind: FuncKind::Decl, .. }
            | Data::Block { .. }
            | Data::Toplevel { .. }
            | Data::For { .. }
            | Data::While { .. }
            | Data::Do { .. }
            | Data::Switch { .. }
            | Data::Try { .. }
            | Data::Labeled { .. }
            | Data::Break { .. }
            | Data::Continue { .. }
            | Data::Empty
            | Data::Debugger
            | Data::Class { stmt: true, .. }
            | Data::ForIn { .. }
            | Data::ForOf { .. }
            | Data::With { .. }
            | Data::Catch { .. }
            | Data::Finally { .. }
            | Data::StaticBlock { .. }
            | Data::Directive { .. }
    )
}

fn call_targets(parent: &N, sym: &N) -> bool {
    match &parent.data {
        Data::Call { expr, is_new: false, .. } => Rc::ptr_eq(expr, sym),
        _ => false,
    }
}

fn is_pure_or_noinline_call(n: &N) -> bool {
    let Data::Call { expr, .. } = &n.data else { return false };
    // Same lookup as `call.rs` `call_ann`: the call's first token, then the callee's.
    [n, expr].iter().any(|node| {
        node.start.as_ref().is_some_and(|tok| {
            tok.comments_before.iter().any(|c| {
                let v = c.value.as_str();
                v.contains("@__PURE__") || v.contains("#__PURE__") || v.contains("@__NOINLINE__") || v.contains("#__NOINLINE__")
            })
        })
    })
}

fn named_recursive(table: &SymTable, func: &N) -> bool {
    let Some(name) = func_name(func) else { return false };
    let name_node = match &func.data {
        Data::Func { name: Some(n), .. } | Data::Class { name: Some(n), .. } => n,
        _ => return false,
    };
    if let Some(id) = table.lookup(&syms::ptr(name_node)) {
        if table.defs[id].recursive_refs > 0 {
            return true;
        }
    }
    let Some(&scope) = table.node_scope.get(&syms::ptr(func)) else { return false };
    table.scope_defs.get(&scope).is_some_and(|ids| {
        ids.iter().any(|&id| table.defs[id].name == name && table.defs[id].recursive_refs > 0)
    })
}

/// terser `lib/compress/inline.js` `scope_encloses_variables_in_this_scope`.
fn scope_encloses_conflict(table: &SymTable, nearest: usize, func: &N) -> bool {
    let Some(&func_scope) = table.node_scope.get(&syms::ptr(func)) else { return true };
    let nested = nested_scopes(func, table);
    let mut conflict = false;
    each_node(func, &mut |node| {
        if conflict {
            return;
        }
        let Data::Symbol { name, kind: SymKind::Ref, .. } = &node.data else { return };
        let Some(id) = table.lookup(&syms::ptr(node)) else { return };
        if nested.contains(&table.defs[id].scope) || defined_inside(table, id, func_scope) {
            return;
        }
        if find_var(table, nearest, name).is_some_and(|found| found != id) {
            conflict = true;
        }
    });
    conflict
}

/// Scope ids of the scope nodes inside `func` by position. An inlined copy
/// keeps its original scope id, whose parent chain does not pass through `func`.
fn nested_scopes(func: &N, table: &SymTable) -> std::collections::HashSet<usize> {
    let mut nested = std::collections::HashSet::new();
    each_node(func, &mut |node| {
        if let Some(sc) = table.scope_lookup(&syms::ptr(node)) {
            nested.insert(sc);
        }
    });
    nested
}

fn defined_inside(table: &SymTable, def_id: usize, func_scope: usize) -> bool {
    let mut scope = table.defs[def_id].scope;
    loop {
        if scope == func_scope {
            return true;
        }
        scope = match table.scope_parent.get(scope).copied().flatten() {
            Some(parent) => parent,
            None => return false,
        };
    }
}

fn find_var(table: &SymTable, mut scope: usize, name: &str) -> Option<usize> {
    loop {
        if let Some(ids) = table.scope_defs.get(&scope) {
            for &id in ids {
                if table.defs[id].name == name {
                    return Some(id);
                }
            }
        }
        scope = table.scope_parent.get(scope).copied().flatten()?;
    }
}

enum CExpr {
    No,
    Yes,
    /// terser `is_constant_expression` result `"f"`: free refs resolve in the target scope.
    Free,
}

fn const_expr_truthy(n: &N, table: &SymTable, scope: Option<usize>) -> bool {
    !matches!(const_expr(n, table, scope), CExpr::No)
}

/// terser `lib/compress/inference.js` `is_constant_expression`.
fn const_expr(n: &N, table: &SymTable, scope: Option<usize>) -> CExpr {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::BigInt { .. }
        | Data::RegExp { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Infinity => CExpr::Yes,
        Data::Unary { expr, .. } => const_expr(expr, table, None),
        Data::Binary { left, right, .. } => join_expr(const_expr(left, table, None), const_expr(right, table, None)),
        // inference.js: arrays, objects and their properties do not pass
        // `scope` down, so a lambda in them must have only local refs.
        Data::Array { elements } => elements.iter().fold(CExpr::Yes, |acc, el| join_expr(acc, const_expr(el, table, None))),
        Data::Object { props } => props.iter().fold(CExpr::Yes, |acc, prop| join_expr(acc, const_expr(prop, table, None))),
        Data::Prop { method: None, key: Key::Static { .. }, value, .. } => const_expr(value, table, None),
        Data::Func { .. } => all_refs_local(n, table, scope),
        Data::Class { extends, props, .. } => {
            let mut acc = CExpr::Yes;
            if let Some(extends) = extends {
                acc = join_expr(acc, const_expr(extends, table, scope));
            }
            for prop in props {
                if matches!(prop.data, Data::StaticBlock { .. }) {
                    return CExpr::No;
                }
                acc = join_expr(acc, const_expr(prop, table, scope));
            }
            join_expr(acc, all_refs_local(n, table, scope))
        }
        _ => CExpr::No,
    }
}

fn join_expr(a: CExpr, b: CExpr) -> CExpr {
    match (a, b) {
        (CExpr::No, _) | (_, CExpr::No) => CExpr::No,
        (CExpr::Free, _) | (_, CExpr::Free) => CExpr::Free,
        _ => CExpr::Yes,
    }
}

/// terser `inference.js` `all_refs_local`.
fn all_refs_local(func: &N, table: &SymTable, scope: Option<usize>) -> CExpr {
    let Some(&func_scope) = table.node_scope.get(&syms::ptr(func)) else { return CExpr::No };
    if table.inlined_scopes.borrow().contains(&func_scope) {
        return CExpr::No;
    }
    let arrow = matches!(func.data, Data::Func { kind: FuncKind::Arrow, .. });
    // Scopes nested in `func` by position: an inlined copy keeps its original
    // scope id, whose parent chain does not pass through `func`.
    let nested = nested_scopes(func, table);
    let mut result = CExpr::Yes;
    let mut abort = false;
    each_node(func, &mut |node| {
        if abort {
            return;
        }
        if arrow && matches!(node.data, Data::This) {
            result = CExpr::No;
            abort = true;
            return;
        }
        let Data::Symbol { name, kind: SymKind::Ref, .. } = &node.data else { return };
        let Some(id) = table.lookup(&syms::ptr(node)) else { return };
        // Locals and names defined in a nested function are not free references.
        if nested.contains(&table.defs[id].scope) || defined_inside(table, id, func_scope) {
            return;
        }
        match scope {
            None => {
                result = CExpr::No;
                abort = true;
            }
            Some(scope) => {
                let looked = find_var(table, scope, name);
                if table.defs[id].undeclared {
                    // Undeclared names live on the root scope here, so the
                    // lookup can find the same undeclared def.
                    if looked.is_none_or(|l| table.defs[l].undeclared) {
                        result = CExpr::Free;
                    } else {
                        result = CExpr::No;
                        abort = true;
                    }
                } else if looked == Some(id) {
                    result = CExpr::Free;
                } else {
                    result = CExpr::No;
                    abort = true;
                }
            }
        }
    });
    result
}

fn value_side_effects(n: &N) -> bool {
    if is_lambda_or_class(n) {
        return false;
    }
    has_side_effects(n)
}

fn value_may_throw(n: &N) -> bool {
    if is_lambda_or_class(n) {
        return false;
    }
    may_throw(n)
}

/// Declaration forms become expressions when they replace a reference.
fn expr_value(n: &N) -> N {
    match &n.data {
        Data::Func { kind: FuncKind::Decl, name, args, body, async_, generator } => span_node(
            n,
            Data::Func {
                kind: FuncKind::Expr,
                // terser `make_node(AST_Function, fixed, fixed)`: the name is
                // now an `AST_SymbolLambda` bound inside the function.
                name: name.as_ref().map(|nm| match &nm.data {
                    Data::Symbol { name, quote, .. } => span_node(nm, Data::Symbol { name: name.clone(), kind: SymKind::Lambda, quote: *quote }),
                    _ => Rc::clone(nm),
                }),
                // A fresh copy, so the original declaration and the inlined
                // expression do not share symbol nodes (terser `clone(true)`).
                // Only a self-recursive function needs separate nodes: its
                // inner references move to the lambda name. Otherwise the
                // copy shares nodes, so they keep their definitions.
                args: args.clone(),
                body: body.clone(),
                async_: *async_,
                generator: *generator,
            },
        ),
        Data::Class { stmt: true, name, extends, props } => span_node(
            n,
            Data::Class {
                stmt: false,
                // A new `AST_SymbolClass` node, so a rebind does not move the
                // declaration's name into the expression's scope.
                name: name.as_ref().map(|nm| match &nm.data {
                    Data::Symbol { name, quote, .. } => span_node(nm, Data::Symbol { name: name.clone(), kind: SymKind::Class, quote: *quote }),
                    _ => Rc::clone(nm),
                }),
                extends: extends.clone(),
                props: props.clone(),
            },
        ),
        _ => Rc::clone(n),
    }
}

fn self_recursive(name: &Option<N>, body: &[N]) -> bool {
    let Some(nm) = name.as_ref().and_then(|n| sym_str(n)) else { return false };
    fn rec(n: &N, nm: &str) -> bool {
        if matches!(&n.data, Data::Symbol { name, kind: SymKind::Ref, .. } if name == nm) {
            return true;
        }
        let mut hit = false;
        let _ = ast::map_children(n, &mut |c| {
            hit = hit || rec(c, nm);
            Rc::clone(c)
        });
        hit
    }
    body.iter().any(|s| rec(s, &nm))
}

fn chase_fixed(tw: &Tw, n: &N) -> N {
    let Data::Symbol { kind: SymKind::Ref, .. } = &n.data else { return Rc::clone(n) };
    let Some(id) = def_of(tw, n) else { return Rc::clone(n) };
    tw.table.defs[id].fixed.clone().unwrap_or_else(|| Rc::clone(n))
}

fn void0(span: &N) -> N {
    span_node(
        span,
        Data::Unary { op: "void".into(), expr: span_node(span, Data::Number { value: 0.0, raw: "0".into() }), prefix: true },
    )
}

fn num_node(value: f64) -> N {
    Node::new(Data::Number { value, raw: if value == 0.0 { "0".into() } else { String::new() } })
}

fn span_node(span: &N, data: Data) -> N {
    Rc::new(Node { start: span.start.clone(), end: span.end.clone(), data })
}

fn each_node(n: &N, f: &mut impl FnMut(&N)) {
    f(n);
    each_child(&n.data, |child| {
        each_node(child, f);
        false
    });
}

fn each_child(data: &Data, mut f: impl FnMut(&N) -> bool) -> bool {
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
        | Data::Dot { expr: body, .. }
        | Data::Chain { expr: body }
        | Data::Finally { body }
        | Data::Return { value: Some(body) } => go(body),
        Data::Yield { expr: Some(body), .. } | Data::Break { label: Some(body) } | Data::Continue { label: Some(body) } => go(body),
        Data::Binary { left, right, .. }
        | Data::Assign { left, right, .. }
        | Data::DefaultAssign { left, right } => {
            go(left);
            go(right);
        }
        Data::Seq { exprs } | Data::Array { elements: exprs } => {
            for e in exprs {
                go(e);
            }
        }
        Data::Call { expr, args, .. } => {
            go(expr);
            for a in args {
                go(a);
            }
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
        Data::If { cond, body, alt } => {
            go(cond);
            go(body);
            if let Some(alt) = alt {
                go(alt);
            }
        }
        Data::Func { name, args, body, .. } => {
            if let Some(name) = name {
                go(name);
            }
            for a in args {
                go(a);
            }
            for s in body {
                go(s);
            }
        }
        Data::Class { name, extends, props, .. } => {
            if let Some(name) = name {
                go(name);
            }
            if let Some(extends) = extends {
                go(extends);
            }
            for p in props {
                go(p);
            }
        }
        Data::Block { body } | Data::StaticBlock { body } | Data::Default { body } | Data::Toplevel { body } => {
            for s in body {
                go(s);
            }
        }
        Data::Object { props } => {
            for p in props {
                go(p);
            }
        }
        Data::Prop { key, value, .. } => {
            if let Key::Computed(e) = key {
                go(e);
            }
            go(value);
        }
        Data::VarDef { name, value } => {
            go(name);
            if let Some(value) = value {
                go(value);
            }
        }
        Data::Defs { defs, .. } => {
            for d in defs {
                go(d);
            }
        }
        Data::For { init, cond, step, body } => {
            if let Some(v) = init {
                go(v);
            }
            if let Some(v) = cond {
                go(v);
            }
            if let Some(v) = step {
                go(v);
            }
            go(body);
        }
        Data::While { cond, body } | Data::Do { body, cond } => {
            go(cond);
            go(body);
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            go(init);
            go(object);
            go(body);
        }
        Data::Switch { expr, body } => {
            go(expr);
            for s in body {
                go(s);
            }
        }
        Data::Case { expr, body } => {
            go(expr);
            for s in body {
                go(s);
            }
        }
        Data::Try { body, catch, finally } => {
            go(body);
            if let Some(v) = catch {
                go(v);
            }
            if let Some(v) = finally {
                go(v);
            }
        }
        Data::Catch { arg, body } => {
            if let Some(arg) = arg {
                go(arg);
            }
            go(body);
        }
        Data::Labeled { label, body } | Data::With { expr: label, body } => {
            go(label);
            go(body);
        }
        Data::Template { segments } => {
            for seg in segments {
                if let ast::Seg::Expr(e) = seg {
                    go(e);
                }
            }
        }
        Data::TaggedTemplate { tag, template } => {
            go(tag);
            go(template);
        }
        _ => {}
    }
    hit
}
