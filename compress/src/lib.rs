#![forbid(unsafe_code)]

//! Terser 5.51.4 compressor. Passes land one option at a time.
//!
//! Unchanged subtrees stay the same `Rc`, so a pass that does not fire
//! prints exactly like the input tree.

use ast::{Data, Key, N, Node, Seg};
use serde_json::{Map, Value};
use std::collections::HashMap;
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
}

impl Opts {
    fn defaults() -> Self {
        Self { drop_debugger: true, directives: true }
    }

    fn all_off() -> Self {
        Self { drop_debugger: false, directives: false }
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
        opts
    }

    fn any(&self) -> bool {
        self.drop_debugger || self.directives
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
    let mut cx = Cx { opts, frames: vec![HashMap::new()] };
    transform(root, &mut cx)
}

struct Cx {
    opts: Opts,
    frames: Vec<HashMap<String, usize>>,
}

impl Cx {
    fn enter(&mut self, n: &N) -> bool {
        let ptr = Rc::as_ptr(n) as usize;
        match &n.data {
            Data::Func { .. } | Data::StaticBlock { .. } => {
                self.frames.push(HashMap::new());
                true
            }
            Data::Class { .. } => {
                let already = self.lookup("use strict").is_some();
                self.frames.push(HashMap::new());
                if !already {
                    self.frames.last_mut().unwrap().insert("use strict".into(), ptr);
                }
                true
            }
            Data::Directive { value, .. } => {
                if self.lookup(value).is_none() {
                    self.frames.last_mut().unwrap().insert(value.clone(), ptr);
                }
                false
            }
            _ => false,
        }
    }

    fn leave(&mut self, entered: bool) {
        if entered {
            self.frames.pop();
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

fn transform(n: &N, cx: &mut Cx) -> N {
    let entered = cx.enter(n);
    let ptr = Rc::as_ptr(n) as usize;
    let out = if let Some(rep) = optimize(n, ptr, cx) {
        rep
    } else {
        map_children(n, cx)
    };
    cx.leave(entered);
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

fn map_children(n: &N, cx: &mut Cx) -> N {
    match &n.data {
        Data::Toplevel { body } => {
            let (body, c) = map_list(body, cx);
            finish(n, Data::Toplevel { body }, c)
        }
        Data::Simple { body } => {
            let m = transform(body, cx);
            let c = !Rc::ptr_eq(&m, body);
            finish(n, Data::Simple { body: m }, c)
        }
        Data::Block { body } | Data::StaticBlock { body } => {
            let (body, c) = map_list(body, cx);
            let data = match &n.data {
                Data::StaticBlock { .. } => Data::StaticBlock { body },
                _ => Data::Block { body },
            };
            finish(n, data, c)
        }
        Data::Labeled { label, body } => {
            let label_m = transform(label, cx);
            let body_m = transform(body, cx);
            let c = !Rc::ptr_eq(&label_m, label) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::Labeled { label: label_m, body: body_m }, c)
        }
        Data::Do { body, cond } => {
            let body_m = transform(body, cx);
            let cond_m = transform(cond, cx);
            let c = !Rc::ptr_eq(&body_m, body) || !Rc::ptr_eq(&cond_m, cond);
            finish(n, Data::Do { body: body_m, cond: cond_m }, c)
        }
        Data::While { cond, body } => {
            let cond_m = transform(cond, cx);
            let body_m = transform(body, cx);
            let c = !Rc::ptr_eq(&cond_m, cond) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::While { cond: cond_m, body: body_m }, c)
        }
        Data::For { init, cond, step, body } => {
            let (init, c1) = map_opt(init, cx);
            let (cond, c2) = map_opt(cond, cx);
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
            let cond_m = transform(cond, cx);
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
            let body_m = transform(body, cx);
            let (catch, c2) = map_opt(catch, cx);
            let (finally, c3) = map_opt(finally, cx);
            let c = !Rc::ptr_eq(&body_m, body) || c2 || c3;
            finish(n, Data::Try { body: body_m, catch, finally }, c)
        }
        Data::Catch { arg, body } => {
            let (arg, c1) = map_opt(arg, cx);
            let body_m = transform(body, cx);
            let c2 = !Rc::ptr_eq(&body_m, body);
            finish(n, Data::Catch { arg, body: body_m }, c1 || c2)
        }
        Data::Finally { body } => {
            let m = transform(body, cx);
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
            finish(n, Data::Func { kind: *kind, name, args, body, async_: *async_, generator: *generator }, c1 || c2 || c3)
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
            let m = transform(expr, cx);
            let c = !Rc::ptr_eq(&m, expr);
            finish(n, Data::Unary { op: op.clone(), expr: m, prefix: *prefix }, c)
        }
        Data::Binary { op, left, right } => {
            let left_m = transform(left, cx);
            let right_m = transform(right, cx);
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
            let cond_m = transform(cond, cx);
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
