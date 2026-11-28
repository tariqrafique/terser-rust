//! Port of terser `lib/compress/tighten-body.js`.
//!
//! `collapse` (`tighten-body.js` `collapse`) walks a statement list from the
//! end. Each assignment, `var` initializer, or `++`/`--` is a candidate.
//! `find_stop` limits how far the value may move. The scanner then folds the
//! candidate into the first safe read.

use ast::{Data, DefKind, Key, Node, SymKind, N};
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

/// terser `tighten-body.js` `tighten_body` — `collapse` until the list settles.
/// Sequence joining, `if_return`, and `join_vars` already ran in `lib.rs`.
pub fn collapse(root: &N, unused: bool, toplevel_vars: bool) -> N {
    let locals = HashSet::new();
    let env = Env {
        unused,
        toplevel_vars,
        locals: &locals,
        declared: &locals,
        in_loop: false,
        in_try: false,
        in_fn: false,
        block_only: false,
    };
    walk(root, &env)
}

struct Env<'a> {
    unused: bool,
    toplevel_vars: bool,
    /// Bindings of the function being collapsed.
    locals: &'a HashSet<String>,
    /// Those bindings plus every enclosing function. A name outside this set is undeclared.
    declared: &'a HashSet<String>,
    in_loop: bool,
    in_try: bool,
    in_fn: bool,
    /// A nested block: only its own `let` / `const` are candidates.
    block_only: bool,
}

fn child_env<'a>(env: &Env<'a>, in_loop: bool, in_try: bool) -> Env<'a> {
    Env {
        unused: env.unused,
        toplevel_vars: env.toplevel_vars,
        locals: env.locals,
        declared: env.declared,
        in_loop,
        in_try,
        in_fn: env.in_fn,
        block_only: env.block_only,
    }
}

/// The candidates moved since the last call (`MOVED_WRITES`).
pub(crate) fn take_moved_writes() -> Vec<ast::NodeId> {
    MOVED_WRITES.with(|m| std::mem::take(&mut *m.borrow_mut()))
}

fn walk(n: &N, env: &Env<'_>) -> N {
    match &n.data {
        Data::Toplevel { body } => renode(
            n,
            Data::Toplevel {
                body: tighten_scope(body, env, &[], false),
            },
        ),
        Data::StaticBlock { body } => renode(
            n,
            Data::StaticBlock {
                body: tighten_scope(body, env, &[], true),
            },
        ),
        Data::Func {
            kind,
            name,
            args,
            body,
            async_,
            generator,
        } => renode(
            n,
            Data::Func {
                kind: *kind,
                name: name.clone(),
                args: args.clone(),
                body: tighten_scope(body, env, args, true),
                async_: *async_,
                generator: *generator,
            },
        ),
        // A block is its own `tighten_body`, but a `var` inside it is function-scoped.
        // Collapsing that `var` from the block alone misses reads after the block
        // (`for (b in ...) { var c = 3; x(c) } x(c)`). Nested functions still collapse.
        Data::Block { body } => renode(
            n,
            Data::Block {
                body: body.iter().map(|s| walk(s, env)).collect(),
            },
        ),
        Data::For {
            init,
            cond,
            step,
            body,
        } => {
            let loop_env = child_env(env, true, env.in_try);
            renode(
                n,
                Data::For {
                    init: init.as_ref().map(|v| walk(v, env)),
                    cond: cond.as_ref().map(|v| walk(v, env)),
                    step: step.as_ref().map(|v| walk(v, env)),
                    body: walk(body, &loop_env),
                },
            )
        }
        Data::While { cond, body } => {
            let loop_env = child_env(env, true, env.in_try);
            renode(
                n,
                Data::While {
                    cond: walk(cond, env),
                    body: walk(body, &loop_env),
                },
            )
        }
        Data::Do { body, cond } => {
            let loop_env = child_env(env, true, env.in_try);
            renode(
                n,
                Data::Do {
                    body: walk(body, &loop_env),
                    cond: walk(cond, env),
                },
            )
        }
        Data::ForIn { init, object, body } => {
            let loop_env = child_env(env, true, env.in_try);
            renode(
                n,
                Data::ForIn {
                    init: walk(init, env),
                    object: walk(object, env),
                    body: walk(body, &loop_env),
                },
            )
        }
        Data::ForOf {
            init,
            object,
            body,
            await_,
        } => {
            let loop_env = child_env(env, true, env.in_try);
            renode(
                n,
                Data::ForOf {
                    init: walk(init, env),
                    object: walk(object, env),
                    body: walk(body, &loop_env),
                    await_: *await_,
                },
            )
        }
        Data::Try {
            body,
            catch,
            finally,
        } => {
            let tried = child_env(env, env.in_loop, true);
            renode(
                n,
                Data::Try {
                    body: walk(body, &tried),
                    catch: catch.as_ref().map(|c| walk(c, env)),
                    finally: finally.as_ref().map(|f| walk(f, env)),
                },
            )
        }
        other => map_walk(n, other, env),
    }
}

/// Statement list of a function, toplevel, static block, or block.
fn tighten_scope(stmts: &[N], env: &Env<'_>, params: &[N], in_fn: bool) -> Vec<N> {
    let mut locals = HashSet::new();
    for param in params {
        if let Some(name) = sym_name(param) {
            locals.insert(name.to_string());
        }
    }
    collect_locals(stmts, &mut locals);
    let mut declared = env.declared.clone();
    declared.extend(locals.iter().cloned());
    let child = Env {
        unused: env.unused,
        toplevel_vars: env.toplevel_vars,
        locals: &locals,
        declared: &declared,
        in_loop: false,
        in_try: false,
        in_fn,
        block_only: false,
    };
    let stmts: Vec<N> = stmts.iter().map(|s| walk(s, &child)).collect();
    let stmts = collapse_list(stmts, &child);
    if env.unused && in_fn {
        drop_unmentioned(&stmts)
    } else {
        stmts
    }
}

/// One `collapse` step for `body.rs` `tighten_body`, on the body of a function,
/// toplevel, or static block. `scopes` is the bindings of each enclosing scope,
/// outermost first; the last is this body's own (params included).
#[allow(clippy::too_many_arguments)]
pub(crate) fn collapse_step(stmts: Vec<N>, unused: bool, toplevel_vars: bool, locals: &HashSet<String>, declared: &HashSet<String>, in_fn: bool, phantom: &HashMap<String, usize>, block: Option<(bool, bool)>) -> (Vec<N>, bool) {
    let (in_loop, in_try, block_only) = match block {
        Some((l, t)) => (l, t, true),
        None => (false, false, false),
    };
    let env = Env { unused, toplevel_vars, locals, declared, in_loop, in_try, in_fn, block_only };
    PHANTOM.with(|p| *p.borrow_mut() = phantom.clone());
    let out = collapse_statements(stmts, &env);
    PHANTOM.with(|p| p.borrow_mut().clear());
    out
}

thread_local! {
    /// Assignments and prefix updates a collapse moved to their use (terser
    /// `clear_flag(candidate, WRITE_ONLY)`); the caller clears their flags.
    static MOVED_WRITES: std::cell::RefCell<Vec<ast::NodeId>> = Default::default();
    static PHANTOM: std::cell::RefCell<HashMap<String, usize>> = Default::default();
    /// `let` / `const` names of the enclosing function: terser `get_lhs`
    /// never takes an assignment to one.
    static BLOCK_LETS: std::cell::RefCell<HashSet<String>> = Default::default();
    /// Names `flatten_fn` injected, with terser's reference count for them.
    static INJECTED: std::cell::RefCell<HashMap<String, usize>> = Default::default();
    /// A nested block's own `let` / `const`: its only collapse candidates.
    static BLOCK_CANDS: std::cell::RefCell<HashSet<String>> = Default::default();
    /// See `set_foreign_shadow`.
    static FOREIGN_SHADOW: std::cell::RefCell<HashSet<String>> = Default::default();
    /// Function-expression names visible here (terser `is_lhs_read_only`).
    static LAMBDAS: std::cell::RefCell<HashSet<String>> = Default::default();
    /// Names visible here whose only declaration is a `function` statement.
    static DEFUNS: std::cell::RefCell<HashSet<String>> = Default::default();
    /// Assignment and `++` / `--` targets (by node) that resolve to a `let` / `const`
    /// in any enclosing scope: terser `get_lhs` `is_ref_of` gives no lhs for them.
    static LEXICAL_TARGETS: std::cell::RefCell<HashSet<usize>> = Default::default();
    /// terser `def.references.length - def.replaced` by declaration name node
    /// (`usize::MAX` when the name is not in `def.orig`).
    static REFERENCED: std::cell::RefCell<HashMap<usize, usize>> = Default::default();
    /// terser `def.orig.length` by declaration name node.
    static ORIG: std::cell::RefCell<HashMap<usize, usize>> = Default::default();
    /// See `set_spread_refs`.
    static SPREAD_REFS: std::cell::RefCell<HashMap<usize, usize>> = Default::default();
    /// See `set_spread_refs`.
    static TARGET_REFS: std::cell::RefCell<HashMap<usize, usize>> = Default::default();
    /// See `set_prop_writable`.
    static PROP_WRITABLE: std::cell::RefCell<HashSet<usize>> = Default::default();
    /// See `set_safe_receivers`.
    static SAFE_RECEIVERS: std::cell::RefCell<HashSet<usize>> = Default::default();
    /// See `set_table_escaped`.
    static TABLE_ESCAPED: std::cell::RefCell<HashSet<String>> = Default::default();
    /// See `set_visible`.
    static VISIBLE: std::cell::RefCell<Option<HashSet<String>>> = Default::default();
    /// See `set_declared_refs`.
    static DECLARED_REFS: std::cell::RefCell<HashMap<usize, bool>> = Default::default();
}

/// terser `AST_SymbolRef.is_declared` for the references the symbol table
/// knows, by node: `false` for a global. The name sets answer for the others.
pub(crate) fn set_declared_refs(map: HashMap<usize, bool>) {
    DECLARED_REFS.with(|d| *d.borrow_mut() = map);
}

/// terser `get_lhs` `is_ref_of(lhs, AST_SymbolLet)` (and `Const`, `Using`) by
/// name, for a target the symbol table does not know: `block_names` holds
/// every `let` / `const` here and in nested blocks and functions. A target
/// the table knows is answered by its definition (`lexical_target`).
fn lexical_by_name(n: &N, name: &str, block_names: &HashSet<String>) -> bool {
    block_names.contains(name) && !DECLARED_REFS.with(|d| d.borrow().contains_key(&ptr(n)))
}

/// Whether the reference `n` (named `name`) is declared: its definition when
/// the table has one, else a binding of the name in `declared`. An empty set
/// is `lhs_bad`'s query with no bindings at all and stays by name.
fn is_declared(n: &N, name: &str, declared: &HashSet<String>) -> bool {
    if declared.is_empty() {
        return false;
    }
    DECLARED_REFS.with(|d| d.borrow().get(&ptr(n)).copied()).unwrap_or_else(|| declared.contains(name))
}

/// Names `find_variable` reaches from the scope being collapsed (terser
/// `shadows`' `nearest_scope` and its `parent_scope` chain), from the symbol
/// table. `None` without one: the name sets stand in.
pub(crate) fn set_visible(set: Option<HashSet<String>>) {
    VISIBLE.with(|d| *d.borrow_mut() = set);
}

pub(crate) fn set_injected(map: HashMap<String, usize>) {
    INJECTED.with(|d| *d.borrow_mut() = map);
}

pub(crate) fn set_lexical_targets(set: HashSet<usize>) {
    LEXICAL_TARGETS.with(|d| *d.borrow_mut() = set);
}

fn lexical_target(n: &N) -> bool {
    LEXICAL_TARGETS.with(|d| d.borrow().contains(&ptr(n)))
}

pub(crate) fn set_block_lets(set: HashSet<String>) {
    BLOCK_LETS.with(|d| *d.borrow_mut() = set);
}

/// `let` / `const` names declared anywhere in `body`, outside nested functions.
pub(crate) fn lexical_names_deep(body: &[N]) -> HashSet<String> {
    fn rec(n: &N, out: &mut HashSet<String>) {
        match &n.data {
            Data::Func { .. } | Data::Class { .. } => {}
            Data::Defs { kind: DefKind::Let | DefKind::Const | DefKind::Using, defs, .. } => {
                for d in defs {
                    if let Data::VarDef { name, .. } = &d.data {
                        let mut tmp = Vec::new();
                        tmp.push(Rc::clone(name));
                        let names = scope_bindings(&tmp, &[]);
                        out.extend(names);
                    }
                }
            }
            _ => {
                ast::walk_children(n, &mut |c| rec(c, out));
            }
        }
    }
    let mut out = HashSet::new();
    for s in body {
        rec(s, &mut out);
    }
    out
}

/// Names the lambda being tightened binds that its enclosing scopes also
/// declare (`Cx.foreign_lambda`): terser's `shadows` looks them up from the
/// enclosing scope and finds another definition.
pub(crate) fn set_foreign_shadow(set: HashSet<String>) {
    FOREIGN_SHADOW.with(|d| *d.borrow_mut() = set);
}

