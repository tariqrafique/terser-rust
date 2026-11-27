//! Symbol definitions for the compressor.
//!
//! Mirrors terser `lib/scope.js` `SymbolDef`: one record shared by every
//! binding and reference of a name. `reduce-vars.js` fills `fixed`,
//! `references`, `assignments`, `single_use`, and `escaped` on these records.

use ast::{Data, DefKind, N, Node, SymKind};
use std::cell::Cell;
use std::collections::HashMap;
use std::rc::Rc;

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum SingleUse {
    No,
    Yes,
    /// terser `single_use == "m"`: the single use modifies the value.
    Modified,
}

pub struct SymbolDef {
    pub name: String,
    pub global: bool,
    pub undeclared: bool,
    pub funarg: bool,
    pub is_const: bool,
    pub is_defun: bool,
    /// Scope is pinned by direct `eval` or `with`.
    pub pinned: bool,
    pub fn_scope: usize,
    /// Scope that defined this name. Function scopes hold `var` and params.
    pub scope: usize,
    pub block_scoped: bool,
    pub init: Option<N>,
    /// `None` means `fixed === false`. A node means that node is the fixed value.
    pub fixed: Option<N>,
    pub assignments: u32,
    pub escaped: u32,
    pub recursive_refs: u32,
    pub references: Vec<usize>,
    pub single_use: SingleUse,
    pub replaced: Cell<u32>,
}

pub struct SymTable {
    pub defs: Vec<SymbolDef>,
    pub node_def: HashMap<usize, usize>,
    pub node_scope: HashMap<usize, usize>,
    pub scope_defs: HashMap<usize, Vec<usize>>,
}

struct Scope {
    parent: Option<usize>,
    fn_scope: usize,
    func: bool,
    pinned: bool,
    names: HashMap<String, usize>,
}

/// terser `lib/scope.js` `AST_Scope.figure_out_scope` / `def_variable`,
/// reduced to the fields the compressor reads.
pub fn bind(root: &N) -> SymTable {
    let mut scopes = vec![Scope {
        parent: None,
        fn_scope: 0,
        func: true,
        pinned: false,
        names: HashMap::new(),
    }];
    let mut table = SymTable {
        defs: Vec::new(),
        node_def: HashMap::new(),
        node_scope: HashMap::new(),
        scope_defs: HashMap::new(),
    };
    table.node_scope.insert(ptr(root), 0);
    if let Data::Toplevel { body } = &root.data {
        hoist(body, 0, &mut scopes, &mut table);
    }
    walk(root, 0, &mut scopes, &mut table);
    table
}

