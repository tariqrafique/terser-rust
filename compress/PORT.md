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
| `index.js` `Compressor.before` | `lib.rs` `transform` | descend twice, then optimize. `SQUEEZED` skips the node. `OPTIMIZED` skips the optimizer on a replacement. Not yet: `hoist_properties`, `hoist_declarations`, `drop_unused` inside `before` |
| `index.js` `def_optimize` / `OPT` | `lib.rs` `after_descend` + `eval.rs` `fold` | scope/block joining runs once after both descends. Per-type bodies are still the `fold` chain, not split into `def_optimize(AST_*)` |

Scores: default 1614/3013, fixture 1176/2671, lwc default 134/339. Compare vs `df00ff9`: default 32 newly passing, fixture 6 newly passing, 0 newly failing. Roundtrip 3013/3013, mangle 3013/3013.

`assign_as_unused` does not apply to `let`/`const`. A non-strict `arguments` use marks every parameter in use. `let`/`const` are bound before refs in the block. Function passes rewrite inside nested blocks so a `var` assign there is still this function's.

Stop: default 2260, fixture 1336, reduce_vars 261/261, collapse_vars 199/199, or lwc 339/339.

Next: `drop_unused` from `before` after a scope's optimize, then split `def_optimize` per node type.
