//! terser's child orders, one function per order. terser has three, which agree except for calls:
//!
//! | terser | here | a call's children |
//! | --- | --- | --- |
//! | `AST_Node._walk` (`TreeWalker`, `node.walk(tw)`), ast.js | [`walk_children`] | args, then callee |
//! | `def_transform` (`TreeTransformer`, `node.transform(tt)`), transform.js | [`transform_children`], [`map_children`] | callee, then args |
//! | `_children_backwards`, used by the `walk(node, cb)` helper in ast.js | [`children_backwards`] | pushes args reversed, then callee, so the stack pops callee, then args |
//!
//! None of them visits the `attributes` of an `import` / `export`.
//!
//! The port's tree differs from terser's in three places, so a pre-order list of nodes differs
//! there too (`parser/tests/walk_order.rs` compares the lists with terser's, from
//! `tools/walk-order.mjs`):
//! - template segments are `Seg::Cooked` data, not `AST_TemplateSegment` nodes;
//! - a non-computed property key is `Key::Static` / `Key::Private` data, not an `AST_SymbolMethod`,
//!   `AST_SymbolClassProperty` or `AST_SymbolPrivateProperty` node;
//! - `Catch` and `Finally` hold their statements in a `Block` node, where terser's `AST_Catch` and
//!   `AST_Finally` are blocks themselves. (`Try`'s `Block` is terser's `AST_TryBlock`.)

use crate::{Data, DefKind, FuncKind, Key, MethodKind, N, Node, NodeId, Seg, SymKind};
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

/// The children of `n` in terser's `_walk` order (what a `TreeWalker` visits). Same as
/// [`transform_children`] except that a call (`AST_Call`, `AST_New`) visits its arguments before
/// its callee.
pub fn walk_children(n: &N, f: &mut dyn FnMut(&N)) {
    if let Data::Call { expr, args, .. } = &n.data {
        for a in args {
            f(a);
        }
        f(expr);
        return;
    }
    transform_children(n, f)
}

/// terser's `_children_backwards(push)`: the children in reverse [`transform_children`] order, so
/// a stack walk (terser's `walk(node, cb)` helper) pops them in transform order.
pub fn children_backwards(n: &N, push: &mut dyn FnMut(&N)) {
    let mut kids: Vec<N> = Vec::new();
    transform_children(n, &mut |c| kids.push(c.clone()));
    for c in kids.iter().rev() {
        push(c);
    }
}

/// Pre-order walk in [`walk_children`] order: `f(node)` returns true to skip the node's children,
/// like a `TreeWalker` visitor returning true.
pub fn walk(n: &N, f: &mut dyn FnMut(&N) -> bool) {
    if f(n) {
        return;
    }
    walk_children(n, &mut |c| walk(c, f));
}

/// The children of `n` in terser's `def_transform` order (what a `TreeTransformer` descends
/// into), read only. [`map_children`] rebuilds in the same order. Each arm names the terser
/// node types the variant stands for. This is also NODE_IDS.md's `for_each_child`: it walks the
/// children without allocating.
pub fn transform_children(n: &N, f: &mut dyn FnMut(&N)) {
    data_children(&n.data, f)
}

