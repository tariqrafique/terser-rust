//! Port of terser `lib/compress/drop-unused.js`.
//!
//! `drop_unused` is three walks over one scope:
//! 1. `scan_ref_scoped` fills `in_use_ids`. `assign_as_unused` (`=` of a symbol)
//!    is not a use. A definition's value is walked here only when it has side effects.
//! 2. Initializers of names that are in use are walked, so `var a = b` keeps `b` when `a` is read.
//! 3. The `tt` transformer drops declarations that are not in use, and a write-only
//!    `name = expr` becomes `expr` (or is removed when the value is discarded and pure).
//!
//! `fixed_ids` records an initializer that is still the only write. A later `=` is
//! not that node, so it can be replaced only when the name was not written again.

use ast::{Data, DefKind, Key, N, Node, Seg, SymKind};
use crate::syms::{self, SymTable};
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

/// `strict`: the root is in strict code (`module`, or an enclosing `"use strict"`).
pub fn drop_unused(root: &N, toplevel_vars: bool, toplevel_funcs: bool, strict: bool) -> N {
    drop_unused_in(root, toplevel_vars, toplevel_funcs, strict, None)
}

/// `drop_unused` inside a compress pass: a dropped definition's value is
/// `drop_side_effect_free(compressor)`'d as in drop-unused.js.
pub(crate) fn drop_unused_cx(root: &N, toplevel_vars: bool, toplevel_funcs: bool, cx: &crate::Cx) -> N {
    drop_unused_in(root, toplevel_vars, toplevel_funcs, cx.lookup("use strict").is_some(), Some(cx))
}

fn drop_unused_in(root: &N, toplevel_vars: bool, toplevel_funcs: bool, strict: bool, cx: Option<&crate::Cx>) -> N {
    // `if (self.pinned()) return`: a direct `eval` or a `with` anywhere inside.
    if pinned(root) {
        return Rc::clone(root);
    }
    let table = syms::bind_strict(root, strict);
    let saved = NESTED.with(|d| d.replace(0));
    let saved_root = ROOT.with(|r| r.replace(ptr(root)));
    let out = scope(root, &table, toplevel_vars, toplevel_funcs, cx);
    NESTED.with(|d| d.set(saved));
    ROOT.with(|r| r.set(saved_root));
    out
}

/// terser `def.value.drop_side_effect_free(compressor)`. Outside a compress pass the
/// value is kept whole when it may have side effects.
fn value_effects(v: &N, u: &Use) -> Option<N> {
    match u.cx {
        Some(cx) => crate::unary::drop_side_effect_free(v, cx, false),
        None => has_side_effects(v).then(|| Rc::clone(v)),
    }
}

thread_local! {
    /// Depth of function scopes below the one `drop_unused` runs on.
    /// drop-unused.js `if (scope !== self) return;`: nested scopes only have
    /// their uses counted, their declarations are left for their own call.
    static NESTED: std::cell::Cell<u32> = const { std::cell::Cell::new(0) };
    static ROOT: std::cell::Cell<usize> = const { std::cell::Cell::new(0) };
}

fn nested() -> bool {
    NESTED.with(|d| d.get() > 0)
}

fn scope(n: &N, table: &SymTable, drop_vars: bool, drop_funcs: bool, cx: Option<&crate::Cx>) -> N {
    match &n.data {
        Data::Toplevel { body: original } => {
            let body: Vec<N> = original.iter().map(|s| scope(s, table, true, true, cx)).collect();
            renode(n, Data::Toplevel { body: passes(&body, original, &[], table, table.scope_of(n).as_ref().copied(), drop_vars, drop_funcs, true, cx) })
        }
        Data::Func { kind, name, args, body, async_, generator } => {
            let original = body;
            // The function `drop_unused` runs on is not nested; its body is not either.
            let is_root = ROOT.with(|r| r.get()) == ptr(n);
            let outer_nested = nested();
            if !is_root {
                NESTED.with(|d| d.set(d.get() + 1));
            }
            let body: Vec<N> = body.iter().map(|s| scope(s, table, true, true, cx)).collect();
            if !is_root {
                NESTED.with(|d| d.set(d.get() - 1));
            }
            // drop-unused.js: an `AST_Function` name nothing reads is removed
            // (`keep_fnames` off), when the function sits in this scope.
            let name = match (kind, name) {
                (ast::FuncKind::Expr, Some(nm)) if !outer_nested && def_id(table, nm).is_some_and(|id| table.defs[id].orig_count > 1 || table.defs[id].name == "arguments" || !name_read(original, args, table, id)) => None,
                _ => name.clone(),
            };
            let body = if is_root { passes(&body, original, args, table, table.scope_of(n).as_ref().copied(), true, true, true, cx) } else { body };
            renode(n, Data::Func {
                kind: *kind,
                name,
                args: args.clone(),
                body,
                async_: *async_,
                generator: *generator,
            })
        }
        // terser `AST_ClassStaticBlock.drop_unused`: a scope of its own (`drop_funcs` and
        // `drop_vars` hold, it is not the toplevel).
        Data::StaticBlock { body: original } => {
            let is_root = ROOT.with(|r| r.get()) == ptr(n);
            if !is_root {
                NESTED.with(|d| d.set(d.get() + 1));
            }
            let body: Vec<N> = original.iter().map(|s| scope(s, table, true, true, cx)).collect();
            if !is_root {
                NESTED.with(|d| d.set(d.get() - 1));
            }
            let body = if is_root { passes(&body, original, &[], table, table.scope_of(n).as_ref().copied(), true, true, true, cx) } else { body };
            renode(n, Data::StaticBlock { body })
        }
        Data::Block { body: original } => {
            let body: Vec<N> = original.iter().map(|s| scope(s, table, drop_vars, drop_funcs, cx)).collect();
            let body = if let (Some(&id), false) = (table.scope_of(n).as_ref(), nested()) {
                let _ = id;
                passes(&body, original, &[], table, table.scope_of(n).as_ref().copied(), true, drop_funcs, false, cx)
            } else {
                body
            };
            renode(n, Data::Block { body })
        }
        other => map_scope(n, other, table, drop_vars, drop_funcs, cx),
    }
}

struct Use<'a> {
    /// Pass 1's `tw.has_directive("use strict")` at the node being scanned.
    strict: std::cell::Cell<bool>,
    /// Depth of nested scopes pass 3 is in (terser `scope !== self`).
    nested: std::cell::Cell<u32>,
    /// The compressor, inside a compress pass.
    cx: Option<&'a crate::Cx>,
    in_use: HashSet<usize>,
    /// def id → initializer nodes (`initializations` in drop-unused.js).
    inits: HashMap<usize, Vec<N>>,
    /// terser `fixed_ids`: def id → the `VarDef` or `=` (by pointer) whose value is the
    /// definition's final `fixed` value, when no compound assignment or update
    /// computed it (`!def.chained`).
    fixed_ids: std::cell::RefCell<HashMap<usize, usize>>,
    /// The scope `drop_unused` runs on (terser `self`).
    scope: Option<usize>,
    /// terser `var_defs_by_id`: each `var` definition of a name, in source
    /// order, by `VarDef` pointer. The index plus `orig_offset` is the
    /// position in `sym.orig`.
    var_defs: std::cell::RefCell<HashMap<usize, Vec<usize>>>,
    orig_index: HashMap<usize, usize>,
    /// Scope ids of the loops and `switch`es in this scope body (terser block
    /// scopes that are not `AST_Scope`): their `let` / `const` belong to this pass.
    loop_scopes: HashSet<usize>,
    /// terser `sym.eliminated`.
    eliminated: std::cell::RefCell<HashMap<usize, usize>>,
    /// terser `drop_funcs`: also for a function declaration in a block of this
    /// scope (sloppy mode binds it in this scope, `scope.js` `AST_SymbolDefun`).
    drop_funcs: bool,
}

