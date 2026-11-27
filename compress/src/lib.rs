#![forbid(unsafe_code)]

//! Terser 5.51.4 compressor. Passes land one option at a time.
//!
//! Unchanged subtrees stay the same `Rc`, so a pass that does not fire
//! prints exactly like the input tree.

mod eval;

use ast::{Data, Key, N, Node, Seg};
use serde_json::{Map, Value};
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

/// Marks the crate as linked into the minify pipeline.
pub fn touch() {
    ast::touch();
    scope::touch();
}

#[derive(Clone, Debug)]
struct Opts {
    drop_debugger: bool,
    directives: bool,
    evaluate: bool,
    side_effects: bool,
    booleans: bool,
    conditionals: bool,
    dead_code: bool,
    ie8: bool,
    sequences_limit: i32,
    join_vars: bool,
    negate_iife: bool,
    properties: bool,
    loops: bool,
    computed_props: bool,
}

impl Opts {
    fn defaults() -> Self {
        Self {
            drop_debugger: true,
            directives: true,
            evaluate: true,
            side_effects: true,
            booleans: true,
            conditionals: true,
            dead_code: true,
            ie8: false,
            sequences_limit: 800,
            join_vars: true,
            negate_iife: true,
            properties: true,
            loops: true,
            computed_props: true,
        }
    }

    fn all_off() -> Self {
        Self {
            drop_debugger: false,
            directives: false,
            evaluate: false,
            side_effects: false,
            booleans: false,
            conditionals: false,
            dead_code: false,
            ie8: false,
            sequences_limit: 0,
            join_vars: false,
            negate_iife: false,
            properties: false,
            loops: false,
            computed_props: false,
        }
    }

    fn from_compress(value: &Value) -> Self {
        let Some(obj) = value.as_object() else {
            return Self::defaults();
        };
        let off = obj.get("defaults").and_then(Value::as_bool) == Some(false);
        let mut opts = if off { Self::all_off() } else { Self::defaults() };
        if let Some(v) = bool_key(obj, "drop_debugger") {
            opts.drop_debugger = v;
        }
        if let Some(v) = bool_key(obj, "directives") {
            opts.directives = v;
        }
        if let Some(v) = bool_key(obj, "evaluate") {
            opts.evaluate = v;
        }
        if let Some(v) = bool_key(obj, "side_effects") {
            opts.side_effects = v;
        }
        if let Some(v) = bool_key(obj, "booleans") {
            opts.booleans = v;
        }
        if let Some(v) = bool_key(obj, "conditionals") {
            opts.conditionals = v;
        }
        if let Some(v) = bool_key(obj, "dead_code") {
            opts.dead_code = v;
        }
        if let Some(v) = bool_key(obj, "ie8") {
            opts.ie8 = v;
        }
        if let Some(v) = obj.get("sequences") {
            opts.sequences_limit = sequences_limit(v);
        }
        if let Some(v) = bool_key(obj, "join_vars") {
            opts.join_vars = v;
        }
        if let Some(v) = bool_key(obj, "negate_iife") {
            opts.negate_iife = v;
        }
        if let Some(v) = bool_key(obj, "properties") {
            opts.properties = v;
        }
        if let Some(v) = bool_key(obj, "loops") {
            opts.loops = v;
        }
        if let Some(v) = bool_key(obj, "computed_props") {
            opts.computed_props = v;
        }
        opts
    }

    fn any(&self) -> bool {
        self.drop_debugger
            || self.directives
            || self.evaluate
            || self.side_effects
            || self.booleans
            || self.conditionals
            || self.dead_code
            || self.sequences_limit > 0
            || self.join_vars
            || self.negate_iife
            || self.properties
            || self.loops
            || self.computed_props
    }
}

fn sequences_limit(value: &Value) -> i32 {
    match value {
        Value::Bool(true) => 800,
        Value::Bool(false) => 0,
        Value::Number(n) => {
            let n = n.as_i64().unwrap_or(0);
            if n == 1 { 800 } else { n as i32 }
        }
        _ => 0,
    }
}

fn bool_key(obj: &Map<String, Value>, key: &str) -> Option<bool> {
    obj.get(key).and_then(Value::as_bool)
}

