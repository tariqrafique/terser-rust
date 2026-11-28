// node tools/size.mjs [out.json] : terser 5.51.4's `AST_Node.size()` (lib/size.js) for every node
// of a set of snippets, without a compressor (what `best_of` uses).
//
// For every snippet, the TreeWalker pre-order list of `[label, size]`, labels as in
// `tools/walk-order.mjs` (nodes the port keeps as data, template segments and the symbols of
// non-computed property keys, are left out). `compress/src/size.rs` compares these with
// `size::size`. Writes JSON to stdout, or to out.json.
// node tools/size.mjs --code '<js>' : the size of every expression statement in <js>.
// node tools/size.mjs --files a.js ... > out.json : the same lists for files; check them with
// `SIZE_JSON=out.json cargo test -p compress --lib size`.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lib = path.join(root, "oracle/node_modules/terser/lib");
const { parse } = await import(path.join(lib, "parse.js"));
const ast = await import(path.join(lib, "ast.js"));
await import(path.join(lib, "output.js"));
await import(path.join(lib, "size.js"));
await import(path.join(lib, "scope.js"));
const { TreeWalker, AST_Symbol, AST_Number, AST_String, AST_TemplateSegment, AST_ObjectProperty,
    AST_SymbolMethod, AST_SymbolClassProperty, AST_SymbolPrivateProperty, AST_SimpleStatement } = ast;

