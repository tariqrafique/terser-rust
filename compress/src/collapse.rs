//! Straight-line `collapse_vars` for a pure single binding.
//!
//! `var a = c; use(a)` becomes `use(c)` when `a` is never written, `c` is a
//! pure value, and the declaration is not inside a conditional or a loop.
//! `var b; (b = a, y(b))` becomes `y(a)` when that assignment is the only
//! write and its value is discarded.

use ast::{Data, DefKind, FuncKind, Key, N, Node, Seg, SymKind};
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

pub fn collapse(root: &N, unused: bool) -> N {
    rebuild(root, &HashMap::new(), &HashSet::new(), &HashSet::new(), unused)
}

struct Slot {
    init: Option<N>,
    assign_rhs: Option<N>,
    assigns: u32,
    reads: u32,
    ready: bool,
    read_before: bool,
    assign_discardable: bool,
}

fn rebuild(n: &N, subs: &HashMap<String, N>, drop_decls: &HashSet<String>, drop_assigns: &HashSet<String>, unused: bool) -> N {
    if let Data::Func { kind, name, args, body, async_, generator } = &n.data {
        if matches!(kind, FuncKind::Expr | FuncKind::Decl | FuncKind::Arrow | FuncKind::Accessor) {
            return collapse_func(n, kind, name, args, body, *async_, *generator, subs, unused);
        }
    }
    if let Some(name) = ref_name(n) {
        if let Some(value) = subs.get(name) {
            return Rc::clone(value);
        }
    }
    map_children(n, subs, drop_decls, drop_assigns, unused)
}

fn collapse_func(
    n: &N,
    kind: &FuncKind,
    name: &Option<N>,
    args: &[N],
    body: &[N],
    async_: bool,
    generator: bool,
    parent_subs: &HashMap<String, N>,
    unused: bool,
) -> N {
    let params = names_of(args);
    let plan = if contains_poison(body) {
        FullPlan { subs: HashMap::new(), drop_decls: HashSet::new(), drop_assigns: HashSet::new(), locals: HashMap::new() }
    } else {
        plan_for(body, &params, unused)
    };
    let mut subs = parent_subs.clone();
    for param in &params {
        subs.remove(param);
    }
    for name in plan.locals.keys() {
        if !plan.subs.contains_key(name) {
            subs.remove(name);
        }
    }
    // The function name shadows an outer binding of the same name.
    if let Some(fname) = name.as_ref().and_then(|n| ref_name(n).map(|s| s.to_string()).or_else(|| sym_name(n))) {
        subs.remove(&fname);
    }
    subs.extend(plan.subs.clone());
    let body = body
        .iter()
        .filter_map(|stmt| rebuild_stmt(stmt, &subs, &plan.drop_decls, &plan.drop_assigns, unused))
        .collect();
    node(
        n,
        Data::Func {
            kind: *kind,
            name: name.clone(),
            args: args.to_vec(),
            body,
            async_,
            generator,
        },
    )
}

struct FullPlan {
    subs: HashMap<String, N>,
    drop_decls: HashSet<String>,
    drop_assigns: HashSet<String>,
    locals: HashMap<String, ()>,
}

fn plan_for(body: &[N], params: &HashSet<String>, unused: bool) -> FullPlan {
    let mut slots: HashMap<String, Slot> = HashMap::new();
    collect_decls(body, &mut slots);
    let mut written_params = HashSet::new();
    let mut stack: Vec<HashSet<String>> = Vec::new();
    count(body, &mut slots, params, &mut written_params, &mut stack);
    let mut subs = HashMap::new();
    let mut drop_decls = HashSet::new();
    let mut drop_assigns = HashSet::new();
    let locals: HashMap<String, ()> = slots.keys().map(|k| (k.clone(), ())).collect();
    let names: Vec<String> = slots.keys().cloned().collect();
    for name in names {
        let Some(value) = inline_value(&name, &slots, params, &written_params, &mut HashSet::new()) else {
            continue;
        };
        let slot = slots.get(&name).unwrap();
        if slot.reads == 0 {
            if unused {
                drop_decls.insert(name);
            }
            continue;
        }
        let value_len = codegen::print(&value).len();
        let overhead = if unused {
            (name.len() + 2 + value_len) / slot.reads as usize
        } else {
            0
        };
        if value_len > name.len() + overhead {
            continue;
        }
        subs.insert(name.clone(), value);
        if unused {
            drop_decls.insert(name.clone());
            if slot.init.is_none() {
                drop_assigns.insert(name);
            }
        }
    }
    FullPlan { subs, drop_decls, drop_assigns, locals }
}

