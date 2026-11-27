# Harness

Byte-exact comparison of the Rust `minify` stub (later, the port) against terser **5.51.4**.

Node runs only here and in `oracle/`. The Rust crate does not embed a JS engine.

```
node harness/extract-compress.mjs   # rebuild compress fixtures from the v5.51.4 tag
node harness/lwc/build-sample.mjs    # rebuild the LWC sample
node harness/fetch-bundles.mjs       # download pinned bundles
node harness/oracle.mjs              # write harness/expected
cargo run -p harness -- board        # compare Rust minify to those bytes
```

## Option sets

Every corpus input is minified with the same named sets. The objects below are what both the oracle and the board pass through.

| Set | terser options | Who |
| --- | --- | --- |
| `roundtrip` | `{ compress: false, mangle: false }` | every input |
| `mangle` | `{ compress: false, mangle: true }` | every input |
| `default` | `{}` (terser's own defaults: compress on, mangle on) | every input |
| `fixture` | the compress test's own options, translated below | `test/compress` cases only |

`mangle: true` is the same as `mangle: {}` inside terser (`defaults()` treats `true` as `{}`).

Comparison is the UTF-8 bytes of the output string. There is no whitespace normalization and no AST comparison. When terser throws, the oracle stores a canonical error record and the board compares that text the same way:

```
name\nmessage\nline\ncol
```

`line` and `col` are empty when the exception has neither.

## Compress fixtures

`node harness/extract-compress.mjs` clones terser at `bd270d079070403e398df8a3b6652de0ed4dcc20` (tag `v5.51.4`) into the gitignored directory `oracle/.cache/terser` and reads `test/compress/*.js`. Parsing and printing use `oracle/node_modules/terser`, which is the published 5.51.4 tarball. `lib/` and `main.js` in that tarball match the tag byte for byte.

The test files are not plain JSON. `test/compress.js` parses each file with terser's parser. A case is a top-level labeled block. Assignments become options; nested labels are the source and the expectation.

### Extraction

| Runner field | Corpus |
| --- | --- |
| Block `input` | Source text inside the braces, including comments. Not a reprint. |
| Template `input` / `bad_input` | The cooked template string (`segments[0].value`), which is what `parse()` receives. |
| `expect` | Printed with the case's output options, after the same directive fixup the runner applies. Stored for reference. |
| `expect_exact` | The string or joined array of strings, unchanged. |
| `expect_stdout` | String (runner appends `\n`), `true`, or `{kind:"error",name,message}`. Not part of the byte board. |
| `expect_error` | The object literal (`name`, `message`, `line`, `col`). |
| `prepend_code`, `node_version`, `no_mozilla_ast`, `reminify`, `only`, `module` | Stored. `module` is recorded but the runner never passes it into `parse` / `Compressor`; reparsed `import`/`export` still matches the suite because this terser build accepts them in scripts. |
| `output = ...` | One case (`template-string.js`) assigns `output`. The runner ignores it and uses `beautify` / `format` only. Stored as `ignored_output`. |

Counts from the current extract: **2681 / 2681** cases, **0 skipped**, 171 files, 77 `bad_input` cases, 2410 cases with `expect` or `expect_exact`. A previous local attempt stopped at 2678 because three cases put a function in the options. Those are extracted. The function source is in `exprs` and as `{ "__terser_type": "Function", "source" }` inside `fixture`:

- `compress/properties/mangle_nth_identifier`
- `compress/pure_funcs/func`
- `compress/rename/mangle_catch_nth_identifier`

`RegExp` options use `{ "__terser_type": "RegExp", "source", "flags" }`.

### Fixture pipeline

`fixture` does **not** call `minify()`. `test/compress.js` drives `Compressor` directly. `harness/lib/compress-runner.mjs` repeats that sequence:

1. `parse(input, test.parse)`.
2. `figure_out_scope(mangle)` (what `as_toplevel` does before compress).
3. If `mangle.properties.keep_quoted` and it is not `"strict"`, `reserve_quoted_keys` on the reserved list (created if missing).
4. If `rename` is set, `figure_out_scope` + `expand_names`. Public `minify()` in 5.51.4 has this behind `if (0 && options.rename)`, so it never runs there. The fixture set still runs it, because the suite does.
5. `new Compressor(options, { false_by_default, mangle_options })`.
   - `false_by_default` is true when `options.defaults` is omitted or false, and false when `defaults: true`.
   - `minify()`'s compressor does the opposite when `defaults` is omitted (every default pass stays on). The corpus `fixture.compress` object therefore writes `"defaults": false` when the test omitted it, so a later Rust port can honor the flag the way `Compressor` does.
6. `figure_out_scope`, then if `mangle` is set: normalize `mangle.cache.props` (only keys starting with `$`, with the `$` stripped), `compute_char_frequency`, `mangle_names`, `mangle_private_properties`, and `mangle_properties` when `mangle.properties` is set. Annotated props are discovered on the post-compress tree, which is `mangle_properties`'s default. `minify()` instead captures them before compress.
7. Print with `OutputStream(test.beautify || test.format || {})`.

`OutputStream` fills its own defaults when a key is missing: `beautify: false`, `comments: "some"`, `ecma: 5`, `semicolons: true`, `quote_style: 0`, `ascii_only: false`, `width: 80`, and the rest of the list in `lib/output.js`. `shorthand` turns on when `ecma > 5`.

The oracle evaluates `exprs` with `new Function("return(" + expr + ")")()`, the same way the runner evaluates assignments. That is what keeps `pure_funcs` and `nth_identifier` functions working. The Rust board passes the tagged `fixture` JSON into `Options` and does not eval JavaScript.

### Reparse vs the handwritten expect

2404 of the 2410 cases with an expect produce that expect when the extracted string is parsed and run through the pipeline. The other six are `@__PURE__` comments whose attachment changes when the block body is parsed as a program instead of as a statement inside the test file. They are listed in `corpus/compress/reparse-mismatches.json`. They are still corpus cases. The oracle's `fixture` bytes are whatever the pipeline emits for the extracted string, not a copy of the handwritten `expect`.

### Reminify

The runner's `reminify()` (on unless the case sets `reminify = false`, which one case does) is not a byte oracle. After `expect_stdout` matches, it minifies the input with every object in `test/ufuzz.json` and checks that stdout still matches. It copies `keep_fnames` / `keep_classnames` / `keep_fargs` off the case first. The board does not score it. The nine sets are:

1. `{ compress: false, mangle: false, output: { beautify: true, braces: true }, rename: true }`
2. `{ compress: false }`
3. `{ mangle: false }`
4. `{}`
5. `{ toplevel: true }`
6. `{ compress: { passes: 1e6, unsafe: true }, toplevel: true }`
7. `{ compress: { arguments: true, keep_fargs: false, passes: 1e6, sequences: 1e6, unsafe: true, unsafe_Function: true, unsafe_math: true, unsafe_proto: true, unsafe_regexp: true } }`
8. `{ safari10: true }`
9. `{ compress: { reduce_funcs: false } }`

`expect_stdout` and `node_version` only gate that sandbox check (`semver` against the oracle's Node). They do not change the bytes `fixture` must match.

### Mocha

`corpus/compress/mocha-inventory.json` lists `test/mocha/*.js` (file, `describe` titles, `it(` count). Nothing in there is executed or scored yet.

## Other corpora

LWC and the large bundles are described next to their manifests:

- `corpus/lwc/README.md`
- `corpus/bundles/manifest.json`

## Board id

`cargo run -p harness -- board` prints one board. The id is `<git short sha>-<corpus manifest hash>` (12 hex chars each). The hash covers every committed corpus file plus the pinned bundle bytes, path-sorted. A dirty worktree appends `-dirty`.

Failures print the first differing byte and a short escaped window. Each corpus/option-set group prints at most 8 failures and the hidden count.
