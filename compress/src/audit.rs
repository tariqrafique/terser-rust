//! The node-id shadow audit (`NODE_IDS.md` step 3).
//!
//! The compressor's `SQUEEZED` / `OPTIMIZED` flags are keyed by pointer, and every rebuild
//! has to carry them over. The audit keeps id-keyed copies beside them (in `Cx`), set only
//! where terser sets a flag (not by the pointer carry-overs: `transfer_flags`,
//! `keep_squeezed`, `mark_tree_squeezed`), and compares the two answers at each decision.
//! Decisions stay pointer-based. (Step 3 audited the symbol table's definition and scope
//! lookups the same way; step 4 keyed the table by id, so there is one answer.)
//!
//! `TERSER_ID_AUDIT=1` turns it on. At the end of each `compress` call every mismatch kind
//! is printed to stderr as `id-audit<TAB>decision<TAB>node type<TAB>ptr=..<TAB>id=..<TAB>count<TAB>thread`
//! (the harness names a case's thread after the case).

use ast::N;
use std::cell::{Cell, RefCell};
use std::collections::BTreeMap;
use std::fmt::Display;

thread_local! {
    static ON: Cell<u8> = const { Cell::new(2) };
    static COUNTS: RefCell<BTreeMap<(String, &'static str, String, String), usize>> = const { RefCell::new(BTreeMap::new()) };
}

pub(crate) fn on() -> bool {
    ON.with(|o| {
        if o.get() == 2 {
            o.set(std::env::var_os("TERSER_ID_AUDIT").is_some() as u8);
        }
        o.get() == 1
    })
}

/// Record `decision` on `n` when the pointer answer and the id answer differ.
pub(crate) fn check<T: PartialEq + Display>(decision: &str, n: &N, by_ptr: T, by_id: T) {
    if by_ptr == by_id || !on() {
        return;
    }
    // `TERSER_ID_AUDIT=bt:<decision>` also prints where each such mismatch is read.
    if std::env::var("TERSER_ID_AUDIT").is_ok_and(|v| v.strip_prefix("bt:") == Some(decision)) {
        let bt = std::backtrace::Backtrace::force_capture().to_string();
        let at: Vec<&str> = bt.lines().filter(|l| l.contains("compress/src/") && !l.contains("audit.rs")).take(4).map(str::trim).collect();
        eprintln!("id-audit-bt\t{decision}\t{}\t{}", ast::terser_type(n), at.join(" < "));
    }
    let key = (decision.to_string(), ast::terser_type(n), by_ptr.to_string(), by_id.to_string());
    COUNTS.with(|c| *c.borrow_mut().entry(key).or_insert(0) += 1);
}

pub(crate) fn flush() {
    if !on() {
        return;
    }
    let counts = COUNTS.with(|c| std::mem::take(&mut *c.borrow_mut()));
    if counts.is_empty() {
        return;
    }
    let thread = std::thread::current().name().unwrap_or("-").to_string();
    let mut out = String::new();
    for ((decision, ty, p, i), n) in counts {
        out.push_str(&format!("id-audit\t{decision}\t{ty}\tptr={p}\tid={i}\t{n}\t{thread}\n"));
    }
    eprint!("{out}");
}