/// [`transform_children`] of a node's data, before it is a node.
pub fn data_children(data: &Data, f: &mut dyn FnMut(&N)) {
    let o =|x: &Option<N>, f: &mut dyn FnMut(&N)| {
        if let Some(v) = x {
            f(v)
        }
    };
    let l = |xs: &[N], f: &mut dyn FnMut(&N)| xs.iter().for_each(|v| f(v));
    let key = |k: &Key, f: &mut dyn FnMut(&N)| {
        if let Key::Computed(e) = k {
            f(e)
        }
    };
    match data {
        // AST_Toplevel; AST_BlockStatement (AST_TryBlock as `Try.body`, the statement list of
        // AST_Catch / AST_Finally as their `body`)
        Data::Toplevel { body } | Data::Block { body } => l(body, f),
        // AST_SimpleStatement
        Data::Simple { body } => f(body),
        // AST_LabeledStatement: label, body
        Data::Labeled { label, body } => {
            f(label);
            f(body)
        }
        // AST_Do: body, condition
        Data::Do { body, cond } => {
            f(body);
            f(cond)
        }
        // AST_While: condition, body
        Data::While { cond, body } => {
            f(cond);
            f(body)
        }
        // AST_For: init, condition, step, body
        Data::For { init, cond, step, body } => {
            o(init, f);
            o(cond, f);
            o(step, f);
            f(body)
        }
        // AST_ForIn, AST_ForOf: init, object, body
        Data::ForIn { init, object, body } | Data::ForOf { init, object, body, .. } => {
            f(init);
            f(object);
            f(body)
        }
        // AST_With: expression, body
        Data::With { expr, body } => {
            f(expr);
            f(body)
        }
        // AST_If: condition, body, alternative
        Data::If { cond, body, alt } => {
            f(cond);
            f(body);
            o(alt, f)
        }
        // AST_Switch: expression, body; AST_Case: expression, body
        Data::Switch { expr, body } | Data::Case { expr, body } => {
            f(expr);
            l(body, f)
        }
        // AST_Default; AST_ClassStaticBlock
        Data::Default { body } | Data::StaticBlock { body } => l(body, f),
        // AST_Try: body (AST_TryBlock), bcatch, bfinally
        Data::Try { body, catch, finally } => {
            f(body);
            o(catch, f);
            o(finally, f)
        }
        // AST_Catch: argname, body
        Data::Catch { arg, body } => {
            o(arg, f);
            f(body)
        }
        // AST_Finally
        Data::Finally { body } => f(body),
        // AST_Var, AST_Let, AST_Const, AST_Using (AST_DefinitionsLike): definitions
        Data::Defs { defs, .. } => l(defs, f),
        // AST_VarDef, AST_UsingDef (AST_VarDefLike): name, value
        Data::VarDef { name, value } => {
            f(name);
            o(value, f)
        }
        // AST_Defun, AST_Function, AST_Arrow, AST_Accessor (AST_Lambda): name, argnames, body
        Data::Func { name, args, body, .. } => {
            o(name, f);
            l(args, f);
            l(body, f)
        }
        // AST_DefClass, AST_ClassExpression (AST_Class): name, extends, properties
        Data::Class { name, extends, props, .. } => {
            o(name, f);
            o(extends, f);
            l(props, f)
        }
        // AST_Return, AST_Throw (AST_Exit): value
        Data::Return { value } => o(value, f),
        Data::Throw { value } => f(value),
        // AST_Break, AST_Continue (AST_LoopControl): label
        Data::Break { label } | Data::Continue { label } => o(label, f),
        // AST_Import: imported_name, imported_names, module_name. Not attributes.
        Data::Import { imported_name, imported_names, module_name, .. } => {
            o(imported_name, f);
            if let Some(v) = imported_names {
                l(v, f)
            }
            f(module_name)
        }
        // AST_Export: exported_definition, exported_value, exported_names, module_name. Not
        // attributes.
        Data::Export { names, value, definition, module_name, .. } => {
            o(definition, f);
            o(value, f);
            if let Some(v) = names {
                l(v, f)
            }
            o(module_name, f)
        }
        // AST_NameMapping: foreign_name, name
        Data::NameMap { foreign, name } => {
            f(foreign);
            f(name)
        }
        // AST_Array: elements
        Data::Array { elements } => l(elements, f),
        // AST_Object: properties
        Data::Object { props } => l(props, f),
        // AST_ObjectKeyVal, AST_ObjectGetter, AST_ObjectSetter, AST_ConciseMethod,
        // AST_PrivateMethod, AST_PrivateGetter, AST_PrivateSetter (AST_ObjectProperty): key when
        // it is a node (computed here; terser's SymbolMethod key is `Key::Static` data), value
        Data::Prop { key: k, value, .. } => {
            key(k, f);
            f(value)
        }
        // AST_ClassProperty, AST_ClassPrivateProperty: key when computed, value
        Data::Field { key: k, value, .. } => {
            key(k, f);
            o(value, f)
        }
        // AST_Expansion: expression
        Data::Spread { expr } => f(expr),
        // AST_Destructuring: names
        Data::Destructuring { names, .. } => l(names, f),
        // AST_Sequence: expressions
        Data::Seq { exprs } => l(exprs, f),
        // AST_Dot, AST_DotHash: expression
        Data::Dot { expr, .. } => f(expr),
        // AST_Sub: expression, property
        Data::Sub { expr, prop, .. } => {
            f(expr);
            f(prop)
        }
        // AST_Chain: expression
        Data::Chain { expr } => f(expr),
        // AST_Call, AST_New: expression, args (`_walk` has args first, see `walk_children`)
        Data::Call { expr, args, .. } => {
            f(expr);
            l(args, f)
        }
        // AST_UnaryPrefix, AST_UnaryPostfix: expression
        Data::Unary { expr, .. } => f(expr),
        // AST_Binary, AST_Assign, AST_DefaultAssign: left, right
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } | Data::DefaultAssign { left, right } => {
            f(left);
            f(right)
        }
        // AST_Conditional: condition, consequent, alternative
        Data::Cond { cond, cons, alt } => {
            f(cond);
            f(cons);
            f(alt)
        }
        // AST_Await: expression
        Data::Await { expr } => f(expr),
        // AST_Yield: expression
        Data::Yield { expr, .. } => o(expr, f),
        // AST_TemplateString: segments (AST_TemplateSegment is `Seg::Cooked` data)
        Data::Template { segments } => {
            for s in segments {
                if let Seg::Expr(e) = s {
                    f(e)
                }
            }
        }
        // AST_PrefixedTemplateString: prefix, template_string
        Data::TaggedTemplate { tag, template } => {
            f(tag);
            f(template)
        }
        // AST_DynamicImport: args
        Data::DynImport { args, .. } => l(args, f),
        // AST_PrivateIn: key, value
        Data::PrivateIn { key: k, value } => {
            f(k);
            f(value)
        }
        // Leaves. AST_Directive, AST_EmptyStatement, AST_Debugger, AST_Symbol*, AST_This,
        // AST_Super, AST_NewTarget, AST_Null, AST_True, AST_False, AST_Infinity, AST_Number,
        // AST_BigInt, AST_String, AST_RegExp, AST_Hole, AST_ImportMeta.
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
        | Data::ImportMeta => {}
    }
}

