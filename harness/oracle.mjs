// Run terser 5.51.4 on every corpus input and write harness/expected.
// Two runs must produce identical files. Node stays on this side of the port.

import { createHash } from "crypto";
import { execFileSync, fork } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { runFixture, specFromCase } from "./lib/compress-runner.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const terserPkg = path.join(root, "oracle/node_modules/terser/package.json");
const terserMain = pathToFileURL(path.join(root, "oracle/node_modules/terser/main.js")).href;
const expectedRoot = path.join(here, "expected");

const version = JSON.parse(fs.readFileSync(terserPkg, "utf8")).version;
if (version !== "5.51.4") {
    throw new Error("oracle terser is " + version + ", expected 5.51.4");
}
const { minify } = await import(terserMain);

function sha256(text) {
    return createHash("sha256").update(text).digest("hex");
}

function canonicalError(name, message, line, col) {
    return `${name}\n${message}\n${line ?? ""}\n${col ?? ""}\n`;
}

function errorRecord(error) {
    const name = error && error.name ? String(error.name) : "Error";
    const message = error && error.message != null ? String(error.message) : String(error);
    const line = error && Number.isInteger(error.line) ? error.line : null;
    const col = error && Number.isInteger(error.col) ? error.col : null;
    const bytes = canonicalError(name, message, line, col);
    return {
        kind: "error",
        sha256: sha256(bytes),
        name,
        message,
        line,
        col,
    };
}

function codeRecord(code) {
    if (typeof code !== "string") throw new Error("terser returned a non-string code");
    return {
        kind: "code",
        sha256: sha256(Buffer.from(code, "utf8")),
        code,
    };
}

const NAMED = {
    roundtrip: { compress: false, mangle: false },
    mangle: { compress: false, mangle: true },
    default: {},
    // What @rollup/plugin-terser passes into minify for an es bundle.
    // The stated plugin options are the four keys. The plugin adds module:true.
    "lwc-rollup": {
        compress: true,
        mangle: true,
        sourceMap: false,
        format: { wrap_func_args: false },
        module: true,
    },
};

async function runNamed(input, setName) {
    try {
        const result = await minify(input, NAMED[setName]);
        return codeRecord(result.code);
    } catch (error) {
        return errorRecord(error);
    }
}

function runFixtureSet(input, entry) {
    try {
        return codeRecord(runFixture(input, specFromCase(entry)));
    } catch (error) {
        return errorRecord(error);
    }
}

function writeExpected(id, corpus, input, sets) {
    const file = path.join(expectedRoot, id + ".json");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const body = {
        schema: 1,
        id,
        corpus,
        terser: "5.51.4",
        input_sha256: sha256(Buffer.from(input, "utf8")),
        sets,
    };
    fs.writeFileSync(file, JSON.stringify(body) + "\n");
}

function walkJson(dir, out) {
    for (const name of fs.readdirSync(dir).sort()) {
        const abs = path.join(dir, name);
        const stat = fs.statSync(abs);
        if (stat.isDirectory()) walkJson(abs, out);
        else if (name.endsWith(".json")) out.push(abs);
    }
}

function ensureBundles() {
    const manifest = JSON.parse(fs.readFileSync(path.join(here, "corpus/bundles/manifest.json"), "utf8"));
    const missing = manifest.files.some((entry) => !fs.existsSync(path.join(here, "corpus/bundles", entry.file)));
    if (missing) {
        execFileSync(process.execPath, [path.join(here, "fetch-bundles.mjs")], { stdio: "inherit" });
    }
    return manifest;
}

function startWorker(heapMb) {
    return fork(fileURLToPath(import.meta.url), [], {
        env: { ...process.env, ORACLE_WORKER: "1" },
        execArgv: [`--max-old-space-size=${heapMb}`],
        stdio: ["inherit", "inherit", "inherit", "ipc"],
    });
}

function runInWorker(workerBox, input, setName, entry) {
    const worker = workerBox.current;
    return new Promise((resolve) => {
        const timer = setTimeout(() => worker.kill("SIGKILL"), 180000);
        const finish = (value) => {
            clearTimeout(timer);
            worker.off("message", onMessage);
            worker.off("exit", onExit);
            resolve(value);
        };
        const onMessage = (msg) => finish(msg);
        const onExit = (code, signal) => finish({ abort: true, code, signal });
        worker.on("message", onMessage);
        worker.on("exit", onExit);
        worker.send({ input, set: setName, entry });
    });
}

