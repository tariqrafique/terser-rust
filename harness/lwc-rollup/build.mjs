// Bundle each LWC sample component with rollup and @rollup/plugin-terser.
// Writes the exact string minify() receives under harness/corpus/lwc-rollup/.
// A second run on the same machine must reproduce every input sha256.

import { createHash } from "node:crypto";
import { execFileSync, execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
const corpusDir = path.join(repo, "harness/corpus/lwc-rollup");
const lwcManifestPath = path.join(repo, "harness/corpus/lwc/manifest.json");
const cache = path.join(repo, "harness/lwc/.cache");
const lbcRoot = path.join(cache, "lbc/package");
const recipesRoot = path.join(cache, "base-components-recipes");
const recipeModules = path.join(here, ".cache/recipe-modules");

const LBC_VERSION = "1.28.19-alpha";
const LBC_SHA1 = "7b045bfad4bf794341758e5573eb4b71f4a1e12f";
const RECIPES_REMOTE = "https://github.com/salesforce/base-components-recipes.git";
const RECIPES_COMMIT = "9c5f95d4e0cd5434a2b8373405e4f6c7657c88e8";
const LWC_SHA = "b9e8007f9810edb59596536b596f80ca6c0d3fab";
const GATE_IDS = ["lbc/lightning/button", "lbc-recipes/c/button"];
const BUTTON_SIZES = [52, 67348, 122707, 207237, 508797, 843001, 925673];

const STATED = {
    compress: true,
    mangle: true,
    sourceMap: false,
    format: { wrap_func_args: false },
};
const RECEIVED = {
    compress: true,
    mangle: true,
    sourceMap: false,
    format: { wrap_func_args: false },
    module: true,
};

function sha256(buf) {
    return createHash("sha256").update(buf).digest("hex");
}

function sha1(buf) {
    return createHash("sha1").update(buf).digest("hex");
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function run(cmd, args, opts = {}) {
    execFileSync(cmd, args, { stdio: "inherit", ...opts });
}

function pkgVersion(name) {
    return readJson(path.join(here, "node_modules", name, "package.json")).version;
}

function assertTerser() {
    const installed = path.join(here, "node_modules/terser/main.js");
    const oracleMain = path.join(repo, "oracle/node_modules/terser/main.js");
    const oraclePkg = path.join(repo, "oracle/node_modules/terser/package.json");
    if (!fs.existsSync(oracleMain)) {
        throw new Error("oracle terser is missing. Run npm ci in oracle/");
    }
    const installedSha = sha256(fs.readFileSync(installed));
    const oracleSha = sha256(fs.readFileSync(oracleMain));
    if (pkgVersion("terser") !== "5.51.4") {
        throw new Error("installed terser is " + pkgVersion("terser"));
    }
    if (readJson(oraclePkg).version !== "5.51.4") {
        throw new Error("oracle package.json terser is not 5.51.4");
    }
    if (installedSha !== oracleSha) {
        throw new Error("terser main.js does not match the oracle copy");
    }
    const ls = execFileSync("npm", ["ls", "terser", "--all", "--json"], {
        cwd: here,
        encoding: "utf8",
    });
    const versions = new Set();
    const walk = (node) => {
        if (!node || typeof node !== "object") return;
        if (node.dependencies) {
            for (const [name, dep] of Object.entries(node.dependencies)) {
                if (name === "terser" && dep.version) versions.add(dep.version);
                walk(dep);
            }
        }
    };
    walk(JSON.parse(ls));
    if (versions.size !== 1 || !versions.has("5.51.4")) {
        throw new Error("npm ls terser versions " + [...versions].join(","));
    }
    const pins = {
        rollup: "4.63.5",
        "@lwc/rollup-plugin": "9.5.3",
        "@rollup/plugin-terser": "1.0.2",
        "@lwc/engine-dom": "9.5.3",
        "@lwc/synthetic-shadow": "9.5.3",
        "@lwc/wire-service": "9.5.3",
    };
    for (const [name, version] of Object.entries(pins)) {
        const got = pkgVersion(name);
        if (got !== version) throw new Error(name + " is " + got + ", expected " + version);
    }
    return { installedSha, oracleSha, versions: [...versions] };
}

function ensureLbc() {
    const dir = path.join(cache, "lbc");
    fs.mkdirSync(dir, { recursive: true });
    const tgz = path.join(dir, `lightning-base-components-${LBC_VERSION}.tgz`);
    if (!fs.existsSync(tgz)) {
        run("npm", ["pack", `lightning-base-components@${LBC_VERSION}`, "--pack-destination", dir]);
    }
    const got = sha1(fs.readFileSync(tgz));
    if (got !== LBC_SHA1) throw new Error(`lbc sha1 ${got} != ${LBC_SHA1}`);
    if (!fs.existsSync(path.join(lbcRoot, "package.json"))) {
        run("tar", ["-xzf", tgz, "-C", dir]);
    }
}

function ensureRecipes() {
    if (!fs.existsSync(path.join(recipesRoot, ".git"))) {
        run("git", ["clone", "--filter=blob:none", RECIPES_REMOTE, recipesRoot]);
    }
    const head = execFileSync("git", ["-C", recipesRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    if (head !== RECIPES_COMMIT) {
        run("git", ["-C", recipesRoot, "fetch", "--depth", "1", "origin", RECIPES_COMMIT]);
        run("git", ["-C", recipesRoot, "checkout", "--detach", "FETCH_HEAD"]);
    }
    const now = execFileSync("git", ["-C", recipesRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    if (now !== RECIPES_COMMIT) throw new Error("recipes HEAD " + now);
}

function ensureLink(linkPath, target) {
    fs.mkdirSync(path.dirname(linkPath), { recursive: true });
    const resolved = path.resolve(target);
    if (fs.existsSync(linkPath)) {
        const current = fs.readlinkSync(linkPath);
        if (path.resolve(path.dirname(linkPath), current) === resolved) return;
        fs.unlinkSync(linkPath);
    }
    const relative = path.relative(path.dirname(linkPath), resolved);
    fs.symlinkSync(relative, linkPath);
}

function ensureRecipeModules(components) {
    fs.rmSync(path.join(recipeModules, "c"), { recursive: true, force: true });
    fs.mkdirSync(path.join(recipeModules, "c"), { recursive: true });
    fs.writeFileSync(path.join(recipeModules, "package.json"), JSON.stringify({
        name: "recipe-modules",
        private: true,
        lwc: { modules: [{ dir: "." }] },
    }, null, 2) + "\n");
    ensureLink(path.join(recipeModules, "node_modules"), path.join(here, "node_modules"));
    for (const component of components) {
        const linkPath = path.join(recipeModules, "c", component.name);
        if (fs.existsSync(linkPath)) {
            throw new Error("duplicate recipe component " + component.name);
        }
        fs.symlinkSync(component.dir, linkPath);
    }
}

function loadComponents() {
    const manifest = readJson(lwcManifestPath);
    const components = [];
    for (const file of manifest.files) {
        if (file.source.startsWith("lbc/")) {
            const entry = path.join(lbcRoot, file.source.slice("lbc/".length));
            components.push({
                group: "lbc",
                namespace: file.namespace,
                name: file.name,
                component: `lbc/${file.namespace}/${file.name}`,
                entry,
                dir: path.dirname(entry),
            });
        } else if (file.source.startsWith("lbc-recipes/")) {
            const abs = path.join(recipesRoot, file.source.slice("lbc-recipes/".length));
            components.push({
                group: "lbc-recipes",
                namespace: "c",
                name: file.name,
                component: `lbc-recipes/c/${file.name}`,
                entry: path.join(recipeModules, "c", file.name, path.basename(abs)),
                dir: path.dirname(abs),
            });
        } else {
            throw new Error("unknown source " + file.source);
        }
    }
    components.sort((a, b) => (a.component < b.component ? -1 : a.component > b.component ? 1 : 0));
    return components;
}

function median(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 1) return sorted[mid];
    return (sorted[mid - 1] + sorted[mid]) / 2;
}

function parseArgs(argv) {
    const out = { only: null, compare: false };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--only") {
            out.only = new Set(argv[++i].split(",").filter(Boolean));
        } else if (arg === "compare" || arg === "--compare") {
            out.compare = true;
        } else {
            throw new Error("unknown argument " + arg);
        }
    }
    return out;
}

async function pool(items, limit, fn) {
    const results = new Array(items.length);
    let next = 0;
    let stop = false;
    const failures = [];
    async function worker() {
        for (;;) {
            if (stop) return;
            const index = next++;
            if (index >= items.length) return;
            try {
                results[index] = await fn(items[index]);
            } catch (error) {
                stop = true;
                failures.push(error);
            }
        }
    }
    const workers = Math.min(limit, items.length);
    await Promise.all(Array.from({ length: workers }, () => worker()));
    if (failures.length) {
        throw new Error(failures.map((error) => error.message).join("\n"));
    }
    return results;
}

function prepareSources() {
    ensureLbc();
    ensureRecipes();
    ensureLink(path.join(lbcRoot, "node_modules"), path.join(here, "node_modules"));
    const components = loadComponents();
    ensureRecipeModules(components.filter((component) => component.group === "lbc-recipes"));
    return components;
}

async function buildOne(component, inputsRoot, extra = {}) {
    const captureDir = fs.mkdtempSync(path.join(os.tmpdir(), "lwc-rollup-"));
    const job = {
        ...component,
        ...extra,
        captureDir,
        outDir: path.join(inputsRoot, component.group, component.namespace, component.name),
        relDir: path.posix.join("inputs", component.group, component.namespace, component.name),
    };
    fs.mkdirSync(captureDir, { recursive: true });
    const jobPath = path.join(captureDir, "job.json");
    fs.writeFileSync(jobPath, JSON.stringify(job));
    try {
        await execFileAsync(process.execPath, [fileURLToPath(import.meta.url), "--one", jobPath], {
            cwd: here,
            timeout: 900000,
            maxBuffer: 32 * 1024 * 1024,
        });
        const result = readJson(path.join(captureDir, "result.json"));
        if (extra.captureChunk) {
            result.pluginCode = fs.readFileSync(path.join(captureDir, "plugin.txt"), "utf8");
        }
        return result;
    } catch (error) {
        const stderr = error.stderr ? error.stderr.toString() : "";
        const stdout = error.stdout ? error.stdout.toString() : "";
        const text = stderr || stdout || error.message;
        const line = text.split("\n").map((item) => item.trim()).find((item) => {
            return item.startsWith("Error") || item.startsWith("[CompilerError") || item.startsWith("[RollupError");
        });
        return {
            component: component.component,
            warningCount: 0,
            files: [],
            options: null,
            rollup_error: (line || text).slice(0, 500),
        };
    } finally {
        fs.rmSync(captureDir, { recursive: true, force: true });
    }
}

function previousMatches() {
    const file = path.join(corpusDir, "manifest.json");
    const map = new Map();
    if (!fs.existsSync(file)) return map;
    const old = readJson(file);
    for (const entry of old.files || []) {
        if (typeof entry.stated_matches_plugin === "boolean") {
            map.set(entry.path + "\0" + entry.sha256, entry.stated_matches_plugin);
        }
    }
    return map;
}

function publishInputs(staging) {
    const dest = path.join(corpusDir, "inputs");
    const old = path.join(corpusDir, ".inputs-old");
    fs.rmSync(old, { recursive: true, force: true });
    if (fs.existsSync(dest)) fs.renameSync(dest, old);
    fs.renameSync(path.join(staging, "inputs"), dest);
    fs.rmSync(old, { recursive: true, force: true });
    fs.rmSync(staging, { recursive: true, force: true });
}

function writeManifest(files, resolution, failures = []) {
    const bytes = files.map((file) => file.bytes);
    const manifest = {
        schema: 1,
        versions: {
            rollup: pkgVersion("rollup"),
            "@lwc/rollup-plugin": pkgVersion("@lwc/rollup-plugin"),
            "@rollup/plugin-terser": pkgVersion("@rollup/plugin-terser"),
            terser: "5.51.4",
            "@lwc/engine-dom": pkgVersion("@lwc/engine-dom"),
            "@lwc/synthetic-shadow": pkgVersion("@lwc/synthetic-shadow"),
            "@lwc/wire-service": pkgVersion("@lwc/wire-service"),
            lwc_sha: LWC_SHA,
            node: process.version,
        },
        terser_resolution: {
            installed_main_sha256: resolution.installedSha,
            oracle_main_sha256: resolution.oracleSha,
            same_bytes: true,
            npm_ls: resolution.versions,
        },
        rollup_config: {
            input: "the component entry. Recipe entries are the c/ symlink tree under harness/lwc-rollup/.cache/recipe-modules. LBC entries are the files inside lightning-base-components.",
            output: {
                format: "omitted",
                observed: "es",
            },
            plugins: [
                "lwc() with no options",
                "terser plugin with minify_options_stated",
            ],
            note: "Output format is omitted. Rollup 4.63.5 getFormat maps that to es. inlineDynamicImports is left off. Dynamic components stay off. shimMissingExports stays off.",
        },
        engine: {
            specifier: "lwc",
            resolves_to: "@lwc/engine-dom",
            bundled: true,
            external: false,
            inputs_with_marker: files.filter((file) => file.has_engine_marker).length,
        },
        minify_options_stated: STATED,
        minify_options_added_by_plugin: { module: true },
        minify_options_received: RECEIVED,
        failures,
        stats: {
            component_count: new Set(files.map((file) => file.component)).size + failures.length,
            bundled_components: new Set(files.map((file) => file.component)).size,
            failed_components: failures.length,
            file_count: files.length,
            input_bytes_min: Math.min(...bytes),
            input_bytes_max: Math.max(...bytes),
            input_bytes_total: bytes.reduce((sum, value) => sum + value, 0),
            input_bytes_median: median(bytes),
            unique_sha256: new Set(files.map((file) => file.sha256)).size,
        },
        files: files.map((file) => ({
            path: file.path,
            id: file.id,
            sha256: file.sha256,
            bytes: file.bytes,
            component: file.component,
            chunk: file.chunk,
            plugin_sha256: file.plugin_sha256,
            final_sha256: file.final_sha256,
            stated_matches_plugin: file.stated_matches_plugin,
        })),
    };
    fs.mkdirSync(corpusDir, { recursive: true });
    const tmp = path.join(corpusDir, "manifest.json.tmp");
    fs.writeFileSync(tmp, JSON.stringify(manifest, null, 2) + "\n");
    fs.renameSync(tmp, path.join(corpusDir, "manifest.json"));
    return manifest.stats;
}

function reportGate(results) {
    for (const result of results) {
        const bytes = result.files.map((file) => file.bytes);
        process.stderr.write(JSON.stringify({
            gate: result.component,
            chunks: result.files.length,
            input_bytes: bytes,
            options: result.options,
            engine_marker: result.files.some((file) => file.has_engine_marker),
            stated_matches_plugin: result.files.map((file) => file.stated_matches_plugin),
        }) + "\n");
    }
    const button = results.find((result) => result.component === "lbc/lightning/button");
    if (!button) throw new Error("lbc/lightning/button: gate result missing");
    const sizes = button.files.map((file) => file.bytes).slice().sort((a, b) => a - b);
    if (sizes.join(",") !== BUTTON_SIZES.join(",")) {
        throw new Error("lbc/lightning/button: input sizes " + sizes.join(",") + " expected " + BUTTON_SIZES.join(","));
    }
    if (!button.files.some((file) => file.has_engine_marker)) {
        throw new Error("lbc/lightning/button: no input contains $$lwc-synthetic-mode");
    }
    if (!button.files.every((file) => file.options_ok)) {
        throw new Error("lbc/lightning/button: minify options did not match");
    }
    const recipe = results.find((result) => result.component === "lbc-recipes/c/button");
    if (!recipe) throw new Error("lbc-recipes/c/button: gate result missing");
    if (!recipe.files.some((file) => file.has_engine_marker)) {
        throw new Error("lbc-recipes/c/button: no input contains $$lwc-synthetic-mode");
    }
    if (!recipe.files.every((file) => file.options_ok)) {
        throw new Error("lbc-recipes/c/button: minify options did not match");
    }
}

async function buildAll(only) {
    const resolution = assertTerser();
    let components = prepareSources();
    if (only) {
        components = components.filter((component) => only.has(component.component));
        const missing = [...only].filter((name) => !components.some((component) => component.component === name));
        if (missing.length) throw new Error("unknown component " + missing.join(","));
    } else if (components.length !== 339) {
        throw new Error("expected 339 components, found " + components.length);
    }
    const kept = previousMatches();
    const staging = only
        ? path.join(here, ".cache/gate")
        : path.join(corpusDir, ".staging");
    fs.rmSync(staging, { recursive: true, force: true });
    const inputsRoot = path.join(staging, "inputs");
    fs.mkdirSync(inputsRoot, { recursive: true });
    const total = components.length;
    let done = 0;
    const step = async (component) => {
        const result = await buildOne(component, inputsRoot, {
            gate: !only && GATE_IDS.includes(component.component),
        });
        if (!result.files.length && !result.rollup_error) {
            throw new Error(component.component + ": rollup produced no chunks");
        }
        done++;
        if (done % 20 === 0 || done === total) {
            process.stderr.write(`lwc-rollup ${done}/${total}\n`);
        }
        return result;
    };
    try {
        let built;
        if (only) {
            built = await pool(components, 4, step);
        } else {
            const gate = components.filter((component) => GATE_IDS.includes(component.component));
            const rest = components.filter((component) => !GATE_IDS.includes(component.component));
            if (gate.length !== GATE_IDS.length) {
                throw new Error("gate components missing");
            }
            const gateResults = await pool(gate, 4, step);
            reportGate(gateResults);
            const restResults = await pool(rest, 4, step);
            built = gateResults.concat(restResults);
        }
        const files = built.flatMap((result) => result.files);
        for (const file of files) {
            const keptMatch = kept.get(file.path + "\0" + file.sha256);
            file.stated_matches_plugin = typeof keptMatch === "boolean" ? keptMatch : null;
        }
        files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
        if (only) {
            console.log(JSON.stringify(files.map((file) => ({
                path: file.path,
                bytes: file.bytes,
                sha256: file.sha256,
            })), null, 2));
            return;
        }
        const failures = built.filter((result) => result.rollup_error).map((result) => ({
            component: result.component,
            error: result.rollup_error,
        }));
        const bundled = new Set(files.map((file) => file.component)).size;
        if (bundled + failures.length !== 339) {
            throw new Error("expected 339 components, bundled " + bundled + " failed " + failures.length);
        }
        publishInputs(staging);
        const stats = writeManifest(files, resolution, failures);
        console.log(JSON.stringify(stats));
    } catch (error) {
        fs.rmSync(staging, { recursive: true, force: true });
        throw error;
    }
}

function canonicalExpected(record) {
    if (record.kind === "code") return Buffer.from(record.code, "utf8");
    if (record.kind === "error") {
        const text = `${record.name}\n${record.message}\n${record.line ?? ""}\n${record.col ?? ""}\n`;
        return Buffer.from(text, "utf8");
    }
    throw new Error("unknown expected kind " + record.kind);
}

function windowAt(text, at) {
    const start = Math.max(0, at - 40);
    return text.slice(start, start + 80);
}

async function compareOracle() {
    const components = prepareSources();
    const manifestPath = path.join(corpusDir, "manifest.json");
    const manifest = readJson(manifestPath);
    const expectedRoot = path.join(repo, "harness/expected");
    let match = 0;
    let mismatch = 0;
    let first = null;
    for (const file of manifest.files) {
        const expectedPath = path.join(expectedRoot, file.id + ".json");
        if (!fs.existsSync(expectedPath)) throw new Error(file.id + ": expected file missing");
        const expected = readJson(expectedPath);
        const record = expected.sets["lwc-rollup"];
        if (!record) throw new Error(file.id + ": has no lwc-rollup set");
        const bytes = canonicalExpected(record);
        const same = sha256(bytes) === file.plugin_sha256;
        file.stated_matches_plugin = same;
        if (same) match++;
        else {
            mismatch++;
            if (!first) {
                first = {
                    file,
                    expectedText: bytes.toString("utf8"),
                };
            }
        }
    }
    const pluginEqFinal = manifest.files.filter((file) => file.plugin_sha256 === file.final_sha256).length;
    manifest.stats.plugin_matches_oracle = match;
    manifest.stats.plugin_mismatches = mismatch;
    manifest.stats.plugin_equals_final = pluginEqFinal;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    if (first) {
        const component = components.find((item) => item.component === first.file.component);
        if (!component) throw new Error(first.file.component + ": not in the sample manifest");
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lwc-rollup-diff-"));
        try {
            const result = await buildOne(component, path.join(tmp, "inputs"), {
                captureChunk: first.file.chunk,
            });
            const plugin = result.pluginCode;
            if (sha256(Buffer.from(plugin, "utf8")) !== first.file.plugin_sha256) {
                throw new Error(first.file.component + ": rebundle plugin sha does not match the corpus");
            }
            const at = firstDiff(plugin, first.expectedText);
            process.stderr.write("first mismatch " + first.file.id + "\n");
            process.stderr.write("plugin " + JSON.stringify(windowAt(plugin, at)) + "\n");
            process.stderr.write("stated " + JSON.stringify(windowAt(first.expectedText, at)) + "\n");
        } finally {
            fs.rmSync(tmp, { recursive: true, force: true });
        }
    }
    console.log(JSON.stringify({
        match,
        mismatch,
        plugin_equals_final: pluginEqFinal,
        files: manifest.files.length,
    }));
}

async function runOne(jobPath) {
    const { createRequire } = await import("node:module");
    const require = createRequire(import.meta.url);
    const workerThreads = require("node:worker_threads");
    const RealWorker = workerThreads.Worker;
    const registerPath = path.join(here, "capture-register.mjs");
    const job = readJson(jobPath);
    process.env.MINIFY_CAPTURE_DIR = job.captureDir;
    workerThreads.Worker = class extends RealWorker {
        constructor(filename, options = {}) {
            const name = String(filename);
            if (!name.includes("plugin-terser")) {
                super(filename, options);
                return;
            }
            super(filename, { ...options, execArgv: ["--import", registerPath] });
        }
    };
    const { rollup } = await import("rollup");
    const lwc = (await import("@lwc/rollup-plugin")).default;
    const terserPlugin = (await import("@rollup/plugin-terser")).default;
    const warnings = [];
    const seen = [];
    const inner = terserPlugin(STATED);
    const wrapped = {
        name: inner.name,
        async renderChunk(code, chunk, outputOptions) {
            if (outputOptions.format !== "es") {
                throw new Error(job.component + ": format " + outputOptions.format);
            }
            const returned = await inner.renderChunk.call(this, code, chunk, outputOptions);
            const output = typeof returned === "string" ? returned : returned && returned.code;
            if (typeof output !== "string") {
                throw new Error(job.component + ": plugin returned a non-string");
            }
            seen.push({ input: code, output });
            return returned;
        },
    };
    let bundle;
    try {
        bundle = await rollup({
            input: job.entry,
            plugins: [lwc(), wrapped],
            onwarn(warning) {
                warnings.push(String(warning.message || warning));
            },
        });
        const generated = await bundle.generate({});
        await bundle.close();
        bundle = null;
        const chunks = generated.output.filter((item) => item.type === "chunk");
        const captures = fs.readdirSync(job.captureDir)
            .filter((name) => name.endsWith(".json") && name !== "job.json")
            .map((name) => readJson(path.join(job.captureDir, name)));
        if (captures.length !== seen.length) {
            throw new Error(job.component + `: captured ${captures.length} minify calls, renderChunk ran ${seen.length}`);
        }
        const poolCaptures = captures.slice();
        fs.mkdirSync(job.outDir, { recursive: true });
        const files = [];
        const usedNames = new Set();
        let options = null;
        for (const item of seen) {
            const index = poolCaptures.findIndex((capture) => capture.code === item.input);
            if (index < 0) throw new Error(job.component + ": minify input did not match renderChunk");
            const capture = poolCaptures.splice(index, 1)[0];
            if (!sameOptions(capture.options)) {
                throw new Error(job.component + ": minify options " + JSON.stringify(capture.options));
            }
            options = capture.options;
            const finals = chunks.filter((chunk) => chunkMatches(item.output, chunk.code));
            if (finals.length !== 1) {
                const names = chunks.map((chunk) => chunk.fileName + "@" + firstDiff(item.output, chunk.code)).join(",");
                throw new Error(job.component + ": matched " + finals.length + " final chunks (" + names + ")");
            }
            const fileName = finals[0].fileName;
            if (fileName.includes("/") || fileName.includes("\\") || usedNames.has(fileName)) {
                throw new Error(job.component + ": bad chunk name " + fileName);
            }
            usedNames.add(fileName);
            const rel = path.posix.join(job.relDir, fileName);
            const inputBuf = Buffer.from(item.input, "utf8");
            const pluginBuf = Buffer.from(item.output, "utf8");
            const finalBuf = Buffer.from(finals[0].code, "utf8");
            fs.writeFileSync(path.join(job.outDir, fileName), inputBuf);
            let statedMatch = null;
            if (job.gate) {
                if (!runOne.statedMinify) {
                    runOne.statedMinify = (await import("../../oracle/node_modules/terser/main.js")).minify;
                }
                const stated = await runOne.statedMinify(item.input, STATED);
                statedMatch = stated.code === item.output;
            }
            if (job.captureChunk === fileName) {
                fs.writeFileSync(path.join(job.captureDir, "plugin.txt"), item.output);
            }
            files.push({
                path: rel,
                id: "lwc-rollup/" + rel.replace(/^inputs\//, "").replace(/\.js$/, ""),
                sha256: sha256(inputBuf),
                bytes: inputBuf.length,
                component: job.component,
                chunk: fileName,
                plugin_sha256: sha256(pluginBuf),
                final_sha256: sha256(finalBuf),
                has_engine_marker: item.input.includes("$$lwc-synthetic-mode"),
                options_ok: true,
                stated_matches_plugin: statedMatch,
            });
        }
        if (job.captureChunk && !files.some((file) => file.chunk === job.captureChunk)) {
            throw new Error(job.component + ": rebundle has no chunk " + job.captureChunk);
        }
        fs.writeFileSync(path.join(job.captureDir, "result.json"), JSON.stringify({
            component: job.component,
            warningCount: warnings.length,
            options,
            files,
        }));
    } catch (error) {
        if (bundle) await bundle.close();
        const reason = error && error.message ? error.message : String(error);
        if (reason.startsWith(job.component + ":")) throw error;
        throw new Error(job.component + ": " + reason);
    }
}

function sameOptions(options) {
    if (!options || typeof options !== "object") return false;
    const keys = Object.keys(options).sort();
    if (keys.join(",") !== "compress,format,mangle,module,sourceMap") return false;
    if (options.compress !== true || options.mangle !== true || options.sourceMap !== false || options.module !== true) {
        return false;
    }
    const formatKeys = Object.keys(options.format || {}).sort();
    return formatKeys.join(",") === "wrap_func_args" && options.format.wrap_func_args === false;
}

// Rollup substitutes !~{n}~ with an equal-length hash after renderChunk returns.
function chunkMatches(pluginCode, finalCode) {
    let plugin = pluginCode;
    let final = finalCode;
    if (final.endsWith("\n") && !plugin.endsWith("\n")) final = final.slice(0, -1);
    if (plugin.length !== final.length) return false;
    const ranges = [];
    const placeholder = /!~\{[0-9a-zA-Z_$]+\}~/g;
    for (let match = placeholder.exec(plugin); match; match = placeholder.exec(plugin)) {
        ranges.push([match.index, match.index + match[0].length]);
    }
    let range = 0;
    for (let i = 0; i < plugin.length; i++) {
        if (plugin[i] === final[i]) continue;
        while (range < ranges.length && ranges[range][1] <= i) range++;
        if (range >= ranges.length || i < ranges[range][0] || i >= ranges[range][1]) return false;
    }
    return true;
}

function firstDiff(a, b) {
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) {
        if (a[i] !== b[i]) return i;
    }
    return a.length === b.length ? -1 : n;
}

if (process.argv[2] === "--one") {
    await runOne(process.argv[3]);
} else {
    const args = parseArgs(process.argv.slice(2));
    if (args.compare) await compareOracle();
    else await buildAll(args.only);
}
