#![forbid(unsafe_code)]

//! AST for the terser 5.51.4 parse and print path.
//! Node identity is `Rc` so the printer can match terser's parent-pointer checks.
//!
//! Every node also has a [`NodeId`] (see `compress/NODE_IDS.md`). terser edits one tree in
//! place; the port rebuilds immutable nodes. A rebuild that stands for terser's in-place edit
//! keeps the id ([`Node::rebuild`]); `new AST_X` / `make_node` / `clone` make a new one
//! ([`Node::new`], [`Node::spanned`], [`Node::make`], [`deep_clone_with`]).

use std::cell::Cell;
use std::rc::Rc;

mod walk;
pub use walk::{
    check_ids, children_backwards, data_children, deep_clone, deep_clone_with, map_children, terser_type, transform_children, walk,
    walk_children,
};

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

/// The identity of a node across rebuilds: terser's "same object". Ids are minted from a
/// thread-local counter that [`reset_ids`] restarts, so they are only compared within one tree.
#[derive(Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Debug)]
pub struct NodeId(u32);

impl NodeId {
    /// Dense index for tables keyed by id.
    pub fn index(self) -> usize {
        self.0 as usize
    }
}

thread_local! {
    static NEXT_ID: Cell<u32> = const { Cell::new(0) };
}

fn mint() -> NodeId {
    NEXT_ID.with(|c| {
        let v = c.get();
        c.set(v.checked_add(1).expect("node id overflow"));
        NodeId(v)
    })
}

/// Restart the id counter. `terser::minify` calls it first, so every tree it builds is
/// numbered from zero.
pub fn reset_ids() {
    NEXT_ID.with(|c| c.set(0));
}

/// The number of ids minted since [`reset_ids`]: an upper bound for dense tables.
pub fn ids_minted() -> usize {
    NEXT_ID.with(|c| c.get() as usize)
}

/// Hashes a [`NodeId`] as itself: ids are small, dense and unique, so SipHash buys nothing.
#[derive(Default, Clone, Copy)]
pub struct IdHasher(u64);

impl std::hash::Hasher for IdHasher {
    fn finish(&self) -> u64 {
        self.0
    }
    fn write(&mut self, bytes: &[u8]) {
        for &b in bytes {
            self.0 = (self.0 ^ b as u64).wrapping_mul(0x100_0000_01b3);
        }
    }
    fn write_u32(&mut self, v: u32) {
        self.0 = v as u64;
    }
}

pub type IdMap<V> = std::collections::HashMap<NodeId, V, std::hash::BuildHasherDefault<IdHasher>>;
pub type IdSet = std::collections::HashSet<NodeId, std::hash::BuildHasherDefault<IdHasher>>;

/// Not `Clone`: a copy would duplicate the id. Use [`Node::make`] (a new node: terser
/// `make_node` / `clone()`) or [`Node::rebuild`] (the same node edited: terser's in-place edit).
#[derive(Debug)]
pub struct Node {
    id: NodeId,
    pub start: Option<Tok>,
    pub end: Option<Tok>,
    pub data: Data,
    /// terser `_annotations` (`utils/index.js` `set_annotation`): the parser's
    /// `annotate` sets it from `@__PURE__`-style comments. An in-place edit and
    /// `clone` keep it; `make_node` starts at 0.
    ann: std::cell::Cell<u8>,
}

/// terser `lib/parse.js` annotation bits.
pub const ANN_INLINE: u8 = 1 << 0;
pub const ANN_NOINLINE: u8 = 1 << 1;
pub const ANN_PURE: u8 = 1 << 2;
pub const ANN_KEY: u8 = 1 << 3;
pub const ANN_MANGLEPROP: u8 = 1 << 4;

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
    /// terser `new AST_X({..})` with no `start` / `end`: a new id.
    pub fn new(data: Data) -> N {
        Node::spanned(None, None, data)
    }

    /// terser `new AST_X({ start, end, .. })` (the parser): a new id.
    pub fn spanned(start: Option<Tok>, end: Option<Tok>, data: Data) -> N {
        Rc::new(Node { id: mint(), start, end, data, ann: std::cell::Cell::new(0) })
    }

    /// terser `make_node(X, orig, {..})`: a new id with `orig`'s span.
    pub fn make(orig: &Node, data: Data) -> N {
        Node::spanned(orig.start.clone(), orig.end.clone(), data)
    }

    /// terser `orig.clone()` (shallow) with new children: a new id, `orig`'s
    /// span and annotations (`clone` copies every property).
    pub fn copy(orig: &Node, data: Data) -> N {
        let n = Node::make(orig, data);
        n.ann.set(orig.ann.get());
        n
    }

    /// terser's in-place edit (`self.x = ..; return self`, `descend`): the same id and span,
    /// new data. Debug builds check that `data` does not hold the node itself as a direct
    /// child (`rebuild(x, Seq[x, ..])`), which in terser would be an object inside itself.
    pub fn rebuild(&self, data: Data) -> N {
        #[cfg(debug_assertions)]
        data_children(&data, &mut |c| {
            assert!(c.id != self.id, "rebuild: {} {:?} holds itself as a child", terser_type(self), self.id)
        });
        Rc::new(Node { id: self.id, start: self.start.clone(), end: self.end.clone(), data, ann: self.ann.clone() })
    }

    /// terser `has_annotation(node, mask)`.
    pub fn has_annotation(&self, mask: u8) -> bool {
        self.ann.get() & mask != 0
    }

    /// terser `set_annotation(node, mask)`.
    pub fn set_annotation(&self, mask: u8) {
        self.ann.set(self.ann.get() | mask);
    }

    /// terser `_annotations`.
    pub fn annotations(&self) -> u8 {
        self.ann.get()
    }

    pub fn id(&self) -> NodeId {
        self.id
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
