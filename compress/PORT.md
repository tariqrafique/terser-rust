# Compress port

Terser 5.51.4. Byte-exact output first. Board: `git rev-parse HEAD` (12) + `-` + corpus sha (12).

| Terser | Rust | State |
| --- | --- | --- |
| `compress/index.js` `compress` | `compress/src/lib.rs` `compress` | passes loop done. `expression` runs `process_expression` around the passes |
| `reduce-vars.js` `reset_def` / `safe_to_assign` / `AST_SymbolRef` / `mark_escaped` / `mark_lambda` / `AST_Unary` | `reduce_vars.rs` | constants, lambda and class `single_use`, IIFE virtual params, `++`/`--` chained `fixed`, escaped depth through property reads. A function name is not a fixed write. Declaration names stay on the enclosing scope |
| `inline.js` `inline_into_symbolref` | `reduce_vars.rs` `inline_ref` | constants, evaluated numeric `fixed`, and a single-use lambda or class (`reduce_funcs`, loop guard, scope enclosure). Regexp is not a constant. Const write clears `fixed` |
| `tighten-body.js` `collapse` | `tighten.rs` `collapse` | `extract_candidates`, `find_stop`, `get_lhs`, `mangleable_var`, `replace_all_symbols`, `is_lhs_local`, `get_lvalues`, `value_has_side_effects`, `handle_custom_scan_order`, `remove_candidate`, `maintain_this_binding`. One read is replaced; a single-use `var` substitutes the value |
| `drop-unused.js` `drop_unused` | `drop_unused.rs` `drop_unused` / `passes` | three walks. Not yet: `top_retain`, direct `eval`, `keep_fnames` |
| `drop-unused.js` `assign_as_unused` | `drop_unused.rs` `assign_as_unused` | `=` of a symbol. Write-only `++` not yet |
| `drop-unused.js` `scan_ref_scoped` | `drop_unused.rs` `scan_ref_scoped` | pass 1. Side-effect inits only; destructuring values always |
| `drop-unused.js` pass 2 (`in_use_ids.forEach`) | `drop_unused.rs` `passes` | inits of in-use names |
| `drop-unused.js` `tt` | `drop_unused.rs` `rewrite_expr` | drop unread decls; write-only `=` becomes the rhs. `fixed_ids` recorded, not yet applied to in-use names |
| `index.js` `hoist_properties` / `hoist_declarations` | `hoist.rs` `hoist` | runs at the start of `before`. `hoist_props` on by default. `hoist_vars` / `hoist_funs` off unless set. `top_retain` is a plain name only |
| `index.js` `def_optimize` / `OPT` | `eval.rs` `fold` / `opt_table` | one arm per node type. `AST_Node` (no arm) returns the node. Debugger and directives stay in `lib.rs` `optimize` |
| `index.js` `def_optimize(AST_If)` | `eval.rs` `optimize_if` | negation length, `&&`/`||`, dead branch, exits, nested `if`, abort split. Two expression branches become a conditional and run `AST_Conditional.optimize`. `size.js` `AST_Node.size`, `inference.js` `negate` / `aborts`, `tighten-body.js` `extract_from_unreachable_code` |
| `index.js` `def_optimize(AST_Binary)` | `eval.rs` `fold_binary` | comparisons, `&&`/`||`/`??`, lhs swap, `===`→`==`. Not bitwise De Morgan or string concat |
| `index.js` `def_optimize(AST_UnaryPrefix)` | `unary.rs` `optimize` | `!` `typeof` `void` `delete` `+` `-` `~`. Also `AST_Unary.lift_sequences`, `negate`, `bitwise_negate`, and the `drop_side_effect_free` that `void` calls. `++`/`--` are not this pass |
| `index.js` `def_optimize(AST_Dot)` / `def_optimize(AST_Sub)` / `flatten_object` / `lift_key` | `eval.rs` `fold_prop_access` / `fold_computed` | static key to dot, `.length` of a string or side-effect-free array, object property read to the value. `pure_getters` gates `may_throw_on_access`. Class `constructor` and `__proto__` stay computed |
| `index.js` `def_optimize(AST_Call)` / `def_optimize(AST_New)` | `call.rs` `optimize` | `inline.js` `inline_into_call`: constant return, identity `(0, prop)`, direct single-statement body, empty call. Spread of a hole-free array. Unused args when the callee is fixed. Pure annotation drops a statement call. `unsafe` folds Array/Object/String/Number/Boolean only when `is_undeclared_ref` is true. A toplevel `var` is a binding even with `reduce_vars` off. `flatten_fn` (`can_flatten_body`, `can_inject_symbols`, `flatten_args`, `flatten_vars`): the injected `var` is spliced after the scope statement that holds the call (`Cx.pending_vars`). `is_recursive_ref` and `all_refs_local` guard a single-use fixed callee. Not: `drop_console`, `join`/`charAt`/`apply`, `unsafe_Function` |
| `index.js` `def_optimize(AST_Conditional)` | `conditional.rs` `optimize` | ternary rewrites: sequence lift, constant branch, negation swap, `||` / `&&` / `??`, assign and call factoring, boolean `true`/`false`. `ecma` defaults to 5, so `??` stays off |
| `index.js` `opt_AST_Lambda` (`def_optimize(AST_Lambda)` / `AST_Defun` / `AST_Arrow`) | `eval.rs` `opt_ast_lambda` | lone active `"use strict"` dropped when `side_effects` is on. An `if` / `switch` / `while` / `do` that can leave a statement stays. Not `AST_Function`'s `unsafe_arrows` |
| `index.js` `def_optimize(AST_SymbolRef)` | `eval.rs` `rewrite_global` | undeclared `undefined` / `NaN` / `Infinity` outside `with`, not the direct lhs (`AST_Undefined` / `AST_NaN` / `AST_Infinity`). Constant `inline_ref` is unchanged. Not the lambda half of `inline_into_symbolref` |
| `index.js` `def_optimize(AST_Sequence)` | `sequence.rs` `optimize` | `side_effects` filter (`drop-side-effect-free.js`), `merge_sequence`, `trim_right_for_undefined`. One expression uses `common.js` `maintain_this_binding`. `AST_Binary.lift_sequences` is the same `make_sequence().optimize`. The conditional sequence lift stays in `conditional.rs` |
| `index.js` `def_optimize(AST_Assign)` | `assign.rs` `optimize` | `x = x`, exit writes, `AST_Binary.lift_sequences`, `x = x - 2` → `x -= 2`. `fixed = false` on the compound-to-binary exit. Not `AST_DefaultAssign` |
| `index.js` `def_optimize(AST_Array)` / `def_optimize(AST_Object)` / `def_optimize(AST_ObjectKeyVal)` | `object.rs` `optimize` | `literals_in_boolean_context`, `inline_array_like_spread`, `inline_object_prop_spread`. `lift_key` then `unsafe_methods` (`ecma >= 2015`) turns an anonymous function or block arrow into a concise method. `unsafe_methods` is off unless set |
| `index.js` `def_optimize(AST_While)` / `def_optimize(AST_Do)` / `def_optimize(AST_For)` / `if_break_in_loop` | `loops.rs` `optimize` | `while` becomes `for`. Constant `do` becomes `for` or a block (`common.js` `has_break_or_continue`). `for` drops a side-effect-free init, drops a truthy test, and removes a falsy test (`dead_code`). A leading `if (c) break` / `else break` folds into the test (`inference.js` `negate`) |
| `index.js` `def_optimize(AST_ForIn)` / `def_optimize(AST_ForOf)` | — | neither type defines `optimize`. `AST_Node` returns the node |
| `index.js` `def_optimize(AST_Switch)` | `loops.rs` `optimize_switch` | constant discriminant, dead cases, duplicate `default`, equivalent-branch merge, empty-switch removal, `switch` to `if` or a block. A switch-built `if` stays an `if` (`OPTIMIZED`) |
| `index.js` `def_optimize(AST_Try)` | `loops.rs` `optimize_try` | drop an empty `finally` when `catch` is present. An empty `try` becomes the `finally` body plus declarations extracted from `catch` |
| `index.js` `def_optimize(AST_Catch)` / `def_optimize(AST_Finally)` | `lib.rs` `after_descend` | both extend `AST_Block`, so `tighten_body` is the inner block. `keep_block` leaves the braces |
| `index.js` `def_optimize(AST_Boolean)` | `eval.rs` `fold_bool` | boolean context and parent `==` / `!=` become `1` / `0`. Otherwise `true` is `!0` and `false` is `!1` |
| `evaluate.js` `AST_Node.evaluate` | `eval.rs` `fold_value` | constant value, then `best_of`. Not `&&` / `||` / `??` or conditionals, so a constant arm cannot drop the other arm's effects |
| `index.js` `def_optimize(AST_SimpleStatement)` / `drop_side_effect_free` | `eval.rs` `drop_statement` / `unary.rs` `drop_side_effect_free` | statement keeps only effects. Arrays, objects, binaries, conditionals, pure calls, and property reads that cannot throw |
| `drop-side-effect-free.js` `AST_Unary` `void` | `eval.rs` `unwrap_void_statement` | a `void` statement keeps the operand's effects |
| `inline.js` `negate_iife` | `eval.rs` `negate_iife` | only when the option is on and the parent is a simple statement. `expression` turns that statement into `return` for the passes, so the option off does not emit `!function` |

