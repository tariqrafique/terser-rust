//! Byte-for-byte board against `harness/expected`.
//!
//! Expected files are loaded once. Cases run on a rayon pool, each in its own
//! thread so a hang can be timed out without stalling the rest. Node is not
//! invoked; the oracle already wrote `harness/expected`.

use rayon::prelude::*;
use serde_json::Value;
use sha2::{Digest, Sha256};
use std::collections::{HashMap, HashSet};
use std::fs;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::mpsc;
use std::thread;
use std::time::{Duration, Instant};
use terser::{minify, Options};

const MAX_SHOW: usize = 8;
const MAX_BUCKETS: usize = 12;
const CORPORA: &[&str] = &["compress", "lwc", "lwc-rollup", "bundles"];
const SETS: &[&str] = &["roundtrip", "mangle", "default", "fixture", "lwc-rollup"];

pub const USAGE: &str = "\
usage: harness board [options]
  --corpus <name>       compress, lwc, lwc-rollup, or bundles (repeatable)
  --set <name>          roundtrip, mangle, default, fixture, or lwc-rollup (repeatable)
  --filter <substring>  case id must contain this
  --failed              only cases that failed the previous run
  --case <id>           one case, full expected/actual diff
  --save-baseline       write pass/fail for this run
  --compare             newly passing and newly failing versus the baseline
  --timeout-ms <n>      per-case limit (default 30000)
";

pub struct Args {
    corpora: Vec<String>,
    sets: Vec<String>,
    filter: Option<String>,
    failed_only: bool,
    case_id: Option<String>,
    save_baseline: bool,
    compare: bool,
    timeout: Duration,
}

impl Args {
    pub fn parse(mut args: impl Iterator<Item = String>) -> Result<Self, String> {
        let mut parsed = Args {
            corpora: Vec::new(),
            sets: Vec::new(),
            filter: None,
            failed_only: false,
            case_id: None,
            save_baseline: false,
            compare: false,
            timeout: Duration::from_millis(30_000),
        };
        while let Some(arg) = args.next() {
            match arg.as_str() {
                "--corpus" => parsed.corpora.push(need(&mut args, "--corpus")?),
                "--set" => parsed.sets.push(need(&mut args, "--set")?),
                "--filter" => parsed.filter = Some(need(&mut args, "--filter")?),
                "--case" => parsed.case_id = Some(need(&mut args, "--case")?),
                "--timeout-ms" => {
                    let raw = need(&mut args, "--timeout-ms")?;
                    let ms: u64 = raw
                        .parse()
                        .map_err(|_| format!("--timeout-ms wants an integer, got {raw}"))?;
                    parsed.timeout = Duration::from_millis(ms);
                }
                "--failed" => parsed.failed_only = true,
                "--save-baseline" => parsed.save_baseline = true,
                "--compare" => parsed.compare = true,
                other => return Err(format!("unknown argument {other}")),
            }
        }
        Ok(parsed)
    }
}

fn need(args: &mut impl Iterator<Item = String>, flag: &str) -> Result<String, String> {
    args.next().ok_or_else(|| format!("{flag} needs a value"))
}

struct Case {
    id: String,
    corpus: String,
    input: String,
    sets: Vec<String>,
    fixture: Value,
}

struct Job {
    corpus: String,
    set_name: String,
    id: String,
    input: String,
    options: Options,
    expected: Vec<u8>,
}

struct Outcome {
    corpus: String,
    set_name: String,
    id: String,
    passed: bool,
    offset: usize,
    signature: String,
    expected_window: String,
    actual_window: String,
    expected_full: Vec<u8>,
    actual_full: Vec<u8>,
}

#[derive(Debug)]
enum EvalFail {
    Panic(String),
    Timeout,
}