/// Run the passes that are switched on in `minify_opts.compress`.
///
/// `None` for `compress` means terser's default, which turns compress on.
/// `false` leaves the tree alone.
pub fn compress(root: &N, minify_opts: &Value) -> N {
    let opts = match minify_opts.get("compress") {
        Some(Value::Bool(false)) => return Rc::clone(root),
        Some(value) => Opts::from_compress(value),
        None => Opts::defaults(),
    };
    if !opts.any() {
        return Rc::clone(root);
    }
    let mut cx = Cx {
        opts,
        frames: vec![HashMap::new()],
        in_bool: false,
        eq_cmp: false,
        keep_block: false,
        locals: vec![HashSet::new()],
    };
    transform(root, &mut cx)
}

struct Cx {
    opts: Opts,
    frames: Vec<HashMap<String, usize>>,
    in_bool: bool,
    eq_cmp: bool,
    keep_block: bool,
    locals: Vec<HashSet<String>>,
}

impl Cx {
    fn shadowed(&self, name: &str) -> bool {
        self.locals.iter().any(|set| set.contains(name))
    }

    fn enter(&mut self, n: &N) -> Enter {
        let ptr = Rc::as_ptr(n) as usize;
        match &n.data {
            Data::Func { args, body, .. } => {
                self.frames.push(HashMap::new());
                let mut names = HashSet::new();
                for arg in args {
                    collect_binding(arg, &mut names);
                }
                scan_hoisted(body, &mut names);
                self.locals.push(names);
                Enter::Scope
            }
            Data::StaticBlock { body } => {
                self.frames.push(HashMap::new());
                let mut names = HashSet::new();
                scan_lexical(body, &mut names);
                self.locals.push(names);
                Enter::Scope
            }
            Data::Block { body } => {
                let mut names = HashSet::new();
                scan_lexical(body, &mut names);
                self.locals.push(names);
                Enter::Locals
            }
            Data::Catch { arg, .. } => {
                let mut names = HashSet::new();
                if let Some(arg) = arg {
                    collect_binding(arg, &mut names);
                }
                self.locals.push(names);
                Enter::Locals
            }
            Data::Class { .. } => {
                let already = self.lookup("use strict").is_some();
                self.frames.push(HashMap::new());
                self.locals.push(HashSet::new());
                if !already {
                    self.frames.last_mut().unwrap().insert("use strict".into(), ptr);
                }
                Enter::Scope
            }
            Data::Directive { value, .. } => {
                if self.lookup(value).is_none() {
                    self.frames.last_mut().unwrap().insert(value.clone(), ptr);
                }
                Enter::None
            }
            _ => Enter::None,
        }
    }

    fn leave(&mut self, entered: Enter) {
        match entered {
            Enter::Scope => {
                self.frames.pop();
                self.locals.pop();
            }
            Enter::Locals => {
                self.locals.pop();
            }
            Enter::None => {}
        }
    }

    fn lookup(&self, name: &str) -> Option<usize> {
        for frame in self.frames.iter().rev() {
            if let Some(ptr) = frame.get(name) {
                return Some(*ptr);
            }
        }
        None
    }

    fn in_asm(&self) -> bool {
        self.lookup("use asm").is_some()
    }

    fn drop_directive(&self, value: &str, ptr: usize) -> bool {
        let known = value == "use strict" || value == "use asm";
        !known || self.lookup(value) != Some(ptr)
    }
}

enum Enter {
    None,
    Scope,
    Locals,
}

fn collect_binding(n: &N, names: &mut HashSet<String>) {
    match &n.data {
        Data::Symbol { name, .. } => {
            names.insert(name.clone());
        }
        Data::DefaultAssign { left, .. } | Data::Assign { left, .. } => collect_binding(left, names),
        Data::Destructuring { names: inner, .. } => {
            for n in inner {
                collect_binding(n, names);
            }
        }
        Data::Spread { expr } => collect_binding(expr, names),
        Data::Prop { value, .. } => collect_binding(value, names),
        Data::VarDef { name, .. } => collect_binding(name, names),
        _ => {}
    }
}

fn scan_hoisted(body: &[N], names: &mut HashSet<String>) {
    for n in body {
        scan_hoisted_node(n, names);
    }
}