`assign_as_unused` does not apply to `let`/`const`. A non-strict `arguments` use marks every parameter in use. `let`/`const` are bound before refs in the block. Function passes rewrite inside nested blocks so a `var` assign there is still this function's.

Goal: the full terser 5.51.4 port. Every set on the board matches byte for byte: `default`, `fixture`, `lwc`, `lwc-rollup`, and `bundles`. There is no intermediate stop point.

Out of scope: the `acorn` path (terser's `--parse acorn` / `spidermonkey` input and `AST_Node.from_mozilla_ast` / `to_mozilla_ast`). Fixture cases that only differ through it are not targets.

A class expression name is bound inside the class, so it does not keep an outer `var` of the same name. A class field initializer is a use.

A destructuring `let`/`const` is not a pure declaration: the pattern can throw. The root locals frame includes toplevel `var` and function names, so `shadowed` matches `is_undeclared_ref` when there is no symbol table.

Lambda board `4e2e5c8f5f7c-848142da17ac`: default 1794/3013 -> 1798/3013, 4 newly passing, 0 newly failing, lwc 174/339.

Sequence board `389e392e2390-848142da17ac`: default 1798/3013, 0 newly passing, 0 newly failing, lwc 174/339.

Assign board `81aabec8be8d-848142da17ac`: default 1798/3013 → 1810/3013, 12 newly passing, 0 newly failing, lwc 174/339. An assignment returned by `AST_Conditional` stays `OPTIMIZED`, so `x=(y,2)` is not lifted.

Object board `916f95ba3b34-848142da17ac`: default 1810/3013 → 1825/3013, 15 newly passing, 0 newly failing, lwc 174/339.

Loops board `41202a3b48a2-848142da17ac`: default 1825/3013 → 1896/3013, 71 newly passing, 0 newly failing, lwc 174/339 → 177/339.

Side-effect board: default 1896/3013 → 1991/3013, 95 newly passing, 0 newly failing, lwc 177/339.

`fold` is `opt_table`: one arm per node type. New arms: postfix `++`/`--` sequence lift, `AST_Chain`, `AST_Return`, `AST_Yield`, `AST_DefaultAssign`, `AST_VarDef`, empty `AST_Definitions`, `AST_TemplateString`, `AST_RegExp` in boolean context.

Dispatch board: default 1991/3013 → 2008/3013, 17 newly passing, 0 newly failing, lwc 177/339 → 184/339.

`reduce_funcs` defaults on. `inline_into_symbolref` turns a single-use function declaration into a function expression. IIFE parameters are fixed to the call arguments (`mark_lambda`). `mark_escaped` keeps depth above 1 when the value is a constant expression.

Reduce-vars board `947e9cd109bb-848142da17ac`: default 2008/3013 → 2041/3013, 33 newly passing, 0 newly failing, lwc 184/339.

Collapse was measured against `1c3bdeb` as default 2008/3013 → 2055/3013, 47 newly passing, 0 newly failing. Rebased onto `947e9cd` and remeasured below.

`tighten-body.js` `tighten_body` is `body.rs` `tighten_body`: `eliminate_spurious_blocks`, `eliminate_dead_code`, `handle_if_return`, `sequencesize`, `sequencesize_2`, `join_consecutive_vars`, looped until unchanged. `collapse` stays the separate `tighten.rs` pass. Not yet: `join_object_assignments`, label reference removal. Switch branches are tightened too. `drop_unused` rewrites a `for` init like a statement.

Tighten board: default 2088/3013 → 2205/3013, 117 newly passing, 0 newly failing, lwc 196/339 → 235/339 (before the template-string fix).

Module board: `minify` applies terser's `set_shorthand` for `module` and `toplevel` into `compress` and `mangle`. `module` turns on `toplevel` and an enclosing `"use strict"`. The mangler takes `toplevel`. `export { a as b }` prints `as` when the mangled local differs. Exported bindings (`export` declarations and `export { ... }` locals) are `exposed` and never dropped.

`collapse` runs inside the `tighten_body` loop for function, toplevel, and static block bodies (not nested blocks: the scan is name based). `reduce_vars` follows terser's `fixed === null` reset for `var`/`let`/`const`/`catch`: a function-level binding is marked safe and its first write is fixed; a nested-block `let`/`const` is not. `is_modified` and `is_constant_expression` for arrays and objects are ported, and the walk now reaches `a[b]`, templates, computed keys, `yield`, `with`, and `export`.

Default board after these: 2236/3013 → 2278/3013, fixture 1539 → 1622.

`with` and direct `eval` pin every enclosing scope (terser `uses_with` / `uses_eval`).

Flatten board: default 2278/3013 → 2321/3013, 0 newly failing, fixture 1622 → 1667, lwc 260/339.

Defun inline board: a single-use function declaration is inlined as a function expression with a fresh copy (`ast::deep_clone`, terser `clone(true)`) and an `AST_SymbolLambda` name. `drop_unused` drops an unread function-expression name and walks a declaration's body only once its name is in use. A rebuilt scope keeps its `node_scope` id. Default 2321/3013 → 2395/3013, fixture 1667 → 1744.

Var-defs board: `drop_unused` ports `AST_Definitions` `head` / `tail` / side effects and `var_defs_by_id` / `eliminated` (a repeated `var` becomes an assignment; a `var` redeclaring a catch parameter is not counted) and descends into `try`, loops, `switch`, and labels. `reduce_vars` multi-use inlining takes any evaluated constant (`make_node_from_constant`); `suppress` walks every symbol; `delete x` is a write; the symbol binder walks every node type. `size.js` `AST_Symbol._size` is 1 for a mangleable symbol when `minify` passes mangle options (`eval::mangled_size`). Default 2395/3013 → 2466/3013, fixture 1744 → 1784.

`join_object_assignments` is ported (statements and `extract_object_assignments` slots; not a `for` init). Its removed writes stay in `collapse`'s reference counts, as terser's `def.references` do. A `fixed` value follows its slot when the slot's node is compressed (terser's `() => node.value`). `single_use == "m"` still inlines. A symbol is an lhs only as the direct target. Default 2466/3013 → 2509/3013.

