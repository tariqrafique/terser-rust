// Download the pinned bundles listed in corpus/bundles/manifest.json.
// Files land in corpus/bundles/files, which is gitignored.

import { createHash } from "crypto";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const bundlesDir = path.join(here, "corpus/bundles");
const cache = path.join(bundlesDir, ".cache");
const manifest = JSON.parse(fs.readFileSync(path.join(bundlesDir, "manifest.json"), "utf8"));

function sha256(buf) {
    return createHash("sha256").update(buf).digest("hex");
}

function sha1(buf) {
    return createHash("sha1").update(buf).digest("hex");
}

fs.mkdirSync(cache, { recursive: true });
fs.mkdirSync(path.join(bundlesDir, "files"), { recursive: true });

for (const entry of manifest.files) {
    const tgzName = `${entry.package.replace("@", "").replace("/", "-")}-${entry.version}.tgz`;
    const tgz = path.join(cache, tgzName);
    if (!fs.existsSync(tgz)) {
        execFileSync("npm", ["pack", `${entry.package}@${entry.version}`, "--pack-destination", cache], {
            stdio: "inherit",
        });
    }
    const packed = fs.readFileSync(tgz);
    const got1 = sha1(packed);
    const got256 = sha256(packed);
    if (got1 !== entry.tarball_sha1) throw new Error(`${entry.id} tarball sha1 ${got1}`);
    if (got256 !== entry.tarball_sha256) throw new Error(`${entry.id} tarball sha256 ${got256}`);
    const extractDir = path.join(cache, "extract");
    fs.rmSync(extractDir, { recursive: true, force: true });
    fs.mkdirSync(extractDir, { recursive: true });
    execFileSync("tar", ["-xzf", tgz, "-C", extractDir, entry.inner_path], { stdio: "inherit" });
    const extracted = fs.readFileSync(path.join(extractDir, entry.inner_path));
    const fileHash = sha256(extracted);
    if (fileHash !== entry.sha256) throw new Error(`${entry.id} file sha256 ${fileHash}`);
    const dest = path.join(bundlesDir, entry.file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, extracted);
    console.log(`${entry.id} ${fileHash} ${extracted.length} bytes`);
}
