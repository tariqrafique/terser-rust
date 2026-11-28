//! terser `lib/compress/index.js` `AST_Scope.hoist_properties` and `hoist_declarations`.
//!
//! Both run at the start of `Compressor.before`, before the scope is descended.

use ast::{Data, DefKind, FuncKind, Key, N, Node, SymKind};
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

use crate::syms::{self, SingleUse, SymTable};

thread_local! {
    /// Symbols `hoist_properties` made: (new name, original def, node).
    /// terser `self.def_variable(new_var)` gives each name a definition.
    static CREATED: std::cell::RefCell<Vec<(String, usize, N)>> = const { std::cell::RefCell::new(Vec::new()) };
}

/// The symbols the last `hoist` made, for the caller to define.
pub fn take_created() -> Vec<(String, usize, N)> {
    CREATED.with(|c| std::mem::take(&mut *c.borrow_mut()))
}

pub fn hoist(n: &N, hoist_props: bool, hoist_funs: bool, hoist_vars: bool, toplevel_vars: bool, top_retain: Option<&str>, table: Option<&SymTable>) -> N {
    let n = if hoist_props {
        hoist_properties(n, toplevel_vars, top_retain, table)
    } else {
        Rc::clone(n)
    };
    if hoist_funs || hoist_vars {
        hoist_declarations(&n, hoist_funs, hoist_vars)
    } else {
        n
    }
}

/// terser `index.js` `hoist_declarations`.
fn hoist_declarations(n: &N, hoist_funs: bool, mut hoist_vars: bool) -> N {
    let Some(body) = scope_body(n) else { return Rc::clone(n) };
    hoist_vars = hoist_vars && count_vars(body) > 1;
    if !hoist_vars && !hoist_funs {
        return Rc::clone(n);
    }
    let mut dirs = Vec::new();
    let mut funs = Vec::new();
    let mut slots: Vec<Slot> = Vec::new();
    let body = rewrite_list(body, hoist_vars, hoist_funs, true, &mut dirs, &mut funs, &mut slots);
    if slots.is_empty() {
        hoist_vars = false;
    }
    let mut body = body;
    if hoist_vars && !slots.is_empty() {
        // Drop names that are also parameters.
        if let Data::Func { args, .. } = &n.data {
            let params: HashSet<&str> = args.iter().filter_map(sym_name).collect();
            slots.retain(|s| !params.contains(s.name.as_str()));
        }
        let mut i = 0;
        while i < body.len() {
            if let Data::Simple { body: expr } = &body[i].data {
                if take_assign(expr, &mut slots) {
                    body.remove(i);
                    continue;
                }
                if let Data::Seq { exprs } = &expr.data {
                    if let Some(first) = exprs.first() {
                        if take_assign(first, &mut slots) {
                            let rest: Vec<N> = exprs.iter().skip(1).cloned().collect();
                            if rest.is_empty() {
                                body.remove(i);
                            } else {
                                let expr = if rest.len() == 1 { rest.into_iter().next().unwrap() } else { seq_node(expr, rest) };
                                // keep: `self.body[i].body = make_sequence(..)` (index.js 855).
                                body[i] = edit(&body[i], Data::Simple { body: expr });
                            }
                            continue;
                        }
                    }
                }
            }
            if matches!(body[i].data, Data::Empty) {
                body.remove(i);
                continue;
            }
            if let Data::Block { body: inner } = &body[i].data {
                let inner = inner.clone();
                body.splice(i..=i, inner);
                continue;
            }
            break;
        }
        if !slots.is_empty() {
            let defs: Vec<N> = slots.into_iter().map(|s| s.def).collect();
            funs.push(defs_node(n, defs));
        }
    }
    let mut out = Vec::new();
    out.extend(dirs);
    out.extend(funs);
    out.extend(body);
    with_body(n, out)
}

struct Slot {
    name: String,
    def: N,
    filled: bool,
}

fn take_assign(expr: &N, slots: &mut Vec<Slot>) -> bool {
    let Data::Assign { op, left, right, logical: false } = &expr.data else { return false };
    if op != "=" { return false }
    let Some(name) = sym_name(left) else { return false };
    let Some(idx) = slots.iter().position(|s| s.name == name && !s.filled) else { return false };
    let mut slot = slots.remove(idx);
    slot.filled = true;
    // keep: `def.value = expr.right` on the cloned definition (index.js 838, 852).
    slot.def = edit(&slot.def, Data::VarDef { name: Rc::clone(left), value: Some(Rc::clone(right)) });
    slots.push(slot);
    true
}

