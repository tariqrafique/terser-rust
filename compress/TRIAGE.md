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
| R1 (fixed) | 296 | 86 | `!(p in H)&&!(p in A)` kept by terser; the port negates to `!(p in H\|\|p in A)`. | Cause: `unary.rs` `best_of` and `best_negation` compared `print_len`; terser compares `size()` (`size.js`: no parentheses, `in` is 4; 16 vs 17 here). Every `size()` choice now goes through `size.rs` (PORT.md "Sizes"). On the branch at 76a51b2 (297 of 779 failing) it fixes 113 inputs, none newly failing: 184 failing. Before the round-2 inlining fixes it made 87 inputs match with mangling off but none with it on (a mangled-size inline decision that needed terser's reference count of an inlined copy, R5). |
| R2 | 160 | 153 | Fixed (repros R2a–g and R11 match; PORT.md "Block scopes by definition"). After it, 187 of the 297 failing inputs differ only in the R1 region with mangling off (86 before); formattedName still differs in `registerComponent(class` among 183 regions. A `let`/`const` in a nested block counts as a name of the enclosing scope. (a) collapse: `return(_a=class…).observedAttributes=` (90, `buildCustomElementConstructor`), the port keeps `_a=class…,_a.observedAttributes=`. (b) flatten: `registerComponent(Ctor, metadata)` stays an IIFE in every component with a dead function holding `const metadata` (61); `getName=(index=>…)(2)` vs `(index=2,…);var index` (37). | (a) `tighten.rs` `inner_shadow` uses `env.declared`/`env.locals`, built by `scope_bindings` → `collect_locals`, which walks into nested blocks and loop heads; terser `shadows` compares definitions (`find_variable(name) === def`). (b) `call.rs` `can_inject_symbols` `taken`: R2b/R2c only fail while the function holding the block-scoped name is unused (dropped later in the pass); an exported one is fine. Check `free_refs` (binds only parameters and `var`s) and the `cached_names` key 1 cache. terser `conflicting_def` reads `enclosed`, which stops at the block scope. |
| R3 (fixed) | 91 | 175 | `case units.YEARS:default:` kept (`units` is a `const` object literal); terser drops the empty case. The same cause keeps `(al.h,R)` where terser has `R` (R3b). | `loops.rs` switch branch removal → `unary.rs` `may_side_effect`: a property read on a symbol whose fixed value is an object literal. terser `AST_SymbolRef._dot_throw` returns `fixed._dot_throw()` (false for an object). |
| R4 | 67 | (with R5) | Fixed (repro). `mirrorNode` inlined into `patchMirrorDomTree` by terser (which then stays a function); the port does not inline it and flattens `patchMirrorDomTree` into its caller. | Cause: terser `append_var` adds the injected `var f,t` to the host's `scope.variables` (the definitions stay the callee's), and `all_refs_local` / `scope_encloses_variables_in_this_scope` skip a name in `variables`. The port resolved the references to the callee's definitions. Now `SymTable.injected_vars` (per scope id) is checked, also for an inlined copy of such a scope inside the lambda. |
| R5 | 67 | 229 (R4 and R5, after the rest) | Fixed (repro). `const screenReaderOnlyStyles="…"` kept by terser; the port inlines the string. The const is read in a function inlined as an IIFE into another. | Cause: terser's cross-scope inline is `fixed.clone(true, toplevel)`, whose `figure_out_scope` pushes the copy's outside references onto their definitions: the const has two references for the rest of the pass, so the multi-use overhead is halved and the string is not inlined. Now `SymbolDef.clone_refs` / `ref_count()`. |
| R6 | 50 | 200 | Mostly fixed (node-id steps 5-7: flags by id, `NODE_IDS.md` §6). terser leaves a node unoptimized and the port optimized it: `if(F)g();else{}` vs `F&&g()` (R6a, fixed: the block optimizer emptied a block of pure declarations), `if(m){p(…)}` (35, R6c, fixed), `if(currentActiveTooltip…)` (31, fixed), `a\|\|(b\|\|c)` left as is (41 inputs). R6b fixed (round 3): `drop_unused` trims the IIFE's parameters and the call gives `0`. | terser `OPTIMIZED` / `SQUEEZED`: `drop_unused` and collapse edit nodes in place, so the descend after `drop_unused` skips nodes already optimized; an inlined class or lambda copy is `optimize()`d only at its top. The port rebuilt the parents and optimized them again. R6b: the port's call optimizer drops an IIFE's unused parameters (`call.rs` `iife_drops_params`); terser does it in `drop_unused` (du 262-285), which the port's does not do yet. |
| R7 (fixed) | 33 | 185 | `hoist_props` not applied when a property value is a symbol: `const i18n={showActions:labelShowActions}` (import), `const position={x:x,y:y}`. | `hoist.rs` `prop_value_ok` accepts literals, functions, arrays and objects only; terser `hoist_properties` takes any value (only spread and computed keys are refused). |
| R8 | 18 | 194 | Fixed. `if(a)return;if(!b)…` gives terser `a\|\|b\|\|(…)`, the port `a\|\|(b\|\|(…))`. | Cause: `tighten_body`'s if-return `transform`s the new `if`; its optimize returns a new statement (`OPTIMIZED`, not `SQUEEZED`) holding a flagless binary, which the descend after the scope's `drop_unused` optimizes. The port squeezed the whole tree after the scope's optimize. Now a replacement from `transform` is `Cx.fresh`, and so are the binary `optimize_if` builds and the statements `sequencesize` joins (R8b: after a statement the `||` ends up in a sequence). |
| R9 | 13 | 201 | Fixed (repro). `getExpression$1` inlined into a class constructor by terser; the port keeps the function. | Cause: the callee holds an inlined copy of `tokenizeDateTimePattern`, whose `if(a){if(b){let l…}}` was merged into one `if`; the rebuilt block has no scope node, so `all_refs_local` took its `let l` as an outside name. Now a definition whose scope chain reaches any scope nested in the lambda is local. |
| R10 (fixed) | 12 | 229 (no change) | A local defun used once that refers to itself: terser inlines it as `function handleMouseLeave(){…}` into the call; the port keeps the declaration. | `eval.rs` single-use inline refuses a recursive lambda; terser renames it to a `SymbolLambda` (`recursive_refs > 0`, inline.js ~250). |
| R11 | 7 | 190 | In a function inlined as an IIFE, terser collapses `const a=t.reduce(…)` into the next `if`; the port keeps it. | Same cause as R2a, not inlining: `export function co(t,w){const a=t.reduce(i=>i);if(a<=w)return 1;{let i=g();h(i)}}` (tools/repros.sh R11b). `inner_shadow` counts the nested block's `let i` as a local of the function, so the arrow parameter `i` in the value shadows it. |