/// Passes 1–3 of `AST_Scope.drop_unused`.
/// `original` is the body before nested scopes were rewritten: its loop nodes still have their scope ids.
/// `lambdas`: `stmts` is the body of the scope itself (not a block in it), whose lambdas
/// have their parameters trimmed (du 262-285).
fn passes(stmts: &[N], original: &[N], params: &[N], table: &SymTable, scope_id: Option<usize>, drop_vars: bool, drop_funcs: bool, lambdas: bool, cx: Option<&crate::Cx>) -> Vec<N> {
    // `self.pinned()`: `with` keeps every name.
    if contains_with(stmts) {
        return stmts.to_vec();
    }
    let mut u = Use {
        strict: Default::default(),
        nested: Default::default(),
        cx,
        in_use: HashSet::new(),
        inits: HashMap::new(),
        fixed_ids: Default::default(),
        scope: scope_id,
        var_defs: Default::default(),
        orig_index: HashMap::new(),
        eliminated: Default::default(),
        loop_scopes: loop_scopes(original, table),
        drop_funcs,
    };
    {
        // terser `var_defs_by_id`: the scope's parameters (`AST_SymbolFunarg`, walked
        // before the body), then its `var` definitions.
        let mut by_id: HashMap<usize, Vec<usize>> = HashMap::new();
        for p in params {
            collect_funargs(p, table, &mut by_id);
        }
        for stmt in stmts {
            collect_var_defs(stmt, table, cx, &mut by_id);
        }
        for (id, list) in &by_id {
            // `sym.orig.indexOf(def.name)`: a function name is `orig[0]` before the
            // `var`s; a parameter is in the list itself.
            let offset = usize::from(table.defs[*id].is_defun);
            // A catch parameter's `orig` is the parameter alone: its `var`s are not in it (-1).
            if is_catch_def(table, *id) {
                continue;
            }
            for (i, p) in list.iter().enumerate() {
                u.orig_index.insert(*p, i + offset);
            }
        }
        *u.var_defs.borrow_mut() = by_id;
    }
    // Pass 1 starts at `self` with no directives above it: `has_directive("use strict")`
    // sees `self`'s own and those inside it.
    u.strict.set(strict_body(stmts));
    if lambdas && !u.strict.get() {
        if let Some(s) = scope_id {
            uses_arguments_params(params, s, table, &mut u);
        }
    }
    for stmt in stmts {
        scan_ref_scoped(stmt, table, &mut u, true);
    }
    // terser `compressor.exposed(def)`: an exported binding is always in use.
    if let Some(scope_id) = scope_id {
        if let Some(ids) = table.scope_defs.get(&scope_id) {
            for id in ids {
                if table.defs[*id].exported || table.defs[*id].export_listed {
                    u.in_use.insert(*id);
                }
            }
        }
    }
    // Pass 2: walk initializers of names that are in use.
    // terser `in_use_ids.forEach` also visits ids added during the walk, so
    // this runs until no new name is marked.
    let mut done: HashSet<usize> = HashSet::new();
    loop {
        let mut ready: Vec<usize> = u.in_use.iter().copied().filter(|id| !done.contains(id) && u.inits.contains_key(id)).collect();
        if ready.is_empty() {
            break;
        }
        ready.sort_unstable();
        for id in ready {
            done.insert(id);
            let inits = u.inits.get(&id).cloned().unwrap_or_default();
            for init in &inits {
                scan_ref_scoped(init, table, &mut u, false);
            }
        }
    }
    let mut out = Vec::new();
    for stmt in stmts {
        rewrite_stmt(stmt, table, &u, scope_id, drop_vars, drop_funcs, &mut out);
    }
    if lambdas {
        out = out.iter().map(|s| trim_iifes(s, table, &u.in_use)).collect();
    }
    out
}

/// drop-unused.js 262-285, for the lambdas in this scope (`scope === self`, so not in a
/// nested function or class): the parameters nothing uses are `UNUSED` and, when `trim`,
/// popped from the end up to the first one in use or destructuring. `keep_fargs` is on
/// (the port has no option for it), so `trim` holds only for an IIFE that does not refer
/// to its name and is not `pinned()`. The call's arguments were already replaced by
/// `0` or dropped (`def_optimize(AST_Call)`, `call.rs` `trim_unused`).
fn trim_iifes(n: &N, table: &SymTable, in_use: &HashSet<usize>) -> N {
    match &n.data {
        Data::Func { .. } | Data::Class { .. } => Rc::clone(n),
        Data::Call { expr, args, optional, is_new } if matches!(expr.data, Data::Func { .. }) => {
            let callee = trim_params(expr, table, in_use).unwrap_or_else(|| Rc::clone(expr));
            let mut changed = !Rc::ptr_eq(&callee, expr);
            let args: Vec<N> = args.iter().map(|a| {
                let m = trim_iifes(a, table, in_use);
                changed |= !Rc::ptr_eq(&m, a);
                m
            }).collect();
            if !changed {
                return Rc::clone(n);
            }
            renode(n, Data::Call { expr: callee, args, optional: *optional, is_new: *is_new })
        }
        _ => {
            let mut changed = false;
            let out = ast::map_children(n, &mut |c| {
                let m = trim_iifes(c, table, in_use);
                changed |= !Rc::ptr_eq(&m, c);
                m
            });
            if changed { out } else { Rc::clone(n) }
        }
    }
}

/// terser `before` runs `drop_unused` on a class too (`AST_Class` is an `AST_Scope`): an
/// IIFE in a field value, a computed key, `extends` or a static block (not an
/// `AST_Scope` change in `tt`) has its parameters trimmed there, not in the enclosing
/// scope. `None` when nothing changes.
pub(crate) fn trim_class_iifes(n: &N) -> Option<N> {
    if !matches!(n.data, Data::Class { .. }) || !has_iife(n) {
        return None;
    }
    let table = syms::bind(n);
    let mut kids = Vec::new();
    ast::walk_children(n, &mut |c| kids.push(Rc::clone(c)));
    let in_use = scan_in_use(&kids, &table);
    let out = trim_iifes_in(n, &table, &in_use);
    (!Rc::ptr_eq(&out, n)).then_some(out)
}

fn has_iife(n: &N) -> bool {
    fn rec(n: &N, top: bool) -> bool {
        match &n.data {
            Data::Func { .. } => false,
            Data::Class { .. } if !top => false,
            Data::Call { expr, .. } if matches!(expr.data, Data::Func { .. }) => true,
            _ => {
                let mut hit = false;
                ast::walk_children(n, &mut |c| hit = hit || rec(c, false));
                hit
            }
        }
    }
    rec(n, true)
}