export const SNIPPETS = [
    // statements
    `"use strict"; a; ; { b; c } l: for (;;) { if (a) break l; else continue l } debugger;`,
    `do x(); while (y); while (z) w(); for (var i = 0, j; i < n; i++, j--) f(i, j);`,
    `for (const k in o) g(k); for (let [a, b] of c) h(a, b); for (x.y in z); for ([p, q] of r);`,
    `async function f() { for await (const x of y) z(x) }`,
    `function w() { with (o) p; }`,
    `if (a) b(); else if (c) d(); else e(); if (f) g();`,
    `switch (x) { case 1: f(); break; default: g(); case y: h() }`,
    `try { a() } catch (e) { b(e) } finally { c() } try { a() } catch { b() }`,
    `try {} catch ({ m, n: [o] }) {} finally {}`,
    `var a = 1, b; let c = 2, [d, e] = f; const { g, h: i = 3, ...j } = k;`,
    `{ using u = r(); } async function au() { await using v = s(); }`,
    // functions
    `function f(a, b = 1, ...c) { return a; } var g = function h({ x, y: [z] }, [w] = v) { return; };`,
    `var k = async (p) => p * 2, l = () => { q() }, m = async ([n], ...o) => { await n };`,
    `x => x; (x, y) => x + y; x => ({}); x => function () {}; async x => await x; ([a]) => a; () => {};`,
    `a(b => c || d); a(b => c ? d : e); (x => y) && z; !(x => y || z); x => a = b; x => (a, b);`,
    `function* gen() { yield; yield 1; yield* o; } (function () {}); (function* () {})(); (async function () {});`,
    `(function () {}).call(x); (function () {})\`\`; !function () {}; x = function () {};`,
    // classes
    `class A extends B { constructor() { super(); new.target; super.x; } static s = 1; #p = 2; x; [k] = 3; static #sp; get g() { return this.#p } set g(v) {} static { q() } m() {} *gm() {} async am() {} #pm() { return #p in this } get #pg() {} set #ps(v) {} static async *[sk]() {} }`,
    `var C = class D extends (E, F) { [G] = H; }; var I = class {}; (class {}); (class X {}).y;`,
    // objects
    `x = { a: 1, [b]: 2, c, d() {}, get e() { return 1 }, set e(v) {}, ...f, async *g() {}, [h]() {}, get [i]() {}, "j": k, 1: l, 1.5: m, "\\u00e9": n, é: o, 1e3: p };`,
    `({}); ({}).a; ({}).a(); ({} = x); ({ a } = x); ({}, y); ({}) ? 1 : 2; ({}) + 1; ({})[0]; ({})\`\`; [{}];`,
    `y = [1, , ...z, [w]]; [, , ]; [];`,
    // expressions
    `a, b; a.b; a?.b.c; a[b]; a?.[b][c]; f(x, y); new F(z); new G; a?.(b); a.b(c)(d); f(...a, b); (a?.b)();`,
    `!a; a++; --b; a + b * c; a = b; a += 1; a ||= b; a ??= c; typeof t; void 0; (-x) ** 2; a in b; a instanceof c; delete a.b; ~a; -a; +a;`,
    `(a + b) * c; a * (b + c); a - (b - c); (a - b) - c; a ** b ** c; (a ** b) ** c; (a, b) + c; (a = b) + c; a + (b = c);`,
    `(a || b) && c; a || b && c; (a && b) || c; a ?? (b || c); (a ?? b) || c; (a || b) ?? c; !(a || b); !(a in b); !(a && b) || !c;`,
    `(a + b)(); (a + b).c; (a + b)[c]; (a || b)?.c; typeof (a + b); void (a, b); new (a || b)(); -(a - b); a - -b; a + +b; a - +b; a + -b;`,
    `(a = b) ? c : d; (a = b).c; (a = b)(); !(a = b); a = b = c; [a = b] = c; ({ a } = b); f(a = b); (a ? b : c) + d; a ? (b, c) : d; (a, b) ? c : d;`,
    `class P { #x; m() { #x in a; (#x in a) + 1; (a, #x in b); #x in (a || b); !(#x in a); a.#x; a?.#x; } }`,
    `c ? d : e ? f : g; a ? b : c;`,
    `null; true; false; 0; 1; 10; 99; 100; 1000; 123456789; 1e21; 1.5; 0.1; .5; 1e-7; 1e999; 0x10; 10n; 0x1fn; NaN; undefined; Infinity; arguments; this;`,
    `"s"; ""; 'a"b'; "a\\nb"; "\\u00e9"; "é"; "😀"; /re/g; /a\\/b/gimsuy; /[/]/;`,
    "`a${b}c${d + e}`; tag`x${y}`; f.g`h`; `plain`; `\\n${a}\\u00e9`; `${a}${b}`; ``;",
    `async function af() { await x; throw y; await (a || b); }`,
    `import d, { a as b, c } from "m"; import * as ns from "n"; import "side"; export { d as e, f }; export * from "m2"; export const z = 1; export function ef() {} export class EC {}`,
    `import.meta.url; import("x"); import("y", { with: { type: "json" } });`,
    `outer: while (a) { inner: do { if (b) continue outer; break inner } while (c) }`,
    `f(g(h(1), i), j)(k); new (f(a))(b); a.b.c(d)[e](f);`,
];

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

function label(node) {
    let s = node.TYPE;
    if (node instanceof AST_Symbol) s += ":" + node.name;
    else if (node instanceof AST_Number) s += ":" + node.value;
    else if (node instanceof AST_String) s += ":" + node.value;
    return s;
}

function sizes(src) {
    const top = parse(src, { module: !/\bwith \(/.test(src) });
    const keys = data_keys(top);
    const out = [];
    top.walk(new TreeWalker(node => {
        if (node instanceof AST_TemplateSegment || keys.has(node)) return;
        out.push([label(node), node.size()]);
    }));
    return { src, sizes: out };
}

if (process.argv[2] === "--code") {
    const top = parse(process.argv[3], { module: true });
    top.figure_out_scope({ module: true });
    for (const st of top.body) {
        if (st instanceof AST_SimpleStatement) console.log(st.body.size(), st.body.print_to_string());
        else console.log(st.size(), st.print_to_string());
    }
} else if (process.argv[2] === "--files") {
    const srcs = process.argv.slice(3).map(f => fs.readFileSync(f, "utf8"));
    process.stdout.write(JSON.stringify(srcs.map(sizes)) + "\n");
} else {
    const out = JSON.stringify(SNIPPETS.map(sizes)) + "\n";
    if (process.argv[2]) fs.writeFileSync(process.argv[2], out);
    else process.stdout.write(out);
}