fn walk(n: &N, scope: usize, scopes: &mut Vec<Scope>, table: &mut SymTable) {
    match &n.data {
        Data::Func { name, args, body, .. } => {
            let id = push_func(scope, scopes);
            table.node_scope.insert(ptr(n), id);
            if let Some(name) = name.as_ref().and_then(sym) {
                define(table, scopes, id, name, n, SymKind::Defun, None, false);
            }
            for arg in args {
                if let Some(sym_name) = sym(arg) {
                    define(table, scopes, id, sym_name, arg, SymKind::Funarg, None, false);
                }
            }
            // `var` and `function` declarations are hoisted to the function scope
            // before any reference is resolved. terser `figure_out_scope`.
            hoist(body, id, scopes, table);
            // `let`/`const` in the body are in scope before any reference is resolved.
            hoist_lexical(body, id, scopes, table);
            for stmt in body {
                walk(stmt, id, scopes, table);
            }
        }
        Data::Block { body } | Data::StaticBlock { body } => {
            let id = push_block(scope, scopes);
            table.node_scope.insert(ptr(n), id);
            hoist_lexical(body, id, scopes, table);
            for stmt in body {
                walk(stmt, id, scopes, table);
            }
        }
        Data::Catch { arg, body } => {
            let id = push_block(scope, scopes);
            table.node_scope.insert(ptr(n), id);
            if let Some(arg) = arg {
                if let Some(sym_name) = sym(arg) {
                    define(table, scopes, id, sym_name, arg, SymKind::Catch, None, false);
                }
            }
            walk(body, id, scopes, table);
        }
        Data::Defs { kind, defs, .. } => {
            let fn_scope = scopes[scope].fn_scope;
            let dest = if matches!(kind, DefKind::Var) { fn_scope } else { scope };
            for def in defs {
                let Data::VarDef { name, value } = &def.data else { continue };
                let Some(sym_name) = sym(name) else {
                    // Destructuring pattern: the initializer is still a use.
                    walk(name, scope, scopes, table);
                    if let Some(value) = value {
                        walk(value, scope, scopes, table);
                    }
                    continue;
                };
                let sk = match kind {
                    DefKind::Const => SymKind::Const,
                    DefKind::Let => SymKind::Let,
                    _ => SymKind::Var,
                };
                define(table, scopes, dest, sym_name, name, sk, value.clone(), false);
                if let Some(value) = value {
                    walk(value, scope, scopes, table);
                }
            }
        }
        Data::With { body, .. } => {
            pin_fn(table, scopes, scope);
            walk(body, scope, scopes, table);
        }
        Data::Call { expr, args, .. } => {
            if sym(expr).as_deref() == Some("eval") && resolve(scopes, scope, "eval").is_none() {
                pin_fn(table, scopes, scope);
            }
            walk(expr, scope, scopes, table);
            for arg in args {
                walk(arg, scope, scopes, table);
            }
        }
        Data::Symbol { name, kind: SymKind::Ref, .. } => {
            if resolve(scopes, scope, name).is_none() {
                define(table, scopes, 0, name.clone(), n, SymKind::Ref, None, true);
            } else if let Some(id) = resolve(scopes, scope, name) {
                table.node_def.insert(ptr(n), id);
            }
        }
        other => walk_children(other, scope, scopes, table),
    }
}

fn hoist(stmts: &[N], fn_scope: usize, scopes: &mut Vec<Scope>, table: &mut SymTable) {
    for stmt in stmts {
        match &stmt.data {
            Data::Func { .. } => {
                if let Data::Func { kind: ast::FuncKind::Decl, name: Some(name), .. } = &stmt.data {
                    if let Some(sym_name) = sym(name) {
                        define(table, scopes, fn_scope, sym_name, name, SymKind::Defun, None, false);
                    }
                }
            }
            Data::Defs { kind: DefKind::Var, defs, .. } => {
                for def in defs {
                    let Data::VarDef { name, value } = &def.data else { continue };
                    let Some(sym_name) = sym(name) else { continue };
                    define(table, scopes, fn_scope, sym_name, name, SymKind::Var, value.clone(), false);
                }
            }
            Data::Block { body } | Data::StaticBlock { body } => hoist(body, fn_scope, scopes, table),
            Data::If { body, alt, .. } => {
                hoist_node(body, fn_scope, scopes, table);
                if let Some(alt) = alt {
                    hoist_node(alt, fn_scope, scopes, table);
                }
            }
            Data::For { init, body, .. } => {
                if let Some(init) = init {
                    hoist_node(init, fn_scope, scopes, table);
                }
                hoist_node(body, fn_scope, scopes, table);
            }
            Data::ForIn { init, body, .. } | Data::ForOf { init, body, .. } => {
                hoist_node(init, fn_scope, scopes, table);
                hoist_node(body, fn_scope, scopes, table);
            }
            Data::While { body, .. } | Data::Do { body, .. } | Data::Labeled { body, .. } | Data::With { body, .. } => {
                hoist_node(body, fn_scope, scopes, table);
            }
            Data::Switch { body, .. } => {
                for arm in body {
                    hoist_node(arm, fn_scope, scopes, table);
                }
            }
            Data::Case { body, .. } | Data::Default { body } => hoist(body, fn_scope, scopes, table),
            Data::Try { body, catch, finally } => {
                hoist_node(body, fn_scope, scopes, table);
                if let Some(catch) = catch {
                    hoist_node(catch, fn_scope, scopes, table);
                }
                if let Some(finally) = finally {
                    hoist_node(finally, fn_scope, scopes, table);
                }
            }
            Data::Catch { body, .. } | Data::Finally { body } => hoist_node(body, fn_scope, scopes, table),
            _ => {}
        }
    }
}

