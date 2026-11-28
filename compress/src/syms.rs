//! Symbol definitions for the compressor.
//!
//! Mirrors terser `lib/scope.js` `SymbolDef`: one record shared by every
//! binding and reference of a name. `reduce-vars.js` fills `fixed`,
//! `references`, `assignments`, `single_use`, and `escaped` on these records.

use ast::{Data, DefKind, N, Node, NodeId, SymKind};
use std::cell::{Cell, RefCell};
use std::collections::{HashMap, HashSet};
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
    /// An `AST_SymbolLet` / `AST_SymbolConst` / `AST_SymbolUsing` declaration (not a catch
    /// parameter): terser `get_lhs` never takes an assignment to it (`is_ref_of`).
    pub lexical: bool,
    pub init: Option<N>,
    /// `None` means `fixed === false`. A node means that node is the fixed value.
    pub fixed: Option<N>,
    /// terser `fixed === null`: a `var` with no initializer, reset and not yet read or written.
    pub fixed_null: bool,
    /// terser `scope.js` defines `var`, `let`, `const`, `using`, and catch
    /// bindings with `init` null, so they reset to `fixed === null`.
    pub var_decl: bool,
    /// terser `def.export`: an `export` declaration (`export const x`).
    /// During compress terser leaves it 0 for a name in `export { ... }`.
    pub exported: bool,
    /// Named in `export { ... }`: the export list still reads it.
    pub export_listed: bool,
    /// terser `def_optimize(AST_Assign)` sets `fixed = false` while the walk continues.
    pub suppress_fixed: Cell<bool>,
    pub assignments: u32,
    pub escaped: u32,
    /// terser `reduce-vars.js` `mark_escaped`: the name is used as a value, not only as `obj.prop`.
    pub direct_access: bool,
    pub recursive_refs: u32,
    pub references: Vec<usize>,
    pub single_use: SingleUse,
    pub replaced: Cell<u32>,
    /// terser `SymbolDef.orig.length`. A parameter redeclared in the body is more than one.
    pub orig_count: u32,
}

pub struct SymTable {
    pub defs: Vec<SymbolDef>,
    pub node_def: HashMap<usize, usize>,
    /// Symbols of a `clone(true)` copy made during compress: new pointer → def.
    /// The nodes are kept so their addresses stay unique.
    pub alias: RefCell<HashMap<usize, (usize, N)>>,
    /// Scope nodes of such a copy: new pointer → scope id.
    pub alias_scope: RefCell<HashMap<usize, (usize, N)>>,
    pub node_scope: HashMap<usize, usize>,
    pub scope_defs: HashMap<usize, Vec<usize>>,
    /// Parent scope id for each scope, indexed by scope id.
    pub scope_parent: Vec<Option<usize>>,
    /// Function scope that owns each scope id.
    pub fn_of: Vec<usize>,
    /// `scope.pinned()` for each scope id. Direct `eval` or `with` sets it.
    pub scope_pinned: Vec<bool>,
    /// Shadow audit (`audit.rs`): `node_def` / `node_scope` by node id, filled where a name
    /// is bound or a node is copied (`clone(true)`, `make_node(X, orig, orig)`), never by the
    /// rebuild aliases. Nothing decides by them yet.
    pub id_def: RefCell<HashMap<NodeId, usize>>,
    pub id_scope: RefCell<HashMap<NodeId, usize>>,
    /// Function and class nodes currently stored in `fixed`, so a compressed
    /// replacement can follow them. Built at the end of `reduce_vars::analyze`.
    pub fixed_of_node: HashMap<usize, Vec<usize>>,
    /// terser `INLINED` on a scope after a cross-scope `"f"` inline.
    pub inlined_scopes: RefCell<HashSet<usize>>,
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
        scope_parent: Vec::new(),
        fn_of: Vec::new(),
        scope_pinned: Vec::new(),
        fixed_of_node: HashMap::new(),
        alias: RefCell::new(HashMap::new()),
        alias_scope: RefCell::new(HashMap::new()),
        inlined_scopes: RefCell::new(HashSet::new()),
        id_def: RefCell::new(HashMap::new()),
        id_scope: RefCell::new(HashMap::new()),
    };
    table.bind_scope(root, 0);
    if let Data::Toplevel { body } = &root.data {
        hoist(body, 0, &mut scopes, &mut table);
    }
    walk(root, 0, &mut scopes, &mut table);
    table.scope_parent = scopes.iter().map(|s| s.parent).collect();
    table.fn_of = scopes.iter().map(|s| s.fn_scope).collect();
    table.scope_pinned = scopes.iter().map(|s| s.pinned).collect();
    table
}