fn inline_value(
    name: &str,
    slots: &HashMap<String, Slot>,
    params: &HashSet<String>,
    written_params: &HashSet<String>,
    seen: &mut HashSet<String>,
) -> Option<N> {
    if !seen.insert(name.to_string()) {
        return None;
    }
    let slot = slots.get(name)?;
    if slot.read_before || slot.reads == 0 && slot.init.is_none() {
        return None;
    }
    if let Some(init) = &slot.init {
        if slot.assigns != 0 {
            return None;
        }
        return pure_value(init, slots, params, written_params, seen);
    }
    if slot.assigns == 1 && slot.assign_discardable {
        if let Some(rhs) = &slot.assign_rhs {
            return pure_value(rhs, slots, params, written_params, seen);
        }
    }
    None
}

fn pure_value(
    n: &N,
    slots: &HashMap<String, Slot>,
    params: &HashSet<String>,
    written_params: &HashSet<String>,
    seen: &mut HashSet<String>,
) -> Option<N> {
    match &n.data {
        Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null => Some(Rc::clone(n)),
        Data::Unary { op, expr, prefix: true } if matches!(op.as_str(), "void" | "!" | "~" | "-" | "+") => {
            pure_value(expr, slots, params, written_params, seen)?;
            Some(Rc::clone(n))
        }
        Data::Symbol { name, kind: SymKind::Ref, .. } => {
            if params.contains(name) && !written_params.contains(name) {
                return Some(Rc::clone(n));
            }
            if slots.contains_key(name) {
                return inline_value(name, slots, params, written_params, seen);
            }
            None
        }
        _ => None,
    }
}

fn collect_decls(stmts: &[N], slots: &mut HashMap<String, Slot>) {
    for stmt in stmts {
        match &stmt.data {
            Data::Block { body } => collect_decls(body, slots),
            Data::Defs { defs, .. } => {
                for def in defs {
                    let Data::VarDef { name, value } = &def.data else {
                        continue;
                    };
                    let Some(sym) = sym_name(name) else {
                        continue;
                    };
                    if slots.contains_key(&sym) {
                        if let Some(slot) = slots.get_mut(&sym) {
                            slot.init = None;
                            slot.assigns = u32::MAX;
                        }
                        continue;
                    }
                    slots.insert(
                        sym,
                        Slot {
                            init: value.clone(),
                            assign_rhs: None,
                            assigns: 0,
                            reads: 0,
                            ready: false,
                            read_before: false,
                            assign_discardable: false,
                        },
                    );
                }
            }
            Data::Func { .. } | Data::Class { .. } => {}
            _ => {}
        }
    }
}

struct Count<'a> {
    slots: &'a mut HashMap<String, Slot>,
    params: &'a HashSet<String>,
    written_params: &'a mut HashSet<String>,
    stack: &'a mut Vec<HashSet<String>>,
}

fn count(stmts: &[N], slots: &mut HashMap<String, Slot>, params: &HashSet<String>, written: &mut HashSet<String>, stack: &mut Vec<HashSet<String>>) {
    let mut ctx = Count { slots, params, written_params: written, stack };
    for stmt in stmts {
        walk(stmt, false, &mut ctx);
    }
}

