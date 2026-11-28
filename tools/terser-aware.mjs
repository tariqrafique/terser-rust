// node tools/terser-aware.mjs < in.js : terser 5.51.4 with the lwc-rollup options (mangling on) but the
// mangle phase skipped: the compressor output of a mangled build, names unmangled.
// The port's counterpart is `target/release/examples/try_aware`.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { minify } = await import(path.join(root, "oracle/node_modules/terser/main.js"));
const AST = await import(path.join(root, "oracle/node_modules/terser/lib/ast.js"));
AST.AST_Toplevel.prototype.mangle_names = function () {};
AST.AST_Toplevel.prototype.compute_char_frequency = function () {};
const src = fs.readFileSync(0, "utf8");
const opts = { compress: true, mangle: true, sourceMap: false, format: { wrap_func_args: false }, module: true };
console.log((await minify(src, opts)).code);
