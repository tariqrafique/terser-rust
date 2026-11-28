//! terser `lib/size.js` `AST_Node.size(compressor, stack)`: an estimate of the printed length
//! that `best_of` / `best_of_expression` and a few other choices compare. It is not the printed
//! length: parentheses count only around binaries and assignments (`needs_parens`), around a
//! function or object first in a statement, and `in` counts 4.
//!
//! The walk is `walk_parent`: each node adds its own `_size(info)`, where `info.parent()` is the
//! node's parent in the walk, continuing into the initial stack past the root. A braceless arrow
//! adds its returned value's own size (seen from the arrow's parent) and is not descended.

use std::rc::Rc;

use ast::{Data, DefKind, FuncKind, Key, Seg, SymKind, N};

/// terser `node.size()`: no compressor, so no stack above the root and no mangling.
pub(crate) fn size(n: &N) -> usize {
    size_in(n, &[], false)
}

/// terser `node.size(compressor)`: `stack` is the compressor's stack (outermost first), the
/// walk's initial stack. With `mangle`, a symbol whose definition will be mangled counts 1.
pub(crate) fn size_in(n: &N, stack: &[N], mangle: bool) -> usize {
    let mut w = Walk { stack, path: Vec::new(), mangle };
    w.node(n)
}

/// terser `common.js` `best_of_expression`: `b` when it is smaller than `a`, else `a`.
pub(crate) fn best_of_expression(a: &N, b: &N) -> N {
    if size(a) > size(b) { Rc::clone(b) } else { Rc::clone(a) }
}

/// terser `common.js` `best_of_statement`: the same, each wrapped in a statement.
pub(crate) fn best_of_statement(a: &N, b: &N) -> N {
    if statement_size(a) > statement_size(b) { Rc::clone(b) } else { Rc::clone(a) }
}

/// terser `common.js` `best_of(compressor, a, b)`; `first` is `first_in_statement(compressor)`.
pub(crate) fn best_of(first: bool, a: &N, b: &N) -> N {
    if first { best_of_statement(a, b) } else { best_of_expression(a, b) }
}

/// The size of `n` as the body of an `AST_SimpleStatement` (which adds nothing itself).
pub(crate) fn statement_size(n: &N) -> usize {
    let stat = ast::Node::new(Data::Simple { body: Rc::clone(n) });
    size_in(n, &[stat], false)
}

/// Saturating stand-in for `Infinity` (`AST_Number` of an infinite value).
const HUGE: usize = 1 << 40;

struct Walk<'a> {
    stack: &'a [N],
    path: Vec<N>,
    mangle: bool,
}

