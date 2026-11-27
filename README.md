# terser-rust

Pure Rust port of the [terser](https://github.com/terser/terser) minifier. The target is byte-exact output against terser 5.51.4, with no Node, JS engine, or terser bindings on the minify path.

Node is used only as an oracle (`oracle/`) and to build corpora (`harness/`).

| Crate | Role |
| --- | --- |
| `ast` | JavaScript AST |
| `parser` | Parser |
| `scope` | Scope analysis and mangling |
| `compress` | Compressor |
| `codegen` | Printer |
| `terser` | `minify(src, opts) -> Result<Output>` |
| `harness` | Corpus, oracle driver, and the pass/fail board |

`minify` runs parse, compress, mangle, and print. Parse, mangle, and print match terser on every corpus. The compressor is in progress: `compress/PORT.md` tracks what is ported and the current board. The goal is a full port, every board set byte-exact.

Out of scope: the `acorn` / ESTree path (`--parse acorn`, `from_mozilla_ast`, `to_mozilla_ast`).

`cargo run -p harness -- board` compares `minify` to the oracle.
