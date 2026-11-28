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
| `node tools/reduce.mjs <file> '<opts>' DIFF DIFF` | Greedy removal of top-level statements while the outputs still differ. Removing a declaration makes its name an undeclared global, which can change the diff. |

Builds: `cargo build --profile fast -p terser --example try` (quick) and `cargo build --release -p terser --example try` (lwc-rollup inputs). Build the harness separately from `try`.

lwc-rollup options: `{"compress":true,"mangle":true,"sourceMap":false,"format":{"wrap_func_args":false},"module":true}`.
