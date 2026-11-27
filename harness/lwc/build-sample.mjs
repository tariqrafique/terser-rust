// Rebuild harness/corpus/lwc from pinned sources.
// Rerunning this script on the same Node must reproduce module sha256s.

import { createHash } from "crypto";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const corpusDir = path.resolve(here, "../corpus/lwc");
const cache = path.join(here, ".cache");

const LBC_VERSION = "1.28.19-alpha";
const LBC_SHA1 = "7b045bfad4bf794341758e5573eb4b71f4a1e12f";
const RECIPES_REMOTE = "https://github.com/salesforce/base-components-recipes.git";
const RECIPES_COMMIT = "9c5f95d4e0cd5434a2b8373405e4f6c7657c88e8";
const LWC_SHA = "b9e8007f9810edb59596536b596f80ca6c0d3fab";
const COMPILER_VERSION = "9.5.3";
const COMPILER_SHA1 = "01b6a2021c612c5f6a900092a70e7707ff5695e9";
const COMPILER_GIT_HEAD = "f07d63b2b1c71e689fabc614b228a2102d8e9914";
const TERSER_VERSION = "5.51.4";
const SEED = 42;
const LBC_SHA256 = "2d4681dfc2c564751594001d004cbf168280c97c3bd31b00ca2b2df5a89e1ef1";
const COMPILER_SHA256 = "2586c9884df5f9e771a2d6e371ffee0c2dd63e8a1329026fa492122a02fa136c";
const COMPILER_TGZ = "lwc-compiler-9.5.3.tgz";

const SKIP_DIRS = new Set([
    "node_modules",
    ".git",
    "dist",
    "buildTemplates",
    "coverage",
    "__tests__",
    "__snapshots__",
    "__examples__",
    "__raptorMocks__",
]);

function sha256(buf) {
    return createHash("sha256").update(buf).digest("hex");
}

function sha1(buf) {
    return createHash("sha1").update(buf).digest("hex");
}

function run(cmd, args, opts = {}) {
    execFileSync(cmd, args, { stdio: "inherit", ...opts });
}

function ensureLbc() {
    const dir = path.join(cache, "lbc");
    fs.mkdirSync(dir, { recursive: true });
    const tgzName = `lightning-base-components-${LBC_VERSION}.tgz`;
    const tgz = path.join(dir, tgzName);
    if (!fs.existsSync(tgz)) {
        run("npm", ["pack", `lightning-base-components@${LBC_VERSION}`, "--pack-destination", dir]);
    }
    const bytes = fs.readFileSync(tgz);
    const got1 = sha1(bytes);
    const got256 = sha256(bytes);
    if (got1 !== LBC_SHA1) throw new Error(`lbc sha1 ${got1} != ${LBC_SHA1}`);
    if (got256 !== LBC_SHA256) throw new Error(`lbc sha256 ${got256} != ${LBC_SHA256}`);
    const pkg = path.join(dir, "package");
    if (!fs.existsSync(path.join(pkg, "package.json"))) {
        run("tar", ["-xzf", tgz, "-C", dir]);
    }
    return { root: pkg, sha1: got1, sha256: got256 };
}

function ensureRecipes() {
    const dir = path.join(cache, "base-components-recipes");
    if (!fs.existsSync(path.join(dir, ".git"))) {
        run("git", ["clone", "--filter=blob:none", RECIPES_REMOTE, dir]);
    }
    run("git", ["-C", dir, "fetch", "--depth", "1", "origin", RECIPES_COMMIT]);
    run("git", ["-C", dir, "checkout", "--detach", "FETCH_HEAD"]);
    const head = execFileSync("git", ["-C", dir, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    if (head !== RECIPES_COMMIT) throw new Error("recipes HEAD " + head);
    return dir;
}

function ensureCompiler() {
    const dir = path.join(cache, "compiler");
    fs.mkdirSync(dir, { recursive: true });
    const tgz = path.join(dir, COMPILER_TGZ);
    if (!fs.existsSync(tgz)) {
        run("npm", ["pack", `@lwc/compiler@${COMPILER_VERSION}`, "--pack-destination", dir]);
    }
    const bytes = fs.readFileSync(tgz);
    const got1 = sha1(bytes);
    const got256 = sha256(bytes);
    if (got1 !== COMPILER_SHA1) throw new Error(`compiler sha1 ${got1} != ${COMPILER_SHA1}`);
    if (got256 !== COMPILER_SHA256) throw new Error(`compiler sha256 ${got256} != ${COMPILER_SHA256}`);
    const installed = path.join(dir, "node_modules/@lwc/compiler/package.json");
    if (!fs.existsSync(installed)) {
        fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({
            private: true,
            dependencies: { "@lwc/compiler": COMPILER_VERSION },
        }));
        run("npm", ["install", "--save-exact", "--no-audit", "--no-fund", "--ignore-scripts", `@lwc/compiler@${COMPILER_VERSION}`], { cwd: dir });
    }
    const pkg = JSON.parse(fs.readFileSync(installed, "utf8"));
    if (pkg.version !== COMPILER_VERSION) throw new Error("compiler version " + pkg.version);
    return { dir, sha1: got1, sha256: got256, gitHead: pkg.gitHead || COMPILER_GIT_HEAD };
}

function walk(dir, rel, acc) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const dirs = [];
    const files = [];
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
            dirs.push(entry.name);
        } else if (entry.isFile()) {
            files.push(entry.name);
        }
    }
    const base = path.basename(dir);
    const js = base + ".js";
    const ts = base + ".ts";
    if (files.includes(js) || files.includes(ts)) {
        const parent = path.basename(path.dirname(dir));
        const namespace = parent === "lwc" ? "c" : parent;
        const entryName = files.includes(js) ? js : ts;
        const relPosix = rel.split(path.sep).join("/");
        acc.push({
            rel: relPosix,
            namespace,
            name: base,
            entry: entryName,
            abs: path.join(dir, entryName),
            files: files.slice().sort(),
        });
    }
    dirs.sort();
    for (const name of dirs) {
        walk(path.join(dir, name), rel === "" ? name : rel + "/" + name, acc);
    }
}

