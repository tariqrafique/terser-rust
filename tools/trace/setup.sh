#!/bin/bash
# tools/trace/setup.sh : instrumented copy of the terser oracle in tools/.cache/terser-trace.
# oracle/node_modules/terser is copied, never edited; its dependencies are symlinked.
# A re-run is a no-op unless patch.mjs or the oracle changed (FORCE=1 rebuilds).
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NM="$ROOT/oracle/node_modules"
if [ ! -d "$NM/terser" ]; then
    # A worktree without its own oracle install: use the main checkout's.
    COMMON="$(git -C "$ROOT" rev-parse --path-format=absolute --git-common-dir)"
    NM="$(dirname "$COMMON")/oracle/node_modules"
fi
[ -d "$NM/terser" ] || { echo "no oracle/node_modules/terser (cd oracle && npm ci)" >&2; exit 1; }
DEST="$ROOT/tools/.cache/terser-trace/node_modules"
STAMP="$DEST/.stamp"
WANT="$(cat "$ROOT/tools/trace/patch.mjs" "$NM/terser/package.json" | sha1sum | cut -c1-40)"
if [ -z "$FORCE" ] && [ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$WANT" ]; then exit 0; fi
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R "$NM/terser" "$DEST/terser"
for dep in @jridgewell acorn commander source-map source-map-support buffer-from; do
    if [ -e "$NM/$dep" ]; then ln -s "$NM/$dep" "$DEST/$dep"; fi
done
node "$ROOT/tools/trace/patch.mjs" "$DEST/terser"
echo "$WANT" > "$STAMP"
echo "instrumented terser in $DEST/terser" >&2