Block collapse board: `collapse` also runs in a nested block for that block's own `let` / `const`. A `var` candidate is rejected when `reduce_vars` still counts more references than the tree has (terser `get_lhs` reads `def.references`). `drop_unused` descends into every statement and splices an evictable block in a list. Flags carry across `collapse` and spliced blocks. Default 2542/3013 → 2589/3013, lwc 271 → 297.

Full board after the string-join commit: compress default 2305/2671, fixture 1848/2671, lwc default 305/339, lwc-rollup 464/779, bundles default 0/3. Roundtrip and mangle sets are 100%.

Known gaps worth the next pass:
- `collapse` is name based; blocks only collapse their own `let` / `const`.
- lwc-rollup bundles: remaining differences in the LWC engine code shift the mangler's character frequencies, so many bundles differ only in names.
- A `var` injected by `flatten_fn` is not in the `reduce_vars` table, so `collapse` uses current counts for it where terser has the parameter's references (`inline/issue_308`).
- `arrow/issue_2136_2` (rest parameter in an IIFE), `drop_console`, `unsafe_Function`.
- `collapse` still decides lexical names by spelling (`block_scoped_names`, `block_lexicals`, `BLOCK_LETS`); they now include destructured names.

Optimize-once board: `tighten_body` (`after_descend`) is skipped for a node that is already `OPTIMIZED`, as terser's `def_optimize` is. A node terser `.optimize()`s where it is made (an inlined lambda not yet optimized, a switch-built block, a falsy-loop block) is in `Cx.pre_tighten`: its `tighten_body` runs once on the children as they are, before they are descended. Default 2610/3013 → 2615/3013, fixture unchanged.

