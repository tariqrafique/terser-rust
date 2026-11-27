# Compress port

Terser 5.51.4. Byte-exact output first. Board: `git rev-parse HEAD` (12) + `-` + corpus sha (12).

| Terser | Rust | State |
| --- | --- | --- |
| `compress/index.js` `compress` | `compress/src/lib.rs` `compress` | passes loop done |
| `reduce-vars.js` `reset_def` / `safe_to_assign` / `AST_SymbolRef` / `mark_escaped` | `reduce_vars.rs` | constants + function-body `let`/`const` + `direct_access`. Not: escaped depth beyond the mark, lambda single_use, IIFE virtual params |
| `inline.js` `inline_into_symbolref` | `reduce_vars.rs` `inline_ref` | constants only. Regexp is not a constant. Const write clears `fixed` |
| `tighten-body.js` `collapse` | `tighten.rs` `collapse` | scan + `find_stop`. Straight-line helper removed |
| `drop-unused.js` `drop_unused` | `drop_unused.rs` `drop_unused` / `passes` | three walks. Not yet: `top_retain`, direct `eval`, `keep_fnames` |
| `drop-unused.js` `assign_as_unused` | `drop_unused.rs` `assign_as_unused` | `=` of a symbol. Write-only `++` not yet |
| `drop-unused.js` `scan_ref_scoped` | `drop_unused.rs` `scan_ref_scoped` | pass 1. Side-effect inits only; destructuring values always |
| `drop-unused.js` pass 2 (`in_use_ids.forEach`) | `drop_unused.rs` `passes` | inits of in-use names |
| `drop-unused.js` `tt` | `drop_unused.rs` `rewrite_expr` | drop unread decls; write-only `=` becomes the rhs. `fixed_ids` recorded, not yet applied to in-use names |
| `index.js` `hoist_properties` / `hoist_declarations` | `hoist.rs` `hoist` | runs at the start of `before`. `hoist_props` on by default. `hoist_vars` / `hoist_funs` off unless set. `top_retain` is a plain name only |
| `index.js` `def_optimize` / `OPT` | `lib.rs` `after_descend` + `eval.rs` `fold` | scope/block joining runs once after both descends. Per-type bodies are still the `fold` chain, not split into `def_optimize(AST_*)` |
| `index.js` `def_optimize(AST_If)` | `eval.rs` `optimize_if` | negation length, `&&`/`||`, dead branch, exits, nested `if`, abort split. `size.js` `AST_Node.size`, `inference.js` `negate` / `aborts`, `tighten-body.js` `extract_from_unreachable_code` |
| `index.js` `def_optimize(AST_Binary)` | `eval.rs` `fold_binary` | comparisons, `&&`/`||`/`??`, lhs swap, `===`→`==`. Not bitwise De Morgan or string concat |
| `index.js` `def_optimize(AST_UnaryPrefix)` | `unary.rs` `optimize` | `!` `typeof` `void` `delete` `+` `-` `~`. Also `AST_Unary.lift_sequences`, `negate`, `bitwise_negate`, and the `drop_side_effect_free` that `void` calls. `++`/`--` are not this pass |
| `index.js` `def_optimize(AST_Dot)` / `def_optimize(AST_Sub)` / `flatten_object` / `lift_key` | `eval.rs` `fold_prop_access` / `fold_computed` | static key to dot, `.length` of a string or side-effect-free array, object property read to the value. `pure_getters` gates `may_throw_on_access`. Class `constructor` and `__proto__` stay computed |
| `index.js` `def_optimize(AST_Call)` / `def_optimize(AST_New)` | `call.rs` `optimize` | `inline.js` `inline_into_call`: constant return, identity `(0, prop)`, direct single-statement body, empty call. Spread of a hole-free array. Unused args when the callee is fixed. Pure annotation drops a statement call. `unsafe` turns `new` of Object/RegExp/Function/Error/Array into a call and folds Array/Object/String/Number/Boolean. Not: `drop_console`, `join`/`charAt`/`apply`, var injection, `unsafe_Function` |
| `index.js` `def_optimize(AST_Conditional)` | `conditional.rs` `optimize` | ternary rewrites: sequence lift, constant branch, negation swap, `||` / `&&` / `??`, assign and call factoring, boolean `true`/`false`. `ecma` defaults to 5, so `??` stays off |

`assign_as_unused` does not apply to `let`/`const`. A non-strict `arguments` use marks every parameter in use. `let`/`const` are bound before refs in the block. Function passes rewrite inside nested blocks so a `var` assign there is still this function's.

Stop: default 2260, fixture 1336, reduce_vars 261/261, collapse_vars 199/199, or lwc 339/339.

A class expression name is bound inside the class, so it does not keep an outer `var` of the same name. A class field initializer is a use.

Next: the rest of the shared fold chain (lambda/scope, sequences, assign, object/array, loops/switch/try).
