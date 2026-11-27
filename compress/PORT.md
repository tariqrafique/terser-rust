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

Optimize-once board: `tighten_body` (`after_descend`) is skipped for a node that is already `OPTIMIZED`, as terser's `def_optimize` is. A node terser `.optimize()`s where it is made (an inlined lambda not yet optimized, a switch-built block, a falsy-loop block) is in `Cx.pre_tighten`: its `tighten_body` runs once on the children as they are, before they are descended. Default 2610/3013 → 2615/3013, fixture unchanged.

Copy board: an inlined lambda copy (terser `clone(true)`, made for a declaration or a cross-scope lambda) keeps its definitions through `SymTable.alias` / `alias_scope`, so references inside it still inline and scope checks see the right scope. `scope_encloses_variables_in_this_scope` guards every flatten. A `hoist`-rebuilt scope keeps its scope id. `drop_replaced` drops a global with `toplevel`. Default 2309/2671 compress (`block-scope/issue_334` now differs: a parameter read inside the copy is inlined where terser keeps it), fixture 1849.