/// Passes 1 and 2 of `drop_unused` over `nodes`, for `in_use_ids` only.
fn scan_in_use(nodes: &[N], table: &SymTable) -> HashSet<usize> {
    let mut u = Use {
        strict: Default::default(),
        nested: Default::default(),
        cx: None,
        in_use: HashSet::new(),
        inits: HashMap::new(),
        fixed_ids: Default::default(),
        scope: None,
        var_defs: Default::default(),
        orig_index: HashMap::new(),
        eliminated: Default::default(),
        loop_scopes: HashSet::new(),
        drop_funcs: false,
    };
    for n in nodes {
        scan_ref_scoped(n, table, &mut u, true);
    }
    let mut done: HashSet<usize> = HashSet::new();
    loop {
        let mut ready: Vec<usize> = u.in_use.iter().copied().filter(|id| !done.contains(id) && u.inits.contains_key(id)).collect();
        if ready.is_empty() {
            break;
        }
        ready.sort_unstable();
        for id in ready {
            done.insert(id);
            for init in u.inits.get(&id).cloned().unwrap_or_default() {
                scan_ref_scoped(&init, table, &mut u, false);
            }
        }
    }
    u.in_use
}

/// `trim_iifes` on the children of `n` (the scope itself is not a lambda in it).
fn trim_iifes_in(n: &N, table: &SymTable, in_use: &HashSet<usize>) -> N {
    let mut changed = false;
    let out = ast::map_children(n, &mut |c| {
        let m = trim_iifes(c, table, in_use);
        changed |= !Rc::ptr_eq(&m, c);
        m
    });
    if changed { out } else { Rc::clone(n) }
}

/// The callee of an IIFE with its unused trailing parameters popped (`a.pop()`, in place).
fn trim_params(func: &N, table: &SymTable, in_use: &HashSet<usize>) -> Option<N> {
    let Data::Func { kind, name, args, body, async_, generator } = &func.data else { return None };
    // `!node.name || node.name.unreferenced()`: a name still here after the name drop
    // (du 251-259) is read.
    if !matches!(kind, ast::FuncKind::Expr | ast::FuncKind::Arrow) || name.is_some() || lambda_pinned(body) {
        return None;
    }
    let mut params = args.clone();
    while let Some(last) = params.last() {
        let mut sym = last;
        if let Data::Spread { expr } = &sym.data {
            sym = expr;
        }
        if let Data::DefaultAssign { left, .. } = &sym.data {
            sym = left;
        }
        // Destructuring parameters stay: "they constitute a type assertion of sorts".
        if matches!(sym.data, Data::Destructuring { .. }) || def_id(table, sym).is_none_or(|id| in_use.contains(&id)) {
            break;
        }
        params.pop();
    }
    if params.len() == args.len() {
        return None;
    }
    Some(renode(func, Data::Func { kind: *kind, name: None, args: params, body: body.clone(), async_: *async_, generator: *generator }))
}

/// terser `AST_Scope.pinned()`: `uses_eval` (an `eval` read whose parent is a call) or
/// `uses_with`, both set on every enclosing scope.
fn lambda_pinned(body: &[N]) -> bool {
    fn is_eval(n: &N) -> bool {
        matches!(&n.data, Data::Symbol { name, kind: SymKind::Ref, .. } if name == "eval")
    }
    fn rec(n: &N) -> bool {
        match &n.data {
            Data::With { .. } => true,
            Data::Call { expr, args, .. } if is_eval(expr) || args.iter().any(is_eval) => true,
            _ => {
                let mut hit = false;
                ast::walk_children(n, &mut |c| hit = hit || rec(c));
                hit
            }
        }
    }
    body.iter().any(rec)
}

/// terser `AST_Scope.pinned()` of `n`: `uses_with` or `uses_eval`, which a `with` or an
/// `eval` reference whose parent is a call sets on every enclosing scope.
fn pinned(n: &N) -> bool {
    let is_eval = |n: &N| matches!(&n.data, Data::Symbol { name, kind: SymKind::Ref, .. } if name == "eval");
    let mut hit = false;
    ast::walk(n, &mut |c| {
        if hit {
            return true;
        }
        hit = match &c.data {
            Data::With { .. } => true,
            Data::Call { expr, args, .. } => is_eval(expr) || args.iter().any(is_eval),
            _ => false,
        };
        hit
    });
    hit
}

fn strict_body(body: &[N]) -> bool {
    body.iter()
        .map_while(|s| match &s.data {
            Data::Directive { value, .. } => Some(value == "use strict"),
            _ => None,
        })
        .any(|strict| strict)
}

/// `scan_ref_scoped` in drop-unused.js. `record_inits` is pass 1; pass 2 only marks refs.
fn scan_ref_scoped(n: &N, table: &SymTable, u: &mut Use, record_inits: bool) {
    // `self.variables.get(sym.name) === sym.definition()`: only this scope's own bindings.
    if let Some((sym, id)) = assign_as_unused(n, table, u).and_then(|sym| Some((sym, owned(table, u, sym, u.scope)?))) {
        if let Data::Assign { right, .. } = &n.data {
            scan_ref_scoped(right, table, u, record_inits);
            if fixed_is(u, sym, right) {
                u.fixed_ids.borrow_mut().insert(id, ptr(n));
            }
        }
        return;
    }
    if let Data::Func { args, body, .. } = &n.data {
        // du 148: a lambda that uses `arguments` outside strict mode uses its
        // parameters (pass 1 only).
        let strict = u.strict.get() || strict_body(body);
        if record_inits && !strict {
            if let Some(s) = table.scope_of(n) {
                uses_arguments_params(args, s, table, u);
            }
        }
        if !(record_inits && matches!(n.data, Data::Func { kind: ast::FuncKind::Decl, .. })) {
            let saved = u.strict.replace(strict);
            ast::walk_children(n, &mut |c| scan_ref_scoped(c, table, u, record_inits));
            u.strict.set(saved);
            return;
        }
    }
    match &n.data {
        // drop-unused.js `scan_ref_scoped`: a function declaration's body is
        // walked only once its name is in use (an `initializations` entry).
        Data::Func { kind: ast::FuncKind::Decl, name: Some(nm), .. } | Data::Class { stmt: true, name: Some(nm), .. }
            if record_inits && def_id(table, nm).is_some() =>
        {
            // drop-unused.js pass 1: a class with side effects has its parts that run
            // at definition time walked (all of it when it refers to itself).
            if !class_pure(n, table) {
                if class_self_referential(n, table) {
                    ast::walk_children(n, &mut |c| scan_ref_scoped(c, table, u, record_inits));
                } else {
                    class_nondeferred_parts(n, &mut |c| scan_ref_scoped(c, table, u, record_inits));
                }
            }
            let id = def_id(table, nm).unwrap();
            u.inits.entry(id).or_default().push(Rc::clone(n));
        }
        Data::Defs { defs, .. } if record_inits => {
            for def in defs {
                let Data::VarDef { name, value } = &def.data else { continue };
                if let Some(id) = def_id(table, name) {
                    if let Some(value) = value {
                        u.inits.entry(id).or_default().push(Rc::clone(value));
                        if fixed_is(u, name, value) {
                            u.fixed_ids.borrow_mut().insert(id, ptr(def));
                        }
                        // Pass 1 walks the value only when it has side effects.
                        if side_effects(value, u) {
                            scan_ref_scoped(value, table, u, record_inits);
                        }
                    }
                } else {
                    // `def.name instanceof AST_Destructuring`: walk the pattern and the value.
                    scan_ref_scoped(name, table, u, record_inits);
                    if let Some(value) = value {
                        scan_ref_scoped(value, table, u, record_inits);
                    }
                }
            }
        }
        Data::Symbol { kind: SymKind::Ref, .. } => {
            if let Some(id) = table.def_of(n) {
                if u.in_use.insert(id) && is_catch_def(table, id) {
                    // A read of a catch parameter keeps the function's `var` of the
                    // same name (`redef`, du 486).
                    if let Some(redef) = function_def_named(table, id) {
                        u.in_use.insert(redef);
                    }
                }
            }
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            mark_names(init, table, u);
            scan_ref_scoped(object, table, u, record_inits);
            scan_ref_scoped(body, table, u, record_inits);
        }
        _ => ast::walk_children(n, &mut |c| scan_ref_scoped(c, table, u, record_inits)),
    }
}

