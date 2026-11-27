//! Byte-for-byte board against `harness/expected`.

use serde_json::Value;
use sha2::{Digest, Sha256};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use terser::{minify, Options};

const MAX_SHOW: usize = 8;
const CORPORA: &[&str] = &["compress", "lwc", "bundles"];
const SETS: &[&str] = &["roundtrip", "mangle", "default", "fixture"];

struct Case {
    id: String,
    corpus: String,
    input: String,
    sets: Vec<String>,
    /// Fixture options for compress cases. Empty for the other corpora.
    fixture: Value,
}

struct Failure {
    id: String,
    offset: usize,
    expected: String,
    actual: String,
}

struct Group {
    pass: u64,
    total: u64,
    shown: Vec<Failure>,
    hidden: u64,
}

pub fn run() -> Result<(), String> {
    let harness_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let repo = harness_dir
        .parent()
        .ok_or("harness crate is at the repository root")?
        .to_path_buf();
    let corpus = harness_dir.join("corpus");
    let expected = harness_dir.join("expected");
    if !expected.is_dir() {
        return Err("harness/expected is missing; run node harness/oracle.mjs".into());
    }

    let cases = load_cases(&corpus)?;
    let mut groups: Vec<((String, String), Group)> = Vec::new();
    for corpus_name in CORPORA {
        for set_name in SETS {
            let key = ((*corpus_name).to_string(), (*set_name).to_string());
            if cases.iter().any(|case| case.corpus == key.0 && case.sets.iter().any(|s| s == &key.1)) {
                groups.push((
                    key,
                    Group {
                        pass: 0,
                        total: 0,
                        shown: Vec::new(),
                        hidden: 0,
                    },
                ));
            }
        }
    }

    let mut corrupt = 0u64;
    for case in &cases {
        let expected_path = expected.join(format!("{}.json", case.id));
        let file = fs::read_to_string(&expected_path).map_err(|err| {
            format!("missing expected {}: {err}", expected_path.display())
        })?;
        let parsed: Value = serde_json::from_str(&file)
            .map_err(|err| format!("bad expected {}: {err}", case.id))?;
        let sets = parsed
            .get("sets")
            .and_then(|v| v.as_object())
            .ok_or_else(|| format!("{} has no sets", case.id))?;
        let input_sha = parsed
            .get("input_sha256")
            .and_then(|v| v.as_str())
            .unwrap_or("");
        if input_sha != sha256_hex(case.input.as_bytes()) {
            corrupt += 1;
        }

        for set_name in &case.sets {
            let group = groups
                .iter_mut()
                .find(|((corpus, set), _)| corpus == &case.corpus && set == set_name)
                .ok_or_else(|| format!("no group for {} {}", case.corpus, set_name))?;
            group.1.total += 1;
            let record = sets
                .get(set_name)
                .ok_or_else(|| format!("{} missing set {set_name}", case.id))?;
            let expected_bytes = record_bytes(record).map_err(|err| format!("{} {set_name}: {err}", case.id))?;
            let claimed = record
                .get("sha256")
                .and_then(|v| v.as_str())
                .unwrap_or("");
            if claimed != sha256_hex(&expected_bytes) {
                corrupt += 1;
            }

            let options = if set_name == "fixture" {
                Options::new(case.fixture.clone())
            } else {
                Options::new(named_options(set_name))
            };
            let actual = match minify(&case.input, &options) {
                Ok(output) => output.code.into_bytes(),
                Err(error) => canonical_error("error", &error.to_string(), None, None),
            };
            if actual == expected_bytes {
                group.1.pass += 1;
            } else if group.1.shown.len() < MAX_SHOW {
                let offset = first_diff(&expected_bytes, &actual).unwrap_or(0);
                group.1.shown.push(Failure {
                    id: case.id.clone(),
                    offset,
                    expected: window(&expected_bytes, offset),
                    actual: window(&actual, offset),
                });
            } else {
                group.1.hidden += 1;
            }
        }
    }

    let manifest = corpus_hash(&corpus)?;
    let board_id = format!("{}-{}", git_id(&repo), &manifest[..12]);
    println!("board {board_id}");
    println!();
    println!("{:<10} {:<10} {:>12}", "corpus", "set", "pass/total");
    let mut pass = 0u64;
    let mut total = 0u64;
    for ((corpus, set), group) in &groups {
        println!(
            "{:<10} {:<10} {:>12}",
            corpus,
            set,
            format!("{}/{}", group.pass, group.total)
        );
        pass += group.pass;
        total += group.total;
    }
    println!();
    println!("total {pass}/{total}");
    if corrupt > 0 {
        println!("corrupt expected records: {corrupt}");
    }
    println!();
    for ((corpus, set), group) in &groups {
        let failed = group.total - group.pass;
        if failed == 0 {
            continue;
        }
        let shown = group.shown.len() as u64;
        println!(
            "{corpus} / {set}  failures {failed} (showing {shown})"
        );
        for failure in &group.shown {
            println!("  {}  byte {}", failure.id, failure.offset);
            println!("    expected: {}", failure.expected);
            println!("    actual:   {}", failure.actual);
        }
        if group.hidden > 0 {
            println!("  … {} more", group.hidden);
        }
        println!();
    }
    Ok(())
}