/// Every name bound in `n`: parameters, declarations and function names, in
/// nested functions too.
pub(crate) fn bindings_deep(n: &N, out: &mut HashSet<String>) {
    if let Data::Func { name, args, body, .. } = &n.data {
        if let Some(nm) = name.as_ref().and_then(sym_name) {
            out.insert(nm.to_string());
        }
        out.extend(scope_bindings(args, body));
    }
    if let Data::Catch { arg: Some(arg), .. } = &n.data {
        out.extend(scope_bindings(std::slice::from_ref(arg), &[]));
    }
    ast::walk_children(n, &mut |c| bindings_deep(c, out));
}

pub(crate) fn set_block_candidates(set: HashSet<String>) {
    BLOCK_CANDS.with(|d| *d.borrow_mut() = set);
}

pub(crate) fn set_lambdas(set: HashSet<String>) {
    LAMBDAS.with(|d| *d.borrow_mut() = set);
}

pub(crate) fn set_defuns(set: HashSet<String>) {
    DEFUNS.with(|d| *d.borrow_mut() = set);
}

/// `function` statement names in a body that nothing else declares there.
pub(crate) fn defun_names(params: &[N], body: &[N]) -> (HashSet<String>, HashSet<String>) {
    // `export function f` is an `AST_SymbolDefun` too.
    fn defun(s: &N) -> Option<&N> {
        match &s.data {
            Data::Func { kind: ast::FuncKind::Decl, .. } => Some(s),
            Data::Export { definition: Some(d), .. } if matches!(d.data, Data::Func { kind: ast::FuncKind::Decl, .. }) => Some(d),
            _ => None,
        }
    }
    let mut defuns = HashSet::new();
    for s in body {
        if let Some(Data::Func { name: Some(nm), .. }) = defun(s).map(|d| &d.data) {
            if let Some(n) = sym_name(nm) {
                defuns.insert(n.to_string());
            }
        }
    }
    let mut others = HashSet::new();
    let without: Vec<N> = body.iter().filter(|s| defun(s).is_none()).cloned().collect();
    let bound = scope_bindings(params, &without);
    for n in &defuns {
        if bound.contains(n) {
            others.insert(n.clone());
        }
    }
    (defuns, others)
}

/// `def.references.length` of each spread symbol (`...x`), by node.
/// And `def.references.length - def.replaced` of each assignment or `++` / `--` target.
pub(crate) fn set_spread_refs(map: HashMap<usize, usize>, targets: HashMap<usize, usize>) {
    SPREAD_REFS.with(|s| *s.borrow_mut() = map);
    TARGET_REFS.with(|s| *s.borrow_mut() = targets);
}

/// Property access targets of an assignment or `++` / `--` that terser's
/// `is_lhs_read_only` lets through, by node.
pub(crate) fn set_prop_writable(set: HashSet<usize>) {
    PROP_WRITABLE.with(|s| *s.borrow_mut() = set);
}

/// Symbols read as a property access's object that terser's
/// `may_throw_on_access` clears (a value known not to be nullish), by node.
pub(crate) fn set_safe_receivers(set: HashSet<usize>) {
    SAFE_RECEIVERS.with(|s| *s.borrow_mut() = set);
}

/// Names of the defun scope with a reference bound in another defun scope
/// (terser `may_modify`'s `def.references.some(...)`), from the symbol table:
/// a reference an optimizer moved out of an inner function still counts.
pub(crate) fn set_table_escaped(set: HashSet<String>) {
    TABLE_ESCAPED.with(|t| *t.borrow_mut() = set);
}

pub(crate) fn set_referenced(map: HashMap<usize, usize>, orig: HashMap<usize, usize>) {
    REFERENCED.with(|r| *r.borrow_mut() = map);
    ORIG.with(|r| *r.borrow_mut() = orig);
}

/// Bindings of a function (params and hoisted names) or a toplevel body.
pub(crate) fn scope_bindings(params: &[N], body: &[N]) -> HashSet<String> {
    let mut locals = HashSet::new();
    fn pattern(n: &N, out: &mut HashSet<String>) {
        match &n.data {
            Data::Symbol { name, .. } => {
                out.insert(name.clone());
            }
            Data::Destructuring { names, .. } => names.iter().for_each(|x| pattern(x, out)),
            Data::DefaultAssign { left, .. } | Data::Spread { expr: left } => pattern(left, out),
            Data::Prop { value, .. } => pattern(value, out),
            _ => {}
        }
    }
    for param in params {
        pattern(param, &mut locals);
    }
    collect_locals(body, &mut locals);
    locals
}

/// `let` / `const` / class names declared directly in a block, destructured ones included.
pub(crate) fn block_lexicals(stmts: &[N]) -> HashSet<String> {
    let mut out = HashSet::new();
    for s in stmts {
        if let Data::Defs { kind: DefKind::Let | DefKind::Const, defs, .. } = &s.data {
            for d in defs {
                if let Data::VarDef { name, .. } = &d.data {
                    out.extend(scope_bindings(std::slice::from_ref(name), &[]));
                }
            }
        }
    }
    out
}

pub(crate) fn drop_unmentioned_in(stmts: &[N]) -> Vec<N> {
    drop_unmentioned(stmts)
}

fn collapse_list(mut stmts: Vec<N>, env: &Env<'_>) -> Vec<N> {
    // terser `tighten_body`: `do { collapse } while (CHANGED && max_iter-- > 0)`
    for _ in 0..10 {
        let (next, changed) = collapse_statements(stmts, env);
        stmts = next;
        if !changed {
            break;
        }
    }
    stmts
}

fn drop_unmentioned(stmts: &[N]) -> Vec<N> {
    let used = names_used(stmts);
    stmts
        .iter()
        .filter_map(|stmt| match &stmt.data {
            Data::Defs { kind, defs, await_ } => {
                let defs: Vec<N> = defs
                    .iter()
                    .filter(|d| match &d.data {
                        Data::VarDef { name, value } => {
                            let Some(sym) = sym_name(name) else {
                                return true;
                            };
                            used.contains(sym) || value.as_ref().is_some_and(has_side_effects)
                        }
                        _ => true,
                    })
                    .cloned()
                    .collect();
                if defs.is_empty() {
                    None
                } else {
                    Some(renode(
                        stmt,
                        Data::Defs {
                            kind: *kind,
                            defs,
                            await_: *await_,
                        },
                    ))
                }
            }
            _ => Some(Rc::clone(stmt)),
        })
        .collect()
}