fn scan_hoisted_node(n: &N, names: &mut HashSet<String>) {
    match &n.data {
        Data::Defs { kind: ast::DefKind::Var, defs, .. } => {
            for d in defs {
                collect_binding(d, names);
            }
        }
        Data::Func { kind: ast::FuncKind::Decl, name, .. } => {
            if let Some(name) = name {
                collect_binding(name, names);
            }
        }
        Data::Func { .. } | Data::Class { .. } => {}
        Data::Block { body } | Data::StaticBlock { body } | Data::Default { body } => scan_hoisted(body, names),
        Data::If { body, alt, .. } => {
            scan_hoisted_node(body, names);
            if let Some(alt) = alt {
                scan_hoisted_node(alt, names);
            }
        }
        Data::Labeled { body, .. } | Data::Do { body, .. } | Data::While { body, .. } | Data::With { body, .. } | Data::Finally { body } => {
            scan_hoisted_node(body, names);
        }
        Data::For { init, body, .. } => {
            if let Some(init) = init {
                scan_hoisted_node(init, names);
            }
            scan_hoisted_node(body, names);
        }
        Data::ForIn { init, body, .. } | Data::ForOf { init, body, .. } => {
            scan_hoisted_node(init, names);
            scan_hoisted_node(body, names);
        }
        Data::Switch { body, .. } => scan_hoisted(body, names),
        Data::Case { body, .. } => scan_hoisted(body, names),
        Data::Try { body, catch, finally } => {
            scan_hoisted_node(body, names);
            if let Some(c) = catch {
                scan_hoisted_node(c, names);
            }
            if let Some(f) = finally {
                scan_hoisted_node(f, names);
            }
        }
        Data::Catch { body, .. } => scan_hoisted_node(body, names),
        _ => {}
    }
}

fn scan_lexical(body: &[N], names: &mut HashSet<String>) {
    for n in body {
        if let Data::Defs { kind, defs, .. } = &n.data {
            if matches!(kind, ast::DefKind::Let | ast::DefKind::Const | ast::DefKind::Using) {
                for d in defs {
                    collect_binding(d, names);
                }
            }
        }
        if let Data::Class { stmt: true, name: Some(name), .. } = &n.data {
            collect_binding(name, names);
        }
    }
}

fn transform(n: &N, cx: &mut Cx) -> N {
    let entered = cx.enter(n);
    let ptr = Rc::as_ptr(n) as usize;
    let mapped = map_children(n, cx);
    let out = if let Some(rep) = optimize(&mapped, ptr, cx) {
        rep
    } else {
        eval::fold(&mapped, cx)
    };
    cx.leave(entered);
    out
}

fn transform_block(n: &N, cx: &mut Cx) -> N {
    let old = cx.keep_block;
    cx.keep_block = true;
    let out = transform(n, cx);
    cx.keep_block = old;
    out
}

fn transform_bool(n: &N, cx: &mut Cx) -> N {
    let old = cx.in_bool;
    cx.in_bool = true;
    let out = transform(n, cx);
    cx.in_bool = old;
    out
}

fn optimize(n: &N, ptr: usize, cx: &Cx) -> Option<N> {
    if cx.in_asm() {
        return None;
    }
    match &n.data {
        Data::Debugger if cx.opts.drop_debugger => Some(empty(n)),
        Data::Directive { value, .. } if cx.opts.directives && cx.drop_directive(value, ptr) => Some(empty(n)),
        _ => None,
    }
}

fn empty(n: &N) -> N {
    Rc::new(Node { start: n.start.clone(), end: n.end.clone(), data: Data::Empty })
}

fn finish(orig: &N, data: Data, changed: bool) -> N {
    if !changed {
        Rc::clone(orig)
    } else {
        Rc::new(Node { start: orig.start.clone(), end: orig.end.clone(), data })
    }
}

fn map_list(list: &[N], cx: &mut Cx) -> (Vec<N>, bool) {
    let mut changed = false;
    let mut out = Vec::with_capacity(list.len());
    for n in list {
        let m = transform(n, cx);
        if !Rc::ptr_eq(&m, n) {
            changed = true;
        }
        out.push(m);
    }
    (out, changed)
}

fn map_opt_bool(n: &Option<N>, cx: &mut Cx) -> (Option<N>, bool) {
    match n {
        None => (None, false),
        Some(n) => {
            let m = transform_bool(n, cx);
            let changed = !Rc::ptr_eq(&m, n);
            (Some(m), changed)
        }
    }
}

fn map_opt(n: &Option<N>, cx: &mut Cx) -> (Option<N>, bool) {
    match n {
        None => (None, false),
        Some(n) => {
            let m = transform(n, cx);
            let changed = !Rc::ptr_eq(&m, n);
            (Some(m), changed)
        }
    }
}

fn map_key(key: &Key, cx: &mut Cx) -> (Key, bool) {
    match key {
        Key::Computed(e) => {
            let m = transform(e, cx);
            let changed = !Rc::ptr_eq(&m, e);
            (Key::Computed(m), changed)
        }
        other => (other.clone(), false),
    }
}