Copy board: an inlined lambda copy (terser `clone(true)`, made for a declaration or a cross-scope lambda) keeps its definitions through `SymTable.alias` / `alias_scope`, so references inside it still inline and scope checks see the right scope. `scope_encloses_variables_in_this_scope` guards every flatten. A `hoist`-rebuilt scope keeps its scope id. `drop_replaced` drops a global with `toplevel`. Default 2309/2671 compress (`block-scope/issue_334` now differs: a parameter read inside the copy is inlined where terser keeps it), fixture 1849.

Scope-faithful drop board: `drop_unused` drops only declarations of the scope it runs on (drop-unused.js `if (scope !== self) return`). `hoist_props` keeps unchanged nodes and gives its new names definitions. A rebuilt function stays the `fixed` value. A node an optimizer just built is tightened at once (`.optimize()`), a flattened lone lambda included. The `+ ""` removal is ported, and the short-const-by-name shortcut is off when `reduce_vars` has symbols. Compress default 2337 → 2343/2671, lwc 314 → 316/339, lwc-rollup small inputs 9 → 6 failing of 111 under 60 KB.

Export and collapse board: `export { x }` is a reference (`AST_SymbolExport` extends `AST_SymbolRef`) but not `def.export` during compress. The bitwise block of `def_optimize(AST_Binary)` and the `+ ""` removal are ported, and `best_of` sizes have no stack. Collapse follows `get_lhs` (any declared target; function-expression names are read-only) and `extract_candidates` (no property access), and `get_lvalues` enters nested functions. An injected var keeps the parameter's definition (`may_modify`, not `lhs_local`). Parameter defaults and destructuring patterns are walked by syms, reduce_vars (`suppress`) and drop_unused. Compress default 2355/2671, lwc 318/339, lwc-rollup inputs under 60 KB: 110 of 111, all lwc-rollup: 480 of 757.