impl Walk<'_> {
    /// `info.parent(i)`: the walk path first, then the initial stack.
    fn parent(&self, i: usize) -> Option<&N> {
        if i < self.path.len() {
            Some(&self.path[self.path.len() - 1 - i])
        } else {
            let j = i - self.path.len();
            (j < self.stack.len()).then(|| &self.stack[self.stack.len() - 1 - j])
        }
    }

    fn node(&mut self, n: &N) -> usize {
        let mut size = self.own(n, n);
        if let Some(value) = braceless_value(n) {
            return size.saturating_add(self.own(value, n));
        }
        self.path.push(Rc::clone(n));
        let parent = Rc::clone(n);
        self.children(&parent, &mut size);
        self.path.pop();
        size
    }

    fn add(&mut self, child: &N, size: &mut usize) {
        *size = size.saturating_add(self.node(child));
    }

    /// `_children_backwards`, in the port's shapes: a catch or finally body is the block's
    /// statements (terser's `AST_Catch` / `AST_Finally` are the block), a method's or class
    /// field's non-computed key is an `AST_SymbolMethod` / `AST_SymbolClassProperty` /
    /// `AST_SymbolPrivateProperty` child, and template segments are `AST_TemplateSegment`s.
    fn children(&mut self, n: &N, size: &mut usize) {
        match &n.data {
            Data::Catch { arg, body } => {
                if let Some(arg) = arg {
                    self.add(arg, size);
                }
                self.block_body(body, size);
            }
            Data::Finally { body } => self.block_body(body, size),
            Data::Prop { key, value, method, .. } => {
                match key {
                    Key::Computed(e) => self.add(e, size),
                    Key::Static { name, .. } | Key::Private(name) if method.is_some() => {
                        *size += utf16_len(name);
                    }
                    _ => {}
                }
                self.add(value, size);
            }
            Data::Field { key, value, .. } => {
                match key {
                    Key::Computed(e) => self.add(e, size),
                    Key::Static { name, .. } => *size += utf16_len(name),
                    // `AST_ClassPrivateProperty` does not walk its key.
                    Key::Private(_) => {}
                }
                if let Some(value) = value {
                    self.add(value, size);
                }
            }
            Data::Template { segments } => {
                for seg in segments {
                    match seg {
                        Seg::Cooked { value, units, .. } => {
                            *size += units.as_ref().map_or_else(|| utf16_len(value), Vec::len);
                        }
                        Seg::Expr(e) => self.add(e, size),
                    }
                }
            }
            _ => {
                let mut kids = Vec::new();
                ast::walk_children(n, &mut |c| kids.push(Rc::clone(c)));
                for c in &kids {
                    self.add(c, size);
                }
            }
        }
    }

    fn block_body(&mut self, block: &N, size: &mut usize) {
        match &block.data {
            Data::Block { body } => {
                for s in body {
                    self.add(s, size);
                }
            }
            _ => self.add(block, size),
        }
    }

    /// `node._size(info)`; `current` is `info.parent(-1)`, the node being visited (the arrow
    /// for a braceless arrow's value).
    fn own(&self, n: &N, current: &N) -> usize {
        match &n.data {
            Data::Debugger => 8,
            Data::Directive { value, units, .. } => 2 + units.as_ref().map_or_else(|| utf16_len(value), Vec::len),
            Data::Block { body } => 2 + overhead(body.len()),
            Data::Toplevel { body } => overhead(body.len()),
            Data::Empty => 1,
            Data::Labeled { .. } => 2,
            Data::Do { .. } => 9,
            Data::While { .. } => 7,
            Data::For { .. } => 8,
            Data::ForIn { .. } | Data::ForOf { .. } => 8,
            Data::With { .. } => 6,
            Data::Spread { .. } => 3,
            Data::Func { kind, args, body, async_, generator, .. } => {
                let mods = usize::from(*generator) + if *async_ { 6 } else { 0 };
                let lists = overhead(args.len()) + overhead(body.len());
                let accessor = *kind == FuncKind::Accessor || (*kind == FuncKind::Expr && self.is_method_value(n));
                if accessor {
                    mods + 4 + lists
                } else {
                    match kind {
                        FuncKind::Decl => mods + 13 + lists,
                        FuncKind::Arrow => {
                            let mut args_and_arrow = 2 + overhead(args.len());
                            if !(args.len() == 1 && matches!(args[0].data, Data::Symbol { .. })) {
                                args_and_arrow += 2;
                            }
                            let body_overhead = if braceless_value(n).is_some() { 0 } else { overhead(body.len()) + 2 };
                            mods + args_and_arrow + body_overhead
                        }
                        _ => usize::from(self.first_in_statement(current)) * 2 + mods + 12 + lists,
                    }
                }
            }
            Data::Destructuring { .. } => 2,
            Data::Template { segments } => {
                let exprs = segments.iter().filter(|s| matches!(s, Seg::Expr(_))).count();
                // terser's segments alternate string, expression, ..., string: 2k + 1 of them.
                2 + exprs * 3
            }
            Data::Return { value } => if value.is_some() { 7 } else { 6 },
            Data::Throw { .. } => 6,
            Data::Break { label } => if label.is_some() { 6 } else { 5 },
            Data::Continue { label } => if label.is_some() { 9 } else { 8 },
            Data::If { .. } => 4,
            Data::Switch { body, .. } => 8 + overhead(body.len()),
            Data::Case { body, .. } => 5 + overhead(body.len()),
            Data::Default { body } => 8 + overhead(body.len()),
            Data::Try { .. } => 3,
            Data::Catch { arg, body } => 7 + overhead(block_len(body)) + if arg.is_some() { 2 } else { 0 },
            Data::Finally { body } => 7 + overhead(block_len(body)),
            Data::Defs { kind, defs, await_ } => {
                let base = match kind {
                    DefKind::Var | DefKind::Let => 4,
                    DefKind::Const => 6,
                    DefKind::Using => 6 + if *await_ { 6 } else { 0 },
                };
                base + overhead(defs.len())
            }
            Data::VarDef { value, .. } => usize::from(value.is_some()),
            Data::NameMap { name, .. } => {
                // terser `this.name ? 4 : 0`: the local name is always there.
                let _ = name;
                4
            }
            Data::Import { imported_name, imported_names, .. } => {
                let mut size = 6;
                if imported_name.is_some() {
                    size += 1;
                }
                if imported_name.is_some() || imported_names.is_some() {
                    size += 5;
                }
                if let Some(names) = imported_names {
                    size += 2 + overhead(names.len());
                }
                size
            }
            Data::ImportMeta => 11,
            Data::DynImport { args, phase } => match phase {
                Some(p) => 9 + p.len() + overhead(args.len()),
                None => 8 + overhead(args.len()),
            },
            Data::Export { is_default, names, value, module_name, .. } => {
                let mut size = 7 + if *is_default { 8 } else { 0 };
                if let Some(v) = value {
                    // `this.exported_value._size()`: no info, so nothing above it.
                    size += Walk { stack: &[], path: Vec::new(), mangle: self.mangle }.own(v, v);
                }
                if let Some(names) = names {
                    size += 2 + overhead(names.len());
                }
                if module_name.is_some() {
                    size += 5;
                }
                size
            }
            Data::Call { args, optional, is_new, .. } => {
                if *is_new {
                    6 + overhead(args.len())
                } else if *optional {
                    4 + overhead(args.len())
                } else {
                    2 + overhead(args.len())
                }
            }
            Data::Seq { exprs } => overhead(exprs.len()),
            Data::Dot { prop, optional, private, .. } => {
                utf16_len(prop) + if *private { 2 } else { 1 } + usize::from(*optional)
            }
            Data::Sub { optional, .. } => if *optional { 4 } else { 2 },
            Data::Unary { op, .. } => match op.as_str() {
                "typeof" => 7,
                "void" => 5,
                _ => op.len(),
            },
            Data::Binary { op, right, .. } => {
                if op == "in" {
                    return 4;
                }
                let mut size = op.len();
                if op == "+" || op == "-" {
                    if let Data::Unary { op: rop, .. } = &right.data {
                        if rop == op {
                            size += 1;
                        }
                    }
                }
                size + if self.binary_parens(n, op) { 2 } else { 0 }
            }
            Data::DefaultAssign { .. } => 1 + if self.binary_parens(n, "=") { 2 } else { 0 },
            Data::Assign { op, .. } => op.len() + if self.assign_parens(n) { 2 } else { 0 },
            Data::Cond { .. } => 3,
            Data::Array { elements } => 2 + overhead(elements.len()),
            Data::Object { props } => {
                2 + if self.first_in_statement(current) { 2 } else { 0 } + overhead(props.len())
            }
            Data::Prop { method, key, static_, private, .. } => {
                let private = *private || matches!(key, Key::Private(_));
                let statics = if *static_ { 7 } else { 0 };
                match method {
                    // AST_ObjectKeyVal: a string key, or a computed one (a node, 0).
                    None => {
                        let key = match key {
                            Key::Static { name, .. } => utf16_len(name),
                            _ => 0,
                        };
                        key + 1
                    }
                    // The key of a getter, setter or method is a node (`AST_SymbolMethod`).
                    Some(ast::MethodKind::Method) => statics + usize::from(private),
                    Some(_) => {
                        if private {
                            statics + 4
                        } else {
                            5 + statics
                        }
                    }
                }
            }
            Data::PrivateIn { .. } => 5,
            Data::Class { name, extends, .. } => {
                (if name.is_some() { 8 } else { 7 }) + if extends.is_some() { 8 } else { 0 }
            }
            Data::StaticBlock { body } => 8 + overhead(body.len()),
            // `typeof this.key === "string"` never holds: a class field's key is a node.
            Data::Field { key, value, static_, private, .. } => {
                let private = *private || matches!(key, Key::Private(_));
                (if *static_ { 7 } else { 0 }) + usize::from(value.is_some()) + usize::from(private)
            }
            Data::Symbol { name, kind, .. } => match kind {
                SymKind::ClassProperty | SymKind::ImportForeign | SymKind::ExportForeign => utf16_len(name),
                SymKind::Method | SymKind::Label | SymKind::LabelRef | SymKind::Private => self.symbol(n, name),
                _ => {
                    if name == "arguments" {
                        9
                    } else {
                        self.symbol(n, name)
                    }
                }
            },
            Data::NewTarget => 10,
            Data::This => 4,
            Data::Super => 5,
            Data::String { value, units, .. } => units.as_ref().map_or_else(|| utf16_len(value), Vec::len) + 2,
            Data::Number { value, .. } => number_size(*value),
            Data::BigInt { value } => value.len(),
            // `this.value.toString()`: the value is a `{ source, flags }` object, "[object Object]".
            Data::RegExp { .. } => 15,
            Data::Null => 4,
            Data::Hole => 0,
            Data::Infinity => 8,
            Data::True => 4,
            Data::False => 5,
            Data::Await { .. } | Data::Yield { .. } => 6,
            Data::Simple { .. } | Data::Chain { .. } | Data::TaggedTemplate { .. } => 0,
        }
    }

    /// `AST_Symbol._size`: one character when the definition will be mangled.
    fn symbol(&self, n: &N, name: &str) -> usize {
        if self.mangle && crate::eval::mangled_size(n) { 1 } else { utf16_len(name) }
    }

    /// The parser gives a concise method a `FuncKind::Expr` value; terser's is an `AST_Accessor`.
    fn is_method_value(&self, n: &N) -> bool {
        self.parent(0).is_some_and(|p| matches!(&p.data, Data::Prop { method: Some(_), value, .. } if Rc::ptr_eq(value, n)))
    }

    /// `output.js` `PARENS(AST_Binary)` with `info` as the output.
    fn binary_parens(&self, n: &N, op: &str) -> bool {
        let Some(p) = self.parent(0) else { return false };
        match &p.data {
            Data::Call { expr, .. } => Rc::ptr_eq(expr, n),
            Data::Unary { .. } => true,
            Data::Dot { expr, .. } | Data::Sub { expr, .. } => Rc::ptr_eq(expr, n),
            Data::Binary { op: pop, right, .. } => binary_precedence_parens(pop, op, Rc::ptr_eq(right, n)),
            Data::Assign { op: pop, right, .. } => binary_precedence_parens(pop, op, Rc::ptr_eq(right, n)),
            Data::DefaultAssign { right, .. } => binary_precedence_parens("=", op, Rc::ptr_eq(right, n)),
            Data::PrivateIn { value, .. } => {
                let pp = precedence("in");
                let sp = precedence(op);
                match (pp, sp) {
                    (Some(pp), Some(sp)) => pp > sp || (pp == sp && Rc::ptr_eq(value, n)),
                    _ => false,
                }
            }
            _ => false,
        }
    }

    /// `output.js` `PARENS([AST_Assign, AST_Conditional])` for an assignment.
    fn assign_parens(&self, n: &N) -> bool {
        if let Data::Assign { left, .. } = &n.data {
            if matches!(left.data, Data::Destructuring { array: false, .. }) {
                return true;
            }
        }
        let Some(p) = self.parent(0) else { return false };
        match &p.data {
            Data::Unary { .. } => true,
            Data::Binary { .. } | Data::DefaultAssign { .. } => true,
            Data::Call { expr, .. } => Rc::ptr_eq(expr, n),
            Data::Cond { cond, .. } => Rc::ptr_eq(cond, n),
            Data::Dot { expr, .. } | Data::Sub { expr, .. } => Rc::ptr_eq(expr, n),
            _ => false,
        }
    }

    /// `utils/first_in_statement.js` `first_in_statement(info)`.
    fn first_in_statement(&self, current: &N) -> bool {
        let mut node = current;
        let mut i = 0;
        while let Some(p) = self.parent(i) {
            let body_is = |b: &N| Rc::ptr_eq(b, node);
            let stmt = match &p.data {
                Data::Simple { body }
                | Data::Labeled { body, .. }
                | Data::Do { body, .. }
                | Data::While { body, .. }
                | Data::For { body, .. }
                | Data::ForIn { body, .. }
                | Data::ForOf { body, .. }
                | Data::With { body, .. }
                | Data::If { body, .. }
                | Data::Try { body, .. } => body_is(body),
                _ => false,
            };
            if stmt {
                return true;
            }
            let edge = match &p.data {
                Data::Seq { exprs } => exprs.first().is_some_and(|e| Rc::ptr_eq(e, node)),
                Data::Call { expr, is_new: false, .. } => Rc::ptr_eq(expr, node),
                Data::TaggedTemplate { tag, .. } => Rc::ptr_eq(tag, node),
                Data::Dot { expr, private: false, .. } | Data::Sub { expr, .. } | Data::Chain { expr } => {
                    Rc::ptr_eq(expr, node)
                }
                Data::Cond { cond, .. } => Rc::ptr_eq(cond, node),
                Data::Binary { left, .. } | Data::Assign { left, .. } | Data::DefaultAssign { left, .. } => {
                    Rc::ptr_eq(left, node)
                }
                Data::Unary { expr, prefix: false, .. } => Rc::ptr_eq(expr, node),
                _ => false,
            };
            if !edge {
                return false;
            }
            node = p;
            i += 1;
        }
        false
    }
}