fn walk(n: &N, discarded: bool, ctx: &mut Count) {
    match &n.data {
        Data::Func { args, body, .. } => {
            let frame = local_names(args, body);
            ctx.stack.push(frame);
            for stmt in body {
                walk(stmt, false, ctx);
            }
            ctx.stack.pop();
        }
        Data::Block { body } | Data::StaticBlock { body } => {
            let lets = direct_lets(body);
            ctx.stack.push(lets);
            for stmt in body {
                walk(stmt, false, ctx);
            }
            ctx.stack.pop();
        }
        Data::Defs { defs, .. } => {
            for def in defs {
                if let Data::VarDef { name, value } = &def.data {
                    if let Some(value) = value {
                        walk(value, false, ctx);
                    }
                    if let Some(sym) = sym_name(name) {
                        if let Some(slot) = ctx.slots.get_mut(&sym) {
                            if !hidden(ctx.stack, &sym) && value.is_some() {
                                slot.ready = true;
                            }
                        }
                    }
                }
            }
        }
        Data::Assign { op, left, right, logical } => {
            walk(right, false, ctx);
            if *logical || op != "=" {
                walk(left, false, ctx);
                if let Some(sym) = sym_name(left) {
                    note_write(&sym, None, false, ctx);
                }
            } else if let Some(sym) = sym_name(left) {
                note_write(&sym, Some(right), discarded, ctx);
            } else {
                walk(left, false, ctx);
            }
        }
        Data::Unary { op, expr, .. } if matches!(op.as_str(), "++" | "--") => {
            if let Some(sym) = sym_name(expr) {
                note_write(&sym, None, false, ctx);
            } else {
                walk(expr, false, ctx);
            }
        }
        Data::Symbol { name, kind: SymKind::Ref, .. } => {
            if hidden(ctx.stack, name) {
                return;
            }
            if ctx.params.contains(name) {
                return;
            }
            if let Some(slot) = ctx.slots.get_mut(name) {
                slot.reads = slot.reads.saturating_add(1);
                if !slot.ready {
                    slot.read_before = true;
                }
            }
        }
        Data::Seq { exprs } => {
            let last = exprs.len().saturating_sub(1);
            for (i, expr) in exprs.iter().enumerate() {
                walk(expr, i != last, ctx);
            }
        }
        Data::Simple { body } => walk(body, true, ctx),
        Data::With { .. } => {
            // A `with` makes every free name unsafe. Poison every candidate.
            for slot in ctx.slots.values_mut() {
                slot.assigns = u32::MAX;
            }
        }
        Data::Call { expr, args, .. } => {
            if ref_name(expr) == Some("eval") && !hidden(ctx.stack, "eval") && !ctx.params.contains("eval") {
                for slot in ctx.slots.values_mut() {
                    slot.assigns = u32::MAX;
                }
            }
            walk(expr, false, ctx);
            for arg in args {
                walk(arg, false, ctx);
            }
        }
        other => walk_data(other, ctx),
    }
}

fn note_write(sym: &str, rhs: Option<&N>, discarded: bool, ctx: &mut Count) {
    if hidden(ctx.stack, sym) {
        return;
    }
    if ctx.params.contains(sym) {
        ctx.written_params.insert(sym.to_string());
        return;
    }
    let Some(slot) = ctx.slots.get_mut(sym) else {
        return;
    };
    if slot.assigns == 0 {
        if let Some(rhs) = rhs {
            slot.assign_rhs = Some(Rc::clone(rhs));
            slot.assign_discardable = discarded;
        }
    }
    slot.assigns = slot.assigns.saturating_add(1);
    slot.ready = true;
}

fn hidden(stack: &[HashSet<String>], name: &str) -> bool {
    stack.iter().any(|frame| frame.contains(name))
}

fn local_names(args: &[N], body: &[N]) -> HashSet<String> {
    let mut names = names_of(args);
    prescan(body, &mut names);
    names
}