Lower counts, repros only: R12 (fixed), an unused argument becomes `pt(0)` in terser and `pt()` in the port (also `setAriaRelationship(0,0,0,options)` kept as names by the port). R13 (fixed), `class A{}A.v=1;` is dropped by terser; the port prints `(class{}).v=1;` (in reductions only). R14 (fixed), `const t=void p.forEach(…);g(t)` is collapsed by terser, not by the port.

Independent of the inlining work: R1, R3, R7, R10 (each in one function), R2a (collapse). R2b, R4, R5, R6, R8, R9 and R11 touch inlining, flatten or the optimize-once rules.

## Round 3 (2026-11-28, branch at f87f6ef)

On f87f6ef (R2 and the node-id flag steps merged), 41 of 779 inputs fail in this run (same comparison as `tools/rollup-check.py`; the branch's own count was 44, so compare the lists if the 3 matter). 14 of the 41 match with mangling off, and 27 differ with mangling off too. The regions of each input (split at `;`, `{` and `}`) were taken twice:
- mangling off: `tools/terser.mjs` vs `try`.
- mangle-aware: `tools/terser-aware.mjs` vs `try_aware`, which is the compressor of a mangled build printed with the original names.

That gives 72 regions with mangling off (30 distinct) and 147 mangle-aware. Every region has a cluster below. The repros are in `tools/repros.sh T`. They were reduced by hand from the inputs and checked against them.

- The mangler is not the cause. On the 183 inputs failing at f37b8b6, terser and the port agreed on all 183 when each mangled terser's own compressed output (compress off). But terser re-mangling that output never gives the expected output. The reason is that terser's compressor counts a mangleable symbol as one character (`size.js` `AST_Symbol._size`), so a mangled build compresses differently from a mangling-off build. The 14 inputs that differ only with mangling on are such a compressor decision (T1), not mangler bookkeeping: `def.references`, unreferenced names and `keep_fnames` did not show up. For these inputs, compare `try_aware` with `terser-aware.mjs`, not the mangling-off outputs.
- Wrong code: none. Only formattedName's output reads globals that terser's does not (`Date`, `isNaN`, ...). That is dead localization code the port keeps, because of T4.
- R2 and R6: the R2 fix also fixed the round-3 candidates that had R2's shape (`()=>re(elm,tok,l)` after an outer flatten is R2g). The open R6b (`iife_drops_params`) appears in none of the 41 inputs. T5 below is a new optimize-once case.

| Id | Inputs | Only this | What (terser vs port) | Suspected cause |
| --- | --- | --- | --- | --- |
| T1 (fixed) | 18 | 14 | Fixed (PORT.md "Round 3: T1, T3"). A symbol with a constant fixed value is not evaluated where it stays a symbol. `const MINUTE=6e4;[MINUTE*60,…]` gives terser `36e5` and the port `60*n`. With mangling on, the short mangled name makes inlining `MINUTE` too expensive, so only evaluation through the fixed value folds it. With `var ff="Large"` used elsewhere, `ff==="Large"` gives terser `!0`, with mangling off too. In the inputs: `HOUR=60*MINUTE` (relativeDateTime ×3), `matches[INDEX_TIME+1]` with `INDEX_TIME=14` (the i18n date parser, 10 inputs), `"Large"===formFactor` (7). | terser `evaluate.js` `def_eval(AST_SymbolRef)` evaluates `fixed_value()`. The port's `eval.rs` `eval` has no `Symbol` arm, so `fold_value` / `finish_constant` fold only after the symbol is inlined. `fixed_of` (eval.rs) already finds the fixed value. A fix needs terser's guards too: `reentrant_ref_eval`, and the `escaped` depth for objects. |
| T2 (fixed) | 6 | 6 | Fixed (5dc2ac0): `Cx.injected_refs` is keyed by the scope the var was appended to, and collapse gets only the ones the name resolves to from its scope (`body.rs` `visible_injected`). `const lo=r.f.v,la=r.f.w;return{lo,la}` is not collapsed (terser `return{lo:r.f.v,la:r.f.w}`) when a flatten in another function injected `var lo` there (`function il(lo){…}` inlined into `v`). The same happens with `category`/`name` in iconUtils. Inputs: outputField and the record view recipes (4), iconUtils (2). | `call.rs` flatten records `cx.injected_refs` by name only (`name -> reads + writes`). `tighten.rs` reads it as `INJECTED`, looked up by `cand.name` in every scope (lines ~589, 797, 866, 1152, 1207). terser's injected var belongs to its host scope only. Key it by scope (the `injected_vars` scope id) or by definition. |
| T3 (fixed) | 6 | 6 | Fixed (PORT.md "Round 3: T1, T3"). `let m=1;m+=2;f(m)`: terser `f(3)`, the port `f(m)`. In the modal family, `errorMsg+=' …';console.error(errorMsg)` gets the joined string. Inputs: modalBase, modal, interactiveDialogBase, alert, confirm, prompt. | For a compound assignment, terser `reduce-vars.js` `AST_Assign` sets `fixed` to a function that builds `AST_Binary(op, old fixed, right)`, and `inline_into_symbolref` evaluates it. The port gives a compound assignment no fixed value (or does not evaluate it). Same family as T1. |
| T4 | 4 | 2 | In `let P=gd()`, `gd` returns an inlined `ca($A)` that holds a method `t(name){…}`, and the toplevel has `var name`. terser flattens `gd` to `let P=…;var $A`; the port keeps `function gd(){…;var $A}let P=gd()`. Inputs: internalLocalizationService, internationalizationLibrary, inputName, formattedName (where the kept `gd` also keeps a dead `localizationService` with the date code, hence the extra globals). | The flatten checks in `call.rs` (`can_inject_symbols` / `free_refs`) on a callee that holds an inlined copy: the copy's method parameter `name` (now an arrow parameter) is taken for a reference to the toplevel `name`. Without the toplevel `var name`, or with `gd` written out by hand, both sides flatten. |
| T5 | 7 | 3 | The port re-optimizes a recursive defun inlined as a named function expression (the R10 path). `function b(c){if(c){const f=g(b)}}h(b)` gives terser `h(function b(c){if(c){g(b)}})` and the port `c&&g(b)`. At the toplevel, terser gives `(function cd(){…})()` and the port `!function cd(){…}()`. Inputs: tree, treeRecipes, tree-CQtLlsOp (`{buildTree.bind(this)…}`), and the four inputs with DOMPurify's `createDOMPurify` (purifyLib, formattedRichText, formattedRichTextRenderer, toast: `if(childNodes&&parentNode){for…}`, `…}else;`). | R6 family (optimize-once). terser makes this copy in `inline_into_symbolref` when `recursive_refs > 0` (inline.js ~250). The copy keeps the flags of the defun, which is already optimized, so the descend after `drop_unused` does not optimize its `if` again, and `negate_iife` does not see a fresh IIFE. The port optimizes the copy's body again. |
| T6 (fixed) | 2 | 0 | Fixed (836306d): `inner_lvalue_names` took only plain-symbol parameters as bound; a defaulted or destructured one (`o={}`) now binds too (`scope_bindings`). In `const f=gd(s,p);return f(v)`, `gd` is inlined as `function(l="e",o={}){…}` and the enclosing function has a dead `const o=p\|\|{}`. terser keeps `const f=…`; the port collapses it. Inputs: formattedDateTime, primitiveCellFactory. | `tighten.rs` `inner_shadow` (terser `shadows` in collapse). terser collects lvalues by name, including the parameter `o` of the lambda nested in the value. At the replacement site, `o` resolves to the outer `const o`, a different definition, so terser stops. The outer `o` is unused and dropped later in the pass, and the port's check probably skips it. Same code as R2a. |
| T7 | 2 | 1 | Reference counts of an inlined copy's own locals. (a) In a copy of a copy (`ff` inlined into `fm`, which is inlined into `h`), terser's `get_lhs` fails for `const lb=v?"x":"y"` (more than one reference), and the port collapses it into the call (configProvider, `label`/`unitString`). (b) When `function gm(n){const o=s[n];if(!o){}return o}` is inlined into another scope, terser collapses `o` and flattens to `s[c]`, but the port's collapse gets no lhs (wireServiceMocks, `getMockObjectInfo`). | terser's cross-scope inline is `fixed.clone(true, toplevel)` followed by `figure_out_scope` on the copy. The copy's locals get fresh definitions and reference counts from the copy, so in (b) the dropped `if(!o)` read no longer counts. A second clone adds its references to the ones the first clone made (a). The port's copy keeps the original's counts (`SymbolDef.clone_refs`, R5, covers outside names only). |
| T8 (fixed) | 4 | 0 | Fixed (c51b5ac): the compressor's binder made `arguments` an undeclared global; it is now a funarg of the nearest non-arrow function, and a declared `arguments` is a safe receiver in collapse. `let cfg=arguments[0];p(cfg)` is not collapsed (terser `p(arguments[0])`). Found in DOMPurify `setConfig` (the four DOMPurify inputs). | `tighten.rs` collapse refuses a value that reads `arguments`. terser stops only for a parameter name of a function that uses `arguments`, and for `arguments` itself as an lhs. |
| T9 (fixed) | 4 | 0 | `!(a)&&(!(b)&&!c&&d)`, from an if-return chain: terser `!(a)&&!(b)&&!c&&d`, the port `!(a\|\|b\|\|c)&&d`. Repro: `function ck(p){if(p.n&&!H)return!1;if(p.m&&!T)return!1;if(A)return!1;return C}` flattened into a caller. Found in DOMPurify `_checkValidNamespace` (the four DOMPurify inputs). | `eval.rs` `fold_binary` → `reassoc_lazy` (terser index.js ~2917, `x&&(y&&z)` → `(x&&y)&&z`). terser transforms the new left `!(a)&&(!(b)&&!c)` with the old binary on the stack, so its boolean negation (`!(parent instanceof AST_Binary)`) does not fire. The port optimizes the new left without a binary parent and negates it. |
| T10 (fixed) | 3 | 0 | Fixed (b94b698): collapse's `expr_effects` has terser's `AST_TemplateString.has_side_effects` (segments only); its `may_throw` is `AST_Node`'s true. A template literal that contains a symbol is not collapsed: `const r=\`a${u}\`;return new R(r,1)` (terser `new R(\`a${u}\`,1)`). Found in the DOMPurify config, `uriAllowListString` / `allowedUriRegString` (formattedRichText, formattedRichTextRenderer, toast). | `tighten.rs` collapse treats a template with expressions as having side effects (a `toString` call). terser `AST_TemplateString.has_side_effects` is only the side effects of the segments. |
| T11 (fixed) | 1 | 0 | `const AG={a:{G:1}};P(AG.a.G)`: terser hoists to `const AG_a={G:1}`; the port does not. The reference is a property read on the hoisted property. Found in wireServiceMocks (`ACTIONS_GLOBAL.actions…`). | `hoist.rs` refuses a reference whose parent is a property access on `AG.a`, not just `AG.a` itself. terser only needs every reference to be an `AST_Dot` on the symbol with a known key, and not an lhs. |

T9, T11 and R6b fixed (`compress/PORT.md` "Round 3 triage"). The T9 region now matches in purifyLib, formattedRichText, formattedRichTextRenderer and toast (`toast-Dhb1luZX`), and the T11 region in wireServiceMocks, but none of the five passes yet: what is left there is T5 and T8 (and T10), and T7b.

Which inputs pass after which fixes, cumulative (an input passes once every one of its regions is fixed, the mangle-aware regions included):

| After | Passing (of 41) |
| --- | --- |
| T1 | 14 |
| + T2 | 20 |
| + T3 | 26 |
| + T4 | 30 |
| + T5 | 33 |
| + T6 | 35 |
| + T7 | 36 (configProvider; wireServiceMocks also needs T11) |
| + T8, T9, T10 | 40 (the four DOMPurify inputs need T5, T8, T9, and all but purifyLib also need T10) |
| + T11 | 41 |

Independent of the inlining work (one function each):
- T1 and T3: evaluation through fixed values (`eval.rs` / `reduce_vars.rs`).
- T2: the `INJECTED` key in `tighten.rs`.
- T6: `tighten.rs` `inner_shadow`.
- T8 and T10: the collapse value checks.
- T9: `fold_binary` reassociation.
- T11: `hoist.rs`.

Inlining and optimize-once:
- T4: the flatten checks on a copy.
- T5: R6 family.
- T7: the copy's reference counts, next to R5's `clone_refs`.

Per input: regions with mangling off / mangle-aware, and their clusters.

| Input | Size | Off / aware | Clusters |
| --- | --- | --- | --- |
| lbc-recipes/c/configProvider | 327751 | 2 / 2 | T7a |
| lbc-recipes/c/relativeDateTime | 345837 | 0 / 1 | T1 |
| lbc/lightning/purifyLib | 362019 | 6 / 6 | T5 T8 T9 |
| lbc/lightning/iconUtils | 373485 | 2 / 2 | T2 |
| lbc-recipes/c/relativeDateTimeRecipes | 377103 | 0 / 1 | T1 |
| lbc-recipes/c/tree | 385926 | 1 / 1 | T5 |
| lbc-recipes/c/inputLocationRecipes | 388092 | 2 / 2 | T2 |
| lbc-recipes/c/outputField | 408022 | 2 / 2 | T2 |
| lbc/lightning/i18nService | 409949 | 0 / 3 | T1 |
| lbc-recipes/c/treeRecipes | 412370 | 1 / 1 | T5 |
| lbc-recipes/c/recordViewHolder | 426407 | 2 / 2 | T2 |
| lbc/lightning/internalLocalizationService | 428577 | 2 / 2 | T4 |
| lbc-recipes/c/mockRecordViewHolder | 428859 | 2 / 2 | T2 |
| lbc/lightning/relativeDateTime | 430406 | 0 / 1 | T1 |
| lbc/lightning/formattedName | 432806 | 3 / 3 | T4 |
| lbc/lightning/formattedTime | 448794 | 0 / 3 | T1 |
| lbc-recipes/c/recordViewFormRecipes | 451524 | 2 / 2 | T2 |
| lbc/lightning/formattedDateTime | 453288 | 2 / 5 | T1 T6 |
| lbc/lightning/formattedRichTextRenderer | 463725 | 7 / 7 | T5 T8 T9 T10 |
| lbc/lightning/internationalizationLibrary | 492968 | 2 / 5 | T1 T4 |
| lbc/lightning/formattedRichText | 500523 | 8 / 8 | T5 T8 T9 T10 |
| lbc/lightning/tree (tree-CQtLlsOp) | 591312 | 1 / 1 | T5 |
| lbc-recipes/c/wireServiceMocks | 648220 | 7 / 7 | T7b T11 |
| lbc/lightning/modalBase | 667643 | 1 / 1 | T3 |
| lbc/lightning/modal | 688990 | 1 / 1 | T3 |
| lbc/lightning/interactiveDialogBase | 727753 | 1 / 1 | T3 |
| lbc/lightning/alert | 748916 | 1 / 1 | T3 |
| lbc/lightning/confirm | 749002 | 1 / 1 | T3 |
| lbc/lightning/prompt | 804767 | 1 / 1 | T3 |
| lbc/lightning/primitiveInputSimple | 889873 | 0 / 3 | T1 |
| lbc/lightning/toast | 979362 | 8 / 8 | T5 T8 T9 T10 |
| lbc/lightning/datepicker | 1040247 | 0 / 3 | T1 |
| lbc/lightning/timepicker | 1125856 | 0 / 3 | T1 |
| lbc/lightning/primitiveCellFactory | 1294388 | 2 / 5 | T1 T6 |
| lbc/lightning/datetimepicker | 1458020 | 0 / 3 | T1 |
| lbc/lightning/input | 2044514 | 0 / 7 | T1 |
| lbc/lightning/primitiveDatatableIeditTypeFactory | 2055308 | 0 / 7 | T1 |
| lbc/lightning/primitiveDatatableIeditPanel | 2117879 | 0 / 7 | T1 |
| lbc/lightning/inputLocation | 2210757 | 0 / 7 | T1 |
| lbc/lightning/inputName | 2389095 | 2 / 10 | T1 T4 |
| lbc/lightning/inputAddress | 2543344 | 0 / 9 | T1 |
