# LWC sample

Compiled JavaScript for every component discovered in two pinned sources. `node harness/lwc/build-sample.mjs` rebuilds this directory from scratch. A second run on Node v22.23.4 produced the same sha256 for every module.

## Pins

| Source | Pin |
| --- | --- |
| `lbc` | npm `lightning-base-components@1.28.19-alpha`, sha1 `7b045bfad4bf794341758e5573eb4b71f4a1e12f`, sha256 `2d4681dfc2c564751594001d004cbf168280c97c3bd31b00ca2b2df5a89e1ef1` |
| `lbc-recipes` | https://github.com/salesforce/base-components-recipes.git `9c5f95d4e0cd5434a2b8373405e4f6c7657c88e8` |
| LWC | https://github.com/salesforce/lwc `b9e8007f9810edb59596536b596f80ca6c0d3fab` (`@lwc/compiler` 9.5.3) |
| Compiler build | npm `@lwc/compiler@9.5.3` (sha1 `01b6a2021c612c5f6a900092a70e7707ff5695e9`). Not a monorepo `yarn` build. |
| terser | 5.51.4 |

`packages/@lwc` at `b9e8007` differs from the published 9.5.3 gitHead `f07d63b2b1c71e689fabc614b228a2102d8e9914` only in perf-benchmark files (one commit, `chore(perf): remove engine-server from perf benchmarks`). The compiler sources are the same, so the registry tarball is that commit's compiler. Yarn 1.22.22 is what the monorepo expects; it was not used.

Downloads and `node_modules` stay in gitignored `harness/lwc/.cache`.

## Discovery

Walk each source root. Skip a directory named `node_modules`, `.git`, `dist`, `buildTemplates`, `coverage`, `__tests__`, `__snapshots__`, `__examples__`, `__raptorMocks__`, or anything starting with `.`. A directory is a component when it contains `<dirname>.js` or `<dirname>.ts`. The namespace is the parent directory name, or `c` when that parent is `lwc`. Components are sorted by path relative to a virtual root whose children are `lbc/` (the extracted package) and `lbc-recipes/` (the git checkout).

This walk finds **339** components. None of them use a `.ts` entry (the `.ts` files in the package are `.d.ts`).

The reference file count of **725** is `<dirname>.js` + `<dirname>.html` + `<dirname>.css` (and `.ts` when that is the entry). Counting every file that sits in those component directories is **2359**, because `lightning-base-components` also ships `.d.ts`, `.map`, SLDS css, native/synthetic css, and helper modules, and the recipes ship `.js-meta.xml`.

## Sample

Seed **42**. The script implements mulberry32 + Fisher-Yates and can take `LWC_SAMPLE_SIZE`, then re-sorts by path. The committed sample is **all 339** components (`strategy: "all"`). Compiling them is a few seconds, so nothing was dropped. Membership does not depend on the seed while the strategy stays `all`; the seed is still recorded.

Each component's JS is compiled with:

```js
transformSync(src, filename, { name, namespace })
```

`filename` is the posix path relative to the virtual root, not an absolute path. Templates and CSS are not compiled. Outputs are `modules/<source>/<namespace>/<name>.js`. `manifest.json` lists every output with its sha256, plus the pins above.

The board minifies these files with `roundtrip`, `mangle`, and `default`.
