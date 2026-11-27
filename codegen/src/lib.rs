#![forbid(unsafe_code)]

//! Printer for the terser 5.51.4 roundtrip option set.
//! beautify is off, semicolons are on, ecma is 5, comments are "some".

use ast::{is_basic_identifier, Comment, Data, DefKind, FuncKind, Key, MethodKind, N, SymKind};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

thread_local! {
    static MANGLED: RefCell<HashMap<usize, String>> = RefCell::new(HashMap::new());
    static PRIVATES: RefCell<HashMap<String, String>> = RefCell::new(HashMap::new());
}

pub fn print(root: &N) -> String {
    print_with(root, true)
}

/// The string terser feeds to character frequency: `print_to_string()` with no
/// options, which skips comments and shebangs.
pub fn print_without_comments(root: &N) -> String {
    print_with(root, false)
}

fn print_with(root: &N, comments: bool) -> String {
    let mut out = Out::new();
    out.comments = comments;
    out.print_node(root, false);
    out.print("");
    out.buf
}

/// Print with mangled names. Keys are `Rc::as_ptr` of the symbol nodes.
pub fn print_mangled(root: &N, map: HashMap<usize, String>, privates: HashMap<String, String>) -> String {
    MANGLED.with(|slot| *slot.borrow_mut() = map);
    PRIVATES.with(|slot| *slot.borrow_mut() = privates);
    let out = print(root);
    MANGLED.with(|slot| slot.borrow_mut().clear());
    PRIVATES.with(|slot| slot.borrow_mut().clear());
    out
}

fn mapped_private(name: &str) -> String {
    PRIVATES.with(|slot| slot.borrow().get(name).cloned().unwrap_or_else(|| name.to_string()))
}

fn mapped_name(node: &N, original: &str) -> String {
    MANGLED.with(|slot| {
        slot.borrow()
            .get(&(Rc::as_ptr(node) as usize))
            .cloned()
            .unwrap_or_else(|| original.to_string())
    })
}

struct Out {
    buf: String,
    last: String,
    might_need_semicolon: bool,
    might_need_space: bool,
    need_space: bool,
    has_parens: bool,
    in_directive: bool,
    printed_lists: HashSet<u32>,
    printed_comments: HashSet<u32>,
    comments: bool,
    /// Scope node whose body is inside `use asm`, if any.
    use_asm: Option<usize>,
    active_scope: Option<usize>,
    stack: Vec<N>,
}

impl Out {
    fn new() -> Self {
        Self {
            buf: String::new(),
            last: String::new(),
            might_need_semicolon: false,
            might_need_space: false,
            need_space: false,
            has_parens: false,
            in_directive: false,
            printed_lists: HashSet::new(),
            printed_comments: HashSet::new(),
            comments: true,
            use_asm: None,
            active_scope: None,
            stack: Vec::new(),
        }
    }

    fn parent(&self, n: usize) -> Option<&N> {
        self.stack.len().checked_sub(2 + n).map(|i| &self.stack[i])
    }

    fn print_node(&mut self, node: &N, force: bool) {
        self.stack.push(Rc::clone(node));
        let ptr = Rc::as_ptr(node) as usize;
        let is_scope = matches!(
            node.data,
            Data::Toplevel { .. } | Data::Func { .. } | Data::Class { .. } | Data::StaticBlock { .. }
        );
        let prev_scope = self.active_scope;
        if is_scope {
            self.active_scope = Some(ptr);
        }
        let parens = force || needs_parens(self, node);
        if parens {
            self.print("(");
            self.emit(node);
            self.print(")");
        } else {
            self.emit(node);
        }
        if self.use_asm == Some(ptr) {
            self.use_asm = None;
        }
        if is_scope {
            self.active_scope = prev_scope;
        }
        self.stack.pop();
    }

    fn emit(&mut self, node: &N) {
        let was_directive = self.in_directive;
        if matches!(node.data, Data::Directive { .. }) {
            // keep
        }
        self.prepend_comments(node);
        self.codegen(node);
        self.append_comments(node);
        let _ = was_directive;
    }

