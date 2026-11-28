//! terser `lib/compress/index.js` `def_optimize(AST_Call)` and `def_optimize(AST_New)`.
//!
//! Inlining follows `lib/compress/inline.js` `inline_into_call`. A call is inlined
//! only on a path that function takes: a constant return, an identity function,
//! or a direct single-statement body that does not need a new binding.
//! `drop_console` is not implemented here.

use ast::{Data, FuncKind, Key, N, Node, SymKind};
use std::cell::Cell;
use std::collections::HashSet;
use std::rc::Rc;

use crate::eval;
use crate::Cx;

thread_local! {
    static OPT_DEPTH: Cell<u8> = const { Cell::new(0) };
}

pub(crate) fn optimize(n: &N, cx: &Cx) -> Option<N> {
    if OPT_DEPTH.with(|d| d.get()) > 6 {
        return None;
    }
    let Data::Call { expr, args, is_new, .. } = &n.data else {
        return None;
    };
    if *is_new {
        return optimize_new(n, cx);
    }
    if cx.in_computed_key() {
        return None;
    }
    let (args, spread) = inline_array_like_spread(args);
    let ann = call_ann(n);
    let resolved = resolve_callee(expr, cx, ann.noinline);
    // Unused-argument trimming runs before `inline_into_call`, including for globals.
    let (func, args, trimmed) = match &resolved.func {
        Some(func) if cx.opts.unused && !uses_arguments(func) => trim_unused(func, &args, resolved.direct, cx),
        _ => (resolved.func, args, false),
    };
    // `console.assert(c, ..)` with a condition that evaluates to `1` or `true`
    // is `void 0` (index.js 1744).
    if let Data::Dot { expr: obj, prop, .. } = &expr.data {
        if prop == "assert" && matches!(&obj.data, Data::Symbol { name, kind: SymKind::Ref, .. } if name == "console" && !cx.declared_ref(obj, name)) {
            if let Some(cond) = args.first() {
                let table = cx.syms.as_ref().filter(|_| cx.opts.reduce_vars);
                let value = if cx.opts.evaluate { eval::eval_lit(cond, table, &cx.parents) } else { None };
                if matches!(value, Some(eval::Lit::Bool(true))) || matches!(value, Some(eval::Lit::Num(v)) if v == 1.0) {
                    return Some(polish(void0(n), cx));
                }
            }
        }
    }
    // A pure call in statement position contributes only its arguments' side effects.
    if ann.pure && cx.opts.side_effects && cx.parent_is_simple() {
        let effects: Vec<N> = args.iter().filter(|a| !eval::is_pure(a)).cloned().collect();
        return Some(finish_seq(n, effects, cx));
    }
    if cx.opts.unsafe_opt && !contains_optional(expr) {
        if let Some(rewritten) = unsafe_call(n, expr, &args, cx) {
            return Some(polish(rewritten, cx));
        }
    }
    let loop_blocked = cx.in_loop() && !ann.inline_;
    if resolved.stop || loop_blocked || func.as_ref().is_some_and(fn_pinned) {
        let callee = trimmed_callee(expr, func.as_ref(), trimmed, resolved.direct);
        return finish_call(n, callee, &args, trimmed, spread);
    }
    if let Some(func) = &func {
        let slot = crate::trace::reserve();
        let how = crate::trace::enter_how();
        let mut inlined = inline_into_call(n, expr, func, &args, cx, &ann, resolved.direct);
        let mut how = crate::trace::leave_how(how);
        if inlined.is_none() {
            inlined = drop_empty_call(n, func, &args, cx);
            how = Some("drop_empty");
        }
        if slot.is_some() {
            crate::trace::fill(slot, inlined.as_ref().map(|out| trace_inline_call(n, expr, &args, how, out)));
        }
        if let Some(rewritten) = inlined {
            if !resolved.direct {
                note_replaced(expr, cx);
            }
            return Some(rewritten);
        }
    }
    let callee = trimmed_callee(expr, func.as_ref(), trimmed, resolved.direct);
    let out = finish_call(n, callee, &args, trimmed, spread);
    // `compressor.parent() instanceof AST_SimpleStatement && is_iife_call(self)`:
    // `self.negate(compressor, true)` (inline.js 459-463). Only a call whose
    // optimizer runs is negated; the statement's own optimizer then sees `!call`.
    if cx.opts.negate_iife && cx.parent_is_simple() {
        let call = out.clone().unwrap_or_else(|| Rc::clone(n));
        if eval::is_iife_call(&call) {
            return Some(eval::unary(&call, "!", call.clone()));
        }
    }
    out
}