async function main() {
const cases = [];
const compressFiles = [];
walkJson(path.join(here, "corpus/compress/cases"), compressFiles);
for (const file of compressFiles) {
    const entry = JSON.parse(fs.readFileSync(file, "utf8"));
    cases.push({
        id: entry.id,
        corpus: "compress",
        input: entry.input,
        sets: ["roundtrip", "mangle", "default", "fixture"],
        entry,
    });
}

const lwc = JSON.parse(fs.readFileSync(path.join(here, "corpus/lwc/manifest.json"), "utf8"));
for (const file of lwc.files) {
    const input = fs.readFileSync(path.join(here, "corpus/lwc", file.path), "utf8");
    const id = "lwc/" + file.path.replace(/^modules\//, "").replace(/\.js$/, "");
    cases.push({
        id,
        corpus: "lwc",
        input,
        sets: ["roundtrip", "mangle", "default"],
        entry: null,
    });
}

const rollupManifestPath = path.join(here, "corpus/lwc-rollup/manifest.json");
const rollupCorpus = JSON.parse(fs.readFileSync(rollupManifestPath, "utf8"));
for (const file of rollupCorpus.files) {
    if (!file.id) throw new Error("lwc-rollup manifest entry has no id: " + file.path);
    const input = fs.readFileSync(path.join(here, "corpus/lwc-rollup", file.path), "utf8");
    cases.push({
        id: file.id,
        corpus: "lwc-rollup",
        input,
        sets: ["lwc-rollup"],
        entry: null,
    });
}

const bundles = ensureBundles();
for (const file of bundles.files) {
    const input = fs.readFileSync(path.join(here, "corpus/bundles", file.file), "utf8");
    cases.push({
        id: file.id,
        corpus: "bundles",
        input,
        sets: ["roundtrip", "mangle", "default"],
        entry: null,
    });
}

const corpusOrder = { compress: 0, lwc: 1, "lwc-rollup": 2, bundles: 3 };
cases.sort((a, b) => {
    const byCorpus = (corpusOrder[a.corpus] ?? 9) - (corpusOrder[b.corpus] ?? 9);
    if (byCorpus !== 0) return byCorpus;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
});
if (process.env.ORACLE_RESUME !== "1") {
    fs.rmSync(expectedRoot, { recursive: true, force: true });
}

const workerBox = { current: startWorker(192), heap: 192 };
function ensureHeap(heap) {
    if (workerBox.heap === heap && workerBox.current.connected) return;
    if (workerBox.current.connected) workerBox.current.kill();
    workerBox.current = startWorker(heap);
    workerBox.heap = heap;
}
let n = 0;
for (const item of cases) {
    const heap = item.corpus === "bundles" ? 4096 : item.corpus === "lwc-rollup" ? 1024 : 192;
    ensureHeap(heap);
    if (process.env.ORACLE_RESUME === "1" && fs.existsSync(path.join(expectedRoot, item.id + ".json"))) {
        n++;
        continue;
    }
    const sets = {};
    for (const setName of item.sets) {
        const reply = await runInWorker(workerBox, item.input, setName, setName === "fixture" ? item.entry : null);
        if (reply.abort || !workerBox.current.connected) {
            sets[setName] = errorRecord({
                name: "Abort",
                message: `terser process aborted (${reply.signal || reply.code})`,
            });
            if (!workerBox.current.connected) {
                workerBox.current = startWorker(workerBox.heap);
            }
        } else if (!reply.ok) {
            throw new Error(reply.error);
        } else {
            sets[setName] = reply.record;
        }
    }
    writeExpected(item.id, item.corpus, item.input, sets);
    n++;
    if (n % 400 === 0) process.stderr.write(`oracle ${n}/${cases.length}\n`);
}
process.stderr.write(`oracle ${n}/${cases.length}\n`);
workerBox.current.kill();
console.log(JSON.stringify({ cases: cases.length, terser: version }));
}

if (process.env.ORACLE_WORKER === "1") {
    process.on("message", async (msg) => {
        try {
            const record = msg.set === "fixture"
                ? runFixtureSet(msg.input, msg.entry)
                : await runNamed(msg.input, msg.set);
            process.send({ ok: true, record });
        } catch (error) {
            process.send({ ok: false, error: error && error.stack ? error.stack : String(error) });
        }
    });
} else {
    await main();
}