    fn codegen(&mut self, node: &N) {
        match &node.data {
            Data::Toplevel { body } => self.display_body(body, true, true),
            Data::Directive { value, quote, units } => {
                if value == "use asm" && self.use_asm.is_none() {
                    self.use_asm = self.active_scope;
                }
                self.print_js(value, units.as_deref(), Some(*quote), false);
                self.semicolon();
            }
            Data::Simple { body } => {
                let escape = self.in_directive;
                if let Data::String { value, quote, units } = &body.data {
                    self.print_js(value, units.as_deref(), Some(*quote), escape);
                } else {
                    self.print_node(body, false);
                }
                self.semicolon();
            }
            Data::Empty => self.semicolon(),
            Data::Block { body } => self.print_braced_stmts(body, false),
            Data::Labeled { label, body } => {
                self.print_node(label, false);
                self.colon();
                self.print_node(body, false);
            }
            Data::Debugger => {
                self.print("debugger");
                self.semicolon();
            }
            Data::Do { body, cond } => {
                self.print("do");
                self.space();
                self.make_block(body);
                self.space();
                self.print("while");
                self.space();
                self.print("(");
                self.print_node(cond, false);
                self.print(")");
                self.semicolon();
            }
            Data::While { cond, body } => {
                self.print("while");
                self.space();
                self.print("(");
                self.print_node(cond, false);
                self.print(")");
                self.space();
                self.print_body_stmt(body);
            }
            Data::For { init, cond, step, body } => {
                self.print("for");
                self.space();
                self.print("(");
                if let Some(init) = init {
                    if is_defs(init) {
                        self.print_node(init, false);
                    } else {
                        let force = contains_in(init);
                        self.print_node(init, force);
                    }
                    self.print(";");
                    self.space();
                } else {
                    self.print(";");
                }
                if let Some(cond) = cond {
                    self.print_node(cond, false);
                    self.print(";");
                    self.space();
                } else {
                    self.print(";");
                }
                if let Some(step) = step {
                    self.print_node(step, false);
                }
                self.print(")");
                self.space();
                self.print_body_stmt(body);
            }
            Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
                let await_ = matches!(&node.data, Data::ForOf { await_: true, .. });
                let kw = if matches!(node.data, Data::ForOf { .. }) { "of" } else { "in" };
                self.print("for");
                if await_ {
                    self.space();
                    self.print("await");
                }
                self.space();
                self.print("(");
                self.print_node(init, false);
                self.space();
                self.print(kw);
                self.space();
                self.print_node(object, false);
                self.print(")");
                self.space();
                self.print_body_stmt(body);
            }
            Data::With { expr, body } => {
                self.print("with");
                self.space();
                self.print("(");
                self.print_node(expr, false);
                self.print(")");
                self.space();
                self.print_body_stmt(body);
            }
            Data::If { cond, body, alt } => {
                self.print("if");
                self.space();
                self.print("(");
                self.print_node(cond, false);
                self.print(")");
                self.space();
                if let Some(alt) = alt {
                    self.make_then(body);
                    self.space();
                    self.print("else");
                    self.space();
                    if matches!(alt.data, Data::If { .. }) {
                        self.print_node(alt, false);
                    } else {
                        self.print_maybe_braced(alt);
                    }
                } else {
                    self.print_body_stmt(body);
                }
            }
            Data::Switch { expr, body } => {
                self.print("switch");
                self.space();
                self.print("(");
                self.print_node(expr, false);
                self.print(")");
                self.space();
                if body.is_empty() {
                    self.print("{}");
                } else {
                    self.print("{");
                    for (i, branch) in body.iter().enumerate() {
                        self.print_node(branch, false);
                        let has_body = match &branch.data {
                            Data::Case { body, .. } | Data::Default { body } => !body.is_empty(),
                            _ => false,
                        };
                        if i + 1 < body.len() && has_body {
                            // newline is a no-op when beautify is off
                        }
                    }
                    self.print("}");
                }
            }
            Data::Case { expr, body } => {
                self.print("case");
                self.space();
                self.print_node(expr, false);
                self.print(":");
                self.print_switch_body(body);
            }
            Data::Default { body } => {
                self.print("default:");
                self.print_switch_body(body);
            }
            Data::Try { body, catch, finally } => {
                self.print("try");
                self.space();
                self.print_node(body, false);
                if let Some(c) = catch {
                    self.space();
                    self.print_node(c, false);
                }
                if let Some(f) = finally {
                    self.space();
                    self.print_node(f, false);
                }
            }
            Data::Catch { arg, body } => {
                self.print("catch");
                if let Some(arg) = arg {
                    self.space();
                    self.print("(");
                    self.print_node(arg, false);
                    self.print(")");
                }
                self.space();
                self.print_braced_node(body);
            }
            Data::Finally { body } => {
                self.print("finally");
                self.space();
                self.print_braced_node(body);
            }
            Data::Defs { kind, defs, await_ } => {
                let kw = match kind {
                    DefKind::Var => "var",
                    DefKind::Let => "let",
                    DefKind::Const => "const",
                    DefKind::Using => {
                        if *await_ {
                            "await using"
                        } else {
                            "using"
                        }
                    }
                };
                self.print(kw);
                self.space();
                for (i, def) in defs.iter().enumerate() {
                    if i > 0 {
                        self.comma();
                    }
                    self.print_node(def, false);
                }
                let in_for_init = self.parent(0).is_some_and(|p| match &p.data {
                    Data::For { init: Some(init), .. }
                    | Data::ForIn { init, .. }
                    | Data::ForOf { init, .. } => Rc::ptr_eq(init, node),
                    _ => false,
                });
                if !in_for_init {
                    self.semicolon();
                }
            }
            Data::VarDef { name, value } => {
                self.print_node(name, false);
                if let Some(value) = value {
                    self.space();
                    self.print("=");
                    self.space();
                    let noin = self.parent(1).is_some_and(|p| {
                        matches!(p.data, Data::For { .. } | Data::ForIn { .. } | Data::ForOf { .. })
                    });
                    self.print_node(value, noin && contains_in(value));
                }
            }
            Data::Func { kind, name, args, body, async_, generator } => {
                if *kind == FuncKind::Arrow {
                    self.print_arrow(node);
                } else {
                    // Methods pass `nokeyword` into `print_func` directly. Nested
                    // declarations inside a method still need the keyword.
                    let nokeyword = *kind == FuncKind::Accessor;
                    self.print_func(*async_, *generator, name.as_ref(), args, body, nokeyword);
                }
            }
            Data::Class { name, extends, props, .. } => {
                self.print("class");
                self.space();
                if let Some(name) = name {
                    self.print_node(name, false);
                    self.space();
                }
                if let Some(ext) = extends {
                    let parens = !matches!(
                        ext.data,
                        Data::Symbol { .. }
                            | Data::Dot { .. }
                            | Data::Sub { .. }
                            | Data::Class { stmt: false, .. }
                            | Data::Func { kind: FuncKind::Expr | FuncKind::Arrow, .. }
                    );
                    self.print("extends");
                    if parens {
                        self.print("(");
                    } else {
                        self.space();
                    }
                    self.print_node(ext, false);
                    if parens {
                        self.print(")");
                    } else {
                        self.space();
                    }
                }
                if props.is_empty() {
                    self.print("{}");
                } else {
                    self.print("{");
                    for prop in props {
                        self.print_node(prop, false);
                    }
                    self.print("}");
                }
            }
            Data::Return { value } => {
                self.print("return");
                self.print_exit_value(value.as_ref());
                self.semicolon();
            }
            Data::Throw { value } => {
                self.print("throw");
                self.print_exit_value(Some(value));
                self.semicolon();
            }
            Data::Break { label } | Data::Continue { label } => {
                let kw = if matches!(node.data, Data::Break { .. }) { "break" } else { "continue" };
                self.print(kw);
                if let Some(label) = label {
                    self.space();
                    self.print_node(label, false);
                }
                self.semicolon();
            }
            Data::Import { phase, imported_name, imported_names, module_name, attributes } => {
                self.print("import");
                self.space();
                if let Some(phase) = phase {
                    self.print(phase);
                    self.space();
                }
                if let Some(n) = imported_name {
                    self.print_node(n, false);
                }
                if imported_name.is_some() && imported_names.is_some() {
                    self.print(",");
                    self.space();
                }
                if let Some(names) = imported_names {
                    self.print_import_names(names);
                }
                if imported_name.is_some() || imported_names.is_some() {
                    self.space();
                    self.print("from");
                    self.space();
                }
                self.print_node(module_name, false);
                if let Some(attr) = attributes {
                    self.print("with");
                    self.print_node(attr, false);
                }
                self.semicolon();
            }
            Data::Export { is_default, names, value, definition, module_name, attributes } => {
                self.print("export");
                self.space();
                if *is_default {
                    self.print("default");
                    self.space();
                }
                if let Some(names) = names {
                    self.print_export_names(names);
                } else if let Some(value) = value {
                    self.print_node(value, false);
                } else if let Some(def) = definition {
                    self.print_node(def, false);
                    if is_defs(def) {
                        if let Some(attr) = attributes {
                            self.print("with");
                            self.print_node(attr, false);
                        }
                        return;
                    }
                }
                if let Some(m) = module_name {
                    self.space();
                    self.print("from");
                    self.space();
                    self.print_node(m, false);
                }
                if let Some(attr) = attributes {
                    self.print("with");
                    self.print_node(attr, false);
                }
                let semi = value.as_ref().is_some_and(|v| {
                    !matches!(
                        v.data,
                        Data::Func { kind: FuncKind::Decl | FuncKind::Expr, .. } | Data::Class { .. }
                    )
                }) || module_name.is_some()
                    || names.is_some();
                if semi {
                    self.semicolon();
                }
            }
            Data::NameMap { foreign, name } => self.print_name_map(node, foreign, name),
            Data::Symbol { name, quote, kind } => {
                let shown = if *kind == SymKind::Private {
                    mapped_private(name)
                } else {
                    mapped_name(node, name)
                };
                if let Some(q) = quote {
                    self.print_string(&shown, Some(*q), false);
                } else {
                    if *kind == SymKind::Private {
                        self.print("#");
                    }
                    self.print_name(&shown);
                }
            }
            Data::This => self.print("this"),
            Data::Super => self.print("super"),
            Data::NewTarget => self.print("new.target"),
            Data::Null => self.print("null"),
            Data::True => self.print("true"),
            Data::False => self.print("false"),
            Data::Infinity => self.print("Infinity"),
            Data::Number { value, raw } => {
                if self.use_asm.is_some() && !raw.is_empty() {
                    self.print(raw);
                } else {
                    self.print(&make_num(*value));
                }
            }
            Data::BigInt { value } => {
                self.print(value);
                self.print("n");
            }
            Data::String { value, quote, units } => self.print_js(value, units.as_deref(), Some(*quote), self.in_directive),
            Data::RegExp { source, flags } => self.print_regexp(node, source, flags),
            Data::Array { elements } => {
                self.print("[");
                let len = elements.len();
                if len > 0 {
                    self.space();
                }
                for (i, el) in elements.iter().enumerate() {
                    if i > 0 {
                        self.comma();
                    }
                    self.print_node(el, false);
                    if i + 1 == len && matches!(el.data, Data::Hole) {
                        self.comma();
                    }
                }
                if len > 0 {
                    self.space();
                }
                self.print("]");
            }
            Data::Hole => {}
            Data::Object { props } => {
                if props.is_empty() {
                    self.print("{}");
                } else {
                    self.print("{");
                    for (i, prop) in props.iter().enumerate() {
                        if i > 0 {
                            self.print(",");
                        }
                        self.print_node(prop, false);
                    }
                    self.print("}");
                }
            }
            Data::Prop { method, key, value, static_, private, generator, async_ } => {
                self.print_prop(node, *method, key, value, *static_, *private, *generator, *async_);
            }
            Data::Field { key, value, static_, private } => {
                if *static_ {
                    self.print("static");
                    self.space();
                }
                match key {
                    Key::Private(name) | Key::Static { name, .. } if *private => {
                        self.print("#");
                        self.print_prop_name(&mapped_private(name), None);
                    }
                    Key::Static { name, quote } => {
                        self.print_prop_name(name, *quote);
                    }
                    Key::Computed(expr) => {
                        self.print("[");
                        self.print_node(expr, false);
                        self.print("]");
                    }
                    Key::Private(name) => {
                        self.print("#");
                        self.print_prop_name(&mapped_private(name), None);
                    }
                }
                if let Some(value) = value {
                    self.print("=");
                    self.print_node(value, false);
                }
                self.semicolon();
            }
            Data::StaticBlock { body } => {
                self.print("static");
                self.space();
                self.print_braced_stmts(body, false);
            }
            Data::Spread { expr } => {
                self.print("...");
                self.print_node(expr, false);
            }
            Data::Destructuring { array, names } => {
                self.print(if *array { "[" } else { "{" });
                let len = names.len();
                for (i, name) in names.iter().enumerate() {
                    if i > 0 {
                        self.comma();
                    }
                    self.print_node(name, false);
                    if i + 1 == len && matches!(name.data, Data::Hole) {
                        self.comma();
                    }
                }
                self.print(if *array { "]" } else { "}" });
            }
            Data::Seq { exprs } => {
                for (i, e) in exprs.iter().enumerate() {
                    if i > 0 {
                        self.comma();
                    }
                    self.print_node(e, false);
                }
            }
            Data::Dot { expr, prop, optional, private, .. } => {
                self.print_node(expr, false);
                if *private {
                    if *optional {
                        self.print("?");
                    }
                    self.print(".#");
                    self.print_name(&mapped_private(prop));
                } else {
                    let computed = if is_reserved(prop) {
                        false
                    } else {
                        !is_ident_string(prop)
                    };
                    if *optional {
                        self.print("?.");
                    }
                    if computed {
                        self.print("[");
                        self.print_string(prop, None, false);
                        self.print("]");
                    } else {
                        if let Data::Number { value, .. } = &expr.data {
                            if *value >= 0.0 && !self.last_num_dot() {
                                self.print(".");
                            }
                        }
                        if !*optional {
                            self.print(".");
                        }
                        self.print_name(prop);
                    }
                }
            }
            Data::Sub { expr, prop, optional } => {
                self.print_node(expr, false);
                if *optional {
                    self.print("?.");
                }
                self.print("[");
                self.print_node(prop, false);
                self.print("]");
            }
            Data::Chain { expr } => self.print_node(expr, false),
            Data::Call { expr, args, optional, is_new } => {
                if *is_new {
                    self.print("new");
                    self.space();
                }
                self.print_node(expr, false);
                if *is_new && args.is_empty() {
                    return;
                }
                if *optional {
                    self.print("?.");
                }
                self.print("(");
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 {
                        self.comma();
                    }
                    self.print_node(arg, false);
                }
                self.print(")");
            }
            Data::Unary { op, expr, prefix } => {
                if *prefix {
                    if op == "--" && self.last.ends_with('!') {
                        self.print(" ");
                    }
                    self.print(op);
                    if op.chars().next().is_some_and(|c| c.is_ascii_alphabetic())
                        || (op.ends_with(['+', '-'])
                            && matches!(&expr.data, Data::Unary { op: inner, prefix: true, .. } if inner.starts_with(['+', '-'])))
                    {
                        self.space();
                    }
                    self.print_node(expr, false);
                } else {
                    self.print_node(expr, false);
                    self.print(op);
                }
            }
            Data::Binary { op, left, right } => {
                self.print_node(left, false);
                if op.starts_with('>') && self.last.ends_with("--") {
                    self.print(" ");
                } else {
                    self.space();
                }
                self.print(op);
                self.space();
                self.print_node(right, false);
            }
            Data::DefaultAssign { left, right } => {
                self.print_node(left, false);
                self.space();
                self.print("=");
                self.space();
                self.print_node(right, false);
            }
            Data::Assign { op, left, right, .. } => {
                self.print_node(left, false);
                if op.starts_with('>') && self.last.ends_with("--") {
                    self.print(" ");
                } else {
                    self.space();
                }
                self.print(op);
                self.space();
                self.print_node(right, false);
            }
            Data::Cond { cond, cons, alt } => {
                self.print_node(cond, false);
                self.space();
                self.print("?");
                self.space();
                self.print_node(cons, false);
                self.space();
                self.colon();
                self.print_node(alt, false);
            }
            Data::Await { expr } => {
                self.print("await");
                self.space();
                let parens = !matches!(
                    expr.data,
                    Data::Call { .. }
                        | Data::Symbol { .. }
                        | Data::Dot { .. }
                        | Data::Sub { .. }
                        | Data::Unary { .. }
                        | Data::Null
                        | Data::True
                        | Data::False
                        | Data::Infinity
                        | Data::Number { .. }
                        | Data::BigInt { .. }
                        | Data::String { .. }
                        | Data::RegExp { .. }
                        | Data::Await { .. }
                        | Data::Object { .. }
                );
                if parens {
                    self.print("(");
                }
                self.print_node(expr, false);
                if parens {
                    self.print(")");
                }
            }
            Data::Yield { expr, star } => {
                self.print(if *star { "yield*" } else { "yield" });
                if let Some(expr) = expr {
                    self.space();
                    self.print_node(expr, false);
                }
            }
            Data::Template { segments } => self.print_template(node, segments, false),
            Data::TaggedTemplate { tag, template } => {
                let paren = tag_needs_paren(tag);
                if paren {
                    self.print("(");
                }
                self.print_node(tag, false);
                if paren {
                    self.print(")");
                }
                self.print_node(template, false);
            }
            Data::ImportMeta => self.print("import.meta"),
            Data::DynImport { args, phase } => {
                if let Some(phase) = phase {
                    self.print("import.");
                    self.print(phase);
                } else {
                    self.print("import");
                }
                self.print("(");
                for (i, arg) in args.iter().enumerate() {
                    if i > 0 {
                        self.comma();
                    }
                    self.print_node(arg, false);
                }
                self.print(")");
            }
            Data::PrivateIn { key, value } => {
                self.print_node(key, false);
                self.space();
                self.print("in");
                self.space();
                self.print_node(value, false);
            }
        }
    }

    fn print_exit_value(&mut self, value: Option<&N>) {
        let Some(value) = value else { return };
        self.space();
        let comments = value.start.as_ref().map(|t| t.comments_id);
        let pending = comments.is_some_and(|id| !self.printed_lists.contains(&id) && value.start.as_ref().is_some_and(|t| !t.comments_before.is_empty()));
        if pending {
            self.print("(");
            self.print_node(value, false);
            self.print(")");
        } else {
            self.print_node(value, false);
        }
    }

    fn print_arrow(&mut self, node: &N) {
        let Data::Func { name: _, args, body, async_, .. } = &node.data else { return };
        let needs = self.parent(0).is_some_and(|p| {
            match &p.data {
                Data::Binary { .. } | Data::Unary { .. } => true,
                Data::Call { expr, is_new: false, .. } => Rc::ptr_eq(expr, node),
                Data::Assign { .. } | Data::DefaultAssign { .. } => false,
                _ => false,
            }
        });
        // Assign is Binary in terser and is excluded. DefaultAssign is Binary and is NOT excluded
        // from the arrow paren check (`!(parent instanceof AST_DefaultAssign)` is only with the
        // binary check that already excludes Assign). DefaultAssign still needs parens.
        let needs = needs
            || self.parent(0).is_some_and(|p| {
                matches!(p.data, Data::DefaultAssign { .. })
                    || matches!(&p.data, Data::Call { expr, .. } if Rc::ptr_eq(expr, node))
            });
        if needs {
            self.print("(");
        }
        if *async_ {
            self.print("async");
            self.space();
        }
        if args.len() == 1 && matches!(args[0].data, Data::Symbol { .. }) {
            self.print_node(&args[0], false);
        } else {
            self.print("(");
            for (i, arg) in args.iter().enumerate() {
                if i > 0 {
                    self.comma();
                }
                self.print_node(arg, false);
            }
            self.print(")");
        }
        self.space();
        self.print("=>");
        self.space();
        if body.len() == 1 {
            if let Data::Return { value } = &body[0].data {
                match value {
                    None => self.print("{}"),
                    Some(ret) if left_is_object(ret) => {
                        self.print("(");
                        self.print_node(ret, false);
                        self.print(")");
                    }
                    Some(ret) => self.print_node(ret, false),
                }
            } else {
                self.print_braced_stmts(body, false);
            }
        } else {
            self.print_braced_stmts(body, false);
        }
        if needs {
            self.print(")");
        }
    }

    fn print_func(&mut self, async_: bool, generator: bool, name: Option<&N>, args: &[N], body: &[N], nokeyword: bool) {
        if !nokeyword {
            if async_ {
                self.print("async");
                self.space();
            }
            self.print("function");
            if generator {
                self.print("*");
            }
            if name.is_some() {
                self.space();
            }
        }
        if let Some(name) = name {
            if matches!(name.data, Data::Symbol { .. } | Data::This | Data::Super) || !nokeyword {
                if matches!(name.data, Data::Symbol { .. }) || !nokeyword {
                    self.print_node(name, false);
                }
            } else {
                self.print("[");
                self.print_node(name, false);
                self.print("]");
            }
        }
        self.print("(");
        for (i, arg) in args.iter().enumerate() {
            if i > 0 {
                self.comma();
            }
            self.print_node(arg, false);
        }
        self.print(")");
        self.space();
        self.print_braced_stmts(body, true);
    }

    fn print_prop(&mut self, node: &N, method: Option<MethodKind>, key: &Key, value: &N, static_: bool, private: bool, generator: bool, async_: bool) {
        let _ = node;
        if method.is_some() || matches!(value.data, Data::Func { kind: FuncKind::Accessor, .. }) {
            if static_ {
                self.print("static");
                self.space();
            }
            let ty = match method {
                Some(MethodKind::Get) => Some("get"),
                Some(MethodKind::Set) => Some("set"),
                Some(MethodKind::Method) | None => {
                    if generator && async_ {
                        Some("async*")
                    } else if generator {
                        Some("*")
                    } else if async_ {
                        Some("async")
                    } else {
                        None
                    }
                }
            };
            if let Some(ty) = ty {
                if ty != "*" {
                    self.print(ty);
                    self.space();
                } else {
                    self.print("*");
                }
            }
            if private {
                self.print("#");
            }
            match key {
                Key::Static { name, quote } => self.print_prop_name(name, *quote),
                Key::Private(name) => self.print_prop_name(&mapped_private(name), None),
                Key::Computed(expr) => {
                    self.print("[");
                    self.print_node(expr, false);
                    self.print("]");
                }
            }
            if let Data::Func { async_, generator, name, args, body, .. } = &value.data {
                self.print_func(*async_, *generator, name.as_ref(), args, body, true);
            } else {
                self.print_node(value, false);
            }
            return;
        }
        // key : value, with shorthand off
        match key {
            Key::Static { name, quote } => self.print_prop_name(name, *quote),
            Key::Private(name) => {
                self.print("#");
                self.print_name(&mapped_private(name));
            }
            Key::Computed(expr) => {
                self.print("[");
                self.print_node(expr, false);
                self.print("]");
            }
        }
        self.colon();
        self.print_node(value, false);
    }

    fn print_prop_name(&mut self, key: &str, quote: Option<char>) {
        if let Some(num) = numeric_key(key) {
            self.print(&make_num(num));
            return;
        }
        if is_reserved(key) {
            self.print_name(key);
            return;
        }
        if !is_basic_identifier(key) {
            self.print_string(key, quote, false);
            return;
        }
        self.print_name(key);
    }

    fn print_import_names(&mut self, names: &[N]) {
        if names.len() == 1 && is_star_name(&names[0], true) {
            self.print_node(&names[0], false);
            return;
        }
        self.print("{");
        for (i, name) in names.iter().enumerate() {
            self.space();
            self.print_node(name, false);
            if i + 1 < names.len() {
                self.print(",");
            }
        }
        self.space();
        self.print("}");
    }

    fn print_export_names(&mut self, names: &[N]) {
        if names.len() == 1 && is_star_name(&names[0], false) {
            self.print_node(&names[0], false);
            return;
        }
        self.print("{");
        for (i, name) in names.iter().enumerate() {
            self.space();
            self.print_node(name, false);
            if i + 1 < names.len() {
                self.print(",");
            }
        }
        self.space();
        self.print("}");
    }

    fn print_name_map(&mut self, node: &N, foreign: &N, name: &N) {
        let _ = node;
        let is_import = self.parent(0).is_some_and(|p| matches!(p.data, Data::Import { .. }));
        let (fname, fquote) = sym_info(foreign);
        let (nname, nquote) = sym_info(name);
        let mut differ = fname != nname;
        if !differ && fname == "*" && fquote.is_some() != nquote.is_some() {
            differ = true;
        }
        let foreign_is_name = fquote.is_none();
        if differ {
            if is_import {
                self.print_mapped(fname, fquote, foreign_is_name);
            } else if nquote.is_none() {
                self.print_node(name, false);
            } else {
                self.print_string(nname, nquote, false);
            }
            self.space();
            self.print("as");
            self.space();
            if is_import {
                self.print_node(name, false);
            } else {
                self.print_mapped(fname, fquote, foreign_is_name);
            }
        } else if nquote.is_none() {
            self.print_node(name, false);
        } else {
            self.print_string(nname, nquote, false);
        }
    }

    fn print_mapped(&mut self, name: &str, quote: Option<char>, is_name: bool) {
        if is_name {
            self.print(name);
        } else {
            self.print_string(name, quote, false);
        }
    }

    fn print_template(&mut self, node: &N, segments: &[ast::Seg], _tagged_parent: bool) {
        let tagged = self.parent(0).is_some_and(|p| matches!(&p.data, Data::TaggedTemplate { template, .. } if Rc::ptr_eq(template, node)));
        self.print("`");
        for seg in segments {
            match seg {
                ast::Seg::Cooked { value, raw, units } => {
                    if tagged {
                        self.print(raw);
                    } else {
                        self.print_template_chars(value, units.as_deref());
                    }
                }
                ast::Seg::Expr(e) => {
                    self.print("${");
                    self.print_node(e, false);
                    self.print("}");
                }
            }
        }
        self.print("`");
    }

    fn print_template_chars(&mut self, s: &str, units: Option<&[u16]>) {
        let encoded = match units {
            Some(units) => encode_units(units, Some('`')),
            None => encode_string(s, Some('`')),
        };
        let inner = if encoded.starts_with('`') && encoded.ends_with('`') && encoded.len() >= 2 {
            encoded[1..encoded.len() - 1].replace("${", "\\${")
        } else {
            encoded.replace("${", "\\${")
        };
        self.print(&inner);
    }

    fn print_regexp(&mut self, node: &N, source: &str, flags: &str) {
        let source = regexp_source_fix(source);
        let flags = sort_flags(flags);
        let source = slash_script(&source);
        if source.trim_start().to_ascii_lowercase().starts_with("script") && self.last.ends_with('<') {
            self.print(" ");
        }
        self.print("/");
        self.print(&source);
        self.print("/");
        self.print(&flags);
        if self.parent(0).is_some_and(|p| match &p.data {
            Data::Binary { op, left, .. } => op.starts_with(|c: char| c.is_ascii_alphanumeric()) && Rc::ptr_eq(left, node),
            _ => false,
        }) {
            self.print(" ");
        }
    }

    fn print_switch_body(&mut self, body: &[N]) {
        for stmt in body {
            self.print_node(stmt, false);
        }
    }

    fn print_braced_stmts(&mut self, body: &[N], allow_directives: bool) {
        if body.is_empty() {
            self.print("{}");
            return;
        }
        self.print("{");
        self.display_body(body, false, allow_directives);
        self.print("}");
    }

    fn print_braced_node(&mut self, node: &N) {
        self.print_node(node, false);
    }

    fn display_body(&mut self, body: &[N], toplevel: bool, allow_directives: bool) {
        let last = body.len().saturating_sub(1);
        self.in_directive = allow_directives;
        for (i, stmt) in body.iter().enumerate() {
            if self.in_directive
                && !matches!(stmt.data, Data::Directive { .. } | Data::Empty)
                && !matches!(&stmt.data, Data::Simple { body } if matches!(body.data, Data::String { .. }))
            {
                self.in_directive = false;
            }
            if !matches!(stmt.data, Data::Empty) {
                self.print_node(stmt, false);
                if !(i == last && toplevel) {
                    // newline is a no-op
                }
            }
            if self.in_directive && matches!(&stmt.data, Data::Simple { body } if matches!(body.data, Data::String { .. })) {
                self.in_directive = false;
            }
        }
        self.in_directive = false;
    }

    fn print_body_stmt(&mut self, body: &N) {
        self.print_maybe_braced(body);
    }

    fn print_maybe_braced(&mut self, stat: &N) {
        if matches!(stat.data, Data::Empty) {
            self.force_semicolon();
        } else if (is_defs(stat) && !matches!(stat.data, Data::Defs { kind: DefKind::Var, .. }))
            || matches!(stat.data, Data::Class { stmt: true, .. })
        {
            self.make_block(stat);
        } else {
            self.print_node(stat, false);
        }
    }

    fn make_then(&mut self, body: &N) {
        let mut b = body;
        loop {
            if let Data::If { alt, .. } = &b.data {
                if alt.is_none() {
                    self.make_block(body);
                    return;
                }
                b = alt.as_ref().unwrap();
            } else if let Some(inner) = statement_body(b) {
                b = inner;
            } else {
                break;
            }
        }
        self.print_maybe_braced(body);
    }

    fn make_block(&mut self, stmt: &N) {
        if matches!(stmt.data, Data::Empty) {
            self.print("{}");
        } else if matches!(stmt.data, Data::Block { .. }) {
            self.print_node(stmt, false);
        } else {
            self.print("{");
            self.print_node(stmt, false);
            self.print("}");
        }
    }

    fn print(&mut self, s: &str) {
        let ch = first_unit(s);
        if self.need_space {
            self.need_space = false;
            if let Some(c) = ch {
                if !is_space_or_semi_closer(c) {
                    self.append(" ");
                }
            }
        }
        let prev = last_unit(&self.last);
        if self.might_need_semicolon {
            self.might_need_semicolon = false;
            let need = match (prev, ch) {
                (Some(':'), Some('}')) => true,
                _ => ch.map(|c| c != ';' && c != '}').unwrap_or(true) && prev != Some(';'),
            };
            if need {
                self.append(";");
                self.might_need_space = false;
            }
        }
        if self.might_need_space {
            let prev_c = last_unit(&self.last);
            if let (Some(p), Some(c)) = (prev_c, ch) {
                if (ident_unit(p) && (ident_unit(c) || c == '\\'))
                    || (c == '/' && c == p)
                    || ((c == '+' || c == '-') && self.last == c.to_string())
                {
                    self.append(" ");
                }
            }
            self.might_need_space = false;
        }
        self.append(s);
        self.has_parens = s.ends_with('(');
        self.last = s.to_string();
    }

    fn append(&mut self, s: &str) {
        self.buf.push_str(s);
    }

    fn space(&mut self) {
        self.might_need_space = true;
    }

    fn semicolon(&mut self) {
        self.might_need_semicolon = true;
    }

    fn force_semicolon(&mut self) {
        self.might_need_semicolon = false;
        self.print(";");
    }

    fn comma(&mut self) {
        self.print(",");
        self.space();
    }

    fn colon(&mut self) {
        self.print(":");
        self.space();
    }

    fn print_name(&mut self, name: &str) {
        self.print(name);
    }

    fn print_string(&mut self, s: &str, quote: Option<char>, escape_directive: bool) {
        self.print_js(s, None, quote, escape_directive);
    }

    fn print_js(&mut self, s: &str, units: Option<&[u16]>, quote: Option<char>, escape_directive: bool) {
        let encoded = match units {
            Some(units) => encode_units(units, quote),
            None => encode_string(s, quote),
        };
        if escape_directive && !encoded.contains('\\') {
            if !self.expect_directive() {
                self.force_semicolon();
            }
            self.force_semicolon();
        }
        self.print(&encoded);
    }

    fn expect_directive(&self) -> bool {
        let b = self.buf.as_bytes();
        if b.is_empty() {
            return true;
        }
        let mut n = b.len();
        while n > 0 {
            let c = b[n - 1];
            if c == b' ' || c == b'\n' {
                n -= 1;
                continue;
            }
            return c == b';' || c == b'{';
        }
        true
    }

    fn last_num_dot(&self) -> bool {
        self.last.chars().any(|c| matches!(c, 'x' | 'X' | 'a'..='f' | 'A'..='F' | '.' | ')'))
    }

    fn prepend_comments(&mut self, node: &N) {
        if !self.comments {
            return;
        }
        let Some(start) = node.start.as_ref() else { return };
        let list_id = start.comments_id;
        let keyword_value = exit_value(node).or_else(|| await_or_yield_expr(node));
        if self.printed_lists.contains(&list_id) {
            if keyword_value.is_none() {
                return;
            }
        }
        let mut comments = start.comments_before.clone();
        self.printed_lists.insert(list_id);
        if keyword_value.is_some() {
            if let Some(val) = keyword_value {
                hoist_comments(val, &mut comments, &mut self.printed_lists, &mut self.printed_comments);
            }
        }
        if self.buf.is_empty() {
            if self.buf.is_empty() {
                if let Some(first) = comments.first() {
                    if first.ty == "comment5" && !self.printed_comments.contains(&first.id) {
                        let shebang = comments.remove(0);
                        self.print("#!");
                        self.print(&shebang.value);
                        self.print("\n");
                        self.printed_comments.insert(shebang.id);
                    }
                }
            }
        }
        comments.retain(|c| keep_comment(c) && !self.printed_comments.contains(&c.id));
        if comments.is_empty() {
            return;
        }
        let mut last_nlb = has_nlb(&self.buf);
        for (i, c) in comments.iter().enumerate() {
            self.printed_comments.insert(c.id);
            if !last_nlb {
                if c.nlb {
                    self.print("\n");
                    last_nlb = true;
                } else if i > 0 {
                    self.space();
                }
            }
            if matches!(c.ty, "comment1" | "comment3" | "comment4") {
                let value = filter_comment(&c.value);
                if !value.is_empty() {
                    self.print("//");
                    self.print(&value);
                    self.print("\n");
                }
                last_nlb = true;
            } else if c.ty == "comment2" {
                let value = filter_comment(&c.value);
                if !value.is_empty() {
                    self.print("/*");
                    self.print(&value);
                    self.print("*/");
                }
                last_nlb = false;
            }
        }
        if !last_nlb {
            if start.nlb {
                self.print("\n");
            } else {
                self.space();
            }
        }
    }

    fn append_comments(&mut self, node: &N) {
        self.append_comments_tail(node, false);
    }

    fn append_comments_tail(&mut self, node: &N, tail: bool) {
        if !self.comments {
            return;
        }
        let Some(token) = node.end.as_ref() else { return };
        let (list_id, comments) = if tail {
            (token.comments_id, &token.comments_before)
        } else {
            (token.comments_after_id, &token.comments_after)
        };
        if comments.is_empty() || self.printed_lists.contains(&list_id) {
            return;
        }
        let statement = is_statement(node);
        if !statement && comments.iter().any(|c| matches!(c.ty, "comment1" | "comment3" | "comment4")) {
            return;
        }
        self.printed_lists.insert(list_id);
        let kept: Vec<_> = comments.iter().filter(|c| keep_comment(c) && !self.printed_comments.contains(&c.id)).cloned().collect();
        for (i, c) in kept.iter().enumerate() {
            self.printed_comments.insert(c.id);
            if c.nlb && (i > 0 || !has_nlb(&self.buf)) {
                self.print("\n");
            } else if i > 0 || !tail {
                self.space();
            }
            if matches!(c.ty, "comment1" | "comment3" | "comment4") {
                let value = filter_comment(&c.value);
                if !value.is_empty() {
                    self.print("//");
                    self.print(&value);
                }
            } else if c.ty == "comment2" {
                let value = filter_comment(&c.value);
                if !value.is_empty() {
                    self.print("/*");
                    self.print(&value);
                    self.print("*/");
                }
            }
        }
    }
}

