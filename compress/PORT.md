# Compress port

Terser 5.51.4. Byte-exact output first. Board: `git rev-parse HEAD` (12) + `-` + corpus sha (12).

| Terser | Rust | State |
| --- | --- | --- |
| `compress/index.js` `compress` | `compress/src/lib.rs` `compress` | passes loop done |
| `reduce-vars.js` `reset_def` / `safe_to_assign` / `AST_SymbolRef` | `reduce_vars.rs` | constants + function-body `let`/`const`. Not: escaped, lambda single_use, IIFE virtual params |
| `inline.js` `inline_into_symbolref` | `reduce_vars.rs` `inline_ref` | constants only. Regexp is not a constant. Const write clears `fixed` |
| `tighten-body.js` `collapse` | `tighten.rs` `collapse` | scan + `find_stop`. Straight-line helper removed |
| `drop-unused.js` `drop_unused` / `assign_as_unused` | `drop_unused.rs` | reads vs write-only `=`, drop pure unread decls in a function. Not yet: side-effect init kept as `0`, `top_retain`, pinned `eval` |
| `index.js` `before` / `OPT` | — | not started |

Scores after `drop_unused`: default 1577/3013, fixture 1159/2671, drop-unused fixtures 46/169, lwc default 132/339. Two lwc cases still differ (`avatar`, `primitiveHeaderActions`).

Stop: default 2260, fixture 1336, reduce_vars 261/261, collapse_vars 199/199, or lwc 339/339.

Next: finish the two lwc misses, then `before()` / `OPT()`.
