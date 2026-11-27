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

`minify` is a stub until the pipeline is ported. `cargo run -p harness -- board` compares it to the oracle.
