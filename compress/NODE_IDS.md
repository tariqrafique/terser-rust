# Stable node ids: design

This is the design for PLAN.md's "Stable node ids" step. Steps 1-6 of §4 are done and step 7 in part; §6 has what landed, where the design was wrong, and the shadow audit's results.
- terser edits a single tree in place.
- The port rebuilds immutable `Rc<Node>`s and keys flags, scopes and definitions by pointer, so every rebuild has to carry them over.
- Giving each node an id that survives rebuilds removes that whole class of bug.

Rejected alternatives:
- **An `Rc<Meta>` cell shared by every version of a node.** It needs the same API discipline, ties compress semantics into `ast`, and cannot be made a dense table.
- **An arena AST with real in-place edits.** It means rewriting the parser, codegen and scope crates. Ids are a stepping stone toward it, since they would become the arena indices.

## 1. The id

In `ast/src/lib.rs`:

```rust
#[derive(Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Debug)]
pub struct NodeId(u32);
pub struct Node { id: NodeId /* private */, pub start: Option<Tok>, pub end: Option<Tok>, pub data: Data }
```

**Struct rules.**
- Make `id` private. Then every `Rc::new(Node { .. })` literal outside `ast` stops compiling: about 30 in compress and 4 in the parser (`parse.rs` 194, 2167, 2178, 2538). Each one has to pick a constructor explicitly.
- Remove `Clone` from `Node`'s derive, because `(*n).clone()` would duplicate an id. `Data` keeps `Clone`.

**Minting.**
- Ids come from a thread-local `Cell<u32>` counter.
- `ast::reset_ids()` runs at the start of `terser::minify`. Each board case runs on its own thread, so this is safe.
- Ids are only compared within one tree. They stay small, so dense tables work.
- Overflow panics.

| terser | Rust | id | span |
| --- | --- | --- | --- |
| `new AST_X` / parser | `Node::spanned(start, end, data)` (replaces `with_span`), `Node::new(data)` | new | given / none |
| `make_node(X, orig, {..})` | `Node::make(orig, data)` | new | copied from `orig` |
| in-place edit (`self.x = ..; return self`, `descend`) | `n.rebuild(data)` | **same** | `n`'s own |
| `n.clone()` / `make_node(X, n, n)` | **copy**: `Node::make(n, data)`, then `table.copy_binding(n.id(), new.id())` | new, copies def and scope but not flags | copied from `n` |
| `clone(true)` | `ast::deep_clone_with(n, &mut \|old, new\| ..)` | all new | copied |

**Debug checks.**
- `rebuild` asserts in debug builds that no direct child of `data` has `self.id`. This catches `rebuild(x, Seq[x, ..])`.
- `ast::check_ids(root)` runs in debug builds or under an env var. It reports one id with two pointers in one tree, which is the port's version of terser putting one object in two places.

**Effect on existing `ast` functions.**
- `ast::map_children` keeps the id, as terser's `descend` does.
- `ast::deep_clone` mints new ids. `deep_clone_with` reports each (old, new) pair, which replaces `SymTable::alias_copy`'s zip of the two trees.
- `ast::for_each_child` walks children without allocating. It replaces about 15 `let _ = ast::map_children(n, |c| {..; Rc::clone(c)})` iterator uses:
  - `syms.rs` 629, 734, 739
  - `unary.rs` 681
  - `body.rs` 1068
  - `reduce_vars.rs` 1183, 1421, 1839
  - `tighten.rs` 268, 2373, 2675
  - `object.rs` 93
  - `call.rs` 455
- Codegen and the scope/mangle crates work on the final tree and stay keyed by pointer.

### Rules

- **"Changed?" checks stay on pointers.** These are `!Rc::ptr_eq(&m, c)`, `same_stmts` and `finish(.., changed)`; they mean "content changed".
- **"Is this terser's same object?" checks compare ids.** Examples are `opt === node`, `fixed_value() === node.value` and `parent.expression === self`.
- **Local maps stay on pointers.** These are maps that live inside one walk over a tree that does not change:
  - the `drop_unused` `Use` sets
  - `tighten`'s `sites`
  - unary's `active`
  - the `reduce_vars` `Tw` maps
