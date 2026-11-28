#!/bin/bash
# tools/rollup-diff.sh <input.js> [mangle] : first difference under the lwc-rollup options.
# Mangling is off unless the second argument is "mangle". Needs the release `try`:
#   cargo build --release -p terser --example try
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/tools/.out"; mkdir -p "$OUT"
M=false; [ "$2" = mangle ] && M=true
O="{\"compress\":true,\"mangle\":$M,\"sourceMap\":false,\"format\":{\"wrap_func_args\":false},\"module\":true}"
node "$ROOT/tools/terser.mjs" "$O" < "$1" > "$OUT/e.txt"
"$ROOT/target/release/examples/try" "$O" < "$1" > "$OUT/a.txt" 2>&1
python3 - "$OUT" <<'PY'
import sys
d=sys.argv[1]
e=open(d+'/e.txt').read().strip(); a=open(d+'/a.txt').read().strip()
if e==a: print("SAME"); raise SystemExit
i=next((k for k in range(min(len(e),len(a))) if e[k]!=a[k]), min(len(e),len(a)))
print(len(e),len(a),"at",i); print("E:",e[max(0,i-200):i+200]); print("A:",a[max(0,i-200):i+200])
PY
