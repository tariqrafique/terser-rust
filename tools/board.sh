#!/bin/bash
# tools/board.sh [N] : build the fast harness and `try`, run the default board against the saved baseline.
# Save a new baseline after a verified improvement: ./target/fast/harness board --set default --save-baseline
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
cargo build --profile fast -p harness 2>&1 | grep -E "^error" -A8
cargo build --profile fast -p terser --example try 2>&1 | grep -E "^error" -A8
./target/fast/harness board --set default --compare 2>&1 | grep -E "pass/total|newly|FAIL default" -A4 | grep -v "pass default" | head -"${1:-30}"