fn named_options(set: &str) -> Value {
    match set {
        "roundtrip" => serde_json::json!({"compress": false, "mangle": false}),
        "mangle" => serde_json::json!({"compress": false, "mangle": true}),
        "default" => serde_json::json!({}),
        other => panic!("unknown option set {other}"),
    }
}

fn record_bytes(record: &Value) -> Result<Vec<u8>, String> {
    let kind = record
        .get("kind")
        .and_then(|v| v.as_str())
        .ok_or("record has no kind")?;
    if kind == "code" {
        let code = record
            .get("code")
            .and_then(|v| v.as_str())
            .ok_or("code record has no code")?;
        return Ok(code.as_bytes().to_vec());
    }
    if kind == "error" {
        let name = record.get("name").and_then(|v| v.as_str()).unwrap_or("Error");
        let message = record
            .get("message")
            .and_then(|v| v.as_str())
            .unwrap_or("");
        let line = json_int(record.get("line"));
        let col = json_int(record.get("col"));
        return Ok(canonical_error(name, message, line, col));
    }
    Err(format!("unknown kind {kind}"))
}

fn json_int(value: Option<&Value>) -> Option<i64> {
    match value {
        Some(Value::Number(n)) => n.as_i64(),
        _ => None,
    }
}

fn canonical_error(name: &str, message: &str, line: Option<i64>, col: Option<i64>) -> Vec<u8> {
    let line = line.map(|n| n.to_string()).unwrap_or_default();
    let col = col.map(|n| n.to_string()).unwrap_or_default();
    format!("{name}\n{message}\n{line}\n{col}\n").into_bytes()
}

fn first_diff(expected: &[u8], actual: &[u8]) -> Option<usize> {
    let n = expected.len().min(actual.len());
    for i in 0..n {
        if expected[i] != actual[i] {
            return Some(i);
        }
    }
    if expected.len() != actual.len() {
        Some(n)
    } else {
        None
    }
}

fn window(bytes: &[u8], offset: usize) -> String {
    let start = offset.saturating_sub(24);
    let end = (offset + 24).min(bytes.len());
    format!(
        "[{} bytes] {}{}{}",
        bytes.len(),
        if start > 0 { "…" } else { "" },
        escape(&bytes[start..end]),
        if end < bytes.len() { "…" } else { "" }
    )
}

fn escape(bytes: &[u8]) -> String {
    let mut out = String::new();
    for &byte in bytes {
        match byte {
            b' '..=b'~' => out.push(byte as char),
            b'\n' => out.push_str("\\n"),
            b'\r' => out.push_str("\\r"),
            b'\t' => out.push_str("\\t"),
            _ => out.push_str(&format!("\\x{byte:02x}")),
        }
    }
    out
}

fn sha256_hex(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    hex::encode(hasher.finalize())
}

fn load_cases(corpus: &Path) -> Result<Vec<Case>, String> {
    let mut cases = Vec::new();
    let mut compress = Vec::new();
    collect_files(&corpus.join("compress/cases"), &mut compress)?;
    compress.sort();
    for path in compress {
        let text = fs::read_to_string(&path).map_err(|err| format!("{}: {err}", path.display()))?;
        let value: Value = serde_json::from_str(&text).map_err(|err| format!("{}: {err}", path.display()))?;
        let id = json_str(&value, "id").ok_or_else(|| format!("{} has no id", path.display()))?;
        let input = json_str(&value, "input").ok_or_else(|| format!("{id} has no input"))?;
        let fixture = value.get("fixture").cloned().unwrap_or(Value::Null);
        cases.push(Case {
            id,
            corpus: "compress".into(),
            input,
            sets: vec![
                "roundtrip".into(),
                "mangle".into(),
                "default".into(),
                "fixture".into(),
            ],
            fixture,
        });
    }

    let lwc: Value = read_json(&corpus.join("lwc/manifest.json"))?;
    let files = lwc
        .get("files")
        .and_then(|v| v.as_array())
        .ok_or("lwc manifest has no files")?;
    for file in files {
        let rel = file
            .get("path")
            .and_then(|v| v.as_str())
            .ok_or("lwc file missing path")?;
        let input = fs::read_to_string(corpus.join("lwc").join(rel))
            .map_err(|err| format!("lwc {rel}: {err}"))?;
        let id = format!(
            "lwc/{}",
            rel.trim_start_matches("modules/").trim_end_matches(".js")
        );
        cases.push(Case {
            id,
            corpus: "lwc".into(),
            input,
            sets: vec!["roundtrip".into(), "mangle".into(), "default".into()],
            fixture: Value::Null,
        });
    }

    let bundles: Value = read_json(&corpus.join("bundles/manifest.json"))?;
    let files = bundles
        .get("files")
        .and_then(|v| v.as_array())
        .ok_or("bundles manifest has no files")?;
    for file in files {
        let id = file
            .get("id")
            .and_then(|v| v.as_str())
            .ok_or("bundle missing id")?
            .to_string();
        let rel = file
            .get("file")
            .and_then(|v| v.as_str())
            .ok_or("bundle missing file")?;
        let path = corpus.join("bundles").join(rel);
        if !path.is_file() {
            return Err(format!(
                "missing {}; run node harness/fetch-bundles.mjs",
                path.display()
            ));
        }
        let input = fs::read_to_string(&path).map_err(|err| format!("{}: {err}", path.display()))?;
        cases.push(Case {
            id,
            corpus: "bundles".into(),
            input,
            sets: vec!["roundtrip".into(), "mangle".into(), "default".into()],
            fixture: Value::Null,
        });
    }
    Ok(cases)
}

