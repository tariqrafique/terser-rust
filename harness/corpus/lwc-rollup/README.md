# LWC rollup inputs

The strings `@rollup/plugin-terser` passes to `terser.minify` when each LWC sample component is bundled. Rebuild with:

```
node harness/lwc-rollup/build.mjs
```

A second run on the same machine must reproduce every input sha256. Downloads stay in gitignored `harness/lwc/.cache` and `harness/lwc-rollup/.cache`.

## Pins

| Package | Version |
| --- | --- |
| rollup | 4.63.5 |
| `@lwc/rollup-plugin` | 9.5.3 |
| `@rollup/plugin-terser` | 1.0.2 |
| terser | 5.51.4, the same `main.js` bytes as `oracle/node_modules/terser` |
| `@lwc/engine-dom`, `@lwc/synthetic-shadow`, `@lwc/wire-service` | 9.5.3 |
| `lightning-base-components` | 1.28.19-alpha, sha1 `7b045bfad4bf794341758e5573eb4b71f4a1e12f` |
| base-components-recipes | `9c5f95d4e0cd5434a2b8373405e4f6c7657c88e8` |
| LWC | `b9e8007f9810edb59596536b596f80ca6c0d3fab` |

Node is v22.23.4. `npm ls terser` in `harness/lwc-rollup` must show 5.51.4 only. The worker calls `minify` from `oracle/node_modules/terser/main.js` through `terser-wrap.mjs`.

## Rollup config

Each component is its own entry. `lwc()` is called with no options. Output `format` is omitted. Rollup 4.63.5 maps that to `es`. `inlineDynamicImports` stays off, so dynamic imports remain separate chunks.

`lwc` resolves to `@lwc/engine-dom` and is bundled. It is not external. Recipe entries are symlinks at `harness/lwc-rollup/.cache/recipe-modules/c/<name>`, so the resolver finds `c/<name>`. LBC entries are the files inside `lightning-base-components`. Platform specifiers the resolver does not know stay external.

## Options

The script passes this object to the terser plugin:

```js
{ compress: true, mangle: true, sourceMap: false, format: { wrap_func_args: false } }
```

For an `es` bundle the plugin adds `module: true` before calling `minify`. The named set `lwc-rollup` is that full object, including `module: true`. The manifest records the stated plugin options and the added `module` key separately.

## Counts

A second run reproduced every input sha256.

- 339 components attempted, 335 bundled, 4 failed
- 779 chunk inputs, 779 unique sha256 values
- input bytes min 50, median 353819, max 2543344, total 319015321
- 296 inputs contain the engine marker `$$lwc-synthetic-mode`
- 518 inputs contain a hash placeholder
- 0 plugin returns equal the final chunk
- 779 oracle outputs equal the plugin `renderChunk` return

The engine sits inside the component chunk, mixed with that component. It is not a separate input repeated byte for byte, so the unique count equals the file count. The board still drops duplicate input sha256 values. This tree has none.

## Files

Each file under `inputs/<group>/<namespace>/<name>/` is one `minify` argument. The bytes are unchanged. The file name is the final rollup chunk name.

Rollup's `renderChunk` code contains hash placeholders `!~{n}~`. Terser leaves them in place. Rollup substitutes the real chunk hash after the plugin returns, then appends a trailing newline. `plugin_sha256` is the plugin return. `final_sha256` is the chunk rollup emits after that.

Four components do not bundle with those defaults. The manifest lists them under `failures` and they have no inputs.

- `lbc-recipes/c/registerWireMocks` imports `register` from `lwc`. `@lwc/engine-dom` does not export it.
- `lbc/lightning/datatable`, `lbc/lightning/multiColumnSortingModal`, and `lbc/lightning/treeGrid` use `lwc:is`. The plugin leaves dynamic components off, and the compiler rejects them.
