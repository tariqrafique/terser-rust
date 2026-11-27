#![forbid(unsafe_code)]

//! Terser 5.51.4 compressor. Passes land one option at a time.
//!
//! Unchanged subtrees stay the same `Rc`, so a pass that does not fire
//! prints exactly like the input tree.

mod assign;
mod body;
mod call;
mod conditional;
mod drop_unused;
mod eval;
mod sequence;
mod hoist;
mod loops;
mod object;
mod tighten;
mod reduce_vars;
mod syms;
mod unary;

use ast::{Data, Key, N, Node, Seg};
use serde_json::{Map, Value};
use std::cell::RefCell;
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
    comparisons: bool,
    lhs_constants: bool,
    typeofs: bool,
    if_return: bool,
    inline: i32,
    switches: bool,
    reduce_vars: bool,
    /// terser `reduce_funcs`. On unless the fixture turns it off.
    reduce_funcs: bool,
    collapse_vars: bool,
    unused: bool,
    toplevel_vars: bool,
    toplevel_funcs: bool,
    /// terser `hoist_props`, on by default.
    hoist_props: bool,
    /// terser `hoist_vars` / `hoist_funs`, off unless the fixture sets them.
    hoist_vars: bool,
    hoist_funs: bool,
    /// terser `top_retain` when it is a plain name. Other forms are not read yet.
    top_retain: Option<String>,
    /// terser `lib/compress/index.js` `pure_getters`. `"strict"` by default.
    pure_getters: PureGetters,
    /// terser `unsafe` / `unsafe_math`. Off unless the fixture sets them.
    unsafe_opt: bool,
    unsafe_math: bool,
    /// terser `lib/compress/index.js` `compress()` `passes`.
    passes: u32,
    /// terser `unsafe_comps`. Off unless the fixture sets it.
    unsafe_comps: bool,
    /// terser `ecma`. `5` unless set. Values from 6 through 2014 become `year + 2009`.
    ecma: i32,
    /// terser `expression`. Off unless set. Wraps the completion value in `return`
    /// for the duration of the compress passes (`process_expression`).
    expression: bool,
    /// terser `unsafe_methods`. Off unless set. A regexp only rewrites matching keys.
    unsafe_methods: UnsafeMethods,
}

/// terser `unsafe_methods`: `false`, `true`, or a `RegExp`.
#[derive(Clone, Debug)]
enum UnsafeMethods {
    Off,
    All,
    Pattern { source: String, flags: String },
}

/// terser `lib/compress/index.js` `pure_getters`.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum PureGetters {
    Off,
    /// `true`: only null and undefined receivers throw.
    On,
    /// `"strict"`: receivers that might be nullish or a getter throw.
    Strict,
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
            comparisons: true,
            lhs_constants: true,
            typeofs: true,
            if_return: true,
            inline: 3,
            switches: true,
            reduce_vars: true,
            reduce_funcs: true,
            collapse_vars: true,
            unused: true,
            toplevel_vars: false,
            toplevel_funcs: false,
            hoist_props: true,
            hoist_vars: false,
            hoist_funs: false,
            top_retain: None,
            pure_getters: PureGetters::Strict,
            unsafe_opt: false,
            unsafe_math: false,
            passes: 1,
            unsafe_comps: false,
            ecma: 5,
            expression: false,
            unsafe_methods: UnsafeMethods::Off,
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
            comparisons: false,
            lhs_constants: false,
            typeofs: false,
            if_return: false,
            inline: 0,
            switches: false,
            reduce_vars: false,
            reduce_funcs: false,
            collapse_vars: false,
            unused: false,
            toplevel_vars: false,
            toplevel_funcs: false,
            hoist_props: false,
            hoist_vars: false,
            hoist_funs: false,
            top_retain: None,
            pure_getters: PureGetters::Off,
            unsafe_opt: false,
            unsafe_math: false,
            passes: 1,
            unsafe_comps: false,
            ecma: 5,
            expression: false,
            unsafe_methods: UnsafeMethods::Off,
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
        if let Some(v) = bool_key(obj, "comparisons") {
            opts.comparisons = v;
        }
        if let Some(v) = bool_key(obj, "lhs_constants") {
            opts.lhs_constants = v;
        }
        if let Some(v) = bool_key(obj, "typeofs") {
            opts.typeofs = v;
        }
        if let Some(v) = bool_key(obj, "unsafe_comps") {
            opts.unsafe_comps = v;
        }
        if let Some(v) = bool_key(obj, "if_return") {
            opts.if_return = v;
        }
        if let Some(v) = bool_key(obj, "switches") {
            opts.switches = v;
        }
        if let Some(v) = bool_key(obj, "reduce_vars") {
            opts.reduce_vars = v;
        }
        if let Some(v) = bool_key(obj, "reduce_funcs") {
            opts.reduce_funcs = v;
        }
        if let Some(v) = bool_key(obj, "collapse_vars") {
            opts.collapse_vars = v;
        }
        if let Some(v) = bool_key(obj, "unused") {
            opts.unused = v;
        }
        if let Some(v) = obj.get("toplevel") {
            match v {
                Value::Bool(on) => {
                    opts.toplevel_vars = *on;
                    opts.toplevel_funcs = *on;
                }
                Value::String(s) => {
                    opts.toplevel_vars = s.contains("vars");
                    opts.toplevel_funcs = s.contains("funcs");
                }
                _ => {}
            }
        }
        if let Some(v) = obj.get("passes") {
            if let Some(n) = v.as_u64() {
                opts.passes = n.max(1) as u32;
            }
        }
        if let Some(v) = bool_key(obj, "hoist_props") {
            opts.hoist_props = v;
        }
        if let Some(v) = bool_key(obj, "hoist_vars") {
            opts.hoist_vars = v;
        }
        if let Some(v) = bool_key(obj, "hoist_funs") {
            opts.hoist_funs = v;
        }
        if let Some(Value::String(name)) = obj.get("top_retain") {
            opts.top_retain = Some(name.clone());
        }
        if let Some(v) = obj.get("pure_getters") {
            opts.pure_getters = pure_getters_of(v);
        }
        if let Some(v) = obj.get("inline") {
            opts.inline = match v {
                Value::Bool(true) => 3,
                Value::Bool(false) => 0,
                Value::Number(n) => n.as_i64().unwrap_or(0) as i32,
                _ => opts.inline,
            };
        }
        if let Some(v) = bool_key(obj, "unsafe") {
            opts.unsafe_opt = v;
        }
        if let Some(v) = bool_key(obj, "unsafe_math") {
            opts.unsafe_math = v;
        }
        if let Some(v) = obj.get("ecma").and_then(Value::as_i64) {
            let n = v as i32;
            opts.ecma = if n > 5 && n < 2015 { n + 2009 } else { n };
        }
        if let Some(v) = bool_key(obj, "expression") {
            opts.expression = v;
        }
        if let Some(v) = obj.get("unsafe_methods") {
            opts.unsafe_methods = unsafe_methods_of(v);
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
            || self.comparisons
            || self.lhs_constants
            || self.typeofs
            || self.unsafe_comps
            || self.if_return
            || self.inline > 0
            || self.switches
            || self.reduce_vars
            || self.collapse_vars
            || self.unused
            || self.unsafe_opt
            || self.unsafe_math
            || self.expression
            || !matches!(self.unsafe_methods, UnsafeMethods::Off)
    }
}