fn names_used(stmts: &[N]) -> HashSet<String> {
    // Every reference anywhere below, nested functions included (`ast::walk_children`
    // reaches every node kind, object literals and templates too).
    fn rec(n: &N, used: &mut HashSet<String>) {
        if let Some(name) = ref_name(n) {
            used.insert(name.to_string());
        }
        ast::walk_children(n, &mut |c| rec(c, used));
    }
    let mut used = HashSet::new();
    for stmt in stmts {
        rec(stmt, &mut used);
    }
    used
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Kind {
    Assign,
    Var,
    Post,
    Pre,
    /// An IIFE parameter (`extract_args`), a `var` definition whose name is the funarg.
    Arg,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Mode {
    /// Single remaining reference: substitute the value (`maintain_this_binding`).
    ValueOne,
    /// `mangleable_var`: substitute the symbol at every read.
    ValueAll,
    /// Move the assignment (or a prefix update) to the first read.
    Move,
}

struct Cand {
    path: Vec<usize>,
    kind: Kind,
    name: String,
    value: N,
    node: N,
    op: String,
    /// An IIFE parameter (terser `extract_args`).
    arg: Option<ArgCand>,
    /// A property access lhs (`o.p = v`, `++o[k]`): `name` is its root symbol.
    prop: Option<N>,
}

/// terser `extract_args` candidate: `var <param> = <argument>` made up for an
/// IIFE's parameter. `slot` is the parameter's index (`None`: the rest
/// parameter, whose value is an array of the remaining arguments). `scan` is
/// terser's `args` from `argnames.lastIndexOf(candidate.name) + 1`: the later
/// parameters' definitions and the extra arguments, scanned (never replaced
/// into) before the body.
struct ArgCand {
    slot: Option<usize>,
    /// The parameter's index in `argnames`.
    param: usize,
    scan: Vec<N>,
}

/// terser collapse `extract_args`: the call whose callee's body is collapsed,
/// set by `body.rs` `tighten_body` for a function expression with no name,
/// no `arguments` and no `eval` / `with` that is called directly
/// (`compressor.parent()` an `AST_Call` whose `expression` is the function)
/// with injectable arguments, when `unused` is on.
pub(crate) struct Iife {
    /// The call's id (`Cx.iife_args`).
    pub call: ast::NodeId,
    /// `iife.args`, edited by `remove_candidate`.
    pub args: Vec<N>,
    /// Per argument: `has_overlapping_symbol(fn, arg, fn_strict)`, or a
    /// pinned lambda. A replaced argument (`0`) has none.
    pub overlap: Vec<bool>,
    /// `fn.argnames`.
    pub params: Vec<N>,
    /// Per parameter: `def.orig.length > 1` (`is_reassigned`).
    pub reassigned: Vec<bool>,
    /// Per parameter: `def.references.length - def.replaced`, when the symbol table has
    /// it; `usize::MAX` when the name is not in `def.orig` (a `clone(true)` copy).
    pub referenced: Vec<Option<usize>>,
    pub changed: bool,
}

thread_local! {
    static IIFE: std::cell::RefCell<Option<Iife>> = const { std::cell::RefCell::new(None) };
}

pub(crate) fn set_iife(iife: Option<Iife>) {
    IIFE.with(|i| *i.borrow_mut() = iife);
}

pub(crate) fn take_iife() -> Option<Iife> {
    IIFE.with(|i| i.borrow_mut().take())
}

/// terser `extract_args`. Its candidates go before the first statement's
/// (`candidates.unshift`), the first parameter first.
fn extract_args() -> Vec<Cand> {
    IIFE.with(|i| {
        let i = i.borrow();
        let Some(iife) = i.as_ref() else { return Vec::new() };
        let len = iife.params.len();
        // terser `args`: `var` definitions of the parameters (not one declared
        // again), then the arguments past the last parameter.
        let mut defs: Vec<(usize, N)> = Vec::new();
        let mut made: Vec<(Option<usize>, usize, N, String, N)> = Vec::new();
        let mut names: HashSet<Option<String>> = HashSet::new();
        for i in (0..len).rev() {
            let sym = &iife.params[i];
            let arg = iife.args.get(i);
            if iife.reassigned[i] {
                continue;
            }
            defs.push((i, node(sym, Data::VarDef { name: Rc::clone(sym), value: arg.cloned() })));
            if !names.insert(sym_name(sym).map(str::to_string)) {
                continue;
            }
            match &sym.data {
                Data::Spread { expr } => {
                    let Some(name) = sym_name(expr) else { continue };
                    if (i..iife.args.len()).all(|k| !iife.overlap[k]) {
                        let elements = iife.args.get(i..).map(<[N]>::to_vec).unwrap_or_default();
                        let value = node(sym, Data::Array { elements });
                        let def = node(sym, Data::VarDef { name: Rc::clone(expr), value: Some(Rc::clone(&value)) });
                        made.push((None, i, def, name.to_string(), value));
                    }
                }
                Data::Symbol { name, .. } => {
                    let value = match arg {
                        None => void0(sym),
                        Some(_) if iife.overlap[i] => continue,
                        Some(a) => Rc::clone(a),
                    };
                    let def = node(sym, Data::VarDef { name: Rc::clone(sym), value: Some(Rc::clone(&value)) });
                    made.push((Some(i), i, def, name.clone(), value));
                }
                // A destructuring or defaulted parameter: `get_lhs` gives no lhs.
                _ => {}
            }
        }
        defs.reverse();
        let mut args: Vec<N> = defs.iter().map(|(_, d)| Rc::clone(d)).collect();
        args.extend(iife.args.iter().skip(len).cloned());
        made.reverse();
        made.into_iter()
            .map(|(slot, i, def, name, value)| {
                // `argnames.lastIndexOf(candidate.name) + 1`: the rest parameter's
                // name is not in `argnames`, so its scan starts at 0.
                let from = if slot.is_some() { i + 1 } else { 0 };
                Cand {
                    path: Vec::new(),
                    kind: Kind::Arg,
                    name,
                    value,
                    node: def,
                    op: "=".into(),
                    arg: Some(ArgCand { slot, param: i, scan: args.get(from..).map(<[N]>::to_vec).unwrap_or_default() }),
                    prop: None,
                }
            })
            .collect()
    })
}

/// terser `tighten-body.js` `collapse`.
fn collapse_statements(mut stmts: Vec<N>, env: &Env<'_>) -> (Vec<N>, bool) {
    let block_names = block_scoped_names(&stmts);
    let escaped = escaped_names(&stmts);
    let mut counts = Counts::new(&stmts);
    let mut changed = false;
    let mut guard = 0;
    let mut index = stmts.len();
    // Trace: a candidate retried after a restart with the same outcome is not reported again
    // (terser does not restart; it goes on to the earlier statements).
    let mut traced: HashSet<String> = HashSet::new();
    while index > 0 && guard < 400 {
        index -= 1;
        // terser `extract_candidates`, then `candidates.pop()` so the last one runs first.
        let mut candidates = extract_candidates(&stmts[index], env, &block_names);
        // terser `if (stat_index == 0 && compressor.option("unused")) extract_args();`
        if index == 0 && env.unused {
            let mut args = extract_args();
            args.append(&mut candidates);
            candidates = args;
        }
        let mut restarted = false;
        while let Some(cand) = candidates.pop() {
            let mut info = CandTrace::default();
            let next = apply_candidate(&stmts, index, &cand, env, &escaped, &counts, &mut info);
            if crate::trace::on() {
                info.emit(&cand, next.is_some(), &mut traced);
            }
            if let Some(next) = next {
                stmts = next;
                counts = Counts::new(&stmts);
                changed = true;
                guard += 1;
                index = stmts.len();
                restarted = true;
                break;
            }
        }
        if restarted {
            continue;
        }
    }
    (stmts, changed)
}

/// terser `tighten-body.js` `extract_candidates`.
fn extract_candidates(n: &N, env: &Env<'_>, block_names: &HashSet<String>) -> Vec<Cand> {
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn rec(
        n: &N,
        path: &mut Vec<usize>,
        out: &mut Vec<Cand>,
        env: &Env<'_>,
        block_names: &HashSet<String>,
    ) {
        path.push(ptr(n));
        match &n.data {
            Data::Assign {
                left,
                right,
                logical,
                op,
            } => {
                if !*logical && !matches!(right.data, Data::Chain { .. }) {
                    if let Some(name) = ref_name(left) {
                        // terser `get_lhs`: `let` / `const` / `using` are not collapsed.
                        // A free or global target is left for `may_modify`.
                        // A `var` `flatten_fn` injected is a local too (still pending here).
                        let injected = env.block_only && INJECTED.with(|i| i.borrow().contains_key(name));
                        // terser `get_lhs` takes any declared symbol (a free one has
                        // side effects and is skipped).
                        let read_only = LAMBDAS.with(|l| l.borrow().contains(name));
                        if !lexical_by_name(left, name, block_names) && !read_only && !lexical_target(left) && (env.locals.contains(name) || is_declared(left, name, env.declared) || injected) {
                            out.push(Cand {
                                path: path.clone(),
                                kind: Kind::Assign,
                                name: name.to_string(),
                                value: Rc::clone(right),
                                node: Rc::clone(n),
                                op: op.clone(),
                                arg: None,
                                prop: None,
                            });
                        }
                    } else if let Some(root) = prop_lhs(left, env.declared) {
                        out.push(Cand {
                            path: path.clone(),
                            kind: Kind::Assign,
                            name: root.to_string(),
                            value: Rc::clone(right),
                            node: Rc::clone(n),
                            op: op.clone(),
                            arg: None,
                            prop: Some(Rc::clone(left)),
                        });
                    }
                }
                rec(right, path, out, env, block_names);
            }
            Data::VarDef {
                name,
                value: Some(value),
            } => {
                if !matches!(value.data, Data::Chain { .. }) {
                    if let Some(sym) = sym_name(name) {
                        if matches!(
                            name.data,
                            Data::Symbol {
                                kind: SymKind::Var
                                    | SymKind::Let
                                    | SymKind::Const
                                    | SymKind::Funarg,
                                ..
                            }
                        ) {
                            out.push(Cand {
                                path: path.clone(),
                                kind: Kind::Var,
                                name: sym.to_string(),
                                value: Rc::clone(value),
                                node: Rc::clone(n),
                                op: "=".into(),
                                arg: None,
                                prop: None,
                            });
                        }
                    }
                }
                rec(value, path, out, env, block_names);
            }
            Data::Binary { left, right, .. } => {
                rec(left, path, out, env, block_names);
                rec(right, path, out, env, block_names);
            }
            Data::Call { expr, args, .. } => {
                rec(expr, path, out, env, block_names);
                for a in args {
                    rec(a, path, out, env, block_names);
                }
            }
            Data::Case { expr, .. } => rec(expr, path, out, env, block_names),
            Data::Cond { cond, cons, alt } => {
                rec(cond, path, out, env, block_names);
                rec(cons, path, out, env, block_names);
                rec(alt, path, out, env, block_names);
            }
            Data::Defs { defs, .. } => {
                let start = defs.len().saturating_sub(200);
                for d in &defs[start..] {
                    rec(d, path, out, env, block_names);
                }
            }
            Data::While { cond, body } | Data::Do { body, cond } => {
                rec(cond, path, out, env, block_names);
                if !matches!(body.data, Data::Block { .. }) {
                    rec(body, path, out, env, block_names);
                }
            }
            Data::Return { value: Some(v) } | Data::Throw { value: v } => {
                rec(v, path, out, env, block_names)
            }
            Data::For {
                init,
                cond,
                step,
                body,
            } => {
                if let Some(init) = init {
                    rec(init, path, out, env, block_names);
                }
                if let Some(cond) = cond {
                    rec(cond, path, out, env, block_names);
                }
                if let Some(step) = step {
                    rec(step, path, out, env, block_names);
                }
                if !matches!(body.data, Data::Block { .. }) {
                    rec(body, path, out, env, block_names);
                }
            }
            Data::ForIn { object, body, .. } | Data::ForOf { object, body, .. } => {
                rec(object, path, out, env, block_names);
                if !matches!(body.data, Data::Block { .. }) {
                    rec(body, path, out, env, block_names);
                }
            }
            Data::If { cond, body, alt } => {
                rec(cond, path, out, env, block_names);
                if !matches!(body.data, Data::Block { .. }) {
                    rec(body, path, out, env, block_names);
                }
                if let Some(alt) = alt {
                    if !matches!(alt.data, Data::Block { .. }) {
                        rec(alt, path, out, env, block_names);
                    }
                }
            }
            Data::Seq { exprs } => {
                for e in exprs {
                    rec(e, path, out, env, block_names);
                }
            }
            Data::Simple { body } => rec(body, path, out, env, block_names),
            Data::Switch { expr, body } => {
                rec(expr, path, out, env, block_names);
                for s in body {
                    rec(s, path, out, env, block_names);
                }
            }
            Data::Unary { op, expr, prefix } if op == "++" || op == "--" => {
                if let Some(name) = ref_name(expr) {
                    // terser `get_lhs` takes the operand unless it is a `let` / `const`;
                    // an undeclared one has side effects and is skipped.
                    let injected = env.block_only && INJECTED.with(|i| i.borrow().contains_key(name));
                    let read_only = LAMBDAS.with(|l| l.borrow().contains(name));
                    if !lexical_by_name(expr, name, block_names) && !read_only && !lexical_target(expr) && (env.locals.contains(name) || is_declared(expr, name, env.declared) || injected) {
                        out.push(Cand {
                            path: path.clone(),
                            kind: if *prefix { Kind::Pre } else { Kind::Post },
                            name: name.to_string(),
                            value: Rc::clone(expr),
                            node: Rc::clone(n),
                            op: op.clone(),
                            arg: None,
                            prop: None,
                        });
                    }
                } else if let Some(root) = prop_lhs(expr, env.declared) {
                    out.push(Cand {
                        path: path.clone(),
                        kind: if *prefix { Kind::Pre } else { Kind::Post },
                        name: root.to_string(),
                        value: Rc::clone(expr),
                        node: Rc::clone(n),
                        op: op.clone(),
                        arg: None,
                        prop: Some(Rc::clone(expr)),
                    });
                }
            }
            // terser `extract_candidates` does not enter property access,
            // `await`, spread or optional chains.
            _ => {}
        }
        path.pop();
    }
    rec(n, &mut path, &mut out, env, block_names);
    out
}

/// terser `get_lhs` for a property access target: an lhs unless it has side
/// effects or `is_lhs_read_only` (its object's value is unknown, `this`, or a
/// constant; `PROP_WRITABLE`). The root symbol's name, for `is_lhs_local`.
fn prop_lhs<'a>(n: &'a N, declared: &HashSet<String>) -> Option<&'a str> {
    if !matches!(n.data, Data::Dot { optional: false, .. } | Data::Sub { optional: false, .. }) {
        return None;
    }
    if expr_effects(n, declared) || !PROP_WRITABLE.with(|w| w.borrow().contains(&ptr(n))) {
        return None;
    }
    let mut root = n;
    while let Data::Dot { expr, .. } | Data::Sub { expr, .. } = &root.data {
        root = expr;
    }
    ref_name(root)
}

fn lhs_bad(n: &N) -> bool {
    match &n.data {
        Data::Dot { expr, .. } | Data::Sub { expr, .. } | Data::Chain { expr } => {
            expr_effects(n, &HashSet::new()) || lhs_bad(expr)
        }
        _ => false,
    }
}

/// terser `lhs.equivalent_to(node)` for the candidate's lhs.
fn lhs_equivalent(cand: &Cand, n: &N) -> bool {
    match &cand.prop {
        Some(prop) => equivalent(prop, n),
        None => ref_name(n) == Some(cand.name.as_str()),
    }
}

/// terser `equivalent-to.js` `equivalent_to` for the nodes a property access
/// lhs is made of (symbols, property accesses and constants).
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
        (Data::Number { value: v1, .. }, Data::Number { value: v2, .. }) => v1.to_bits() == v2.to_bits(),
        (Data::String { value: s1, .. }, Data::String { value: s2, .. }) => s1 == s2,
        (Data::BigInt { value: v1 }, Data::BigInt { value: v2 }) => v1 == v2,
        (Data::True, Data::True) | (Data::False, Data::False) | (Data::Null, Data::Null) | (Data::This, Data::This) => true,
        _ => false,
    }
}

/// The symbol an assignment or `++` / `--` candidate writes.
fn cand_target(cand: &Cand) -> &N {
    match &cand.node.data {
        Data::Assign { left, .. } => left,
        _ => &cand.value,
    }
}

/// What `apply_candidate` decided, for the `collapse` trace event (terser's
/// `get_lhs` result, `abort`, `replaced`, `value_def`).
#[derive(Default)]
struct CandTrace {
    /// Set when the candidate is dropped before its scan (terser `get_lhs` gives no lhs).
    skip: Option<&'static str>,
    /// Dropped before the scan for a reason of the port's own.
    port_skip: Option<&'static str>,
    abort: bool,
    replaced: usize,
    value_def: bool,
}

impl CandTrace {
    fn emit(&self, cand: &Cand, applied: bool, seen: &mut HashSet<String>) {
        let code = crate::trace::code(&cand.node);
        let replaced = if applied { self.replaced } else { 0 };
        if !applied {
            let key = format!("{code}\u{0}{:?}{:?}{}", self.skip, self.port_skip, self.value_def);
            if !seen.insert(key) {
                return;
            }
        }
        use crate::trace::trace;
        match (self.skip, self.port_skip) {
            (Some(why), _) => trace!("collapse", cand = code, ok = false, why = why),
            (None, Some(why)) => trace!("collapse", cand = code, ok = true, abort = false, replaced = 0, value_def = self.value_def, why = why),
            (None, None) => trace!("collapse", cand = code, ok = true, abort = self.abort, replaced = replaced, value_def = self.value_def),
        }
    }
}