/// The `inline_call` trace event: the call as terser's `inline_into_call` sees it
/// (unused arguments trimmed, the callee as it was) and what replaced it.
fn trace_inline_call(n: &N, expr: &N, args: &[N], how: Option<&'static str>, out: &N) -> (&'static str, Vec<(&'static str, serde_json::Value)>) {
    let call = atom(n, Data::Call { expr: Rc::clone(expr), args: args.to_vec(), optional: false, is_new: false });
    (
        "inline_call",
        crate::trace::fields!(how = how.unwrap_or("?"), call = crate::trace::code(&call), out = crate::trace::code(out)),
    )
}

fn trimmed_callee<'a>(expr: &'a N, func: Option<&'a N>, trimmed: bool, direct: bool) -> &'a N {
    if trimmed && direct {
        func.unwrap_or(expr)
    } else {
        expr
    }
}

fn finish_call(n: &N, expr: &N, args: &[N], trimmed: bool, spread: bool) -> Option<N> {
    if !trimmed && !spread {
        return None;
    }
    let Data::Call { optional, .. } = &n.data else {
        return None;
    };
    // keep: `self.args.length = pos` and `inline_array_like_spread(self.args)` edit the call (index.js 1696, 1741).
    Some(edit(
        n,
        Data::Call { expr: Rc::clone(expr), args: args.to_vec(), optional: *optional, is_new: false },
    ))
}

struct Resolved {
    func: Option<N>,
    direct: bool,
    stop: bool,
}

/// `inline_into_call`: a global callee is not substituted when `toplevel.funcs` is off.
fn resolve_callee(expr: &N, cx: &Cx, noinline: bool) -> Resolved {
    if matches!(expr.data, Data::Func { .. }) {
        return Resolved { func: Some(Rc::clone(expr)), direct: true, stop: false };
    }
    if !cx.opts.reduce_vars || noinline {
        return Resolved { func: None, direct: false, stop: false };
    }
    let Some(fixed) = fixed_lambda(expr, cx) else {
        return Resolved { func: None, direct: false, stop: false };
    };
    if retain_top(cx, &fixed) {
        return Resolved { func: None, direct: false, stop: true };
    }
    // `inline_into_call` returns for a global callee, but `def_optimize(AST_Call)`
    // has already trimmed the arguments against `fn.fixed_value()` (a global
    // `const` keeps its fixed value when exposed).
    if def_flag(expr, cx, |d| d.global) && !cx.opts.toplevel_funcs {
        return Resolved { func: Some(fixed), direct: false, stop: true };
    }
    Resolved { func: Some(fixed), direct: false, stop: false }
}

fn fixed_lambda(expr: &N, cx: &Cx) -> Option<N> {
    let Data::Symbol { kind: SymKind::Ref, .. } = &expr.data else {
        return None;
    };
    let table = cx.syms.as_ref()?;
    let id = table.def_of(expr)?;
    if table.unfixed_ref(expr) {
        return None;
    }
    let fixed = table.defs[id].fixed.clone()?;
    matches!(fixed.data, Data::Func { .. }).then_some(fixed)
}

fn def_flag(expr: &N, cx: &Cx, f: impl FnOnce(&crate::syms::SymbolDef) -> bool) -> bool {
    let Some(table) = cx.syms.as_ref() else {
        return false;
    };
    let Some(id) = table.def_of(expr) else {
        return false;
    };
    f(&table.defs[id])
}

fn retain_top(cx: &Cx, func: &N) -> bool {
    let Some(keep) = cx.opts.top_retain.as_deref() else {
        return false;
    };
    let Data::Func { kind: FuncKind::Decl, name: Some(name), .. } = &func.data else {
        return false;
    };
    sym_str(name) == Some(keep)
}

fn note_replaced(expr: &N, cx: &Cx) {
    let Some(table) = cx.syms.as_ref() else {
        return;
    };
    let Some(id) = table.def_of(expr) else {
        return;
    };
    let def = &table.defs[id];
    def.replaced.set(def.replaced.get().saturating_add(1));
}

struct Ann {
    pure: bool,
    inline_: bool,
    noinline: bool,
}

/// terser `has_annotation(self, ..)`: the parser's `annotate` set the bits.
fn call_ann(n: &N) -> Ann {
    Ann {
        pure: n.has_annotation(ast::ANN_PURE),
        inline_: n.has_annotation(ast::ANN_INLINE),
        noinline: n.has_annotation(ast::ANN_NOINLINE),
    }
}

/// Side effects of a `#__PURE__` / `@__PURE__` call, when the annotation is on the node.
pub(crate) fn pure_effects(n: &N) -> Option<Vec<N>> {
    let Data::Call { args, .. } = &n.data else {
        return None;
    };
    if !call_ann(n).pure {
        return None;
    }
    Some(args.iter().filter(|a| !eval::is_pure(a)).cloned().collect())
}

/// terser `node.clone(true)`: new nodes that keep their definitions and scopes
/// (copied declarations are not in `def.orig`).
fn fresh_copy(v: &N, cx: &Cx) -> N {
    match cx.syms.as_ref() {
        Some(table) => table.clone_plain(v),
        None => ast::deep_clone(v),
    }
}

fn inline_into_call(n: &N, expr: &N, func: &N, args: &[N], cx: &Cx, ann: &Ann, direct: bool) -> Option<N> {
    let Data::Func { kind, name, args: params, body, async_, generator } = &func.data else {
        return None;
    };
    let callee_pure = ann.pure && cx.opts.side_effects;
    if *async_ || *generator || cx.opts.inline <= 0 || callee_pure {
        return None;
    }
    if let Some(stat) = body.first() {
        if let Data::Return { value } = &stat.data {
            let constant = value.as_ref().map(is_constant_expr).unwrap_or(true);
            if constant {
                let mut exprs: Vec<N> = args.to_vec();
                // terser `returned.clone(true)`: a fresh copy without optimizer
                // flags, so a returned lambda is compressed again.
                exprs.push(value.as_ref().map(|v| fresh_copy(v, cx)).unwrap_or_else(|| void0(n)));
                crate::trace::set_how("const_return");
                return Some(crate::sequence::make_and_optimize(n, exprs, cx));
            }
            if params.len() == 1
                && is_simple_funarg(&params[0])
                && args.len() < 2
                && args.first().map(|a| !matches!(a.data, Data::Spread { .. })).unwrap_or(true)
            {
                if let Some(value) = value {
                    if let Data::Symbol { name: ret, kind: SymKind::Ref, .. } = &value.data {
                        if sym_str(&params[0]) == Some(ret.as_str()) {
                            let replacement = match args.first() {
                                Some(arg) => polish(Rc::clone(arg), cx),
                                None => void0(n),
                            };
                            crate::trace::set_how("identity");
                            if is_prop_access(&replacement) && cx.parent_calls(n) {
                                return Some(seq_node(n, vec![num(n, 0.0), replacement]));
                            }
                            return Some(replacement);
                        }
                    }
                }
            }
        }
    }
    crate::trace::set_how("flatten");
    flatten_call(n, func, args, cx, ann, direct)
}

/// terser `inline.js` `inline_into_call`, the `flatten_fn` branch: arguments
/// and the body's `var`s become assignments to `var`s injected into the
/// enclosing scope after the statement that holds the call.
thread_local! {
    static FLATTENING: Cell<bool> = const { Cell::new(false) };
}

fn flatten_call(n: &N, func: &N, args: &[N], cx: &Cx, ann: &Ann, direct: bool) -> Option<N> {
    // terser's `make_sequence(...).optimize` does not descend, so a flatten
    // never runs inside another one.
    if FLATTENING.with(|f| f.get()) {
        return None;
    }
    FLATTENING.with(|f| f.set(true));
    let out = flatten_call_inner(n, func, args, cx, ann, direct);
    FLATTENING.with(|f| f.set(false));
    out
}

fn flatten_call_inner(n: &N, func: &N, args: &[N], cx: &Cx, ann: &Ann, direct: bool) -> Option<N> {
    let Data::Func { kind, name, args: params, body, .. } = &func.data else {
        return None;
    };
    if args.iter().any(|a| matches!(a.data, Data::Spread { .. })) || uses_arguments(func) || cx.parent_is_class() {
        return None;
    }
    if name.is_some() && matches!(kind, FuncKind::Expr) {
        return None;
    }
    if !matches!(kind, FuncKind::Expr | FuncKind::Arrow | FuncKind::Decl) {
        return None;
    }
    let returned = can_flatten_body(body, cx.opts.inline)?;
    // `exp === fn`, an `@__INLINE__` call, or a single-use fixed lambda.
    let single_ref = !direct
        && cx.opts.unused
        && def_flag(_expr_of(n), cx, |d| d.ref_count() == 1 && d.recursive_refs == 0)
        && !inside_own_lambda(_expr_of(n), func, cx)
        && cx.syms.as_ref().is_none_or(|table| {
            let site = cx.parents.iter().rev().find_map(|p| table.scope_of(p)).or(Some(0));
            crate::reduce_vars::lambda_is_constant(func, table, site)
        })
        && !free_ref_shadowed(func, cx);
    if !direct && !ann.inline_ && !single_ref {
        return None;
    }
    if ann.pure || ann.noinline || contains_this(func) || cx.in_default_assign() {
        return None;
    }
    // terser `scope_encloses_variables_in_this_scope(nearest_scope, fn)`.
    if free_ref_shadowed(func, cx) {
        return None;
    }
    let inj = can_inject_symbols(func, params, body, cx)?;
    // `flatten_args`
    let mut decls: Vec<N> = Vec::new();
    let mut exprs: Vec<N> = Vec::new();
    let mut declared: HashSet<String> = HashSet::new();
    for i in (params.len()..args.len()).rev() {
        exprs.push(Rc::clone(&args[i]));
    }
    for i in (0..params.len()).rev() {
        let p = &params[i];
        let value = args.get(i).cloned();
        let pname = match &p.data {
            Data::Symbol { name, .. } if !param_unused(p, body) => Some(name.clone()),
            _ => None,
        };
        match pname {
            Some(pn) if !inj.conflicts(&pn) => {
                let value = value.or_else(|| inj.in_loop.then(|| void0(n)));
                append_var(&mut decls, &mut exprs, &mut declared, &inj, p, &pn, value, n, cx);
            }
            _ => {
                if let Some(v) = value {
                    exprs.push(v);
                }
            }
        }
    }
    decls.reverse();
    exprs.reverse();
    // `flatten_vars`
    let mut pos = exprs.len();
    for stat in body {
        let Data::Defs { kind: ast::DefKind::Var, defs, .. } = &stat.data else { continue };
        for d in defs {
            let Data::VarDef { name: vn, value } = &d.data else { continue };
            let Some(vname) = sym_str(vn).map(str::to_string) else { continue };
            append_var(&mut decls, &mut exprs, &mut declared, &inj, vn, &vname, value.clone(), n, cx);
            if inj.in_loop && params.iter().all(|a| sym_str(a) != Some(vname.as_str())) {
                let sym = ref_sym(vn, &vname);
                same_def(vn, &sym, cx);
                exprs.insert(pos, atom(d, Data::Assign { op: "=".into(), left: sym, right: void0(vn), logical: false }));
                pos += 1;
            }
        }
    }
    exprs.push(returned);
    for name in &declared {
        let reads = count_reads(body, name);
        let writes = exprs.iter().filter(|e| matches!(&e.data, Data::Assign { left, .. } if sym_str(left) == Some(name.as_str()))).count();
        cx.injected_refs.borrow_mut().insert((inj.key, name.clone()), reads + writes);
    }
    if !declared.is_empty() {
        cx.injected.borrow_mut().entry(inj.key).or_default().extend(declared.iter().cloned());
        if let crate::ScopeKey::Index(index) = inj.key {
            if let Some(table) = cx.syms.as_ref() {
                table.injected_vars.borrow_mut().entry(index).or_default().extend(declared.iter().cloned());
            }
        }
    }
    if !decls.is_empty() {
        let var = atom(func, Data::Defs { kind: ast::DefKind::Var, defs: decls, await_: false });
        cx.pending_vars.borrow_mut().push((inj.stmt, var));
    }
    // `expressions.map(exp => exp.clone(true))` (inline.js 673): copies without
    // optimizer flags, so a later descend optimizes them again.
    let exprs = exprs.iter().map(|e| fresh_copy(e, cx)).collect();
    let out = crate::sequence::make_and_optimize(n, exprs, cx);
    // terser `make_sequence(self, ...).optimize(compressor)`: a lone lambda
    // (the returned `stat.value.clone(true)`) gets its `tighten_body` now.
    if matches!(out.data, Data::Func { .. }) {
        cx.pre_tighten.borrow_mut().insert(out.id());
    }
    Some(out)
}

/// terser `inline.js` `is_recursive_ref`: the reference sits inside the
/// lambda it names.
fn inside_own_lambda(expr: &N, func: &N, cx: &Cx) -> bool {
    let name = sym_str(expr);
    cx.parents.iter().any(|p| {
        Rc::ptr_eq(p, func)
            || matches!(&p.data, Data::Func { name: Some(fname), .. } if sym_str(fname) == name)
            || matches!(&p.data, Data::VarDef { name: vn, value: Some(v) } if sym_str(vn) == name && matches!(v.data, Data::Func { .. }))
    })
}

/// terser `inference.js` `all_refs_local` with a scope: every name `func`
/// reads from outside must resolve to the same binding at the call site.
fn free_ref_shadowed(func: &N, cx: &Cx) -> bool {
    let Some(table) = cx.syms.as_ref() else { return false };
    let site = cx.parents.iter().rev().find_map(|p| table.scope_of(p));
    let Some(site) = site else { return false };
    let mut free: Vec<N> = Vec::new();
    fn rec(n: &N, bound: &mut Vec<HashSet<String>>, out: &mut Vec<N>) {
        match &n.data {
            Data::Symbol { name, kind: SymKind::Ref, .. } => {
                if !bound.iter().any(|b| b.contains(name)) {
                    out.push(Rc::clone(n));
                }
            }
            Data::Func { name, args, body, .. } => {
                let mut own = HashSet::new();
                if let Some(nm) = name {
                    binding_names(nm, &mut own);
                }
                for a in args {
                    binding_names(a, &mut own);
                }
                hoisted_names(body, &mut own);
                bound.push(own);
                for a in args {
                    rec(a, bound, out);
                }
                for st in body {
                    rec(st, bound, out);
                }
                bound.pop();
            }
            other => {
                kids_any(other, |c| { rec(c, bound, out); false }, true);
            }
        }
    }
    rec(func, &mut Vec::new(), &mut free);
    // terser `pulled_scope.enclosed`: only definitions outside `func` count. A
    // name declared in a nested block of `func` (a `for (let i ...)`) is not
    // free even when the name stack above misses it.
    let func_scope = table.scope_of(func);
    let inside_func = |mut sc: usize| -> bool {
        let Some(fs) = func_scope else { return false };
        loop {
            if sc == fs {
                return true;
            }
            match table.scope_parent.get(sc).copied().flatten() {
                Some(p) => sc = p,
                None => return false,
            }
        }
    };
    for r in free {
        let Data::Symbol { name, .. } = &r.data else { continue };
        let target = table.def_of(&r).map(|id| table.defs[id].scope);
        if target.is_some_and(|t| inside_func(t)) {
            continue;
        }
        let mut cur = Some(site);
        while let Some(sc) = cur {
            if Some(sc) == target {
                break;
            }
            if let Some(ids) = table.scope_defs.get(&sc) {
                if ids.iter().any(|id| table.defs[*id].name == *name && !table.defs[*id].undeclared) {
                    return true;
                }
            }
            cur = table.scope_parent.get(sc).copied().flatten();
        }
    }
    false
}

fn _expr_of(n: &N) -> &N {
    match &n.data {
        Data::Call { expr, .. } => expr,
        _ => n,
    }
}

/// Reads of `name` in `body` that resolve to the function's own binding.
fn count_reads(body: &[N], name: &str) -> usize {
    fn rec(n: &N, name: &str) -> usize {
        match &n.data {
            Data::Symbol { name: got, kind: SymKind::Ref, .. } if got == name => 1,
            Data::Func { name: fname, args, body, .. } => {
                if fname.as_ref().and_then(sym_str) == Some(name) || args.iter().any(|a| binds(a, name)) {
                    return 0;
                }
                body.iter().map(|s| rec(s, name)).sum()
            }
            _ => {
                let mut c = 0;
                ast::transform_children(n, &mut |k| c += rec(k, name));
                c
            }
        }
    }
    body.iter().map(|s| rec(s, name)).sum()
}

fn ref_sym(span: &N, name: &str) -> N {
    atom(span, Data::Symbol { name: name.to_string(), kind: SymKind::Ref, quote: None })
}

/// terser `make_node(AST_SymbolRef, name, name)`: the new symbol keeps the
/// parameter's (or var's) definition.
fn same_def(from: &N, to: &N, cx: &Cx) {
    if let Some(table) = cx.syms.as_ref() {
        table.copy_binding(from, to);
    }
}

#[allow(clippy::too_many_arguments)]
fn append_var(decls: &mut Vec<N>, exprs: &mut Vec<N>, declared: &mut HashSet<String>, inj: &Inject, span: &N, name: &str, value: Option<N>, call: &N, cx: &Cx) {
    // terser `already_appended`: the scope already has the name (a parameter
    // and a `var` with the same name).
    if !declared.contains(name) && !inj.scope_vars.contains(name) {
        declared.insert(name.to_string());
        let sym = atom(span, Data::Symbol { name: name.to_string(), kind: SymKind::Var, quote: None });
        same_def(span, &sym, cx);
        decls.push(atom(span, Data::VarDef { name: sym, value: None }));
    }
    if let Some(v) = value {
        let left = ref_sym(span, name);
        same_def(span, &left, cx);
        exprs.push(atom(call, Data::Assign { op: "=".into(), left, right: v, logical: false }));
    }
}

/// A parameter terser's `drop_unused` would flag `UNUSED`: never read in the body.
fn param_unused(p: &N, body: &[N]) -> bool {
    match &p.data {
        Data::Symbol { name, .. } => !refs_name(body, name),
        _ => true,
    }
}

/// terser `can_flatten_body` and `return_value`.
fn can_flatten_body(body: &[N], inline: i32) -> Option<N> {
    let ret = |stat: Option<&N>, span: &N| -> Option<N> {
        match stat {
            None => Some(void0(span)),
            Some(s) => match &s.data {
                Data::Return { value: Some(v) } => Some(Rc::clone(v)),
                Data::Return { value: None } => Some(void0(s)),
                Data::Simple { body } => Some(unary(s, "void", Rc::clone(body))),
                _ => None,
            },
        }
    };
    let span = body.first()?;
    if inline < 3 {
        return if body.len() == 1 { ret(body.first(), span) } else { None };
    }
    let mut stat: Option<&N> = None;
    for line in body {
        match &line.data {
            Data::Defs { kind: ast::DefKind::Var, defs, .. } => {
                if stat.is_some() && !defs.iter().all(|d| matches!(d.data, Data::VarDef { value: None, .. })) {
                    return None;
                }
            }
            _ if stat.is_some() => return None,
            Data::Empty => {}
            _ => stat = Some(line),
        }
    }
    ret(stat, span)
}

struct Inject {
    /// Id of the statement in the scope body that holds the call.
    stmt: ast::NodeId,
    in_loop: bool,
    /// Names bound or referenced in the target scope and its parents
    /// (terser `conflicting_def`).
    taken: HashSet<String>,
    /// Names the target scope already declares (`scope.variables`).
    scope_vars: HashSet<String>,
    key: crate::ScopeKey,
}

impl Inject {
    fn conflicts(&self, name: &str) -> bool {
        self.taken.contains(name)
    }
}

/// terser `can_inject_symbols`.
fn can_inject_symbols(func: &N, params: &[N], body: &[N], cx: &Cx) -> Option<Inject> {
    let mut block_scoped: HashSet<String> = HashSet::new();
    let mut in_loop = false;
    let stack = &cx.parents;
    if stack.len() < 2 {
        return None;
    }
    let mut i = stack.len() - 1;
    let scope_idx = loop {
        if i == 0 {
            return None;
        }
        i -= 1;
        let node = &stack[i];
        // `scope.block_scope.variables`: every `let` / `const` of the block
        // scope as the pass started, all cases of a `switch` included.
        if !matches!(node.data, Data::Toplevel { .. } | Data::Func { .. } | Data::StaticBlock { .. } | Data::Class { .. }) {
            if let Some(table) = &cx.syms {
                if let Some(defs) = table.scope_of(node).and_then(|id| table.scope_defs.get(&id)) {
                    block_scoped.extend(defs.iter().map(|&d| table.defs[d].name.clone()));
                }
            }
        }
        match &node.data {
            // The lambda a reference's `fixed.optimize()` is tightening is not on terser's
            // stack; the reference below it is.
            Data::Func { .. } if cx.foreign_lambda == Some(node.id()) => {}
            Data::Toplevel { .. } | Data::Func { .. } | Data::StaticBlock { .. } => break i,
            Data::Class { .. } => return None,
            // `scope instanceof AST_SymbolRef && scope.fixed_value() instanceof AST_Scope`.
            Data::Symbol { kind: ast::SymKind::Ref, .. }
                if cx.syms.as_ref().filter(|t| !t.unfixed_ref(node)).and_then(|t| t.def_of(node).and_then(|d| t.defs[d].fixed.clone()))
                    .is_some_and(|f| matches!(f.data, Data::Func { .. } | Data::Class { .. })) =>
            {
                return None;
            }
            Data::Block { body } | Data::Default { body } | Data::Case { body, .. } => lexical_names(body, &mut block_scoped),
            Data::Catch { arg, .. } => {
                if let Some(a) = arg {
                    binding_names(a, &mut block_scoped);
                }
            }
            Data::For { init, .. } => {
                in_loop = true;
                if let Some(init) = init {
                    lexical_names(std::slice::from_ref(init), &mut block_scoped);
                }
            }
            Data::ForIn { init, .. } | Data::ForOf { init, .. } => {
                in_loop = true;
                lexical_names(std::slice::from_ref(init), &mut block_scoped);
            }
            Data::While { .. } | Data::Do { .. } => in_loop = true,
            _ => {}
        }
    };
    let scope = &stack[scope_idx];
    let stmt = stack.get(scope_idx + 1)?.id();
    let is_top = matches!(scope.data, Data::Toplevel { .. });
    let safe_to_inject = !is_top || cx.opts.toplevel_vars;
    let inline = cx.opts.inline;
    // `conflicting_def`: names declared in this scope or any parent, and names
    // this scope's code reads from outside it.
    let mut taken: HashSet<String> = HashSet::new();
    for frame in &cx.locals {
        taken.extend(frame.iter().cloned());
    }
    match &cx.syms {
        // terser `conflicting_def` walks `parent_scope` from the defun scope:
        // each scope's `variables` (as `figure_out_scope` left them at the start
        // of the pass) and `enclosed`. A scope's `enclosed` only adds definitions
        // of that scope or an outer one, so beyond the chain's own variables it
        // adds only the globals, which the binder keeps on the toplevel scope. A
        // `let` / `const` in a nested block is in neither.
        Some(table) => {
            // The chain is the tree's current ancestry (`add_child_scope`
            // reparents an inlined lambda), ending at the toplevel.
            let ids = stack[..=scope_idx].iter().filter_map(|n| table.scope_of(n));
            for id in ids.chain(std::iter::once(0)) {
                if let Some(defs) = table.scope_defs.get(&id) {
                    taken.extend(defs.iter().map(|&d| table.defs[d].name.clone()));
                }
                // `append_var` adds a flattened call's names to that scope's
                // `variables`.
                if let Some(names) = cx.injected.borrow().get(&crate::ScopeKey::Index(id)) {
                    taken.extend(names.iter().cloned());
                }
            }
        }
        None => {
            let free = cx.cached_names(scope, 1, |sc| {
                let mut set = HashSet::new();
                free_refs(sc, &mut set);
                set
            });
            taken.extend(free.iter().cloned());
        }
    }
    let mut scope_vars: HashSet<String> = HashSet::new();
    match &scope.data {
        Data::Func { args, body, .. } => {
            for a in args {
                binding_names(a, &mut scope_vars);
            }
            hoisted_names(body, &mut scope_vars);
        }
        Data::Toplevel { body } | Data::StaticBlock { body } => hoisted_names(body, &mut scope_vars),
        _ => {}
    }
    // Names earlier flattens added to this scope (`scope.variables`).
    let key = match cx.syms.as_ref().and_then(|t| t.scope_of(scope)) {
        Some(index) => crate::ScopeKey::Index(index),
        None => crate::ScopeKey::Node(scope.id()),
    };
    if let Some(names) = cx.injected.borrow().get(&key) {
        taken.extend(names.iter().cloned());
        scope_vars.extend(names.iter().cloned());
    }
    taken.extend(scope_vars.iter().cloned());
    let atom_name = |n: &str| matches!(n, "Infinity" | "NaN" | "undefined");
    let mut injected: Vec<String> = Vec::new();
    // `can_inject_vars`
    for stat in body {
        let Data::Defs { kind: ast::DefKind::Var, defs, .. } = &stat.data else { continue };
        if !(inline >= 3 && safe_to_inject) {
            return None;
        }
        for d in defs.iter().rev() {
            let Data::VarDef { name, .. } = &d.data else { return None };
            let Some(vn) = sym_str(name) else { return None };
            if block_scoped.contains(vn) || atom_name(vn) || taken.contains(vn) {
                return None;
            }
            injected.push(vn.to_string());
        }
    }
    // `can_inject_args`
    for p in params {
        match &p.data {
            Data::DefaultAssign { left, .. } => {
                if param_unused(left, body) {
                    continue;
                }
                return None;
            }
            Data::Destructuring { .. } => return None,
            Data::Spread { expr } => {
                if param_unused(expr, body) {
                    continue;
                }
                return None;
            }
            _ => {}
        }
        if param_unused(p, body) {
            continue;
        }
        let Some(pn) = sym_str(p) else { return None };
        if !(inline >= 2 && safe_to_inject) || block_scoped.contains(pn) || atom_name(pn) || taken.contains(pn) {
            return None;
        }
        injected.push(pn.to_string());
    }
    // `is_reachable(fn, in_loop)`: a closure inside `fn` that captures an
    // injected name would share it across iterations.
    if in_loop && !injected.is_empty() {
        let captured = body.iter().any(|s| closure_reads(s, &injected));
        if captured {
            return None;
        }
    }
    let _ = func;
    Some(Inject { stmt, in_loop, taken, scope_vars, key })
}

fn closure_reads(n: &N, names: &[String]) -> bool {
    match &n.data {
        Data::Func { body, args, .. } => names.iter().any(|nm| refs_name(body, nm) || args.iter().any(|a| node_refs(a, nm))),
        Data::Class { .. } => names.iter().any(|nm| node_refs(n, nm)),
        other => kids_any(other, |c| closure_reads(c, names), true),
    }
}

fn binding_names(n: &N, out: &mut HashSet<String>) {
    match &n.data {
        Data::Symbol { name, .. } => {
            out.insert(name.clone());
        }
        Data::Destructuring { names, .. } => names.iter().for_each(|x| binding_names(x, out)),
        Data::DefaultAssign { left, .. } | Data::Spread { expr: left } => binding_names(left, out),
        Data::Prop { value, .. } => binding_names(value, out),
        Data::VarDef { name, .. } => binding_names(name, out),
        _ => {}
    }
}

fn lexical_names(body: &[N], out: &mut HashSet<String>) {
    for s in body {
        match &s.data {
            Data::Defs { kind: ast::DefKind::Let | ast::DefKind::Const | ast::DefKind::Using, defs, .. } => {
                defs.iter().for_each(|d| binding_names(d, out));
            }
            Data::Class { stmt: true, name: Some(nm), .. } => binding_names(nm, out),
            Data::Func { kind: FuncKind::Decl, name: Some(nm), .. } => binding_names(nm, out),
            _ => {}
        }
    }
}

fn hoisted_names(body: &[N], out: &mut HashSet<String>) {
    fn rec(n: &N, out: &mut HashSet<String>) {
        match &n.data {
            Data::Defs { kind: ast::DefKind::Var, defs, .. } => defs.iter().for_each(|d| binding_names(d, out)),
            Data::Func { kind: FuncKind::Decl, name: Some(nm), .. } => binding_names(nm, out),
            Data::Func { .. } | Data::Class { .. } => {}
            other => kids_any(other, |c| { rec(c, out); false }, true).then_some(()).unwrap_or(()),
        }
    }
    for s in body {
        rec(s, out);
    }
    lexical_names(body, out);
}

/// Names read in `scope` that are not bound by a function or block scope
/// nested in it (terser `enclosed`). Only used without a symbol table.
fn free_refs(scope: &N, out: &mut HashSet<String>) {
    fn rec(n: &N, bound: &mut Vec<HashSet<String>>, out: &mut HashSet<String>) {
        match &n.data {
            Data::Symbol { name, kind: SymKind::Ref, .. } => {
                if !bound.iter().any(|b| b.contains(name)) {
                    out.insert(name.clone());
                }
            }
            Data::Func { name, args, body, .. } => {
                let mut own = HashSet::new();
                if let Some(nm) = name {
                    binding_names(nm, &mut own);
                }
                for a in args {
                    binding_names(a, &mut own);
                }
                hoisted_names(body, &mut own);
                bound.push(own);
                for a in args {
                    rec(a, bound, out);
                }
                for s in body {
                    rec(s, bound, out);
                }
                bound.pop();
            }
            // Block scopes: their `let` / `const` / class names (and a catch
            // parameter) are not in the enclosing scope's `enclosed`.
            Data::Block { .. } | Data::StaticBlock { .. } | Data::Switch { .. } | Data::For { .. } | Data::ForIn { .. } | Data::ForOf { .. } | Data::Catch { .. } => {
                let mut own = HashSet::new();
                match &n.data {
                    Data::Block { body } | Data::StaticBlock { body } => lexical_names(body, &mut own),
                    Data::Switch { body, .. } => {
                        for arm in body {
                            if let Data::Case { body, .. } | Data::Default { body } = &arm.data {
                                lexical_names(body, &mut own);
                            }
                        }
                    }
                    Data::For { init: Some(init), .. } | Data::ForIn { init, .. } | Data::ForOf { init, .. } => {
                        lexical_names(std::slice::from_ref(init), &mut own)
                    }
                    Data::Catch { arg: Some(arg), .. } => binding_names(arg, &mut own),
                    _ => {}
                }
                bound.push(own);
                kids_any(&n.data, |c| { rec(c, bound, out); false }, true);
                bound.pop();
            }
            other => {
                kids_any(other, |c| { rec(c, bound, out); false }, true);
            }
        }
    }
    let mut bound = Vec::new();
    match &scope.data {
        Data::Func { body, .. } | Data::Toplevel { body } | Data::StaticBlock { body } => {
            for s in body {
                rec(s, &mut bound, out);
            }
        }
        _ => {}
    }
}

fn drop_empty_call(n: &N, func: &N, args: &[N], cx: &Cx) -> Option<N> {
    if !cx.opts.side_effects {
        return None;
    }
    let Data::Func { body, async_, generator, .. } = &func.data else {
        return None;
    };
    if *async_ || *generator || !body.iter().all(is_empty_stmt) {
        return None;
    }
    let mut exprs: Vec<N> = args.to_vec();
    exprs.push(void0(n));
    Some(crate::sequence::make_and_optimize(n, exprs, cx))
}

fn is_empty_stmt(n: &N) -> bool {
    match &n.data {
        Data::Empty => true,
        Data::Block { body } => body.iter().all(is_empty_stmt),
        _ => false,
    }
}

/// terser `index.js` `def_optimize(AST_New)`.
fn optimize_new(n: &N, cx: &Cx) -> Option<N> {
    if !cx.opts.unsafe_opt {
        return None;
    }
    let Data::Call { expr, args, is_new: true, optional } = &n.data else {
        return None;
    };
    if *optional || !undeclared(expr, cx, &["Object", "RegExp", "Function", "Error", "Array"]) {
        return None;
    }
    // new: `make_node(AST_Call, self, self)`, a copy of the `new` (index.js 2046).
    let call = atom(
        n,
        Data::Call { expr: Rc::clone(expr), args: args.clone(), optional: false, is_new: false },
    );
    Some(polish(call, cx))
}

/// `unsafe` constructor folds in `def_optimize(AST_Call)`. `console.assert` is omitted.
fn unsafe_call(n: &N, expr: &N, args: &[N], cx: &Cx) -> Option<N> {
    if let Data::Dot { expr: recv, prop, optional, .. } = &expr.data {
        if !*optional && prop == "from" && args.len() == 1 && sym_str(recv) == Some("Array") && !cx.declared_ref(recv, "Array") {
            if let Data::Array { elements } = &args[0].data {
                return Some(atom(n, Data::Array { elements: elements.clone() }));
            }
        }
        return None;
    }
    let Data::Symbol { name, kind: SymKind::Ref, .. } = &expr.data else {
        return None;
    };
    if !undeclared(expr, cx, &[name.as_str()]) {
        return None;
    }
    match name.as_str() {
        "Array" if args.len() != 1 => Some(atom(n, Data::Array { elements: args.to_vec() })),
        "Array" => match &args[0].data {
            Data::Number { value, .. } if *value <= 11.0 => {
                let count = if *value > 0.0 { value.ceil() as usize } else { 0 };
                let elements = (0..count).map(|_| atom(n, Data::Hole)).collect();
                Some(atom(n, Data::Array { elements }))
            }
            _ => None,
        },
        "Object" if args.is_empty() => Some(atom(n, Data::Object { props: Vec::new() })),
        "String" if args.is_empty() => Some(string(n, String::new())),
        "String" if args.len() == 1 => Some(binary(n, "+", Rc::clone(&args[0]), string(n, String::new()))),
        "Number" if args.is_empty() => Some(num(n, 0.0)),
        "Number" if args.len() == 1 && cx.opts.unsafe_math => Some(unary(n, "+", Rc::clone(&args[0]))),
        "Boolean" if args.is_empty() => Some(atom(n, Data::False)),
        "Boolean" if args.len() == 1 => Some(unary(n, "!", unary(n, "!", Rc::clone(&args[0])))),
        _ => None,
    }
}

/// terser `inference.js` `is_undeclared_ref`: `definition().undeclared`.
/// Without a symbol table (or for a node it does not know) the name stack
/// decides; it holds the names hoisted onto the root locals frame.
fn undeclared(expr: &N, cx: &Cx, names: &[&str]) -> bool {
    let Data::Symbol { name, kind: SymKind::Ref, .. } = &expr.data else {
        return false;
    };
    names.contains(&name.as_str()) && !cx.declared_ref(expr, name)
}

fn contains_optional(n: &N) -> bool {
    match &n.data {
        Data::Dot { optional, expr, .. } | Data::Sub { optional, expr, .. } | Data::Call { optional, expr, .. } => {
            *optional || contains_optional(expr)
        }
        Data::Chain { .. } => true,
        _ => false,
    }
}

/// terser `index.js` `inline_array_like_spread`.
fn inline_array_like_spread(args: &[N]) -> (Vec<N>, bool) {
    let mut out = Vec::new();
    let mut changed = false;
    for arg in args {
        if let Data::Spread { expr } = &arg.data {
            if let Data::Array { elements } = &expr.data {
                if elements.iter().all(|el| !matches!(el.data, Data::Hole)) {
                    out.extend(elements.iter().cloned());
                    changed = true;
                    continue;
                }
            }
        }
        out.push(Rc::clone(arg));
    }
    (out, changed)
}

fn trim_unused(func: &N, args: &[N], direct: bool, cx: &Cx) -> (Option<N>, Vec<N>, bool) {
    // `def_optimize(AST_Call)` returns before trimming when the function is pinned.
    if fn_pinned(func) || args.iter().any(|a| matches!(a.data, Data::Spread { .. })) {
        return (Some(Rc::clone(func)), args.to_vec(), false);
    }
    let Data::Func { args: params, body, .. } = &func.data else {
        return (Some(Rc::clone(func)), args.to_vec(), false);
    };
    // The IIFE's unused parameters are popped later, by `drop_unused` (du 262-285).
    // terser reads the parameters' `UNUSED` flags, which `drop_unused` sets
    // after the function's own body is optimized: a call from inside the
    // callee sees none.
    let flagged = cx.is_squeezed(func) || cx.is_optimized(func);
    let processed = direct || flagged;
    let inside_callee = !processed || cx.parents.iter().any(|p| {
        Rc::ptr_eq(p, func)
            || matches!((&p.data, &func.data), (Data::Func { name: Some(a), .. }, Data::Func { name: Some(b), .. }) if sym_str(a).is_some() && sym_str(a) == sym_str(b) && params_same(p, func))
    });
    // `drop_unused` flags a parameter `UNUSED` on its symbol: a plain one, or
    // the expression of a rest parameter. A default or a pattern (the flag is
    // on its `left`, not on `argnames[i]`) is never trimmed. A read in another
    // parameter's default keeps a parameter in use.
    let unused_sym = |p: &N| !inside_callee && is_simple_funarg(p) && sym_str(p).is_some_and(|name| !refs_name(body, name) && !refs_name(params, name));
    let mut kept = Vec::new();
    let mut last = 0usize;
    let mut i = 0;
    while i < args.len() {
        let arg = &args[i];
        if let Some(Data::Spread { expr: rest }) = params.get(i).map(|p| &p.data) {
            if unused_sym(rest) {
                for a in &args[i..] {
                    if let Some(node) = crate::unary::drop_side_effect_free(a, cx, false) {
                        kept.push(node);
                    }
                }
            } else {
                kept.extend(args[i..].iter().cloned());
            }
            last = kept.len();
            break;
        }
        i += 1;
        let extra = i > params.len();
        let unused = extra || unused_sym(&params[i - 1]);
        if unused {
            // terser `self.args[i].drop_side_effect_free(compressor)`.
            match crate::unary::drop_side_effect_free(arg, cx, false) {
                Some(node) => kept.push(node),
                None if !extra => {
                    kept.push(num(arg, 0.0));
                    continue;
                }
                None => {}
            }
        } else {
            kept.push(Rc::clone(arg));
        }
        last = kept.len();
    }
    kept.truncate(last);
    let args_changed = kept.len() != args.len() || kept.iter().zip(args.iter()).any(|(a, b)| !Rc::ptr_eq(a, b));
    (Some(Rc::clone(func)), kept, args_changed)
}

fn params_same(a: &N, b: &N) -> bool {
    match (&a.data, &b.data) {
        (Data::Func { args: x, .. }, Data::Func { args: y, .. }) => x.len() == y.len() && x.iter().zip(y).all(|(p, q)| sym_str(p) == sym_str(q)),
        _ => false,
    }
}

fn is_simple_funarg(n: &N) -> bool {
    matches!(n.data, Data::Symbol { kind: SymKind::Funarg, .. })
}

fn fn_pinned(func: &N) -> bool {
    let Data::Func { body, .. } = &func.data else {
        return false;
    };
    body.iter().any(pinned_node)
}

fn pinned_node(n: &N) -> bool {
    match &n.data {
        Data::With { .. } => true,
        Data::Func { .. } => false,
        Data::Call { expr, .. } if sym_str(expr) == Some("eval") => true,
        other => kids_any(other, pinned_node, true),
    }
}

fn uses_arguments(func: &N) -> bool {
    let Data::Func { kind, body, .. } = &func.data else {
        return false;
    };
    if matches!(kind, FuncKind::Arrow) {
        return false;
    }
    body.iter().any(mentions_arguments)
}

fn mentions_arguments(n: &N) -> bool {
    match &n.data {
        Data::Symbol { name, kind: SymKind::Ref, .. } if name == "arguments" => true,
        Data::Func { .. } => false,
        other => kids_any(other, mentions_arguments, true),
    }
}

fn refs_name(body: &[N], name: &str) -> bool {
    body.iter().any(|s| node_refs(s, name))
}

fn node_refs(n: &N, name: &str) -> bool {
    match &n.data {
        Data::Symbol { name: got, kind: SymKind::Ref, .. } if got == name => true,
        Data::Func { name: fname, args, body, .. } => {
            let shadows = fname.as_ref().and_then(sym_str) == Some(name) || args.iter().any(|a| binds(a, name));
            if shadows {
                return false;
            }
            refs_name(body, name) || args.iter().any(|a| node_refs(a, name))
        }
        other => kids_any(other, |c| node_refs(c, name), true),
    }
}

fn binds(n: &N, name: &str) -> bool {
    match &n.data {
        Data::Symbol { name: got, .. } => got == name,
        Data::DefaultAssign { left, .. } | Data::Spread { expr: left } => binds(left, name),
        Data::Destructuring { names, .. } => names.iter().any(|n| binds(n, name)),
        _ => false,
    }
}

fn is_prop_access(n: &N) -> bool {
    matches!(n.data, Data::Dot { .. } | Data::Sub { .. })
}

fn contains_this(func: &N) -> bool {
    let Data::Func { body, .. } = &func.data else {
        return false;
    };
    body.iter().any(has_this)
}

fn has_this(n: &N) -> bool {
    match &n.data {
        Data::This => true,
        Data::Func { .. } => false,
        other => kids_any(other, has_this, true),
    }
}

fn single_result(body: &[N]) -> Option<N> {
    let mut meaningful = body.iter().filter(|s| !matches!(s.data, Data::Empty));
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

fn blocked(n: &N) -> bool {
    match &n.data {
        Data::This | Data::Super | Data::NewTarget => true,
        Data::Symbol { name, .. } if name == "arguments" => true,
        Data::Func { .. } | Data::Class { .. } => true,
        other => kids_any(other, blocked, true),
    }
}

fn is_constant_expr(n: &N) -> bool {
    match &n.data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Infinity
        | Data::RegExp { .. }
        | Data::BigInt { .. } => true,
        Data::Unary { op, expr, .. } if !matches!(op.as_str(), "++" | "--" | "delete") => is_constant_expr(expr),
        Data::Binary { op, left, right } if !op.ends_with('=') => is_constant_expr(left) && is_constant_expr(right),
        Data::Array { elements } => elements.iter().all(is_constant_expr),
        Data::Object { props } => props.iter().all(|p| match &p.data {
            Data::Prop { method: None, key, value, .. } => match key {
                Key::Computed(expr) => is_constant_expr(expr) && is_constant_expr(value),
                _ => is_constant_expr(value),
            },
            _ => false,
        }),
        Data::Func { .. } => lambda_constant(n),
        _ => false,
    }
}

fn lambda_constant(n: &N) -> bool {
    let Data::Func { kind, name, args, body, .. } = &n.data else {
        return false;
    };
    let mut bound = HashSet::new();
    if let Some(name) = name.as_ref().and_then(sym_str) {
        bound.insert(name.to_string());
    }
    for arg in args {
        if let Some(name) = sym_str(arg) {
            bound.insert(name.to_string());
        }
    }
    for stmt in body {
        if let Data::Defs { defs, .. } = &stmt.data {
            for def in defs {
                if let Data::VarDef { name, .. } = &def.data {
                    if let Some(name) = sym_str(name) {
                        bound.insert(name.to_string());
                    }
                }
            }
        }
    }
    let arrow = matches!(kind, FuncKind::Arrow);
    !body.iter().any(|s| has_free(s, &bound, arrow))
}

fn has_free(n: &N, bound: &HashSet<String>, arrow: bool) -> bool {
    match &n.data {
        Data::This if arrow => true,
        Data::Symbol { name, kind: SymKind::Ref, .. } => !bound.contains(name),
        Data::Func { name, args, body, .. } => {
            let mut inner = bound.clone();
            if let Some(name) = name.as_ref().and_then(sym_str) {
                inner.insert(name.to_string());
            }
            for arg in args {
                if let Some(name) = sym_str(arg) {
                    inner.insert(name.to_string());
                }
            }
            body.iter().any(|s| has_free(s, &inner, arrow))
        }
        other => kids_any(other, |c| has_free(c, bound, arrow), true),
    }
}

/// `None` means this node may hide a reference. Callers then assume the name is used.
fn kids_any(data: &Data, mut f: impl FnMut(&N) -> bool, unknown_is_hit: bool) -> bool {
    match kid_list(data) {
        None => unknown_is_hit,
        Some(kids) => kids.iter().any(|n| f(n)),
    }
}

fn kid_list(data: &Data) -> Option<Vec<&N>> {
    let mut out = Vec::new();
    let handled = match data {
        Data::Number { .. }
        | Data::String { .. }
        | Data::BigInt { .. }
        | Data::RegExp { .. }
        | Data::True
        | Data::False
        | Data::Null
        | Data::Infinity
        | Data::This
        | Data::Super
        | Data::NewTarget
        | Data::Empty
        | Data::Debugger
        | Data::Hole
        | Data::ImportMeta
        | Data::Directive { .. }
        | Data::Symbol { .. } => true,
        Data::Simple { body }
        | Data::Throw { value: body }
        | Data::Spread { expr: body }
        | Data::Unary { expr: body, .. }
        | Data::Await { expr: body }
        | Data::Return { value: Some(body) }
        | Data::Dot { expr: body, .. }
        | Data::Chain { expr: body }
        | Data::Finally { body } => {
            out.push(body);
            true
        }
        Data::Return { value: None } | Data::Break { label: None } | Data::Continue { label: None } | Data::Yield { expr: None, .. } => true,
        Data::Yield { expr: Some(body), .. } | Data::Break { label: Some(body) } | Data::Continue { label: Some(body) } => {
            out.push(body);
            true
        }
        Data::Binary { left, right, .. }
        | Data::Assign { left, right, .. }
        | Data::DefaultAssign { left, right }
        | Data::PrivateIn { key: left, value: right } => {
            out.push(left);
            out.push(right);
            true
        }
        Data::Sub { expr, prop, .. } => {
            out.push(expr);
            out.push(prop);
            true
        }
        Data::Cond { cond, cons, alt } => {
            out.push(cond);
            out.push(cons);
            out.push(alt);
            true
        }
        Data::Call { expr, args, .. } => {
            out.push(expr);
            out.extend(args.iter());
            true
        }
        Data::DynImport { args, .. } => {
            out.extend(args.iter());
            true
        }
        Data::Array { elements } | Data::Seq { exprs: elements } | Data::Block { body: elements } | Data::Default { body: elements } | Data::StaticBlock { body: elements } | Data::Toplevel { body: elements } => {
            out.extend(elements.iter());
            true
        }
        Data::Object { props } => {
            out.extend(props.iter());
            true
        }
        Data::Prop { key, value, .. } => {
            if let Key::Computed(expr) = key {
                out.push(expr);
            }
            out.push(value);
            true
        }
        Data::Field { key, value, .. } => {
            if let Key::Computed(expr) = key {
                out.push(expr);
            }
            if let Some(value) = value {
                out.push(value);
            }
            true
        }
        Data::If { cond, body, alt } => {
            out.push(cond);
            out.push(body);
            if let Some(alt) = alt {
                out.push(alt);
            }
            true
        }
        Data::For { init, cond, step, body } => {
            if let Some(v) = init { out.push(v); }
            if let Some(v) = cond { out.push(v); }
            if let Some(v) = step { out.push(v); }
            out.push(body);
            true
        }
        Data::While { cond, body } | Data::Do { body, cond } => {
            out.push(cond);
            out.push(body);
            true
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            out.push(init);
            out.push(object);
            out.push(body);
            true
        }
        Data::Switch { expr, body } => {
            out.push(expr);
            out.extend(body.iter());
            true
        }
        Data::Case { expr, body } => {
            out.push(expr);
            out.extend(body.iter());
            true
        }
        Data::Try { body, catch, finally } => {
            out.push(body);
            if let Some(v) = catch { out.push(v); }
            if let Some(v) = finally { out.push(v); }
            true
        }
        Data::Catch { arg, body } => {
            if let Some(arg) = arg { out.push(arg); }
            out.push(body);
            true
        }
        Data::Labeled { label, body } | Data::With { expr: label, body } => {
            out.push(label);
            out.push(body);
            true
        }
        Data::Class { name, extends, props, .. } => {
            if let Some(name) = name { out.push(name); }
            if let Some(extends) = extends { out.push(extends); }
            out.extend(props.iter());
            true
        }
        Data::Defs { defs, .. } => {
            out.extend(defs.iter());
            true
        }
        Data::VarDef { name, value } => {
            out.push(name);
            if let Some(value) = value { out.push(value); }
            true
        }
        Data::Destructuring { names, .. } => {
            out.extend(names.iter());
            true
        }
        Data::Func { name, args, body, .. } => {
            if let Some(name) = name { out.push(name); }
            out.extend(args.iter());
            out.extend(body.iter());
            true
        }
        Data::Template { segments } => {
            for seg in segments {
                if let ast::Seg::Expr(expr) = seg {
                    out.push(expr);
                }
            }
            true
        }
        Data::TaggedTemplate { tag, template } => {
            out.push(tag);
            out.push(template);
            true
        }
        _ => false,
    };
    if handled { Some(out) } else { None }
}

fn sym_str(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name.as_str()),
        _ => None,
    }
}