fn map_segs(segs: &[Seg], cx: &mut Cx) -> (Vec<Seg>, bool) {
    let mut changed = false;
    let mut out = Vec::with_capacity(segs.len());
    for seg in segs {
        match seg {
            Seg::Expr(e) => {
                let m = transform(e, cx);
                if !Rc::ptr_eq(&m, e) {
                    changed = true;
                }
                out.push(Seg::Expr(m));
            }
            other => out.push(other.clone()),
        }
    }
    (out, changed)
}

fn tighten(stmts: Vec<N>, cx: &Cx) -> Vec<N> {
    let stmts = if cx.opts.join_vars { join_vars(stmts) } else { stmts };
    let stmts = if cx.opts.sequences_limit > 0 {
        sequence_into_next(sequence_statements(stmts, cx.opts.sequences_limit))
    } else {
        stmts
    };
    if cx.opts.join_vars {
        var_into_for(stmts)
    } else {
        stmts
    }
}

fn var_into_for(stmts: Vec<N>) -> Vec<N> {
    let mut out = Vec::new();
    let mut prev: Option<N> = None;
    for stat in stmts {
        if let Some(prev_stmt) = prev.take() {
            if let Data::For { init: None, cond, step, body } = &stat.data {
                out.push(Rc::new(Node {
                    start: stat.start.clone(),
                    end: stat.end.clone(),
                    data: Data::For {
                        init: Some(prev_stmt),
                        cond: cond.clone(),
                        step: step.clone(),
                        body: Rc::clone(body),
                    },
                }));
                continue;
            }
            out.push(prev_stmt);
        }
        if matches!(stat.data, Data::Defs { kind: ast::DefKind::Var, .. }) {
            prev = Some(stat);
        } else {
            out.push(stat);
        }
    }
    if let Some(prev) = prev {
        out.push(prev);
    }
    out
}

fn join_vars(stmts: Vec<N>) -> Vec<N> {
    let mut out: Vec<N> = Vec::new();
    for stat in stmts {
        let merged = if let Data::Defs { kind, defs, await_ } = &stat.data {
            if let Some(prev) = out.last_mut() {
                let same = matches!(&prev.data, Data::Defs { kind: pk, await_: pa, .. } if pk == kind && pa == await_);
                if same {
                    let prev = Rc::make_mut(prev);
                    if let Data::Defs { defs: prev_defs, .. } = &mut prev.data {
                        prev_defs.extend(defs.iter().cloned());
                    }
                    true
                } else {
                    false
                }
            } else {
                false
            }
        } else {
            false
        };
        if !merged {
            out.push(stat);
        }
    }
    out
}

fn sequence_statements(stmts: Vec<N>, limit: i32) -> Vec<N> {
    let mut out = Vec::new();
    let mut seq: Vec<N> = Vec::new();
    let flush = |out: &mut Vec<N>, seq: &mut Vec<N>| {
        if seq.is_empty() {
            return;
        }
        let exprs = std::mem::take(seq);
        let body = if exprs.len() == 1 {
            exprs.into_iter().next().unwrap()
        } else {
            let span = exprs[0].clone();
            Rc::new(Node {
                start: span.start.clone(),
                end: span.end.clone(),
                data: Data::Seq { exprs },
            })
        };
        out.push(Rc::new(Node {
            start: body.start.clone(),
            end: body.end.clone(),
            data: Data::Simple { body },
        }));
    };
    for stat in stmts {
        match &stat.data {
            Data::Empty => {}
            Data::Simple { body } => {
                if seq.len() as i32 >= limit {
                    flush(&mut out, &mut seq);
                }
                if !seq.is_empty() && eval::is_pure(body) {
                    continue;
                }
                if let Data::Seq { exprs } = &body.data {
                    seq.extend(exprs.iter().cloned());
                } else {
                    seq.push(Rc::clone(body));
                }
            }
            Data::Defs { defs, .. } if defs.iter().all(|d| matches!(d.data, Data::VarDef { value: None, .. })) => {
                out.push(stat);
            }
            Data::Func { kind: ast::FuncKind::Decl, .. } => out.push(stat),
            _ => {
                flush(&mut out, &mut seq);
                out.push(stat);
            }
        }
    }
    flush(&mut out, &mut seq);
    out
}

