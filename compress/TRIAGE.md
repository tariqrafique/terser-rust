# lwc-rollup triage (2026-11-28)

The failing lwc-rollup inputs grouped by cause. Each cluster has a small repro in `tools/repros.sh`.
- Run `tools/repros.sh [PATTERN]` to see the repros.
- For a whole input, run `tools/trace-diff.sh <input>`.

## Counts

- 299 of 779 inputs fail (still 299 after the C2 / C8 fixes: those inputs differ in other clusters too).
- Every one of them already differs with mangling off.
- The mangler is not the cause. Fed terser's own compressed output with compress off, all 299 come out identical.
- 296 inputs bundle the same LWC engine, so a fix in the engine code fixes almost every input.
- With the outputs split at `;`, `{` and `}`, there are 10–40 differing regions per input.

## Wrong code (fix first)

In 23 failing inputs, the port's output uses a name it never declares. Examples: `ariaDescVal` (7 inputs), `v` (10), `dateFormat`, `date`, `last`.

After the M3 and M4 fixes, none of the 299 triaged inputs (mangling off) uses a name that terser's output declares and the port's does not. This check does not catch C2a/b: there the name stays declared and the value or call is wrong.

| Id | What | Inputs |
| --- | --- | --- |
| M2 | Fixed by the M3 fix (`x = v;` never walked `v`). A `const` used once is dropped but its read is kept. `const v=d.pop();x=v` becomes `d.pop();x=v`. The same happens inside `if`, `try` and a top-level block. | utilsPrivate, modal/alert/confirm/prompt, testUtils, formattedDateTime, probably the colorPicker `v` inputs |
| M3 | Fixed. A function still in use is dropped: `build`, called from two exports. With a `let r=q()` first, the port keeps `q();` and drops the binding. Cause: `drop_unused` took `x = build();` as a statement for `assign_as_unused` and never walked its right side. Also fixed: a write to an undeclared global at the top level was dropped (`x=f()` became `f()`). M3b now differs only by C1. | |
| M4 | Fixed. An inlined function's parameter is assigned without a `var`: terser has `var s,d`, the port `var s`. Cause: after a collapse, the port's `drop_unmentioned` (not in terser) dropped declarations whose names its own walker did not see, and that walker skipped object literals. It now uses `ast::walk_children`. | formattedTime (`date`) |
| C2a/b | Fixed: a destructured local resolved to an outer name with the same spelling. `const {k}=v; return k` became `return 1`, and a `{f}=v; f()` call was dropped. The binder now declares pattern names. | |

## Parity clusters, by number of inputs

| Id | Inputs | What |
| --- | --- | --- |
| C1 | 296 | Repros match after the flatten `is_constant_expression` fix. Remaining gaps were scope identity: a rebuilt function lost its scope id (scope checks then saw an inlined copy's parameters as outside names, `upgradeCallback`), and `INLINED` / `all_refs_local` read `node_scope` only (inlining board in PORT.md). A function that terser marks INLINED is still inlined by the port. terser `inline.js` around line 222 marks every enclosing function as inlined when it inlines a body that uses an outside name. A marked function is then never inlined itself (`all_refs_local`, `has_flag(fixed, INLINED)`). The port has `mark_inlined` / `inlined_scopes` in `reduce_vars.rs`, but the mark has no effect. Most engine regions trace back here: `sanitizeHtmlContent`, `patchShadowRootWithRestrictions`, `upgradeCallback`, `connectContext`, `scheduleRehydration`, `renderComponent`, `patchMirrorDomTree`, and others. |
| C2 | 296 | Fixed (repros C2a–d match): destructured bindings were not declared in the compressor's symbol table, which blocked inlining of an argument (C2c, also a block holding only a destructuring `const` was never collapsed) and conditional assignments (C2d), and made `{insertStylesheet}` / `{stylesheet}` count as a second reference to a top-level function. The 296 inputs still fail on other clusters. |
| C3 | 296 | Fixed: An array constant is inlined into a `for…of`; terser keeps it. |
| C4 | 296 | Fixed: Negation shape: terser gives `!(s(a)\|\|c(a)&&c(b))`, the port `!s(a)&&(!c(a)\|\|!c(b))`. |
| C5 | 296 | Fixed. No collapse into the arguments of an inlined function. Cause: collapse's `escaped_names` (terser `may_modify`) took a nested function's own parameters as reads of the outer name. |
| C6 | 296 | Fixed. The port loses the `!` before an inlined function call used as a statement (and, the other way, kept one terser drops). Causes: a block reduced to one statement was squeezed; `drop_side_effect_free` of an IIFE returned the same call where terser clones it. |
| C7 | 296 | Fixed: Template literal concatenation: terser folds ``a+`u ${p}. `+`See` `` into one template; the port does not. |
| C8 | 229 | Fixed (repro matches): flattening was blocked by a nested `let` with the same name as a top-level function. `free_ref_shadowed` now skips names declared inside the callee, and loops are block scopes in the binder. |
| C9 | 91 | Fixed: An empty `case` before `default` is not removed, so the switch is not turned into a conditional. |
| C13 | 78 | Fixed: A regex constant used once is not substituted. |
| C10 | 56 | Fixed. Hoisted vars from nested inlines come out in a different order: terser `var a,e`, the port `var e,a`. |
| C11 | 56 | Fixed (collapse ran `stop_after` on a write of the candidate's own name). A sequence produced by inlining is not collapsed again: terser `(v=nd(v=o.h,1),H[v])`, the port `(v=o.h,v=nd(v,1),H[v])`. |
| C14 | 49 | Fixed: Collapse into the object of a member assignment: terser `C\|\|(C=ce(..),C.id=1)`, the port `C\|\|((C=ce(..)).id=1)`. |
| C12 | 1 | Fixed: every nested block is collapsed. testUtils: `for(var key in from=Object(a[s]),from)`. |
| C16 | 1 | Fixed: purifyLib: an unused conditional's value is kept (`?arguments[0]:`). |
| C15 | 6 | Fixed: `singleChar=_step.value` is not collapsed (internationalizationLibrary). No small repro yet. |
| C17 | 1 | wireServiceMocks: an inlined function containing a `const` is not flattened. No small repro yet. |