fn prescan(stmts: &[N], names: &mut HashSet<String>) {
    for stmt in stmts {
        match &stmt.data {
            Data::Func { .. } => {}
            Data::Block { body } | Data::StaticBlock { body } => prescan(body, names),
            Data::Defs { defs, .. } => {
                for def in defs {
                    if let Data::VarDef { name, .. } = &def.data {
                        if let Some(sym) = sym_name(name) {
                            names.insert(sym);
                        }
                    }
                }
            }
            Data::Catch { arg, body } => {
                if let Some(arg) = arg {
                    if let Some(sym) = sym_name(arg) {
                        names.insert(sym);
                    }
                }
                prescan_node(body, names);
            }
            Data::If { body, alt, .. } => {
                prescan_node(body, names);
                if let Some(alt) = alt {
                    prescan_node(alt, names);
                }
            }
            Data::For { body, .. } | Data::While { body, .. } | Data::Do { body, .. } | Data::Labeled { body, .. } | Data::With { body, .. } => {
                prescan_node(body, names);
            }
            Data::ForIn { body, .. } | Data::ForOf { body, .. } => prescan_node(body, names),
            Data::Switch { body, .. } => {
                for arm in body {
                    prescan_node(arm, names);
                }
            }
            Data::Case { body, .. } | Data::Default { body } => prescan(body, names),
            Data::Try { body, catch, finally } => {
                prescan_node(body, names);
                if let Some(catch) = catch {
                    prescan_node(catch, names);
                }
                if let Some(finally) = finally {
                    prescan_node(finally, names);
                }
            }
            Data::Finally { body } => prescan_node(body, names),
            _ => {}
        }
    }
}

fn prescan_node(n: &N, names: &mut HashSet<String>) {
    match &n.data {
        Data::Block { body } | Data::StaticBlock { body } => prescan(body, names),
        other => {
            // Statements that wrap a list were handled by the caller when it
            // matched them. A node that is itself a statement list member is
            // scanned via `prescan`.
            let _ = other;
        }
    }
}

fn direct_lets(stmts: &[N]) -> HashSet<String> {
    let mut names = HashSet::new();
    for stmt in stmts {
        if let Data::Defs { kind, defs, .. } = &stmt.data {
            if matches!(kind, DefKind::Let | DefKind::Const) {
                for def in defs {
                    if let Data::VarDef { name, .. } = &def.data {
                        if let Some(sym) = sym_name(name) {
                            names.insert(sym);
                        }
                    }
                }
            }
        }
    }
    names
}