pub fn run(args: Args) -> Result<(), String> {
    let started = Instant::now();
    let harness_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let repo = harness_dir
        .parent()
        .ok_or("harness crate is at the repository root")?
        .to_path_buf();
    let corpus = harness_dir.join("corpus");
    let expected_dir = harness_dir.join("expected");
    if !expected_dir.is_dir() {
        return Err("harness/expected is missing; run node harness/oracle.mjs".into());
    }
    let cache = harness_dir.join(".board-cache");

    let failed_keys = if args.failed_only {
        Some(read_keys(&cache.join("failed.tsv"))?)
    } else {
        None
    };

    let skip_abort = load_skip_list(&corpus.join("skip-abort.txt"))?;
    let (cases, rollup_files, rollup_unique) = load_cases(&corpus)?;
    let mut jobs = Vec::new();
    let mut corrupt = 0u64;
    let expected = load_expected(&expected_dir, &cases)?;
    for case in &cases {
        let loaded = expected
            .get(&case.id)
            .ok_or_else(|| format!("missing expected for {}", case.id))?;
        if !loaded.sha_ok {
            corrupt += 1;
        }
        for set_name in &case.sets {
            if !selected(case, set_name, &args, failed_keys.as_ref()) {
                continue;
            }
            if skip_abort.contains(&case.id)
                && (set_name == "roundtrip" || set_name == "mangle" || set_name == "default" || set_name == "fixture")
            {
                continue;
            }
            let bytes = loaded
                .sets
                .get(set_name)
                .ok_or_else(|| format!("{} missing set {set_name}", case.id))?;
            let options = if set_name == "fixture" {
                Options::new(case.fixture.clone())
            } else {
                Options::new(named_options(set_name))
            };
            jobs.push(Job {
                corpus: case.corpus.clone(),
                set_name: set_name.clone(),
                id: case.id.clone(),
                input: case.input.clone(),
                options,
                expected: bytes.clone(),
            });
        }
    }

    let full = args.case_id.is_some();
    let timeout = args.timeout;
    let outcomes: Vec<Outcome> = jobs
        .par_iter()
        .map(|job| evaluate(job, timeout, full))
        .collect();

    let mut groups: Vec<((String, String), Group)> = Vec::new();
    for corpus_name in CORPORA {
        for set_name in SETS {
            if outcomes
                .iter()
                .any(|o| o.corpus == *corpus_name && o.set_name == *set_name)
            {
                groups.push((
                    ((*corpus_name).to_string(), (*set_name).to_string()),
                    Group::default(),
                ));
            }
        }
    }
    let mut buckets: HashMap<String, (u64, String)> = HashMap::new();
    let mut failed_keys_out = if cache.join("failed.tsv").is_file() {
        read_keys(&cache.join("failed.tsv")).unwrap_or_default()
    } else {
        HashSet::new()
    };
    let mut baseline_lines = Vec::new();
    for outcome in &outcomes {
        let group = groups
            .iter_mut()
            .find(|((c, s), _)| c == &outcome.corpus && s == &outcome.set_name)
            .expect("group");
        group.1.total += 1;
        let key = format!("{}\t{}\t{}", outcome.corpus, outcome.set_name, outcome.id);
        baseline_lines.push(format!("{key}\t{}", if outcome.passed { "p" } else { "f" }));
        if outcome.passed {
            group.1.pass += 1;
            failed_keys_out.remove(&key);
            continue;
        }
        failed_keys_out.insert(key);
        let entry = buckets
            .entry(outcome.signature.clone())
            .or_insert((0, outcome.id.clone()));
        entry.0 += 1;
        if group.1.shown.len() < MAX_SHOW {
            group.1.shown.push(outcome);
        } else {
            group.1.hidden += 1;
        }
    }

    fs::create_dir_all(&cache).map_err(|err| err.to_string())?;
    let mut failed_lines: Vec<_> = failed_keys_out.into_iter().collect();
    failed_lines.sort();
    write_lines(&cache.join("failed.tsv"), &failed_lines)?;
    if args.save_baseline {
        let mut body = format!("git {}\n", git_id(&repo));
        for line in &baseline_lines {
            body.push_str(line);
            body.push('\n');
        }
        fs::write(cache.join("baseline.tsv"), body).map_err(|err| err.to_string())?;
    }

    let manifest = corpus_hash(&corpus)?;
    let board_id = format!("{}-{}", git_id(&repo), &manifest[..12]);
    println!("board {board_id}");
    println!();
    println!("{:<10} {:<10} {:>12}", "corpus", "set", "pass/total");
    let mut pass = 0u64;
    let mut total = 0u64;
    for ((corpus_name, set_name), group) in &groups {
        println!(
            "{:<10} {:<10} {:>12}",
            corpus_name,
            set_name,
            format!("{}/{}", group.pass, group.total)
        );
        pass += group.pass;
        total += group.total;
    }
    println!();
    println!("total {pass}/{total}");
    let show_rollup = args.corpora.is_empty() || args.corpora.iter().any(|name| name == "lwc-rollup");
    if show_rollup && rollup_files > 0 {
        println!("lwc-rollup inputs {rollup_unique} unique, {rollup_files} in the manifest");
    }
    if corrupt > 0 {
        println!("corrupt expected records: {corrupt}");
    }
    if jobs.is_empty() {
        println!("no cases matched");
    }
    if !skip_abort.is_empty()
        && (args.corpora.is_empty() || args.corpora.iter().any(|c| c == "compress"))
        && (args.sets.is_empty()
            || args.sets.iter().any(|s| s == "roundtrip" || s == "mangle" || s == "default" || s == "fixture"))
        && args.case_id.is_none()
    {
        let mut ids: Vec<_> = skip_abort
            .iter()
            .filter(|id| match &args.filter {
                Some(filter) => id.contains(filter.as_str()),
                None => true,
            })
            .cloned()
            .collect();
        ids.sort();
        println!();
        println!(
            "excluded abort (not scored, approved skip): {}",
            ids.len()
        );
        for id in ids {
            println!("  {id}");
        }
    }
    println!("elapsed {:.3}s", started.elapsed().as_secs_f64());

    if args.compare {
        print_compare(&cache.join("baseline.tsv"), &baseline_lines)?;
    }

    if !buckets.is_empty() {
        println!();
        println!("buckets");
        let mut ranked: Vec<_> = buckets.into_iter().collect();
        ranked.sort_by(|a, b| b.1 .0.cmp(&a.1 .0).then_with(|| a.0.cmp(&b.0)));
        for (sig, (count, example)) in ranked.iter().take(MAX_BUCKETS) {
            println!("  {count:>5}  {sig}  e.g. {example}");
        }
        if ranked.len() > MAX_BUCKETS {
            println!("  … {} more signatures", ranked.len() - MAX_BUCKETS);
        }
    }

    if full {
        println!();
        for outcome in &outcomes {
            print_full(outcome);
        }
    } else {
        println!();
        for ((corpus_name, set_name), group) in &groups {
            let failed = group.total - group.pass;
            if failed == 0 {
                continue;
            }
            println!(
                "{corpus_name} / {set_name}  failures {failed} (showing {})",
                group.shown.len()
            );
            for failure in &group.shown {
                println!("  {}  byte {}", failure.id, failure.offset);
                println!("    expected: {}", failure.expected_window);
                println!("    actual:   {}", failure.actual_window);
            }
            if group.hidden > 0 {
                println!("  … {} more", group.hidden);
            }
            println!();
        }
    }
    Ok(())
}

