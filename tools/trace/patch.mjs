// node tools/trace/patch.mjs <terser-copy-dir> : add trace events to a copy of terser 5.51.4.
// Each patch must match exactly once; a mismatch (another terser version) stops setup.
// Events are JSON lines appended to $TERSER_TRACE (see tools/README.md, "Trace diff").
import fs from "fs";
import path from "path";

const dir = process.argv[2];
if (!dir) throw new Error("usage: patch.mjs <terser dir>");
const lib = path.join(dir, "lib");

const IMPORT = "import { trace_on as __trace_on, trace_opt as __trace_opt, trace as __trace, code as __trace_code,"
    + " reserve as __trace_reserve, fill as __trace_fill } from \"../__trace.js\";\n";

function patch(rel, edits) {
    const file = path.join(lib, rel);
    let src = IMPORT + fs.readFileSync(file, "utf8");
    for (const [from, to] of edits) {
        const n = src.split(from).length - 1;
        if (n !== 1) throw new Error(`${rel}: expected one match, found ${n}: ${from.slice(0, 80)}`);
        src = src.replace(from, () => to);
    }
    fs.writeFileSync(file, src);
}

// Shared helper: one fd, printed code truncated the same way as compress/src/trace.rs.
fs.writeFileSync(path.join(lib, "__trace.js"), `import fs from "fs";
const file = process.env.TERSER_TRACE;
export const trace_on = !!file;
export const trace_opt = trace_on && !!process.env.TERSER_TRACE_OPT && process.env.TERSER_TRACE_OPT !== "0";
const fd = trace_on ? fs.openSync(file, "a") : null;
// A decision whose own work emits events (an inlined lambda is optimized before
// inline_into_symbolref returns) reserves its place first, so events stay in the
// order the decisions were started. Lines are held while a slot is open.
const pending = [];
let open = 0;
function write(ev) {
    fs.writeSync(fd, JSON.stringify(ev) + "\\n");
}
export function trace(ev) {
    if (open) pending.push(ev);
    else write(ev);
}
export function reserve() {
    open++;
    pending.push(null);
    return pending.length - 1;
}
export function fill(slot, ev) {
    pending[slot] = ev;
    if (--open) return;
    for (const e of pending) if (e) write(e);
    pending.length = 0;
}
const MAX = 240, HEAD = 160, TAIL = 60;
function fnv(s) {
    let h = 0x811c9dc5;
    for (const b of Buffer.from(s, "utf8")) h = Math.imul(h ^ b, 0x01000193) >>> 0;
    return h.toString(16).padStart(8, "0");
}
// More than MAX code points: HEAD first, "…", TAIL last, then " #<utf8 bytes>:<fnv1a32>".
export function trunc(s) {
    if (s.length <= MAX) return s;
    const cps = Array.from(s);
    if (cps.length <= MAX) return s;
    return cps.slice(0, HEAD).join("") + "\\u2026" + cps.slice(-TAIL).join("")
        + " #" + Buffer.byteLength(s, "utf8") + ":" + fnv(s);
}
export function code(node) {
    let s;
    try {
        s = node.print_to_string();
    } catch (e) {
        s = "<print error " + (node && node.TYPE) + ">";
    }
    return trunc(s);
}
`);


// collapse: one event per candidate, after its scan.
patch("compress/tighten-body.js", [
    [
        "                var candidate = hit_stack[hit_stack.length - 1];\n",
        "                var candidate = hit_stack[hit_stack.length - 1];\n" +
        "                var __tc = __trace_on ? __trace_code(candidate) : null;\n",
    ],
    [
        "                if (!lhs || is_lhs_read_only(lhs) || lhs.has_side_effects(compressor))\n                    continue;\n",
        "                if (!lhs || is_lhs_read_only(lhs) || lhs.has_side_effects(compressor)) {\n" +
        "                    if (__tc !== null) __trace({ k: \"collapse\", cand: __tc, ok: false,\n" +
        "                        why: !lhs ? \"no_lhs\" : is_lhs_read_only(lhs) ? \"read_only\" : \"lhs_side_effects\" });\n" +
        "                    continue;\n" +
        "                }\n",
    ],
    [
        "                if (replaced && !remove_candidate(candidate))\n",
        "                if (__tc !== null) __trace({ k: \"collapse\", cand: __tc, ok: true, abort: !!abort,\n" +
        "                    replaced: +replaced || 0, value_def: !!value_def });\n" +
        "                if (replaced && !remove_candidate(candidate))\n",
    ],
]);

