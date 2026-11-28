// node tools/walk-order.mjs [out.json] : terser 5.51.4's child visit orders on a set of snippets.
//
// For every snippet, three pre-order node lists, each node as `TYPE` or `TYPE:name` (symbols) or
// `TYPE:value` (numbers, strings). A leading `~` marks a node the port's AST keeps as plain data
// rather than a node: template segments (`ast::Seg::Cooked`) and the symbol of a non-computed
// property key (`ast::Key::Static` / `ast::Key::Private`).
//   walk       TreeWalker, i.e. `AST_Node._walk` (ast.js)
//   transform  TreeTransformer with a `before` that descends, i.e. `def_transform` (transform.js)
//   backwards  the `walk(node, cb)` helper (ast.js), i.e. `_children_backwards` popped from a stack
// `parser/tests/walk_order.rs` compares these with `ast::walk_children`, `ast::map_children` and
// `ast::children_backwards`. Writes JSON to stdout, or to out.json.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lib = path.join(root, "oracle/node_modules/terser/lib");
const { parse } = await import(path.join(lib, "parse.js"));
const ast = await import(path.join(lib, "ast.js"));
await import(path.join(lib, "transform.js"));
const { TreeWalker, TreeTransformer, walk, AST_Symbol, AST_Number, AST_String, AST_TemplateSegment,
    AST_ObjectProperty, AST_SymbolMethod, AST_SymbolClassProperty, AST_SymbolPrivateProperty } = ast;

// Every snippet is parsed as a module except those with a `with` statement. Together they cover every `ast::Data` variant.
export const SNIPPETS = [
    // Directive SimpleStatement EmptyStatement BlockStatement LabeledStatement For Break Continue Debugger
    `"use strict"; a; ; { b; c } l: for (;;) { if (a) break l; else continue l } debugger;`,
    `l: { break l }`,
    // Do While
    `do x(); while (y); while (z) w();`,
    // For with Var, Sequence step
    `for (var i = 0, j; i < n; i++, j--) f(i, j);`,
    // ForIn ForOf Destructuring
    `for (const k in o) g(k); for (let [a, b] of c) h(a, b); for (x.y in z); for ([p, q] of r);`,
    `async function f() { for await (const x of y) z(x) }`,
    // With
    `function w() { with (o) p; }`,
    // If
    `if (a) b(); else if (c) d(); else e(); if (f) g();`,
    // Switch Case Default
    `switch (x) { case 1: f(); break; default: g(); case y: h() }`,
    // Try TryBlock Catch Finally
    `try { a() } catch (e) { b(e) } finally { c() }`,
    `try { a() } catch { b() }`,
    `try {} catch ({ m, n: [o] }) {} finally {}`,
    // Var Let Const VarDef
    `var a = 1, b; let c = 2, [d, e] = f; const { g, h: i = 3, ...j } = k;`,
    // Using UsingDef
    `{ using u = r(); } async function au() { await using v = s(); }`,
    // Defun Function Arrow SymbolFunarg DefaultAssign Expansion Return
    `function f(a, b = 1, ...c) { return a; } var g = function h({ x, y: [z] }, [w] = v) { return; };`,
    `var k = async (p) => p * 2, l = () => { q() }, m = async ([n], ...o) => { await n };`,
    // Yield
    `function* gen() { yield; yield 1; yield* o; }`,
    // DefClass ClassExpression ClassProperty ClassPrivateProperty ClassStaticBlock methods Super NewTarget PrivateIn DotHash
    `class A extends B { constructor() { super(); new.target; super.x; } static s = 1; #p = 2; x; [k] = 3; static #sp; get g() { return this.#p } set g(v) {} static { q() } m() {} *gm() {} async am() {} #pm() { return #p in this } get #pg() {} set #ps(v) {} static async *[sk]() {} }`,
    `var C = class D extends (E, F) { [G] = H; }; var I = class {};`,
    // Object ObjectKeyVal ObjectGetter ObjectSetter ConciseMethod computed keys Expansion
    `x = { a: 1, [b]: 2, c, d() {}, get e() { return 1 }, set e(v) {}, ...f, async *g() {}, [h]() {}, get [i]() {}, "j": k, 1: l };`,
    // Array Hole Expansion
    `y = [1, , ...z, [w]];`,
    // Sequence Dot Sub Chain Call New
    `a, b; a.b; a?.b.c; a[b]; a?.[b][c]; f(x, y); new F(z); new G; a?.(b); a.b(c)(d); f(...a, b); (a?.b)();`,
    // UnaryPrefix UnaryPostfix Binary Assign
    `!a; a++; --b; a + b * c; a = b; a += 1; a ||= b; a ??= c; typeof t; void 0; (-x) ** 2; a in b; a instanceof c;`,
    // destructuring assignment
    `({ a = 1, b: { c } } = o); [p = 2, ...q] = r; [s.t, u[v]] = w;`,
    // Conditional
    `c ? d : e ? f : g;`,
    // Null True False Number BigInt String RegExp This, NaN / undefined / Infinity are SymbolRefs
    `null; true; false; 1; 10n; "s"; /re/g; this; NaN; undefined; Infinity; 1e999;`,
    // TemplateString TemplateSegment PrefixedTemplateString
    "`a${b}c${d + e}`; tag`x${y}`; f.g`h`; `plain`;",
    // Await Throw
    `async function af() { await x; throw y; }`,
    // Import NameMapping SymbolImport SymbolImportForeign
    `import d, { a as b, c } from "m"; import * as ns from "n"; import "side" with { type: "json" }; import e from "o" with { type: "json" };`,
    // Export SymbolExport SymbolExportForeign
    `export { d as e, f }; export * from "m2"; export * as q from "m3"; export { a } from "m4" with { type: "json" }; export default 1;`,
    `export const z = 1, w = 2; export function ef() {} export class EC {}`,
    `export default function () {}`,
    `export default class {}`,
    `export default function named() {}`,
    `export default (a, b);`,
    // ImportMeta DynamicImport
    `import.meta.url; import("x"); import("y", { with: { type: "json" } });`,
    // labels and nested functions inside loops
    `outer: while (a) { inner: do { if (b) continue outer; break inner } while (c) }`,
    // arguments of nested calls, callee is a call
    `f(g(h(1), i), j)(k); new (f(a))(b); a.b.c(d)[e](f);`,
];

