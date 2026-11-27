// Mirrors terser 5.51.4 test/compress.js for one extracted case.
// Node is the oracle. The Rust minify path does not import this file.

import { pathToFileURL } from "url";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const terserRoot = path.resolve(here, "../../oracle/node_modules/terser");

const mainUrl = pathToFileURL(path.join(terserRoot, "main.js")).href;
const parseUrl = pathToFileURL(path.join(terserRoot, "lib/parse.js")).href;
const astUrl = pathToFileURL(path.join(terserRoot, "lib/ast.js")).href;
const outputUrl = pathToFileURL(path.join(terserRoot, "lib/output.js")).href;
const compressUrl = pathToFileURL(path.join(terserRoot, "lib/compress/index.js")).href;
const propmangleUrl = pathToFileURL(path.join(terserRoot, "lib/propmangle.js")).href;

// main.js loads lib/transform.js, which installs AST print/transform methods.
await import(mainUrl);
const { parse } = await import(parseUrl);
const AST = await import(astUrl);
const { OutputStream } = await import(outputUrl);
const { Compressor } = await import(compressUrl);
const { reserve_quoted_keys, mangle_properties, mangle_private_properties } = await import(propmangleUrl);

export { parse, AST, OutputStream };

function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function makeCode(ast, options) {
    if (
        ast instanceof AST.AST_SimpleStatement
        && ast.body instanceof AST.AST_TemplateString
        && ast.body.segments.length === 1
    ) {
        return ast.body.segments[0].value;
    }
    const stream = OutputStream(options);
    ast.print(stream);
    return stream.get();
}

export function evalExpr(code) {
    return new Function("return(" + code + ")")();
}

function cloneVal(value, seen = new Map()) {
    if (value === null || typeof value !== "object") return value;
    if (seen.has(value)) return seen.get(value);
    if (value instanceof RegExp) return new RegExp(value.source, value.flags);
    if (Array.isArray(value)) {
        const copy = [];
        seen.set(value, copy);
        for (const item of value) copy.push(cloneVal(item, seen));
        return copy;
    }
    const copy = {};
    seen.set(value, copy);
    for (const key of Object.keys(value)) copy[key] = cloneVal(value[key], seen);
    return copy;
}

function transformCache(cache) {
    if (!cache) return;
    if (!("props" in cache)) {
        cache.props = new Map();
    } else if (!(cache.props instanceof Map)) {
        const props = new Map();
        for (const key in cache.props) {
            if (HOP(cache.props, key) && key.charAt(0) === "$") {
                props.set(key.slice(1), cache.props[key]);
            }
        }
        cache.props = props;
    }
}

/**
 * Run the compress.js pipeline (not minify()) on `input`.
 * `spec.options` is the test's compress options object. `false_by_default`
 * follows the runner: true unless `options.defaults` is true.
 */
export function runFixture(input, spec) {
    const parsed = parse(input, spec.parse);
    const mangle = spec.mangle && spec.mangle !== true ? cloneVal(spec.mangle) : spec.mangle;
    parsed.figure_out_scope(mangle);

    const options = cloneVal(spec.options || {});
    if (mangle && mangle.properties && mangle.properties.keep_quoted) {
        if (!Array.isArray(mangle.properties.reserved)) mangle.properties.reserved = [];
        if (mangle.properties.keep_quoted !== "strict") {
            reserve_quoted_keys(parsed, mangle.properties.reserved);
        }
    }
    if (spec.rename) {
        parsed.figure_out_scope(mangle);
        parsed.expand_names(mangle);
    }
    let output = new Compressor(options, {
        false_by_default: options.defaults === undefined ? true : !options.defaults,
        mangle_options: mangle,
    }).compress(parsed);
    output.figure_out_scope(mangle);
    if (mangle) {
        transformCache(mangle.cache);
        output.compute_char_frequency(mangle);
        output.mangle_names(mangle);
        mangle_private_properties(output, mangle);
        if (mangle.properties) output = mangle_properties(output, mangle.properties);
    }
    return makeCode(output, spec.format || {});
}

export function specFromCase(entry) {
    const exprs = entry.exprs || {};
    return {
        options: exprs.options ? evalExpr(exprs.options) : {},
        mangle: exprs.mangle ? evalExpr(exprs.mangle) : false,
        format: exprs.format ? evalExpr(exprs.format) : {},
        parse: exprs.parse ? evalExpr(exprs.parse) : undefined,
        rename: exprs.rename ? !!evalExpr(exprs.rename) : false,
    };
}

export function toTaggedJson(value) {
    if (value === undefined) return undefined;
    if (value === null) return null;
    const kind = typeof value;
    if (kind === "string" || kind === "boolean") return value;
    if (kind === "number") {
        if (!Number.isFinite(value)) {
            throw new Error("non-finite number in options");
        }
        return value;
    }
    if (kind === "function") {
        return { __terser_type: "Function", source: value.toString() };
    }
    if (value instanceof RegExp) {
        return { __terser_type: "RegExp", source: value.source, flags: value.flags };
    }
    if (Array.isArray(value)) return value.map((item) => toTaggedJson(item));
    if (kind === "object") {
        const out = {};
        for (const key of Object.keys(value)) {
            const child = toTaggedJson(value[key]);
            if (child !== undefined) out[key] = child;
        }
        return out;
    }
    throw new Error("cannot serialize option value of type " + kind);
}

export function containsFunction(value, seen = new Set()) {
    if (typeof value === "function") return true;
    if (value === null || typeof value !== "object") return false;
    if (value instanceof RegExp) return false;
    if (seen.has(value)) return false;
    seen.add(value);
    const children = Array.isArray(value) ? value : Object.values(value);
    return children.some((child) => containsFunction(child, seen));
}
