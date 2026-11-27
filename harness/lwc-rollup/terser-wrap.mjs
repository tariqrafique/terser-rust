// Pass-through around the oracle's terser.minify. Records the arguments, then calls it.
import fs from "node:fs";
import path from "node:path";
import { minify as realMinify } from "../../oracle/node_modules/terser/main.js";

const dir = process.env.MINIFY_CAPTURE_DIR;

export async function minify(code, options) {
    if (dir) {
        const name = `${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`;
        const snapshot = JSON.parse(JSON.stringify(options));
        fs.writeFileSync(path.join(dir, name), JSON.stringify({ code, options: snapshot }));
    }
    return realMinify(code, options);
}