fn quote_of(key: &Key) -> &Option<char> {
    match key {
        Key::Static { quote, .. } => quote,
        _ => {
            const NONE: Option<char> = None;
            &NONE
        }
    }
}

fn key_quote(key: &Key) -> Option<char> {
    match key {
        Key::Static { quote, .. } => *quote,
        _ => None,
    }
}

fn sym_info(n: &N) -> (&str, Option<char>) {
    match &n.data {
        Data::Symbol { name, quote, .. } => (name.as_str(), *quote),
        _ => ("", None),
    }
}

fn is_star_name(n: &N, import: bool) -> bool {
    let Data::NameMap { foreign, name } = &n.data else { return false };
    let (node, other) = if import { (foreign, name) } else { (name, foreign) };
    let _ = other;
    matches!(&node.data, Data::Symbol { name, quote: None, .. } if name == "*")
}

fn is_defs(n: &N) -> bool {
    matches!(n.data, Data::Defs { .. })
}

fn statement_body(n: &N) -> Option<&N> {
    match &n.data {
        Data::Labeled { body, .. }
        | Data::Do { body, .. }
        | Data::While { body, .. }
        | Data::For { body, .. }
        | Data::ForIn { body, .. }
        | Data::ForOf { body, .. }
        | Data::With { body, .. } => Some(body),
        _ => None,
    }
}