/// `!def.chained && sym.fixed_value() === value`, from the pass's symbol table
/// (reduce_vars ran on it); `fixed` holds the value node it was given, followed
/// through rebuilds.
fn fixed_is(u: &Use, sym: &N, value: &N) -> bool {
    let Some(t) = u.cx.and_then(|cx| cx.syms.as_ref()) else { return false };
    let Some(d) = t.def_of(sym) else { return false };
    let d = &t.defs[d];
    !d.chained && d.fixed.as_ref().is_some_and(|f| f.id() == value.id())
}

/// `fixed_ids.has(def.id) && fixed_ids.get(def.id) !== node`.
fn overwritten(u: &Use, id: usize, n: &N) -> bool {
    u.fixed_ids.borrow().get(&id).is_some_and(|p| *p != ptr(n))
}

/// `assign_as_unused`: `=` of a `var` symbol. A `let`/`const` (`AST_SymbolBlockDeclaration`)
/// stays a use, so the binding is not dropped.
fn assign_as_unused<'a>(n: &'a N, table: &SymTable, u: &Use) -> Option<&'a N> {
    let sym = assign_as_unused_tt(n, u)?;
    if def_id(table, sym).is_some_and(|id| table.defs[id].block_scoped) {
        return None;
    }
    Some(sym)
}

/// `self.variables.get(name) === def`. An undeclared global is in `globals`, not `variables`.
fn owned(table: &SymTable, u: &Use, n: &N, scope_id: Option<usize>) -> Option<usize> {
    let id = def_id(table, n)?;
    if table.defs[id].undeclared {
        return None;
    }
    if let Some(s) = scope_id {
        // A loop's or a `switch`'s `let` is this scope's to drop.
        let mut sc = table.defs[id].scope;
        while sc != s && u.loop_scopes.contains(&sc) {
            match table.scope_parent.get(sc).copied().flatten() {
                Some(p) => sc = p,
                None => break,
            }
        }
        if sc != s {
            return None;
        }
    }
    Some(id)
}

/// Scope ids of the loops and `switch`es under `stmts`, outside nested functions and classes.
fn loop_scopes(stmts: &[N], table: &SymTable) -> HashSet<usize> {
    fn rec(n: &N, table: &SymTable, out: &mut HashSet<usize>) {
        match &n.data {
            Data::Func { .. } | Data::Class { .. } => return,
            Data::For { .. } | Data::ForIn { .. } | Data::ForOf { .. } | Data::While { .. } | Data::Do { .. } | Data::Switch { .. } | Data::Catch { .. } => {
                if let Some(id) = table.scope_of(n) {
                    out.insert(id);
                }
            }
            _ => {}
        }
        ast::walk_children(n, &mut |c| rec(c, table, out));
    }
    let mut out = HashSet::new();
    for s in stmts {
        rec(s, table, &mut out);
    }
    out
}