fn walk_data(data: &Data, ctx: &mut Count) {
    match data {
        Data::Simple { body } | Data::Throw { value: body } | Data::Spread { expr: body } | Data::Unary { expr: body, .. } | Data::Await { expr: body } | Data::Return { value: Some(body) } | Data::Chain { expr: body } | Data::Dot { expr: body, .. } => {
            walk(body, false, ctx);
        }
        Data::Return { value: None } | Data::Empty | Data::Debugger | Data::This | Data::Super | Data::NewTarget | Data::Null | Data::True | Data::False | Data::Infinity | Data::Number { .. } | Data::BigInt { .. } | Data::String { .. } | Data::RegExp { .. } | Data::Hole | Data::Directive { .. } | Data::Symbol { .. } | Data::ImportMeta => {}
        Data::Binary { left, right, .. } | Data::DefaultAssign { left, right } | Data::PrivateIn { key: left, value: right } => {
            walk(left, false, ctx);
            walk(right, false, ctx);
        }
        Data::Sub { expr, prop, .. } => {
            walk(expr, false, ctx);
            walk(prop, false, ctx);
        }
        Data::Cond { cond, cons, alt } => {
            walk(cond, false, ctx);
            walk(cons, false, ctx);
            walk(alt, false, ctx);
        }
        Data::Array { elements } => {
            for el in elements {
                walk(el, false, ctx);
            }
        }
        Data::Object { props } => {
            for prop in props {
                walk(prop, false, ctx);
            }
        }
        Data::Prop { key, value, .. } => {
            if let Key::Computed(expr) = key {
                walk(expr, false, ctx);
            }
            walk(value, false, ctx);
        }
        Data::Field { key, value, .. } => {
            if let Key::Computed(expr) = key {
                walk(expr, false, ctx);
            }
            if let Some(value) = value {
                walk(value, false, ctx);
            }
        }
        Data::Template { segments } => {
            for seg in segments {
                if let Seg::Expr(expr) = seg {
                    walk(expr, false, ctx);
                }
            }
        }
        Data::TaggedTemplate { tag, template } => {
            walk(tag, false, ctx);
            walk(template, false, ctx);
        }
        Data::If { cond, body, alt } => {
            walk(cond, false, ctx);
            walk(body, false, ctx);
            if let Some(alt) = alt {
                walk(alt, false, ctx);
            }
        }
        Data::For { init, cond, step, body } => {
            if let Some(init) = init {
                walk(init, false, ctx);
            }
            if let Some(cond) = cond {
                walk(cond, false, ctx);
            }
            if let Some(step) = step {
                walk(step, false, ctx);
            }
            walk(body, false, ctx);
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            walk(init, false, ctx);
            walk(object, false, ctx);
            walk(body, false, ctx);
        }
        Data::While { cond, body } | Data::Do { body, cond } => {
            walk(cond, false, ctx);
            walk(body, false, ctx);
        }
        Data::Switch { expr, body } => {
            walk(expr, false, ctx);
            for arm in body {
                walk(arm, false, ctx);
            }
        }
        Data::Case { expr, body } => {
            walk(expr, false, ctx);
            for stmt in body {
                walk(stmt, false, ctx);
            }
        }
        Data::Default { body } => {
            for stmt in body {
                walk(stmt, false, ctx);
            }
        }
        Data::Try { body, catch, finally } => {
            walk(body, false, ctx);
            if let Some(catch) = catch {
                walk(catch, false, ctx);
            }
            if let Some(finally) = finally {
                walk(finally, false, ctx);
            }
        }
        Data::Catch { arg, body } => {
            let mut frame = HashSet::new();
            if let Some(arg) = arg {
                if let Some(sym) = sym_name(arg) {
                    frame.insert(sym);
                }
            }
            ctx.stack.push(frame);
            walk(body, false, ctx);
            ctx.stack.pop();
        }
        Data::Finally { body } => walk(body, false, ctx),
        Data::Labeled { body, .. } => walk(body, false, ctx),
        Data::Yield { expr, .. } => {
            if let Some(expr) = expr {
                walk(expr, false, ctx);
            }
        }
        Data::VarDef { name, value } => {
            walk(name, false, ctx);
            if let Some(value) = value {
                walk(value, false, ctx);
            }
        }
        Data::Class { name, extends, props, .. } => {
            if let Some(name) = name {
                walk(name, false, ctx);
            }
            if let Some(extends) = extends {
                walk(extends, false, ctx);
            }
            for prop in props {
                walk(prop, false, ctx);
            }
        }
        Data::DynImport { args, .. } => {
            for arg in args {
                walk(arg, false, ctx);
            }
        }
        Data::Toplevel { body } => {
            for stmt in body {
                walk(stmt, false, ctx);
            }
        }
        Data::Func { .. } | Data::Block { .. } | Data::StaticBlock { .. } | Data::Defs { .. } | Data::Assign { .. } | Data::Seq { .. } | Data::Simple { .. } | Data::Call { .. } | Data::With { .. } => {}
        Data::Break { label } | Data::Continue { label } => {
            if let Some(label) = label {
                walk(label, false, ctx);
            }
        }
        Data::Import { .. } | Data::Export { .. } | Data::NameMap { .. } | Data::Destructuring { .. } => {}
    }
}

fn contains_poison(stmts: &[N]) -> bool {
    // `with` anywhere in this function, not inside a nested function, bails.
    fn scan(n: &N) -> bool {
        match &n.data {
            Data::With { .. } => true,
            Data::Func { .. } => false,
            other => scan_data(other),
        }
    }
    fn scan_data(data: &Data) -> bool {
        match data {
            Data::Block { body } | Data::StaticBlock { body } | Data::Toplevel { body } | Data::Default { body } => body.iter().any(scan),
            Data::Case { expr, body } => scan(expr) || body.iter().any(scan),
            Data::If { cond, body, alt } => scan(cond) || scan(body) || alt.as_ref().is_some_and(|a| scan(a)),
            Data::Simple { body } | Data::Throw { value: body } | Data::Unary { expr: body, .. } | Data::Return { value: Some(body) } => scan(body),
            Data::Binary { left, right, .. } | Data::Assign { left, right, .. } => scan(left) || scan(right),
            Data::Call { expr, args, .. } => scan(expr) || args.iter().any(scan),
            Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().any(scan),
            _ => false,
        }
    }
    stmts.iter().any(scan)
}