/// Direct `let`/`const` in this statement list, before nested references.
fn hoist_lexical(stmts: &[N], scope: usize, scopes: &mut Vec<Scope>, table: &mut SymTable) {
    for stmt in stmts {
        let Data::Defs { kind, defs, .. } = &stmt.data else { continue };
        if matches!(kind, DefKind::Var) {
            continue;
        }
        for def in defs {
            let Data::VarDef { name, value } = &def.data else { continue };
            let Some(sym_name) = sym(name) else { continue };
            let sk = match kind {
                DefKind::Const => SymKind::Const,
                DefKind::Let => SymKind::Let,
                _ => SymKind::Var,
            };
            define(table, scopes, scope, sym_name, name, sk, value.clone(), false);
        }
    }
}

fn hoist_node(n: &N, fn_scope: usize, scopes: &mut Vec<Scope>, table: &mut SymTable) {
    match &n.data {
        Data::Block { body } | Data::StaticBlock { body } => hoist(body, fn_scope, scopes, table),
        _ => hoist(std::slice::from_ref(n), fn_scope, scopes, table),
    }
}

fn push_func(parent: usize, scopes: &mut Vec<Scope>) -> usize {
    let id = scopes.len();
    scopes.push(Scope {
        parent: Some(parent),
        fn_scope: id,
        func: true,
        pinned: false,
        names: HashMap::new(),
    });
    id
}

fn push_block(parent: usize, scopes: &mut Vec<Scope>) -> usize {
    let fn_scope = scopes[parent].fn_scope;
    let id = scopes.len();
    scopes.push(Scope {
        parent: Some(parent),
        fn_scope,
        func: false,
        pinned: false,
        names: HashMap::new(),
    });
    id
}

fn define(
    table: &mut SymTable,
    scopes: &mut [Scope],
    scope: usize,
    name: String,
    node: &N,
    kind: SymKind,
    init: Option<N>,
    undeclared: bool,
) {
    let key = ptr(node);
    if let Some(&id) = scopes[scope].names.get(&name) {
        table.node_def.insert(key, id);
        if table.defs[id].init.is_none() {
            table.defs[id].init = init;
        }
        return;
    }
    let id = table.defs.len();
    let fn_scope = scopes[scope].fn_scope;
    let pinned = scopes[fn_scope].pinned;
    table.defs.push(SymbolDef {
        name: name.clone(),
        global: scopes[scope].parent.is_none(),
        undeclared,
        funarg: kind == SymKind::Funarg,
        is_const: kind == SymKind::Const,
        is_defun: kind == SymKind::Defun,
        pinned,
        fn_scope,
        scope,
        block_scoped: matches!(kind, SymKind::Let | SymKind::Const | SymKind::Catch),
        init,
        fixed: None,
        assignments: 0,
        escaped: 0,
        recursive_refs: 0,
        references: Vec::new(),
        single_use: SingleUse::No,
        replaced: Cell::new(0),
    });
    scopes[scope].names.insert(name, id);
    table.node_def.insert(key, id);
    table.scope_defs.entry(scope).or_default().push(id);
}

fn pin_fn(table: &mut SymTable, scopes: &mut [Scope], scope: usize) {
    let fn_scope = scopes[scope].fn_scope;
    scopes[fn_scope].pinned = true;
    for def in &mut table.defs {
        if def.fn_scope == fn_scope {
            def.pinned = true;
        }
    }
}

fn resolve(scopes: &[Scope], mut scope: usize, name: &str) -> Option<usize> {
    loop {
        if let Some(id) = scopes[scope].names.get(name) {
            return Some(*id);
        }
        scope = scopes[scope].parent?;
    }
}

