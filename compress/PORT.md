# Compress port

Terser 5.51.4. Byte-exact output first. Board: `git rev-parse HEAD` (12) + `-` + corpus sha (12).

| Terser | Rust | State |
| --- | --- | --- |
| `compress/index.js` `compress` | `compress/src/lib.rs` `compress` | passes loop done. `expression` runs `process_expression` around the passes |
| `reduce-vars.js` `reset_def` / `safe_to_assign` / `AST_SymbolRef` / `mark_escaped` | `reduce_vars.rs` | constants + function-body `let`/`const` + `direct_access`. Not: escaped depth beyond the mark, lambda single_use, IIFE virtual params |
| `inline.js` `inline_into_symbolref` | `reduce_vars.rs` `inline_ref` | constants only. Regexp is not a constant. Const write clears `fixed` |
| `tighten-body.js` `collapse` | `tighten.rs` `collapse` | scan + `find_stop`. Straight-line helper removed |
| `drop-unused.js` `drop_unused` | `drop_unused.rs` `drop_unused` / `passes` | three walks. Not yet: `top_retain`, direct `eval`, `keep_fnames` |
| `drop-unused.js` `assign_as_unused` | `drop_unused.rs` `assign_as_unused` | `=` of a symbol. Write-only `++` not yet |
| `drop-unused.js` `scan_ref_scoped` | `drop_unused.rs` `scan_ref_scoped` | pass 1. Side-effect inits only; destructuring values always |
| `drop-unused.js` pass 2 (`in_use_ids.forEach`) | `drop_unused.rs` `passes` | inits of in-use names |
| `drop-unused.js` `tt` | `drop_unused.rs` `rewrite_expr` | drop unread decls; write-only `=` becomes the rhs. `fixed_ids` recorded, not yet applied to in-use names |
| `index.js` `hoist_properties` / `hoist_declarations` | `hoist.rs` `hoist` | runs at the start of `before`. `hoist_props` on by default. `hoist_vars` / `hoist_funs` off unless set. `top_retain` is a plain name only |
| `index.js` `def_optimize` / `OPT` | `lib.rs` `after_descend` + `eval.rs` `fold` | scope/block joining runs once after both descends. Per-type bodies that have landed are named below; the rest are still the `fold` chain |
| `index.js` `def_optimize(AST_If)` | `eval.rs` `optimize_if` | negation length, `&&`/`||`, dead branch, exits, nested `if`, abort split. Two expression branches become a conditional and run `AST_Conditional.optimize`. `size.js` `AST_Node.size`, `inference.js` `negate` / `aborts`, `tighten-body.js` `extract_from_unreachable_code` |
| `index.js` `def_optimize(AST_Binary)` | `eval.rs` `fold_binary` | comparisons, `&&`/`||`/`??`, lhs swap, `===`→`==`. Not bitwise De Morgan or string concat |
| `index.js` `def_optimize(AST_UnaryPrefix)` | `unary.rs` `optimize` | `!` `typeof` `void` `delete` `+` `-` `~`. Also `AST_Unary.lift_sequences`, `negate`, `bitwise_negate`, and the `drop_side_effect_free` that `void` calls. `++`/`--` are not this pass |
| `index.js` `def_optimize(AST_Dot)` / `def_optimize(AST_Sub)` / `flatten_object` / `lift_key` | `eval.rs` `fold_prop_access` / `fold_computed` | static key to dot, `.length` of a string or side-effect-free array, object property read to the value. `pure_getters` gates `may_throw_on_access`. Class `constructor` and `__proto__` stay computed |
| `index.js` `def_optimize(AST_Call)` / `def_optimize(AST_New)` | `call.rs` `optimize` | `inline.js` `inline_into_call`: constant return, identity `(0, prop)`, direct single-statement body, empty call. Spread of a hole-free array. Unused args when the callee is fixed. Pure annotation drops a statement call. `unsafe` folds Array/Object/String/Number/Boolean only when `is_undeclared_ref` is true. A toplevel `var` is a binding even with `reduce_vars` off. Not: `drop_console`, `join`/`charAt`/`apply`, var injection, `unsafe_Function` |
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

Stop: default 2260, fixture 1336, reduce_vars 261/261, collapse_vars 199/199, or lwc 339/339.

A class expression name is bound inside the class, so it does not keep an outer `var` of the same name. A class field initializer is a use.

A destructuring `let`/`const` is not a pure declaration: the pattern can throw. The root locals frame includes toplevel `var` and function names, so `shadowed` matches `is_undeclared_ref` when there is no symbol table.

Lambda board `4e2e5c8f5f7c-848142da17ac`: default 1794/3013 -> 1798/3013, 4 newly passing, 0 newly failing, lwc 174/339.

Sequence board `389e392e2390-848142da17ac`: default 1798/3013, 0 newly passing, 0 newly failing, lwc 174/339.

Assign board `81aabec8be8d-848142da17ac`: default 1798/3013 → 1810/3013, 12 newly passing, 0 newly failing, lwc 174/339. An assignment returned by `AST_Conditional` stays `OPTIMIZED`, so `x=(y,2)` is not lifted.

Object board `916f95ba3b34-848142da17ac`: default 1810/3013 → 1825/3013, 15 newly passing, 0 newly failing, lwc 174/339.

Loops board `41202a3b48a2-848142da17ac`: default 1825/3013 → 1896/3013, 71 newly passing, 0 newly failing, lwc 174/339 → 177/339.

Next: side-effect folds still in the shared chain (`fold_bool`, `fold_value`, `drop_statement`, `unwrap_void_statement`, `negate_iife`).