- `functions/issue_2657`: terser never re-collapses the body after the flatten; here an injected var is only treated as a local inside a nested block.

internationalizationLibrary board: collapse's `stop_after` test is one `||` chain in terser, so a node whose own clause is false still meets the `may_throw` clause; inside a `try` that clause is `has_side_effects` of the node itself (`node_effects`: false for a declaration name, the value for a `VarDef`, the children for a statement). A single-use flatten checks `fn.is_constant_expression(exp.scope)` (`all_refs_local`, false once the lambda is `INLINED`). Collapse no longer substitutes the bare value of an unread assignment (the old sink shortcut): terser moves `x = v` whole and `drop_unused` removes it later, which later candidates in the same loop can see (an injected var's write stops a side-effect candidate). `drop_unused` now rewrites the object of an assignment target and keeps the `this` binding of a dropped callee assignment. Compress default 2362 → 2369/2671, lwc 319 → 320/339, lwc-rollup under 200 KB: 259 of 260 (testUtils left).

Drop-unused writes: `scan_ref_scoped` matches `assign_as_unused` on the `AST_Assign` only, not on a `SimpleStatement` around it, so `x = f();` walks `f` (it was skipped, and a function or `let` read only there was dropped). An undeclared global is in `toplevel.globals`, not `variables`, so its write is a use and `tt` keeps it (`x = f()` at the top level with `toplevel` became `f()`). Compress default 2362 → 2364/2671.