fn rewrite_stmt(n: &N, table: &SymTable, u: &Use, scope_id: Option<usize>, drop_vars: bool, drop_funcs: bool, out: &mut Vec<N>) {
    if u.nested.get() > 0 {
        // In a nested scope statements are only descended (`rewrite_expr`).
        out.extend(rewrite_expr(n, table, u, scope_id, drop_vars, true));
        return;
    }
    if let Data::Defs { kind, defs, await_ } = &n.data {
        if matches!(kind, DefKind::Using) {
            out.push(Rc::clone(n));
            return;
        }
        // drop-unused.js `tt` `AST_Definitions`: `head` (no value), `tail`
        // (with value), and side effects of dropped or repeated definitions.
        let mut head: Vec<N> = Vec::new();
        let mut tail: Vec<N> = Vec::new();
        let mut body: Vec<N> = Vec::new();
        let mut side: Vec<N> = Vec::new();
        let mut changed = false;
        for def in defs {
            let Data::VarDef { name, value } = &def.data else {
                head.push(Rc::clone(def));
                continue;
            };
            let value2 = value.as_ref().map(|v| rewrite_expr(v, table, u, scope_id, drop_vars, false).unwrap_or_else(|| num0(v)));
            if let (Some(a), Some(b)) = (value, &value2) {
                if !Rc::ptr_eq(a, b) {
                    changed = true;
                }
            }
            let is_sym = matches!(name.data, Data::Symbol { .. });
            let id = owned(table, u, name, scope_id);
            let in_use = !drop_vars || !is_sym || id.is_none_or(|id| u.in_use.contains(&id));
            if in_use {
                // du 334: an initializer a later write overwrites before any read.
                let value2 = match (value2, id) {
                    (Some(v), Some(id)) if overwritten(u, id, def) => {
                        changed = true;
                        value_effects(&v, u)
                    }
                    (v, _) => v,
                };
                if let (DefKind::Var, Some(id), true) = (kind, id, is_sym) {
                    let dp = ptr(def);
                    let listed = u.var_defs.borrow().get(&id).is_some_and(|v| v.contains(&dp));
                    let count = if listed { u.var_defs.borrow().get(&id).map_or(0, |v| v.len()) } else { 0 };
                    let elim = u.eliminated.borrow().get(&id).copied().unwrap_or(0);
                    let idx = u.orig_index.get(&dp).copied().unwrap_or(0);
                    if count > 1 && (value2.is_none() || idx > elim) {
                        if let Some(v) = value2 {
                            let sym = match &name.data {
                                // copy: `make_node(AST_SymbolRef, def.name, def.name)` (du 343)
                                // keeps `thedef`.
                                Data::Symbol { name: nm, quote, .. } => node(name, Data::Symbol { name: nm.clone(), kind: SymKind::Ref, quote: *quote }),
                                _ => Rc::clone(name),
                            };
                            // `assign.transform(tt)`: an overwritten one is its value
                            // (`maintain_this_binding` in the definitions' context).
                            let fixed = u.fixed_ids.borrow().get(&id).copied();
                            if fixed == Some(dp) || fixed.is_none() {
                                let assign = node(def, Data::Assign { op: "=".into(), left: sym, right: v, logical: false });
                                if fixed == Some(dp) {
                                    u.fixed_ids.borrow_mut().insert(id, ptr(&assign));
                                }
                                side.push(assign);
                            } else {
                                side.push(v);
                            }
                        }
                        if let Some(list) = u.var_defs.borrow_mut().get_mut(&id) {
                            list.retain(|p| *p != dp);
                        }
                        *u.eliminated.borrow_mut().entry(id).or_insert(0) += 1;
                        changed = true;
                        continue;
                    }
                }
                match value2 {
                    Some(v) => {
                        let mut v = v;
                        if !side.is_empty() {
                            if !tail.is_empty() {
                                side.push(v);
                                v = seq(def, std::mem::take(&mut side));
                            } else {
                                body.push(simple(n, seq(n, std::mem::take(&mut side))));
                            }
                            changed = true;
                        }
                        let same = value.as_ref().is_some_and(|a| Rc::ptr_eq(a, &v));
                        tail.push(if same { Rc::clone(def) } else { renode(def, Data::VarDef { name: Rc::clone(name), value: Some(v) }) });
                    }
                    None => {
                        if !tail.is_empty() {
                            changed = true;
                        }
                        head.push(if value.is_some() { renode(def, Data::VarDef { name: Rc::clone(name), value: None }) } else { Rc::clone(def) });
                    }
                }
            } else if id.is_some_and(|id| is_catch_def(table, id)) {
                // du 369: `sym.orig[0] instanceof AST_SymbolCatch` (a `var` naming the
                // catch parameter): the name stays, its value goes.
                changed = true;
                if let Some(v) = value2 {
                    if let Some(kept) = value_effects(&v, u) {
                        side.push(kept);
                    }
                }
                head.push(if value.is_some() { renode(def, Data::VarDef { name: Rc::clone(name), value: None }) } else { Rc::clone(def) });
            } else {
                changed = true;
                if let Some(v) = value2 {
                    if let Some(kept) = value_effects(&v, u) {
                        side.push(kept);
                    }
                }
                if let Some(id) = id {
                    *u.eliminated.borrow_mut().entry(id).or_insert(0) += 1;
                }
            }
        }
        if !changed {
            out.push(Rc::clone(n));
            return;
        }
        if !head.is_empty() || !tail.is_empty() {
            head.extend(tail);
            body.push(renode(n, Data::Defs { kind: *kind, defs: head, await_: *await_ }));
        }
        if !side.is_empty() {
            body.push(simple(n, seq(n, side)));
        }
        out.extend(body);
        return;
    }
    // drop-unused.js `tt` `AST_For`: the init is rewritten like a statement.
    // Side effects of dropped definitions move in front of the loop.
    if let Data::For { init: Some(init), cond, step, body } = &n.data {
        if matches!(init.data, Data::Defs { .. }) {
            let mut tmp = Vec::new();
            rewrite_stmt(init, table, u, scope_id, drop_vars, drop_funcs, &mut tmp);
            let same = tmp.len() == 1 && Rc::ptr_eq(&tmp[0], init);
            if !same {
                let last = tmp.pop();
                out.extend(tmp);
                let new_init = last.map(|l| match &l.data {
                    Data::Simple { body } => Rc::clone(body),
                    _ => l,
                });
                // The rest is descended too (its definitions are this scope's).
                let go = |c: &N| rewrite_expr(c, table, u, scope_id, drop_vars, false).unwrap_or_else(|| num0(c));
                let cond = cond.as_ref().map(go);
                let step = step.as_ref().map(go);
                let body = one(body, table, u, scope_id, drop_vars);
                out.push(renode(n, Data::For { init: new_init, cond, step, body }));
                return;
            }
        }
    }
    // drop-unused.js `tt` `AST_LabeledStatement` with an `AST_For` body: what the loop's
    // init left in front of the loop goes in front of the label.
    if let Data::Labeled { label, body } = &n.data {
        if matches!(body.data, Data::For { .. }) {
            let mut tmp = Vec::new();
            rewrite_stmt(body, table, u, scope_id, drop_vars, drop_funcs, &mut tmp);
            if let Some(last) = tmp.pop() {
                out.extend(tmp);
                let same = Rc::ptr_eq(&last, body);
                out.push(if same { Rc::clone(n) } else { renode(n, Data::Labeled { label: Rc::clone(label), body: last }) });
            }
            return;
        }
    }
    // drop-unused.js `AST_DefClass`: an unused class declaration is replaced by its
    // `drop_side_effect_free`, after its own descend.
    if drop_funcs {
        if let Data::Class { stmt: true, name: Some(name), .. } = &n.data {
            if owned(table, u, name, scope_id).is_some_and(|id| !u.in_use.contains(&id)) {
                if class_pure(n, table) {
                    return;
                }
                let kept = rewrite_expr(n, table, u, scope_id, drop_vars, true).unwrap_or_else(|| Rc::clone(n));
                match u.cx {
                    // `kept == null`: `in_list ? MAP.skip : AST_EmptyStatement`.
                    Some(cx) => out.extend(crate::unary::drop_class_statement(&kept, cx)),
                    None => out.push(kept),
                }
                return;
            }
        }
    }
    if drop_funcs {
        if let Data::Func { name: Some(name), .. } = &n.data {
            if owned(table, u, name, scope_id).is_some_and(|id| !u.in_use.contains(&id)) {
                return;
            }
        }
    }
    if let Some(stmt) = rewrite_expr(n, table, u, scope_id, drop_vars, true) {
        // drop-unused.js `tt` `AST_BlockStatement`: in a list, a block whose
        // statements can all leave it is spliced.
        if let Data::Block { body } = &stmt.data {
            if body.iter().all(evictable) {
                out.extend(body.iter().cloned());
                return;
            }
        }
        out.push(stmt);
    }
}

/// terser `common.js` `can_be_evicted_from_block`.
fn evictable(n: &N) -> bool {
    !matches!(
        n.data,
        Data::Class { stmt: true, .. }
            | Data::Func { kind: ast::FuncKind::Decl, .. }
            | Data::Defs { kind: DefKind::Let | DefKind::Const | DefKind::Using, .. }
            | Data::Import { .. }
            | Data::Export { .. }
    )
}