fn rewrite_list(list: &[N], hoist_vars: bool, hoist_funs: bool, direct: bool, dirs: &mut Vec<N>, funs: &mut Vec<N>, slots: &mut Vec<Slot>) -> Vec<N> {
    list.iter().map(|n| rewrite(n, hoist_vars, hoist_funs, direct, dirs, funs, slots)).collect()
}

fn rewrite(n: &N, hoist_vars: bool, hoist_funs: bool, direct: bool, dirs: &mut Vec<N>, funs: &mut Vec<N>, slots: &mut Vec<Slot>) -> N {
    match &n.data {
        Data::Directive { .. } => {
            dirs.push(Rc::clone(n));
            empty(n)
        }
        Data::Func { kind: FuncKind::Decl, .. } if hoist_funs && direct => {
            funs.push(Rc::clone(n));
            empty(n)
        }
        Data::Func { .. } | Data::Class { .. } | Data::StaticBlock { .. } => Rc::clone(n),
        Data::Defs { kind: DefKind::Var, defs, .. } if hoist_vars && defs.iter().all(|d| is_simple_name(d)) => {
            for def in defs {
                if let Data::VarDef { name, .. } = &def.data {
                    if let Some(sym) = sym_name(name) {
                        slots.push(Slot { name: sym.to_string(), def: vardef(def, name, None), filled: false });
                    }
                }
            }
            match to_assignments(n, defs) {
                None => empty(n),
                Some(expr) => simple(n, expr),
            }
        }
        Data::For { init, cond, step, body } => {
            let init = init.as_ref().map(|i| rewrite(i, hoist_vars, hoist_funs, false, dirs, funs, slots));
            let init = match init {
                Some(i) if matches!(i.data, Data::Empty) => None,
                Some(i) => match &i.data {
                    Data::Simple { body } => Some(Rc::clone(body)),
                    _ => Some(i),
                },
                None => None,
            };
            let body = rewrite(body, hoist_vars, hoist_funs, false, dirs, funs, slots);
            // keep: the transformer's `descend` (index.js 767-807).
            edit(n, Data::For { init, cond: cond.clone(), step: step.clone(), body })
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            let init = rewrite(init, hoist_vars, hoist_funs, false, dirs, funs, slots);
            let init = if let Data::Simple { body } = &init.data { Rc::clone(body) } else { init };
            let body = rewrite(body, hoist_vars, hoist_funs, false, dirs, funs, slots);
            match &n.data {
                Data::ForOf { await_, .. } => edit(n, Data::ForOf { init, object: Rc::clone(object), body, await_: *await_ }),
                _ => edit(n, Data::ForIn { init, object: Rc::clone(object), body }),
            }
        }
        other => finish_children(n, other, |c, direct_child| rewrite(c, hoist_vars, hoist_funs, direct_child, dirs, funs, slots)),
    }
}

fn to_assignments(span: &N, defs: &[N]) -> Option<N> {
    let mut assigns = Vec::new();
    for def in defs {
        let Data::VarDef { name, value: Some(value) } = &def.data else { continue };
        let refer = sym_ref(name);
        assigns.push(finish(def, Data::Assign { op: "=".into(), left: refer, right: Rc::clone(value), logical: false }));
    }
    match assigns.len() {
        0 => None,
        1 => assigns.pop(),
        _ => Some(seq_node(span, assigns)),
    }
}

fn is_simple_name(def: &N) -> bool {
    matches!(&def.data, Data::VarDef { name, .. } if matches!(name.data, Data::Symbol { .. }))
}

fn count_vars(list: &[N]) -> i32 {
    let mut n = 0;
    for stmt in list {
        count_node(stmt, &mut n);
    }
    n
}

fn count_node(n: &N, count: &mut i32) {
    match &n.data {
        Data::Func { .. } | Data::Class { .. } | Data::StaticBlock { .. } => {}
        Data::Defs { kind: DefKind::Var, .. } => *count += 1,
        _ => ast::walk_children(n, &mut |c| count_node(c, count)),
    }
}