fn rebuild_stmt(n: &N, subs: &HashMap<String, N>, drop_decls: &HashSet<String>, drop_assigns: &HashSet<String>, unused: bool) -> Option<N> {
    if is_dropped_assign(n) && drop_assigns.iter().any(|name| assign_of(n, name)) {
        return None;
    }
    if let Data::Simple { body } = &n.data {
        if drop_assigns.iter().any(|name| assign_of(body, name)) {
            return None;
        }
    }
    if let Data::Defs { kind, defs, await_ } = &n.data {
        let defs: Vec<N> = defs
            .iter()
            .filter(|def| match &def.data {
                Data::VarDef { name, .. } => sym_name(name).map(|s| !drop_decls.contains(&s)).unwrap_or(true),
                _ => true,
            })
            .map(|def| rebuild(def, subs, drop_decls, drop_assigns, unused))
            .collect();
        if defs.is_empty() {
            return None;
        }
        return Some(node(n, Data::Defs { kind: *kind, defs, await_: *await_ }));
    }
    Some(rebuild(n, subs, drop_decls, drop_assigns, unused))
}

fn assign_of(n: &N, name: &str) -> bool {
    matches!(&n.data, Data::Assign { op, left, logical: false, .. } if op == "=" && sym_name(left).as_deref() == Some(name))
}

fn is_dropped_assign(n: &N) -> bool {
    matches!(n.data, Data::Assign { .. })
}

