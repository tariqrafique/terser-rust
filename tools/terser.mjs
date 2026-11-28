// node tools/terser.mjs '<minify options JSON>' < input.js : terser 5.51.4 (the oracle) output.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { minify } = await import(path.join(root, "oracle/node_modules/terser/main.js"));
const src = fs.readFileSync(0, "utf8");
const opts = process.argv[2] && process.argv[2].length ? JSON.parse(process.argv[2]) : {};
console.log((await minify(src, opts)).code);