- **Content caches stay on pointers.** This is `Cx.scope_cache` / `cached_names`. With id keys, a rebuilt scope would get stale name sets.
- **Spans.** Comments print from `start`, so a span change is an output change.
  - `rebuild` uses the node's own span.
  - Convert a site to `rebuild` only when its span argument already is the node being edited. Flag every other site for review.

## 2. Inventory

Key: **keep** = `rebuild`, **new** = `make`, **copy** = `make` + `copy_binding`, **clone** = `deep_clone_with`.

Line numbers on the left are the port's file at commit 59e18be. Citations in parentheses are terser's `lib/compress/` files: `index.js` unless named, `tb` = `tighten-body.js`, `du` = `drop-unused.js`, `il` = `inline.js`.

**lib.rs**
- `finish` 1455: **keep**. It is `descend` / `do_list`, and all 57 calls from `map_children` keep.
- `after_descend` 1559, 1567, 1581, 1594, 1613, 1621: **keep** (`tighten_body(self.body)` is in place, 703–741).
- `empty` 1451 and `optimize` 1445/1446: **new** (729).
- `process_expression`:
  - Simple→Return 519 and Return→Simple 524: **new** (588, 596–601).
  - If/With 541/550 and `rewrite_completion` 569: **keep** (606–617).
- Switch `tighten` helpers:
  - `sequence_into_next` 1829–1859: **keep** (tb 1317–1347).
  - `comma` 1881 and `eval_void` 1925: **new**.

**eval.rs**
- `atom` 3654 is used both ways: split it into `atom` (new) and `edit` (keep).
- **keep**:
  - 190 Return (3867)
  - 204 Yield (3909)
  - 235 VarDef (1684)
  - 333 Template (3950)
  - 512/527 `lift_key` (4009–4018)
  - the Binary around 2083/2086. Its inner `Null` is **new** (2304–2307).
  - `optimize_if` 604, 689, 697, 703 (1143–1146, 1223–1233)
  - 3327 With
  - `replace_stmt_list` 3354–3357
- **new**:
  - If→Cond 644 and 857
  - negate 1019 (`inference.js` 885)
  - `maintain_this_binding` 1426
  - `fold_bool` 1928/1930
  - 3299
  - the literal constructors 3638–3695
- `simple` 723 and `binary` 727 default to **new**. The exceptions are the `fold_binary` swaps (2267) and operator rewrites (2296), which are **keep**.
- `finish_block` 798: **new**.

**body.rs**
- `make_sequence` 605: **new**.
- `cons_seq` rebuilds 716, 720, 733, 742, 748, 756, 760, 764 and 1046: **keep** (tb 1317–1347, 1493–1508).
- `handle_if_return` 447, 466, 503, 512, 535: **new** (`stat.clone()`, tb 1037/1058/1087/1099/1119).
- 778: **new**. It is already in `cx.fresh`.
- `join_consecutive_vars` For 970/982: **keep** (tb 1477, 1486).
- `append_defs` 1055: **keep** (tb 1447/1461).
- `join_object_assignments`: Prop 866, Object 888, VarDef 889 and Defs 892 are **keep**. The joined Seq 865 is **new** (tb 1428).

**tighten.rs**
- `node` 2767, `walk` 58–168 and `map_walk` 2796–2935: **keep**. The scanner is an in-place TreeTransformer.
- `rewrite` 1527–1812: **keep** (tb 523/532).
- `remove_candidate` 1838: **keep** (tb 877).
- `replacement` Var→Assign 1855 and post→prefix 1864: **new** (tb 383).
- `sym_ref` 2752: **copy** (tb 385).
- `maintain_this` 1895: **new**.