function primaryCount(components) {
    let n = 0;
    for (const component of components) {
        for (const file of component.files) {
            if (file === component.name + ".js" || file === component.name + ".ts"
                || file === component.name + ".html" || file === component.name + ".css") {
                n++;
            }
        }
    }
    return n;
}

// mulberry32. Used only when SAMPLE_SIZE is a positive integer.
function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function sampleComponents(components) {
    const sorted = components.slice().sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
    const limit = process.env.LWC_SAMPLE_SIZE ? Number(process.env.LWC_SAMPLE_SIZE) : null;
    if (limit == null || Number.isNaN(limit) || limit >= sorted.length) {
        return { selected: sorted, strategy: "all" };
    }
    const rng = mulberry32(SEED);
    const copy = sorted.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
    }
    const selected = copy.slice(0, limit).sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
    return { selected, strategy: "mulberry32-fisher-yates" };
}

const lbc = ensureLbc();
const recipes = ensureRecipes();
const compiler = ensureCompiler();
const { transformSync } = await import(pathToFileURL(path.join(compiler.dir, "node_modules/@lwc/compiler/dist/index.js")).href);

const discovered = [];
walk(lbc.root, "lbc", discovered);
walk(recipes, "lbc-recipes", discovered);
const { selected, strategy } = sampleComponents(discovered);

const modulesDir = path.join(corpusDir, "modules");
fs.rmSync(modulesDir, { recursive: true, force: true });
fs.mkdirSync(modulesDir, { recursive: true });

const files = [];
const failures = [];
for (const component of selected) {
    const src = fs.readFileSync(component.abs, "utf8");
    const filename = component.rel + "/" + component.entry;
    const outRel = path.posix.join(
        "modules",
        component.rel.split("/")[0],
        component.namespace,
        component.name + ".js",
    );
    try {
        const result = transformSync(src, filename, {
            name: component.name,
            namespace: component.namespace,
        });
        const again = transformSync(src, filename, {
            name: component.name,
            namespace: component.namespace,
        });
        if (again.code !== result.code) {
            throw new Error("transformSync was not deterministic");
        }
        const outAbs = path.join(corpusDir, outRel);
        fs.mkdirSync(path.dirname(outAbs), { recursive: true });
        fs.writeFileSync(outAbs, result.code);
        files.push({
            path: outRel,
            sha256: sha256(Buffer.from(result.code, "utf8")),
            bytes: Buffer.byteLength(result.code, "utf8"),
            source: filename,
            namespace: component.namespace,
            name: component.name,
        });
    } catch (error) {
        failures.push({ source: filename, reason: error.message });
    }
}

if (failures.length) {
    console.error(JSON.stringify(failures.slice(0, 20), null, 2));
    throw new Error(failures.length + " components failed to compile");
}

files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
const manifest = {
    schema: 1,
    seed: SEED,
    sample: {
        strategy,
        discovered_components: discovered.length,
        selected_components: selected.length,
        primary_files: primaryCount(discovered),
        all_files_in_component_dirs: discovered.reduce((n, c) => n + c.files.length, 0),
        note: "primary_files counts <dirname>.js, <dirname>.ts, <dirname>.html, and <dirname>.css only. all_files_in_component_dirs also counts .d.ts, .map, SLDS css, meta xml, and helper modules that sit in the same directory. The reference 725 matches primary_files.",
    },
    sources: {
        lbc: {
            package: "lightning-base-components",
            version: LBC_VERSION,
            dist_shasum: lbc.sha1,
            dist_sha256: lbc.sha256,
        },
        "lbc-recipes": {
            repo: RECIPES_REMOTE,
            commit: RECIPES_COMMIT,
        },
    },
    compiler: {
        lwc_sha: LWC_SHA,
        version: COMPILER_VERSION,
        build_method: "npm",
        npm_package: `@lwc/compiler@${COMPILER_VERSION}`,
        npm_shasum: compiler.sha1,
        npm_sha256: compiler.sha256,
        npm_git_head: compiler.gitHead,
        note: "packages/@lwc at b9e8007 differs from the published 9.5.3 gitHead (f07d63b) only in perf-benchmark files. Compiler sources match, so the registry tarball is the compiler from that commit. A full monorepo yarn build was not run.",
    },
    terser: TERSER_VERSION,
    node: process.version,
    files,
};
fs.writeFileSync(path.join(corpusDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify({
    discovered: discovered.length,
    selected: selected.length,
    primary_files: manifest.sample.primary_files,
    all_files: manifest.sample.all_files_in_component_dirs,
    lbc_sha256: lbc.sha256,
    compiler_sha256: compiler.sha256,
    first: files[0] && files[0].sha256,
    last: files[files.length - 1] && files[files.length - 1].sha256,
}, null, 2));