#[allow(clippy::too_many_arguments)]
fn apply_candidate(
    stmts: &[N],
    index: usize,
    cand: &Cand,
    env: &Env<'_>,
    escaped: &HashSet<String>,
    counts: &Counts,
    info: &mut CandTrace,
) -> Option<Vec<N>> {
    // In a nested block: the block's own `let` / `const`, or an assignment
    // to a function local that is moved (never dropped: reads after the
    // block are not counted here).
    // A `var` `flatten_fn` injected is already in the scope body in terser
    // (`scope.body.splice`), though here it is still pending.
    // Only in a nested block: at function level terser's timing differs
    // (`functions/issue_2657` keeps `o=n,o||o()`).
    let injected_name = env.block_only && INJECTED.with(|i| i.borrow().contains_key(&cand.name));
    let block_assign = env.block_only
        && matches!(cand.kind, Kind::Assign | Kind::Pre | Kind::Post)
        && (cand.prop.is_some() || env.locals.contains(&cand.name) || injected_name || is_declared(cand_target(cand), &cand.name, env.declared))
        && !BLOCK_CANDS.with(|b| b.borrow().contains(&cand.name))
        && !BLOCK_LETS.with(|b| b.borrow().contains(&cand.name));
    // terser `get_lhs`: no references, nothing to fold.
    let (reads, writes, hidden) = counts.refs.get(&cand.name).copied().unwrap_or((0, 0, 0));
    let total = reads + writes + hidden;
    // terser `get_lhs`: `declared = def.orig.length - def.eliminated`. The
    // symbol table's `orig` counts parameters and function names too; a
    // declaration `drop_unused` eliminated is gone from the tree.
    let tree_declared = counts.decls.get(&cand.name).copied().unwrap_or(0);
    let declared = match &cand.node.data {
        Data::VarDef { name, .. } if cand.kind == Kind::Var => ORIG.with(|o| o.borrow().get(&ptr(name)).copied()).unwrap_or(tree_declared),
        _ => tree_declared,
    };
    // A `var` in a nested block: the block's counts are the function's when
    // reduce_vars' reference count for it matches what the block holds.
    // A name declared more than once is an lhs whatever its counts (terser
    // `declared > 1`); the replacement then needs terser's `referenced`.
    let block_var = env.block_only
        && cand.kind == Kind::Var
        && matches!(&cand.node.data, Data::VarDef { name, .. }
            if declared > 1 || REFERENCED.with(|r| r.borrow().get(&ptr(name)).copied()) == Some(total))
        && !BLOCK_LETS.with(|b| b.borrow().contains(&cand.name));
    if env.block_only && !block_assign && !block_var && !(cand.kind == Kind::Var && BLOCK_CANDS.with(|b| b.borrow().contains(&cand.name))) {
        info.port_skip = Some("block");
        return None;
    }
    // A property access lhs has no reference count (terser `get_lhs` returns it).
    if total == 0 && cand.prop.is_none() {
        info.skip = Some("no_lhs");
        return None;
    }
    // terser `get_lhs` reads `referenced` from `reduce_vars`, which still
    // counts references later merged away (an `if` / `else` folded into one
    // assignment).
    if cand.kind == Kind::Var {
        if let Data::VarDef { name, .. } = &cand.node.data {
            let stale = REFERENCED.with(|r| r.borrow().get(&ptr(name)).copied());
            // terser `if (!member(expr.name, def.orig)) return;`
            if stale == Some(usize::MAX) {
                info.skip = Some("no_lhs");
                return None;
            }
            if stale == Some(usize::MAX - 1) {
                info.skip = Some("read_only");
                return None;
            }
            if let Some(referenced) = stale {
                if declared <= 1 && referenced > total && referenced > 1 && !is_mangleable(&cand.value, &cand.name, env) {
                    info.skip = Some("no_lhs");
                    return None;
                }
            }
        }
    }
    // terser `compressor.exposed(def)`: a global without `toplevel`. A nested block's
    // own `let` / `const` is defined on the block scope, never global.
    let block_lexical = env.block_only && matches!(sym_kind(&cand.node), Some(SymKind::Let | SymKind::Const));
    let exposed = cand.kind == Kind::Var && !env.in_fn && !env.toplevel_vars && !block_lexical;
    // An IIFE parameter: terser `get_lhs` on a `var` whose name is a funarg
    // (`declared > 1` does not apply), with the parameter's `referenced`.
    let arg_referenced = cand.arg.as_ref().map(|a| IIFE.with(|i| i.borrow().as_ref().and_then(|i| i.referenced[a.param])).unwrap_or(total));
    if arg_referenced == Some(0) || arg_referenced == Some(usize::MAX) {
        info.skip = Some("no_lhs");
        return None;
    }
    // terser `mangleable_var` — only when `referenced > 1` and this is the single declaration.
    let mangleable = match arg_referenced {
        Some(referenced) => referenced > 1 && is_mangleable(&cand.value, &cand.name, env),
        None => cand.kind == Kind::Var && declared <= 1 && total > 1 && is_mangleable(&cand.value, &cand.name, env),
    };
    if arg_referenced.is_some_and(|r| r > 1) && !mangleable {
        info.skip = Some("no_lhs");
        return None;
    }
    if cand.kind == Kind::Var {
        let ok = (declared > 1) || if total > 1 { mangleable } else { !exposed };
        if !ok {
            info.skip = Some("no_lhs");
            return None;
        }
    }
    // terser `value_has_side_effects`.
    let side_effects = match cand.kind {
        Kind::Post | Kind::Pre => true,
        _ => expr_effects(&cand.value, env.declared),
    };
    info.value_def = mangleable;
    // A value_def collapse that cannot see every reference is cancelled.
    if mangleable && hidden > 0 {
        info.port_skip = Some("hidden_refs");
        return None;
    }
    // An assignment is always moved whole (terser returns `candidate`); a
    // write nothing reads is left to `drop_unused`, as in terser, so later
    // candidates in this loop still see it.
    // A name `flatten_fn` injected is the parameter's definition in terser:
    // its `references` are the parameter's reads in the inlined body plus the
    // assignment, whatever the tree now holds.
    let injected = INJECTED.with(|i| i.borrow().get(&cand.name).copied());
    // terser `def.references.length - def.replaced == 1` at the replacement.
    let referenced = match &cand.node.data {
        Data::VarDef { name, .. } => REFERENCED.with(|r| r.borrow().get(&ptr(name)).copied()).filter(|&r| r != usize::MAX).unwrap_or(total),
        _ => total,
    };
    let single = match arg_referenced {
        Some(referenced) => referenced == 1,
        None => total == 1 && (!env.block_only || referenced == 1),
    };
    let mode = if matches!(cand.kind, Kind::Var | Kind::Arg) && single && !exposed {
        Mode::ValueOne
    } else if mangleable {
        Mode::ValueAll
    } else {
        Mode::Move
    };
    // terser `replace_all_symbols`: a var's single read, or an assignment whose
    // only other reference is that one read (the write itself is the other).
    // Block counts do not see the whole function, so `replace_all` (which
    // trusts them) is off for a block assignment.
    // In a block, an assignment's count is the symbol table's (`def.references`).
    let target_refs = if block_assign { TARGET_REFS.with(|t| t.borrow().get(&ptr(cand_target(cand))).copied()) } else { None };
    let replace_all = !side_effects
        && (!block_assign || target_refs.is_some())
        && injected.is_none_or(|count| count == 2)
        && (mangleable
            || (matches!(cand.kind, Kind::Var | Kind::Arg) && single)
            || (matches!(cand.kind, Kind::Assign | Kind::Post | Kind::Pre) && cand.prop.is_none() && target_refs.map_or(total == 2 && hidden == 0, |r| r == 2)));
    let mut lvalues = if matches!(cand.kind, Kind::Post | Kind::Pre) {
        HashMap::new()
    } else {
        lvalues_of(&cand.value)
    };
    // terser `is_lhs_local` reads `lvalues` before the lhs name is inserted.
    let value_reads_lhs = lvalues.contains_key(&cand.name);
    let compound = cand.kind == Kind::Assign && cand.op != "=";
    // terser `is_lhs_local`: an injected var's definition is in the function
    // it came from, so it is never local here.
    let lhs_local = env.locals.contains(&cand.name)
        && !injected_name && !INJECTED.with(|i| i.borrow().contains_key(&cand.name))
        && !(env.in_loop
            && (value_reads_lhs || matches!(cand.kind, Kind::Post | Kind::Pre) || compound));
    // The lhs itself is an lvalue that later writes must not cross.
    // (terser `lvalues.set(lhs.name, ...)` for a symbol lhs only.)
    if cand.prop.is_none() {
        lvalues.entry(cand.name.clone()).or_insert(false);
    }
    // terser `AST_Assign.may_throw`: the right-hand side, then a property target.
    let may_throw = expr_may_throw(&cand.value, env.declared)
        || cand.kind == Kind::Assign && cand.prop.as_ref().is_some_and(|p| expr_may_throw(p, env.declared));
    let target_reads = if mode == Mode::ValueAll { reads } else { 1 };
    let mut scan = Scan {
        cand,
        at: 0,
        // terser `hit = funarg`: an IIFE parameter's candidate is not in the body.
        seeking: cand.arg.is_none(),
        can_replace: cand.arg.is_none(),
        abort: false,
        stop_after: None,
        stop_if_hit: None,
        parents: Vec::new(),
        sites: Vec::new(),
        mode,
        replace_all,
        lhs_local,
        side_effects,
        lvalues: &lvalues,
        locals: env.locals,
        declared: env.declared,
        escaped,
        may_throw,
        in_try: env.in_try,
        reads_left: target_reads,
        block_only: env.block_only,
        // terser `lvalues.set(lhs.name, ...)` replaces an inner name equal to
        // the lhs with the lhs's own definition, so that one never shadows.
        // A name bound inside the value has that inner definition, so any
        // definition `find_variable` reaches from here is another one.
        inner_shadow: VISIBLE.with(|v| {
            let v = v.borrow();
            inner_lvalue_names(&cand.value).iter().any(|n| {
                (cand.prop.is_some() || *n != cand.name)
                    && match v.as_ref() {
                        Some(visible) => visible.contains(n),
                        None => env.declared.contains(n) || env.locals.contains(n),
                    }
            })
        }),
    };
    if let Some(arg) = &cand.arg {
        // terser: `args[j].transform(scanner)` with `can_replace` false, then the body.
        for a in &arg.scan {
            if scan.abort {
                break;
            }
            scan_node(a, &mut scan);
        }
        scan.can_replace = true;
    }
    if !scan.abort {
        scan_node(&stmts[index], &mut scan);
    }
    if !scan.abort {
        for stmt in &stmts[index + 1..] {
            if scan.abort {
                break;
            }
            scan.seeking = false;
            scan_node(stmt, &mut scan);
        }
    }
    info.abort = scan.abort;
    if scan.sites.is_empty() {
        return None;
    }
    if mode == Mode::ValueAll && scan.sites.len() != reads {
        return None;
    }
    let wanted = scan.sites.len();
    let mut left: HashMap<usize, usize> = HashMap::new();
    for &s in &scan.sites {
        *left.entry(s).or_insert(0) += 1;
    }
    let sites: HashSet<usize> = scan.sites.into_iter().collect();
    let mut rw = Rw {
        hit: 0,
        saw_cand: false,
        left,
    };
    let mut next = Vec::with_capacity(stmts.len());
    for (i, stmt) in stmts.iter().enumerate() {
        if i < index {
            next.push(Rc::clone(stmt));
            continue;
        }
        if let Some(stmt) = rewrite_stmt(stmt, cand, &sites, mode, &mut rw) {
            next.push(stmt);
        }
    }
    if rw.hit != wanted || !(rw.saw_cand || cand.arg.is_some()) {
        return None;
    }
    info.replaced = rw.hit;
    if mode == Mode::Move && matches!(cand.kind, Kind::Assign | Kind::Pre) {
        MOVED_WRITES.with(|m| m.borrow_mut().push(cand.node.id()));
    }
    // terser `remove_candidate` for a funarg: the argument becomes `0`, or the
    // rest parameter's arguments are dropped. A `value_def` collapse counts
    // `replaced` back to 0 and removes nothing.
    if let Some(arg) = &cand.arg {
        IIFE.with(|i| {
            let mut i = i.borrow_mut();
            let Some(iife) = i.as_mut() else { return };
            iife.changed = true;
            if mode == Mode::ValueAll {
                return;
            }
            match arg.slot {
                Some(k) => {
                    if let Some(old) = iife.args.get(k).cloned() {
                        iife.args[k] = num0(&old);
                        iife.overlap[k] = false;
                    }
                }
                None => {
                    let keep = iife.args.len().min(iife.params.len().saturating_sub(1));
                    iife.args.truncate(keep);
                    iife.overlap.truncate(keep);
                }
            }
        });
    }
    Some(next)
}

struct Scan<'a> {
    cand: &'a Cand,
    at: usize,
    seeking: bool,
    /// terser `can_replace`: off while an IIFE parameter's later arguments are scanned.
    can_replace: bool,
    abort: bool,
    stop_after: Option<usize>,
    stop_if_hit: Option<usize>,
    parents: Vec<N>,
    sites: Vec<usize>,
    mode: Mode,
    replace_all: bool,
    lhs_local: bool,
    side_effects: bool,
    lvalues: &'a HashMap<String, bool>,
    locals: &'a HashSet<String>,
    declared: &'a HashSet<String>,
    escaped: &'a HashSet<String>,
    may_throw: bool,
    in_try: bool,
    reads_left: usize,
    /// terser `get_lvalues` keeps the last symbol per name. When that is a
    /// binding of a function inside the value, `shadows` finds a different
    /// definition at any site where the name is declared.
    inner_shadow: bool,
    /// Collapsing a nested block's statements.
    block_only: bool,
}

fn scan_node(n: &N, st: &mut Scan<'_>) {
    if st.abort {
        return;
    }
    if st.seeking {
        if st.at >= st.cand.path.len() || ptr(n) != st.cand.path[st.at] {
            return;
        }
        st.at += 1;
        if st.at == st.cand.path.len() {
            // Hit the candidate. terser `find_stop`.
            st.seeking = false;
            let stop = find_stop(&st.parents, ptr(n), false, st.lvalues);
            if stop == Some(ptr(n)) {
                st.abort = true;
            } else {
                st.stop_after = stop;
            }
            return;
        }
    } else if !pre_scan(n, st) {
        return;
    }
    st.parents.push(Rc::clone(n));
    if let Data::Switch { expr, body } = &n.data {
        // terser `handle_custom_scan_order` for `AST_Switch`.
        scan_switch(expr, body, st);
    } else if !matches!(
        n.data,
        Data::Func { .. } | Data::Class { .. } | Data::StaticBlock { .. }
    ) {
        scan_children(n, st);
    }
    st.parents.pop();
    if st.stop_after == Some(ptr(n)) {
        st.abort = true;
    }
    if st.stop_if_hit == Some(ptr(n)) {
        st.stop_if_hit = None;
    }
}