/// Pass 3 `tt` for `assign_as_unused`. `discarded` is `!is_used_in_expression`.
/// `None` is `MAP.skip` in a list; a caller with a single slot puts `0` there.
/// Inside a nested scope (`scope !== self`, `u.nested`) only the `assign_as_unused`
/// rule and the `after` sequence cleanup apply.
fn rewrite_expr(n: &N, table: &SymTable, u: &Use, scope_id: Option<usize>, drop_vars: bool, discarded: bool) -> Option<N> {
    if drop_vars {
        if let Some(sym) = assign_as_unused_tt(n, u) {
            // Only this scope's bindings (the port runs a pass per block scope).
            if let Some(id) = owned(table, u, sym, scope_id) {
                let in_use = u.in_use.contains(&id);
                if let Data::Assign { right, .. } = &n.data {
                    if !in_use || overwritten(u, id, n) {
                        let rhs = rewrite_expr(right, table, u, scope_id, drop_vars, false).unwrap_or_else(|| num0(right));
                        if !in_use && !side_effects(&rhs, u) && discarded {
                            return None;
                        }
                        return Some(rhs);
                    }
                } else if !in_use {
                    return None;
                }
            }
        }
    }
    let nested = u.nested.get() > 0;
    let go = |c: &N, discarded: bool| rewrite_expr(c, table, u, scope_id, drop_vars, discarded).unwrap_or_else(|| num0(c));
    // A statement in a single slot (`in_list` false): several results become a block,
    // none an empty statement. Nested, statements are only descended.
    let slot = |c: &N| if nested { go(c, true) } else { one(c, table, u, scope_id, drop_vars) };
    let list = |body: &[N]| -> Vec<N> {
        if nested {
            return body.iter().map(|c| go(c, true)).collect();
        }
        let mut stmts = Vec::new();
        for stmt in body {
            rewrite_stmt(stmt, table, u, scope_id, drop_vars, u.drop_funcs, &mut stmts);
        }
        stmts
    };
    let data = match &n.data {
        // `is_used_in_expression`: a statement's expression is discarded. A single
        // slot that loses its expression holds `0` (`make_node(AST_Number, ...)`).
        Data::Simple { body } => Data::Simple { body: go(body, true) },
        Data::Return { value } => Data::Return { value: value.as_ref().map(|v| go(v, false)) },
        Data::Throw { value } => Data::Throw { value: go(value, false) },
        Data::Unary { op, expr, prefix } => {
            // `void` discards its operand; `typeof + - ! ~` pass the context on.
            let inner = match op.as_str() {
                "void" => true,
                "typeof" | "+" | "-" | "!" | "~" => discarded,
                _ => false,
            };
            let operand = go(expr, inner);
            let operand = if op == "delete" { keep_this(expr, operand, true) } else { operand };
            Data::Unary { op: op.clone(), expr: operand, prefix: *prefix }
        }
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left, false), right: go(right, false) },
        // `(d = x)[0] = 1`: the target's object is an expression too.
        Data::Assign { op, left, right, logical } => Data::Assign {
            op: op.clone(),
            left: if matches!(left.data, Data::Dot { .. } | Data::Sub { .. }) { go(left, false) } else { Rc::clone(left) },
            right: go(right, false),
            logical: *logical,
        },
        Data::Seq { exprs } => return rewrite_seq(n, exprs, table, u, scope_id, drop_vars, discarded, false),
        Data::Call { expr, args, optional, is_new } => {
            let callee = match &expr.data {
                Data::Seq { exprs } => rewrite_seq(expr, exprs, table, u, scope_id, drop_vars, false, true).unwrap_or_else(|| num0(expr)),
                _ => go(expr, false),
            };
            Data::Call {
                expr: keep_this(expr, callee, false),
                args: args.iter().map(|a| go(a, false)).collect(),
                optional: *optional,
                is_new: *is_new,
            }
        }
        Data::Dot { expr, prop, optional, quote, private } => Data::Dot {
            expr: go(expr, false), prop: prop.clone(), optional: *optional, quote: *quote, private: *private,
        },
        Data::Sub { expr, prop, optional } => Data::Sub { expr: go(expr, false), prop: go(prop, false), optional: *optional },
        Data::Object { props } => Data::Object { props: props.iter().map(|p| go(p, false)).collect() },
        Data::Prop { method, key, value, static_, private, generator, async_ } => Data::Prop {
            method: *method,
            key: match key {
                Key::Computed(e) => Key::Computed(go(e, false)),
                other => other.clone(),
            },
            value: go(value, false),
            static_: *static_,
            private: *private,
            generator: *generator,
            async_: *async_,
        },
        Data::Array { elements } => Data::Array { elements: elements.iter().map(|e| go(e, false)).collect() },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond, false), cons: go(cons, false), alt: go(alt, false) },
        Data::If { cond, body, alt } => Data::If { cond: go(cond, false), body: slot(body), alt: alt.as_ref().map(|a| slot(a)) },
        Data::Block { body } => Data::Block { body: list(body) },
        Data::Try { body, catch, finally } => Data::Try {
            body: slot(body),
            catch: catch.as_ref().map(|c| slot(c)),
            finally: finally.as_ref().map(|f| slot(f)),
        },
        Data::Catch { arg, body } => Data::Catch { arg: arg.clone(), body: slot(body) },
        Data::Finally { body } => Data::Finally { body: slot(body) },
        Data::While { cond, body } => Data::While { cond: go(cond, false), body: slot(body) },
        Data::Do { body, cond } => Data::Do { body: slot(body), cond: go(cond, false) },
        Data::For { init, cond, step, body } => Data::For {
            init: init.as_ref().map(|i| if matches!(i.data, Data::Defs { .. }) && !nested { Rc::clone(i) } else { go(i, false) }),
            cond: cond.as_ref().map(|c| go(c, false)),
            step: step.as_ref().map(|c| go(c, false)),
            body: slot(body),
        },
        Data::ForIn { init, object, body } => Data::ForIn { init: Rc::clone(init), object: go(object, false), body: slot(body) },
        Data::ForOf { init, object, body, await_ } => Data::ForOf { init: Rc::clone(init), object: go(object, false), body: slot(body), await_: *await_ },
        Data::Labeled { label, body } => Data::Labeled { label: Rc::clone(label), body: slot(body) },
        Data::Switch { expr, body } => Data::Switch { expr: go(expr, false), body: body.iter().map(|c| go(c, false)).collect() },
        Data::Case { expr, body } => Data::Case { expr: go(expr, false), body: list(body) },
        Data::Default { body } => Data::Default { body: list(body) },
        Data::Template { segments } => Data::Template {
            segments: segments.iter().map(|seg| match seg {
                Seg::Expr(e) => Seg::Expr(go(e, false)),
                other => other.clone(),
            }).collect(),
        },
        // `scope = node; descend(node, this)`: a nested scope's statements are only
        // descended. A parameter default or a class part is an expression in it.
        Data::Func { .. } | Data::Class { .. } => {
            u.nested.set(u.nested.get() + 1);
            let mut changed = false;
            let out = ast::map_children(n, &mut |c| {
                let m = go(c, false);
                changed |= !Rc::ptr_eq(&m, c);
                m
            });
            u.nested.set(u.nested.get() - 1);
            return Some(if changed { out } else { Rc::clone(n) });
        }
        _ => {
            let mut changed = false;
            let out = ast::map_children(n, &mut |c| {
                let m = go(c, false);
                changed |= !Rc::ptr_eq(&m, c);
                m
            });
            return Some(if changed { out } else { Rc::clone(n) });
        }
    };
    Some(renode(n, data))
}

/// A sequence in pass 3, then `after`: none left is `MAP.skip` (`None`), one is that
/// expression. `callee`: the sequence is a call's callee, where `(0, x.y)()` keeps its
/// first element (`is_used_in_expression`, `requires_sequence_to_maintain_binding`).
#[allow(clippy::too_many_arguments)]
fn rewrite_seq(n: &N, exprs: &[N], table: &SymTable, u: &Use, scope_id: Option<usize>, drop_vars: bool, discarded: bool, callee: bool) -> Option<N> {
    let last = exprs.len().saturating_sub(1);
    let keep_first = callee && exprs.len() == 2 && binding_sensitive(&exprs[1]);
    let out: Vec<N> = exprs
        .iter()
        .enumerate()
        .filter_map(|(i, e)| rewrite_expr(e, table, u, scope_id, drop_vars, if i == last { discarded } else { !(keep_first && i == 0) }))
        .collect();
    match out.len() {
        0 => None,
        1 => out.into_iter().next(),
        _ => Some(renode(n, Data::Seq { exprs: out })),
    }
}

/// `requires_sequence_to_maintain_binding` on the value: a property access, an
/// optional chain or `eval`.
fn binding_sensitive(v: &N) -> bool {
    matches!(v.data, Data::Dot { .. } | Data::Sub { .. } | Data::Chain { .. })
        || matches!(&v.data, Data::Symbol { kind: SymKind::Ref, name, .. } if name == "eval")
}

/// terser `assign_as_unused` in pass 3: `=` of a symbol, or a `WRITE_ONLY`
/// compound assignment or update (`drop_side_effect_free` flagged its value as unused).
fn assign_as_unused_tt<'a>(n: &'a N, u: &Use) -> Option<&'a N> {
    let write_only = || u.cx.is_some_and(|cx| cx.is_write_only(n));
    match &n.data {
        Data::Assign { op, left, logical: false, .. } if is_ref(left) && (op == "=" || write_only()) => Some(left),
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "++" | "--") && is_ref(expr) && write_only() => Some(expr),
        _ => None,
    }
}

/// `node.has_side_effects(compressor)`, or the port's estimate outside a compress pass.
fn side_effects(n: &N, u: &Use) -> bool {
    match u.cx {
        Some(cx) => crate::unary::may_side_effect(n, cx),
        None => has_side_effects(n),
    }
}