fn exit_value(n: &N) -> Option<&N> {
    match &n.data {
        Data::Return { value: Some(v) } | Data::Throw { value: v } => Some(v),
        _ => None,
    }
}

fn await_or_yield_expr(n: &N) -> Option<&N> {
    match &n.data {
        Data::Await { expr } | Data::Yield { expr: Some(expr), .. } => Some(expr),
        _ => None,
    }
}

fn hoist_comments(node: &N, into: &mut Vec<Comment>, lists: &mut HashSet<u32>, comments: &mut HashSet<u32>) {
    let mut cur = node;
    loop {
        if let Some(start) = cur.start.as_ref() {
            if !lists.contains(&start.comments_id) {
                lists.insert(start.comments_id);
                for c in &start.comments_before {
                    if !comments.contains(&c.id) {
                        into.push(c.clone());
                    }
                }
            }
        }
        let next = match &cur.data {
            Data::Binary { left, .. }
            | Data::Assign { left, .. }
            | Data::DefaultAssign { left, .. }
            | Data::Dot { expr: left, .. }
            | Data::Sub { expr: left, .. }
            | Data::Chain { expr: left }
            | Data::Unary { expr: left, prefix: false, .. }
            | Data::TaggedTemplate { tag: left, .. } => left,
            Data::Call { expr, .. } => expr,
            Data::Cond { cond, .. } => cond,
            Data::Seq { exprs } => match exprs.first() {
                Some(e) => e,
                None => break,
            },
            _ => break,
        };
        cur = next;
    }
}