#[derive(Default)]
struct Group<'a> {
    pass: u64,
    total: u64,
    shown: Vec<&'a Outcome>,
    hidden: u64,
}

fn selected(case: &Case, set_name: &str, args: &Args, failed: Option<&HashSet<String>>) -> bool {
    if let Some(id) = &args.case_id {
        if case.id != *id {
            return false;
        }
    }
    if !args.corpora.is_empty() && !args.corpora.iter().any(|c| c == &case.corpus) {
        return false;
    }
    if !args.sets.is_empty() && !args.sets.iter().any(|s| s == set_name) {
        return false;
    }
    if let Some(filter) = &args.filter {
        if !case.id.contains(filter.as_str()) {
            return false;
        }
    }
    if let Some(failed) = failed {
        let key = format!("{}\t{}\t{}", case.corpus, set_name, case.id);
        if !failed.contains(&key) {
            return false;
        }
    }
    true
}

fn evaluate(job: &Job, timeout: Duration, full: bool) -> Outcome {
    let input = job.input.clone();
    let options = job.options.clone();
    let result = eval_with_timeout(timeout, move || match minify(&input, &options) {
        Ok(output) => output.code.into_bytes(),
        Err(error) => canonical_error(error.name(), &error.to_string(), error.line(), error.col()),
    });
    let (actual, fail) = match result {
        Ok(bytes) => (bytes, None),
        Err(EvalFail::Timeout) => (
            canonical_error("error", "timeout", None, None),
            Some("timeout".into()),
        ),
        Err(EvalFail::Panic(message)) => (
            canonical_error("error", "panic", None, None),
            Some(format!("panic:{message}")),
        ),
    };
    let passed = fail.is_none() && actual == job.expected;
    let offset = if passed {
        0
    } else {
        first_diff(&job.expected, &actual).unwrap_or(0)
    };
    let signature = if let Some(kind) = fail {
        kind
    } else if passed {
        String::new()
    } else {
        format!(
            "@{offset}:{}!={}",
            lexeme(&job.expected, offset),
            lexeme(&actual, offset)
        )
    };
    Outcome {
        corpus: job.corpus.clone(),
        set_name: job.set_name.clone(),
        id: job.id.clone(),
        passed,
        offset,
        signature,
        expected_window: window(&job.expected, offset),
        actual_window: window(&actual, offset),
        expected_full: if full {
            job.expected.clone()
        } else {
            Vec::new()
        },
        actual_full: if full { actual } else { Vec::new() },
    }
}

