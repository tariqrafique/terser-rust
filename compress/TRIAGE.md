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

## Round 2 (2026-11-28, branch at 7bc51bd)

Same method: the 297 failing inputs, mangling off, outputs split at `;`, `{` and `}`; 1810 differing regions, 343 distinct. Regions were labelled by needle, the top ones reduced (`reduce.mjs`-style statement removal, then by hand). Repros: `tools/repros.sh R`. All 27 round-1 repros match.

- Every failing input still differs with mangling off. 86 inputs differ in one region only (R1), 88 in three.
- Wrong code: none found. Only formattedName's output reads globals terser's does not (`Date`, `isNaN`, ...): the port keeps a dead localization object (and the date code it reaches) that terser drops. Not wrong, just bigger; not reduced.
- Inputs: inputs with at least one region in the cluster. "Pass if fixed": cumulative, in the order R1, R2, R3, R7, R11, R8, R6, R9, then R4 and R5 together (R4 and R5 hit the same 67 inputs), counting only labelled regions (68 inputs also have unlabelled regions, so at most 229 of 297 can pass from these clusters).

| Id | Inputs | Pass if fixed | What (terser vs port) | Suspected cause |
| --- | --- | --- | --- | --- |
| R1 | 296 | 86 | `!(p in H)&&!(p in A)` kept by terser; the port negates to `!(p in H\|\|p in A)`. | `unary.rs` `best_of` and `best_negation` compare `print_len`; terser `best_of_expression` compares `size()` (`size.js`: no parentheses, `in` is 4). `conditional.rs` `node_size` is the size port. |
| R2 | 160 | 153 | A `let`/`const` in a nested block counts as a name of the enclosing scope. (a) collapse: `return(_a=class…).observedAttributes=` (90, `buildCustomElementConstructor`), the port keeps `_a=class…,_a.observedAttributes=`. (b) flatten: `registerComponent(Ctor, metadata)` stays an IIFE in every component with a dead function holding `const metadata` (61); `getName=(index=>…)(2)` vs `(index=2,…);var index` (37). | (a) `tighten.rs` `inner_shadow` uses `env.declared`/`env.locals`, built by `scope_bindings` → `collect_locals`, which walks into nested blocks and loop heads; terser `shadows` compares definitions (`find_variable(name) === def`). (b) `call.rs` `can_inject_symbols` `taken`: R2b/R2c only fail while the function holding the block-scoped name is unused (dropped later in the pass); an exported one is fine. Check `free_refs` (binds only parameters and `var`s) and the `cached_names` key 1 cache. terser `conflicting_def` reads `enclosed`, which stops at the block scope. |
| R3 | 91 | 175 | `case units.YEARS:default:` kept (`units` is a `const` object literal); terser drops the empty case. The same cause keeps `(al.h,R)` where terser has `R` (R3b). | `loops.rs` switch branch removal → `unary.rs` `may_side_effect`: a property read on a symbol whose fixed value is an object literal. terser `AST_SymbolRef._dot_throw` returns `fixed._dot_throw()` (false for an object). |
| R4 | 67 | (with R5) | Fixed (repro). `mirrorNode` inlined into `patchMirrorDomTree` by terser (which then stays a function); the port does not inline it and flattens `patchMirrorDomTree` into its caller. | Cause: terser `append_var` adds the injected `var f,t` to the host's `scope.variables` (the definitions stay the callee's), and `all_refs_local` / `scope_encloses_variables_in_this_scope` skip a name in `variables`. The port resolved the references to the callee's definitions. Now `SymTable.injected_vars` (per scope id) is checked, also for an inlined copy of such a scope inside the lambda. |
| R5 | 67 | 229 (R4 and R5, after the rest) | Fixed (repro). `const screenReaderOnlyStyles="…"` kept by terser; the port inlines the string. The const is read in a function inlined as an IIFE into another. | Cause: terser's cross-scope inline is `fixed.clone(true, toplevel)`, whose `figure_out_scope` pushes the copy's outside references onto their definitions: the const has two references for the rest of the pass, so the multi-use overhead is halved and the string is not inlined. Now `SymbolDef.clone_refs` / `ref_count()`. |
| R6 | 50 | 200 | terser leaves a node unoptimized and the port optimizes it: `if(F)g();else{}` vs `F&&g()` (R6a), `if(m){p(…)}` (35), `if(currentActiveTooltip…)` (31), `if(letter…)return;` that then stops a flatten (R6b), `a\|\|(b\|\|c)` left as is (41 inputs). | terser `OPTIMIZED` / `SQUEEZED`: `drop_unused` and collapse edit nodes in place, so the descend after `drop_unused` skips nodes already optimized; an inlined class or lambda copy is `optimize()`d only at its top. The port rebuilds the parents and optimizes them again (`Cx.fresh`, `keep_squeezed`). |
| R7 | 33 | 185 | `hoist_props` not applied when a property value is a symbol: `const i18n={showActions:labelShowActions}` (import), `const position={x:x,y:y}`. | `hoist.rs` `prop_value_ok` accepts literals, functions, arrays and objects only; terser `hoist_properties` takes any value (only spread and computed keys are refused). |
| R8 | 18 | 194 | Fixed. `if(a)return;if(!b)…` gives terser `a\|\|b\|\|(…)`, the port `a\|\|(b\|\|(…))`. | Cause: `tighten_body`'s if-return `transform`s the new `if`; its optimize returns a new statement (`OPTIMIZED`, not `SQUEEZED`) holding a flagless binary, which the descend after the scope's `drop_unused` optimizes. The port squeezed the whole tree after the scope's optimize. Now a replacement from `transform` is `Cx.fresh`, and so are the binary `optimize_if` builds and the statements `sequencesize` joins (R8b: after a statement the `||` ends up in a sequence). |
| R9 | 13 | 201 | Fixed (repro). `getExpression$1` inlined into a class constructor by terser; the port keeps the function. | Cause: the callee holds an inlined copy of `tokenizeDateTimePattern`, whose `if(a){if(b){let l…}}` was merged into one `if`; the rebuilt block has no scope node, so `all_refs_local` took its `let l` as an outside name. Now a definition whose scope chain reaches any scope nested in the lambda is local. |
| R10 | 12 | 229 (no change) | A local defun used once that refers to itself: terser inlines it as `function handleMouseLeave(){…}` into the call; the port keeps the declaration. | `eval.rs` single-use inline refuses a recursive lambda; terser renames it to a `SymbolLambda` (`recursive_refs > 0`, inline.js ~250). |
| R11 | 7 | 190 | In a function inlined as an IIFE, terser collapses `const a=t.reduce(…)` into the next `if`; the port keeps it. | Same cause as R2a, not inlining: `export function co(t,w){const a=t.reduce(i=>i);if(a<=w)return 1;{let i=g();h(i)}}` (tools/repros.sh R11b). `inner_shadow` counts the nested block's `let i` as a local of the function, so the arrow parameter `i` in the value shadows it. |

Lower counts, repros only: R12, an unused argument becomes `pt(0)` in terser and `pt()` in the port (also `setAriaRelationship(0,0,0,options)` kept as names by the port). R13, `class A{}A.v=1;` is dropped by terser; the port prints `(class{}).v=1;` (in reductions only). R14, `const t=void p.forEach(…);g(t)` is collapsed by terser, not by the port.

Independent of the inlining work: R1, R3, R7, R10 (each in one function), R2a (collapse). R2b, R4, R5, R6, R8, R9 and R11 touch inlining, flatten or the optimize-once rules.
