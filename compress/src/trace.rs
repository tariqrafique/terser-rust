//! Decision trace for `tools/trace-diff.sh`.
//!
//! With `TERSER_TRACE=<file>` set, compressor decisions are appended to that
//! file as JSON lines, in the same shape as the instrumented terser
//! (`tools/trace/patch.mjs`). `TERSER_TRACE_OPT=1` adds one `opt` event per
//! node whose optimizer changed its printed code. The environment is read once;
//! when it is unset every call site costs one load and branch, and nothing
//! else runs.

use ast::{Data, FuncKind, SymKind, N};
use serde_json::Value;
use std::cell::Cell;
use std::fs::File;
use std::io::{LineWriter, Write};
use std::sync::{Mutex, OnceLock};

struct Sink {
    out: Mutex<Out>,
    opt: bool,
}

/// A decision whose own work emits events reserves its place first (`reserve` /
/// `fill`), so events stay in the order the decisions were started, as in
/// `__trace.js`. Lines are held while a slot is open.
struct Out {
    file: LineWriter<File>,
    pending: Vec<Option<String>>,
    open: usize,
}

impl Out {
    fn push(&mut self, line: String) {
        if self.open > 0 {
            self.pending.push(Some(line));
        } else {
            let _ = self.file.write_all(line.as_bytes());
        }
    }
}

static SINK: OnceLock<Option<Sink>> = OnceLock::new();

fn sink() -> Option<&'static Sink> {
    SINK.get_or_init(|| {
        let path = std::env::var_os("TERSER_TRACE").filter(|p| !p.is_empty())?;
        let file = std::fs::OpenOptions::new().create(true).append(true).open(path).ok()?;
        let opt = std::env::var("TERSER_TRACE_OPT").is_ok_and(|v| !v.is_empty() && v != "0");
        let out = Out { file: LineWriter::new(file), pending: Vec::new(), open: 0 };
        Some(Sink { out: Mutex::new(out), opt })
    })
    .as_ref()
}

/// Tracing is on (`TERSER_TRACE` names a file).
#[inline]
pub fn on() -> bool {
    sink().is_some()
}

/// `opt` events are on too (`TERSER_TRACE_OPT`).
#[inline]
pub fn opt_on() -> bool {
    sink().is_some_and(|s| s.opt)
}

/// Write one event: `{"k": kind, ...fields}`.
pub fn emit(kind: &str, fields: Vec<(&str, Value)>) {
    let Some(sink) = sink() else { return };
    let line = format_event(kind, fields);
    if let Ok(mut out) = sink.out.lock() {
        out.push(line);
    }
}

/// Hold a place for an event decided later; `None` when tracing is off.
pub fn reserve() -> Option<usize> {
    let mut out = sink()?.out.lock().ok()?;
    out.open += 1;
    out.pending.push(None);
    Some(out.pending.len() - 1)
}

/// Fill a reserved place (`None` drops it). The held lines are written once no place is open.
pub fn fill(slot: Option<usize>, event: Option<(&str, Vec<(&str, Value)>)>) {
    let (Some(slot), Some(sink)) = (slot, sink()) else { return };
    let Ok(mut out) = sink.out.lock() else { return };
    out.pending[slot] = event.map(|(kind, fields)| format_event(kind, fields));
    out.open -= 1;
    if out.open == 0 {
        let pending = std::mem::take(&mut out.pending);
        for line in pending.into_iter().flatten() {
            let _ = out.file.write_all(line.as_bytes());
        }
    }
}

/// `fields!(key = value, ...)`: the field list for `fill`.
macro_rules! fields {
    ($($key:ident = $value:expr),* $(,)?) => {
        vec![$((stringify!($key), serde_json::json!($value))),*]
    };
}
pub(crate) use fields;

fn format_event(kind: &str, fields: Vec<(&str, Value)>) -> String {
    let mut line = String::from("{\"k\":");
    line.push_str(&Value::from(kind).to_string());
    for (key, value) in fields {
        line.push(',');
        line.push_str(&Value::from(key).to_string());
        line.push(':');
        line.push_str(&value.to_string());
    }
    line.push_str("}\n");
    line
}