fn keep_comment(c: &Comment) -> bool {
    if c.ty != "comment1" && c.ty != "comment2" {
        return false;
    }
    let lower = c.value.to_ascii_lowercase();
    if lower.contains("@preserve") || lower.contains("@copyright") || lower.contains("@lic") || lower.contains("@cc_on") {
        return true;
    }
    let b = c.value.as_bytes();
    let mut i = 0;
    while i < b.len() && b[i] == b'*' {
        i += 1;
    }
    i < b.len() && b[i] == b'!'
}

fn filter_comment(s: &str) -> String {
    let mut out = String::new();
    let b = s.as_bytes();
    let mut i = 0;
    while i < b.len() {
        if b[i] == b'@' || b[i] == b'#' {
            let rest = &s[i..];
            if rest.starts_with("@__PURE__") || rest.starts_with("#__PURE__")
                || rest.starts_with("@__INLINE__") || rest.starts_with("#__INLINE__")
                || rest.starts_with("@__NOINLINE__") || rest.starts_with("#__NOINLINE__")
            {
                let n = if rest.as_bytes().get(1) == Some(&b'_') { 0 } else { 0 };
                let _ = n;
                let len = if rest[1..].starts_with("__PURE__") { 9 } else if rest[1..].starts_with("__INLINE__") { 11 } else { 13 };
                out.push(' ');
                i += 1 + len;
                continue;
            }
        }
        let ch = s[i..].chars().next().unwrap();
        out.push(ch);
        i += ch.len_utf8();
    }
    if out.trim().is_empty() {
        return String::new();
    }
    out.replace("</script", "<\\/script").replace("</SCRIPT", "<\\/SCRIPT")
}

fn has_nlb(buf: &str) -> bool {
    let b = buf.as_bytes();
    let mut n = b.len();
    while n > 0 {
        let c = b[n - 1];
        if c == b'\n' {
            return true;
        }
        if c != b' ' {
            return false;
        }
        n -= 1;
    }
    true
}

fn first_unit(s: &str) -> Option<char> {
    s.chars().next()
}

fn last_unit(s: &str) -> Option<char> {
    s.chars().last()
}

fn ident_unit(c: char) -> bool {
    unicode_ident_start_or_cont(c) || c == '$' || c == '_' || c == '\u{200C}' || c == '\u{200D}'
}

fn unicode_ident_start_or_cont(c: char) -> bool {
    c.is_ascii_alphanumeric() || (!c.is_ascii() && (unicode_ident::is_xid_continue(c) || c == '\u{200C}' || c == '\u{200D}'))
}

fn is_space_or_semi_closer(c: char) -> bool {
    c.is_whitespace() || c == ';' || c == '}' || c == ')'
}

fn is_ident_string(s: &str) -> bool {
    if is_basic_identifier(s) {
        return true;
    }
    // Roundtrip ecma is 5, so a non-BMP character is not an identifier.
    if s.chars().any(|c| (c as u32) > 0xFFFF) {
        return false;
    }
    let mut chars = s.chars();
    let Some(first) = chars.next() else { return false };
    if !(unicode_ident::is_xid_start(first) || first == '$' || first == '_') {
        return false;
    }
    chars.all(|c| unicode_ident::is_xid_continue(c) || c == '$' || c == '\u{200C}' || c == '\u{200D}')
}

fn is_reserved(w: &str) -> bool {
    matches!(
        w,
        "break" | "case" | "catch" | "class" | "const" | "continue" | "debugger" | "default"
            | "delete" | "do" | "else" | "export" | "extends" | "finally" | "for" | "function"
            | "if" | "in" | "instanceof" | "let" | "new" | "return" | "switch" | "throw" | "try"
            | "typeof" | "var" | "void" | "while" | "with" | "enum" | "import" | "super" | "this"
            | "false" | "null" | "true" | "implements" | "interface" | "package" | "private"
            | "protected" | "public" | "static"
    )
}