**call.rs**
- `finish_call` 86: **keep** (1741, 2000).
- `fresh_copy` 200: **clone** (il 358/480/485/673).
- `same_def` 472, with 486 and 491: **copy** (il 602/623).
- Assign 340/493, VarDef 488 and Defs 355: **new** (il 596/604/648/668).
- `finish_seq` 1377 and `seq_node` 1452: **new**.
- The unsafe Array/Object rewrites 824–850: **new**.

**reduce_vars.rs**
- `span_node` 1865 (16 uses): **new** (il 297).
- 124 `deep_clone` + `alias_copy`: **clone** (il 273).
- 121–123 Defun: terser's `make_node(AST_Function, fixed, fixed)` (il 247–250) is a copy of the top node only, so the children keep their ids and flags. The port deep-clones it. Treat that as a later change of behavior.

**drop_unused.rs**
- `node` 835, `scope` 94/115/132 and `map_scope` 840–882: **keep**.
- `rewrite_expr` 582, VarDef 375, Defs head 402 (du 391) and For init 426 (du 419–425): **keep**.
- 349: **copy** (du 343).
- **new**:
  - Assign 352 (du 345)
  - `simple(seq)` 370/405 (du 367/395)
  - Empty/Block 606/608 (du 300/311/401/405)
  - `num0` 824 (du 240/245/459)
- `replace_kept` 57: **keep**.

**hoist.rs**
- `finish` 488, For/ForIn/ForOf 158/165/166, Defs 343 and `finish_map` 362/364: **keep** (880–940).
- `with_body` 479–481: **keep** (875).
- 71 and 114: **keep**.
- 138: **new** (820).
- 91, 127, 131, 143, 144, 178 and 328: **new** (771/777/800/801).
- 447: **new**, with its def from `define_hoisted`.

**Other files**
- **conditional.rs**: `atom` 1261, `binary` 1233, `make_seq` 1245 and `cond_node` 1229 are **new**. `self.condition = expressions.pop()` (3235) is **keep**.
- **unary.rs**:
  - `sequence_node` 473 and `seq_from_parts` 850: **new**.
  - The `drop_side_effect_free` clones (145/222/271) and the `lift_sequences` clone (2092): **new**.
  - `keep_squeezed` 698: **keep**.
- **loops.rs**:
  - `for_node` 287: split it. While→For (962) is **new**; the `optimize_for` edits (1065–1111) are **keep**.
  - `sealed_if` 908: **new**, OPTIMIZED (1505–1518).
  - 129 and `finish_switch_block` 984: **new**, with `pre_tighten`.
- **assign.rs** `assign_node` 688: 612, 636 and 643 are **new** (2218–2237). 668 and 674 are **keep** (3083–3091).
- **sequence.rs**: 175 is **keep** (2061). 64, 83, 101, 105/106 and `make_and_optimize` are **new**.
- **object.rs**: the spread splices (3808/3836/3847) are **keep**; everything else is **new**.
- **syms.rs**: `drop_replaced` `node` 896 is **keep** (a port-only filter).

## 3. Side tables

**Retired, in this order:**
1. `flag_keep`, `seal_keep`, and the keep-alive `N` in `alias`, `alias_scope`, `fresh`, `late_squeezed` and `pre_tighten`. Ids are never reused, so nothing has to stay alive.
2. Scope aliasing:
   - `alias_scope_node`
   - the hoisted `node_scope` copy
   - the `alias_scope` inserts in `transfer_flags`, `keep_squeezed` and `reduce_vars` 127
   - the scope half of `retarget_fixed` and of `alias_copy`
   - `SymTable.alias_scope`, which merges into an id-keyed scope map
3. Definition aliasing:
   - `same_def`
   - the `alias` map, which becomes `node_def: IdMap<DefId>` plus a `RefCell` extra map
   - `alias_copy`
   - the def half of `transfer_flags`
   - the `define_hoisted` keep-alive

   After this, `fresh_copy` and the reduce_vars clone become `syms::clone_deep(table, n)`.