After a collapse in a function body, `tighten.rs` `drop_unmentioned` (a port shortcut; terser leaves this to `drop_unused`) drops a declaration whose name is never mentioned. Its name walk now uses `ast::walk_children`; it skipped object literals, so `var d` went while `{i:(d=r,d.h)}` still assigned it.

Drop-unused pass 1 also requires the assigned name to be the scope's own binding (`owned`), not only a declared one.

Every nested block is collapsed (terser `tighten_body` on each `AST_BlockStatement`), not only one with a `let` / `const` or a `var` with a value, so an assignment to a function `var` collapses into a `for…in` object there. With `try` blocks collapsed, the `stop_after` `may_throw` clause keeps `collapse_vars/issue_2891_1` from moving a throwing candidate past `a = "FAIL"`.

A lambda in `pre_tighten` (`Cx.foreign_lambda`) is tightened as terser does from the reference that inlined it: `defun_scope` is the enclosing scope, so its names are not local, `shadows` sees an enclosing binding of a name it rebinds (`FOREIGN_SHADOW`), and `handle_if_return` has `in_lambda` false.

A switch branch is collapsed like a block. `x.length` evaluates through the fixed value of `x` (`reduce_vars.rs` `fixed_eval`, terser `AST_SymbolRef._eval`).

Block-scope reads: terser gives every loop (`AST_IterationStatement`) and a switch body its own block scope, so a read in a `for…of` object or a `case` has a different `scope` than a toplevel `const` and is not `single_use` (`d.scope === this.scope`). The binder has no scope for these; `reduce_vars` `in_unbound_block_scope` adds the check, and a `let` / `const` in the same `for` head is in that loop's scope. Only a read of a block declaration (`let` / `const` / catch) keeps the block scope: `figure_out_scope` moves any other read to the defun scope, so a toplevel `var` read in a `for…of` head is still single-use.

Boolean binary negation: `def_optimize(AST_Binary)` with `comparisons` turns a boolean binary whose parent is not a binary into `!negate(self)` when `best_of` prefers it (`!s(a)&&(!c(a)||!c(b))` → `!(s(a)||c(a)&&c(b))`). `unary.rs` `negate` is `inference.js` `negate`, now with the `unsafe_comps` flips.

String joins: `(x + "foo") + "bar"` and `(x + "foo") + ("bar" + y)` optimize the middle pair as a binary (terser `binary.optimize`), so a template takes the constant: ``a+`u ${p}. `+"See"`` → ``a+`u ${p}. See` ``.

Switch default pruning: `def_optimize(AST_Switch)` "Prune side-effect free branches that fall into default" is `loops.rs` `prune_into_default`. When the default (or exact) body is the last body, side-effect free cases that only fall into it are spliced away (not `eliminate_branch`ed). Case tests use `has_side_effects` (`unary::may_side_effect`), so an undeclared `case qux` stays.

