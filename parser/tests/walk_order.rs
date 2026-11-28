//! `ast::walk_children`, `ast::transform_children` / `ast::map_children` and
//! `ast::children_backwards` against terser's own visit orders. terser's lists come from
//! `tools/walk-order.mjs`, run live when node and the oracle are installed; otherwise from the
//! committed `walk_order.json`, which the live run also checks is current. Regenerate it with
//! `node tools/walk-order.mjs parser/tests/walk_order.json`.

use ast::{Data, DefKind, FuncKind, MethodKind, N};
use std::collections::BTreeSet;
use std::path::PathBuf;

fn root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("..")
}

fn fixture() -> serde_json::Value {
    let committed_path = root().join("parser/tests/walk_order.json");
    let committed = std::fs::read_to_string(&committed_path).expect("walk_order.json");
    let oracle = root().join("oracle/node_modules/terser/lib/ast.js");
    let live = if oracle.exists() {
        std::process::Command::new("node")
            .arg(root().join("tools/walk-order.mjs"))
            .output()
            .ok()
            .filter(|o| o.status.success())
            .map(|o| String::from_utf8(o.stdout).unwrap())
    } else {
        None
    };
    match live {
        Some(live) => {
            assert!(
                live == committed,
                "parser/tests/walk_order.json is stale: node tools/walk-order.mjs parser/tests/walk_order.json"
            );
            serde_json::from_str(&live).unwrap()
        }
        None => {
            eprintln!("walk_order: terser oracle not available, using the committed walk_order.json");
            serde_json::from_str(&committed).unwrap()
        }
    }
}

#[derive(Clone, Copy, PartialEq)]
enum Order {
    Walk,
    Transform,
    Map,
}

/// terser's label for `n` as `tools/walk-order.mjs` prints it, or None where terser has no node.
fn label(n: &N, parent: Option<&N>) -> Option<String> {
    let mut ty = ast::terser_type(n).to_string();
    match (parent.map(|p| &p.data), &n.data) {
        (Some(Data::Try { body, .. }), _) if std::rc::Rc::ptr_eq(body, n) => ty = "TryBlock".into(),
        (Some(Data::Catch { .. } | Data::Finally { .. }), Data::Block { .. }) => return None,
        (Some(Data::Defs { kind: DefKind::Using, .. }), Data::VarDef { .. }) => ty = "UsingDef".into(),
        // The parser gives a concise method (`m() {}`) a `FuncKind::Expr` value; terser's is an
        // `AST_Accessor`, like a getter's or setter's.
        (Some(Data::Prop { method: Some(MethodKind::Method), .. }), Data::Func { kind: FuncKind::Expr, .. }) => ty = "Accessor".into(),
        _ => {}
    }
    Some(match &n.data {
        Data::Symbol { name, .. } => format!("{ty}:{name}"),
        Data::This => format!("{ty}:this"),
        Data::Super => format!("{ty}:super"),
        Data::Number { value, .. } => format!("{ty}:{value}"),
        Data::String { value, .. } => format!("{ty}:{value}"),
        _ => ty,
    })
}

fn pre_order(n: &N, parent: Option<&N>, order: Order, out: &mut Vec<String>) {
    out.extend(label(n, parent));
    match order {
        Order::Walk => ast::walk_children(n, &mut |c| pre_order(c, Some(n), order, out)),
        Order::Transform => ast::transform_children(n, &mut |c| pre_order(c, Some(n), order, out)),
        Order::Map => {
            let _ = ast::map_children(n, &mut |c| {
                pre_order(c, Some(n), order, out);
                c.clone()
            });
        }
    }
}

/// terser's `walk(node, cb)`: pop a node, visit it, push its `_children_backwards`.
fn stack_order(top: &N) -> Vec<String> {
    let mut out = Vec::new();
    let mut stack: Vec<(N, Option<N>)> = vec![(top.clone(), None)];
    while let Some((n, parent)) = stack.pop() {
        out.extend(label(&n, parent.as_ref()));
        ast::children_backwards(&n, &mut |c| stack.push((c.clone(), Some(n.clone()))));
    }
    out
}