/// `trace!("kind", field = expr, ...)`: the fields are evaluated only when tracing is on.
macro_rules! trace {
    ($kind:expr $(, $key:ident = $value:expr)* $(,)?) => {
        if $crate::trace::on() {
            $crate::trace::emit($kind, $crate::trace::fields!($($key = $value),*));
        }
    };
}
pub(crate) use trace;

const MAX: usize = 240;
const HEAD: usize = 160;
const TAIL: usize = 60;

/// Printed code of a node (terser `print_to_string()`), truncated as `__trace.js` `trunc` does:
/// over MAX code points it is HEAD first, "…", TAIL last, then ` #<utf-8 bytes>:<fnv1a32>`.
pub fn code(n: &N) -> String {
    trunc(codegen::print_fragment(n))
}

pub fn trunc(s: String) -> String {
    if s.len() <= MAX {
        return s;
    }
    let count = s.chars().count();
    if count <= MAX {
        return s;
    }
    let head: String = s.chars().take(HEAD).collect();
    let tail: String = s.chars().skip(count - TAIL).collect();
    let mut h: u32 = 0x811c_9dc5;
    for b in s.bytes() {
        h = (h ^ b as u32).wrapping_mul(0x0100_0193);
    }
    format!("{head}\u{2026}{tail} #{}:{h:08x}", s.len())
}

/// terser `TYPE` for the node kinds events name.
pub fn type_name(n: &N) -> &'static str {
    match &n.data {
        Data::Toplevel { .. } => "Toplevel",
        Data::Func { kind: FuncKind::Decl, .. } => "Defun",
        Data::Func { kind: FuncKind::Expr, .. } => "Function",
        Data::Func { kind: FuncKind::Arrow, .. } => "Arrow",
        Data::Func { kind: FuncKind::Accessor, .. } => "Accessor",
        Data::StaticBlock { .. } => "ClassStaticBlock",
        Data::Class { .. } => "Class",
        Data::Simple { .. } => "SimpleStatement",
        Data::Block { .. } => "BlockStatement",
        Data::If { .. } => "If",
        Data::Return { .. } => "Return",
        Data::Defs { .. } => "Definitions",
        Data::VarDef { .. } => "VarDef",
        Data::Symbol { kind: SymKind::Ref, .. } => "SymbolRef",
        Data::Symbol { .. } => "Symbol",
        Data::True => "True",
        Data::False => "False",
        Data::Null => "Null",
        Data::Number { .. } => "Number",
        Data::String { .. } => "String",
        Data::Array { .. } => "Array",
        Data::Object { .. } => "Object",
        Data::Throw { .. } => "Throw",
        Data::For { .. } => "For",
        Data::While { .. } => "While",
        Data::Do { .. } => "Do",
        Data::Switch { .. } => "Switch",
        Data::Try { .. } => "Try",
        Data::Template { .. } => "TemplateString",
        Data::Seq { .. } => "Sequence",
        Data::Call { is_new: true, .. } => "New",
        Data::Call { .. } => "Call",
        Data::Unary { prefix: true, .. } => "UnaryPrefix",
        Data::Unary { .. } => "UnaryPostfix",
        Data::Binary { .. } => "Binary",
        Data::Assign { .. } => "Assign",
        Data::Cond { .. } => "Conditional",
        Data::Dot { .. } => "Dot",
        Data::Sub { .. } => "Sub",
        _ => "Node",
    }
}

thread_local! {
    /// The `inline_into_call` branch that produced the result (`__ic_how` in `patch.mjs`).
    static HOW: Cell<Option<&'static str>> = const { Cell::new(None) };
}

/// Record the `inline_into_call` branch taken.
pub fn set_how(how: &'static str) {
    if on() {
        HOW.with(|h| h.set(Some(how)));
    }
}

/// Clear the branch, returning the outer call's.
pub fn enter_how() -> Option<&'static str> {
    HOW.with(|h| h.replace(None))
}

/// The branch this call took, restoring the outer call's.
pub fn leave_how(prev: Option<&'static str>) -> Option<&'static str> {
    HOW.with(|h| h.replace(prev))
}