fn tag_needs_paren(tag: &N) -> bool {
    match &tag.data {
        Data::Func { .. }
        | Data::Binary { .. }
        | Data::Assign { .. }
        | Data::DefaultAssign { .. }
        | Data::Cond { .. }
        | Data::Seq { .. }
        | Data::Unary { .. }
        | Data::Await { .. }
        | Data::Yield { .. } => true,
        Data::Dot { expr, .. } => matches!(expr.data, Data::Object { .. }),
        _ => false,
    }
}

fn left_is_object(node: &N) -> bool {
    match &node.data {
        Data::Object { .. } => true,
        Data::Seq { exprs } => exprs.first().is_some_and(left_is_object),
        Data::Call { expr, .. }
        | Data::TaggedTemplate { tag: expr, .. }
        | Data::Dot { expr, .. }
        | Data::Sub { expr, .. }
        | Data::Chain { expr }
        | Data::Unary { expr, prefix: false, .. } => left_is_object(expr),
        Data::Cond { cond, .. } => left_is_object(cond),
        Data::Binary { left, .. } | Data::Assign { left, .. } | Data::DefaultAssign { left, .. } => left_is_object(left),
        _ => false,
    }
}

fn contains_in(node: &N) -> bool {
    match &node.data {
        Data::Func { kind: FuncKind::Arrow, body, .. } => body.iter().any(contains_in),
        Data::Func { .. } | Data::Class { .. } | Data::StaticBlock { .. } => false,
        Data::Binary { op, left, right } if op == "in" => true || contains_in(left) || contains_in(right),
        Data::Binary { op, .. } if op == "in" => true,
        Data::PrivateIn { .. } => true,
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } | Data::DefaultAssign { left, right } => {
            contains_in(left) || contains_in(right)
        }
        Data::Cond { cond, cons, alt } => contains_in(cond) || contains_in(cons) || contains_in(alt),
        Data::Unary { expr, .. } | Data::Await { expr } | Data::Spread { expr } | Data::Chain { expr } => contains_in(expr),
        Data::Yield { expr, .. } => expr.as_ref().is_some_and(|e| contains_in(e)),
        Data::Return { value } => value.as_ref().is_some_and(|e| contains_in(e)),
        Data::Simple { body } | Data::Throw { value: body } => contains_in(body),
        Data::Return { value } => value.as_ref().is_some_and(|e| contains_in(e)),
        Data::Throw { value } => contains_in(value),
        Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().any(contains_in),
        Data::Object { props } => props.iter().any(contains_in),
        Data::Call { expr, args, .. } => contains_in(expr) || args.iter().any(contains_in),
        Data::Dot { expr, .. } | Data::Sub { expr, .. } => contains_in(expr) || matches!(&node.data, Data::Sub { prop, .. } if contains_in(prop)),
        Data::Template { segments } => segments.iter().any(|s| matches!(s, ast::Seg::Expr(e) if contains_in(e))),
        _ => false,
    }
}

fn needs_parens(out: &Out, node: &N) -> bool {
    let Some(p) = out.parent(0) else { return false };
    match &node.data {
        Data::Func { kind: FuncKind::Expr, .. } => {
            if !out.has_parens && first_in_statement(out) {
                return true;
            }
            false
        }
        Data::Func { kind: FuncKind::Arrow, .. } => match &p.data {
            Data::Dot { expr, .. } | Data::Sub { expr, .. } if Rc::ptr_eq(expr, node) => true,
            Data::Cond { cond, .. } if Rc::ptr_eq(cond, node) => true,
            _ => false,
        },
        Data::Object { .. } => !out.has_parens && first_in_statement(out),
        Data::Class { stmt: false, .. } => first_in_statement(out),
        Data::Unary { op, prefix, .. } => match &p.data {
            Data::Dot { expr, .. } | Data::Sub { expr, .. } | Data::Call { expr, .. } if Rc::ptr_eq(expr, node) => true,
            Data::Binary { op: pop, left, .. } if pop == "**" && *prefix && Rc::ptr_eq(left, node) && op != "++" && op != "--" => true,
            _ => false,
        },
        Data::Await { .. } => match &p.data {
            Data::Dot { expr, .. } | Data::Sub { expr, .. } | Data::Call { expr, .. } if Rc::ptr_eq(expr, node) => true,
            Data::Binary { op, left, .. } if op == "**" && Rc::ptr_eq(left, node) => true,
            _ => false,
        },
        Data::Seq { .. } => matches!(
            p.data,
            Data::Call { .. }
                | Data::Unary { .. }
                | Data::Binary { .. }
                | Data::Assign { .. }
                | Data::VarDef { .. }
                | Data::Array { .. }
                | Data::Prop { .. }
                | Data::Field { .. }
                | Data::Cond { .. }
                | Data::Func { kind: FuncKind::Arrow, .. }
                | Data::DefaultAssign { .. }
                | Data::Spread { .. }
                | Data::Yield { .. }
                | Data::Export { .. }
                | Data::Field { .. }
        ) || matches!(&p.data, Data::Dot { expr, .. } | Data::Sub { expr, .. } if !Rc::ptr_eq(expr, node).then_some(false).unwrap_or(true) && !is_prop_property(p, node))
            || matches!(&p.data, Data::ForOf { object, .. } if Rc::ptr_eq(object, node)),
        Data::Binary { op, .. } => binary_needs_parens(p, node, op),
        Data::DefaultAssign { .. } => binary_needs_parens(p, node, "="),
        Data::PrivateIn { .. } => private_in_parens(p, node),
        Data::Yield { .. } => match &p.data {
            Data::Binary { op, .. } if op != "=" => true,
            Data::Assign { .. } => false,
            Data::Call { expr, .. } if Rc::ptr_eq(expr, node) => true,
            Data::Cond { cond, .. } if Rc::ptr_eq(cond, node) => true,
            Data::Unary { .. } => true,
            Data::Dot { expr, .. } | Data::Sub { expr, .. } if Rc::ptr_eq(expr, node) => true,
            _ => false,
        },
        Data::Chain { .. } => match &p.data {
            Data::Call { expr, .. } | Data::Dot { expr, .. } | Data::Sub { expr, .. } if Rc::ptr_eq(expr, node) => true,
            _ => false,
        },
        Data::Dot { .. } | Data::Sub { .. } => {
            if let Data::Call { expr, is_new: true, .. } = &p.data {
                if Rc::ptr_eq(expr, node) && contains_call(node) {
                    return true;
                }
            }
            false
        }
        Data::TaggedTemplate { .. } => matches!(&p.data, Data::Call { expr, is_new: true, .. } if Rc::ptr_eq(expr, node)),
        Data::Call { expr, args, is_new, .. } => {
            if !*is_new {
                if let Data::Func { .. } = &expr.data {
                    if let Some(p1) = out.parent(1) {
                        if matches!(&p.data, Data::Dot { expr: dexpr, .. } | Data::Sub { expr: dexpr, .. } if Rc::ptr_eq(dexpr, node))
                            && matches!(&p1.data, Data::Assign { left, .. } if Rc::ptr_eq(left, p))
                        {
                            return true;
                        }
                    }
                }
            }
            if *is_new {
                if args.is_empty() {
                    return match &p.data {
                        Data::Dot { expr: pexpr, .. }
                        | Data::Sub { expr: pexpr, .. }
                        | Data::Call { expr: pexpr, .. }
                        | Data::TaggedTemplate { tag: pexpr, .. }
                            if Rc::ptr_eq(pexpr, node) => true,
                        _ => false,
                    };
                }
                return false;
            }
            match &p.data {
                Data::Call { expr: pexpr, is_new: true, .. } if Rc::ptr_eq(pexpr, node) => true,
                Data::Export { is_default: true, .. } if matches!(expr.data, Data::Func { .. }) => true,
                Data::Dot { expr: pexpr, .. } | Data::Sub { expr: pexpr, .. }
                    if Rc::ptr_eq(pexpr, node)
                        && matches!(expr.data, Data::Func { kind: FuncKind::Expr, .. })
                        && out.parent(1).is_some_and(|p1| {
                            matches!(&p1.data, Data::Assign { left, .. } if Rc::ptr_eq(left, p))
                        }) =>
                {
                    true
                }
                _ => false,
            }
        }
        Data::Assign { left, .. } => {
            assign_parens(p, node) || matches!(left.data, Data::Destructuring { array: false, .. })
        }
        Data::Cond { .. } => assign_parens(p, node),
        Data::Number { value, .. } => {
            if let Data::Dot { expr, .. } | Data::Sub { expr, .. } = &p.data {
                if Rc::ptr_eq(expr, node) && (*value < 0.0 || make_num(*value).starts_with('0')) {
                    return true;
                }
            }
            false
        }
        Data::BigInt { value } => {
            if let Data::Dot { expr, .. } | Data::Sub { expr, .. } = &p.data {
                if Rc::ptr_eq(expr, node) && value.starts_with('-') {
                    return true;
                }
            }
            false
        }
        _ => false,
    }
}

fn is_prop_property(p: &N, node: &N) -> bool {
    match &p.data {
        Data::Sub { prop, .. } => Rc::ptr_eq(prop, node),
        _ => false,
    }
}