/// Rebuild `n` with every child replaced by `f(child)`, in [`transform_children`] order (terser's
/// `def_transform`). Scalar fields are copied, and so are the `attributes` of an `import` /
/// `export`, which terser does not transform. The result is a new node even when no child changed,
/// with `n`'s id: `descend` edits the node in place.
pub fn map_children(n: &N, f: &mut dyn FnMut(&N) -> N) -> N {
    n.rebuild(map_data(n, f))
}

/// The data of [`map_children`], before it is a node.
fn map_data(n: &N, f: &mut dyn FnMut(&N) -> N) -> Data {
    let o =|x: &Option<N>, f: &mut dyn FnMut(&N) -> N| x.as_ref().map(|v| f(v));
    let l = |xs: &[N], f: &mut dyn FnMut(&N) -> N| xs.iter().map(|v| f(v)).collect::<Vec<N>>();
    let key = |k: &Key, f: &mut dyn FnMut(&N) -> N| match k {
        Key::Computed(e) => Key::Computed(f(e)),
        other => other.clone(),
    };
    match &n.data {
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
            attributes: attributes.clone(),
        },
        Data::Export { is_default, names, value, definition, module_name, attributes } => {
            let definition = o(definition, f);
            let value = o(value, f);
            let names = names.as_ref().map(|v| l(v, f));
            let module_name = o(module_name, f);
            Data::Export { is_default: *is_default, names, value, definition, module_name, attributes: attributes.clone() }
        }
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
        | Data::ImportMeta => n.data.clone(),
    }
}

