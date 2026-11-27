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
    let Data::Call { expr, args, optional, is_new } = &n.data else {
        return None;
    };
    if *is_new {
        return optimize_new(n, cx);
    }
    if *optional || cx.in_computed_key() {
        return None;
    }
    let (args, spread) = inline_array_like_spread(args);
    let ann = call_ann(n);
    let resolved = resolve_callee(expr, cx, ann.noinline);
    // Unused-argument trimming runs before `inline_into_call`, including for globals.
    let (func, args, trimmed) = match &resolved.func {
        Some(func) if cx.opts.unused && !uses_arguments(func) => trim_unused(func, &args, resolved.direct),
        _ => (resolved.func, args, false),
    };
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
        if let Some(rewritten) = inline_into_call(n, expr, func, &args, cx, &ann, resolved.direct) {
            if !resolved.direct {
                note_replaced(expr, cx);
            }
            return Some(rewritten);
        }
        if let Some(rewritten) = drop_empty_call(n, func, &args, cx) {
            if !resolved.direct {
                note_replaced(expr, cx);
            }
            return Some(rewritten);
        }
    }
    let callee = trimmed_callee(expr, func.as_ref(), trimmed, resolved.direct);
    finish_call(n, callee, &args, trimmed, spread)
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
    Some(atom(
        n,
        Data::Call { expr: Rc::clone(expr), args: args.to_vec(), optional: false, is_new: false },
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
    if retain_top(cx, &fixed) || (def_flag(expr, cx, |d| d.global) && !cx.opts.toplevel_funcs) {
        return Resolved { func: None, direct: false, stop: true };
    }
    Resolved { func: Some(fixed), direct: false, stop: false }
}

fn fixed_lambda(expr: &N, cx: &Cx) -> Option<N> {
    let Data::Symbol { kind: SymKind::Ref, .. } = &expr.data else {
        return None;
    };
    let table = cx.syms.as_ref()?;
    let id = *table.node_def.get(&crate::syms::ptr(expr))?;
    let fixed = table.defs[id].fixed.clone()?;
    matches!(fixed.data, Data::Func { .. }).then_some(fixed)
}

fn def_flag(expr: &N, cx: &Cx, f: impl FnOnce(&crate::syms::SymbolDef) -> bool) -> bool {
    let Some(table) = cx.syms.as_ref() else {
        return false;
    };
    let Some(&id) = table.node_def.get(&crate::syms::ptr(expr)) else {
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
    let Some(&id) = table.node_def.get(&crate::syms::ptr(expr)) else {
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

fn call_ann(n: &N) -> Ann {
    let mut ann = Ann { pure: false, inline_: false, noinline: false };
    mark_ann(n, &mut ann);
    if let Data::Call { expr, .. } = &n.data {
        mark_ann(expr, &mut ann);
    }
    ann
}

fn mark_ann(n: &N, ann: &mut Ann) {
    let Some(tok) = n.start.as_ref() else {
        return;
    };
    for c in &tok.comments_before {
        let v = c.value.as_str();
        if v.contains("@__PURE__") || v.contains("#__PURE__") {
            ann.pure = true;
        }
        if v.contains("@__NOINLINE__") || v.contains("#__NOINLINE__") {
            ann.noinline = true;
        } else if v.contains("@__INLINE__") || v.contains("#__INLINE__") {
            ann.inline_ = true;
        }
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
            if constant && args.iter().all(|a| !matches!(a.data, Data::Spread { .. })) {
                let mut exprs: Vec<N> = args.to_vec();
                exprs.push(value.clone().unwrap_or_else(|| void0(n)));
                return Some(finish_seq(n, exprs, cx));
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
    // terser `inline_into_call`: a single reference may inline a non-direct callee.
    // `reduce_funcs` off keeps a function declared in another scope.
    let single = !direct && cx.opts.unused && single_ref(expr, cx) && is_constant_expr(func) && !cross_scope_blocked(expr, func, cx);
    if !direct && !ann.inline_ && !single {
        return None;
    }
    if ann.pure || ann.noinline || cx.parent_is_class() || cx.nearest_scope_is_class() || cx.in_default_assign() {
        return None;
    }
    // `!(fn.name && fn instanceof AST_Function)`. A declaration is not an
    // `AST_Function`. An expression name that the body never reads was cleared
    // by `drop_unused` before this call.
    if name_blocks(kind, name.as_ref(), body) {
        return None;
    }
    if !matches!(kind, FuncKind::Expr | FuncKind::Arrow | FuncKind::Decl) {
        return None;
    }
    if params.iter().any(|p| !is_simple_funarg(p))
        || args.iter().any(|a| matches!(a.data, Data::Spread { .. }))
        || uses_arguments(func)
        || contains_this(func)
    {
        return None;
    }
    let param_used = params.iter().any(|p| sym_str(p).is_some_and(|name| refs_name(body, name)));
    let has_var = body.iter().any(|s| matches!(s.data, Data::Defs { kind: ast::DefKind::Var, .. }));
    if param_used || has_var {
        if param_used && cx.opts.inline < 2 || has_var && cx.opts.inline < 3 {
            return None;
        }
        // terser `inline.js` `flatten_fn` / `can_inject_symbols`.
        return flatten_fn(n, func, params, body, args, cx);
    }
    let returned = single_result(body)?;
    if blocked(&returned) {
        return None;
    }
    let mut exprs: Vec<N> = args.to_vec();
    exprs.push(returned);
    Some(finish_seq(n, exprs, cx))
}

fn single_ref(expr: &N, cx: &Cx) -> bool {
    let Some(table) = cx.syms.as_ref() else { return false };
    let Some(&id) = table.node_def.get(&crate::syms::ptr(expr)) else { return false };
    let def = &table.defs[id];
    def.references.len() == 1 && def.recursive_refs == 0
}

/// terser `inline_into_symbolref`: `reduce_funcs` off does not inline a lambda across scopes.
fn cross_scope_blocked(expr: &N, func: &N, cx: &Cx) -> bool {
    if cx.opts.reduce_funcs || !matches!(func.data, Data::Func { kind: FuncKind::Decl, .. }) {
        return false;
    }
    let Some(table) = cx.syms.as_ref() else { return false };
    let Some(&id) = table.node_def.get(&crate::syms::ptr(expr)) else { return false };
    let def_scope = table.defs[id].scope;
    let Some(here) = cx.parents.iter().rev().find(|p| matches!(p.data, Data::Func { .. } | Data::Toplevel { .. })) else {
        return false;
    };
    let Some(&scope) = table.node_scope.get(&crate::syms::ptr(here)) else { return false };
    def_scope != scope
}

fn name_blocks(kind: &FuncKind, name: Option<&N>, body: &[N]) -> bool {
    if !matches!(kind, FuncKind::Expr) {
        return false;
    }
    let Some(name) = name else { return false };
    sym_str(name).is_some_and(|nm| refs_name(body, nm))
}

/// terser `inline.js` `can_flatten_body` + `flatten_fn`.
fn flatten_fn(n: &N, func: &N, params: &[N], body: &[N], args: &[N], cx: &Cx) -> Option<N> {
    let scope = injection_scope(cx)?;
    let discard_void = cx.parent_is_simple();
    let (body_vars, value) = flatten_value(body, cx.opts.inline, discard_void, n)?;
    let blocked = lexical_names(cx);
    let safe = safe_scope(cx, scope);
    let mut exprs = Vec::new();
    let mut decls: Vec<String> = Vec::new();
    for arg in args.iter().skip(params.len()) {
        exprs.push(Rc::clone(arg));
    }
    for (i, param) in params.iter().enumerate() {
        let name = sym_str(param)?;
        let used = refs_name(body, name);
        let value_arg = args.get(i).cloned();
        if !used {
            if let Some(v) = value_arg {
                exprs.push(v);
            }
            continue;
        }
        if !safe || name_taken(cx, scope, name, &blocked) {
            return None;
        }
        if !decls.iter().any(|d| d == name) {
            decls.push(name.to_string());
        }
        if let Some(v) = value_arg {
            exprs.push(assign(n, sym_ref(param, name), v));
        }
    }
    for (name, init) in &body_vars {
        if !safe || name_taken(cx, scope, name, &blocked) {
            return None;
        }
        if !decls.iter().any(|d| d == name) {
            decls.push(name.clone());
        }
        if let Some(v) = init {
            exprs.push(assign(n, sym_ref(func, name), Rc::clone(v)));
        }
    }
    exprs.push(value);
    if !decls.is_empty() {
        let decl = var_decl(n, &decls);
        if !cx.inject_var(decl, &decls) {
            return None;
        }
    }
    Some(finish_seq(n, exprs, cx))
}

fn flatten_value(body: &[N], inline: i32, discard_void: bool, span: &N) -> Option<(Vec<(String, Option<N>)>, N)> {
    if inline < 3 {
        if body.len() != 1 {
            return None;
        }
        return Some((Vec::new(), stmt_value(&body[0], discard_void, span)?));
    }
    let mut stat: Option<&N> = None;
    let mut vars = Vec::new();
    for line in body {
        match &line.data {
            Data::Empty => {}
            Data::Defs { kind: ast::DefKind::Var, defs, .. } => {
                for def in defs {
                    let Data::VarDef { name, value } = &def.data else { return None };
                    let name = sym_str(name)?.to_string();
                    if stat.is_some() && value.is_some() {
                        return None;
                    }
                    vars.push((name, value.clone()));
                }
            }
            _ => {
                if stat.is_some() {
                    return None;
                }
                stat = Some(line);
            }
        }
    }
    let value = match stat {
        Some(stat) => stmt_value(stat, discard_void, span)?,
        None => void0(span),
    };
    Some((vars, value))
}

fn stmt_value(stat: &N, discard_void: bool, span: &N) -> Option<N> {
    match &stat.data {
        Data::Return { value: Some(v) } => Some(Rc::clone(v)),
        Data::Return { value: None } => Some(void0(span)),
        Data::Simple { body } if discard_void => Some(Rc::clone(body)),
        Data::Simple { body } => Some(unary(stat, "void", Rc::clone(body))),
        _ => None,
    }
}

fn injection_scope(cx: &Cx) -> Option<&N> {
    for node in cx.parents.iter().rev().skip(1) {
        match &node.data {
            Data::Class { .. } => return None,
            Data::Func { .. } | Data::Toplevel { .. } | Data::StaticBlock { .. } => return Some(node),
            _ => {}
        }
    }
    None
}

fn safe_scope(cx: &Cx, scope: &N) -> bool {
    !matches!(scope.data, Data::Toplevel { .. }) || cx.opts.toplevel_vars
}

fn lexical_names(cx: &Cx) -> HashSet<String> {
    let mut names = HashSet::new();
    for node in cx.parents.iter().rev().skip(1) {
        if matches!(node.data, Data::Func { .. } | Data::Toplevel { .. } | Data::StaticBlock { .. } | Data::Class { .. }) {
            break;
        }
        collect_lexical(node, &mut names);
    }
    names
}

fn collect_lexical(n: &N, names: &mut HashSet<String>) {
    match &n.data {
        Data::Defs { kind, defs, .. } if !matches!(kind, ast::DefKind::Var) => {
            for def in defs {
                if let Data::VarDef { name, .. } = &def.data {
                    if let Some(name) = sym_str(name) {
                        names.insert(name.to_string());
                    }
                }
            }
        }
        Data::Catch { arg: Some(arg), .. } | Data::Class { name: Some(arg), .. } => {
            if let Some(name) = sym_str(arg) {
                names.insert(name.to_string());
            }
        }
        Data::For { init: Some(init), .. } => collect_lexical(init, names),
        _ => {}
    }
}

fn name_taken(cx: &Cx, scope: &N, name: &str, blocked: &HashSet<String>) -> bool {
    if matches!(name, "Infinity" | "NaN" | "undefined") || blocked.contains(name) || cx.injected_name(scope, name) {
        return true;
    }
    let Some(table) = cx.syms.as_ref() else { return true };
    let Some(&id) = table.node_scope.get(&crate::syms::ptr(scope)) else { return true };
    table.name_conflicts(id, name)
}

fn sym_ref(span: &N, name: &str) -> N {
    atom(span, Data::Symbol { name: name.into(), kind: SymKind::Ref, quote: None })
}

fn assign(span: &N, left: N, right: N) -> N {
    atom(span, Data::Assign { op: "=".into(), left, right, logical: false })
}

fn var_decl(span: &N, names: &[String]) -> N {
    let defs = names
        .iter()
        .map(|name| {
            atom(
                span,
                Data::VarDef {
                    name: atom(span, Data::Symbol { name: name.clone(), kind: SymKind::Var, quote: None }),
                    value: None,
                },
            )
        })
        .collect();
    atom(span, Data::Defs { kind: ast::DefKind::Var, defs, await_: false })
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
    Some(finish_seq(n, exprs, cx))
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
    let call = atom(
        n,
        Data::Call { expr: Rc::clone(expr), args: args.clone(), optional: false, is_new: false },
    );
    Some(polish(call, cx))
}

/// `unsafe` constructor folds in `def_optimize(AST_Call)`. `console.assert` is omitted.
fn unsafe_call(n: &N, expr: &N, args: &[N], cx: &Cx) -> Option<N> {
    if let Data::Dot { expr: recv, prop, optional, .. } = &expr.data {
        if !*optional && prop == "from" && args.len() == 1 && sym_str(recv) == Some("Array") && !cx.shadowed("Array") {
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
/// A `var String` at toplevel is a binding even when `reduce_vars` is off and
/// there is no symbol table. `shadowed` sees that binding, including names
/// hoisted onto the root locals frame.
fn undeclared(expr: &N, cx: &Cx, names: &[&str]) -> bool {
    let Data::Symbol { name, kind: SymKind::Ref, .. } = &expr.data else {
        return false;
    };
    if !names.contains(&name.as_str()) || cx.shadowed(name) {
        return false;
    }
    match cx.syms.as_ref().and_then(|t| t.node_def.get(&crate::syms::ptr(expr)).copied()) {
        Some(id) => cx.syms.as_ref().is_some_and(|t| t.defs[id].undeclared),
        None => true,
    }
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

fn trim_unused(func: &N, args: &[N], direct: bool) -> (Option<N>, Vec<N>, bool) {
    // `def_optimize(AST_Call)` returns before trimming when the function is pinned.
    if fn_pinned(func) || args.iter().any(|a| matches!(a.data, Data::Spread { .. })) {
        return (Some(Rc::clone(func)), args.to_vec(), false);
    }
    let Data::Func { args: params, body, .. } = &func.data else {
        return (Some(Rc::clone(func)), args.to_vec(), false);
    };
    if params.iter().any(|p| !is_simple_funarg(p)) {
        return (Some(Rc::clone(func)), args.to_vec(), false);
    }
    let mut params = params.clone();
    let mut func_changed = false;
    if direct && iife_drops_params(func) {
        let orig = params.len();
        while params.last().is_some_and(|p| sym_str(p).is_some_and(|name| !refs_name(body, name))) {
            params.pop();
        }
        func_changed = params.len() != orig;
    }
    let body = match &func.data {
        Data::Func { body, .. } => body,
        _ => body,
    };
    let mut kept = Vec::new();
    let mut last = 0usize;
    for (i, arg) in args.iter().enumerate() {
        let extra = i >= params.len();
        let unused = extra || sym_str(&params[i]).is_some_and(|name| !refs_name(body, name));
        if unused {
            if !eval::is_pure(arg) {
                kept.push(Rc::clone(arg));
            } else if !extra {
                kept.push(num(arg, 0.0));
                continue;
            }
        } else {
            kept.push(Rc::clone(arg));
        }
        last = kept.len();
    }
    kept.truncate(last);
    let args_changed = kept.len() != args.len() || kept.iter().zip(args.iter()).any(|(a, b)| !Rc::ptr_eq(a, b));
    let func = if func_changed { Some(func_with_params(func, params)) } else { Some(Rc::clone(func)) };
    (func, kept, func_changed || args_changed)
}

fn iife_drops_params(func: &N) -> bool {
    let Data::Func { kind, name, body, .. } = &func.data else {
        return false;
    };
    if !matches!(kind, FuncKind::Expr | FuncKind::Arrow) {
        return false;
    }
    match name {
        None => true,
        Some(name) => sym_str(name).is_none_or(|nm| !refs_name(body, nm)),
    }
}

fn func_with_params(func: &N, params: Vec<N>) -> N {
    let Data::Func { kind, name, body, async_, generator, .. } = &func.data else {
        return Rc::clone(func);
    };
    atom(
        func,
        Data::Func {
            kind: *kind,
            name: name.clone(),
            args: params,
            body: body.clone(),
            async_: *async_,
            generator: *generator,
        },
    )
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

fn atom(orig: &N, data: Data) -> N {
    Rc::new(Node { start: orig.start.clone(), end: orig.end.clone(), data })
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