/// terser `index.js` `hoist_properties`.
fn hoist_properties(n: &N, toplevel_vars: bool, top_retain: Option<&str>, table: Option<&SymTable>) -> N {
    let Some(table) = table else { return Rc::clone(n) };
    let Some(&scope) = table.scope_of(n).as_ref() else { return Rc::clone(n) };
    let mut plan: HashMap<usize, Hoisted> = HashMap::new();
    let mut used = visible_names(table, scope);
    collect_props(n, n, table, scope, toplevel_vars, top_retain, &mut used, &mut plan);
    if plan.is_empty() {
        return Rc::clone(n);
    }
    rewrite_props(n, table, &plan)
}

fn collect_props(root: &N, n: &N, table: &SymTable, scope: usize, toplevel_vars: bool, top_retain: Option<&str>, used: &mut HashSet<String>, plan: &mut HashMap<usize, Hoisted>) {
    if syms::ptr(n) != syms::ptr(root) && matches!(n.data, Data::Func { .. } | Data::StaticBlock { .. }) {
        return;
    }
    if let Data::Defs { kind: DefKind::Var | DefKind::Let | DefKind::Const, defs, .. } = &n.data {
        for def in defs {
            let Data::VarDef { name, value: Some(value) } = &def.data else { continue };
            let Some(id) = table.def_of(name) else { continue };
            // terser `sym.scope === self`: a `var` declared in a nested block keeps
            // that block as its scope.
            if table.block_vars.contains(&name.id()) { continue }
            let d = &table.defs[id];
            let exposed = d.exported || d.export_listed || (d.global && if d.is_defun { false } else { !toplevel_vars });
            if d.scope != scope || d.assignments != 0 || d.direct_access || d.escaped == 1 || d.single_use != SingleUse::No || exposed || top_retain == Some(d.name.as_str()) {
                continue;
            }
            let Some(fixed) = &d.fixed else { continue };
            // `sym.fixed_value() === node.value` (index.js 902): the same node, by id (a rebuild
            // that keeps the id is terser's in-place edit of that object).
            if fixed.id() != value.id() { continue }
            let Data::Object { props } = &value.data else { continue };
            // terser refuses a spread or a computed key only. Any other value is hoisted:
            // `reduce_vars` already gave a method call that may read `this` no fixed value
            // (`is_modified`), and a read of a getter or a method makes `direct_access`
            // (`read_property` gives nothing). An object with a getter or a method that is
            // never read is dropped either way, so those stay refused here.
            if props.is_empty() || !props.iter().all(|p| matches!(&p.data, Data::Prop { key: Key::Static { .. }, method: None, .. })) { continue }
            let keys: HashSet<String> = props.iter().filter_map(|p| match &p.data {
                Data::Prop { key: Key::Static { name, .. }, .. } => Some(name.clone()),
                _ => None,
            }).collect();
            if !uses_are_props(root, table, id, &keys) { continue }
            let mut mapped = HashMap::new();
            let base = &d.name;
            // terser names the new variables in property order.
            let ordered: Vec<String> = props.iter().filter_map(|p| match &p.data {
                Data::Prop { key: Key::Static { name, .. }, .. } => Some(name.clone()),
                _ => None,
            }).collect();
            // One new variable per property; a repeated key reads the last one
            // (`defs.set(String(key), ...)`).
            let mut names = Vec::new();
            for key in &ordered {
                let fresh = fresh_name(&sanitize(&format!("{base}_{key}")), used);
                used.insert(fresh.clone());
                names.push(fresh.clone());
                mapped.insert(key.clone(), fresh);
            }
            plan.insert(id, Hoisted { names, by_key: mapped });
        }
    }
    // terser's hoister is a TreeTransformer.
    ast::transform_children(n, &mut |c| collect_props(root, c, table, scope, toplevel_vars, top_retain, used, plan));
}

fn uses_are_props(scope: &N, table: &SymTable, id: usize, keys: &HashSet<String>) -> bool {
    fn walk(n: &N, table: &SymTable, id: usize, keys: &HashSet<String>, bad: &mut bool) {
        if *bad { return }
        match &n.data {
            Data::Dot { expr, prop, .. } if is_ref_of(table, expr, id) => {
                if !keys.contains(prop) { *bad = true }
            }
            Data::Sub { expr, prop, .. } if is_ref_of(table, expr, id) => {
                if !sub_key(prop).is_some_and(|k| keys.contains(&k)) {
                    *bad = true
                }
            }
            Data::Assign { left, .. } if prop_of(table, left, id) => *bad = true,
            Data::Unary { op, expr, .. } if matches!(op.as_str(), "++" | "--") && prop_of(table, expr, id) => *bad = true,
            Data::Symbol { kind: SymKind::Ref, .. } if is_ref_of(table, n, id) => *bad = true,
            _ => ast::walk_children(n, &mut |c| walk(c, table, id, keys, bad)),
        }
    }
    let mut bad = false;
    walk(scope, table, id, keys, &mut bad);
    !bad
}