fn unsafe_methods_of(value: &Value) -> UnsafeMethods {
    match value {
        Value::Bool(true) => UnsafeMethods::All,
        Value::Bool(false) => UnsafeMethods::Off,
        Value::Object(obj) if obj.get("__terser_type").and_then(Value::as_str) == Some("RegExp") => {
            let source = obj.get("source").and_then(Value::as_str).unwrap_or("").to_string();
            let flags = obj.get("flags").and_then(Value::as_str).unwrap_or("").to_string();
            UnsafeMethods::Pattern { source, flags }
        }
        _ => UnsafeMethods::Off,
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

fn push_loop_bindings(init: Option<&N>, cx: &mut Cx) -> bool {
    let Some(init) = init else {
        return false;
    };
    let Data::Defs { defs, .. } = &init.data else {
        return false;
    };
    let mut names = HashSet::new();
    for def in defs {
        if let Data::VarDef { name, .. } = &def.data {
            collect_binding(name, &mut names);
        }
    }
    if names.is_empty() {
        return false;
    }
    cx.locals.push(names);
    cx.consts.push(HashMap::new());
    true
}

fn pop_loop_bindings(cx: &mut Cx) {
    cx.locals.pop();
    cx.consts.pop();
}

fn bind_short_consts(defs: &[N], cx: &mut Cx) {
    let Some(frame) = cx.consts.last_mut() else {
        return;
    };
    for def in defs {
        let Data::VarDef { name, value: Some(value) } = &def.data else {
            continue;
        };
        let Data::Symbol { name, .. } = &name.data else {
            continue;
        };
        let primitive = matches!(
            value.data,
            Data::Number { .. } | Data::String { .. } | Data::True | Data::False | Data::Null
        );
        if primitive && codegen::print(value).len() < name.len() {
            frame.insert(name.clone(), Rc::clone(value));
        }
    }
}

fn bool_key(obj: &Map<String, Value>, key: &str) -> Option<bool> {
    obj.get(key).and_then(Value::as_bool)
}

/// terser `lib/compress/index.js` defaults: `pure_getters` is `false`, `"strict"`, or `true`.
fn pure_getters_of(value: &Value) -> PureGetters {
    match value {
        Value::Bool(false) => PureGetters::Off,
        Value::Bool(true) => PureGetters::On,
        Value::String(s) if s.contains("strict") => PureGetters::Strict,
        Value::String(_) => PureGetters::On,
        _ => PureGetters::Off,
    }
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
    // terser `lib/compress/index.js` `Compressor.compress`: repeat `passes` times.
    // `expression` wraps the completion value in `return` before the passes and
    // unwraps after, so `first_in_statement` is false while a conditional is
    // optimized and `negate_iife` does not see a statement-leading function.
    let passes = opts.passes.max(1);
    let expression = opts.expression;
    let mut tree = Rc::clone(root);
    if expression {
        tree = process_expression(&tree, true);
    }
    for _ in 0..passes {
        tree = compress_pass(&tree, opts.clone());
    }
    if expression {
        tree = process_expression(&tree, false);
    }
    tree
}

/// terser `index.js` `AST_Scope.process_expression`.
///
/// The transformer returns every node, so it does not descend on its own.
/// Only the completion position is rewritten: the last statement of a block,
/// both branches of `if`, and the body of `with`. Functions and classes stay
/// closed. `insert` turns that statement into `return`; the unwrap turns
/// `return` back into a statement (`void 0` when the return has no value).
fn process_expression(n: &N, insert: bool) -> N {
    match &n.data {
        Data::Func { .. } | Data::Class { .. } => Rc::clone(n),
        Data::Simple { body } if insert => eval::atom(n, Data::Return { value: Some(Rc::clone(body)) }),
        Data::Return { value } if !insert => {
            let body = match value {
                Some(v) => Rc::clone(v),
                None => eval::void0(n),
            };
            eval::simple(n, body)
        }
        Data::Toplevel { body } => rewrite_completion(n, body, insert, |body| Data::Toplevel { body }),
        Data::Block { body } => rewrite_completion(n, body, insert, |body| Data::Block { body }),
        Data::If { cond, body, alt } => {
            let body_m = process_expression(body, insert);
            let alt_m = alt.as_ref().map(|a| process_expression(a, insert));
            let same_alt = match (alt, &alt_m) {
                (None, None) => true,
                (Some(a), Some(b)) => Rc::ptr_eq(a, b),
                _ => false,
            };
            if Rc::ptr_eq(&body_m, body) && same_alt {
                Rc::clone(n)
            } else {
                eval::atom(
                    n,
                    Data::If { cond: Rc::clone(cond), body: body_m, alt: alt_m },
                )
            }
        }
        Data::With { expr, body } => {
            let body_m = process_expression(body, insert);
            if Rc::ptr_eq(&body_m, body) {
                Rc::clone(n)
            } else {
                eval::atom(n, Data::With { expr: Rc::clone(expr), body: body_m })
            }
        }
        _ => Rc::clone(n),
    }
}

fn rewrite_completion(n: &N, body: &[N], insert: bool, wrap: impl Fn(Vec<N>) -> Data) -> N {
    let Some(last) = body.last() else {
        return Rc::clone(n);
    };
    let last_m = process_expression(last, insert);
    if Rc::ptr_eq(&last_m, last) {
        return Rc::clone(n);
    }
    let mut next = body.to_vec();
    *next.last_mut().unwrap() = last_m;
    eval::atom(n, wrap(next))
}

fn compress_pass(root: &N, opts: Opts) -> N {
    let collapse_vars = opts.collapse_vars;
    let reduce_vars_on = opts.reduce_vars;
    let unused = opts.unused;
    let toplevel_vars = opts.toplevel_vars;
    let toplevel_funcs = opts.toplevel_funcs;
    let evaluate = opts.evaluate;
    let mut cx = Cx {
        opts,
        frames: vec![HashMap::new()],
        in_bool: false,
        eq_cmp: false,
        keep_block: false,
        in_with: false,
        in_for_init: false,
        in_lhs: false,
        locals: vec![HashSet::new()],
        consts: vec![HashMap::new()],
        syms: None,
        squeezed: HashSet::new(),
        optimized: HashSet::new(),
        sealed: RefCell::new(Vec::new()),
        seal: RefCell::new(HashSet::new()),
        seal_keep: RefCell::new(Vec::new()),
        flag_keep: Vec::new(),
        stack: Vec::new(),
        parents: Vec::new(),
    };
    if reduce_vars_on {
        let mut table = syms::bind(root);
        reduce_vars::analyze(
            &mut table,
            root,
            &reduce_vars::Env { unused, evaluate, toplevel_vars, toplevel_funcs },
        );
        cx.syms = Some(table);
    }
    let out = transform(root, &mut cx);
    let out = if let Some(table) = &cx.syms {
        syms::drop_replaced(&out, table, unused)
    } else {
        out
    };
    let out = if collapse_vars {
        tighten::collapse(&out, unused, toplevel_vars)
    } else {
        out
    };
    if unused {
        drop_unused::drop_unused(&out, toplevel_vars, toplevel_funcs)
    } else {
        out
    }
}

struct Cx {
    opts: Opts,
    frames: Vec<HashMap<String, usize>>,
    in_bool: bool,
    eq_cmp: bool,
    keep_block: bool,
    in_with: bool,
    in_for_init: bool,
    /// Symbol is the target of an assignment, update, or for-in/of.
    /// terser `Compressor.is_lhs` / `inference.js` `is_lhs`.
    in_lhs: bool,
    locals: Vec<HashSet<String>>,
    consts: Vec<HashMap<String, N>>,
    syms: Option<syms::SymTable>,
    /// terser `SQUEEZED` (`index.js` `Compressor.before`): `before` returns the node.
    squeezed: HashSet<usize>,
    /// terser `OPTIMIZED` (`index.js` `def_optimize`): the per-type optimizer does not run again.
    optimized: HashSet<usize>,
    /// Nodes `def_optimize` already returned, so a later `before` must not run
    /// their optimizer again. Terser sets `OPTIMIZED` on that object and then
    /// mutates its children in place. An assignment built by
    /// `AST_Conditional` is the case that matters here: `x = (y ? 2 : 2)`
    /// becomes `x = (y, 2)` and is not lifted to `y, x = 2`.
    sealed: RefCell<Vec<N>>,
    /// Switch-built `if` nodes. Terser sets `OPTIMIZED` on them inside `def_optimize(AST_Switch)`,
    /// so the second descend does not turn `if (c) s` into `c && s`.
    seal: RefCell<HashSet<usize>>,
    seal_keep: RefCell<Vec<N>>,
    /// Keeps flagged nodes alive so a recycled address cannot inherit another node's flag.
    flag_keep: Vec<N>,
    /// Ancestors for `def_optimize(AST_Binary)` (`in_boolean_context`, `parent()`).
    stack: Vec<N>,
    /// terser `TreeWalker.stack`. Last node is `self()`, the one before it is `parent()`.
    parents: Vec<N>,
}

impl Cx {
    fn shadowed(&self, name: &str) -> bool {
        self.locals.iter().any(|set| set.contains(name))
    }

    fn const_value(&self, name: &str) -> Option<&N> {
        for (locals, consts) in self.locals.iter().rev().zip(self.consts.iter().rev()) {
            if let Some(value) = consts.get(name) {
                return Some(value);
            }
            if locals.contains(name) {
                return None;
            }
        }
        None
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
                self.consts.push(HashMap::new());
                Enter::Scope
            }
            Data::StaticBlock { body } => {
                self.frames.push(HashMap::new());
                let mut names = HashSet::new();
                scan_lexical(body, &mut names);
                self.locals.push(names);
                self.consts.push(HashMap::new());
                Enter::Scope
            }
            Data::Block { body } => {
                let mut names = HashSet::new();
                scan_lexical(body, &mut names);
                self.locals.push(names);
                self.consts.push(HashMap::new());
                Enter::Locals
            }
            Data::Catch { arg, .. } => {
                let mut names = HashSet::new();
                if let Some(arg) = arg {
                    collect_binding(arg, &mut names);
                }
                self.locals.push(names);
                self.consts.push(HashMap::new());
                Enter::Locals
            }
            Data::Class { .. } => {
                let already = self.lookup("use strict").is_some();
                self.frames.push(HashMap::new());
                self.locals.push(HashSet::new());
                self.consts.push(HashMap::new());
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
            // Toplevel `var` / function decls are bindings for the whole program.
            // The root locals frame starts empty; without this scan, `shadowed`
            // misses `var String` when `reduce_vars` is off and `is_undeclared_ref`
            // would treat `String(x)` as the global constructor.
            Data::Toplevel { body } => {
                if let Some(names) = self.locals.last_mut() {
                    scan_hoisted(body, names);
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
                self.consts.pop();
            }
            Enter::Locals => {
                self.locals.pop();
                self.consts.pop();
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

    /// Mark `n` so a later `transform` does not run `def_optimize` on it again.
    pub(crate) fn seal_optimized(&self, n: &N) {
        self.seal.borrow_mut().insert(Rc::as_ptr(n) as usize);
        self.seal_keep.borrow_mut().push(Rc::clone(n));
    }

    /// terser `TreeWalker.parent`: the node wrapped around the one being optimized.
    fn parent(&self) -> Option<&N> {
        let len = self.parents.len();
        if len >= 2 {
            self.parents.get(len - 2)
        } else {
            None
        }
    }

    /// terser `TreeWalker.is_within_loop`.
    fn in_loop(&self) -> bool {
        let stack = &self.parents;
        if stack.is_empty() {
            return false;
        }
        let mut i = stack.len() - 1;
        let mut child = &stack[i];
        while i > 0 {
            i -= 1;
            let node = &stack[i];
            if matches!(node.data, Data::Func { .. }) {
                return false;
            }
            let inside = match &node.data {
                Data::For { init, .. } => !init.as_ref().is_some_and(|init| Rc::ptr_eq(init, child)),
                Data::ForIn { object, .. } | Data::ForOf { object, .. } => !Rc::ptr_eq(object, child),
                Data::While { .. } | Data::Do { .. } => true,
                _ => false,
            };
            if inside {
                return true;
            }
            child = node;
        }
        false
    }

    fn parent_is_simple(&self) -> bool {
        self.parents.iter().rev().nth(1).is_some_and(|p| matches!(p.data, Data::Simple { .. }))
    }

    fn parent_is_class(&self) -> bool {
        self.parents.iter().rev().nth(1).is_some_and(|p| matches!(p.data, Data::Class { .. }))
    }

    fn nearest_scope_is_class(&self) -> bool {
        for node in self.parents.iter().rev() {
            match &node.data {
                Data::Class { .. } => return true,
                Data::Func { .. } | Data::Toplevel { .. } | Data::StaticBlock { .. } => return false,
                _ => {}
            }
        }
        false
    }

    fn in_default_assign(&self) -> bool {
        for node in self.parents.iter().rev().skip(1) {
            match &node.data {
                Data::DefaultAssign { .. } => return true,
                Data::Block { .. }
                | Data::Func { .. }
                | Data::Toplevel { .. }
                | Data::StaticBlock { .. }
                | Data::Class { .. } => return false,
                _ => {}
            }
        }
        false
    }

    fn in_computed_key(&self) -> bool {
        if !self.opts.evaluate {
            return false;
        }
        let Some(self_node) = self.parents.last() else {
            return false;
        };
        self.parents.iter().rev().skip(1).any(|p| {
            matches!(&p.data, Data::Prop { key: ast::Key::Computed(key), .. } if Rc::ptr_eq(key, self_node))
        })
    }

    fn parent_calls(&self, node: &N) -> bool {
        let Some(parent) = self.parents.iter().rev().nth(1) else {
            return false;
        };
        let Data::Call { expr, is_new: false, .. } = &parent.data else {
            return false;
        };
        Rc::ptr_eq(expr, node) || self.parents.last().is_some_and(|top| Rc::ptr_eq(expr, top))
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

/// terser `lib/compress/index.js` `Compressor.before`.
///
/// Descend, descend again, then `optimize` (`def_optimize`). A node whose
/// optimizer returned it unchanged is `SQUEEZED` and the second descend does
/// not walk it. A replacement is `OPTIMIZED`, so the second descend still
/// walks its children but does not run its optimizer again. That is why a
/// switch that became `if (c) { stmt; }` is not then rewritten to `c && stmt`.
fn transform(n: &N, cx: &mut Cx) -> N {
    let ptr = Rc::as_ptr(n) as usize;
    let orig_ptr = ptr;
    if cx.squeezed.contains(&ptr) {
        return Rc::clone(n);
    }
    // terser `Compressor.before`: hoist before descending. An enclosing `use asm` skips it.
    let hoisted;
    let n = if was_scope(&n.data) && !cx.in_asm() {
        hoisted = hoist::hoist(n, cx.opts.hoist_props, cx.opts.hoist_funs, cx.opts.hoist_vars, cx.opts.toplevel_vars, cx.opts.top_retain.as_deref(), cx.syms.as_ref());
        &hoisted
    } else {
        n
    };
    cx.parents.push(Rc::clone(n));
    let entered = cx.enter(n);
    // `use asm`: `def_optimize` returns self before setting `OPTIMIZED`.
    // `before` still descends twice and sets `SQUEEZED`.
    if cx.in_asm() {
        let once = map_children(n, cx);
        let out = map_children(&once, cx);
        mark_squeezed(cx, &out);
        cx.leave(entered);
        cx.parents.pop();
        retarget(cx, orig_ptr, &out);
        return out;
    }
    // The stack top is the once-rewritten node during the second descend so
    // `parent.left === self` sees updated children, then the original for `fold`.
    cx.stack.push(Rc::clone(n));
    let once = map_children(n, cx);
    *cx.stack.last_mut().unwrap() = Rc::clone(&once);
    set_parent(cx, &once);
    let twice = map_children(&once, cx);
    *cx.stack.last_mut().unwrap() = Rc::clone(n);
    // Fold sees the original node on the parent stack. Terser mutates in place, so
    // `parent.expression === self` still holds. The rebuilt `twice` is only the data.
    set_parent(cx, n);
    // Statement joining (`tighten`) is part of the scope/block optimizer, so it
    // runs once, after both descends. Running it inside `descend` let the second
    // walk fold a switch-built `if` into `&&`.
    let twice = after_descend(twice, n, cx);
    let twice_ptr = Rc::as_ptr(&twice) as usize;
    // `def_optimize`: debugger and directives are handled in `optimize`.
    // Every other node type goes through `eval::fold` (the OPT bodies landed so far).
    let sealed = is_sealed(cx, n);
    let switch_sealed = cx.seal.borrow().contains(&twice_ptr) || cx.seal.borrow().contains(&ptr);
    let mut out = if sealed {
        if !is_sealed(cx, &twice) {
            seal(cx, &twice);
        }
        Rc::clone(&twice)
    } else if cx.optimized.contains(&twice_ptr) || switch_sealed {
        Rc::clone(&twice)
    } else if let Some(rep) = optimize(&twice, ptr, cx) {
        rep
    } else {
        eval::fold(&twice, cx)
    };
    // `index.js` `Compressor.before`: after `optimize`, a scope runs
    // `drop_unused` and descends once more. `use asm` skips `drop_unused`.
    // Flags are copied onto the rebuilt tree: terser mutates in place, so a
    // node that was already optimized stays squeezed and is not folded again.
    let same = Rc::ptr_eq(&out, &twice);
    if was_scope(&n.data) && was_scope(&out.data) && cx.opts.unused && !cx.in_asm() {
        // Nodes built by this optimize (a switch turned into `if`, then a comma
        // pulled into its condition) are already in their final shape. Terser
        // mutates them in place and leaves `OPTIMIZED` set, so the descend after
        // `drop_unused` does not fold them again.
        mark_tree_squeezed(&out, cx);
        let dropped = drop_unused::drop_unused(&out, cx.opts.toplevel_vars, cx.opts.toplevel_funcs);
        transfer_flags(&out, &dropped, cx);
        set_parent(cx, &dropped);
        out = map_children(&dropped, cx);
        set_parent(cx, &out);
        // The scope's `before` is finished. Squeezing it matches terser setting
        // `SQUEEZED` on the same scope object after `drop_unused`.
        mark_squeezed(cx, &out);
    }
    mark_optimized(cx, &out);
    if same {
        mark_squeezed(cx, &out);
    }
    cx.stack.pop();
    cx.leave(entered);
    cx.parents.pop();
    retarget(cx, orig_ptr, &out);
    out
}

fn retarget(cx: &mut Cx, orig_ptr: usize, out: &N) {
    if Rc::as_ptr(out) as usize == orig_ptr {
        return;
    }
    if let Some(table) = cx.syms.as_mut() {
        syms::retarget_fixed(table, orig_ptr, out);
    }
}

fn set_parent(cx: &mut Cx, n: &N) {
    if cx.parents.last().is_some_and(|top| Rc::ptr_eq(top, n)) {
        return;
    }
    cx.parents.pop();
    cx.parents.push(Rc::clone(n));
}

fn was_scope(data: &Data) -> bool {
    matches!(data, Data::Toplevel { .. } | Data::Func { .. } | Data::StaticBlock { .. })
}

/// Copy `SQUEEZED` / `OPTIMIZED` from `old` onto `new` when `drop_unused` rebuilt
/// the same shape. A different shape is a replacement and must be compressed.
fn mark_tree_squeezed(n: &N, cx: &mut Cx) {
    mark_squeezed(cx, n);
    mark_optimized(cx, n);
    for child in child_refs(&n.data) {
        mark_tree_squeezed(child, cx);
    }
}

fn transfer_flags(old: &N, new: &N, cx: &mut Cx) {
    if Rc::ptr_eq(old, new) {
        return;
    }
    if std::mem::discriminant(&old.data) != std::mem::discriminant(&new.data) {
        return;
    }
    let ptr = Rc::as_ptr(old) as usize;
    if cx.squeezed.contains(&ptr) {
        mark_squeezed(cx, new);
    }
    if cx.optimized.contains(&ptr) {
        mark_optimized(cx, new);
    }
    let (left, right) = (child_refs(&old.data), child_refs(&new.data));
    for (a, b) in left.iter().zip(right.iter()) {
        transfer_flags(a, b, cx);
    }
}

fn child_refs(data: &Data) -> Vec<&N> {
    let mut out = Vec::new();
    match data {
        Data::Toplevel { body } | Data::Block { body } | Data::StaticBlock { body } | Data::Default { body } => {
            out.extend(body.iter());
        }
        Data::Simple { body } | Data::Throw { value: body } | Data::Spread { expr: body } | Data::Chain { expr: body } | Data::Await { expr: body } | Data::Unary { expr: body, .. } | Data::Dot { expr: body, .. } | Data::Finally { body } => {
            out.push(body);
        }
        Data::Return { value } | Data::Yield { expr: value, .. } => {
            if let Some(v) = value { out.push(v); }
        }
        Data::Labeled { label, body } => { out.push(label); out.push(body); }
        Data::Do { body, cond } | Data::While { cond: body, body: cond } => { out.push(body); out.push(cond); }
        Data::For { init, cond, step, body } => {
            if let Some(v) = init { out.push(v); }
            if let Some(v) = cond { out.push(v); }
            if let Some(v) = step { out.push(v); }
            out.push(body);
        }
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            out.push(init); out.push(object); out.push(body);
        }
        Data::With { expr, body } => { out.push(expr); out.push(body); }
        Data::If { cond, body, alt } => {
            out.push(cond); out.push(body);
            if let Some(a) = alt { out.push(a); }
        }
        Data::Switch { expr, body } => { out.push(expr); out.extend(body.iter()); }
        Data::Case { expr, body } => { out.push(expr); out.extend(body.iter()); }
        Data::Try { body, catch, finally } => {
            out.push(body);
            if let Some(v) = catch { out.push(v); }
            if let Some(v) = finally { out.push(v); }
        }
        Data::Catch { arg, body } => {
            if let Some(a) = arg { out.push(a); }
            out.push(body);
        }
        Data::Defs { defs, .. } => out.extend(defs.iter()),
        Data::VarDef { name, value } => {
            out.push(name);
            if let Some(v) = value { out.push(v); }
        }
        Data::Func { name, args, body, .. } => {
            if let Some(n) = name { out.push(n); }
            out.extend(args.iter());
            out.extend(body.iter());
        }
        Data::Class { name, extends, props, .. } => {
            if let Some(n) = name { out.push(n); }
            if let Some(e) = extends { out.push(e); }
            out.extend(props.iter());
        }
        Data::Break { label } | Data::Continue { label } => {
            if let Some(l) = label { out.push(l); }
        }
        Data::Array { elements } | Data::Seq { exprs: elements } | Data::DynImport { args: elements, .. } => {
            out.extend(elements.iter());
        }
        Data::Object { props } => out.extend(props.iter()),
        Data::Prop { key, value, .. } => {
            if let ast::Key::Computed(e) = key { out.push(e); }
            out.push(value);
        }
        Data::Field { key, value, .. } => {
            if let ast::Key::Computed(e) = key { out.push(e); }
            if let Some(v) = value { out.push(v); }
        }
        Data::Destructuring { names, .. } => out.extend(names.iter()),
        Data::Sub { expr, prop, .. } => { out.push(expr); out.push(prop); }
        Data::Call { expr, args, .. } => { out.push(expr); out.extend(args.iter()); }
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } | Data::DefaultAssign { left, right } | Data::PrivateIn { key: left, value: right } => {
            out.push(left); out.push(right);
        }
        Data::Cond { cond, cons, alt } => { out.push(cond); out.push(cons); out.push(alt); }
        Data::Template { segments } => {
            for seg in segments {
                if let ast::Seg::Expr(e) = seg { out.push(e); }
            }
        }
        Data::TaggedTemplate { tag, template } => { out.push(tag); out.push(template); }
        Data::Export { value, definition, .. } => {
            if let Some(v) = value { out.push(v); }
            if let Some(d) = definition { out.push(d); }
        }
        _ => {}
    }
    out
}

fn seal(cx: &Cx, n: &N) {
    cx.sealed.borrow_mut().push(Rc::clone(n));
}

fn is_sealed(cx: &Cx, n: &N) -> bool {
    let ptr = Rc::as_ptr(n) as usize;
    cx.sealed.borrow().iter().any(|kept| Rc::as_ptr(kept) as usize == ptr)
}

fn mark_optimized(cx: &mut Cx, n: &N) {
    cx.optimized.insert(Rc::as_ptr(n) as usize);
    cx.flag_keep.push(Rc::clone(n));
}

fn mark_squeezed(cx: &mut Cx, n: &N) {
    cx.squeezed.insert(Rc::as_ptr(n) as usize);
    cx.flag_keep.push(Rc::clone(n));
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

fn same_stmts(a: &[N], b: &[N]) -> bool {
    a.len() == b.len() && a.iter().zip(b).all(|(x, y)| Rc::ptr_eq(x, y))
}

/// Scope and block optimizers that terser runs inside `def_optimize`, after
/// `Compressor.before` has descended twice: `join_vars`, sequences, `if_return`,
/// trailing-return drop, and single-statement block eviction.
fn after_descend(n: N, orig: &N, cx: &mut Cx) -> N {
    match &n.data {
        Data::Toplevel { body } => {
            let next = body::tighten_body(body.clone(), cx);
            if same_stmts(body, &next) {
                n
            } else {
                finish(&n, Data::Toplevel { body: next }, true)
            }
        }
        Data::StaticBlock { body } => {
            let next = body::tighten_body(body.clone(), cx);
            if same_stmts(body, &next) {
                n
            } else {
                finish(&n, Data::StaticBlock { body: next }, true)
            }
        }
        Data::Block { body } => {
            let next = body::tighten_body(body.clone(), cx);
            if !cx.keep_block && (next.is_empty() || eval::only_pure_decls(&next, cx)) {
                return empty(&n);
            }
            if !cx.keep_block && next.len() == 1 && can_evict(&next[0]) {
                return Rc::clone(&next[0]);
            }
            if same_stmts(body, &next) {
                n
            } else {
                finish(&n, Data::Block { body: next }, true)
            }
        }
        Data::Func { kind, name, args, body, async_, generator } => {
            let mut next = body::tighten_body(body.clone(), cx);
            let original = match &orig.data {
                Data::Func { body, .. } => body.as_slice(),
                _ => body.as_slice(),
            };
            next = eval::opt_ast_lambda(original, next, cx);
            if same_stmts(body, &next) {
                n
            } else {
                finish(
                    &n,
                    Data::Func {
                        kind: *kind,
                        name: name.clone(),
                        args: args.clone(),
                        body: next,
                        async_: *async_,
                        generator: *generator,
                    },
                    true,
                )
            }
        }
        Data::Case { expr, body } => {
            let next = body::tighten_body(body.clone(), cx);
            if same_stmts(body, &next) {
                n
            } else {
                finish(&n, Data::Case { expr: Rc::clone(expr), body: next }, true)
            }
        }
        Data::Default { body } => {
            let next = body::tighten_body(body.clone(), cx);
            if same_stmts(body, &next) {
                n
            } else {
                finish(&n, Data::Default { body: next }, true)
            }
        }
        _ => n,
    }
}

/// terser `tighten-body.js` `eliminate_spurious_blocks`, then the statement joins.
pub(crate) fn tighten(stmts: Vec<N>, cx: &Cx) -> Vec<N> {
    let stmts = eliminate_spurious_blocks(stmts);
    let stmts = if cx.opts.join_vars { join_vars(stmts) } else { stmts };
    let stmts = if cx.opts.sequences_limit > 0 {
        sequence_into_next(sequence_statements(stmts, cx.opts.sequences_limit))
    } else {
        stmts
    };
    let stmts = if cx.opts.join_vars { var_into_for(stmts) } else { stmts };
    if cx.opts.if_return && cx.opts.conditionals {
        if_return(stmts)
    } else {
        stmts
    }
}

fn if_return(mut stmts: Vec<N>) -> Vec<N> {
    for _ in 0..8 {
        let (changed, next) = if_return_once(stmts);
        stmts = next;
        if !changed {
            break;
        }
    }
    stmts
}

fn if_return_once(stmts: Vec<N>) -> (bool, Vec<N>) {
    let mut out = Vec::with_capacity(stmts.len());
    let mut changed = false;
    let mut i = 0;
    while i < stmts.len() {
        let stat = &stmts[i];
        if let Data::If { cond, body, alt: None } = &stat.data {
            if let Data::Return { value: Some(cons) } = &body.data {
                if let Some(Data::Return { value: Some(alt) }) = stmts.get(i + 1).map(|n| &n.data) {
                    out.push(return_cond(stat, Rc::clone(cond), Rc::clone(cons), Rc::clone(alt)));
                    changed = true;
                    i += 2;
                    continue;
                }
            }
        }
        if let Data::If { cond, body, alt: Some(alt_stmt) } = &stat.data {
            if let (Data::Return { value: cons }, Data::Return { value: alt }) = (&body.data, &alt_stmt.data) {
                if cons.is_some() && alt.is_some() {
                    out.push(return_cond(stat, Rc::clone(cond), cons.clone().unwrap(), alt.clone().unwrap()));
                    changed = true;
                    i += 1;
                    continue;
                }
            }
        }
        out.push(Rc::clone(stat));
        i += 1;
    }
    (changed, out)
}

fn return_cond(span: &N, cond: N, cons: N, alt: N) -> N {
    Rc::new(Node {
        start: span.start.clone(),
        end: span.end.clone(),
        data: Data::Return {
            value: Some(Rc::new(Node {
                start: span.start.clone(),
                end: span.end.clone(),
                data: Data::Cond { cond, cons, alt },
            })),
        },
    })
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

fn eliminate_spurious_blocks(stmts: Vec<N>) -> Vec<N> {
    let mut out = Vec::new();
    for stat in stmts {
        if let Data::Block { body } = &stat.data {
            if body.iter().all(can_evict) {
                out.extend(eliminate_spurious_blocks(body.clone()));
                continue;
            }
        }
        if matches!(stat.data, Data::Empty) {
            continue;
        }
        out.push(stat);
    }
    out
}

pub(crate) fn can_evict(n: &N) -> bool {
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
            finish(n, Data::Toplevel { body }, c)
        }
        Data::Simple { body } => {
            let m = transform(body, cx);
            let c = !Rc::ptr_eq(&m, body);
            finish(n, Data::Simple { body: m }, c)
        }
        Data::StaticBlock { body } => {
            let (body, c) = map_list(body, cx);
            finish(n, Data::StaticBlock { body }, c)
        }
        Data::Block { body } => {
            let (body, c) = map_list(body, cx);
            finish(n, Data::Block { body }, c)
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
            let prev = cx.in_for_init;
            cx.in_for_init = true;
            let (init, c1) = map_opt(init, cx);
            cx.in_for_init = prev;
            let pushed = push_loop_bindings(init.as_ref(), cx);
            let (cond, c2) = map_opt_bool(cond, cx);
            let (step, c3) = map_opt(step, cx);
            let body_m = transform(body, cx);
            if pushed {
                pop_loop_bindings(cx);
            }
            let c = c1 || c2 || c3 || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::For { init, cond, step, body: body_m }, c)
        }
        Data::ForIn { init, object, body } => {
            let prev = cx.in_for_init;
            cx.in_for_init = true;
            cx.in_lhs = true;
            let init_m = transform(init, cx);
            cx.in_lhs = false;
            cx.in_for_init = prev;
            let object_m = transform(object, cx);
            let pushed = push_loop_bindings(Some(&init_m), cx);
            let body_m = transform(body, cx);
            if pushed {
                pop_loop_bindings(cx);
            }
            let c = !Rc::ptr_eq(&init_m, init) || !Rc::ptr_eq(&object_m, object) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::ForIn { init: init_m, object: object_m, body: body_m }, c)
        }
        Data::ForOf { init, object, body, await_ } => {
            let prev = cx.in_for_init;
            cx.in_for_init = true;
            cx.in_lhs = true;
            let init_m = transform(init, cx);
            cx.in_lhs = false;
            cx.in_for_init = prev;
            let object_m = transform(object, cx);
            let pushed = push_loop_bindings(Some(&init_m), cx);
            let body_m = transform(body, cx);
            if pushed {
                pop_loop_bindings(cx);
            }
            let c = !Rc::ptr_eq(&init_m, init) || !Rc::ptr_eq(&object_m, object) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::ForOf { init: init_m, object: object_m, body: body_m, await_: *await_ }, c)
        }
        Data::With { expr, body } => {
            let expr_m = transform(expr, cx);
            let prev = cx.in_with;
            cx.in_with = true;
            let body_m = transform(body, cx);
            cx.in_with = prev;
            let c = !Rc::ptr_eq(&expr_m, expr) || !Rc::ptr_eq(&body_m, body);
            finish(n, Data::With { expr: expr_m, body: body_m }, c)
        }
        Data::If { cond, body, alt } => {
            let cond_m = transform_bool(cond, cx);
            let body_m = transform(body, cx);
            let (alt, c3) = map_opt(alt, cx);
            let c = !Rc::ptr_eq(&cond_m, cond) || !Rc::ptr_eq(&body_m, body) || c3;
            let out = finish(n, Data::If { cond: cond_m, body: body_m, alt }, c);
            // Terser mutates the sealed `if` in place, so `OPTIMIZED` survives a child update.
            if c && cx.seal.borrow().contains(&(Rc::as_ptr(n) as usize)) {
                cx.seal_optimized(&out);
            }
            out
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
            if cx.opts.reduce_vars && *kind == ast::DefKind::Const && !cx.in_for_init {
                bind_short_consts(&defs, cx);
            }
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
            // `++`/`--` mark the operand. `delete` does not: only the direct
            // child is an lhs, and `rewrite_global` reads that off the parent stack.
            let write = matches!(op.as_str(), "++" | "--");
            let prev_lhs = cx.in_lhs;
            if write {
                cx.in_lhs = true;
            }
            let m = if op == "!" { transform_bool(expr, cx) } else { transform(expr, cx) };
            cx.in_lhs = prev_lhs;
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
            cx.in_lhs = true;
            let left_m = transform(left, cx);
            cx.in_lhs = false;
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
