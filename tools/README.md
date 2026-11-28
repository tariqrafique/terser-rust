# Port tools

Run from anywhere; each script finds the repo root itself. Scratch output goes to `tools/.out/` (ignored).

| Tool | Use |
| --- | --- |
| `tools/board.sh [N]` | Build the fast harness and `try`, run the default board against the saved baseline. Save a new baseline after a verified improvement with `./target/fast/harness board --set default --save-baseline`. |
| `tools/cmp.sh '<js>' ['<opts>']` | terser (`T:`) vs the port (`R:`) on a snippet, using `target/fast/examples/try`. |
| `node tools/terser.mjs '<opts>' < in.js` | The terser 5.51.4 oracle on stdin. |
| `tools/rollup-diff.sh <in.js> [mangle]` | First difference under the lwc-rollup options (mangling off unless `mangle`). Uses the release `try`. |
| `python3 tools/rollup-check.py [MAXSIZE]` | Every lwc-rollup input up to MAXSIZE bytes vs its expected output, failures by size. Release `try`. |
| `node tools/walk-order.mjs [out.json]` | terser's walk, transform and `walk()`-helper visit orders on snippets covering every node kind. `cargo test -p parser --test walk_order` compares them with the `ast` traversals; regenerate the committed copy with `node tools/walk-order.mjs parser/tests/walk_order.json`. |
| `tools/repros.sh [PATTERN]` | The lwc-rollup triage repros (`compress/TRIAGE.md`): terser vs the port, mangling off, fast `try`. |
| `node tools/reduce.mjs <file> '<opts>' DIFF DIFF` | Greedy removal of top-level statements while the outputs still differ. Removing a declaration makes its name an undeclared global, which can change the diff. |
| `tools/trace-diff.sh <in.js> ['<opts>'] [--opt] [--all] [-C N]` | First divergent compressor decision between terser and the port (see "Trace diff"). Options default to lwc-rollup with mangling off. Uses the newer of the release and fast `try`. |

Builds: `cargo build --profile fast -p terser --example try` (quick) and `cargo build --release -p terser --example try` (lwc-rollup inputs). Build the harness separately from `try`.

lwc-rollup options: `{"compress":true,"mangle":true,"sourceMap":false,"format":{"wrap_func_args":false},"module":true}`.

## Trace diff

`tools/trace-diff.sh` runs an instrumented terser and the port with `TERSER_TRACE=<file>` set, each writing one JSON line per compressor decision (`tools/.out/trace-terser.jsonl`, `tools/.out/trace-port.jsonl`), and prints the first decision where they part, with context, the other side's attempts at the same candidate, and where the logs agree again.

- terser: `tools/trace/setup.sh` copies `oracle/node_modules/terser` to `tools/.cache/terser-trace` (ignored), links its dependencies and applies `tools/trace/patch.mjs`; `tools/trace/terser-trace.mjs` runs it. The oracle itself is never edited.
- port: `compress/src/trace.rs` (`trace!`, `reserve` / `fill`). The environment is read once; unset, each call site is one branch.
- Code is printed with `print_to_string()` / `codegen::print_fragment`; over 240 characters it is cut to head…tail plus ` #<bytes>:<fnv1a32>`, the same on both sides.

| Event | Where (terser / port) | Fields |
| --- | --- | --- |
| `pass` | `Compressor.compress` / `compress` | `n` |
| `collapse` | `tighten-body.js` `collapse`, per candidate / `tighten.rs` `collapse_statements` | `cand`, `ok` (`get_lhs` gave an lhs), `abort`, `replaced`, `value_def`, `why` |
| `drop_unused` | `AST_Scope.drop_unused` / `transform` | `t`, `code` (scope before), `out` (after, `=` when unchanged) |
| `inline` | `inline_into_symbolref` / `eval.rs` around `inline_ref` | `name`, `single` (`def.single_use`), `out` (replacement or null) |
| `inline_call` | `inline_into_call` / `call.rs` `optimize` | `how` (`const_return`, `identity`, `flatten`, `drop_empty`, `inline_annotation`), `call`, `out` |
| `opt` (`--opt`) | `Compressor.before` around `node.optimize` / `transform` around `after_descend` + optimize | `t`, `code`, `out`, only when the print changed |

Compared by default: pass starts, collapses that replaced something, inlines that produced a value, inlined calls, optimize results, and drop_unused as checkpoints (by the scope it leaves; a no-op run on one side only is skipped). `--all` adds rejected candidates and single-use reads that were not inlined; the port filters candidates before `get_lhs` (only symbol targets) and retries them after each collapse (repeats are not logged again), so expect noise there. An inlined lambda is logged before its `fixed.optimize()`, as the port tightens the copy later; a decision whose own work logs events is written before them on both sides.
