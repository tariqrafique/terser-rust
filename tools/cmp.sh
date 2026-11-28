#!/bin/bash
# tools/cmp.sh '<js>' ['<options JSON>'] : terser (T) vs the Rust port (R), fast build of `try`.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "T: $(printf '%s' "$1" | node tools/terser.mjs "$2")"
echo "R: $(printf '%s' "$1" | ./target/fast/examples/try "$2")"
