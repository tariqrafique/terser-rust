# Compressor plan

The working plan for the compressor port. Update it at every commit that changes the plan or finishes a step. `PORT.md` is the history; this file is what happens next.

Goal: byte-exact terser 5.51.4 output, the lwc-rollup options first. The acorn/ESTree path is out of scope.

## Status (2026-11-28)

- Compress default board 2402/2671, lwc 334/339, bundles 0/3 (after the round-2 R3, R7, R10, R12, R13, R14 fixes).
- lwc-rollup: all 260 inputs under 200 KB match; 482 of 779 overall (297 failing: R1 alone touches 296 of them). Most remaining failures are large bundles where a few structural differences change mangle character frequencies, so every name differs.
- Known open cases: `functions/issue_2657` (terser never re-collapses after the flatten), `arrow/issue_2136_2`.

## Why a restructure

Recent fixes fell into three classes, none of them missing optimizations:

1. Node identity lost on rebuild. terser edits one tree in place; the port's immutable tree keys flags, scopes and definitions by pointer, so every rebuild must carry them over (`transfer_flags`, `SymTable.alias` / `alias_scope`, `retarget_fixed`, `late_squeezed`, `pre_tighten`). Each missed path is a bug.
2. The compressor's symbol table is incomplete, so code decides by name (`cx.shadowed`, the `INJECTED` / `LAMBDAS` / `DEFUNS` / `BLOCK_CANDS` sets in collapse). Destructured bindings are still undeclared there; defining them outright broke 57 cases.
3. Each pass has its own tree walker with its own gaps and order (`tighten.rs` `each_child`, `drop_unused` `descend`, `syms` / `reduce_vars` walks). terser has one walk order (`AST_Node._walk`, a call's args before its callee) and one transform order (`transform.js`).

## Steps

- [x] Commit the tools (`tools/`) and this plan.
- [x] Trace diff (`tools/trace-diff.sh`): log the same decisions from an instrumented terser and from the port (collapse candidates and outcomes, inline decisions, drop_unused calls, optimize results), diff the logs, report the first divergent decision.
- [x] Canonical traversals: `ast::walk_children` (`_walk`), `ast::transform_children` / `map_children` (`def_transform`), `ast::children_backwards` (`_children_backwards`, the `walk()` helper); `parser/tests/walk_order.rs` checks them against terser through `tools/walk-order.mjs`. tighten, drop_unused, the binder, reduce_vars, hoist and `is_reachable` use them. Left: reduce_vars `collect_local_refs` / `collect_calls` (an approximation of `handle_defined_after_hoist`) and `contains_break` (not `has_break_or_continue`); reduce_vars lacks terser's frames for optional chains, classes, labels and loop `break`/`continue`; the concise-method value is `FuncKind::Expr` where terser has `AST_Accessor`; the `scope` crate's own walker.
- [ ] Stable node ids (design and progress: `NODE_IDS.md`): an id in every node; rebuilding with new children keeps it (terser's in-place edit), `make_node` and `clone(true)` make new ones (`clone(true)` copies definitions). Side tables keyed by id; retire the identity work-arounds one by one.
  - [x] Steps 1-4: ids and constructors, every construction site classified keep / new / copy / clone with terser citations, `check_ids` and the `rebuild` assert in debug builds, the shadow audit of the flags (`TERSER_ID_AUDIT=1`), and `SymTable` keyed by id with the scope and definition aliases retired. The board did not move at any step.
  - [ ] Step 5 (flags by id), 6 (`fixed` by id), 7 (cleanup). The audit's mismatch counts are in `NODE_IDS.md` §6.
- [ ] Complete the compressor's binder (patterns, defaults, hoisted and injected names), then make collapse definition-based (`is_lhs_local`, `may_modify`, `shadows` by definition) and drop the name sets.
  - [x] Patterns, defaults, destructured catch parameters, imports, and loop / `switch` block scopes are declared (`syms.rs` `define_pattern`, `hoist` `Import`, the loop arm). Symbol-read purity, the `undefined` / `typeof` folds and the `unsafe` global folds ask the definition first (`Cx::declared_ref`); the name stack only answers for a node the table does not know. flatten's `scope_encloses_variables_in_this_scope` skips names declared inside the callee.
  - [ ] Injected names: a `var` `flatten_fn` adds is aliased to the parameter's definition, but the scope's name sets (`Cx.injected`, `INJECTED` in `tighten.rs`) are still by name.
  - [ ] Collapse: still name based (`block_scoped_names`, `BLOCK_LETS`, `BLOCK_CANDS`, `scope_bindings`). `get_lhs`'s `is_ref_of(lhs, AST_SymbolLet)` should read the lhs's definition.
- [ ] Back to case-by-case parity, starting from the trace diff's first divergence on each failing lwc-rollup bundle.

## Rules

- Every commit: no newly failing board cases (`tools/board.sh`), lwc-rollup checked with `tools/rollup-check.py`.
- Push the branch and fast-forward `main` after verified progress.
- A refactor step may leave the board unchanged; it must not lower it.