Single-use constants: `reduce_vars` `has_side_effects` / `may_throw` treat every `AST_Constant` (regexp, bigint, `Infinity`) as free of effects, so a single-use `const w=/a/` is substituted. A multiply-read regexp is still not evaluated (`unsafe_regexp`).

Lexical collapse targets: terser `get_lhs` gives no lhs for an assignment or `++` / `--` whose target is a `let` / `const` in any scope (`is_ref_of`). `SymbolDef.lexical` records it; `body.rs` `collect_lexical_targets` marks those target nodes by definition before each collapse step (`tighten.rs` `LEXICAL_TARGETS`), which covers an outer `let` that the name sets miss.

`arguments`: terser `AST_SymbolRef` `may_throw_on_access` is false for `arguments` whose scope is a function (`eval.rs` `scope_is_lambda`: the nearest function, class or toplevel, since a read of a non-block declaration has the defun scope), and `AST_Lambda.init_scope_vars` declares `arguments` in every non-arrow function, so the read itself drops (`unary.rs` `symbol_read_is_pure`). The binder still does not define it. `drop_unused`'s pre-check treats `arguments.x` / `arguments[k]` the same way. An unused `var w = c ? x : y` whose value drops entirely still leaves `0;` (pre-existing: `value_effects` decides before the context-aware drop).

Binder board: `syms::bind` declares every name of a binding pattern (destructured `var`/`let`/`const`, destructured or defaulted parameters, a destructured catch parameter; terser `AST_SymbolDeclaration` inside `AST_Destructuring`, `init` null), import locals (`AST_SymbolImport`), and gives loops and `switch` their own block scope (`AST_IterationStatement` / `AST_Switch` `is_block_scope`). A reference to such a name no longer resolves to an outer definition of the same spelling, which inlined an outer constant into `const {k}=v; return k` and dropped a call through `const {f}=v` (C2a/C2b), and resolved `return i` after `for (let i ...)` to the loop's `i` and dropped the top-level `i` it reads. An earlier attempt regressed 57 cases because reduce_vars did not yet `suppress` a destructuring `AST_VarDef` (96b0dd9): the pattern names kept the reset `fixed === null` and their reads were taken as the initial `undefined`. drop_unused drops a loop's or `switch`'s `let` in the enclosing pass (`owned` climbs through the loop scopes), as terser's `scope` only changes at an `AST_Scope`. `Cx::declared_ref` (terser `is_declared`) asks the table first; `read_is_pure`'s name-stack fallback is gone. Compress default 2362 → 2363/2671, lwc 319 → 323/339, lwc-rollup under 200 KB: 2 failing of 260 (unchanged).

Inlining board (C1, C5, C6, C10, C11):
- `INLINED` is keyed by scope id (`SymTable.inlined_scopes`) and read through `scope_lookup`, so a function the optimizer rebuilt keeps it. A function optimized into a new node gets a scope alias at the end of `transform`; before, `scope_encloses_variables_in_this_scope` saw an inlined copy's own parameters as outside names and refused to inline the enclosing lambda (`upgradeCallback`). `all_refs_local`, `scope_encloses_conflict` and `named_recursive` use `scope_lookup` too.
- `before()` squeezes only when `optimize` returns the same node: a block that `tighten_body` reduced to one statement returns that statement, which the parent's second descend still visits.
- `drop_side_effect_free` of an IIFE call is a new call (terser `this.clone()`); it and the sequence, `&&` and statement built around it are `Cx.fresh`, so the descend after the scope's `drop_unused` optimizes them (a sequence under `&&` drops the `!` of its first IIFE).
- An inlined lambda's first `tighten_body` has `in_lambda` false (`Cx.foreign_lambda`, below), so a function declared after its one call keeps `if(x)return;...`.
- `flatten_fn` splices each `var` right after the statement, so a later flatten's `var` comes first.
- Collapse `may_modify`: a reference from a nested function counts only when that function does not bind the name itself. A write of the candidate's name (`is_lhs`) is passed over before the `stop_after` tests (C11).