fn eval_with_timeout<T, F>(timeout: Duration, f: F) -> Result<T, EvalFail>
where
    T: Send + 'static,
    F: FnOnce() -> T + Send + 'static,
{
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        let result = catch_unwind(AssertUnwindSafe(f));
        let _ = tx.send(result);
    });
    match rx.recv_timeout(timeout) {
        Ok(Ok(value)) => Ok(value),
        Ok(Err(payload)) => Err(EvalFail::Panic(panic_message(payload))),
        Err(mpsc::RecvTimeoutError::Timeout) => Err(EvalFail::Timeout),
        Err(mpsc::RecvTimeoutError::Disconnected) => Err(EvalFail::Panic("disconnected".into())),
    }
}

fn panic_message(payload: Box<dyn std::any::Any + Send>) -> String {
    if let Some(message) = payload.downcast_ref::<&str>() {
        (*message).to_string()
    } else if let Some(message) = payload.downcast_ref::<String>() {
        message.clone()
    } else {
        "box".into()
    }
}

fn print_full(outcome: &Outcome) {
    let status = if outcome.passed { "pass" } else { "fail" };
    println!(
        "case {} set {} {status} byte {}",
        outcome.id, outcome.set_name, outcome.offset
    );
    println!(
        "----- expected ({} bytes) -----",
        outcome.expected_full.len()
    );
    println!("{}", String::from_utf8_lossy(&outcome.expected_full));
    println!("----- actual ({} bytes) -----", outcome.actual_full.len());
    println!("{}", String::from_utf8_lossy(&outcome.actual_full));
    println!();
}

fn print_compare(path: &Path, current: &[String]) -> Result<(), String> {
    let text = fs::read_to_string(path).map_err(|_| {
        format!(
            "no baseline at {}; run board --save-baseline first",
            path.display()
        )
    })?;
    let mut baseline_sha = String::from("unknown");
    let mut before: HashMap<String, bool> = HashMap::new();
    for line in text.lines() {
        if let Some(sha) = line.strip_prefix("git ") {
            baseline_sha = sha.to_string();
            continue;
        }
        let mut parts = line.split('\t');
        let corpus = parts.next().unwrap_or("");
        let set_name = parts.next().unwrap_or("");
        let id = parts.next().unwrap_or("");
        let flag = parts.next().unwrap_or("");
        if id.is_empty() {
            continue;
        }
        before.insert(format!("{corpus}\t{set_name}\t{id}"), flag == "p");
    }
    let mut gained = Vec::new();
    let mut lost = Vec::new();
    for line in current {
        let mut parts = line.split('\t');
        let corpus = parts.next().unwrap_or("");
        let set_name = parts.next().unwrap_or("");
        let id = parts.next().unwrap_or("");
        let flag = parts.next().unwrap_or("");
        let key = format!("{corpus}\t{set_name}\t{id}");
        let now_pass = flag == "p";
        if let Some(was_pass) = before.get(&key) {
            if *was_pass && !now_pass {
                lost.push(format!("{set_name} {id}"));
            } else if !was_pass && now_pass {
                gained.push(format!("{set_name} {id}"));
            }
        }
    }
    gained.sort();
    lost.sort();
    println!();
    println!(
        "compare vs baseline {baseline_sha}: {} newly passing, {} newly failing",
        gained.len(),
        lost.len()
    );
    for line in gained.iter().take(40) {
        println!("  pass {line}");
    }
    if gained.len() > 40 {
        println!("  … {} more newly passing", gained.len() - 40);
    }
    for line in lost.iter().take(40) {
        println!("  FAIL {line}");
    }
    if lost.len() > 40 {
        println!("  … {} more newly failing", lost.len() - 40);
    }
    Ok(())
}

