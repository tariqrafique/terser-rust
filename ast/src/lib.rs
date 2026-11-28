#![forbid(unsafe_code)]

//! AST for the terser 5.51.4 parse and print path.
//! Node identity is `Rc` so the printer can match terser's parent-pointer checks.

use std::rc::Rc;

mod walk;
pub use walk::{children_backwards, deep_clone, map_children, terser_type, transform_children, walk, walk_children};

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