fn walk(n: &N, scope: usize, scopes: &mut Vec<Scope>, table: &mut SymTable) {
    match &n.data {
        Data::Func { kind, name, args, body, .. } => {
            let id = push_func(scope, scopes);
            table.bind_scope(n, id);
            if let Some(name_node) = name {
                if let Some(sym_name) = sym(name_node) {
                    // terser `scope.js`: a declaration name is only on the enclosing
                    // scope (`AST_SymbolDefun`). A function expression's name is bound
                    // inside the function (`AST_SymbolLambda`) and its `init` is the function.
                    if !matches!(kind, ast::FuncKind::Decl) {
                        define(table, scopes, id, sym_name, name_node, SymKind::Defun, Some(Rc::clone(n)), false);
                    }
                }
            }
            for arg in args {
                if let Some(sym_name) = sym(arg) {
                    define(table, scopes, id, sym_name, arg, SymKind::Funarg, None, false);
                } else {
                    define_pattern(table, scopes, id, arg, SymKind::Funarg);
                }
            }
            // Default values and computed keys in the parameters are uses.
            for arg in args {
                if sym(arg).is_none() {
                    walk(arg, id, scopes, table);
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
        // `class Name` puts `Name` on the enclosing scope. `class Name` in an
        // expression puts `Name` on the class body only, so it does not count
        // as a use of an outer `var Name`.
        Data::Class { name, extends, props, stmt } => {
            if let Some(extends) = extends {
                walk(extends, scope, scopes, table);
            }
            let id = push_block(scope, scopes);
            table.bind_scope(n, id);
            if let Some(name) = name {
                if let Some(sym_name) = sym(name) {
                    let (dest, kind) = if *stmt {
                        (scope, SymKind::DefClass)
                    } else {
                        (id, SymKind::Class)
                    };
                    // terser `def_function(node, defun)`: a class declaration's `init` is the class.
                    let init = if *stmt { Some(Rc::clone(n)) } else { None };
                    define(table, scopes, dest, sym_name, name, kind, init, false);
                }
            }
            for prop in props {
                walk(prop, id, scopes, table);
            }
        }
        Data::Block { body } | Data::StaticBlock { body } => {
            let id = push_block(scope, scopes);
            table.bind_scope(n, id);
            hoist_lexical(body, id, scopes, table);
            for stmt in body {
                walk(stmt, id, scopes, table);
            }
        }
        // terser `AST_IterationStatement.is_block_scope`: a `let` / `const`
        // in the head belongs to the loop, not to the enclosing scope.
        Data::For { .. } | Data::ForIn { .. } | Data::ForOf { .. } | Data::While { .. } | Data::Do { .. } => {
            let id = push_block(scope, scopes);
            table.node_scope.insert(ptr(n), id);
            ast::walk_children(n, &mut |c| walk(c, id, scopes, table));
        }
        // `AST_Switch` is a block scope for its cases; the discriminant is
        // in the enclosing scope.
        Data::Switch { expr, body } => {
            walk(expr, scope, scopes, table);
            let id = push_block(scope, scopes);
            table.node_scope.insert(ptr(n), id);
            for arm in body {
                if let Data::Case { body, .. } | Data::Default { body } = &arm.data {
                    hoist_lexical(body, id, scopes, table);
                }
            }
            for arm in body {
                walk(arm, id, scopes, table);
            }
        }
        Data::Catch { arg, body } => {
            let id = push_block(scope, scopes);
            table.bind_scope(n, id);
            if let Some(arg) = arg {
                if let Some(sym_name) = sym(arg) {
                    define(table, scopes, id, sym_name, arg, SymKind::Catch, None, false);
                } else {
                    // A destructuring parameter: its defaults and computed keys are uses.
                    define_pattern(table, scopes, id, arg, SymKind::Catch);
                    walk(arg, id, scopes, table);
                }
            }
            walk(body, id, scopes, table);
        }
        Data::Defs { kind, defs, .. } => {
            let fn_scope = scopes[scope].fn_scope;
            let dest = if matches!(kind, DefKind::Var) { fn_scope } else { scope };
            for def in defs {
                let Data::VarDef { name, value } = &def.data else { continue };
                let sk = match kind {
                    DefKind::Const => SymKind::Const,
                    DefKind::Let => SymKind::Let,
                    _ => SymKind::Var,
                };
                let Some(sym_name) = sym(name) else {
                    // Destructuring pattern: its names are declared (terser
                    // `AST_SymbolDeclaration` inside `AST_Destructuring`), and
                    // its defaults, computed keys and the initializer are uses.
                    define_pattern(table, scopes, dest, name, sk);
                    walk(name, scope, scopes, table);
                    if let Some(value) = value {
                        walk(value, scope, scopes, table);
                    }
                    continue;
                };
                define(table, scopes, dest, sym_name, name, sk, value.clone(), false);
                if let Some(value) = value {
                    walk(value, scope, scopes, table);
                }
            }
        }
        Data::With { expr, body } => {
            pin_fn(table, scopes, scope);
            walk(expr, scope, scopes, table);
            walk(body, scope, scopes, table);
        }
        Data::Call { expr, args, .. } => {
            if sym(expr).as_deref() == Some("eval") && resolve(scopes, scope, "eval").is_none() {
                pin_fn(table, scopes, scope);
            }
            // `AST_Call._walk`: the arguments, then the callee.
            for arg in args {
                walk(arg, scope, scopes, table);
            }
            walk(expr, scope, scopes, table);
        }
        Data::Symbol { name, kind: SymKind::Ref, .. } => {
            if resolve(scopes, scope, name).is_none() {
                define(table, scopes, 0, name.clone(), n, SymKind::Ref, None, true);
            } else if let Some(id) = resolve(scopes, scope, name) {
                table.bind_def(n, id);
            }
        }
        Data::Export { is_default, names, value, definition, module_name, .. } => {
            if let Some(def) = definition {
                walk(def, scope, scopes, table);
                let default_decl = *is_default
                    && matches!(def.data, Data::Func { kind: ast::FuncKind::Decl, .. } | Data::Class { stmt: true, .. });
                if !default_decl {
                    let mut bound = Vec::new();
                    exported_names(def, &mut bound);
                    for name in bound {
                        if let Some(id) = resolve(scopes, scope, &name) {
                            table.defs[id].exported = true;
                        }
                    }
                }
            }
            if let Some(value) = value {
                walk(value, scope, scopes, table);
            }
            if let (Some(names), None) = (names, module_name) {
                for m in names {
                    let Data::NameMap { name, .. } = &m.data else { continue };
                    let Some(local) = sym(name) else { continue };
                    if let Some(id) = resolve(scopes, scope, &local) {
                        table.bind_def(name, id);
                        table.defs[id].export_listed = true;
                    }
                }
            }
        }
        // Every other node: terser's `_walk` order.
        _ => ast::walk_children(n, &mut |c| walk(c, scope, scopes, table)),
    }
}

fn exported_names(n: &N, out: &mut Vec<String>) {
    match &n.data {
        Data::Func { name: Some(name), .. } | Data::Class { name: Some(name), .. } => {
            if let Some(s) = sym(name) {
                out.push(s);
            }
        }
        Data::Defs { defs, .. } => {
            for d in defs {
                if let Data::VarDef { name, .. } = &d.data {
                    binding_names(name, out);
                }
            }
        }
        _ => {}
    }
}

fn binding_names(n: &N, out: &mut Vec<String>) {
    match &n.data {
        Data::Symbol { name, .. } => out.push(name.clone()),
        Data::Destructuring { names, .. } => names.iter().for_each(|x| binding_names(x, out)),
        Data::DefaultAssign { left, .. } | Data::Spread { expr: left } => binding_names(left, out),
        Data::Prop { value, .. } => binding_names(value, out),
        _ => {}
    }
}

fn hoist(stmts: &[N], fn_scope: usize, scopes: &mut Vec<Scope>, table: &mut SymTable) {
    for stmt in stmts {
        match &stmt.data {
            Data::Func { .. } => {
                if let Data::Func { kind: ast::FuncKind::Decl, name: Some(name), .. } = &stmt.data {
                    if let Some(sym_name) = sym(name) {
                        // terser `scope.js` `def_function`: a declaration's `init` is the function.
                        define(table, scopes, fn_scope, sym_name, name, SymKind::Defun, Some(Rc::clone(stmt)), false);
                    }
                }
            }
            Data::Defs { kind: DefKind::Var, defs, .. } => {
                for def in defs {
                    let Data::VarDef { name, value } = &def.data else { continue };
                    let Some(sym_name) = sym(name) else {
                        define_pattern(table, scopes, fn_scope, name, SymKind::Var);
                        continue;
                    };
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
            Data::Export { definition: Some(def), .. } => hoist(std::slice::from_ref(def), fn_scope, scopes, table),
            // terser `scope.def_variable(node)` for an `AST_SymbolImport`: the
            // local name of every import is a module binding.
            Data::Import { imported_name, imported_names, .. } => {
                let mut locals: Vec<N> = imported_name.iter().cloned().collect();
                for m in imported_names.iter().flatten() {
                    if let Data::NameMap { name, .. } = &m.data {
                        locals.push(Rc::clone(name));
                    }
                }
                for local in locals {
                    if let Data::Symbol { name, kind: SymKind::Import, .. } = &local.data {
                        define(table, scopes, fn_scope, name.clone(), &local, SymKind::Import, None, false);
                    }
                }
            }
            _ => {}
        }
    }
}

/// Direct `let`/`const` in this statement list, before nested references.
fn hoist_lexical(stmts: &[N], scope: usize, scopes: &mut Vec<Scope>, table: &mut SymTable) {
    for stmt in stmts {
        let stmt = match &stmt.data {
            Data::Export { definition: Some(def), .. } => def,
            _ => stmt,
        };
        let Data::Defs { kind, defs, .. } = &stmt.data else { continue };
        if matches!(kind, DefKind::Var) {
            continue;
        }
        for def in defs {
            let Data::VarDef { name, value } = &def.data else { continue };
            let sk = match kind {
                DefKind::Const => SymKind::Const,
                DefKind::Let => SymKind::Let,
                _ => SymKind::Var,
            };
            let Some(sym_name) = sym(name) else {
                define_pattern(table, scopes, scope, name, sk);
                continue;
            };
            define(table, scopes, scope, sym_name, name, sk, value.clone(), false);
        }
    }
}

/// The names a binding pattern declares: terser `AST_SymbolDeclaration`s
/// inside an `AST_Destructuring` or a parameter default. Their `init` is
/// null, as `def_variable(node, null)` gives a pattern name.
fn define_pattern(table: &mut SymTable, scopes: &mut [Scope], scope: usize, pat: &N, kind: SymKind) {
    let mut names = Vec::new();
    pattern_symbols(pat, &mut names);
    for name_node in names {
        if let Some(sym_name) = sym(&name_node) {
            define(table, scopes, scope, sym_name, &name_node, kind, None, false);
        }
    }
}

/// Declaration symbols of a pattern, left to right, without defaults or computed keys.
pub fn pattern_symbols(n: &N, out: &mut Vec<N>) {
    match &n.data {
        Data::Symbol { kind, .. } if *kind != SymKind::Ref => out.push(Rc::clone(n)),
        Data::Destructuring { names, .. } => names.iter().for_each(|x| pattern_symbols(x, out)),
        Data::DefaultAssign { left, .. } | Data::Spread { expr: left } => pattern_symbols(left, out),
        Data::Prop { value, .. } => pattern_symbols(value, out),
        _ => {}
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
    if let Some(&id) = scopes[scope].names.get(&name) {
        table.bind_def(node, id);
        table.defs[id].orig_count = table.defs[id].orig_count.saturating_add(1);
        table.defs[id].lexical |= matches!(kind, SymKind::Let | SymKind::Const | SymKind::Using);
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
        lexical: matches!(kind, SymKind::Let | SymKind::Const | SymKind::Using),
        init,
        fixed: None,
        fixed_null: false,
        var_decl: matches!(kind, SymKind::Var | SymKind::Let | SymKind::Const | SymKind::Using | SymKind::Catch),
        exported: false,
        export_listed: false,
        suppress_fixed: Cell::new(false),
        assignments: 0,
        escaped: 0,
        direct_access: false,
        recursive_refs: 0,
        references: Vec::new(),
        single_use: SingleUse::No,
        replaced: Cell::new(0),
        orig_count: 1,
    });
    scopes[scope].names.insert(name, id);
    table.bind_def(node, id);
    table.scope_defs.entry(scope).or_default().push(id);
}

/// terser `scope.js`: `with` sets `uses_with` and a direct `eval` sets
/// `uses_eval` on every enclosing scope, so all of them are `pinned()`.
fn pin_fn(table: &mut SymTable, scopes: &mut [Scope], scope: usize) {
    let mut chain = Vec::new();
    let mut cur = Some(scopes[scope].fn_scope);
    while let Some(s) = cur {
        chain.push(s);
        scopes[s].pinned = true;
        cur = scopes[s].parent.map(|p| scopes[p].fn_scope);
    }
    for def in &mut table.defs {
        if chain.contains(&def.fn_scope) {
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

fn sym(n: &N) -> Option<String> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name.clone()),
        _ => None,
    }
}

pub fn ptr(n: &N) -> usize {
    Rc::as_ptr(n) as usize
}

/// Index function and class `fixed` values so `retarget_fixed` can follow a compressed node.
/// terser mutates those nodes in place; `fixed()` then sees the optimized tree.
impl SymTable {
    /// The definition a symbol node refers to, through copies.
    /// terser `hoist_properties` `def_variable(new_var)`: a new name in the
    /// scope of the object it came from. `fixed` stays unset until the next
    /// `reduce_vars`, so the value is not inlined in this pass.
    pub fn define_hoisted(&mut self, created: Vec<(String, usize, N)>) {
        let mut ids: HashMap<String, usize> = HashMap::new();
        for (name, orig, node) in created {
            let id = *ids.entry(name.clone()).or_insert_with(|| {
                let o = &self.defs[orig];
                let def = SymbolDef {
                    name: name.clone(),
                    global: o.global,
                    undeclared: false,
                    funarg: false,
                    is_const: o.is_const,
                    is_defun: false,
                    pinned: o.pinned,
                    fn_scope: o.fn_scope,
                    scope: o.scope,
                    block_scoped: o.block_scoped,
                    lexical: o.lexical,
                    init: None,
                    fixed: None,
                    fixed_null: false,
                    var_decl: o.var_decl,
                    exported: false,
                    export_listed: false,
                    suppress_fixed: Cell::new(false),
                    assignments: 0,
                    escaped: 0,
                    direct_access: false,
                    recursive_refs: 0,
                    references: Vec::new(),
                    single_use: SingleUse::No,
                    replaced: Cell::new(0),
                    orig_count: 0,
                };
                let scope = def.scope;
                self.defs.push(def);
                let id = self.defs.len() - 1;
                self.scope_defs.entry(scope).or_default().push(id);
                id
            });
            let p = ptr(&node);
            if matches!(node.data, Data::Symbol { kind: SymKind::Ref, .. }) {
                self.defs[id].references.push(p);
            } else {
                self.defs[id].orig_count += 1;
            }
            self.bind_def(&node, id);
            // Keep the node alive so its address stays unique.
            self.alias.borrow_mut().insert(p, (id, node));
        }
    }

    fn bind_def(&mut self, n: &N, id: usize) {
        self.node_def.insert(ptr(n), id);
        self.id_def.borrow_mut().insert(n.id(), id);
    }

    fn bind_scope(&mut self, n: &N, sc: usize) {
        self.node_scope.insert(ptr(n), sc);
        self.id_scope.borrow_mut().insert(n.id(), sc);
    }

    /// The definition of symbol node `n` (through the rebuild and copy aliases).
    pub fn def_of(&self, n: &N) -> Option<usize> {
        let by_ptr = self.lookup(&ptr(n));
        if crate::audit::on() {
            crate::audit::check_entry("def", n, by_ptr, self.id_def.borrow().get(&n.id()).copied());
        }
        by_ptr
    }

    /// The scope id of scope node `n` (through the rebuild and copy aliases).
    pub fn scope_of(&self, n: &N) -> Option<usize> {
        let by_ptr = self.scope_lookup(&ptr(n));
        if crate::audit::on() {
            crate::audit::check_entry("scope", n, by_ptr, self.id_scope.borrow().get(&n.id()).copied());
        }
        by_ptr
    }

    /// terser's copy (`make_node(X, orig, orig)`, `clone()`): `to` keeps `from`'s definition
    /// and scope. Shadow tables only for now.
    pub fn copy_binding(&self, from: &N, to: &N) {
        let d = self.id_def.borrow().get(&from.id()).copied();
        if let Some(d) = d {
            self.id_def.borrow_mut().insert(to.id(), d);
        }
        let s = self.id_scope.borrow().get(&from.id()).copied();
        if let Some(s) = s {
            self.id_scope.borrow_mut().insert(to.id(), s);
        }
    }

    pub fn lookup(&self, p: &usize) -> Option<usize> {
        if let Some(id) = self.node_def.get(p) {
            return Some(*id);
        }
        self.alias.borrow().get(p).map(|(id, _)| *id)
    }

    /// terser `clone(true)` keeps `thedef`: point the copy's symbols at the
    /// original definitions.
    /// The scope id of a scope node, through copies.
    pub fn scope_lookup(&self, p: &usize) -> Option<usize> {
        if let Some(s) = self.node_scope.get(p) {
            return Some(*s);
        }
        self.alias_scope.borrow().get(p).map(|(s, _)| *s)
    }

    pub fn alias_copy(&self, orig: &N, copy: &N) {
        self.copy_binding(orig, copy);
        if let Some(sc) = self.scope_of(orig) {
            if !Rc::ptr_eq(orig, copy) {
                self.alias_scope.borrow_mut().insert(ptr(copy), (sc, Rc::clone(copy)));
            }
        }
        if let Some(id) = self.def_of(orig) {
            if !Rc::ptr_eq(orig, copy) {
                self.alias.borrow_mut().insert(ptr(copy), (id, Rc::clone(copy)));
            }
        }
        let mut a = Vec::new();
        ast::transform_children(orig, &mut |c| a.push(Rc::clone(c)));
        let mut b = Vec::new();
        ast::transform_children(copy, &mut |c| b.push(Rc::clone(c)));
        for (x, y) in a.iter().zip(b.iter()) {
            self.alias_copy(x, y);
        }
    }
}

pub fn index_func_fixed(table: &mut SymTable) {
    table.fixed_of_node.clear();
    for (id, def) in table.defs.iter().enumerate() {
        // terser keeps `fixed` as `() => node.value`, so a compressed
        // initializer is what later reads see. Every fixed node is tracked.
        let Some(value) = &def.fixed else { continue };
        table.fixed_of_node.entry(ptr(value)).or_default().push(id);
    }
}

/// Point `fixed` at `new_node` when it still holds the node that was just compressed.
pub fn retarget_fixed(table: &mut SymTable, old_ptr: usize, new_node: &N) {
    // The rebuilt scope node is the same scope (terser mutates in place).
    if let Some(&scope) = table.node_scope.get(&old_ptr) {
        table.node_scope.entry(ptr(new_node)).or_insert(scope);
    }
    let Some(ids) = table.fixed_of_node.remove(&old_ptr) else { return };
    for id in &ids {
        if let Some(def) = table.defs.get_mut(*id) {
            if def.fixed.as_ref().is_some_and(|f| ptr(f) == old_ptr) {
                def.fixed = Some(Rc::clone(new_node));
            }
        }
    }
    table.fixed_of_node.entry(ptr(new_node)).or_default().extend(ids);
}

/// Drop declarations whose references were all replaced.
/// terser `lib/compress/drop-unused.js` drops a def when `unused` is on and
/// every reference was eliminated. This is the single-use constant case.
thread_local! {
    /// `toplevel.vars`: a global whose reads were all inlined can go.
    static DROP_GLOBALS: Cell<bool> = const { Cell::new(false) };
}

pub fn drop_replaced_toplevel(root: &N, table: &SymTable, unused: bool, toplevel_vars: bool) -> N {
    DROP_GLOBALS.with(|g| g.set(toplevel_vars));
    let out = drop_replaced(root, table, unused);
    DROP_GLOBALS.with(|g| g.set(false));
    out
}

pub fn drop_replaced(root: &N, table: &SymTable, unused: bool) -> N {
    if !unused {
        return Rc::clone(root);
    }
    drop_node(root, table)
}

fn drop_node(n: &N, table: &SymTable) -> N {
    match &n.data {
        Data::Toplevel { body } => renode(n, Data::Toplevel { body: drop_list(body, table) }),
        Data::Block { body } => renode(n, Data::Block { body: drop_list(body, table) }),
        Data::Func { kind, name, args, body, async_, generator } => renode(
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
            renode(n, Data::Defs { kind: *kind, defs, await_: *await_ })
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
    if d.assignments > 0 || d.undeclared || d.exported || d.export_listed || (d.global && !DROP_GLOBALS.with(|g| g.get())) {
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
    renode(n, data)
}

fn node(orig: &N, data: Data) -> N {
    Node::make(orig, data)
}

/// keep: `drop_replaced` is a port-only filter over the same statements (drop_unused edits
/// `definitions` in place too, du 391).
fn renode(orig: &N, data: Data) -> N {
    orig.rebuild(data)
}