/// Returns false when the node (and its children) must not be scanned.
fn pre_scan(n: &N, st: &mut Scan<'_>) -> bool {
    let parent = st.parents.last();
    // terser `collapse` scanner: stop immediately on these nodes.
    if immediate_abort(n, parent, st) {
        st.abort = true;
        return false;
    }
    // Conditional branch: a read here is not safe unless `replace_all` and the lhs is local.
    if st.stop_if_hit.is_none() && !(st.lhs_local && st.replace_all) {
        if let Some(parent) = parent {
            let branch = match &parent.data {
                Data::Binary { op, left, .. } if lazy(op) && ptr(left) != ptr(n) => true,
                Data::Cond { cond, .. } if ptr(cond) != ptr(n) => true,
                Data::If { cond, .. } if ptr(cond) != ptr(n) => true,
                _ => false,
            };
            if branch {
                st.stop_if_hit = Some(ptr(parent));
            }
        }
    }
    if st.can_replace
        && match &st.cand.prop {
            // terser `lhs.equivalent_to(node)`.
            Some(prop) => equivalent(prop, n),
            None => ref_name(n) == Some(st.cand.name.as_str()),
        }
        && !shadows(&st.parents, &st.cand.path, st.lvalues)
        && !st.inner_shadow
    {
        if st.stop_if_hit.is_some() {
            st.abort = true;
            return false;
        }
        // terser `is_lhs(node, parent)`: a write of the name is returned as
        // is, before the `stop_after` tests, and not descended.
        if is_write(n, parent) {
            return false;
        }
        st.sites.push(ptr(n));
        if st.mode != Mode::ValueAll {
            st.abort = true;
            return false;
        }
        if st.sites.len() >= st.reads_left {
            st.abort = true;
            return false;
        }
    }
    if stop_after_node(n, st) {
        st.stop_after = Some(ptr(n));
        if matches!(n.data, Data::Func { .. } | Data::Class { .. }) {
            st.abort = true;
            return false;
        }
    }
    // Functions are not entered (`handle_custom_scan_order`).
    if matches!(
        n.data,
        Data::Func { .. } | Data::Class { .. } | Data::StaticBlock { .. }
    ) {
        return false;
    }
    true
}

fn immediate_abort(n: &N, parent: Option<&N>, st: &Scan<'_>) -> bool {
    (match &n.data {
        Data::Assign {
            op, left, logical, ..
        } if *logical || (*op != "=" && lhs_equivalent(st.cand, left)) => true,
        // terser `node instanceof AST_Call && lhs instanceof AST_PropAccess && lhs.equivalent_to(node.expression)`.
        Data::Call { expr, .. } if st.cand.prop.as_ref().is_some_and(|p| equivalent(p, expr)) => true,
        Data::Await { .. }
        | Data::Debugger
        | Data::Destructuring { .. }
        | Data::Try { .. }
        | Data::With { .. }
        | Data::Yield { .. }
        | Data::Export { .. }
        | Data::Class { .. } => true,
        Data::Call { optional, .. } | Data::Dot { optional, .. } | Data::Sub { optional, .. }
            if *optional =>
        {
            true
        }
        Data::While { .. } | Data::Do { .. } | Data::ForIn { .. } | Data::ForOf { .. } => true,
        Data::Break { .. } | Data::Continue { .. } => true,
        // terser: `node.expression.definition().references.length > 1`.
        Data::Spread { expr } => match &expr.data {
            Data::This => true,
            Data::Symbol {
                kind: SymKind::Ref, ..
            } => SPREAD_REFS.with(|s| s.borrow().get(&ptr(expr)).is_none_or(|&c| c > 1)),
            _ => false,
        },
        // terser `node instanceof AST_ObjectProperty && node.key instanceof AST_Node`: a
        // computed key, or a getter, setter or method (its key is an `AST_SymbolMethod`).
        Data::Prop {
            key: Key::Computed(_),
            ..
        }
        | Data::Prop { method: Some(_), .. } => true,
        _ => false,
    }) || parent.is_some_and(|parent| {
        if let Data::For { init, .. } = &parent.data {
            init.as_ref().map(|i| ptr(i) != ptr(n)).unwrap_or(true)
        } else {
            false
        }
    }) || (!st.replace_all
        && ref_name(n).is_some_and(|name| {
            !is_declared(n, name, st.declared) && !pure_global(name) && !(st.block_only && INJECTED.with(|i| i.borrow().contains_key(name)))
        }))
}

/// terser's scanner `stop_after` test: one `||` chain, so a node whose own
/// clause is false still meets the `may_throw` clause.
fn stop_after_node(n: &N, st: &Scan<'_>) -> bool {
    let own = match &n.data {
        Data::Call { .. } => true,
        Data::Return { .. } | Data::Throw { .. } => {
            st.side_effects || st.cand.prop.is_some() || may_modify(&st.cand.name, st)
        }
        Data::Dot { expr, .. } | Data::Sub { expr, .. } => st.side_effects || !safe_access(expr, st.declared),
        Data::Symbol {
            name,
            kind: SymKind::Ref,
            ..
        } => {
            (st.lvalues.get(name).copied().unwrap_or(false))
                || (st.side_effects && may_modify(name, st))
        }
        Data::VarDef {
            name,
            value: Some(_),
        } => sym_name(name).is_some_and(|sym| {
            st.lvalues.contains_key(sym) || (st.side_effects && may_modify(sym, st))
        }),
        // `is_lhs(node.left, node)`: an assignment target, or the operand of
        // `delete` / `++` / `--`.
        Data::Assign { left, .. } => {
            is_prop(left) || ref_name(left).is_some_and(|sym| st.lvalues.contains_key(sym))
        }
        Data::Unary { op, expr: left, .. } if matches!(op.as_str(), "delete" | "++" | "--") => {
            is_prop(left) || ref_name(left).is_some_and(|sym| st.lvalues.contains_key(sym))
        }
        Data::ForIn { init, .. } | Data::ForOf { init, .. } => {
            is_prop(init) || ref_name(init).is_some_and(|sym| st.lvalues.contains_key(sym))
        }
        _ => false,
    };
    own || st.may_throw
        && if st.in_try {
            node_effects(n, st.declared)
        } else {
            side_effects_external(n, st.locals)
        }
}

fn may_modify(name: &str, st: &Scan<'_>) -> bool {
    // terser: a name whose one declaration is a `function` statement is not modified.
    if DEFUNS.with(|d| d.borrow().contains(name)) {
        return false;
    }
    // A var `flatten_fn` injected keeps the definition (and scope) of the
    // parameter or var it came from: `def.scope` is another function.
    !st.locals.contains(name) || st.escaped.contains(name) || TABLE_ESCAPED.with(|t| t.borrow().contains(name)) || INJECTED.with(|i| i.borrow().contains_key(name))
}

fn scan_switch(expr: &N, body: &[N], st: &mut Scan<'_>) {
    scan_node(expr, st);
    for branch in body {
        if st.abort {
            break;
        }
        let Data::Case {
            expr: case_expr, ..
        } = &branch.data
        else {
            continue;
        };
        if st.seeking {
            if st.at >= st.cand.path.len() || ptr(branch) != st.cand.path[st.at] {
                continue;
            }
            st.at += 1;
            if st.at == st.cand.path.len() {
                st.seeking = false;
                continue;
            }
        }
        scan_node(case_expr, st);
        if !st.replace_all {
            break;
        }
    }
    st.abort = true;
}

fn scan_children(n: &N, st: &mut Scan<'_>) {
    let go = |c: &N, st: &mut Scan<'_>| {
        if !st.abort {
            scan_node(c, st);
        }
    };
    match &n.data {
        Data::Labeled { label, body } => {
            go(label, st);
            go(body, st);
        }
        Data::Simple { body }
        | Data::Throw { value: body }
        | Data::Unary { expr: body, .. }
        | Data::Dot { expr: body, .. }
        | Data::Await { expr: body }
        | Data::Spread { expr: body }
        | Data::Chain { expr: body }
        | Data::Return { value: Some(body) } => go(body, st),
        Data::Block { body } | Data::Default { body } | Data::StaticBlock { body } => {
            for s in body {
                go(s, st);
            }
        }
        Data::Do { body, cond } => {
            go(body, st);
            go(cond, st);
        }
        Data::While { cond, body } => {
            go(cond, st);
            go(body, st);
        }
        Data::For {
            init,
            cond,
            step,
            body,
        } => {
            if let Some(v) = init {
                go(v, st);
            }
            if let Some(v) = cond {
                go(v, st);
            }
            if let Some(v) = step {
                go(v, st);
            }
            go(body, st);
        }
        Data::ForIn { init, object, body }
        | Data::ForOf {
            init, object, body, ..
        } => {
            go(init, st);
            go(object, st);
            go(body, st);
        }
        Data::If { cond, body, alt } => {
            go(cond, st);
            go(body, st);
            if let Some(alt) = alt {
                go(alt, st);
            }
        }
        Data::Case { expr, body } => {
            go(expr, st);
            for s in body {
                go(s, st);
            }
        }
        Data::Try {
            body,
            catch,
            finally,
        } => {
            go(body, st);
            if let Some(c) = catch {
                go(c, st);
            }
            if let Some(f) = finally {
                go(f, st);
            }
        }
        Data::Catch { arg, body } => {
            if let Some(arg) = arg {
                go(arg, st);
            }
            go(body, st);
        }
        Data::Finally { body } | Data::With { body, .. } => go(body, st),
        Data::Defs { defs, .. } => {
            for d in defs {
                go(d, st);
            }
        }
        Data::VarDef { name, value } => {
            go(name, st);
            if let Some(v) = value {
                go(v, st);
            }
        }
        Data::Destructuring { names, .. } => {
            for d in names {
                go(d, st);
            }
        }
        Data::Call { expr, args, .. } => {
            go(expr, st);
            for a in args {
                go(a, st);
            }
        }
        Data::Seq { exprs } | Data::Array { elements: exprs } => {
            for e in exprs {
                go(e, st);
            }
        }
        Data::Sub { expr, prop, .. } => {
            go(expr, st);
            go(prop, st);
        }
        Data::Yield { expr, .. } => {
            if let Some(e) = expr {
                go(e, st);
            }
        }
        Data::Binary { left, right, .. }
        | Data::Assign { left, right, .. }
        | Data::DefaultAssign { left, right } => {
            go(left, st);
            go(right, st);
        }
        Data::Cond { cond, cons, alt } => {
            go(cond, st);
            go(cons, st);
            go(alt, st);
        }
        Data::Object { props } => {
            for p in props {
                go(p, st);
            }
        }
        Data::Prop { key, value, .. } => {
            if let Key::Computed(expr) = key {
                go(expr, st);
            }
            go(value, st);
        }
        Data::Template { segments } => {
            for seg in segments {
                if let ast::Seg::Expr(expr) = seg {
                    go(expr, st);
                }
            }
        }
        Data::TaggedTemplate { tag, template } => {
            go(tag, st);
            go(template, st);
        }
        // An unlisted container might hide a call. Stop after it.
        Data::Symbol { .. }
        | Data::This
        | Data::Super
        | Data::NewTarget
        | Data::Null
        | Data::True
        | Data::False
        | Data::Infinity
        | Data::Number { .. }
        | Data::BigInt { .. }
        | Data::String { .. }
        | Data::RegExp { .. }
        | Data::Hole
        | Data::Empty
        | Data::Directive { .. }
        | Data::ImportMeta
        | Data::Debugger
        | Data::Break { .. }
        | Data::Continue { .. } => {}
        _ => st.stop_after = Some(ptr(n)),
    }
}

/// terser `tighten-body.js` `find_stop`.
fn find_stop(
    parents: &[N],
    mut node_ptr: usize,
    mut write_only: bool,
    lvalues: &HashMap<String, bool>,
) -> Option<usize> {
    let mut idx = parents.len();
    while idx > 0 {
        idx -= 1;
        let parent = &parents[idx];
        match &parent.data {
            Data::Assign { logical, left, .. } => {
                let blocked =
                    is_prop(left) || ref_name(left).is_some_and(|name| lvalues.contains_key(name));
                if write_only && !*logical && !blocked {
                    node_ptr = ptr(parent);
                    continue;
                }
                return Some(node_ptr);
            }
            Data::Binary { op, left, .. } => {
                if write_only && (!lazy(op) || ptr(left) == node_ptr) {
                    node_ptr = ptr(parent);
                    continue;
                }
                return Some(node_ptr);
            }
            Data::Call { .. }
            | Data::Case { .. }
            | Data::Switch { .. }
            | Data::VarDef { .. }
            | Data::For { .. }
            | Data::While { .. }
            | Data::Do { .. }
            | Data::ForIn { .. }
            | Data::ForOf { .. } => {
                return Some(node_ptr);
            }
            Data::Cond { cond, .. } | Data::If { cond, .. } => {
                if write_only && ptr(cond) == node_ptr {
                    node_ptr = ptr(parent);
                    continue;
                }
                return Some(node_ptr);
            }
            Data::Defs { .. } | Data::Simple { .. } => {
                write_only = true;
                node_ptr = ptr(parent);
            }
            Data::Return { .. } | Data::Throw { .. } => {
                if write_only {
                    node_ptr = ptr(parent);
                    continue;
                }
                return Some(node_ptr);
            }
            Data::Seq { exprs } => {
                let tail = exprs.last().is_some_and(|e| ptr(e) == node_ptr);
                write_only = !tail;
                node_ptr = ptr(parent);
            }
            _ => return None,
        }
    }
    None
}