fn first_in_statement(out: &Out) -> bool {
    let mut node = out.stack.last().cloned();
    let Some(mut node) = node else { return false };
    let mut i = 0;
    while let Some(p) = out.parent(i).cloned() {
        if is_statement(&p) && statement_points_at(&p, &node) {
            return true;
        }
        if walks_through(&p, &node) {
            node = p;
            i += 1;
        } else {
            return false;
        }
    }
    false
}

fn is_statement(n: &N) -> bool {
    matches!(
        n.data,
        Data::Simple { .. }
            | Data::Empty
            | Data::Block { .. }
            | Data::Labeled { .. }
            | Data::Debugger
            | Data::Do { .. }
            | Data::While { .. }
            | Data::For { .. }
            | Data::ForIn { .. }
            | Data::ForOf { .. }
            | Data::With { .. }
            | Data::If { .. }
            | Data::Switch { .. }
            | Data::Try { .. }
            | Data::Return { .. }
            | Data::Throw { .. }
            | Data::Break { .. }
            | Data::Continue { .. }
            | Data::Defs { .. }
            | Data::Func { kind: FuncKind::Decl, .. }
            | Data::Class { stmt: true, .. }
            | Data::Import { .. }
            | Data::Export { .. }
            | Data::Directive { .. }
    )
}

fn statement_points_at(stmt: &N, node: &N) -> bool {
    match &stmt.data {
        Data::Simple { body } | Data::Labeled { body, .. } | Data::While { body, .. } | Data::With { body, .. } => {
            Rc::ptr_eq(body, node)
        }
        Data::Do { body, .. } | Data::For { body, .. } | Data::ForIn { body, .. } | Data::ForOf { body, .. } => {
            Rc::ptr_eq(body, node)
        }
        Data::If { body, .. } => Rc::ptr_eq(body, node),
        _ => false,
    }
}

fn walks_through(p: &N, node: &N) -> bool {
    match &p.data {
        Data::Seq { exprs } => exprs.first().is_some_and(|e| Rc::ptr_eq(e, node)),
        Data::Call { expr, is_new: false, .. }
        | Data::TaggedTemplate { tag: expr, .. }
        | Data::Dot { expr, .. }
        | Data::Sub { expr, .. }
        | Data::Chain { expr } => Rc::ptr_eq(expr, node),
        Data::Cond { cond, .. } => Rc::ptr_eq(cond, node),
        Data::Binary { left, .. } | Data::Assign { left, .. } | Data::DefaultAssign { left, .. } => Rc::ptr_eq(left, node),
        Data::Unary { expr, prefix: false, .. } => Rc::ptr_eq(expr, node),
        _ => false,
    }
}

fn binary_needs_parens(p: &N, node: &N, op: &str) -> bool {
    match &p.data {
        Data::Call { expr, .. } if Rc::ptr_eq(expr, node) => true,
        Data::Unary { .. } => true,
        Data::Dot { expr, .. } | Data::Sub { expr, .. } if Rc::ptr_eq(expr, node) => true,
        Data::Binary { op: pop, right, .. } | Data::Assign { op: pop, right, .. } => {
            if (op == "??" && (pop == "||" || pop == "&&")) || (pop == "??" && (op == "||" || op == "&&")) {
                return true;
            }
            let pp = precedence(pop).unwrap_or(0);
            let sp = precedence(op).unwrap_or(0);
            pp > sp || (pp == sp && (Rc::ptr_eq(right, node) || pop == "**"))
        }
        Data::PrivateIn { value, .. } => {
            let pp = precedence("in").unwrap_or(0);
            let sp = precedence(op).unwrap_or(0);
            pp > sp || (pp == sp && Rc::ptr_eq(value, node))
        }
        _ => false,
    }
}

fn private_in_parens(p: &N, node: &N) -> bool {
    match &p.data {
        Data::Call { expr, .. } if Rc::ptr_eq(expr, node) => true,
        Data::Unary { .. } => true,
        Data::Dot { expr, .. } | Data::Sub { expr, .. } if Rc::ptr_eq(expr, node) => true,
        Data::Binary { op, right, .. } => {
            let pp = precedence(op).unwrap_or(0);
            let sp = precedence("in").unwrap_or(0);
            pp > sp || (pp == sp && (Rc::ptr_eq(right, node) || op == "**"))
        }
        Data::PrivateIn { value, .. } if Rc::ptr_eq(value, node) => true,
        _ => false,
    }
}

fn assign_parens(p: &N, node: &N) -> bool {
    match &p.data {
        Data::Unary { .. } => true,
        Data::Binary { .. } => true,
        Data::Call { expr, .. } if Rc::ptr_eq(expr, node) => true,
        Data::Cond { cond, .. } if Rc::ptr_eq(cond, node) => true,
        Data::Dot { expr, .. } | Data::Sub { expr, .. } if Rc::ptr_eq(expr, node) => true,
        _ => false,
    }
}

fn precedence(op: &str) -> Option<i32> {
    Some(match op {
        "||" => 1,
        "??" => 2,
        "&&" => 3,
        "|" => 4,
        "^" => 5,
        "&" => 6,
        "==" | "===" | "!=" | "!==" => 7,
        "<" | ">" | "<=" | ">=" | "in" | "instanceof" => 8,
        ">>" | "<<" | ">>>" => 9,
        "+" | "-" => 10,
        "*" | "/" | "%" => 11,
        "**" => 12,
        "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "<<=" | ">>=" | ">>>=" | "&=" | "^=" | "|=" | "**=" | "||=" | "&&=" | "??=" => 0,
        _ => return None,
    })
}

fn contains_call(node: &N) -> bool {
    match &node.data {
        Data::Func { .. } | Data::Class { .. } => false,
        Data::Call { is_new: false, .. } => true,
        Data::Call { expr, args, is_new: true, .. } => contains_call(expr) || args.iter().any(contains_call),
        Data::Binary { left, right, .. }
        | Data::Assign { left, right, .. }
        | Data::DefaultAssign { left, right } => contains_call(left) || contains_call(right),
        Data::Unary { expr, .. }
        | Data::Await { expr }
        | Data::Dot { expr, .. }
        | Data::Chain { expr }
        | Data::Spread { expr } => contains_call(expr),
        Data::Sub { expr, prop, .. } => contains_call(expr) || contains_call(prop),
        Data::Cond { cond, cons, alt } => contains_call(cond) || contains_call(cons) || contains_call(alt),
        Data::Seq { exprs } | Data::Array { elements: exprs } => exprs.iter().any(contains_call),
        Data::Object { props } => props.iter().any(contains_call),
        Data::Template { segments } => segments.iter().any(|s| matches!(s, ast::Seg::Expr(e) if contains_call(e))),
        _ => false,
    }
}

fn numeric_key(key: &str) -> Option<f64> {
    if key.is_empty() {
        return None;
    }
    let n: f64 = key.parse().ok()?;
    if n < 0.0 || n.is_nan() {
        return None;
    }
    let again = js_number_string(n).replace("e+", "e");
    let key_norm = key.replace("e+", "e");
    if again == key_norm {
        Some(n)
    } else {
        None
    }
}

fn js_number_string(n: f64) -> String {
    if n.is_nan() {
        return "NaN".into();
    }
    if n == 0.0 {
        return "0".into();
    }
    if n.is_infinite() {
        return if n.is_sign_negative() { "-Infinity".into() } else { "Infinity".into() };
    }
    let mut buf = ryu::Buffer::new();
    let s = buf.format_finite(n).to_string();
    // ryu prints whole numbers as `6.0`. JavaScript's toString drops that suffix.
    if let Some(head) = s.strip_suffix(".0") {
        if !head.is_empty() && !head.contains('.') && !head.contains('e') {
            return head.to_string();
        }
    }
    if let Some(i) = s.find('e') {
        if s.as_bytes().get(i + 1) != Some(&b'+') && s.as_bytes().get(i + 1) != Some(&b'-') {
            let mut t = s;
            t.insert(i + 1, '+');
            return t.replace("e+", "e");
        }
    }
    s
}

fn make_num(num: f64) -> String {
    if num.is_nan() {
        return "NaN".into();
    }
    if num.is_infinite() {
        return if num.is_sign_negative() { "-Infinity".into() } else { "Infinity".into() };
    }
    let mut strv = js_number_string(num).replace("e+", "e");
    if strv.starts_with("0.") {
        strv.replace_range(0..1, "");
    }
    let mut candidates = vec![strv.clone()];
    if num.floor() == num && num.is_finite() {
        if num < 0.0 {
            candidates.push(format!("-0x{:x}", (-num) as u64));
        } else if num <= u64::MAX as f64 {
            candidates.push(format!("0x{:x}", num as u64));
        }
    }
    if let Some(rest) = strv.strip_prefix('.') {
        if let Some(digits) = rest.strip_prefix(|c: char| c == '0').map(|_| rest.trim_start_matches('0')) {
            if rest.starts_with('0') && !digits.is_empty() && digits.chars().all(|c| c.is_ascii_digit()) {
                let len = rest.len() - digits.len();
                candidates.push(format!("{digits}e-{}", digits.len() + len));
            }
        }
    }
    if let Some(zeros) = trailing_zeros(&strv) {
        if zeros > 0 && !strv.contains('e') && !strv.contains('.') {
            let head = &strv[..strv.len() - zeros];
            if !head.is_empty() {
                candidates.push(format!("{head}e{zeros}"));
            }
        }
    } else if let Some(rest) = strv.strip_prefix(|c: char| c.is_ascii_digit()) {
        // `^(\d)\.(\d+)e(-?\d+)$` after `e+` has already been rewritten to `e`.
        if rest.starts_with('.') {
            if let Some((frac, exp)) = rest[1..].split_once('e') {
                if !frac.is_empty() && frac.chars().all(|c| c.is_ascii_digit()) {
                    if let Ok(e) = exp.parse::<i32>() {
                        let shift = e - frac.len() as i32;
                        let lead = &strv[..1];
                        candidates.push(format!("{lead}{frac}e{shift}"));
                    }
                }
            }
        }
    }
    best_of(candidates)
}