fn name_read(body: &[N], args: &[N], table: &SymTable, id: usize) -> bool {
    fn rec(n: &N, table: &SymTable, id: usize) -> bool {
        if matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. }) && def_id(table, n) == Some(id) {
            return true;
        }
        let mut hit = false;
        ast::walk_children(n, &mut |c| hit = hit || rec(c, table, id));
        hit
    }
    body.iter().chain(args.iter()).any(|s| rec(s, table, id))
}

/// A statement slot: several results become a block, none an empty statement.
fn one(n: &N, table: &SymTable, u: &Use, scope_id: Option<usize>, drop_vars: bool) -> N {
    // Not a list: a block stays a block (`in_list` is false in terser).
    if matches!(n.data, Data::Block { .. }) {
        return rewrite_expr(n, table, u, scope_id, drop_vars, true).unwrap_or_else(|| node(n, Data::Empty));
    }
    let mut out = Vec::new();
    rewrite_stmt(n, table, u, scope_id, drop_vars, u.drop_funcs, &mut out);
    match out.len() {
        0 => node(n, Data::Empty),
        1 => out.pop().unwrap(),
        _ => node(n, Data::Block { body: out }),
    }
}

/// `!AST_Class.has_side_effects`: no `extends` with effects, no static block,
/// computed key, or static initializer with effects. A read of an undeclared
/// name may throw (`AST_SymbolRef.has_side_effects`).
fn class_pure(n: &N, table: &SymTable) -> bool {
    let Data::Class { extends, props, .. } = &n.data else { return true };
    let effects = |e: &N| has_side_effects(e) || reads_undeclared(e, table);
    if extends.as_ref().is_some_and(effects) {
        return false;
    }
    props.iter().all(|p| match &p.data {
        Data::StaticBlock { body } => body.is_empty(),
        Data::Field { key, value, static_, .. } => {
            !matches!(key, Key::Computed(k) if effects(k)) && !(*static_ && value.as_ref().is_some_and(effects))
        }
        Data::Prop { key: Key::Computed(k), .. } => !effects(k),
        _ => true,
    })
}

/// A read, outside nested functions, of an undeclared global other than the ones
/// terser's `pure_prop_access_globals` lets through.
fn reads_undeclared(n: &N, table: &SymTable) -> bool {
    match &n.data {
        Data::Symbol { kind: SymKind::Ref, name, .. } => {
            def_id(table, n).is_some_and(|id| table.defs[id].undeclared)
                && !matches!(name.as_str(), "Number" | "String" | "Array" | "Object" | "Function" | "Promise")
        }
        Data::Func { .. } | Data::Class { .. } => false,
        _ => {
            let mut hit = false;
            ast::walk_children(n, &mut |c| hit = hit || reads_undeclared(c, table));
            hit
        }
    }
}

/// terser `AST_Class.visit_nondeferred_class_parts`: `extends`, static blocks,
/// computed keys and static initializers.
fn class_nondeferred_parts(n: &N, f: &mut dyn FnMut(&N)) {
    let Data::Class { extends, props, .. } = &n.data else { return };
    if let Some(e) = extends {
        f(e);
    }
    for p in props {
        match &p.data {
            Data::StaticBlock { .. } => f(p),
            Data::Field { key, value, static_, .. } => {
                if let Key::Computed(k) = key {
                    f(k);
                }
                if let (true, Some(v)) = (*static_, value) {
                    f(v);
                }
            }
            Data::Prop { key: Key::Computed(k), .. } => f(k),
            _ => {}
        }
    }
}

/// terser `AST_Class.is_self_referential`: a part that runs at definition time reads
/// the class name or the class's `this` (not inside a non-arrow function).
fn class_self_referential(n: &N, table: &SymTable) -> bool {
    fn rec(n: &N, table: &SymTable, this_id: Option<usize>, class_this: bool) -> bool {
        match &n.data {
            Data::This => class_this,
            Data::Symbol { kind: SymKind::Ref, .. } => this_id.is_some() && def_id(table, n) == this_id,
            Data::Func { kind, .. } if *kind != ast::FuncKind::Arrow => {
                let mut hit = false;
                ast::walk_children(n, &mut |c| hit = hit || rec(c, table, this_id, false));
                hit
            }
            _ => {
                let mut hit = false;
                ast::walk_children(n, &mut |c| hit = hit || rec(c, table, this_id, class_this));
                hit
            }
        }
    }
    let Data::Class { name, .. } = &n.data else { return false };
    let this_id = name.as_ref().and_then(|nm| def_id(table, nm));
    let mut hit = false;
    class_nondeferred_parts(n, &mut |c| hit = hit || rec(c, table, this_id, true));
    hit
}

/// terser `maintain_this_binding(parent, node, assignee)` for an unused
/// assignment that became its value: as a callee (or `delete` operand) the
/// value keeps a `(0, ...)` so it is not called as a method.
fn keep_this(orig: &N, val: N, delete: bool) -> N {
    let dropped = matches!(orig.data, Data::Assign { .. }) && !matches!(val.data, Data::Assign { .. });
    let needs = delete
        || matches!(val.data, Data::Dot { .. } | Data::Sub { .. } | Data::Chain { .. })
        || matches!(&val.data, Data::Symbol { kind: SymKind::Ref, name, .. } if name == "eval");
    if dropped && needs {
        seq(orig, vec![num0(orig), val])
    } else {
        val
    }
}

fn seq(span: &N, mut exprs: Vec<N>) -> N {
    if exprs.len() == 1 {
        return exprs.pop().unwrap();
    }
    node(span, Data::Seq { exprs })
}

/// `var` definitions of this scope, outside nested functions and classes. A `var`
/// naming an enclosing `catch` parameter is that parameter's (`syms.rs`).
///
/// terser binds once per pass: a `var` that named a catch parameter keeps that
/// definition after the `try` is gone (dead code after a `return`), and is not one of
/// the parameter's `var_defs`.
fn collect_var_defs(n: &N, table: &SymTable, cx: Option<&crate::Cx>, out: &mut HashMap<usize, Vec<usize>>) {
    match &n.data {
        Data::Func { .. } | Data::Class { .. } => {}
        Data::Defs { kind: DefKind::Var, defs, .. } => {
            for d in defs {
                if let Data::VarDef { name, value } = &d.data {
                    let stale_catch = cx
                        .and_then(|cx| cx.syms.as_ref())
                        .and_then(|t| t.def_of(name).map(|id| is_catch_def(t, id)))
                        .unwrap_or(false);
                    if let Some(id) = def_id(table, name).filter(|id| !stale_catch || is_catch_def(table, *id)) {
                        out.entry(id).or_default().push(ptr(d));
                    }
                    if let Some(v) = value {
                        collect_var_defs(v, table, cx, out);
                    }
                }
            }
        }
        _ => ast::walk_children(n, &mut |c| collect_var_defs(c, table, cx, out)),
    }
}

/// `node_def.scope.get_defun_scope().variables.get(node_def.name)`.
fn function_def_named(table: &SymTable, id: usize) -> Option<usize> {
    let d = &table.defs[id];
    let fs = *table.fn_of.get(d.scope)?;
    table.scope_defs.get(&fs)?.iter().copied().find(|&o| o != id && table.defs[o].name == d.name)
}

/// A catch parameter's definition (`orig[0] instanceof AST_SymbolCatch`).
fn is_catch_def(table: &SymTable, id: usize) -> bool {
    table.defs[id].block_scoped && !table.defs[id].lexical
}