fn sequence_into_next(stmts: Vec<N>) -> Vec<N> {
    let mut out = Vec::new();
    let mut prev: Option<N> = None;
    for stat in stmts {
        if let Some(prev_stmt) = prev.take() {
            let Data::Simple { body: left } = &prev_stmt.data else {
                out.push(prev_stmt);
                out.push(stat);
                continue;
            };
            let left = Rc::clone(left);
            if let Data::If { cond, body, alt } = &stat.data {
                let cond = comma(left, Rc::clone(cond));
                out.push(Rc::new(Node {
                    start: stat.start.clone(),
                    end: stat.end.clone(),
                    data: Data::If { cond, body: Rc::clone(body), alt: alt.clone() },
                }));
                continue;
            }
            if let Data::Return { value } = &stat.data {
                let right = value.clone().unwrap_or_else(|| eval_void(&stat));
                out.push(Rc::new(Node {
                    start: stat.start.clone(),
                    end: stat.end.clone(),
                    data: Data::Return { value: Some(comma(left, right)) },
                }));
                continue;
            }
            if let Data::Switch { expr, body } = &stat.data {
                out.push(Rc::new(Node {
                    start: stat.start.clone(),
                    end: stat.end.clone(),
                    data: Data::Switch { expr: comma(left, Rc::clone(expr)), body: body.clone() },
                }));
                continue;
            }
            if let Data::For { init, cond, step, body } = &stat.data {
                if !init.as_ref().is_some_and(|i| matches!(i.data, Data::Defs { kind: ast::DefKind::Let | ast::DefKind::Const | ast::DefKind::Using, .. })) {
                    let init = Some(match init {
                        Some(init) => comma(left, Rc::clone(init)),
                        None => left,
                    });
                    out.push(Rc::new(Node {
                        start: stat.start.clone(),
                        end: stat.end.clone(),
                        data: Data::For { init, cond: cond.clone(), step: step.clone(), body: Rc::clone(body) },
                    }));
                    continue;
                }
            }
            out.push(prev_stmt);
        }
        if matches!(stat.data, Data::Simple { .. }) {
            prev = Some(stat);
        } else {
            out.push(stat);
        }
    }
    if let Some(prev) = prev {
        out.push(prev);
    }
    out
}

fn comma(left: N, right: N) -> N {
    let mut exprs = match &left.data {
        Data::Seq { exprs } => exprs.clone(),
        _ => vec![Rc::clone(&left)],
    };
    match &right.data {
        Data::Seq { exprs: more } => exprs.extend(more.iter().cloned()),
        _ => exprs.push(right),
    }
    Rc::new(Node {
        start: left.start.clone(),
        end: left.end.clone(),
        data: Data::Seq { exprs },
    })
}

fn can_evict(n: &N) -> bool {
    !matches!(
        n.data,
        Data::Class { stmt: true, .. }
            | Data::Func { kind: ast::FuncKind::Decl, .. }
            | Data::Defs { kind: ast::DefKind::Let | ast::DefKind::Const | ast::DefKind::Using, .. }
            | Data::Import { .. }
            | Data::Export { .. }
    )
}

fn eval_void(span: &N) -> N {
    Rc::new(Node {
        start: span.start.clone(),
        end: span.end.clone(),
        data: Data::Unary {
            op: "void".into(),
            expr: Rc::new(Node {
                start: span.start.clone(),
                end: span.end.clone(),
                data: Data::Number { value: 0.0, raw: String::new() },
            }),
            prefix: true,
        },
    })
}