/// `make_sequence(...).optimize`: drop pure non-tail expressions and fold a trailing `void`.
fn finish_seq(span: &N, exprs: Vec<N>, cx: &Cx) -> N {
    let mut flat = Vec::new();
    for expr in exprs {
        if let Data::Seq { exprs } = &expr.data {
            flat.extend(exprs.iter().cloned());
        } else {
            flat.push(expr);
        }
    }
    if cx.opts.side_effects && flat.len() > 1 {
        let last = flat.len() - 1;
        flat = flat
            .into_iter()
            .enumerate()
            .filter(|(i, e)| *i == last || !eval::is_pure(e))
            .map(|(_, e)| e)
            .collect();
        while flat.len() > 1 && is_void_pure(flat.last().unwrap()) {
            let end = flat.len() - 2;
            let prev = flat[end].clone();
            flat.truncate(end);
            flat.push(unary(span, "void", prev));
        }
    }
    if flat.len() == 1 {
        polish(flat.pop().unwrap(), cx)
    } else if flat.is_empty() {
        void0(span)
    } else {
        seq_node(span, flat)
    }
}

fn is_void_pure(n: &N) -> bool {
    match &n.data {
        Data::Unary { op, expr, prefix: true } if op == "void" => eval::is_pure(expr),
        _ => false,
    }
}

fn polish(n: N, cx: &Cx) -> N {
    OPT_DEPTH.with(|d| {
        let prev = d.get();
        d.set(prev.saturating_add(1));
        let out = eval::fold(&n, cx);
        d.set(prev);
        out
    })
}

/// new: terser `make_node(X, orig, ..)`.
fn atom(orig: &N, data: Data) -> N {
    Node::make(orig, data)
}

/// keep: an in-place edit of `orig`.
fn edit(orig: &N, data: Data) -> N {
    orig.rebuild(data)
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

fn string(orig: &N, value: String) -> N {
    let quote = if value.contains('"') && !value.contains('\'') { '\'' } else { '"' };
    atom(orig, Data::String { value, quote, units: None })
}

fn binary(orig: &N, op: &str, left: N, right: N) -> N {
    atom(orig, Data::Binary { op: op.into(), left, right })
}

fn seq_node(span: &N, exprs: Vec<N>) -> N {
    if exprs.len() == 1 {
        return exprs.into_iter().next().unwrap();
    }
    atom(span, Data::Seq { exprs })
}