fn walk_children(data: &Data, scope: usize, scopes: &mut Vec<Scope>, table: &mut SymTable) {
    match data {
        Data::Toplevel { body } | Data::Block { body } | Data::StaticBlock { body } | Data::Default { body } => {
            for s in body {
                walk(s, scope, scopes, table);
            }
        }
        Data::If { cond, body, alt } => {
            walk(cond, scope, scopes, table);
            walk(body, scope, scopes, table);
            if let Some(alt) = alt {
                walk(alt, scope, scopes, table);
            }
        }
        Data::Binary { left, right, .. }
        | Data::Assign { left, right, .. }
        | Data::DefaultAssign { left, right } => {
            walk(left, scope, scopes, table);
            walk(right, scope, scopes, table);
        }
        Data::Unary { expr, .. }
        | Data::Return { value: Some(expr) }
        | Data::Throw { value: expr }
        | Data::Simple { body: expr }
        |         Data::Dot { expr, .. }
        | Data::Await { expr }
        | Data::Spread { expr }
        | Data::Chain { expr } => walk(expr, scope, scopes, table),
        Data::Sub { expr, prop, .. } => {
            walk(expr, scope, scopes, table);
            walk(prop, scope, scopes, table);
        }
        Data::Seq { exprs } | Data::Array { elements: exprs } => {
            for e in exprs {
                walk(e, scope, scopes, table);
            }
        }
        Data::Cond { cond, cons, alt } => {
            walk(cond, scope, scopes, table);
            walk(cons, scope, scopes, table);
            walk(alt, scope, scopes, table);
        }
        Data::For { init, cond, step, body } => {
            if let Some(init) = init {
                walk(init, scope, scopes, table);
            }
            if let Some(cond) = cond {
                walk(cond, scope, scopes, table);
            }
            if let Some(step) = step {
                walk(step, scope, scopes, table);
            }
            walk(body, scope, scopes, table);
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            walk(init, scope, scopes, table);
            walk(object, scope, scopes, table);
            walk(body, scope, scopes, table);
        }
        Data::While { cond, body } | Data::Do { body, cond } => {
            walk(cond, scope, scopes, table);
            walk(body, scope, scopes, table);
        }
        Data::Switch { expr, body } => {
            walk(expr, scope, scopes, table);
            for arm in body {
                walk(arm, scope, scopes, table);
            }
        }
        Data::Case { expr, body } => {
            walk(expr, scope, scopes, table);
            for s in body {
                walk(s, scope, scopes, table);
            }
        }
        Data::Try { body, catch, finally } => {
            walk(body, scope, scopes, table);
            if let Some(catch) = catch {
                walk(catch, scope, scopes, table);
            }
            if let Some(finally) = finally {
                walk(finally, scope, scopes, table);
            }
        }
        Data::Template { segments } => {
            for seg in segments {
                if let ast::Seg::Expr(expr) = seg {
                    walk(expr, scope, scopes, table);
                }
            }
        }
        Data::TaggedTemplate { tag, template } => {
            walk(tag, scope, scopes, table);
            walk(template, scope, scopes, table);
        }
        Data::Destructuring { names, .. } => {
            for name in names {
                walk(name, scope, scopes, table);
            }
        }
        Data::Object { props } => {
            for p in props {
                walk(p, scope, scopes, table);
            }
        }
        Data::Prop { key, value, .. } => {
            if let ast::Key::Computed(expr) = key {
                walk(expr, scope, scopes, table);
            }
            walk(value, scope, scopes, table);
        }
        Data::Class { name, extends, props, .. } => {
            if let Some(name) = name {
                walk(name, scope, scopes, table);
            }
            if let Some(extends) = extends {
                walk(extends, scope, scopes, table);
            }
            for p in props {
                walk(p, scope, scopes, table);
            }
        }
        _ => {}
    }
}

fn sym(n: &N) -> Option<String> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name.clone()),
        _ => None,
    }
}

pub fn ptr(n: &N) -> usize {
    Rc::as_ptr(n) as usize
}