fn shadows(parents: &[N], cand_path: &[usize], lvalues: &HashMap<String, bool>) -> bool {
    if lvalues.is_empty() {
        return false;
    }
    if FOREIGN_SHADOW.with(|f| lvalues.keys().any(|k| f.borrow().contains(k))) {
        return true;
    }
    for parent in parents {
        if cand_path.contains(&ptr(parent)) {
            continue;
        }
        match &parent.data {
            Data::Block { body } => {
                if binds_any(body, lvalues) {
                    return true;
                }
            }
            Data::Catch { arg, .. } => {
                if arg
                    .as_ref()
                    .and_then(sym_name)
                    .is_some_and(|name| lvalues.contains_key(name))
                {
                    return true;
                }
            }
            _ => {}
        }
    }
    false
}

fn binds_any(body: &[N], lvalues: &HashMap<String, bool>) -> bool {
    for stmt in body {
        let Data::Defs { kind, defs, .. } = &stmt.data else {
            continue;
        };
        if !matches!(kind, DefKind::Let | DefKind::Const | DefKind::Using) {
            continue;
        }
        for def in defs {
            if let Data::VarDef { name, .. } = &def.data {
                if sym_name(name).is_some_and(|n| lvalues.contains_key(n)) {
                    return true;
                }
            }
        }
    }
    false
}

struct Rw {
    hit: usize,
    saw_cand: bool,
    /// Reads left to replace per scan site. One node can sit at several reads
    /// (`multi_replacer` puts the same `candidate.value` at each); the scan
    /// and the rewrite meet them in the same order.
    left: HashMap<usize, usize>,
}

fn rewrite_stmt(n: &N, cand: &Cand, sites: &HashSet<usize>, mode: Mode, rw: &mut Rw) -> Option<N> {
    rewrite(n, cand, sites, mode, None, rw)
}

fn rewrite(
    n: &N,
    cand: &Cand,
    sites: &HashSet<usize>,
    mode: Mode,
    parent: Option<&N>,
    rw: &mut Rw,
) -> Option<N> {
    if ptr(n) == ptr(&cand.node) {
        rw.saw_cand = true;
        // terser's `multi_replacer` counts `replaced` back down to 0, so a
        // `value_def` candidate is not removed: `var x = y` stays for drop_unused.
        if mode == Mode::ValueAll {
            return Some(Rc::clone(n));
        }
        return remove_candidate(n, cand);
    }
    if sites.contains(&ptr(n)) {
        if let Some(k) = rw.left.get_mut(&ptr(n)).filter(|k| **k > 0) {
            *k -= 1;
            rw.hit += 1;
            return Some(replacement(n, cand, mode, parent));
        }
    }
    let data = match &n.data {
        Data::Simple { body } => {
            let body = rewrite(body, cand, sites, mode, Some(n), rw)?;
            if empty_seq(&body) {
                return None;
            }
            Data::Simple { body }
        }
        Data::Seq { exprs } => {
            let exprs: Vec<N> = exprs
                .iter()
                .filter_map(|e| rewrite(e, cand, sites, mode, Some(n), rw))
                .filter(|e| !empty_seq(e))
                .collect();
            return match exprs.len() {
                0 => None,
                1 => Some(exprs.into_iter().next().unwrap()),
                _ => Some(renode(n, Data::Seq { exprs })),
            };
        }
        Data::Defs { kind, defs, await_ } => {
            let defs: Vec<N> = defs
                .iter()
                .filter_map(|d| rewrite(d, cand, sites, mode, Some(n), rw))
                .collect();
            if defs.is_empty() {
                return None;
            }
            Data::Defs {
                kind: *kind,
                defs,
                await_: *await_,
            }
        }
        Data::VarDef { name, value } => {
            let value = value
                .as_ref()
                .and_then(|v| rewrite(v, cand, sites, mode, Some(n), rw));
            Data::VarDef {
                name: Rc::clone(name),
                value,
            }
        }
        Data::Block { body } => Data::Block {
            body: rewrite_list(body, cand, sites, mode, rw),
        },
        Data::Return { value } => Data::Return {
            value: value
                .as_ref()
                .and_then(|v| rewrite(v, cand, sites, mode, Some(n), rw)),
        },
        Data::Throw { value } => Data::Throw {
            value: rewrite(value, cand, sites, mode, Some(n), rw).unwrap_or_else(|| num0(value)),
        },
        Data::If { cond, body, alt } => Data::If {
            cond: rewrite(cond, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(cond)),
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
            alt: alt
                .as_ref()
                .and_then(|a| rewrite(a, cand, sites, mode, Some(n), rw)),
        },
        Data::Cond { cond, cons, alt } => Data::Cond {
            cond: rewrite(cond, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(cond)),
            cons: rewrite(cons, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(cons)),
            alt: rewrite(alt, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(alt)),
        },
        Data::Binary { op, left, right } => Data::Binary {
            op: op.clone(),
            left: rewrite(left, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(left)),
            right: rewrite(right, cand, sites, mode, Some(n), rw)
                .unwrap_or_else(|| Rc::clone(right)),
        },
        Data::Assign {
            op,
            left,
            right,
            logical,
        } => Data::Assign {
            op: op.clone(),
            left: if ref_name(left) == Some(cand.name.as_str()) {
                Rc::clone(left)
            } else {
                rewrite(left, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(left))
            },
            right: rewrite(right, cand, sites, mode, Some(n), rw)
                .unwrap_or_else(|| Rc::clone(right)),
            logical: *logical,
        },
        Data::Spread { expr } => Data::Spread {
            expr: rewrite(expr, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(expr)),
        },
        Data::Unary { op, expr, prefix } => Data::Unary {
            op: op.clone(),
            expr: rewrite(expr, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(expr)),
            prefix: *prefix,
        },
        Data::Call {
            expr,
            args,
            optional,
            is_new,
        } => Data::Call {
            expr: rewrite(expr, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(expr)),
            args: args
                .iter()
                .map(|a| rewrite(a, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(a)))
                .collect(),
            optional: *optional,
            is_new: *is_new,
        },
        Data::Dot {
            expr,
            prop,
            optional,
            quote,
            private,
        } => Data::Dot {
            expr: rewrite(expr, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(expr)),
            prop: prop.clone(),
            optional: *optional,
            quote: *quote,
            private: *private,
        },
        Data::Sub {
            expr,
            prop,
            optional,
        } => Data::Sub {
            expr: rewrite(expr, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(expr)),
            prop: rewrite(prop, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(prop)),
            optional: *optional,
        },
        Data::Array { elements } => Data::Array {
            elements: elements
                .iter()
                .filter_map(|e| rewrite(e, cand, sites, mode, Some(n), rw))
                .collect(),
        },
        Data::Object { props } => Data::Object {
            props: props
                .iter()
                .map(|p| rewrite(p, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(p)))
                .collect(),
        },
        Data::Prop {
            method,
            key,
            value,
            static_,
            private,
            generator,
            async_,
        } => Data::Prop {
            method: *method,
            key: match key {
                Key::Computed(expr) => Key::Computed(
                    rewrite(expr, cand, sites, mode, Some(n), rw)
                        .unwrap_or_else(|| Rc::clone(expr)),
                ),
                other => other.clone(),
            },
            value: rewrite(value, cand, sites, mode, Some(n), rw)
                .unwrap_or_else(|| Rc::clone(value)),
            static_: *static_,
            private: *private,
            generator: *generator,
            async_: *async_,
        },
        Data::For {
            init,
            cond,
            step,
            body,
        } => Data::For {
            init: init
                .as_ref()
                .and_then(|v| rewrite(v, cand, sites, mode, Some(n), rw)),
            cond: cond
                .as_ref()
                .and_then(|v| rewrite(v, cand, sites, mode, Some(n), rw)),
            step: step
                .as_ref()
                .and_then(|v| rewrite(v, cand, sites, mode, Some(n), rw)),
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
        },
        Data::While { cond, body } => Data::While {
            cond: rewrite(cond, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(cond)),
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
        },
        Data::Do { body, cond } => Data::Do {
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
            cond: rewrite(cond, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(cond)),
        },
        Data::ForIn { init, object, body } => Data::ForIn {
            init: rewrite(init, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(init)),
            object: rewrite(object, cand, sites, mode, Some(n), rw)
                .unwrap_or_else(|| Rc::clone(object)),
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
        },
        Data::ForOf {
            init,
            object,
            body,
            await_,
        } => Data::ForOf {
            init: rewrite(init, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(init)),
            object: rewrite(object, cand, sites, mode, Some(n), rw)
                .unwrap_or_else(|| Rc::clone(object)),
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
            await_: *await_,
        },
        Data::Try {
            body,
            catch,
            finally,
        } => Data::Try {
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
            catch: catch
                .as_ref()
                .and_then(|c| rewrite(c, cand, sites, mode, Some(n), rw)),
            finally: finally
                .as_ref()
                .and_then(|f| rewrite(f, cand, sites, mode, Some(n), rw)),
        },
        Data::Catch { arg, body } => Data::Catch {
            arg: arg.clone(),
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
        },
        Data::Finally { body } => Data::Finally {
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
        },
        Data::With { expr, body } => Data::With {
            expr: rewrite(expr, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(expr)),
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
        },
        Data::Case { expr, body } => Data::Case {
            expr: rewrite(expr, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(expr)),
            body: rewrite_list(body, cand, sites, mode, rw),
        },
        Data::Default { body } => Data::Default {
            body: rewrite_list(body, cand, sites, mode, rw),
        },
        Data::Switch { expr, body } => Data::Switch {
            expr: rewrite(expr, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(expr)),
            body: body
                .iter()
                .map(|s| rewrite(s, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(s)))
                .collect(),
        },
        Data::Labeled { label, body } => Data::Labeled {
            label: Rc::clone(label),
            body: rewrite(body, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(body)),
        },
        Data::Template { segments } => Data::Template {
            segments: segments
                .iter()
                .map(|seg| match seg {
                    ast::Seg::Expr(expr) => ast::Seg::Expr(
                        rewrite(expr, cand, sites, mode, Some(n), rw)
                            .unwrap_or_else(|| Rc::clone(expr)),
                    ),
                    other => other.clone(),
                })
                .collect(),
        },
        Data::TaggedTemplate { tag, template } => Data::TaggedTemplate {
            tag: rewrite(tag, cand, sites, mode, Some(n), rw).unwrap_or_else(|| Rc::clone(tag)),
            template: rewrite(template, cand, sites, mode, Some(n), rw)
                .unwrap_or_else(|| Rc::clone(template)),
        },
        _ => return Some(Rc::clone(n)),
    };
    Some(renode(n, data))
}

fn rewrite_list(
    body: &[N],
    cand: &Cand,
    sites: &HashSet<usize>,
    mode: Mode,
    rw: &mut Rw,
) -> Vec<N> {
    body.iter()
        .filter_map(|s| rewrite(s, cand, sites, mode, None, rw))
        .collect()
}

/// terser `remove_candidate`.
fn remove_candidate(n: &N, cand: &Cand) -> Option<N> {
    if cand.kind == Kind::Var {
        let value = if matches!(sym_kind(&cand.node), Some(SymKind::Const)) {
            Some(void0(n))
        } else {
            None
        };
        let Data::VarDef { name, .. } = &n.data else {
            return None;
        };
        return Some(renode(
            n,
            Data::VarDef {
                name: Rc::clone(name),
                value,
            },
        ));
    }
    None
}

/// terser replacement at the read: value, `name = value`, or prefix `++`/`--`.
fn replacement(slot: &N, cand: &Cand, mode: Mode, parent: Option<&N>) -> N {
    match mode {
        Mode::ValueOne => maintain_this(parent, slot, &cand.value),
        // terser's `multi_replacer` returns the one `candidate.value` at each read.
        Mode::ValueAll => Rc::clone(&cand.value),
        Mode::Move => match cand.kind {
            Kind::Var | Kind::Arg => node(
                &cand.node,
                Data::Assign {
                    op: "=".into(),
                    left: sym_ref(&cand.name, &cand.node),
                    right: Rc::clone(&cand.value),
                    logical: false,
                },
            ),
            Kind::Post => node(
                &cand.node,
                Data::Unary {
                    op: cand.op.clone(),
                    expr: Rc::clone(&cand.value),
                    prefix: true,
                },
            ),
            Kind::Assign | Kind::Pre => Rc::clone(&cand.node),
        },
    }
}

/// terser `common.js` `maintain_this_binding`.
fn maintain_this(parent: Option<&N>, slot: &N, value: &N) -> N {
    let Some(parent) = parent else {
        return Rc::clone(value);
    };
    let needs = match &parent.data {
        Data::Unary { op, expr, .. } if op == "delete" && ptr(expr) == ptr(slot) => true,
        Data::Call { expr, .. } if ptr(expr) == ptr(slot) => {
            matches!(
                value.data,
                Data::Dot { .. } | Data::Sub { .. } | Data::Chain { .. }
            ) || ref_name(value) == Some("eval")
        }
        _ => false,
    };
    if !needs {
        return Rc::clone(value);
    }
    node(
        slot,
        Data::Seq {
            exprs: vec![num0(slot), Rc::clone(value)],
        },
    )
}