fn map_children(n: &N, cx: &mut Cx) -> N {
    match &n.data {
        Data::Toplevel { body } => {
            let (body, c) = map_list(body, cx);
            let body = tighten(body, cx);
            finish(n, Data::Toplevel { body }, c)
        }
        Data::Simple { body } => {
            let m = transform(body, cx);
            let c = !Rc::ptr_eq(&m, body);
            finish(n, Data::Simple { body: m }, c)
        }
        Data::StaticBlock { body } => {
            let (body, _) = map_list(body, cx);
            let body = tighten(body, cx);
            finish(n, Data::StaticBlock { body }, true)
        }
        Data::Block { body } => {
            let (body, _) = map_list(body, cx);
            let body = tighten(body, cx);
            if !cx.keep_block && body.is_empty() {
                return empty(n);
            }
            if !cx.keep_block && body.len() == 1 && can_evict(&body[0]) {
                return Rc::clone(&body[0]);
            }
            finish(n, Data::Block { body }, true)
        }
        Data::Labeled { label, body } => {
            let label_m = transform(label, cx);
            let body_m = transform(body, cx);
            let c = !Rc::ptr_eq(&label_m, label) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::Labeled { label: label_m, body: body_m }, c)
        }
        Data::Do { body, cond } => {
            let body_m = transform(body, cx);
            let cond_m = transform_bool(cond, cx);
            let c = !Rc::ptr_eq(&body_m, body) || !Rc::ptr_eq(&cond_m, cond);
            finish(n, Data::Do { body: body_m, cond: cond_m }, c)
        }
        Data::While { cond, body } => {
            let cond_m = transform_bool(cond, cx);
            let body_m = transform(body, cx);
            let c = !Rc::ptr_eq(&cond_m, cond) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::While { cond: cond_m, body: body_m }, c)
        }
        Data::For { init, cond, step, body } => {
            let (init, c1) = map_opt(init, cx);
            let (cond, c2) = map_opt_bool(cond, cx);
            let (step, c3) = map_opt(step, cx);
            let body_m = transform(body, cx);
            let c = c1 || c2 || c3 || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::For { init, cond, step, body: body_m }, c)
        }
        Data::ForIn { init, object, body } => {
            let init_m = transform(init, cx);
            let object_m = transform(object, cx);
            let body_m = transform(body, cx);
            let c = !Rc::ptr_eq(&init_m, init) || !Rc::ptr_eq(&object_m, object) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::ForIn { init: init_m, object: object_m, body: body_m }, c)
        }
        Data::ForOf { init, object, body, await_ } => {
            let init_m = transform(init, cx);
            let object_m = transform(object, cx);
            let body_m = transform(body, cx);
            let c = !Rc::ptr_eq(&init_m, init) || !Rc::ptr_eq(&object_m, object) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::ForOf { init: init_m, object: object_m, body: body_m, await_: *await_ }, c)
        }
        Data::With { expr, body } => {
            let expr_m = transform(expr, cx);
            let body_m = transform(body, cx);
            let c = !Rc::ptr_eq(&expr_m, expr) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::With { expr: expr_m, body: body_m }, c)
        }
        Data::If { cond, body, alt } => {
            let cond_m = transform_bool(cond, cx);
            let body_m = transform(body, cx);
            let (alt, c3) = map_opt(alt, cx);
            let c = !Rc::ptr_eq(&cond_m, cond) || !Rc::ptr_eq(&body_m, body) || c3;
            finish(n, Data::If { cond: cond_m, body: body_m, alt }, c)
        }
        Data::Switch { expr, body } => {
            let expr_m = transform(expr, cx);
            let c1 = !Rc::ptr_eq(&expr_m, expr);
            let (body, c2) = map_list(body, cx);
            finish(n, Data::Switch { expr: expr_m, body }, c1 || c2)
        }
        Data::Case { expr, body } => {
            let expr_m = transform(expr, cx);
            let c1 = !Rc::ptr_eq(&expr_m, expr);
            let (body, c2) = map_list(body, cx);
            finish(n, Data::Case { expr: expr_m, body }, c1 || c2)
        }
        Data::Default { body } => {
            let (body, c) = map_list(body, cx);
            finish(n, Data::Default { body }, c)
        }
        Data::Try { body, catch, finally } => {
            let body_m = transform_block(body, cx);
            let (catch, c2) = map_opt(catch, cx);
            let (finally, c3) = map_opt(finally, cx);
            let c = !Rc::ptr_eq(&body_m, body) || c2 || c3;
            finish(n, Data::Try { body: body_m, catch, finally }, c)
        }
        Data::Catch { arg, body } => {
            let (arg, c1) = map_opt(arg, cx);
            let body_m = transform_block(body, cx);
            let c2 = !Rc::ptr_eq(&body_m, body);
            finish(n, Data::Catch { arg, body: body_m }, c1 || c2)
        }
        Data::Finally { body } => {
            let m = transform_block(body, cx);
            let c = !Rc::ptr_eq(&m, body);
            finish(n, Data::Finally { body: m }, c)
        }
        Data::Defs { kind, defs, await_ } => {
            let (defs, c) = map_list(defs, cx);
            finish(n, Data::Defs { kind: *kind, defs, await_: *await_ }, c)
        }
        Data::VarDef { name, value } => {
            let name_m = transform(name, cx);
            let c1 = !Rc::ptr_eq(&name_m, name);
            let (value, c2) = map_opt(value, cx);
            finish(n, Data::VarDef { name: name_m, value }, c1 || c2)
        }
        Data::Func { kind, name, args, body, async_, generator } => {
            let (name, c1) = map_opt(name, cx);
            let (args, c2) = map_list(args, cx);
            let (body, c3) = map_list(body, cx);
            let body = tighten(body, cx);
            finish(n, Data::Func { kind: *kind, name, args, body, async_: *async_, generator: *generator }, c1 || c2 || c3 || true)
        }
        Data::Class { stmt, name, extends, props } => {
            let (name, c1) = map_opt(name, cx);
            let (extends, c2) = map_opt(extends, cx);
            let (props, c3) = map_list(props, cx);
            finish(n, Data::Class { stmt: *stmt, name, extends, props }, c1 || c2 || c3)
        }
        Data::Return { value } => {
            let (value, c) = map_opt(value, cx);
            finish(n, Data::Return { value }, c)
        }
        Data::Throw { value } => {
            let m = transform(value, cx);
            let c = !Rc::ptr_eq(&m, value);
            finish(n, Data::Throw { value: m }, c)
        }
        Data::Break { label } | Data::Continue { label } => {
            let (label_m, c) = map_opt(label, cx);
            let data = match &n.data {
                Data::Continue { .. } => Data::Continue { label: label_m },
                _ => Data::Break { label: label_m },
            };
            finish(n, data, c)
        }
        Data::Import { phase, imported_name, imported_names, module_name, attributes } => {
            let (imported_name, c1) = map_opt(imported_name, cx);
            let (imported_names, c2) = match imported_names {
                Some(list) => {
                    let (list, c) = map_list(list, cx);
                    (Some(list), c)
                }
                None => (None, false),
            };
            let module_m = transform(module_name, cx);
            let (attributes, c4) = map_opt(attributes, cx);
            let c = c1 || c2 || !Rc::ptr_eq(&module_m, module_name) || c4;
            finish(n, Data::Import { phase: phase.clone(), imported_name, imported_names, module_name: module_m, attributes }, c)
        }
        Data::Export { is_default, names, value, definition, module_name, attributes } => {
            let (names, c1) = match names {
                Some(list) => {
                    let (list, c) = map_list(list, cx);
                    (Some(list), c)
                }
                None => (None, false),
            };
            let (value, c2) = map_opt(value, cx);
            let (definition, c3) = map_opt(definition, cx);
            let (module_name, c4) = map_opt(module_name, cx);
            let (attributes, c5) = map_opt(attributes, cx);
            finish(
                n,
                Data::Export { is_default: *is_default, names, value, definition, module_name, attributes },
                c1 || c2 || c3 || c4 || c5,
            )
        }
        Data::NameMap { foreign, name } => {
            let foreign_m = transform(foreign, cx);
            let name_m = transform(name, cx);
            let c = !Rc::ptr_eq(&foreign_m, foreign) || !Rc::ptr_eq(&name_m, name);
            finish(n, Data::NameMap { foreign: foreign_m, name: name_m }, c)
        }
        Data::Array { elements } => {
            let (elements, c) = map_list(elements, cx);
            finish(n, Data::Array { elements }, c)
        }
        Data::Object { props } => {
            let (props, c) = map_list(props, cx);
            finish(n, Data::Object { props }, c)
        }
        Data::Prop { method, key, value, static_, private, generator, async_ } => {
            let (key, c1) = map_key(key, cx);
            let value_m = transform(value, cx);
            let c2 = !Rc::ptr_eq(&value_m, value);
            finish(
                n,
                Data::Prop { method: *method, key, value: value_m, static_: *static_, private: *private, generator: *generator, async_: *async_ },
                c1 || c2,
            )
        }
        Data::Field { key, value, static_, private } => {
            let (key, c1) = map_key(key, cx);
            let (value, c2) = map_opt(value, cx);
            finish(n, Data::Field { key, value, static_: *static_, private: *private }, c1 || c2)
        }
        Data::Spread { expr } => {
            let m = transform(expr, cx);
            let c = !Rc::ptr_eq(&m, expr);
            finish(n, Data::Spread { expr: m }, c)
        }
        Data::Destructuring { array, names } => {
            let (names, c) = map_list(names, cx);
            finish(n, Data::Destructuring { array: *array, names }, c)
        }
        Data::Seq { exprs } => {
            let (exprs, c) = map_list(exprs, cx);
            finish(n, Data::Seq { exprs }, c)
        }
        Data::Dot { expr, prop, optional, quote, private } => {
            let m = transform(expr, cx);
            let c = !Rc::ptr_eq(&m, expr);
            finish(n, Data::Dot { expr: m, prop: prop.clone(), optional: *optional, quote: *quote, private: *private }, c)
        }
        Data::Sub { expr, prop, optional } => {
            let expr_m = transform(expr, cx);
            let prop_m = transform(prop, cx);
            let c = !Rc::ptr_eq(&expr_m, expr) || !Rc::ptr_eq(&prop_m, prop);
            finish(n, Data::Sub { expr: expr_m, prop: prop_m, optional: *optional }, c)
        }
        Data::Chain { expr } => {
            let m = transform(expr, cx);
            let c = !Rc::ptr_eq(&m, expr);
            finish(n, Data::Chain { expr: m }, c)
        }
        Data::Call { expr, args, optional, is_new } => {
            let expr_m = transform(expr, cx);
            let c1 = !Rc::ptr_eq(&expr_m, expr);
            let (args, c2) = map_list(args, cx);
            finish(n, Data::Call { expr: expr_m, args, optional: *optional, is_new: *is_new }, c1 || c2)
        }
        Data::Unary { op, expr, prefix } => {
            let m = if op == "!" { transform_bool(expr, cx) } else { transform(expr, cx) };
            let c = !Rc::ptr_eq(&m, expr);
            finish(n, Data::Unary { op: op.clone(), expr: m, prefix: *prefix }, c)
        }
        Data::Binary { op, left, right } => {
            let old_bool = cx.in_bool;
            let old_eq = cx.eq_cmp;
            if op == "&&" || op == "||" {
                // Boolean context reaches into && and || only when they are already in one.
            } else if op == "==" || op == "!=" {
                cx.in_bool = false;
                cx.eq_cmp = true;
            } else {
                cx.in_bool = false;
                cx.eq_cmp = false;
            }
            let left_m = transform(left, cx);
            let right_m = transform(right, cx);
            cx.in_bool = old_bool;
            cx.eq_cmp = old_eq;
            let c = !Rc::ptr_eq(&left_m, left) || !Rc::ptr_eq(&right_m, right);
            finish(n, Data::Binary { op: op.clone(), left: left_m, right: right_m }, c)
        }
        Data::Assign { op, left, right, logical } => {
            let left_m = transform(left, cx);
            let right_m = transform(right, cx);
            let c = !Rc::ptr_eq(&left_m, left) || !Rc::ptr_eq(&right_m, right);
            finish(n, Data::Assign { op: op.clone(), left: left_m, right: right_m, logical: *logical }, c)
        }
        Data::DefaultAssign { left, right } => {
            let left_m = transform(left, cx);
            let right_m = transform(right, cx);
            let c = !Rc::ptr_eq(&left_m, left) || !Rc::ptr_eq(&right_m, right);
            finish(n, Data::DefaultAssign { left: left_m, right: right_m }, c)
        }
        Data::Cond { cond, cons, alt } => {
            let cond_m = transform_bool(cond, cx);
            let cons_m = transform(cons, cx);
            let alt_m = transform(alt, cx);
            let c = !Rc::ptr_eq(&cond_m, cond) || !Rc::ptr_eq(&cons_m, cons) || !Rc::ptr_eq(&alt_m, alt);
            finish(n, Data::Cond { cond: cond_m, cons: cons_m, alt: alt_m }, c)
        }
        Data::Await { expr } => {
            let m = transform(expr, cx);
            let c = !Rc::ptr_eq(&m, expr);
            finish(n, Data::Await { expr: m }, c)
        }
        Data::Yield { expr, star } => {
            let (expr, c) = map_opt(expr, cx);
            finish(n, Data::Yield { expr, star: *star }, c)
        }
        Data::Template { segments } => {
            let (segments, c) = map_segs(segments, cx);
            finish(n, Data::Template { segments }, c)
        }
        Data::TaggedTemplate { tag, template } => {
            let tag_m = transform(tag, cx);
            let template_m = transform(template, cx);
            let c = !Rc::ptr_eq(&tag_m, tag) || !Rc::ptr_eq(&template_m, template);
            finish(n, Data::TaggedTemplate { tag: tag_m, template: template_m }, c)
        }
        Data::DynImport { args, phase } => {
            let (args, c) = map_list(args, cx);
            finish(n, Data::DynImport { args, phase: phase.clone() }, c)
        }
        Data::PrivateIn { key, value } => {
            let key_m = transform(key, cx);
            let value_m = transform(value, cx);
            let c = !Rc::ptr_eq(&key_m, key) || !Rc::ptr_eq(&value_m, value);
            finish(n, Data::PrivateIn { key: key_m, value: value_m }, c)
        }
        Data::Directive { .. }
        | Data::Empty
        | Data::Debugger
        | Data::Symbol { .. }
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
        | Data::ImportMeta => Rc::clone(n),
    }
}
