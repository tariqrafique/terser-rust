// Extract terser 5.51.4 test/compress/*.js into harness/corpus/compress.
// The clone is gitignored. Parsing and printing use the pinned npm package,
// which matches the v5.51.4 tree (lib/ and main.js are byte-identical).

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
    AST,
    containsFunction,
    makeCode,
    parse,
    runFixture,
    toTaggedJson,
} from "./lib/compress-runner.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const cache = path.join(root, "oracle/.cache/terser");
const commit = "bd270d079070403e398df8a3b6652de0ed4dcc20";
const outDir = path.join(here, "corpus/compress");

function ensureClone() {
    fs.mkdirSync(path.dirname(cache), { recursive: true });
    if (!fs.existsSync(path.join(cache, ".git"))) {
        execFileSync("git", ["clone", "--filter=blob:none", "https://github.com/terser/terser.git", cache], {
            stdio: "inherit",
        });
    }
    execFileSync("git", ["-C", cache, "fetch", "--depth", "1", "origin", commit], { stdio: "inherit" });
    execFileSync("git", ["-C", cache, "checkout", "--detach", commit], { stdio: "inherit" });
    const head = execFileSync("git", ["-C", cache, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    if (head !== commit) throw new Error("terser checkout is " + head);
    const version = JSON.parse(fs.readFileSync(path.join(cache, "package.json"), "utf8")).version;
    if (version !== "5.51.4") throw new Error("terser version is " + version);
}

function readBoolean(stat) {
    if (stat.TYPE === "SimpleStatement" && stat.body instanceof AST.AST_Boolean) {
        return stat.body.value;
    }
    throw new Error("Should be boolean");
}

function readString(stat) {
    if (stat.TYPE === "SimpleStatement") {
        const body = stat.body;
        if (body.TYPE === "String") return body.value;
        if (body.TYPE === "Array") {
            return body.elements.map((element) => {
                if (element.TYPE !== "String") throw new Error("Should be array of strings");
                return element.value;
            }).join("\n");
        }
    }
    throw new Error("Should be string or array of strings");
}

function templateValue(ast) {
    if (
        ast instanceof AST.AST_SimpleStatement
        && ast.body instanceof AST.AST_TemplateString
        && ast.body.segments.length === 1
    ) {
        return ast.body.segments[0].value;
    }
    return null;
}

function blockSource(text, node) {
    if (!(node instanceof AST.AST_BlockStatement)) {
        throw new Error("expected a block");
    }
    const end = node.end.pos + String(node.end.value).length;
    const raw = text.slice(node.start.pos, end);
    if (!raw.startsWith("{") || !raw.endsWith("}")) {
        throw new Error("block source is not wrapped in braces");
    }
    return raw.slice(1, -1);
}

function inputSource(text, node) {
    const template = templateValue(node);
    if (template != null) return { kind: "template", code: template };
    if (node instanceof AST.AST_BlockStatement) {
        return { kind: "block", code: blockSource(text, node) };
    }
    throw new Error("unsupported input syntax");
}

function expectSource(node, mangle, format) {
    const template = templateValue(node);
    if (template != null) {
        const toplevel = parse(template);
        toplevel.figure_out_scope(mangle);
        return makeCode(toplevel, format || {});
    }
    if (!(node instanceof AST.AST_BlockStatement)) {
        throw new Error("unsupported expect syntax");
    }
    for (let i = 0; i < node.body.length; i++) {
        const stat = node.body[i];
        if (stat instanceof AST.AST_SimpleStatement && stat.body instanceof AST.AST_String) {
            node.body[i] = new AST.AST_Directive(stat.body);
        } else break;
    }
    const toplevel = new AST.AST_Toplevel(node);
    toplevel.figure_out_scope(mangle);
    return makeCode(toplevel, format || {});
}

function stdoutValue(stat) {
    const body = stat.body;
    if (body instanceof AST.AST_Boolean) return { kind: "boolean", value: body.value };
    if (body instanceof AST.AST_Call) {
        const name = body.expression.name;
        const ctor = global[name];
        if (ctor !== Error && !(ctor && ctor.prototype instanceof Error)) {
            throw new Error("unsupported expect_stdout constructor " + name);
        }
        const args = body.args.map((node) => {
            if (!(node instanceof AST.AST_Constant)) throw new Error("unsupported expect_stdout argument");
            return node.value;
        });
        const error = ctor.apply(null, args);
        return { kind: "error", name: error.name, message: error.message };
    }
    return { kind: "string", value: readString(stat) + "\n" };
}

function evalNode(node) {
    return new Function("return(" + makeCode(node, { beautify: true }) + ")")();
}

function loadTests(file, text) {
    const ast = parse(text, { filename: file });
    const tests = [];
    const walker = new AST.TreeWalker(function (node) {
        if (node instanceof AST.AST_LabeledStatement && walker.parent() instanceof AST.AST_Toplevel) {
            const name = node.label.name;
            if (tests.some((test) => test.name === name)) {
                throw new Error('duplicated test name "' + name + '"');
            }
            tests.push(readTest(text, name, node));
            return true;
        }
        if (node instanceof AST.AST_Directive) return true;
        if (!(node instanceof AST.AST_Toplevel)) {
            throw new Error("can't understand test file at " + node.start.line + ":" + node.start.col);
        }
    });
    ast.walk(walker);
    return tests;
}

function readTest(text, name, labeled) {
    const test = {
        name,
        line: labeled.start.line,
        options: {},
        optionsExpr: null,
        mangle: undefined,
        mangleExpr: null,
        beautify: undefined,
        beautifyExpr: null,
        format: undefined,
        formatExpr: null,
        parse: undefined,
        parseExpr: null,
        rename: undefined,
        renameExpr: null,
        module: undefined,
        moduleExpr: null,
        output: undefined,
        outputExpr: null,
        reminify: true,
        only: false,
        input: null,
        badInput: null,
        expect: null,
        expectExact: null,
        expectError: null,
        expectStdout: null,
        prependCode: null,
        nodeVersion: null,
        noMozillaAst: false,
    };
    const block = labeled.body;
    const walker = new AST.TreeWalker(function (node) {
        if (node instanceof AST.AST_Assign) {
            if (!(node.left instanceof AST.AST_SymbolRef)) throw new Error("bad assignment");
            const key = node.left.name;
            const expr = makeCode(node.right, { beautify: true });
            const value = evalNode(node.right);
            if (key === "options") {
                test.options = value;
                test.optionsExpr = expr;
            } else if (key === "mangle") {
                test.mangle = value;
                test.mangleExpr = expr;
            } else if (key === "beautify") {
                test.beautify = value;
                test.beautifyExpr = expr;
            } else if (key === "format") {
                test.format = value;
                test.formatExpr = expr;
            } else if (key === "parse") {
                test.parse = value;
                test.parseExpr = expr;
            } else if (key === "rename") {
                test.rename = value;
                test.renameExpr = expr;
            } else if (key === "module") {
                test.module = value;
                test.moduleExpr = expr;
            } else if (key === "output") {
                test.output = value;
                test.outputExpr = expr;
            } else if (key === "only") {
                test.only = value;
            } else if (key === "reminify") {
                test.reminify = value == null || value;
            } else if (key === "node_version") {
                test.nodeVersion = value;
            } else if (key === "no_mozilla_ast") {
                test.noMozillaAst = value;
            } else {
                throw new Error("unsupported assignment " + key);
            }
            return true;
        }
        if (node instanceof AST.AST_LabeledStatement) {
            const label = node.label.name;
            const stat = node.body;
            if (label === "expect_exact" || label === "node_version") {
                const value = readString(stat);
                if (label === "expect_exact") test.expectExact = value;
                else test.nodeVersion = value;
            } else if (label === "reminify") {
                const value = readBoolean(stat);
                test.reminify = value == null || value;
            } else if (label === "expect_stdout") {
                test.expectStdout = stdoutValue(stat);
            } else if (label === "prepend_code") {
                test.prependCode = readString(stat);
            } else if (label === "no_mozilla_ast") {
                test.noMozillaAst = readBoolean(stat);
            } else if (label === "input") {
                test.input = stat;
            } else if (label === "bad_input") {
                test.badInput = stat;
            } else if (label === "expect") {
                test.expect = stat;
            } else if (label === "expect_error") {
                test.expectError = evalNode(stat.body);
            } else {
                throw new Error("unsupported label " + label);
            }
            return true;
        }
    });
    block.walk(walker);
    return test;
}

function fixtureJson(test) {
    const compress = toTaggedJson(test.options) || {};
    if (!Object.prototype.hasOwnProperty.call(test.options, "defaults")) {
        compress.defaults = false;
    }
    let mangle = false;
    if (test.mangle === true) mangle = true;
    else if (test.mangle) mangle = toTaggedJson(test.mangle);
    const formatSource = test.beautify !== undefined ? test.beautify : test.format;
    const format = formatSource === undefined ? null : toTaggedJson(formatSource);
    const parseOpts = test.parse === undefined ? null : toTaggedJson(test.parse);
    return {
        compress,
        mangle,
        format,
        parse: parseOpts,
        rename: !!test.rename,
    };
}

function writeJson(file, value) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function mochaInventory(mochaDir) {
    const files = fs.readdirSync(mochaDir).filter((name) => name.endsWith(".js")).sort();
    return files.map((name) => {
        const text = fs.readFileSync(path.join(mochaDir, name), "utf8");
        const describes = [];
        for (const match of text.matchAll(/describe\(\s*(['"`])([\s\S]*?)\1/g)) {
            describes.push(match[2].replace(/\s+/g, " ").trim());
        }
        const tests = [...text.matchAll(/\bit\(\s*(['"`])/g)].length;
        return {
            file: "test/mocha/" + name,
            describes,
            it_calls: tests,
            lines: text.split("\n").length,
        };
    });
}

ensureClone();
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const compressDir = path.join(cache, "test/compress");
const files = fs.readdirSync(compressDir).filter((name) => name.endsWith(".js")).sort();
const skipped = [];
const mismatches = [];
const functionCases = [];
let extracted = 0;
let badInput = 0;
let withExpect = 0;

for (const file of files) {
    const text = fs.readFileSync(path.join(compressDir, file), "utf8");
    let tests;
    try {
        tests = loadTests(file, text);
    } catch (error) {
        skipped.push({ file: "test/compress/" + file, reason: error.message });
        continue;
    }
    for (const test of tests) {
        const id = "compress/" + file.replace(/\.js$/, "") + "/" + test.name;
        try {
            if (!test.input && !test.badInput) throw new Error("missing input");
            const sourceNode = test.badInput || test.input;
            const source = inputSource(text, sourceNode);
            const formatValue = test.beautify !== undefined ? test.beautify : test.format;
            let expect = null;
            let expectKind = null;
            if (test.expect) {
                expect = expectSource(test.expect, test.mangle, formatValue);
                expectKind = "ast";
            } else if (test.expectExact != null) {
                expect = test.expectExact;
                expectKind = "exact";
            }
            const hasFn = containsFunction(test.options)
                || containsFunction(test.mangle)
                || containsFunction(test.parse)
                || containsFunction(test.beautify)
                || containsFunction(test.format);
            if (hasFn) functionCases.push(id);

            const entry = {
                schema: 1,
                id,
                corpus: "compress",
                name: test.name,
                origin: {
                    file: "test/compress/" + file,
                    line: test.line,
                    terser: "5.51.4",
                    commit,
                },
                input: source.code,
                input_kind: source.kind,
                bad_input: !!test.badInput,
                fixture: fixtureJson(test),
                exprs: {
                    options: test.optionsExpr,
                    mangle: test.mangleExpr,
                    format: test.beautifyExpr || test.formatExpr,
                    parse: test.parseExpr,
                    rename: test.renameExpr,
                },
                expect,
                expect_kind: expectKind,
                expect_stdout: test.expectStdout,
                expect_error: test.expectError == null ? null : toTaggedJson(test.expectError),
                prepend_code: test.prependCode,
                node_version: test.nodeVersion,
                no_mozilla_ast: !!test.noMozillaAst,
                reminify: !!test.reminify,
                only: !!test.only,
                module: !!test.module,
                ignored_output: test.output === undefined ? null : toTaggedJson(test.output),
                has_function: hasFn,
            };

            if (expect != null && !test.badInput) {
                withExpect++;
                const actual = runFixture(source.code, {
                    options: test.options,
                    mangle: test.mangle || false,
                    format: formatValue || {},
                    parse: test.parse,
                    rename: !!test.rename,
                });
                if (actual !== expect) {
                    mismatches.push({
                        id,
                        reason: "reparse of the extracted source does not match the in-memory AST expect",
                        expect_head: expect.slice(0, 160),
                        actual_head: actual.slice(0, 160),
                    });
                }
            }
            if (test.badInput) badInput++;
            const rel = path.join("cases", file.replace(/\.js$/, ""), test.name + ".json");
            writeJson(path.join(outDir, rel), entry);
            extracted++;
        } catch (error) {
            skipped.push({
                id,
                file: "test/compress/" + file,
                name: test.name,
                line: test.line,
                reason: error.message,
            });
        }
    }
}

const mocha = mochaInventory(path.join(cache, "test/mocha"));
writeJson(path.join(outDir, "mocha-inventory.json"), {
    terser: "5.51.4",
    commit,
    note: "Inventory only. These mocha files are not executed and are not part of the byte board.",
    files: mocha,
});
writeJson(path.join(outDir, "skipped.json"), skipped);
writeJson(path.join(outDir, "reparse-mismatches.json"), mismatches);
writeJson(path.join(outDir, "manifest.json"), {
    terser: "5.51.4",
    commit,
    files: files.length,
    extracted,
    skipped: skipped.length,
    bad_input: badInput,
    with_expect: withExpect,
    reparse_mismatches: mismatches.length,
    function_cases: functionCases,
});

console.log(JSON.stringify({
    files: files.length,
    extracted,
    skipped: skipped.length,
    bad_input: badInput,
    with_expect: withExpect,
    reparse_mismatches: mismatches.length,
    function_cases: functionCases,
    mocha_files: mocha.length,
}, null, 2));
if (skipped.length) {
    console.log(JSON.stringify(skipped, null, 2));
}