// pass boundaries and the optional per-node optimize results (Compressor.before).
patch("compress/index.js", [
    [
        "        for (var pass = 0; pass < passes; pass++) {\n",
        "        for (var pass = 0; pass < passes; pass++) {\n" +
        "            if (__trace_on) __trace({ k: \"pass\", n: pass });\n",
    ],
    [
        "        var opt = node.optimize(this);\n",
        "        var __ti = __trace_opt ? __trace_code(node) : null;\n" +
        "        var opt = node.optimize(this);\n" +
        "        if (__ti !== null) {\n" +
        "            var __to = __trace_code(opt);\n" +
        "            if (__to !== __ti) __trace({ k: \"opt\", t: node.TYPE, code: __ti, out: __to });\n" +
        "        }\n",
    ],
]);

// inline_into_symbolref / inline_into_call: wrappers; the branch taken is
// recorded at each return site of inline_into_call.
patch("compress/inline.js", [
    ["export function inline_into_symbolref(self, compressor) {\n", "function __inline_into_symbolref(self, compressor) {\n"],
    ["export function inline_into_call(self, compressor) {\n", "function __inline_into_call(self, compressor) {\n"],
    [
        "            const args = self.args.concat(returned);\n            return make_sequence",
        "            const args = self.args.concat(returned);\n            __ic_how = \"const_return\";\n            return make_sequence",
    ],
    [
        "                return make_sequence(self, [\n",
        "                __ic_how = \"identity\";\n                return make_sequence(self, [\n",
    ],
    [
        "            return replacement;\n",
        "            __ic_how = \"identity\";\n            return replacement;\n",
    ],
    [
        "            return make_sequence(self, flatten_fn(returned_value)).optimize(compressor);\n",
        "            __ic_how = \"flatten\";\n            return make_sequence(self, flatten_fn(returned_value)).optimize(compressor);\n",
    ],
    [
        "        return fixed.optimize(compressor);\n",
        "        if (__trace_on) __inline_fixed = __trace_code(fixed);\n        return fixed.optimize(compressor);\n",
    ],
    [
        "        return make_node(AST_Call, self, {\n",
        "        __ic_how = \"inline_annotation\";\n        return make_node(AST_Call, self, {\n",
    ],
    [
        "        var args = self.args.concat(make_void_0(self));\n        return make_sequence",
        "        var args = self.args.concat(make_void_0(self));\n        __ic_how = \"drop_empty\";\n        return make_sequence",
    ],
]);
// A single-use lambda is reported as it is before its `fixed.optimize(compressor)`:
// the port runs that tighten_body later, when the transform reaches the copy.
fs.appendFileSync(path.join(lib, "compress/inline.js"), `
let __ic_how = null;
let __inline_fixed = null;

export function inline_into_symbolref(self, compressor) {
    if (!__trace_on) return __inline_into_symbolref(self, compressor);
    const def = self.definition();
    const single = !!(def && def.single_use);
    const slot = __trace_reserve();
    const prev = __inline_fixed;
    __inline_fixed = null;
    const out = __inline_into_symbolref(self, compressor);
    const fixed = __inline_fixed;
    __inline_fixed = prev;
    __trace_fill(slot, out !== self || single
        ? { k: "inline", name: self.name, single, out: out === self ? null : fixed !== null ? fixed : __trace_code(out) }
        : null);
    return out;
}

export function inline_into_call(self, compressor) {
    if (!__trace_on) return __inline_into_call(self, compressor);
    const call = __trace_code(self);
    const slot = __trace_reserve();
    const prev = __ic_how;
    __ic_how = null;
    const out = __inline_into_call(self, compressor);
    const how = __ic_how;
    __ic_how = prev;
    __trace_fill(slot, how ? { k: "inline_call", how, call, out: __trace_code(out) } : null);
    return out;
}
`);
