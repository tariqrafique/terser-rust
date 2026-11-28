# Stable node ids: design

This is the design for PLAN.md's "Stable node ids" step.
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