/// `AST_Arrow.is_braceless()`: the body is one `return` with a value.
fn braceless_value(n: &N) -> Option<&N> {
    match &n.data {
        Data::Func { kind: FuncKind::Arrow, body, .. } => match body.first().map(|s| &s.data) {
            Some(Data::Return { value: Some(v) }) => Some(v),
            _ => None,
        },
        _ => None,
    }
}

/// The precedence part of `PARENS(AST_Binary)`, for a parent binary `pop`. A parent assignment
/// has no `PRECEDENCE` entry (`undefined`), so it never asks for parentheses.
fn binary_precedence_parens(pop: &str, op: &str, is_right: bool) -> bool {
    if op == "??" && (pop == "||" || pop == "&&") {
        return true;
    }
    if pop == "??" && (op == "||" || op == "&&") {
        return true;
    }
    match (precedence(pop), precedence(op)) {
        (Some(pp), Some(sp)) => pp > sp || (pp == sp && (is_right || pop == "**")),
        _ => false,
    }
}

/// `parse.js` `PRECEDENCE`.
fn precedence(op: &str) -> Option<u8> {
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
        _ => return None,
    })
}

fn overhead(len: usize) -> usize {
    len.saturating_sub(1)
}

fn block_len(n: &N) -> usize {
    match &n.data {
        Data::Block { body } => body.len(),
        _ => 1,
    }
}