/// terser `get_simple_key` of a `[]` property, as `String(key)`.
fn sub_key(prop: &N) -> Option<String> {
    match &prop.data {
        Data::String { value, .. } => Some(value.clone()),
        Data::Number { value, .. } if value.is_finite() && value.fract() == 0.0 && value.abs() < 1e21 && !(*value == 0.0 && value.is_sign_negative()) => {
            Some(format!("{}", *value as i64))
        }
        _ => None,
    }
}

fn prop_of(table: &SymTable, n: &N, id: usize) -> bool {
    match &n.data {
        Data::Dot { expr, .. } | Data::Sub { expr, .. } => is_ref_of(table, expr, id),
        _ => false,
    }
}

fn is_ref_of(table: &SymTable, n: &N, id: usize) -> bool {
    table.def_of(n) == Some(id)
}

fn rewrite_props(n: &N, table: &SymTable, plan: &HashMap<usize, Hoisted>) -> N {
    match &n.data {
        Data::Defs { kind, defs, await_ } => {
            let mut out = Vec::new();
            let mut changed = false;
            for def in defs {
                if let Data::VarDef { name, value: Some(value) } = &def.data {
                    if let Some(id) = table.def_of(name) {
                        if let Some(keys) = plan.get(&id) {
                            if let Data::Object { props } = &value.data {
                                let mut names = keys.names.iter();
                                for prop in props {
                                    let Data::Prop { key: Key::Static { .. }, value, .. } = &prop.data else { continue };
                                    let Some(fresh) = names.next() else { continue };
                                    let sym = sym_node(prop, fresh, sym_kind(*kind));
                                    CREATED.with(|c| c.borrow_mut().push((fresh.clone(), id, Rc::clone(&sym))));
                                    out.push(vardef(prop, &sym, Some(rewrite_props(value, table, plan))));
                                }
                                changed = true;
                                continue;
                            }
                        }
                    }
                }
                let m = rewrite_props(def, table, plan);
                changed |= !Rc::ptr_eq(&m, def);
                out.push(m);
            }
            if !changed {
                return Rc::clone(n);
            }
            // keep: `MAP.splice` into the definitions list, in place.
            edit(n, Data::Defs { kind: *kind, defs: out, await_: *await_ })
        }
        Data::Dot { expr, prop, .. } if expr_plan(table, expr, plan).is_some_and(|keys| keys.contains_key(prop)) => {
            let id = table.def_of(expr).unwrap();
            let fresh = expr_plan(table, expr, plan).unwrap().get(prop).unwrap();
            let r = sym_ref_named(n, fresh);
            CREATED.with(|c| c.borrow_mut().push((fresh.clone(), id, Rc::clone(&r))));
            r
        }
        Data::Sub { expr, prop, .. } => {
            if let Some(value) = sub_key(prop) {
                if expr_plan(table, expr, plan).is_some_and(|keys| keys.contains_key(&value)) {
                    let id = table.def_of(expr).unwrap();
                    let fresh = expr_plan(table, expr, plan).unwrap().get(&value).unwrap();
                    let r = sym_ref_named(n, fresh);
                    CREATED.with(|c| c.borrow_mut().push((fresh.clone(), id, Rc::clone(&r))));
                    return r;
                }
            }
            finish_map(n, |c| rewrite_props(c, table, plan))
        }
        _ => finish_map(n, |c| rewrite_props(c, table, plan)),
    }
}

fn expr_plan<'a>(table: &SymTable, expr: &N, plan: &'a HashMap<usize, Hoisted>) -> Option<&'a HashMap<String, String>> {
    let id = table.def_of(expr)?;
    plan.get(&id).map(|h| &h.by_key)
}

/// The variables made for one object: one per property in order, and the one a
/// read of each key becomes (the last property with that key).
struct Hoisted {
    names: Vec<String>,
    by_key: HashMap<String, String>,
}