/// The parameter names under a parameter (`AST_SymbolFunarg`, also inside patterns),
/// by symbol node pointer.
fn collect_funargs(n: &N, table: &SymTable, out: &mut HashMap<usize, Vec<usize>>) {
    match &n.data {
        Data::Symbol { kind: SymKind::Funarg, .. } => {
            if let Some(id) = def_id(table, n) {
                out.entry(id).or_default().push(ptr(n));
            }
        }
        Data::Func { .. } | Data::Class { .. } => {}
        _ => ast::walk_children(n, &mut |c| collect_funargs(c, table, out)),
    }
}

fn mark_names(n: &N, table: &SymTable, u: &mut Use) {
    if let Some(id) = def_id(table, n) {
        u.in_use.insert(id);
    }
    ast::walk_children(n, &mut |c| mark_names(c, table, u));
}

/// `node.uses_arguments`: the plain parameters (`AST_SymbolDeclaration`) are in use.
fn uses_arguments_params(args: &[N], scope: usize, table: &SymTable, u: &mut Use) {
    if !table.scope_uses_arguments.get(scope).copied().unwrap_or(false) {
        return;
    }
    for a in args {
        if matches!(a.data, Data::Symbol { .. }) {
            if let Some(id) = def_id(table, a) {
                u.in_use.insert(id);
            }
        }
    }
}

fn contains_with(stmts: &[N]) -> bool {
    fn rec(n: &N) -> bool {
        match &n.data {
            Data::With { .. } => true,
            // A nested `with` sets `uses_with` on the enclosing scope, so `pinned()` is true.
            Data::Func { body, .. } => body.iter().any(rec),
            _ => {
                let mut hit = false;
                ast::walk_children(n, &mut |c| hit |= rec(c));
                hit
            }
        }
    }
    stmts.iter().any(rec)
}

fn has_side_effects(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::BigInt { .. } | Data::RegExp { .. } | Data::True | Data::False | Data::Null | Data::This | Data::Infinity => false,
        Data::Symbol { kind: SymKind::Ref, .. } => false,
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "!" | "~" | "+" | "-" | "void" | "typeof") => has_side_effects(expr),
        Data::Binary { left, right, .. } => has_side_effects(left) || has_side_effects(right),
        Data::Func { .. } => false,
        // terser `may_throw_on_access`: `arguments` in a function does not throw on a
        // property read (a declaration this pass drops is in a function or the toplevel).
        Data::Dot { expr, optional: false, .. } if is_arguments(expr) => false,
        Data::Sub { expr, prop, optional: false } if is_arguments(expr) => has_side_effects(prop),
        // An array or object literal runs its elements and property values.
        Data::Array { elements } => elements.iter().any(|e| !matches!(e.data, Data::Hole) && has_side_effects(e)),
        Data::Object { props } => props.iter().any(|p| match &p.data {
            Data::Prop { key, value, method, .. } => {
                matches!(key, Key::Computed(k) if has_side_effects(k)) || (method.is_none() && has_side_effects(value))
            }
            _ => true,
        }),
        _ => true,
    }
}

fn is_arguments(n: &N) -> bool {
    matches!(&n.data, Data::Symbol { name, kind: SymKind::Ref, .. } if name == "arguments")
}

/// terser `drop_unused` run on a class expression itself (`AST_Class` is an
/// `AST_Scope`, so `before` calls it after the class is optimized): its name
/// goes when nothing in the class reads it. `None` when it stays.
pub(crate) fn drop_class_name(n: &N, table: &SymTable) -> Option<N> {
    let Data::Class { stmt: false, name: Some(nm), extends, props } = &n.data else { return None };
    let read = match def_id(table, nm) {
        Some(id) => props.iter().chain(extends.iter()).any(|p| name_read(std::slice::from_ref(p), &[], table, id)),
        // An inlined declaration's copy has a new name node (`reduce_vars`
        // `lambda_copy`); its references inside are still by that name.
        None => {
            let Data::Symbol { name, .. } = &nm.data else { return None };
            let mut hit = false;
            for p in props.iter().chain(extends.iter()) {
                ast::walk(p, &mut |c| {
                    hit |= matches!(&c.data, Data::Symbol { kind: SymKind::Ref, name: r, .. } if r == name);
                    hit
                });
            }
            hit
        }
    };
    if read {
        return None;
    }
    Some(n.rebuild(Data::Class { stmt: false, name: None, extends: extends.clone(), props: props.clone() }))
}

fn def_id(table: &SymTable, n: &N) -> Option<usize> {
    table.def_of(n)
}

fn is_ref(n: &N) -> bool {
    matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. })
}

fn num0(orig: &N) -> N {
    node(orig, Data::Number { value: 0.0, raw: "0".into() })
}

fn simple(orig: &N, body: N) -> N {
    node(orig, Data::Simple { body })
}

fn ptr(n: &N) -> usize {
    Rc::as_ptr(n) as usize
}

/// new: terser `make_node(X, orig, ..)`.
fn node(orig: &N, data: Data) -> N {
    Node::make(orig, data)
}

/// keep: drop-unused.js's `TreeTransformer` edits in place: the scope walk and `descend`,
/// `node.definitions = ..` (du 391), a kept definition's `def.value = ..` and the `for`
/// init (du 419-425).
fn renode(orig: &N, data: Data) -> N {
    orig.rebuild(data)
}

fn map_scope(n: &N, data: &Data, table: &SymTable, drop_vars: bool, drop_funcs: bool, cx: Option<&crate::Cx>) -> N {
    let go = |c: &N| scope(c, table, drop_vars, drop_funcs, cx);
    let rebuilt = match data {
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::Return { value } => Data::Return { value: value.as_ref().map(go) },
        Data::Throw { value } => Data::Throw { value: go(value) },
        Data::If { cond, body, alt } => Data::If { cond: go(cond), body: go(body), alt: alt.as_ref().map(go) },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left), right: go(right) },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond), cons: go(cons), alt: go(alt) },
        Data::Call { expr, args, optional, is_new } => Data::Call { expr: go(expr), args: args.iter().map(go).collect(), optional: *optional, is_new: *is_new },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr), prefix: *prefix },
        Data::Seq { exprs } => Data::Seq { exprs: exprs.iter().map(go).collect() },
        Data::Class { stmt, name, extends, props } => {
            // drop-unused.js: an `AST_ClassExpression` name nothing reads is
            // removed (`keep_classnames` off).
            let name = match (stmt, name) {
                (false, Some(nm)) if def_id(table, nm).is_some_and(|id| {
                    !props.iter().chain(extends.iter()).any(|p| name_read(std::slice::from_ref(p), &[], table, id))
                }) => None,
                _ => name.clone(),
            };
            Data::Class { stmt: *stmt, name, extends: extends.as_ref().map(go), props: props.iter().map(go).collect() }
        }
        Data::Object { props } => Data::Object { props: props.iter().map(go).collect() },
        Data::Prop { method, key, value, static_, private, generator, async_ } => Data::Prop {
            method: *method,
            key: key.clone(),
            value: go(value),
            static_: *static_, private: *private, generator: *generator, async_: *async_,
        },
        // Every other node: descend so nested scopes and blocks are reached.
        _ => {
            let mut changed = false;
            let out = ast::map_children(n, &mut |c| {
                let m = go(c);
                if !Rc::ptr_eq(&m, c) {
                    changed = true;
                }
                m
            });
            return if changed { out } else { Rc::clone(n) };
        }
    };
    renode(n, rebuilt)
}