/// terser `AST_Node.clone(true)`: every node is new (a new id, the same span).
pub fn deep_clone(n: &N) -> N {
    deep_clone_with(n, &mut |_, _| {})
}

/// [`deep_clone`] that reports every `(original, copy)` pair, children before their parent, so
/// a side table can carry the original's entries over (terser's `clone(true)` keeps `thedef`).
pub fn deep_clone_with(n: &N, f: &mut dyn FnMut(&N, &N)) -> N {
    let data = map_data(n, &mut |c| deep_clone_with(c, f));
    let copy = Node::make(n, data);
    // `clone` copies every property, `_annotations` included.
    copy.set_annotation(n.annotations());
    f(n, &copy);
    copy
}

/// Ids that appear on two different nodes in the tree under `root`: the port's version of terser
/// putting one object in two places (a node rebuilt with [`Node::rebuild`] while its old version
/// stays in the tree). The same `Rc` shared in two places is not reported. Each entry is the id
/// and terser's type names of the two nodes.
pub fn check_ids(root: &N) -> Vec<(NodeId, &'static str, &'static str)> {
    // Every node is held by `root`, so the addresses are unique for the whole walk.
    let mut seen: HashMap<NodeId, (*const Node, &'static str)> = HashMap::new();
    let mut visited: HashSet<*const Node> = HashSet::new();
    let mut out = Vec::new();
    let mut stack: Vec<N> = vec![Rc::clone(root)];
    while let Some(n) = stack.pop() {
        let p = Rc::as_ptr(&n);
        if !visited.insert(p) {
            continue;
        }
        match seen.get(&n.id()) {
            Some(&(q, ty)) if q != p => out.push((n.id(), ty, terser_type(&n))),
            Some(_) => {}
            None => {
                seen.insert(n.id(), (p, terser_type(&n)));
            }
        }
        transform_children(&n, &mut |c| stack.push(Rc::clone(c)));
    }
    out
}

/// terser's `node.TYPE` for `n`. A `Block` is `BlockStatement` here; as `Try.body` terser has an
/// `AST_TryBlock`, and as `Catch.body` / `Finally.body` it has no node (see the module docs).
pub fn terser_type(n: &Node) -> &'static str {
    match &n.data {
        Data::Toplevel { .. } => "Toplevel",
        Data::Directive { .. } => "Directive",
        Data::Simple { .. } => "SimpleStatement",
        Data::Empty => "EmptyStatement",
        Data::Block { .. } => "BlockStatement",
        Data::Labeled { .. } => "LabeledStatement",
        Data::Debugger => "Debugger",
        Data::Do { .. } => "Do",
        Data::While { .. } => "While",
        Data::For { .. } => "For",
        Data::ForIn { .. } => "ForIn",
        Data::ForOf { .. } => "ForOf",
        Data::With { .. } => "With",
        Data::If { .. } => "If",
        Data::Switch { .. } => "Switch",
        Data::Case { .. } => "Case",
        Data::Default { .. } => "Default",
        Data::Try { .. } => "Try",
        Data::Catch { .. } => "Catch",
        Data::Finally { .. } => "Finally",
        Data::Defs { kind, .. } => match kind {
            DefKind::Var => "Var",
            DefKind::Let => "Let",
            DefKind::Const => "Const",
            DefKind::Using => "Using",
        },
        // AST_UsingDef inside AST_Using; the parent decides.
        Data::VarDef { .. } => "VarDef",
        Data::Func { kind, .. } => match kind {
            FuncKind::Decl => "Defun",
            FuncKind::Expr => "Function",
            FuncKind::Arrow => "Arrow",
            FuncKind::Accessor => "Accessor",
        },
        Data::Class { stmt, .. } => {
            if *stmt {
                "DefClass"
            } else {
                "ClassExpression"
            }
        }
        Data::Return { .. } => "Return",
        Data::Throw { .. } => "Throw",
        Data::Break { .. } => "Break",
        Data::Continue { .. } => "Continue",
        Data::Import { .. } => "Import",
        Data::Export { .. } => "Export",
        Data::NameMap { .. } => "NameMapping",
        Data::Symbol { kind, .. } => match kind {
            SymKind::Ref => "SymbolRef",
            SymKind::Var => "SymbolVar",
            SymKind::Let => "SymbolLet",
            SymKind::Const => "SymbolConst",
            SymKind::Using => "SymbolUsing",
            SymKind::Funarg => "SymbolFunarg",
            SymKind::Defun => "SymbolDefun",
            SymKind::Lambda => "SymbolLambda",
            SymKind::Method => "SymbolMethod",
            SymKind::Class => "SymbolClass",
            SymKind::DefClass => "SymbolDefClass",
            SymKind::Catch => "SymbolCatch",
            SymKind::Label => "Label",
            SymKind::LabelRef => "LabelRef",
            SymKind::Import => "SymbolImport",
            SymKind::ImportForeign => "SymbolImportForeign",
            SymKind::Export => "SymbolExport",
            SymKind::ExportForeign => "SymbolExportForeign",
            SymKind::Private => "SymbolPrivateProperty",
            SymKind::ClassProperty => "SymbolClassProperty",
        },
        Data::This => "This",
        Data::Super => "Super",
        Data::NewTarget => "NewTarget",
        Data::Null => "Null",
        Data::True => "True",
        Data::False => "False",
        Data::Infinity => "Infinity",
        Data::Number { .. } => "Number",
        Data::BigInt { .. } => "BigInt",
        Data::String { .. } => "String",
        Data::RegExp { .. } => "RegExp",
        Data::Array { .. } => "Array",
        Data::Hole => "Hole",
        Data::Object { .. } => "Object",
        Data::Prop { method, key, private, .. } => match (method, *private || matches!(key, Key::Private(_))) {
            (None, _) => "ObjectKeyVal",
            (Some(MethodKind::Get), false) => "ObjectGetter",
            (Some(MethodKind::Set), false) => "ObjectSetter",
            (Some(MethodKind::Method), false) => "ConciseMethod",
            (Some(MethodKind::Get), true) => "PrivateGetter",
            (Some(MethodKind::Set), true) => "PrivateSetter",
            (Some(MethodKind::Method), true) => "PrivateMethod",
        },
        Data::Field { key, private, .. } => {
            if *private || matches!(key, Key::Private(_)) {
                "ClassPrivateProperty"
            } else {
                "ClassProperty"
            }
        }
        Data::StaticBlock { .. } => "ClassStaticBlock",
        Data::Spread { .. } => "Expansion",
        Data::Destructuring { .. } => "Destructuring",
        Data::Seq { .. } => "Sequence",
        Data::Dot { private, .. } => {
            if *private {
                "DotHash"
            } else {
                "Dot"
            }
        }
        Data::Sub { .. } => "Sub",
        Data::Chain { .. } => "Chain",
        Data::Call { is_new, .. } => {
            if *is_new {
                "New"
            } else {
                "Call"
            }
        }
        Data::Unary { prefix, .. } => {
            if *prefix {
                "UnaryPrefix"
            } else {
                "UnaryPostfix"
            }
        }
        Data::Binary { .. } => "Binary",
        Data::Assign { .. } => "Assign",
        Data::DefaultAssign { .. } => "DefaultAssign",
        Data::Cond { .. } => "Conditional",
        Data::Await { .. } => "Await",
        Data::Yield { .. } => "Yield",
        Data::Template { .. } => "TemplateString",
        Data::TaggedTemplate { .. } => "PrefixedTemplateString",
        Data::ImportMeta => "ImportMeta",
        Data::DynImport { .. } => "DynamicImport",
        Data::PrivateIn { .. } => "PrivateIn",
    }
}
