// node tools/reduce.mjs <file> <optionsJSON> DIFF DIFF : greedy removal of top-level statements while terser and the release `try` still differ.
// Caveat: removing a declaration turns its name into an undeclared global, which can create a different diff.
import { minify } from "../oracle/node_modules/terser/main.js";
import { parse } from "../oracle/node_modules/terser/lib/parse.js";
import "../oracle/node_modules/terser/lib/output.js";
import fs from "fs";
import { execFileSync } from "child_process";
const [file, optsJ, rustNeedle, terserNeedle] = process.argv.slice(2);
const opts = JSON.parse(optsJ);
const src = fs.readFileSync(file, "utf8");
const ast = parse(src, { module: true });
let stmts = ast.body.map(s => s.print_to_string());
const rust = code => execFileSync(new URL("../target/release/examples/try", import.meta.url).pathname, [optsJ], { input: code }).toString();
async function bad(list) {
  const code = list.join("\n");
  let t;
  try { t = (await minify(code, opts)).code; } catch { return false; }
  const r = rust(code);
  if (rustNeedle === "DIFF") return r.trim() !== t.trim();
  return r.includes(rustNeedle) && !t.includes(terserNeedle) ;
}
if (!(await bad(stmts))) { console.log("not reproducing"); process.exit(1); }
let changed = true;
while (changed) {
  changed = false;
  for (let i = stmts.length - 1; i >= 0; i--) {
    const trial = stmts.slice(0, i).concat(stmts.slice(i + 1));
    if (await bad(trial)) { stmts = trial; changed = true; }
  }
}
console.log(stmts.join("\n"));