/// terser `mangleable_var`: the value is a declared symbol other than `arguments`.
fn is_mangleable(value: &N, cand_name: &str, env: &Env<'_>) -> bool {
    let Some(name) = ref_name(value) else {
        return false;
    };
    name != "arguments" && name != cand_name && is_declared(value, name, env.declared)
}

/// `(reads, writes, hidden)`. Writes are `a = …` / `a++` / `delete a`. Hidden refs sit in nested functions.
/// `count_refs` and `count_decls` for every name, computed once per version
/// of the statement list.
struct Counts {
    refs: HashMap<String, (usize, usize, usize)>,
    decls: HashMap<String, usize>,
}

impl Counts {
    fn new(stmts: &[N]) -> Self {
        fn refs_rec(n: &N, parent: Option<&N>, hidden: bool, out: &mut HashMap<String, (usize, usize, usize)>, own: &mut Vec<HashSet<String>>) {
            if let Data::Func { body, args, name, .. } = &n.data {
                // A name the nested function binds itself is not this scope's.
                let mut b = scope_bindings(args, body);
                if let Some(nm) = name.as_ref().and_then(sym_name) {
                    b.insert(nm.to_string());
                }
                own.push(b);
                for s in body {
                    refs_rec(s, None, true, out, own);
                }
                own.pop();
                return;
            }
            // A nested block scope's own `let` / `const` (and a catch parameter) is
            // another definition: its references are not this name's.
            let lexical: HashSet<String> = match &n.data {
                Data::Block { body } => block_lexicals(body),
                Data::Switch { body, .. } => body
                    .iter()
                    .flat_map(|c| match &c.data {
                        Data::Case { body, .. } | Data::Default { body } => block_lexicals(body),
                        _ => HashSet::new(),
                    })
                    .collect(),
                Data::For { init: Some(init), .. } => block_lexicals(std::slice::from_ref(init)),
                Data::ForIn { init, .. } | Data::ForOf { init, .. } => block_lexicals(std::slice::from_ref(init)),
                Data::Catch { arg: Some(arg), .. } => scope_bindings(std::slice::from_ref(arg), &[]),
                _ => HashSet::new(),
            };
            if !lexical.is_empty() {
                own.push(lexical);
                ast::walk_children(n, &mut |c| refs_rec(c, Some(n), hidden, out, own));
                own.pop();
                return;
            }
            if let Some(name) = ref_name(n) {
                if own.iter().any(|b| b.contains(name)) {
                    ast::walk_children(n, &mut |c| refs_rec(c, Some(n), hidden, out, own));
                    return;
                }
                let e = out.entry(name.to_string()).or_insert((0, 0, 0));
                if hidden {
                    e.2 += 1;
                } else if is_write(n, parent) {
                    e.1 += 1;
                } else {
                    e.0 += 1;
                }
            }
            ast::walk_children(n, &mut |c| refs_rec(c, Some(n), hidden, out, own));
        }
        fn decls_rec(n: &N, out: &mut HashMap<String, usize>) {
            match &n.data {
                Data::Func { .. } | Data::Class { .. } => {}
                Data::VarDef { name: sym, .. } if sym_name(sym).is_some() => {
                    *out.entry(sym_name(sym).unwrap().to_string()).or_insert(0) += 1;
                    ast::walk_children(n, &mut |c| decls_rec(c, out));
                }
                _ => ast::walk_children(n, &mut |c| decls_rec(c, out)),
            }
        }
        let mut refs = HashMap::new();
        let mut decls = HashMap::new();
        for s in stmts {
            refs_rec(s, None, false, &mut refs, &mut Vec::new());
            decls_rec(s, &mut decls);
        }
        PHANTOM.with(|p| {
            for (name, k) in p.borrow().iter() {
                refs.entry(name.clone()).or_insert((0, 0, 0)).1 += *k;
            }
        });
        Counts { refs, decls }
    }
}

#[allow(dead_code)]
fn count_refs(stmts: &[N], name: &str) -> (usize, usize, usize) {
    fn rec(
        n: &N,
        parent: Option<&N>,
        name: &str,
        hidden: bool,
        reads: &mut usize,
        writes: &mut usize,
        hid: &mut usize,
    ) {
        if let Data::Func { body, .. } = &n.data {
            for s in body {
                rec(s, None, name, true, reads, writes, hid);
            }
            return;
        }
        if ref_name(n) == Some(name) {
            if hidden {
                *hid += 1;
            } else if is_write(n, parent) {
                *writes += 1;
            } else {
                *reads += 1;
            }
        }
        ast::walk_children(n, &mut |c| {
            rec(c, Some(n), name, hidden, reads, writes, hid)
        });
    }
    let (mut reads, mut writes, mut hid) = (0, 0, 0);
    for s in stmts {
        rec(s, None, name, false, &mut reads, &mut writes, &mut hid);
    }
    (reads, writes, hid)
}

#[allow(dead_code)]
fn count_decls(stmts: &[N], name: &str) -> usize {
    fn rec(n: &N, name: &str) -> usize {
        match &n.data {
            Data::Func { .. } | Data::Class { .. } => 0,
            Data::VarDef { name: sym, .. } if sym_name(sym) == Some(name) => 1,
            _ => {
                let mut k = 0;
                ast::walk_children(n, &mut |c| k += rec(c, name));
                k
            }
        }
    }
    stmts.iter().map(|s| rec(s, name)).sum()
}

/// terser `may_modify`: names with a reference from a nested function
/// (`ref.scope.get_defun_scope() !== scope`). A name the nested function
/// binds itself is another definition.
fn escaped_names(stmts: &[N]) -> HashSet<String> {
    let mut out = HashSet::new();
    fn rec(n: &N, bound: &mut Vec<HashSet<String>>, out: &mut HashSet<String>) {
        if let Data::Func { kind, name, args, body, .. } = &n.data {
            let mut own = HashSet::new();
            if !matches!(kind, ast::FuncKind::Decl) {
                if let Some(nm) = name.as_ref().and_then(sym_name) {
                    own.insert(nm.to_string());
                }
            }
            collect_locals(args, &mut own);
            collect_locals(body, &mut own);
            bound.push(own);
            for a in args {
                rec(a, bound, out);
            }
            for s in body {
                rec(s, bound, out);
            }
            bound.pop();
            return;
        }
        if !bound.is_empty() {
            if let Some(name) = ref_name(n) {
                if !bound.iter().any(|b| b.contains(name)) {
                    out.insert(name.to_string());
                }
            }
        }
        ast::walk_children(n, &mut |c| rec(c, bound, out));
    }
    for s in stmts {
        rec(s, &mut Vec::new(), &mut out);
    }
    out
}

/// terser `get_lvalues` / `is_modified`: symbols the value reads, and whether it writes them.
fn lvalues_of(value: &N) -> HashMap<String, bool> {
    let mut out = HashMap::new();
    let mut stack = Vec::new();
    fn rec(n: &N, stack: &mut Vec<N>, out: &mut HashMap<String, bool>) {
        if let Some(name) = symbol_root(n) {
            if modified(n, stack) {
                out.insert(name, true);
            } else {
                out.entry(name).or_insert(false);
            }
        }
        stack.push(Rc::clone(n));
        // terser's `get_lvalues` walker enters nested functions too.
        ast::walk_children(n, &mut |c| rec(c, stack, out));
        stack.pop();
    }
    rec(value, &mut stack, &mut out);
    out
}

/// Names whose last `get_lvalues` entry is a parameter or local of a function
/// nested in `value` (and no earlier entry was modified).
fn inner_lvalue_names(value: &N) -> HashSet<String> {
    fn rec(n: &N, bound: &mut Vec<HashSet<String>>, last: &mut HashMap<String, (bool, bool)>, stack: &mut Vec<N>) {
        if let Some(name) = symbol_root(n) {
            let inner = bound.iter().any(|b| b.contains(&name));
            let m = modified(n, stack);
            match last.get(&name) {
                Some((true, _)) => {}
                _ => {
                    last.insert(name, (m, inner));
                }
            }
        }
        let pushed = if let Data::Func { args, body, name, .. } = &n.data {
            // Parameters with defaults and destructured ones bind too.
            let mut own = scope_bindings(args, &[]);
            if let Some(nm) = name.as_ref().and_then(sym_name) {
                own.insert(nm.to_string());
            }
            collect_locals(body, &mut own);
            bound.push(own);
            true
        } else {
            false
        };
        stack.push(Rc::clone(n));
        // `AST_Call._walk` visits the arguments before the callee, so an inlined function's own
        // names are the last entries.
        ast::walk_children(n, &mut |c| rec(c, bound, last, stack));
        stack.pop();
        if pushed {
            bound.pop();
        }
    }
    let mut last = HashMap::new();
    rec(value, &mut Vec::new(), &mut last, &mut Vec::new());
    last.into_iter().filter(|(_, (_, inner))| *inner).map(|(k, _)| k).collect()
}

fn symbol_root(n: &N) -> Option<String> {
    match &n.data {
        Data::Symbol {
            name,
            kind: SymKind::Ref,
            ..
        } => Some(name.clone()),
        Data::Dot { expr, .. } | Data::Sub { expr, .. } | Data::Chain { expr } => symbol_root(expr),
        _ => None,
    }
}

fn modified(n: &N, stack: &[N]) -> bool {
    let mut cur = n;
    for parent in stack.iter().rev() {
        if is_write(cur, Some(parent)) || is_callee(cur, parent) {
            return true;
        }
        if !bubbles(cur, parent) {
            return false;
        }
        cur = parent;
    }
    false
}

fn bubbles(n: &N, parent: &N) -> bool {
    match &parent.data {
        Data::Array { .. } => true,
        Data::Prop { value, .. } if ptr(value) == ptr(n) => true,
        Data::Dot { expr, .. } | Data::Sub { expr, .. } if ptr(expr) == ptr(n) => true,
        _ => false,
    }
}

fn is_callee(n: &N, parent: &N) -> bool {
    match &parent.data {
        Data::Call { expr, .. } if ptr(expr) == ptr(n) => !matches!(
            n.data,
            Data::Func {
                kind: ast::FuncKind::Arrow,
                ..
            }
        ),
        _ => false,
    }
}

fn is_write(n: &N, parent: Option<&N>) -> bool {
    let Some(parent) = parent else { return false };
    match &parent.data {
        Data::Unary { op, expr, .. }
            if matches!(op.as_str(), "++" | "--" | "delete") && ptr(expr) == ptr(n) =>
        {
            true
        }
        Data::Assign { left, .. } if ptr(left) == ptr(n) => true,
        Data::ForIn { init, .. } | Data::ForOf { init, .. } if ptr(init) == ptr(n) => true,
        _ => false,
    }
}

fn expr_effects(n: &N, locals: &HashSet<String>) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::This
        | Data::Infinity
        | Data::RegExp { .. }
        | Data::BigInt { .. }
        | Data::Hole
        | Data::Func { .. } => false,
        Data::Symbol {
            kind: SymKind::Ref,
            name,
            ..
        } => !is_declared(n, name, locals) && !pure_global(name),
        Data::Unary { op, expr, .. } => {
            matches!(op.as_str(), "delete" | "++" | "--") || expr_effects(expr, locals)
        }
        Data::Binary { left, right, .. } => {
            expr_effects(left, locals) || expr_effects(right, locals)
        }
        Data::Assign { .. }
        | Data::Call { .. }
        | Data::Await { .. }
        | Data::Yield { .. }
        | Data::NewTarget => true,
        Data::Seq { exprs } | Data::Array { elements: exprs } => {
            exprs.iter().any(|e| expr_effects(e, locals))
        }
        Data::Object { props } => props.iter().any(|p| expr_effects(p, locals)),
        Data::Prop { key, value, .. } => {
            matches!(key, Key::Computed(e) if expr_effects(e, locals))
                || expr_effects(value, locals)
        }
        Data::Cond { cond, cons, alt } => {
            expr_effects(cond, locals) || expr_effects(cons, locals) || expr_effects(alt, locals)
        }
        Data::Dot { expr, optional, .. } => {
            if *optional {
                expr_effects(expr, locals)
            } else {
                !safe_access(expr, locals) || expr_effects(expr, locals)
            }
        }
        Data::Sub {
            expr,
            prop,
            optional,
        } => {
            if *optional {
                expr_effects(expr, locals) || expr_effects(prop, locals)
            } else {
                !safe_access(expr, locals) || expr_effects(expr, locals) || expr_effects(prop, locals)
            }
        }
        Data::Chain { expr } => expr_effects(expr, locals),
        // terser `AST_TemplateString.has_side_effects`: its segments only.
        Data::Template { segments } => segments.iter().any(|s| matches!(s, ast::Seg::Expr(e) if expr_effects(e, locals))),
        // terser `AST_Class.has_side_effects`: `extends`, computed keys,
        // static field values and static blocks.
        Data::Class { extends, props, .. } => {
            extends.as_ref().is_some_and(|e| expr_effects(e, locals))
                || props.iter().any(|p| match &p.data {
                    Data::StaticBlock { body } => body.iter().any(|s| node_effects(s, locals)),
                    Data::Field { key, value, static_, .. } => {
                        matches!(key, Key::Computed(k) if expr_effects(k, locals))
                            || *static_ && value.as_ref().is_some_and(|v| expr_effects(v, locals))
                    }
                    Data::Prop { key, .. } => matches!(key, Key::Computed(k) if expr_effects(k, locals)),
                    _ => true,
                })
        }
        _ => true,
    }
}