// Property keys that are symbols but not computed (`[k]` keys are expressions).
function data_keys(top) {
    const keys = new Set();
    top.walk(new TreeWalker(node => {
        if (node instanceof AST_ObjectProperty) {
            const k = node.key;
            if (k instanceof AST_SymbolMethod || k instanceof AST_SymbolClassProperty || k instanceof AST_SymbolPrivateProperty)
                keys.add(k);
        }
    }));
    return keys;
}

function label(node, keys) {
    let s = node.TYPE;
    if (node instanceof AST_TemplateSegment || keys.has(node)) s = "~" + s;
    if (node instanceof AST_Symbol) s += ":" + node.name;
    else if (node instanceof AST_Number) s += ":" + node.value;
    else if (node instanceof AST_String) s += ":" + node.value;
    return s;
}

function orders(src) {
    const top = parse(src, { module: !/\bwith \(/.test(src) });
    const keys = data_keys(top);
    const label_ = node => label(node, keys);
    const w = [];
    top.walk(new TreeWalker(node => { w.push(label_(node)); }));
    const t = [];
    const tt = new TreeTransformer(function (node, descend) {
        t.push(label_(node));
        descend(node, this);
        return node;
    });
    top.transform(tt);
    const b = [];
    walk(top, node => { b.push(label_(node)); });
    return { src, module: !/\bwith \(/.test(src), walk: w, transform: t, backwards: b };
}

const out = JSON.stringify(SNIPPETS.map(orders), null, 1) + "\n";
if (process.argv[2]) fs.writeFileSync(process.argv[2], out);
else process.stdout.write(out);
