# Compress port

Terser 5.51.4. Byte-exact output first. Board: `git rev-parse HEAD` (12) + `-` + corpus sha (12).

| Terser | Rust | State |
| --- | --- | --- |
| `compress/index.js` `compress` | `compress/src/lib.rs` `compress` | passes loop done |
| `reduce-vars.js` `reset_def` / `safe_to_assign` / `AST_SymbolRef` | `reduce_vars.rs` | constants + function-body `let`/`const`. Not: escaped, lambda single_use, IIFE virtual params |
| `inline.js` `inline_into_symbolref` | `reduce_vars.rs` `inline_ref` | constants only. Regexp is not a constant. Const write clears `fixed` |
| `tighten-body.js` `collapse` | `tighten.rs` `collapse` | scan + `find_stop`. Straight-line helper removed |
| `drop-unused.js` `drop_unused` | `drop_unused.rs` `drop_unused` / `passes` | three walks. Not yet: `top_retain`, direct `eval`, `keep_fnames` |
| `drop-unused.js` `assign_as_unused` | `drop_unused.rs` `assign_as_unused` | `=` of a symbol. Write-only `++` not yet |
| `drop-unused.js` `scan_ref_scoped` | `drop_unused.rs` `scan_ref_scoped` | pass 1. Side-effect inits only; destructuring values always |
| `drop-unused.js` pass 2 (`in_use_ids.forEach`) | `drop_unused.rs` `passes` | inits of in-use names |
| `drop-unused.js` `tt` | `drop_unused.rs` `rewrite_expr` | drop unread decls; write-only `=` becomes the rhs. `fixed_ids` recorded, not yet applied to in-use names |
| `index.js` `before` / `OPT` | — | not started |

Scores: default 1582/3013, fixture 1169/2671, drop-unused fixtures 45/169, lwc default 134/339. Compare vs `fd070d0`: 0 newly failing.

`assign_as_unused` does not apply to `let`/`const`. A non-strict `arguments` use marks every parameter in use. `let`/`const` are bound before refs in the block. Function passes rewrite inside nested blocks so a `var` assign there is still this function's.

Stop: default 2260, fixture 1336, reduce_vars 261/261, collapse_vars 199/199, or lwc 339/339.

Next: `before()` / `OPT()`.