fn json_str(value: &Value, key: &str) -> Option<String> {
    value.get(key).and_then(|v| v.as_str()).map(|s| s.to_string())
}

fn read_json(path: &Path) -> Result<Value, String> {
    let text = fs::read_to_string(path).map_err(|err| format!("{}: {err}", path.display()))?;
    serde_json::from_str(&text).map_err(|err| format!("{}: {err}", path.display()))
}

fn collect_files(dir: &Path, out: &mut Vec<PathBuf>) -> Result<(), String> {
    if !dir.is_dir() {
        return Err(format!("missing {}", dir.display()));
    }
    let mut entries = fs::read_dir(dir)
        .map_err(|err| format!("{}: {err}", dir.display()))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|err| err.to_string())?;
    entries.sort_by_key(|entry| entry.file_name());
    for entry in entries {
        let path = entry.path();
        if path.is_dir() {
            collect_files(&path, out)?;
        } else if path.extension().and_then(|ext| ext.to_str()) == Some("json") {
            out.push(path);
        }
    }
    Ok(())
}

fn corpus_hash(corpus: &Path) -> Result<String, String> {
    let mut files = Vec::new();
    collect_hash_files(corpus, &mut files)?;
    files.sort();
    let mut hasher = Sha256::new();
    for path in files {
        let rel = path
            .strip_prefix(corpus)
            .map_err(|_| format!("path outside corpus: {}", path.display()))?;
        let rel = rel.to_string_lossy().replace('\\', "/");
        let bytes = fs::read(&path).map_err(|err| format!("{}: {err}", path.display()))?;
        hasher.update(rel.as_bytes());
        hasher.update(b"\0");
        hasher.update(sha256_hex(&bytes).as_bytes());
        hasher.update(b"\n");
    }
    Ok(hex::encode(hasher.finalize()))
}

fn collect_hash_files(dir: &Path, out: &mut Vec<PathBuf>) -> Result<(), String> {
    let mut entries = fs::read_dir(dir)
        .map_err(|err| format!("{}: {err}", dir.display()))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|err| err.to_string())?;
    entries.sort_by_key(|entry| entry.file_name());
    for entry in entries {
        let name = entry.file_name();
        let name = name.to_string_lossy();
        if name == ".cache" || name == "node_modules" {
            continue;
        }
        let path = entry.path();
        if path.is_dir() {
            collect_hash_files(&path, out)?;
        } else if path.is_file() {
            out.push(path);
        }
    }
    Ok(())
}

fn git_id(repo: &Path) -> String {
    let sha = Command::new("git")
        .args(["rev-parse", "--short=12", "HEAD"])
        .current_dir(repo)
        .output();
    let sha = match sha {
        Ok(output) if output.status.success() => {
            String::from_utf8_lossy(&output.stdout).trim().to_string()
        }
        _ => "nogit".into(),
    };
    let dirty = Command::new("git")
        .args(["status", "--porcelain"])
        .current_dir(repo)
        .output();
    let dirty = match dirty {
        Ok(output) if output.status.success() => !output.stdout.is_empty(),
        _ => false,
    };
    if dirty {
        format!("{sha}-dirty")
    } else {
        sha
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn diff_finds_the_first_byte() {
        assert_eq!(first_diff(b"abc", b"abc"), None);
        assert_eq!(first_diff(b"abc", b"axc"), Some(1));
        assert_eq!(first_diff(b"ab", b"abc"), Some(2));
    }

    #[test]
    fn error_canonical_matches_the_oracle() {
        let bytes = canonical_error("SyntaxError", "Unexpected token: punc (})", Some(2), Some(17));
        assert_eq!(
            std::str::from_utf8(&bytes).unwrap(),
            "SyntaxError\nUnexpected token: punc (})\n2\n17\n"
        );
    }

    #[test]
    fn named_sets_match_the_oracle() {
        assert_eq!(
            named_options("roundtrip"),
            serde_json::json!({"compress": false, "mangle": false})
        );
        assert_eq!(
            named_options("mangle"),
            serde_json::json!({"compress": false, "mangle": true})
        );
        assert_eq!(named_options("default"), serde_json::json!({}));
    }
}