fn variant(d: &Data) -> &'static str {
    match d {
        Data::Toplevel { .. } => "Toplevel",
        Data::Directive { .. } => "Directive",
        Data::Simple { .. } => "Simple",
        Data::Empty => "Empty",
        Data::Block { .. } => "Block",
        Data::Labeled { .. } => "Labeled",
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
        Data::Defs { .. } => "Defs",
        Data::VarDef { .. } => "VarDef",
        Data::Func { .. } => "Func",
        Data::Class { .. } => "Class",
        Data::Return { .. } => "Return",
        Data::Throw { .. } => "Throw",
        Data::Break { .. } => "Break",
        Data::Continue { .. } => "Continue",
        Data::Import { .. } => "Import",
        Data::Export { .. } => "Export",
        Data::NameMap { .. } => "NameMap",
        Data::Symbol { .. } => "Symbol",
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
        Data::Prop { .. } => "Prop",
        Data::Field { .. } => "Field",
        Data::StaticBlock { .. } => "StaticBlock",
        Data::Spread { .. } => "Spread",
        Data::Destructuring { .. } => "Destructuring",
        Data::Seq { .. } => "Seq",
        Data::Dot { .. } => "Dot",
        Data::Sub { .. } => "Sub",
        Data::Chain { .. } => "Chain",
        Data::Call { .. } => "Call",
        Data::Unary { .. } => "Unary",
        Data::Binary { .. } => "Binary",
        Data::Assign { .. } => "Assign",
        Data::DefaultAssign { .. } => "DefaultAssign",
        Data::Cond { .. } => "Cond",
        Data::Await { .. } => "Await",
        Data::Yield { .. } => "Yield",
        Data::Template { .. } => "Template",
        Data::TaggedTemplate { .. } => "TaggedTemplate",
        Data::ImportMeta => "ImportMeta",
        Data::DynImport { .. } => "DynImport",
        Data::PrivateIn { .. } => "PrivateIn",
    }
}

const ALL_VARIANTS: usize = 68;

fn terser_list(v: &serde_json::Value) -> Vec<String> {
    v.as_array()
        .unwrap()
        .iter()
        .map(|s| s.as_str().unwrap().to_string())
        .filter(|s| !s.starts_with('~'))
        .collect()
}

#[test]
fn child_orders_match_terser() {
    let fix = fixture();
    let mut seen = BTreeSet::new();
    let mut failures = Vec::new();
    for case in fix.as_array().unwrap() {
        let src = case["src"].as_str().unwrap();
        let top = parser::parse(src).unwrap_or_else(|e| panic!("parse {src:?}: {}", e.message));
        ast::walk(&top, &mut |n| {
            seen.insert(variant(&n.data));
            false
        });
        let mut walk = Vec::new();
        pre_order(&top, None, Order::Walk, &mut walk);
        let mut transform = Vec::new();
        pre_order(&top, None, Order::Transform, &mut transform);
        let mut map = Vec::new();
        pre_order(&top, None, Order::Map, &mut map);
        let backwards = stack_order(&top);
        for (name, got, want) in [
            ("walk_children vs _walk", &walk, terser_list(&case["walk"])),
            ("transform_children vs def_transform", &transform, terser_list(&case["transform"])),
            ("map_children vs def_transform", &map, terser_list(&case["transform"])),
            ("children_backwards vs _children_backwards", &backwards, terser_list(&case["backwards"])),
        ] {
            if *got != want {
                let i = got.iter().zip(&want).take_while(|(a, b)| a == b).count();
                failures.push(format!(
                    "{name} on {src:?}\n  at {i}: port {:?}, terser {:?}\n  port:   {}\n  terser: {}",
                    got.get(i),
                    want.get(i),
                    got.join(" "),
                    want.join(" ")
                ));
            }
        }
    }
    assert!(failures.is_empty(), "{}", failures.join("\n"));
    assert_eq!(seen.len(), ALL_VARIANTS, "snippets miss a Data variant; seen {seen:?}");
}