fn visible_names(table: &SymTable, scope: usize) -> HashSet<String> {
    let mut names = HashSet::new();
    let mut cursor = Some(scope);
    let mut guard = 0;
    while let Some(id) = cursor {
        if let Some(defs) = table.scope_defs.get(&id) {
            for def in defs {
                names.insert(table.defs[*def].name.clone());
            }
        }
        cursor = table.scope_parent.get(id).copied().flatten();
        guard += 1;
        if guard > 10_000 { break }
    }
    let fn_scope = table.fn_of.get(scope).copied().unwrap_or(scope);
    for def in &table.defs {
        if def.fn_scope == fn_scope {
            names.insert(def.name.clone());
        }
    }
    names
}

fn fresh_name(tentative: &str, used: &HashSet<String>) -> String {
    if !used.contains(tentative) {
        return tentative.to_string();
    }
    let mut i = 0;
    loop {
        let name = format!("{tentative}${i}");
        if !used.contains(&name) {
            return name;
        }
        i += 1;
    }
}

fn sanitize(name: &str) -> String {
    let mut out = String::new();
    for (i, ch) in name.chars().enumerate() {
        let ok = if i == 0 { ch.is_ascii_alphabetic() || ch == '_' || ch == '$' } else { ch.is_ascii_alphanumeric() || ch == '_' || ch == '$' };
        out.push(if ok { ch } else { '_' });
    }
    if out.is_empty() { "_".into() } else { out }
}

fn sym_kind(kind: DefKind) -> SymKind {
    match kind {
        DefKind::Let => SymKind::Let,
        DefKind::Const => SymKind::Const,
        DefKind::Using => SymKind::Using,
        DefKind::Var => SymKind::Var,
    }
}

fn sym_name(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name.as_str()),
        _ => None,
    }
}

fn sym_ref(name: &N) -> N {
    match &name.data {
        Data::Symbol { name: text, .. } => sym_node(name, text, SymKind::Ref),
        _ => Rc::clone(name),
    }
}

fn sym_ref_named(span: &N, name: &str) -> N {
    sym_node(span, name, SymKind::Ref)
}

fn sym_node(span: &N, name: &str, kind: SymKind) -> N {
    finish(span, Data::Symbol { name: name.into(), kind, quote: None })
}

fn vardef(span: &N, name: &N, value: Option<N>) -> N {
    finish(span, Data::VarDef { name: Rc::clone(name), value })
}

fn defs_node(span: &N, defs: Vec<N>) -> N {
    finish(span, Data::Defs { kind: DefKind::Var, defs, await_: false })
}

fn simple(span: &N, body: N) -> N {
    finish(span, Data::Simple { body })
}

fn empty(span: &N) -> N {
    finish(span, Data::Empty)
}

fn seq_node(span: &N, exprs: Vec<N>) -> N {
    finish(span, Data::Seq { exprs })
}

fn scope_body(n: &N) -> Option<&[N]> {
    match &n.data {
        Data::Toplevel { body } | Data::Func { body, .. } | Data::StaticBlock { body } => Some(body),
        _ => None,
    }
}

/// keep: `self.body = dirs.concat(hoisted, self.body)` (index.js 875).
fn with_body(n: &N, body: Vec<N>) -> N {
    match &n.data {
        Data::Toplevel { .. } => edit(n, Data::Toplevel { body }),
        Data::StaticBlock { .. } => edit(n, Data::StaticBlock { body }),
        Data::Func { kind, name, args, async_, generator, .. } => edit(n, Data::Func {
            kind: *kind, name: name.clone(), args: args.clone(), body, async_: *async_, generator: *generator,
        }),
        _ => Rc::clone(n),
    }
}

/// new: terser `make_node(X, span, ..)`.
fn finish(span: &N, data: Data) -> N {
    Node::make(span, data)
}

/// keep: an in-place edit of `n`.
fn edit(n: &N, data: Data) -> N {
    n.rebuild(data)
}

fn finish_children(n: &N, data: &Data, mut map: impl FnMut(&N, bool) -> N) -> N {
    let _ = data;
    finish_map(n, |c| map(c, false))
}

fn finish_map(n: &N, mut map: impl FnMut(&N) -> N) -> N {
    // Every child, so `export` definitions and other statements are reached.
    let mut changed = false;
    let out = ast::map_children(n, &mut |c| {
        let m = map(c);
        if !Rc::ptr_eq(&m, c) {
            changed = true;
        }
        m
    });
    if changed { out } else { Rc::clone(n) }
}