/// terser `inference.js` `has_side_effects` for any node the scanner meets:
/// statements and declaration names here, expressions in `expr_effects`.
fn node_effects(n: &N, declared: &HashSet<String>) -> bool {
    let any = |list: &[N]| list.iter().any(|s| node_effects(s, declared));
    match &n.data {
        Data::Empty => false,
        Data::Block { body } | Data::StaticBlock { body } | Data::Default { body } => any(body),
        Data::Simple { body } | Data::Labeled { body, .. } => node_effects(body, declared),
        Data::Catch { body, .. } | Data::Finally { body } => node_effects(body, declared),
        Data::If { cond, body, alt } => {
            node_effects(cond, declared)
                || node_effects(body, declared)
                || alt.as_ref().is_some_and(|a| node_effects(a, declared))
        }
        Data::Switch { expr, body } | Data::Case { expr, body } => {
            node_effects(expr, declared) || any(body)
        }
        Data::Try { body, catch, finally } => {
            node_effects(body, declared)
                || catch.as_ref().is_some_and(|c| node_effects(c, declared))
                || finally.as_ref().is_some_and(|f| node_effects(f, declared))
        }
        Data::Defs { defs, .. } => any(defs),
        Data::VarDef { value, .. } => value.is_some(),
        // `AST_SymbolExport` is an `AST_SymbolRef`.
        Data::Symbol { kind: SymKind::Export, name, .. } => !is_declared(n, name, declared) && !pure_global(name),
        // `AST_SymbolDeclaration` and `AST_SymbolClassProperty`; the other
        // plain `AST_Symbol`s are `AST_Node` (true).
        Data::Symbol { kind, .. } if !matches!(
            kind,
            SymKind::Ref
                | SymKind::Method
                | SymKind::Label
                | SymKind::LabelRef
                | SymKind::ImportForeign
                | SymKind::ExportForeign
                | SymKind::Private
        ) => false,
        _ => expr_effects(n, declared),
    }
}

fn expr_may_throw(n: &N, locals: &HashSet<String>) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::This
        | Data::Infinity
        | Data::RegExp { .. }
        | Data::BigInt { .. }
        | Data::Func { .. }
        | Data::Hole => false,
        Data::Symbol {
            kind: SymKind::Ref,
            name,
            ..
        } => !is_declared(n, name, locals) && !pure_global(name),
        Data::Unary { op, expr, .. }
            if op == "typeof" && matches!(expr.data, Data::Symbol { .. }) =>
        {
            false
        }
        Data::Unary { expr, .. } => expr_may_throw(expr, locals),
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } => {
            expr_may_throw(left, locals) || expr_may_throw(right, locals)
        }
        Data::Seq { exprs } | Data::Array { elements: exprs } => {
            exprs.iter().any(|e| expr_may_throw(e, locals))
        }
        Data::Cond { cond, cons, alt } => {
            expr_may_throw(cond, locals)
                || expr_may_throw(cons, locals)
                || expr_may_throw(alt, locals)
        }
        Data::Dot { expr, optional, .. } => {
            !*optional && !safe_access(expr, locals) || expr_may_throw(expr, locals)
        }
        Data::Sub {
            expr,
            prop,
            optional,
        } => {
            !*optional && !safe_access(expr, locals)
                || expr_may_throw(expr, locals)
                || expr_may_throw(prop, locals)
        }
        // terser has no `may_throw` for `AST_TemplateString`: `AST_Node`'s `true`.
        Data::Call { .. } | Data::Template { .. } => true,
        _ => false,
    }
}

fn side_effects_external(n: &N, locals: &HashSet<String>) -> bool {
    match &n.data {
        Data::Assign { left, .. } => {
            side_effects_external(left, locals)
                || ref_name(left).is_some_and(|name| !locals.contains(name))
        }
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "++" | "--" | "delete") => {
            ref_name(expr).is_some_and(|name| !locals.contains(name))
                || side_effects_external(expr, locals)
        }
        Data::Dot { expr, .. } | Data::Sub { expr, .. } => side_effects_external(expr, locals),
        Data::VarDef { value, .. } => value
            .as_ref()
            .is_some_and(|v| side_effects_external(v, locals)),
        _ => false,
    }
}

/// terser `may_throw_on_access` (`_dot_throw`, `pure_getters` "strict") for
/// the receivers this port knows: `safe_receiver`, and a lambda's own
/// `arguments` (`this.name === "arguments" && this.scope instanceof
/// AST_Lambda`). An `arguments` the table resolves to no function (in an
/// arrow outside any function) is undeclared and has side effects anyway.
fn safe_access(n: &N, declared: &HashSet<String>) -> bool {
    safe_receiver(n)
        || matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. }) && SAFE_RECEIVERS.with(|s| s.borrow().contains(&ptr(n)))
        || matches!(&n.data, Data::Symbol { kind: SymKind::Ref, name, .. } if name == "arguments" && is_declared(n, name, declared))
}

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

fn pure_global(name: &str) -> bool {
    // terser `native-objects.js` `pure_prop_access_globals`.
    matches!(
        name,
        "Number" | "String" | "Array" | "Object" | "Function" | "Promise"
    )
}

fn lazy(op: &str) -> bool {
    matches!(op, "&&" | "||" | "??")
}

fn is_prop(n: &N) -> bool {
    matches!(n.data, Data::Dot { .. } | Data::Sub { .. })
}

fn empty_seq(n: &N) -> bool {
    matches!(&n.data, Data::Seq { exprs } if exprs.is_empty())
}

fn has_side_effects(n: &N) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::This => false,
        Data::Symbol {
            kind: SymKind::Ref, ..
        } => false,
        Data::Unary {
            op,
            expr,
            prefix: true,
        } if matches!(op.as_str(), "void" | "!" | "~" | "-" | "+") => has_side_effects(expr),
        Data::Binary { op, left, right } if !matches!(op.as_str(), "=" | "+=" | "-=") => {
            has_side_effects(left) || has_side_effects(right)
        }
        _ => true,
    }
}

fn collect_locals(stmts: &[N], names: &mut HashSet<String>) {
    fn rec(n: &N, names: &mut HashSet<String>) {
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
                    if let Data::VarDef { name, value } = &d.data {
                        // A destructuring pattern binds every name in it.
                        rec(name, names);
                        if let Some(v) = value {
                            rec(v, names);
                        }
                    }
                }
            }
            Data::Symbol { name, kind, .. }
                if !matches!(kind, SymKind::Ref | SymKind::Label | SymKind::LabelRef | SymKind::Export | SymKind::ExportForeign | SymKind::ImportForeign | SymKind::ClassProperty | SymKind::Method | SymKind::Private) =>
            {
                names.insert(name.clone());
            }
            _ => {
                ast::walk_children(n, &mut |c| rec(c, names));
            }
        }
    }
    for s in stmts {
        rec(s, names);
    }
}

fn block_scoped_names(stmts: &[N]) -> HashSet<String> {
    let mut names = HashSet::new();
    fn rec(n: &N, names: &mut HashSet<String>) {
        match &n.data {
            Data::Defs {
                kind: DefKind::Let | DefKind::Const | DefKind::Using,
                defs,
                ..
            } => {
                for d in defs {
                    if let Data::VarDef { name, .. } = &d.data {
                        names.extend(scope_bindings(std::slice::from_ref(name), &[]));
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

fn ref_name(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol {
            name,
            kind: SymKind::Ref,
            ..
        } => Some(name),
        _ => None,
    }
}

fn sym_name(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name),
        _ => None,
    }
}

fn sym_kind(n: &N) -> Option<SymKind> {
    match &n.data {
        Data::VarDef { name, .. } => match &name.data {
            Data::Symbol { kind, .. } => Some(*kind),
            _ => None,
        },
        _ => None,
    }
}

/// copy: terser `make_node(AST_SymbolRef, candidate.name, candidate.name)` (tb 385) copies
/// the declaration's `thedef`. The port's table resolves it by name for now.
fn sym_ref(name: &str, span: &N) -> N {
    node(
        span,
        Data::Symbol {
            name: name.to_string(),
            kind: SymKind::Ref,
            quote: None,
        },
    )
}

fn ptr(n: &N) -> usize {
    Rc::as_ptr(n) as usize
}

/// new: terser `make_node(X, orig, ..)`.
fn node(orig: &N, data: Data) -> N {
    Node::make(orig, data)
}

/// keep: the collapse scanner and its rewrite are an in-place `TreeTransformer` (tb 523,
/// 532), and `remove_candidate` edits the definition (tb 877). The definition filters
/// (`drop_unmentioned`, `sweep_duplicate_vars`) are port-only; drop_unused edits
/// `definitions` in place too (du 391).
fn renode(orig: &N, data: Data) -> N {
    orig.rebuild(data)
}

fn num0(span: &N) -> N {
    node(
        span,
        Data::Number {
            value: 0.0,
            raw: "0".into(),
        },
    )
}

fn void0(span: &N) -> N {
    node(
        span,
        Data::Unary {
            op: "void".into(),
            expr: num0(span),
            prefix: true,
        },
    )
}

fn map_walk(n: &N, data: &Data, env: &Env<'_>) -> N {
    let go = |c: &N| walk(c, env);
    let rebuilt = match data {
        Data::If { cond, body, alt } => Data::If {
            cond: go(cond),
            body: go(body),
            alt: alt.as_ref().map(go),
        },
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::Return { value } => Data::Return {
            value: value.as_ref().map(go),
        },
        Data::Throw { value } => Data::Throw { value: go(value) },
        Data::Switch { expr, body } => Data::Switch {
            expr: go(expr),
            body: body.iter().map(go).collect(),
        },
        Data::Case { expr, body } => Data::Case {
            expr: go(expr),
            body: body.iter().map(go).collect(),
        },
        Data::Default { body } => Data::Default {
            body: body.iter().map(go).collect(),
        },
        Data::Catch { arg, body } => Data::Catch {
            arg: arg.clone(),
            body: go(body),
        },
        Data::Finally { body } => Data::Finally { body: go(body) },
        Data::Labeled { label, body } => Data::Labeled {
            label: Rc::clone(label),
            body: go(body),
        },
        Data::With { expr, body } => Data::With {
            expr: go(expr),
            body: go(body),
        },
        Data::Unary { op, expr, prefix } => Data::Unary {
            op: op.clone(),
            expr: go(expr),
            prefix: *prefix,
        },
        Data::Binary { op, left, right } => Data::Binary {
            op: op.clone(),
            left: go(left),
            right: go(right),
        },
        Data::Assign {
            op,
            left,
            right,
            logical,
        } => Data::Assign {
            op: op.clone(),
            left: go(left),
            right: go(right),
            logical: *logical,
        },
        Data::Seq { exprs } => Data::Seq {
            exprs: exprs.iter().map(go).collect(),
        },
        Data::Call {
            expr,
            args,
            optional,
            is_new,
        } => Data::Call {
            expr: go(expr),
            args: args.iter().map(go).collect(),
            optional: *optional,
            is_new: *is_new,
        },
        Data::Cond { cond, cons, alt } => Data::Cond {
            cond: go(cond),
            cons: go(cons),
            alt: go(alt),
        },
        Data::Array { elements } => Data::Array {
            elements: elements.iter().map(go).collect(),
        },
        Data::Object { props } => Data::Object {
            props: props.iter().map(go).collect(),
        },
        Data::Defs { kind, defs, await_ } => Data::Defs {
            kind: *kind,
            defs: defs.iter().map(go).collect(),
            await_: *await_,
        },
        Data::VarDef { name, value } => Data::VarDef {
            name: Rc::clone(name),
            value: value.as_ref().map(go),
        },
        Data::Class {
            stmt,
            name,
            extends,
            props,
        } => Data::Class {
            stmt: *stmt,
            name: name.clone(),
            extends: extends.as_ref().map(go),
            props: props.iter().map(go).collect(),
        },
        Data::Prop {
            method,
            key,
            value,
            static_,
            private,
            generator,
            async_,
        } => Data::Prop {
            method: *method,
            key: match key {
                Key::Computed(expr) => Key::Computed(go(expr)),
                other => other.clone(),
            },
            value: go(value),
            static_: *static_,
            private: *private,
            generator: *generator,
            async_: *async_,
        },
        Data::Field {
            key,
            value,
            static_,
            private,
        } => Data::Field {
            key: match key {
                Key::Computed(expr) => Key::Computed(go(expr)),
                other => other.clone(),
            },
            value: value.as_ref().map(go),
            static_: *static_,
            private: *private,
        },
        _ => return Rc::clone(n),
    };
    renode(n, rebuilt)
}