fn trailing_zeros(s: &str) -> Option<usize> {
    if s.contains('e') || s.contains('.') || s.starts_with('-') {
        return None;
    }
    let n = s.chars().rev().take_while(|c| *c == '0').count();
    if n > 0 { Some(n) } else { None }
}

fn best_of(cands: Vec<String>) -> String {
    cands.into_iter().min_by_key(|s| s.len()).unwrap_or_else(|| "0".into())
}

fn encode_units(units: &[u16], quote: Option<char>) -> String {
    let mut dq = 0i32;
    let mut sq = 0i32;
    let mut body = String::new();
    let mut i = 0;
    while i < units.len() {
        let u = units[i];
        if (0xD800..=0xDBFF).contains(&u) && i + 1 < units.len() && (0xDC00..=0xDFFF).contains(&units[i + 1]) {
            let cp = 0x10000 + (((u as u32) - 0xD800) << 10) + ((units[i + 1] as u32) - 0xDC00);
            if let Some(c) = char::from_u32(cp) {
                body.push(c);
            }
            i += 2;
            continue;
        }
        if (0xD800..=0xDFFF).contains(&u) {
            body.push_str(&format!("\\u{u:04x}"));
            i += 1;
            continue;
        }
        let c = char::from_u32(u as u32).unwrap_or('\u{FFFD}');
        push_escaped(c, &mut body, &mut dq, &mut sq, units.get(i + 1).copied());
        i += 1;
    }
    wrap_quote(body, quote, dq, sq)
}

fn push_escaped(c: char, body: &mut String, dq: &mut i32, sq: &mut i32, next: Option<u16>) {
    match c {
        '"' => {
            *dq += 1;
            body.push('"');
        }
        '\'' => {
            *sq += 1;
            body.push('\'');
        }
        '\\' => body.push_str("\\\\"),
        '\n' => body.push_str("\\n"),
        '\r' => body.push_str("\\r"),
        '\t' => body.push_str("\\t"),
        '\u{0008}' => body.push_str("\\b"),
        '\u{000c}' => body.push_str("\\f"),
        '\u{000b}' => body.push_str("\\v"),
        '\u{2028}' => body.push_str("\\u2028"),
        '\u{2029}' => body.push_str("\\u2029"),
        '\u{feff}' => body.push_str("\\ufeff"),
        '\0' => {
            if next.is_some_and(|n| (b'0'..=b'9').contains(&(n as u8))) {
                body.push_str("\\x00");
            } else {
                body.push_str("\\0");
            }
        }
        c => body.push(c),
    }
}

fn wrap_quote(body: String, quote: Option<char>, dq: i32, sq: i32) -> String {
    let quoted = if quote == Some('`') {
        format!("`{}`", body.replace('`', "\\`"))
    } else if dq > sq {
        format!("'{}'", body.replace('\'', "\\'"))
    } else {
        format!("\"{}\"", body.replace('"', "\\\""))
    };
    inline_script(&quoted)
}

fn encode_string(s: &str, quote: Option<char>) -> String {
    let mut dq = 0i32;
    let mut sq = 0i32;
    let mut body = String::new();
    let chars: Vec<char> = s.chars().collect();
    for (i, c) in chars.iter().copied().enumerate() {
        match c {
            '"' => {
                dq += 1;
                body.push('"');
            }
            '\'' => {
                sq += 1;
                body.push('\'');
            }
            '\\' => body.push_str("\\\\"),
            '\n' => body.push_str("\\n"),
            '\r' => body.push_str("\\r"),
            '\t' => body.push_str("\\t"),
            '\u{0008}' => body.push_str("\\b"),
            '\u{000c}' => body.push_str("\\f"),
            '\u{000b}' => body.push_str("\\v"),
            '\u{2028}' => body.push_str("\\u2028"),
            '\u{2029}' => body.push_str("\\u2029"),
            '\u{feff}' => body.push_str("\\ufeff"),
            '\0' => {
                if chars.get(i + 1).is_some_and(|n| n.is_ascii_digit()) {
                    body.push_str("\\x00");
                } else {
                    body.push_str("\\0");
                }
            }
        c => body.push(c),
        }
    }
    let quoted = if quote == Some('`') {
        format!("`{}`", body.replace('`', "\\`"))
    } else if dq > sq {
        format!("'{}'", body.replace('\'', "\\'"))
    } else {
        format!("\"{}\"", body.replace('"', "\\\""))
    };
    inline_script(&quoted)
}

fn inline_script(s: &str) -> String {
    let out = replace_script_close(s);
    let out = out.replace("<!--", "\\x3c!--");
    out.replace("-->", "--\\x3e")
}

fn replace_script_close(s: &str) -> String {
    let lower = s.to_ascii_lowercase();
    let mut out = String::new();
    let bytes = s.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'<' {
            let rest = &lower[i..];
            if let Some(end) = match_script_close(rest) {
                out.push_str("<\\/");
                out.push_str(&s[i + 2..i + 2 + "script".len()]);
                out.push_str(&s[i + end..i + end]);
                // match_script_close returns the index of the char after "script"
                let after = i + 2 + 6;
                out.push(s[after..].chars().next().unwrap_or(' '));
                i = after + s[after..].chars().next().map(|c| c.len_utf8()).unwrap_or(0);
                continue;
            }
        }
        let ch = s[i..].chars().next().unwrap();
        out.push(ch);
        i += ch.len_utf8();
    }
    out
}

fn match_script_close(rest: &str) -> Option<usize> {
    // </script followed by > / tab newline formfeed cr space, case insensitive
    let b = rest.as_bytes();
    if b.len() < 8 || b[0] != b'<' || b[1] != b'/' {
        return None;
    }
    if &rest[2..8].to_ascii_lowercase() != "script" {
        return None;
    }
    let n = rest[8..].chars().next()?;
    if matches!(n, '>' | '/' | '\t' | '\n' | '\u{000c}' | '\r' | ' ') {
        Some(8)
    } else {
        None
    }
}

fn slash_script(source: &str) -> String {
    let lower = source.to_ascii_lowercase();
    let mut out = String::new();
    let b = source.as_bytes();
    let mut i = 0;
    while i < b.len() {
        if b[i] == b'<' {
            let rest = &lower[i..];
            let rb = rest.as_bytes();
            let mut j = 1;
            while j < rb.len() && rb[j].is_ascii_whitespace() {
                j += 1;
            }
            if j < rb.len() && rb[j] == b'/' {
                let slash = j;
                j += 1;
                while j < rb.len() && rb[j].is_ascii_whitespace() {
                    j += 1;
                }
                if rest[j..].starts_with("script") {
                    out.push_str(&source[i..i + slash]);
                    out.push('\\');
                    out.push('/');
                    let end = i + j + "script".len();
                    out.push_str(&source[i + slash + 1..end]);
                    i = end;
                    continue;
                }
            }
        }
        let ch = source[i..].chars().next().unwrap();
        out.push(ch);
        i += ch.len_utf8();
    }
    out
}

fn regexp_source_fix(source: &str) -> String {
    let chars: Vec<char> = source.chars().collect();
    let mut out = String::new();
    for (i, c) in chars.iter().copied().enumerate() {
        let esc = matches!(c, '\0' | '\n' | '\r' | '\u{2028}' | '\u{2029}');
        if !esc {
            out.push(c);
            continue;
        }
        let escaped = i > 0 && chars[i - 1] == '\\' && !even_backslashes(&chars, i);
        if !escaped {
            out.push('\\');
        }
        match c {
            '\0' => out.push('0'),
            '\n' => out.push('n'),
            '\r' => out.push('r'),
            '\u{2028}' => out.push_str("u2028"),
            '\u{2029}' => out.push_str("u2029"),
            _ => {}
        }
    }
    out
}

fn even_backslashes(chars: &[char], i: usize) -> bool {
    // true when the slash before i is itself escaped (even count of slashes before the char? )
    // JS: source[offset-1]=='\\' && (source[offset-2] != '\\' || /(?:^|[^\\])(?:\\{2})*$/.test(slice before offset-1))
    // Simplified: count consecutive backslashes immediately before i. Odd means the char is escaped.
    let mut n = 0;
    let mut k = i;
    while k > 0 && chars[k - 1] == '\\' {
        n += 1;
        k -= 1;
    }
    n % 2 == 0
}

fn sort_flags(flags: &str) -> String {
    let order = ['d', 'g', 'i', 'm', 's', 'u', 'y', 'v'];
    let mut out = String::new();
    let mut rest: Vec<char> = flags.chars().collect();
    for f in order {
        if let Some(i) = rest.iter().position(|c| *c == f) {
            out.push(f);
            rest.remove(i);
        }
    }
    for c in rest {
        out.push(c);
    }
    out
}

#[allow(dead_code)]
fn _symkind_touch(k: SymKind) -> bool {
    matches!(k, SymKind::Ref)
}