4. `sealed`/`is_sealed`, `seal`/`seal_optimized`, which become plain OPTIMIZED.
5. `late_squeezed`/`keep_squeezed`, which become plain SQUEEZED.
6. `transfer_flags` after hoist.
7. `mark_tree_squeezed` + `fresh` + `transfer_flags` after `drop_unused`.
8. The `set_parent`/`Cx.stack` swapping. Parent checks compare ids instead.

**Stay, keyed by id:**
- `pre_tighten` (a deferred `.optimize()`).
- `pending_vars` (terser's `scope.body.indexOf(parent)` splice).
- `injected`, keyed by scope id. This drops the `ptr | 1<<60` hack in `call.rs`.
- `retarget_fixed` / `fixed_of_node`. They model terser's live `fixed()` closure, which reads the slot, not the object.
  - A rebuild of a tracked id must also update `fixed`. Do this with a compress-side `rebuild` wrapper that checks a set of tracked ids; it replaces the source-position guard in `transfer_flags`.
  - `hoist.rs` 231 `Rc::ptr_eq(fixed, value)` becomes an id comparison (index.js 902).

**Stay for now:**
- `drop_unused`'s own `syms::bind`. Moving it belongs to the binder step.
- `scope_cache`.
- eval MANGLED/KNOWN, re-keyed by id.

## 4. Migration

After every step the board stays at 2362/2671 and lwc at 319/339. Check with `tools/board.sh` and `tools/rollup-check.py`.

1. **ast, mechanical.** Add:
   - `NodeId` and the private field
   - `make`, `spanned`, `new`, `rebuild`
   - `deep_clone_with`, `for_each_child`
   - `reset_ids`, `check_ids`

   Every compress and parser literal becomes `Node::make`. Nothing reads ids yet.
2. **Classify, one file per commit, following §2.**
   - Split the helpers into make/edit pairs: `atom`/`edit`, `node`/`renode`, `for_node`, `assign_node`, `finish`.
   - Give each keep site a terser line citation in a comment.
   - Turn on `check_ids` and the `rebuild` assert in the fast profile and fix every report.
   - To find keep candidates, log `make(orig, data)` calls where `orig` and `data` are the same variant and share a child `Rc`.
3. **Shadow audit.**
   - Keep id-keyed SQUEEZED/OPTIMIZED sets next to the pointer sets.
   - At each `transform` decision, compute both answers and log mismatches under an env var. The decisions are the entry check, `already`, `sealed`/`switch_sealed` and `same`.
   - Do the same for scope and def lookups.
   - Decisions stay pointer-based. Collect the mismatch counts.
4. **SymTable by id.**
   - Re-key `node_def`, `node_scope`, `references`, `fixed_of_node` and `inlined_scopes`.
   - Merge `alias`/`alias_scope`, and retire §3 items 2 and 3.
   - The board should not move; any change exposes a path the aliasing missed.
5. **Flags by id (risky).** One sub-step per commit:
   - a: switch the keys (§3 item 1)
   - b: seal → OPTIMIZED (item 4)
   - c: `late_squeezed` (item 5)
   - d: hoist `transfer_flags` (item 6)
   - e: `same = out.id == n.id`, terser's `opt === node` (index.js 506)
   - f: the `drop_unused` flag path (item 7)
6. **`fixed` by id**, plus the rebuild notification. Flip `hoist.rs` 231.
7. **Cleanup.**
   - Retire the `set_parent` juggling.
   - Re-key `pending_vars`, `pre_tighten` and `injected`.
   - Optionally: Defun copy-not-clone, and dynamic MANGLED.

**Riskiest points.**
- **5e.** Every optimizer that terser runs in place becomes SQUEEZED, so its new children are no longer revisited.
- **5f.** A node wrongly classified as keep inside `tighten_body`/`drop_unused` silently skips optimization. One wrongly classified as new is optimized twice.
- **Step 2 spans.** A keep site that took another node's span changes comment output.

When a flip makes cases fail, compare those cases with terser. Fix the misclassified site, or the optimizer that relied on being run again, rather than reverting the flip.

## 5. Performance

- **Ids are cheap.** Minting is one increment, and 4 bytes on a Node of roughly 300 bytes is noise.
- **Faster lookups.**
  - `is_sealed` is a linear scan that runs up to three times per `transform`, which is quadratic on large bundles. Retiring it should be the biggest speed gain.
  - Replace the SipHash `HashSet<usize>` sets with a dense `Vec<u8>` per id or an identity-hashed `IdMap`/`IdSet`. A local `BuildHasherDefault` is enough; rustc-hash is not in `Cargo.lock`.
- **Memory.** The keep-alives hold every flagged version of every node for the whole pass. Removing them lowers peak memory on large inputs.
- **Measurement.** Time `python3 tools/rollup-check.py` after steps 1, 4 and 5a.

## 6. Progress

Steps 1-4 are in. The board did not move at any step (2362/2671 and lwc 319/339 before the merge of the triage fixes, 2381/2671 and 332/339 after), and lwc-rollup under 200 KB stayed at its expected failures (2 of 260, then 0 of 260 after the merge). The full lwc-rollup run (779 inputs) failed the same 299 at the same byte before and after step 2, apart from 60 s timeouts under machine load.

**What is where.**
- `ast`: `NodeId`, `Node::{new, spanned, make, rebuild, id}`, `deep_clone_with`, `check_ids`, `reset_ids` (called first in `terser::minify`), `ids_minted`. `Node` is not `Clone`. `for_each_child` is `ast::transform_children`, which the walker refactor had already added; only four `map_children` walks that threw the result away were left, and they use it now.
- Debug checks: `rebuild` asserts its data does not hold the node itself; `compress_pass` runs `check_ids` on the tree after `transform` and after `drop_unused`. Debug builds (the fast profile) panic on a report, `TERSER_CHECK_IDS=log` prints in any build, `=off` skips. No site ever reported.
- Classification: each file's helpers split into a new / keep pair (`eval::atom` / `eval::edit`, `node` / `renode`, `finish` / `edit` in hoist, `for_node` vs `eval::edit` in loops). Each keep site cites terser. Copy sites are marked (`sym_ref` in tighten, the dropped-`var` ref in drop_unused, `same_def`, `new` to call, `while` to `for`).
- Shadow audit (`compress/src/audit.rs`, `TERSER_ID_AUDIT=1`, `bt:<decision>` for where a mismatch is read): `Cx.squeezed_ids` / `optimized_ids` beside the pointer sets. The harness now names each case's thread after the case, so the audit lines and panics say which case.
- `SymTable` by id: `node_def`, `node_scope`, `references`, `fixed_of_node`, eval's `MANGLED` / `KNOWN`. `def_of(&N)` / `scope_of(&N)` replace `lookup(&ptr)` / `scope_lookup(&ptr)`. `copy_binding` and `clone_deep` stand for terser's copies. §3 items 2 and 3 are retired: `alias`, `alias_scope`, `alias_copy`, `alias_scope_node`, the hoisted-scope copy, both halves of `transfer_flags`' table work, `keep_squeezed`'s scope alias, the scope half of `retarget_fixed`, `define_hoisted`'s keep-alive. `same_def` is now just `copy_binding`. `inlined_scopes` was already keyed by scope index.

**Corrections to §2.** The inventory was right in most places; these differ:
- `optimize_if`: the `if` is keep only until the nested-`if` merge (`self = make_node(AST_If, ..)`, index.js 1206); after it the remaining edits apply to a new node.
- `strip_var_inits` (`remove_initializers`): a definition with a plain name is keep (`def.value = null`, tb 180); a destructuring gives new definitions and the `var` is new.
- keep sites §2 did not list: the template joins in `plus_strings` (terser returns the edited template), the statement around a negated IIFE, `drop_empty_string`'s third case, the bitwise in-place edits, `fold_compare`'s final rewrite, `changed_sub` (`self.property =`), `if_break_in_loop`'s `for`, the `try` that drops its `finally`, every switch branch (`arm_node`) and the switch itself (`switch_node`, including the re-optimized one after the default is folded), `func_with_params` (drop_unused trims `argnames`, du 269), the conditional's `optimize_sequence`, `bool_tail_to_one`, tighten's `drop_unmentioned` / `sweep_duplicate_vars` (port-only filters), `syms::drop_replaced`.
- `sequence.rs` `trim`: keep only when it optimizes an existing sequence (`preserve`); from `make_and_optimize` the sequence is new.
- `lib.rs` `join_vars` used `Rc::make_mut`, which needs `Node: Clone`; it rebuilds now.
- Copies the design did not name: `same_def` (call.rs) must `copy_binding` or the audit loses the injected `var`s' definitions (it did, 442 lookups in 44 cases, until fixed); the Defun-to-Function `expr_value` copy keeps the clone's scope.

**Spans.** No keep site changed span (each keep site's span argument was the edited node, and the board confirms). Existing differences from terser's spans, flagged for review, not changed: `optimize_if`'s nested-`if` `&&` and dead-code statements (span `n`, terser `self.condition`), `fold_compare`'s new `null` / `void 0` (span `n`, terser the replaced operand), `reassoc_lazy`'s inner binaries (span `n`, terser `self.left`), `and_cond` in `if_break` (`n` vs `self.condition`), `optimize_do`'s statement and block (`n` vs `self.condition` / `self.body`), `remove_candidate`'s `void 0` (`n` vs `node.value`), and `join_object_assignments`' joined value (spanned on the value, terser on the property, and terser clones both operands).

**Shadow audit results** (after the merge; compress + lwc board, and lwc-rollup under 200 KB in brackets). Counts are decisions where the pointer answer and the id answer differ; `@redescend` is the descend after `drop_unused`.

| decision | pointer / id | count | cases | main node types | terser |
| --- | --- | --- | --- | --- | --- |
| `same` | not same / same | 2483 [656] | 719 [29] | Binary 1536, SimpleStatement, Sequence, Switch | `opt === node` (index.js 506): an optimizer that edits in place returns `self`, which becomes SQUEEZED; the port's rebuild is a new pointer, so it is not, and the node is walked again |
| `skip_optimize` | run / skip | 4845 [1133] | 794 [29] | UnaryPrefix 3107, Case 509, Binary, Function | `def_optimize` skips an OPTIMIZED node; a rebuild (same id) of a node already optimized loses the pointer flag, so its optimizer runs again |
| `entry`, `already` | not flagged / flagged | 859 / 818 [224 / 223] | ~170 [6] | Case 509, Function, Return, VarDef | mostly the switch: its branches were SQUEEZED, the optimizer edits their bodies (keep), the switch is walked again (see `same`) and the branches are new pointers |
| `entry@redescend` | squeezed / not | 4438 [12251] | 1756 [175] | SimpleStatement 4074, Return | `mark_tree_squeezed` squeezes everything before `drop_unused`; terser's statements made by `tighten_body` (`sequencesize`, `make_node(AST_SimpleStatement)`) carry no flag and get `before` again in the descend after `drop_unused` |
| `*@redescend` | not flagged / flagged | ~170 | 35 [1] | Call, Binary, Dot | nodes `drop_unused` rebuilt by a shape the pairing in `transfer_flags` did not match |
| `callee_processed` | not / processed | 12 [1] | 12 | Function | call.rs `trim_unused`'s "the callee was already optimized" (UNUSED flags) |

The flag audit is the input for step 5: 5e (`same` by id) and 5a (OPTIMIZED by id) account for the `same` / `skip_optimize` / `entry` rows, 5f for `entry@redescend`.

Before step 4, the audit also compared definition and scope lookups; it found pointer-alias bugs that step 4 removed:
- a `Block`'s scope given to the node that replaced it (the scope half of `retarget_fixed`, for any `out` of a scope's `transform`): `SimpleStatement`, `If`, `Return`, `Throw`, `Var` nodes "had" a scope;
- rebuilt functions whose pointer alias was missed (`Function` scope found by id only, 57 cases);
- in `bundles/lodash`, a `Defun` whose pointer lookup found a different scope than its id: `node_scope` held pointers of freed nodes, so a new node at a reused address inherited a stale scope.
None of these changed the board when step 4 removed them.

**Steps 5-7 (flags by id, `fixed` by id, cleanup).** Each sub-step is one commit with 0 newly failing on the board and 0 of 260 lwc-rollup inputs under 200 KB failing. The board went from 2382/2671 and lwc 332/339 to 2394 and 332 at 5a (+12), then, with two merges of the triage branch in between, to 2418/2671 and lwc 338/339 (+1 lwc at 5f).

- **5a, keys.** `squeezed`, `optimized`, the sealed sets, `fresh`, `late_squeezed`, `pre_tighten` and `pending_vars` are keyed by id; `flag_keep`, `seal_keep` and every keep-alive are gone, `is_sealed` is a set lookup. The flip made 3 cases fail at first (and `functions/issue_2657` lost a `var`: with no keep-alives a freed statement's address was reused, so `pending_vars` spliced the `var` after a call argument). Each cause was a port optimizer that relied on being re-run, fixed to do what terser does:
  - flatten copies its expressions (`expressions.map(exp => exp.clone(true))`, inline.js 673), so the next descend optimizes them again;
  - a reference keeps the scope it was bound in (`SymTable.ref_scope`, terser's `self.scope`), so a reference flatten moved out of its function still counts as being in that function for single-use inlining (`properties/issue_3188_*`, `reduce_vars/issue_2799_1`);
  - an inlined declaration is copied at its top only (`make_node(AST_Function, fixed, fixed)`, il 247-250), so its body keeps its flags; a self-recursive one is still copied whole (terser rebinds its inner references);
  - `can_inject_symbols` refuses under a reference whose fixed value is a scope (`scope instanceof AST_SymbolRef`) and skips the lambda a `fixed.optimize()` is tightening, which is not on terser's stack (`issue_2657`);
  - the switch builds its `if` from blocks (`make_node(AST_BlockStatement, branch, ..)`) and optimizes it where it is made; `stmt_kind` no longer looks into a one-statement block (terser's `AST_If` sees the block); the port-only statement joins for switch blocks (`lib.rs` `tighten` and its helpers) are gone;
  - a concise method's key is lifted before it becomes an arrow property.
- **5b.** `sealed` and the switch's `seal` set are plain `OPTIMIZED` (`Cx::set_optimized`).
- **5c.** `late_squeezed` / `keep_squeezed` are gone: the function `process_expression` rebuilds keeps its id.
- **5d.** No `transfer_flags` after hoist. Its `fixed` retargeting is `follow_rebuilt`, which pairs old and new nodes by id.
- **5e.** `same = out.id() == n.id()` (`opt === node`), and the scope is squeezed after its `drop_unused` descend only when it is `same`. One optimizer relied on being re-run: the lazy-operator reassociation now optimizes each left operand it builds (`Cx::transformed`, terser's `self.transform(compressor)`; `conditionals/ifs_5`).
- **5f.** No `mark_tree_squeezed`, `transfer_flags`, `fresh` or `made_fresh`: `drop_unused` and collapse edit in place, the descend after `drop_unused` walks what is not SQUEEZED. Then the block optimizer no longer empties a block of pure declarations (terser leaves that to `drop_unused`; R6a).
- **6.** `retarget_fixed` and hoist_props' `fixed_value() === node.value` compare ids; `follow_rebuilt` retargets every rebuilt tracked node after `hoist` and `drop_unused`.
- **7.** The flag audit is retired (`audit.rs`, `TERSER_ID_AUDIT`): with no carry-over left its id sets were the deciding sets. `Cx.injected` is keyed by `ScopeKey` (no `1 << 60`), `foreign_lambda` by id (the pointer was taken before `hoist`), and the parent checks against the walker's stacks compare ids.

**Audit counts** (board + lwc board; lwc-rollup under 200 KB in brackets), mismatches between the deciding flags and the id flags set only where terser sets them:

| decision | before 5a | after 5a | after 5f |
| --- | --- | --- | --- |
| `same` | 6736 [1799] | 5955 [1731] | (5e: by id) |
| `skip_optimize` (+`@redescend`) | 6556 [1263] | 0 [0] | 0 [0] |
| `already` (+`@redescend`) | 1867 [353] | 0 [0] | 0 [0] |
| `entry` | 1876 [279] | 16 [6] | 0 [0] |
| `entry@redescend` | 4793 [12359] | 4404 [12251] | 0 [0] |
| `callee_processed` | 16 [1] | 0 [0] | 0 [0] |

After 5a the remaining `entry` rows were the carry-overs (`late_squeezed`, `mark_tree_squeezed`); 5c-5f removed them. The counts are higher than step 3's because the triage fixes merged in between added cases.

**Not done.**
- The `set_parent` / `Cx.stack` swap stays. The parent checks compare ids now, but a child that the first descend replaced (a new id) is only in the once-rebuilt parent, so the stack top must be that version for the second descend. Dropping the swap left the board and lwc-rollup under 200 KB unchanged, but it is the less faithful choice, so it was not kept.
- `scope_cache` stays pointer-keyed (a content cache), and so do drop_unused's `Use` maps and tighten's local maps.
- R6b (`!function(){..}(0,i.f)` vs `(i.f)`) is not a flag case: the port's call optimizer drops an IIFE's unused parameters (`trim_unused`'s `iife_drops_params`), terser leaves that to `drop_unused` (du 262-285) and the call only replaces the unused argument by `0`. Moving it breaks 18 board cases, because the port's `drop_unused` does not trim parameters at all yet.
- A top-only copy shares its children with the declaration until `drop_unused` drops it (terser shares the objects). If the declaration stays, `check_ids` reports the shared ids: that is how `class A{static x=f()}A.v=1` showed up before R13 stopped inlining a class with side effects, as terser does. The check is a detector for such a divergence, not a bug in the copy.

**Timing.** User CPU of the release `try` over the 478 lwc-rollup inputs up to 400 KB, two interleaved rounds each, on a machine shared with other agents (so about ±5%):

| build | first run | second run |
| --- | --- | --- |
| before the ids (2ec202c) | 150.1 s | |
| step 2 (ids minted, nothing reads them) | 148.7 s | |
| upstream after the triage fixes (64620ca) | | 198.0 s |
| merge + step 3 (audit off) | 177.5 s | 200.9 s |
| step 4 (SymTable by id, SipHash) | 184.2 s | 186.5 s |
| step 4 with the identity-hashed `IdMap` / `IdSet` | | 189.8 s |

The ids cost nothing measurable, and neither does keying the table by id. The jump between the first two rows and the rest is the merged triage fixes, not the ids (the second run had a load average near 25 on 4 cores, hence the higher absolute numbers).

Steps 5-7, the same measurement against the start of step 5 (0034061), each pair run interleaved (load average near 30, so the pairs are comparable with each other but not with the rows above):

| build | user CPU |
| --- | --- |
| 0034061 / after 5a | 196.2 s / 198.1 s |
| 0034061 / after step 7 (two merges of the triage branch included) | 182.5 s / 177.1 s |

Keying the flags by id and dropping `is_sealed`'s scan bought no measurable time at 5a; by the end the run is about 3% faster, within the noise of this machine. The keep-alives were the memory cost: peak RSS on the largest input (`inputLocation`, 2.2 MB) went from 282 MB to 181 MB, user CPU 20.3 s to 19.1 s. The full lwc-rollup check (779 inputs) took 18.0 min user CPU at the end and fails the same 297.