/// Drop declarations whose references were all replaced.
/// terser `lib/compress/drop-unused.js` drops a def when `unused` is on and
/// every reference was eliminated. This is the single-use constant case.
pub fn drop_replaced(root: &N, table: &SymTable, unused: bool) -> N {
    if !unused {
        return Rc::clone(root);
    }
    drop_node(root, table)
}

fn drop_node(n: &N, table: &SymTable) -> N {
    match &n.data {
        Data::Toplevel { body } => node(n, Data::Toplevel { body: drop_list(body, table) }),
        Data::Block { body } => node(n, Data::Block { body: drop_list(body, table) }),
        Data::Func { kind, name, args, body, async_, generator } => node(
            n,
            Data::Func {
                kind: *kind,
                name: name.clone(),
                args: args.clone(),
                body: drop_list(body, table),
                async_: *async_,
                generator: *generator,
            },
        ),
        Data::Defs { kind, defs, await_ } => {
            let defs: Vec<N> = defs
                .iter()
                .filter(|def| !replaced_decl(def, table))
                .map(|def| drop_node(def, table))
                .collect();
            if defs.is_empty() {
                return node(n, Data::Empty);
            }
            node(n, Data::Defs { kind: *kind, defs, await_: *await_ })
        }
        other => {
            // Rebuild only the containers that hold statements. Expressions keep
            // their replaced references from the compress walk.
            let _ = other;
            map_drop(n, table)
        }
    }
}

fn replaced_decl(def: &N, table: &SymTable) -> bool {
    let Data::VarDef { name, value } = &def.data else { return false };
    let Some(&id) = table.node_def.get(&ptr(name)) else { return false };
    let d = &table.defs[id];
    if d.references.is_empty() || d.replaced.get() < d.references.len() as u32 {
        return false;
    }
    if d.assignments > 0 || d.undeclared || d.global {
        return false;
    }
    value.as_ref().map(|v| !side_effect(v)).unwrap_or(true)
}

fn side_effect(n: &N) -> bool {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null | Data::This => false,
        Data::Unary { op, expr, prefix: true } if matches!(op.as_str(), "void" | "!" | "~" | "-" | "+") => side_effect(expr),
        Data::Symbol { kind: SymKind::Ref, .. } => false,
        _ => true,
    }
}

fn drop_list(stmts: &[N], table: &SymTable) -> Vec<N> {
    stmts
        .iter()
        .map(|s| drop_node(s, table))
        .filter(|s| !matches!(s.data, Data::Empty))
        .collect()
}

fn map_drop(n: &N, table: &SymTable) -> N {
    let go = |c: &N| drop_node(c, table);
    let data = match &n.data {
        Data::If { cond, body, alt } => Data::If { cond: go(cond), body: go(body), alt: alt.as_ref().map(|a| go(a)) },
        Data::For { init, cond, step, body } => Data::For {
            init: init.as_ref().map(|v| go(v)),
            cond: cond.as_ref().map(|v| go(v)),
            step: step.as_ref().map(|v| go(v)),
            body: go(body),
        },
        Data::While { cond, body } => Data::While { cond: go(cond), body: go(body) },
        Data::Do { body, cond } => Data::Do { body: go(body), cond: go(cond) },
        Data::Switch { expr, body } => Data::Switch { expr: go(expr), body: body.iter().map(|s| go(s)).collect() },
        Data::Try { body, catch, finally } => Data::Try {
            body: go(body),
            catch: catch.as_ref().map(|v| go(v)),
            finally: finally.as_ref().map(|v| go(v)),
        },
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::Return { value } => Data::Return { value: value.as_ref().map(|v| go(v)) },
        Data::Call { expr, args, optional, is_new } => Data::Call {
            expr: go(expr),
            args: args.iter().map(go).collect(),
            optional: *optional,
            is_new: *is_new,
        },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr), prefix: *prefix },
        Data::Seq { exprs } => Data::Seq { exprs: exprs.iter().map(go).collect() },
        _ => return Rc::clone(n),
    };
    node(n, data)
}

fn node(orig: &N, data: Data) -> N {
    Rc::new(Node { start: orig.start.clone(), end: orig.end.clone(), data })
}