fn read_keys(path: &Path) -> Result<HashSet<String>, String> {
    let text = fs::read_to_string(path)
        .map_err(|_| format!("no failure cache at {}; run a board first", path.display()))?;
    Ok(text
        .lines()
        .filter(|line| !line.is_empty())
        .map(|s| s.to_string())
        .collect())
}

fn write_lines(path: &Path, lines: &[String]) -> Result<(), String> {
    let mut body = String::new();
    for line in lines {
        body.push_str(line);
        body.push('\n');
    }
    fs::write(path, body).map_err(|err| err.to_string())
}

struct Loaded {
    sets: HashMap<String, Vec<u8>>,
    sha_ok: bool,
}

fn load_expected(dir: &Path, cases: &[Case]) -> Result<HashMap<String, Loaded>, String> {
    cases
        .par_iter()
        .map(|case| {
            let path = dir.join(format!("{}.json", case.id));
            let text = fs::read_to_string(&path)
                .map_err(|err| format!("missing expected {}: {err}", path.display()))?;
            let parsed: Value = serde_json::from_str(&text)
                .map_err(|err| format!("bad expected {}: {err}", case.id))?;
            let input_sha = parsed
                .get("input_sha256")
                .and_then(|v| v.as_str())
                .unwrap_or("");
            let sha_ok = input_sha == sha256_hex(case.input.as_bytes());
            let sets_value = parsed
                .get("sets")
                .and_then(|v| v.as_object())
                .ok_or_else(|| format!("{} has no sets", case.id))?;
            let mut sets = HashMap::new();
            for (name, record) in sets_value {
                let bytes = record_bytes(record)?;
                let claimed = record.get("sha256").and_then(|v| v.as_str()).unwrap_or("");
                if claimed != sha256_hex(&bytes) {
                    return Err(format!(
                        "{} set {name} sha256 does not match its bytes",
                        case.id
                    ));
                }
                sets.insert(name.clone(), bytes);
            }
            Ok((case.id.clone(), Loaded { sets, sha_ok }))
        })
        .collect()
}

