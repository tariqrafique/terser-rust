// node tools/trace/terser-trace.mjs '<minify options JSON>' < input.js
// The instrumented terser copy (tools/trace/setup.sh). Events go to $TERSER_TRACE.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dir = path.join(root, "tools/.cache/terser-trace/node_modules/terser");
const { minify } = await import(path.join(dir, "main.js"));
const ast = await import(path.join(dir, "lib/ast.js"));
const tr = await import(path.join(dir, "lib/__trace.js"));

// drop_unused (drop-unused.js, a prototype method): one event per scope it runs on,
// the scope printed before and after ("=" when unchanged).
if (tr.trace_on) {
    const orig = ast.AST_Scope.prototype.drop_unused;
    ast.AST_Scope.prototype.drop_unused = function (compressor) {
        if (!compressor.option("unused") || compressor.has_directive("use asm")
            || !this.variables || this instanceof ast.AST_Class) {
            return orig.call(this, compressor);
        }
        const code = tr.code(this);
        const r = orig.call(this, compressor);
        const out = tr.code(this);
        tr.trace({ k: "drop_unused", t: this.TYPE, code, out: out === code ? "=" : out });
        return r;
    };
}

const src = fs.readFileSync(0, "utf8");
const opts = process.argv[2] && process.argv[2].length ? JSON.parse(process.argv[2]) : {};
console.log((await minify(src, opts)).code);
