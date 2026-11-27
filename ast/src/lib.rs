#![forbid(unsafe_code)]

//! AST for the terser 5.51.4 parse and print path.
//! Node identity is `Rc` so the printer can match terser's parent-pointer checks.

use std::rc::Rc;

pub type N = Rc<Node>;

#[derive(Clone, Debug)]
pub struct Comment {
    pub id: u32,
    pub ty: &'static str,
    pub value: String,
    pub nlb: bool,
}

#[derive(Clone, Debug)]
pub struct Tok {
    pub ty: &'static str,
    pub value: String,
    pub line: u32,
    pub col: u32,
    pub pos: u32,
    pub nlb: bool,
    pub comments_before: Vec<Comment>,
    /// Identity of this comment list. Terser compares the array by reference.
    pub comments_id: u32,
    pub comments_after: Vec<Comment>,
    /// Identity of `comments_after`. Shared with the next token's `comments_before`.
    pub comments_after_id: u32,
    pub quote: Option<char>,
}

#[derive(Clone, Debug)]
pub struct Node {
    pub start: Option<Tok>,
    pub end: Option<Tok>,
    pub data: Data,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum DefKind {
    Var,
    Let,
    Const,
    Using,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FuncKind {
    Decl,
    Expr,
    Arrow,
    Accessor,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum SymKind {
    Ref,
    Var,
    Let,
    Const,
    Using,
    Funarg,
    Defun,
    Lambda,
    Method,
    Class,
    DefClass,
    Catch,
    Label,
    LabelRef,
    Import,
    ImportForeign,
    Export,
    ExportForeign,
    Private,
    ClassProperty,
}

#[derive(Clone, Debug)]
pub enum Key {
    Static { name: String, quote: Option<char> },
    Computed(N),
    Private(String),
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum MethodKind {
    Get,
    Set,
    Method,
}

#[derive(Clone, Debug)]
pub enum Data {
    Toplevel { body: Vec<N> },
    Directive {
        value: String,
        quote: char,
        /// UTF-16 units when `value` cannot hold lone surrogates.
        units: Option<Vec<u16>>,
    },
    Simple { body: N },
    Empty,
    Block { body: Vec<N> },
    Labeled { label: N, body: N },
    Debugger,
    Do { body: N, cond: N },
    While { cond: N, body: N },
    For {
        init: Option<N>,
        cond: Option<N>,
        step: Option<N>,
        body: N,
    },
    ForIn { init: N, object: N, body: N },
    ForOf {
        init: N,
        object: N,
        body: N,
        await_: bool,
    },
    With { expr: N, body: N },
    If { cond: N, body: N, alt: Option<N> },
    Switch { expr: N, body: Vec<N> },
    Case { expr: N, body: Vec<N> },
    Default { body: Vec<N> },
    Try {
        body: N,
        catch: Option<N>,
        finally: Option<N>,
    },
    Catch { arg: Option<N>, body: N },
    Finally { body: N },
    Defs {
        kind: DefKind,
        defs: Vec<N>,
        await_: bool,
    },
    VarDef { name: N, value: Option<N> },
    Func {
        kind: FuncKind,
        name: Option<N>,
        args: Vec<N>,
        body: Vec<N>,
        async_: bool,
        generator: bool,
    },
    Class {
        stmt: bool,
        name: Option<N>,
        extends: Option<N>,
        props: Vec<N>,
    },
    Return { value: Option<N> },
    Throw { value: N },
    Break { label: Option<N> },
    Continue { label: Option<N> },
    Import {
        phase: Option<String>,
        imported_name: Option<N>,
        imported_names: Option<Vec<N>>,
        module_name: N,
        attributes: Option<N>,
    },
    Export {
        is_default: bool,
        names: Option<Vec<N>>,
        value: Option<N>,
        definition: Option<N>,
        module_name: Option<N>,
        attributes: Option<N>,
    },
    NameMap { foreign: N, name: N },
    Symbol {
        name: String,
        kind: SymKind,
        quote: Option<char>,
    },
    This,
    Super,
    NewTarget,
    Null,
    True,
    False,
    Infinity,
    /// `raw` is the source spelling. The printer uses it inside `use asm`.
    Number { value: f64, raw: String },
    BigInt { value: String },
    String {
        value: String,
        quote: char,
        /// UTF-16 units when `value` cannot hold lone surrogates.
        units: Option<Vec<u16>>,
    },
    RegExp { source: String, flags: String },
    Array { elements: Vec<N> },
    Hole,
    Object { props: Vec<N> },
    Prop {
        method: Option<MethodKind>,
        key: Key,
        value: N,
        static_: bool,
        private: bool,
        generator: bool,
        async_: bool,
    },
    Field {
        key: Key,
        value: Option<N>,
        static_: bool,
        private: bool,
    },
    StaticBlock { body: Vec<N> },
    Spread { expr: N },
    Destructuring { array: bool, names: Vec<N> },
    Seq { exprs: Vec<N> },
    Dot {
        expr: N,
        prop: String,
        optional: bool,
        quote: Option<char>,
        private: bool,
    },
    Sub { expr: N, prop: N, optional: bool },
    Chain { expr: N },
    Call {
        expr: N,
        args: Vec<N>,
        optional: bool,
        is_new: bool,
    },
    Unary { op: String, expr: N, prefix: bool },
    Binary { op: String, left: N, right: N },
    Assign {
        op: String,
        left: N,
        right: N,
        logical: bool,
    },
    DefaultAssign { left: N, right: N },
    Cond { cond: N, cons: N, alt: N },
    Await { expr: N },
    Yield { expr: Option<N>, star: bool },
    Template { segments: Vec<Seg> },
    TaggedTemplate { tag: N, template: N },
    ImportMeta,
    DynImport { args: Vec<N>, phase: Option<String> },
    PrivateIn { key: N, value: N },
}

#[derive(Clone, Debug)]
pub enum Seg {
    Cooked {
        value: String,
        raw: String,
        /// UTF-16 units of the cooked value when it contains lone surrogates.
        units: Option<Vec<u16>>,
    },
    Expr(N),
}

impl Node {
    pub fn new(data: Data) -> N {
        Rc::new(Node {
            start: None,
            end: None,
            data,
        })
    }

    pub fn with_span(mut self, start: Option<Tok>, end: Option<Tok>) -> N {
        self.start = start;
        self.end = end;
        Rc::new(self)
    }

    pub fn is_scope(&self) -> bool {
        matches!(
            self.data,
            Data::Toplevel { .. }
                | Data::Func { .. }
                | Data::Class { .. }
                | Data::StaticBlock { .. }
        )
    }

    pub fn is_arrow(&self) -> bool {
        matches!(self.data, Data::Func { kind: FuncKind::Arrow, .. })
    }

    pub fn is_lambda(&self) -> bool {
        matches!(self.data, Data::Func { .. })
    }

    pub fn is_defun(&self) -> bool {
        matches!(self.data, Data::Func { kind: FuncKind::Decl, .. })
    }

    pub fn is_function_expr(&self) -> bool {
        matches!(self.data, Data::Func { kind: FuncKind::Expr, .. })
    }

    pub fn is_constant(&self) -> bool {
        matches!(
            self.data,
            Data::Null
                | Data::True
                | Data::False
                | Data::Infinity
                | Data::Number { .. }
                | Data::BigInt { .. }
                | Data::String { .. }
                | Data::RegExp { .. }
        )
    }

    pub fn is_statement_with_body(&self) -> bool {
        matches!(
            self.data,
            Data::Labeled { .. }
                | Data::Do { .. }
                | Data::While { .. }
                | Data::For { .. }
                | Data::ForIn { .. }
                | Data::ForOf { .. }
                | Data::With { .. }
                | Data::If { .. }
        )
    }

    pub fn body_node(&self) -> Option<&N> {
        match &self.data {
            Data::Labeled { body, .. }
            | Data::Do { body, .. }
            | Data::While { body, .. }
            | Data::For { body, .. }
            | Data::ForIn { body, .. }
            | Data::ForOf { body, .. }
            | Data::With { body, .. }
            | Data::If { body, .. }
            | Data::Simple { body } => Some(body),
            _ => None,
        }
    }

    pub fn is_prop_access(&self) -> bool {
        matches!(self.data, Data::Dot { .. } | Data::Sub { .. })
    }

    pub fn is_binary(&self) -> bool {
        matches!(self.data, Data::Binary { .. } | Data::Assign { .. } | Data::DefaultAssign { .. })
    }

    pub fn is_assign(&self) -> bool {
        matches!(self.data, Data::Assign { .. })
    }

    pub fn is_call(&self) -> bool {
        matches!(self.data, Data::Call { is_new: false, .. })
    }

    pub fn is_new(&self) -> bool {
        matches!(self.data, Data::Call { is_new: true, .. })
    }

    pub fn is_defs(&self) -> bool {
        matches!(self.data, Data::Defs { .. })
    }

    pub fn is_class_stmt(&self) -> bool {
        matches!(self.data, Data::Class { stmt: true, .. })
    }

    pub fn is_object(&self) -> bool {
        matches!(self.data, Data::Object { .. })
    }

    pub fn is_symbol(&self) -> bool {
        matches!(self.data, Data::Symbol { .. })
    }

    pub fn symbol_name(&self) -> Option<&str> {
        match &self.data {
            Data::Symbol { name, .. } => Some(name),
            _ => None,
        }
    }
}

pub fn is_basic_identifier(name: &str) -> bool {
    let mut chars = name.chars();
    match chars.next() {
        Some(c) if c.is_ascii_alphabetic() || c == '_' || c == '$' => {}
        _ => return false,
    }
    chars.all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '$')
}

/// Marks the crate as linked into the minify pipeline.
pub fn touch() {}

/// Rebuild `n` with every child replaced by `f(child)`. Scalar fields are
/// copied. The result is a new node even when no child changed.
pub fn map_children(n: &N, f: &mut dyn FnMut(&N) -> N) -> N {
    let mut o = |x: &Option<N>, f: &mut dyn FnMut(&N) -> N| x.as_ref().map(|v| f(v));
    let mut l = |xs: &[N], f: &mut dyn FnMut(&N) -> N| xs.iter().map(|v| f(v)).collect::<Vec<N>>();
    let key = |k: &Key, f: &mut dyn FnMut(&N) -> N| match k {
        Key::Computed(e) => Key::Computed(f(e)),
        other => other.clone(),
    };
    let data = match &n.data {
        Data::Toplevel { body } => Data::Toplevel { body: l(body, f) },
        Data::Simple { body } => Data::Simple { body: f(body) },
        Data::Block { body } => Data::Block { body: l(body, f) },
        Data::Labeled { label, body } => Data::Labeled { label: f(label), body: f(body) },
        Data::Do { body, cond } => Data::Do { body: f(body), cond: f(cond) },
        Data::While { cond, body } => Data::While { cond: f(cond), body: f(body) },
        Data::For { init, cond, step, body } => Data::For { init: o(init, f), cond: o(cond, f), step: o(step, f), body: f(body) },
        Data::ForIn { init, object, body } => Data::ForIn { init: f(init), object: f(object), body: f(body) },
        Data::ForOf { init, object, body, await_ } => Data::ForOf { init: f(init), object: f(object), body: f(body), await_: *await_ },
        Data::With { expr, body } => Data::With { expr: f(expr), body: f(body) },
        Data::If { cond, body, alt } => Data::If { cond: f(cond), body: f(body), alt: o(alt, f) },
        Data::Switch { expr, body } => Data::Switch { expr: f(expr), body: l(body, f) },
        Data::Case { expr, body } => Data::Case { expr: f(expr), body: l(body, f) },
        Data::Default { body } => Data::Default { body: l(body, f) },
        Data::Try { body, catch, finally } => Data::Try { body: f(body), catch: o(catch, f), finally: o(finally, f) },
        Data::Catch { arg, body } => Data::Catch { arg: o(arg, f), body: f(body) },
        Data::Finally { body } => Data::Finally { body: f(body) },
        Data::Defs { kind, defs, await_ } => Data::Defs { kind: *kind, defs: l(defs, f), await_: *await_ },
        Data::VarDef { name, value } => Data::VarDef { name: f(name), value: o(value, f) },
        Data::Func { kind, name, args, body, async_, generator } => Data::Func {
            kind: *kind,
            name: o(name, f),
            args: l(args, f),
            body: l(body, f),
            async_: *async_,
            generator: *generator,
        },
        Data::Class { stmt, name, extends, props } => Data::Class { stmt: *stmt, name: o(name, f), extends: o(extends, f), props: l(props, f) },
        Data::Return { value } => Data::Return { value: o(value, f) },
        Data::Throw { value } => Data::Throw { value: f(value) },
        Data::Break { label } => Data::Break { label: o(label, f) },
        Data::Continue { label } => Data::Continue { label: o(label, f) },
        Data::Import { phase, imported_name, imported_names, module_name, attributes } => Data::Import {
            phase: phase.clone(),
            imported_name: o(imported_name, f),
            imported_names: imported_names.as_ref().map(|v| l(v, f)),
            module_name: f(module_name),
            attributes: o(attributes, f),
        },
        Data::Export { is_default, names, value, definition, module_name, attributes } => Data::Export {
            is_default: *is_default,
            names: names.as_ref().map(|v| l(v, f)),
            value: o(value, f),
            definition: o(definition, f),
            module_name: o(module_name, f),
            attributes: o(attributes, f),
        },
        Data::NameMap { foreign, name } => Data::NameMap { foreign: f(foreign), name: f(name) },
        Data::Array { elements } => Data::Array { elements: l(elements, f) },
        Data::Object { props } => Data::Object { props: l(props, f) },
        Data::Prop { method, key: k, value, static_, private, generator, async_ } => Data::Prop {
            method: *method,
            key: key(k, f),
            value: f(value),
            static_: *static_,
            private: *private,
            generator: *generator,
            async_: *async_,
        },
        Data::Field { key: k, value, static_, private } => Data::Field { key: key(k, f), value: o(value, f), static_: *static_, private: *private },
        Data::StaticBlock { body } => Data::StaticBlock { body: l(body, f) },
        Data::Spread { expr } => Data::Spread { expr: f(expr) },
        Data::Destructuring { array, names } => Data::Destructuring { array: *array, names: l(names, f) },
        Data::Seq { exprs } => Data::Seq { exprs: l(exprs, f) },
        Data::Dot { expr, prop, optional, quote, private } => Data::Dot { expr: f(expr), prop: prop.clone(), optional: *optional, quote: *quote, private: *private },
        Data::Sub { expr, prop, optional } => Data::Sub { expr: f(expr), prop: f(prop), optional: *optional },
        Data::Chain { expr } => Data::Chain { expr: f(expr) },
        Data::Call { expr, args, optional, is_new } => Data::Call { expr: f(expr), args: l(args, f), optional: *optional, is_new: *is_new },
        Data::Unary { op, expr, prefix } => Data::Unary { op: op.clone(), expr: f(expr), prefix: *prefix },
        Data::Binary { op, left, right } => Data::Binary { op: op.clone(), left: f(left), right: f(right) },
        Data::Assign { op, left, right, logical } => Data::Assign { op: op.clone(), left: f(left), right: f(right), logical: *logical },
        Data::DefaultAssign { left, right } => Data::DefaultAssign { left: f(left), right: f(right) },
        Data::Cond { cond, cons, alt } => Data::Cond { cond: f(cond), cons: f(cons), alt: f(alt) },
        Data::Await { expr } => Data::Await { expr: f(expr) },
        Data::Yield { expr, star } => Data::Yield { expr: o(expr, f), star: *star },
        Data::Template { segments } => Data::Template {
            segments: segments
                .iter()
                .map(|s| match s {
                    Seg::Expr(e) => Seg::Expr(f(e)),
                    other => other.clone(),
                })
                .collect(),
        },
        Data::TaggedTemplate { tag, template } => Data::TaggedTemplate { tag: f(tag), template: f(template) },
        Data::DynImport { args, phase } => Data::DynImport { args: l(args, f), phase: phase.clone() },
        Data::PrivateIn { key: k, value } => Data::PrivateIn { key: f(k), value: f(value) },
        other => other.clone(),
    };
    Rc::new(Node { start: n.start.clone(), end: n.end.clone(), data })
}

/// terser `AST_Node.clone(true)`: every node is new.
pub fn deep_clone(n: &N) -> N {
    map_children(n, &mut |c| deep_clone(c))
}
