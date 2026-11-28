#!/bin/bash
# tools/trace-diff.sh <input.js> ['<options JSON>'] [--opt] [--all] [-C N]
# Trace the compressor decisions of terser and of the port on one input and print
# the first divergent decision. Options default to lwc-rollup with mangle off.
#   --opt  also trace every def_optimize result (chatty, slow on big inputs)
#   --all  also compare candidates and single-use reads that changed nothing
#   -C N   events of context (default 4)
# Logs: tools/.out/trace-terser.jsonl, tools/.out/trace-port.jsonl.
# The port binary is the newer of target/release/examples/try and target/fast/examples/try.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/tools/.out"; mkdir -p "$OUT"
IN="$1"; shift
[ -f "$IN" ] || { echo "usage: tools/trace-diff.sh <input.js> ['<opts JSON>'] [--opt] [--all] [-C N]" >&2; exit 2; }
O='{"compress":true,"mangle":false,"sourceMap":false,"format":{"wrap_func_args":false},"module":true}'
case "$1" in "{"*) O="$1"; shift ;; esac
OPT=""; PYARGS=()
while [ $# -gt 0 ]; do
    case "$1" in
        --opt) OPT=1 ;;
        --all) PYARGS+=(--all) ;;
        -C) PYARGS+=(-C "$2"); shift ;;
        *) echo "unknown argument $1" >&2; exit 2 ;;
    esac
    shift
done
"$ROOT/tools/trace/setup.sh" || exit 1
TRY="$ROOT/target/release/examples/try"
FAST="$ROOT/target/fast/examples/try"
if [ ! -x "$TRY" ] || { [ -x "$FAST" ] && [ "$FAST" -nt "$TRY" ]; }; then TRY="$FAST"; fi
[ -x "$TRY" ] || { echo "build try first: cargo build --profile fast -p terser --example try" >&2; exit 1; }
T="$OUT/trace-terser.jsonl"; P="$OUT/trace-port.jsonl"
rm -f "$T" "$P"
TERSER_TRACE="$T" TERSER_TRACE_OPT="$OPT" node "$ROOT/tools/trace/terser-trace.mjs" "$O" < "$IN" > "$OUT/trace-terser.js"
TERSER_TRACE="$P" TERSER_TRACE_OPT="$OPT" "$TRY" "$O" < "$IN" > "$OUT/trace-port.js" 2>&1
touch "$T" "$P"
if cmp -s "$OUT/trace-terser.js" "$OUT/trace-port.js"; then
    echo "output: SAME ($(wc -c < "$OUT/trace-terser.js") bytes), port ${TRY#$ROOT/}"
else
    echo "output: DIFFERENT (terser $(wc -c < "$OUT/trace-terser.js"), port $(wc -c < "$OUT/trace-port.js") bytes), port ${TRY#$ROOT/}"
fi
python3 "$ROOT/tools/trace/diff.py" "$T" "$P" "${PYARGS[@]}"