fn map_children(n: &N, subs: &HashMap<String, N>, drop_decls: &HashSet<String>, drop_assigns: &HashSet<String>, unused: bool) -> N {
    let go = |child: &N| rebuild(child, subs, drop_decls, drop_assigns, unused);
    let seq = |exprs: &[N]| -> Vec<N> {
        let last = exprs.len().saturating_sub(1);
        let mut out = Vec::new();
        for (i, expr) in exprs.iter().enumerate() {
            if i != last && drop_assigns.iter().any(|name| assign_of(expr, name)) {
                continue;
            }
            out.push(go(expr));
        }
        out
    };
    let data = match &n.data {
        Data::Toplevel { body } => {
            let body = body.iter().filter_map(|s| rebuild_stmt(s, subs, drop_decls, drop_assigns, unused)).collect();
            Data::Toplevel { body }
        }
        Data::Simple { body } => Data::Simple { body: go(body) },
        Data::Block { body } => Data::Block {
            body: body.iter().filter_map(|s| rebuild_stmt(s, subs, drop_decls, drop_assigns, unused)).collect(),
        },
        Data::StaticBlock { body } => Data::StaticBlock {
            body: body.iter().filter_map(|s| rebuild_stmt(s, subs, drop_decls, drop_assigns, unused)).collect(),
        },
        Data::Return { value } => Data::Return { value: value.as_ref().map(|v| go(v)) },
        Data::Throw { value } => Data::Throw { value: go(value) },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: go(expr), prefix: *prefix },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: go(left), right: go(right) },
        Data::Assign { op, left, right, logical } => Data::Assign {
            op: op.clone(),
            left: if sym_name(left).is_some() { Rc::clone(left) } else { go(left) },
            right: go(right),
            logical: *logical,
        },
        Data::Seq { exprs } => {
            let exprs = seq(exprs);
            if exprs.len() == 1 {
                return exprs.into_iter().next().unwrap();
            }
            Data::Seq { exprs }
        }
        Data::Call { expr, args, optional, is_new } => Data::Call {
            expr: go(expr),
            args: args.iter().map(go).collect(),
            optional: *optional,
            is_new: *is_new,
        },
        Data::Dot { expr, prop, optional, quote, private } => Data::Dot {
            expr: go(expr),
            prop: prop.clone(),
            optional: *optional,
            quote: *quote,
            private: *private,
        },
        Data::Sub { expr, prop, optional } => Data::Sub { expr: go(expr), prop: go(prop), optional: *optional },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: go(cond), cons: go(cons), alt: go(alt) },
        Data::Array { elements } => Data::Array { elements: elements.iter().map(go).collect() },
        Data::Object { props } => Data::Object { props: props.iter().map(go).collect() },
        Data::Prop { method, key, value, static_, private, generator, async_ } => Data::Prop {
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
        Data::If { cond, body, alt } => Data::If {
            cond: go(cond),
            body: go(body),
            alt: alt.as_ref().map(|a| go(a)),
        },
        Data::VarDef { name, value } => Data::VarDef { name: Rc::clone(name), value: value.as_ref().map(|v| go(v)) },
        Data::For { init, cond, step, body } => Data::For {
            init: init.as_ref().map(|v| go(v)),
            cond: cond.as_ref().map(|v| go(v)),
            step: step.as_ref().map(|v| go(v)),
            body: go(body),
        },
        Data::While { cond, body } => Data::While { cond: go(cond), body: go(body) },
        Data::Do { body, cond } => Data::Do { body: go(body), cond: go(cond) },
        Data::Switch { expr, body } => Data::Switch { expr: go(expr), body: body.iter().map(go).collect() },
        Data::Case { expr, body } => Data::Case {
            expr: go(expr),
            body: body.iter().filter_map(|s| rebuild_stmt(s, subs, drop_decls, drop_assigns, unused)).collect(),
        },
        Data::Default { body } => Data::Default {
            body: body.iter().filter_map(|s| rebuild_stmt(s, subs, drop_decls, drop_assigns, unused)).collect(),
        },
        Data::Try { body, catch, finally } => Data::Try {
            body: go(body),
            catch: catch.as_ref().map(|v| go(v)),
            finally: finally.as_ref().map(|v| go(v)),
        },
        Data::Catch { arg, body } => Data::Catch { arg: arg.clone(), body: go(body) },
        Data::Finally { body } => Data::Finally { body: go(body) },
        Data::Labeled { label, body } => Data::Labeled { label: Rc::clone(label), body: go(body) },
        Data::ForIn { init, object, body } => Data::ForIn { init: go(init), object: go(object), body: go(body) },
        Data::ForOf { init, object, body, await_ } => Data::ForOf { init: go(init), object: go(object), body: go(body), await_: *await_ },
        Data::Yield { expr, star } => Data::Yield { expr: expr.as_ref().map(|v| go(v)), star: *star },
        Data::Spread { expr } => Data::Spread { expr: go(expr) },
        Data::Await { expr } => Data::Await { expr: go(expr) },
        Data::Chain { expr } => Data::Chain { expr: go(expr) },
        Data::Template { segments } => Data::Template {
            segments: segments
                .iter()
                .map(|seg| match seg {
                    Seg::Expr(expr) => Seg::Expr(go(expr)),
                    other => other.clone(),
                })
                .collect(),
        },
        Data::TaggedTemplate { tag, template } => Data::TaggedTemplate { tag: go(tag), template: go(template) },
        Data::Class { stmt, name, extends, props } => Data::Class {
            stmt: *stmt,
            name: name.clone(),
            extends: extends.as_ref().map(|v| go(v)),
            props: props.iter().map(go).collect(),
        },
        Data::Field { key, value, static_, private } => Data::Field {
            key: match key {
                Key::Computed(expr) => Key::Computed(go(expr)),
                other => other.clone(),
            },
            value: value.as_ref().map(|v| go(v)),
            static_: *static_,
            private: *private,
        },
        Data::DefaultAssign { left, right } => Data::DefaultAssign { left: Rc::clone(left), right: go(right) },
        Data::PrivateIn { key, value } => Data::PrivateIn { key: go(key), value: go(value) },
        Data::DynImport { args, phase } => Data::DynImport { args: args.iter().map(go).collect(), phase: phase.clone() },
        Data::Break { label } => Data::Break { label: label.clone() },
        Data::Continue { label } => Data::Continue { label: label.clone() },
        _ => return Rc::clone(n),
    };
    node(n, data)
}

fn ref_name(n: &N) -> Option<&str> {
    match &n.data {
        Data::Symbol { name, kind: SymKind::Ref, .. } => Some(name),
        _ => None,
    }
}

fn sym_name(n: &N) -> Option<String> {
    match &n.data {
        Data::Symbol { name, .. } => Some(name.clone()),
        _ => None,
    }
}

fn names_of(args: &[N]) -> HashSet<String> {
    args.iter().filter_map(|arg| sym_name(arg)).collect()
}

fn node(orig: &N, data: Data) -> N {
    Rc::new(Node { start: orig.start.clone(), end: orig.end.clone(), data })
}