/// `AST_Number._size`.
pub(crate) fn number_size(value: f64) -> usize {
    if value == 0.0 {
        return 1;
    }
    if value > 0.0 && value.floor() == value {
        if value.is_infinite() {
            return HUGE;
        }
        return (value.log10() + 1.0).floor() as usize;
    }
    crate::eval::js_num_tostring(value).len()
}

pub(crate) fn utf16_len(s: &str) -> usize {
    s.chars().map(char::len_utf16).sum()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    fn root() -> PathBuf {
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("..")
    }

    /// terser's lists from `tools/size.mjs`, live when the oracle is installed (and then the
    /// committed `compress/tests/size.json` must match), else the committed copy; or the file
    /// `SIZE_JSON` names (`node tools/size.mjs --files ...`).
    fn fixture() -> serde_json::Value {
        if let Ok(path) = std::env::var("SIZE_JSON") {
            return serde_json::from_str(&std::fs::read_to_string(path).expect("SIZE_JSON")).unwrap();
        }
        let committed = std::fs::read_to_string(root().join("compress/tests/size.json")).expect("size.json");
        let live = if root().join("oracle/node_modules/terser/lib/size.js").exists() {
            std::process::Command::new("node")
                .arg(root().join("tools/size.mjs"))
                .output()
                .ok()
                .filter(|o| o.status.success())
                .map(|o| String::from_utf8(o.stdout).unwrap())
        } else {
            None
        };
        if let Some(live) = &live {
            assert!(live == &committed, "compress/tests/size.json is stale: node tools/size.mjs compress/tests/size.json");
        }
        serde_json::from_str(live.as_deref().unwrap_or(&committed)).unwrap()
    }

    fn label(n: &N, parent: Option<&N>) -> Option<String> {
        let mut ty = ast::terser_type(n).to_string();
        match (parent.map(|p| &p.data), &n.data) {
            (Some(Data::Try { body, .. }), _) if Rc::ptr_eq(body, n) => ty = "TryBlock".into(),
            (Some(Data::Catch { .. } | Data::Finally { .. }), Data::Block { .. }) => return None,
            (Some(Data::Defs { kind: DefKind::Using, .. }), Data::VarDef { .. }) => ty = "UsingDef".into(),
            (Some(Data::Prop { method: Some(ast::MethodKind::Method), .. }), Data::Func { kind: FuncKind::Expr, .. }) => {
                ty = "Accessor".into()
            }
            _ => {}
        }
        Some(match &n.data {
            Data::Symbol { name, .. } => format!("{ty}:{name}"),
            Data::This => format!("{ty}:this"),
            Data::Super => format!("{ty}:super"),
            Data::Number { value, .. } => format!("{ty}:{}", crate::eval::js_num_tostring(*value)),
            Data::String { value, .. } => format!("{ty}:{value}"),
            _ => ty,
        })
    }

    fn pre_order(n: &N, parent: Option<&N>, out: &mut Vec<(String, usize)>) {
        if let Some(l) = label(n, parent) {
            // A method's value is an `AST_Accessor` in terser; the port needs the parent to tell.
            let stack: Vec<N> = parent.filter(|p| matches!(p.data, Data::Prop { .. })).into_iter().cloned().collect();
            out.push((l, size_in(n, &stack, false)));
        }
        ast::walk_children(n, &mut |c| pre_order(c, Some(n), out));
    }

    #[test]
    fn sizes_match_terser() {
        let mut failures = Vec::new();
        for case in fixture().as_array().unwrap() {
            let src = case["src"].as_str().unwrap();
            let top = parser::parse(src).unwrap_or_else(|e| panic!("parse {src:?}: {}", e.message));
            let mut got = Vec::new();
            pre_order(&top, None, &mut got);
            let want: Vec<(String, usize)> = case["sizes"]
                .as_array()
                .unwrap()
                .iter()
                .map(|p| (p[0].as_str().unwrap().to_string(), p[1].as_u64().unwrap() as usize))
                .collect();
            if got.len() != want.len() {
                failures.push(format!("{src:?}: {} nodes, terser {}", got.len(), want.len()));
            }
            for ((gl, gs), (wl, ws)) in got.iter().zip(&want) {
                if gl != wl {
                    failures.push(format!("{src:?}: node {gl} vs terser {wl}"));
                    break;
                }
                if gs != ws {
                    failures.push(format!("{src:?}: {gl} size {gs}, terser {ws}"));
                }
            }
        }
        assert!(failures.is_empty(), "{}", failures.join("\n"));
    }
}