fn named_options(set: &str) -> Value {
    match set {
        "roundtrip" => serde_json::json!({"compress": false, "mangle": false}),
        "mangle" => serde_json::json!({"compress": false, "mangle": true}),
        "default" => serde_json::json!({}),
        "lwc-rollup" => serde_json::json!({
            "compress": true,
            "mangle": true,
            "sourceMap": false,
            "format": { "wrap_func_args": false },
            "module": true
        }),
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
        let name = record
            .get("name")
            .and_then(|v| v.as_str())
            .unwrap_or("Error");
        let message = record.get("message").and_then(|v| v.as_str()).unwrap_or("");
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

fn lexeme(bytes: &[u8], offset: usize) -> String {
    if offset >= bytes.len() {
        return "<eof>".into();
    }
    let byte = bytes[offset];
    if byte.is_ascii_alphanumeric() || byte == b'_' || byte == b'$' {
        let mut start = offset;
        while start > 0 {
            let prev = bytes[start - 1];
            if prev.is_ascii_alphanumeric() || prev == b'_' || prev == b'$' {
                start -= 1;
            } else {
                break;
            }
        }
        let end = bytes[start..]
            .iter()
            .take(24)
            .position(|b| !(b.is_ascii_alphanumeric() || *b == b'_' || *b == b'$'))
            .map(|n| start + n)
            .unwrap_or_else(|| (start + 24).min(bytes.len()));
        return String::from_utf8_lossy(&bytes[start..end]).into_owned();
    }
    match byte {
        b'\n' => "\\n".into(),
        b'\r' => "\\r".into(),
        b'\t' => "\\t".into(),
        b' '..=b'~' => (byte as char).to_string(),
        _ => format!("\\x{byte:02x}"),
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

fn load_skip_list(path: &Path) -> Result<HashSet<String>, String> {
    let text = fs::read_to_string(path).map_err(|err| format!("{}: {err}", path.display()))?;
    Ok(text
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty() && !line.starts_with('#'))
        .map(|s| s.to_string())
        .collect())
}

fn load_cases(corpus: &Path) -> Result<(Vec<Case>, u64, u64), String> {
    let mut cases = Vec::new();
    let mut compress = Vec::new();
    collect_files(&corpus.join("compress/cases"), &mut compress)?;
    compress.sort();
    for path in compress {
        let text = fs::read_to_string(&path).map_err(|err| format!("{}: {err}", path.display()))?;
        let value: Value =
            serde_json::from_str(&text).map_err(|err| format!("{}: {err}", path.display()))?;
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

    let rollup: Value = read_json(&corpus.join("lwc-rollup/manifest.json"))?;
    let rollup_list = rollup
        .get("files")
        .and_then(|v| v.as_array())
        .ok_or("lwc-rollup manifest has no files")?;
    let mut rollup_files = 0u64;
    let mut rollup_unique = 0u64;
    let mut seen_inputs = HashSet::new();
    for file in rollup_list {
        rollup_files += 1;
        let rel = file
            .get("path")
            .and_then(|v| v.as_str())
            .ok_or("lwc-rollup file missing path")?;
        let id = file
            .get("id")
            .and_then(|v| v.as_str())
            .ok_or("lwc-rollup file missing id")?
            .to_string();
        let input = fs::read_to_string(corpus.join("lwc-rollup").join(rel))
            .map_err(|err| format!("lwc-rollup {rel}: {err}"))?;
        let digest = sha256_hex(input.as_bytes());
        let claimed = file.get("sha256").and_then(|v| v.as_str()).unwrap_or("");
        if claimed != digest {
            return Err(format!("lwc-rollup {rel} sha256 does not match its bytes"));
        }
        if !seen_inputs.insert(digest) {
            continue;
        }
        rollup_unique += 1;
        cases.push(Case {
            id,
            corpus: "lwc-rollup".into(),
            input,
            sets: vec!["lwc-rollup".into()],
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
        let input =
            fs::read_to_string(&path).map_err(|err| format!("{}: {err}", path.display()))?;
        cases.push(Case {
            id,
            corpus: "bundles".into(),
            input,
            sets: vec!["roundtrip".into(), "mangle".into(), "default".into()],
            fixture: Value::Null,
        });
    }
    Ok((cases, rollup_files, rollup_unique))
}

fn json_str(value: &Value, key: &str) -> Option<String> {
    value
        .get(key)
        .and_then(|v| v.as_str())
        .map(|s| s.to_string())
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
    // par_iter collect keeps `files` order, which is what the board id hashes.
    let parts: Vec<(String, String)> = files
        .par_iter()
        .map(|path| {
            let rel = path
                .strip_prefix(corpus)
                .map_err(|_| format!("path outside corpus: {}", path.display()))?;
            let rel = rel.to_string_lossy().replace('\\', "/");
            let bytes = fs::read(path).map_err(|err| format!("{}: {err}", path.display()))?;
            Ok((rel, sha256_hex(&bytes)))
        })
        .collect::<Result<Vec<_>, String>>()?;
    let mut hasher = Sha256::new();
    for (rel, digest) in parts {
        hasher.update(rel.as_bytes());
        hasher.update(b"\0");
        hasher.update(digest.as_bytes());
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
        let bytes = canonical_error(
            "SyntaxError",
            "Unexpected token: punc (})",
            Some(2),
            Some(17),
        );
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
        assert_eq!(
            named_options("lwc-rollup"),
            serde_json::json!({
                "compress": true,
                "mangle": true,
                "sourceMap": false,
                "format": { "wrap_func_args": false },
                "module": true
            })
        );
    }

    #[test]
    fn lexeme_reads_a_word_or_one_punct() {
        assert_eq!(lexeme(b"var a", 0), "var");
        assert_eq!(lexeme(b"(function", 0), "(");
        assert_eq!(lexeme(b"abc", 3), "<eof>");
        assert_eq!(lexeme(b"export", 1), "export");
    }

    #[test]
    fn timeout_does_not_wait_for_the_case() {
        let started = Instant::now();
        let result = eval_with_timeout(Duration::from_millis(80), || {
            thread::sleep(Duration::from_secs(30));
            1
        });
        assert!(matches!(result, Err(EvalFail::Timeout)));
        assert!(started.elapsed() < Duration::from_secs(2));
    }

    #[test]
    fn panic_is_caught() {
        let result = eval_with_timeout(Duration::from_secs(1), || -> Vec<u8> {
            panic!("boom");
        });
        match result {
            Err(EvalFail::Panic(message)) => assert!(message.contains("boom")),
            other => panic!("unexpected {other:?}"),
        }
    }
}