Open: in the first `tighten_body` of a forward-inlined copy terser collapses some `const`s but not others (`const a=M(value),u=...;return fl(value>0?"x":"y",a,u)`, the port also moves `u`); the cause is not found yet.

Round 2 triage (R3, R7, R10, R12, R13, R14):
- R3: `eval.rs` `dot_throw` is terser `_dot_throw` (`inference.js`), and `may_throw_on_access` is `!pure_getters || _dot_throw`. A reference answers with its fixed value (`!fixed || fixed._dot_throw()`), so `u.S` on `const u={S:1}` neither throws nor has side effects; an object throws only for a getter or a spread of something that does. `unary.rs` `may_side_effect` and `conditional.rs` `has_side_effects` / `may_throw` follow `AST_Dot` / `AST_Sub` (with the `is_nullish` short-circuit) instead of treating every read as an effect. The switch then drops `case u.Y:` before `default:`, and `(al.h,R)` drops the read.
- R7: `hoist.rs` hoists any property value (terser refuses only a spread or a computed key); the value filter (`prop_value_ok`, no `this`) is gone, as `reduce_vars` already covers those through `is_modified` (a method call that may read `this` loses its fixed value) and `direct_access` (a read of a getter or method finds no `read_property`). Methods and accessors stay refused: such an object is dropped unread either way. A `var` declared inside a block, loop, `switch`, `try` or `catch` is not hoisted (terser `sym.scope === self`; the declaration keeps its block scope, `SymTable.block_vars`). Each property gets its own variable and a repeated key reads the last (`const o_a$0=2`). `o[1]` reads key `"1"` (`get_simple_key`).
- R10: not recursion. `reduce_vars.rs` `inline_ref` took the reference's scope as the nearest scope, so a read inside `if(!t){...}` was in another scope than its function and went through `is_constant_expression` (false: the function reads `el`). terser's `AST_SymbolRef.scope` leaves block scopes for the defun scope unless the name is a block declaration (`let`, `const`, `using`, class declaration, catch); that is `symbol_scope`. `compressor.find_scope()` (block scopes included) is `nearest_scope`, for `scope_encloses_variables_in_this_scope` and the `clone(true)` test.
- R12: both sides trim `pt(r,t)` to `pt(0)` (terser keeps the `0` placeholder when a later argument is trimmed: `last = pos` also runs for a dropped trailing argument). The port then optimized `pt(0)` again and got `pt()`: `eval.rs` `fold_value` rebuilt the literal `0` in the second descend, so the call was a new node and not `OPTIMIZED`. A literal (number, string, bigint, `null`, regexp) has no `def_optimize` in terser and now stays the same node.
- R13: `unary.rs` `drop_side_effect_free` had no `AST_Assign` arm. It is now `drop_assign`: a non-logical write whose target has no side effects (and is not a property of a constant under `use strict`) keeps only the value's effects when the innermost object `is_constant_expression(find_parent(AST_Scope))` (`(class{}).v=1` drops). For that the inlined class expression keeps the declaration's scope (`make_node(AST_ClassExpression, fixed, fixed)`, `copy_binding` in `inline_ref`), `may_side_effect` has `AST_Class` (heritage, computed keys, static fields, static blocks), `const_expr` for a class follows `is_constant_expression(AST_Class)` (computed keys and static values, methods included), and a single-use class with a side-effecting heritage or static initializer (`extends B` with `B` undeclared, `static x=f()`) is not inlined (`class_side_effects`; the port took every class as free of effects).
- R14: collapse `may_modify` is false for a name whose one declaration is a `function` statement (`AST_SymbolDefun`); `tighten.rs` `defun_names` missed `export function g`, so the side-effecting `t=void p.forEach(...)` stopped at the callee `g` of `g(t)`. Exported declarations count now (still by name: the `DEFUNS` set).
