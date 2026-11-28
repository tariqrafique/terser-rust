#!/bin/bash
# repros.sh [PATTERN] : the lwc-rollup triage repros (compress/TRIAGE.md), terser (T) vs the port (R),
# lwc-rollup options with mangling off. Uses target/fast/examples/try. PATTERN filters by id (grep -E).
cd "$(dirname "$0")/.."
O='{"compress":true,"mangle":false,"sourceMap":false,"format":{"wrap_func_args":false},"module":true}'
PAT="${1:-.}"
same=0; diff=0
r(){
  echo "$1" | grep -qE "$PAT" || return 0
  T="$(printf '%s' "$2" | node tools/terser.mjs "$O")"
  R="$(printf '%s' "$2" | target/fast/examples/try "$O")"
  if [ "$T" = "$R" ]; then same=$((same+1)); echo "SAME $1"; else diff=$((diff+1)); echo "DIFF $1"; echo "  T: $T"; echo "  R: $R"; fi
}
r C1a-inlined-flag-const 'let impl = () => { g() };
const san = () => impl();
export function shc(){ return san(); }'
r C1b-inlined-flag-defun 'function cre(e){ r(e) }
function build(){ return () => cre(1) }
export function g(){ ce = build() }'
r C2a-destructured-shadow-MISCOMPILE 'const k = 1;
export function g(v){ const { k } = v; return k; }'
r C2b-destructured-shadow-call-dropped-MISCOMPILE 'function f(){}
export function g(v){ const { f } = v; f(); }'
r C2c-destructured-blocks-inline-arg 'function isNumber(o){return typeof o==="number"}
export function i(c){ if (g(c)) { const {key} = c; if (isNumber(key)) h() } }'
r C2d-destructured-blocks-cond-assign 'export function f(o){ const {v} = o; if (v === "b") s.top = 1; else s.top = 2; }'
r C3-forof-const-array 'const qm=["a","b"];for(const q of qm)f(q);'
r C4-negation-shape 'export function p(a, b) { if (!s(a) && !(c(a) && c(b))) throw 1; }'
r C5-collapse-into-iife-args 'function q(e, o) { const d = {}; if (o.p) d.a = 1; dp(e, d); }
export function a(e, v) { if (x) { const s = v.o === 1; const p = v.t === 2; const l = v.r === 0; q(e, { p, l, s }); } }'
r C6-negate-iife-lost 'function ais(vm) { if (vm.d) return void q(vm); r(vm); }
export function ac(v, vm) { if (vm.s) { ais(vm); v.a = 1; } }'
r C7-template-concat 'w(a + `u ${p}. ` + `See`)'
r C8-flatten-blocked-by-nested-let 'function i(){}
function b(c){ return function(s){ for (let i = 0; i < n; i++); c(s) } }
export const pf = b(h => {});'
r C9-switch-empty-case-before-default 'export function f(u) { switch (u) { case 1: return 1; case 2: default: return 2; } }'
r C10-hoisted-var-order 'function gs(a){ return en(a, () => {}) }
function gp(e){ return e.t ? e.p : e }
export function cr(o){ return gs(gp(o.t)) }'
r C11-inlined-seq-not-recollapsed 'function nd(d, w){ return ns(d, w) }
function mh(v){ v = nd(v, 1); return H[v] }
export function c(o){ g(mh(o.h)) }
export function n(a){ return nd(a, 2) }'
r C12-forin-object-seq 'export function f(a){ for (var from, s = 1; s < a.length; s++) { from = Object(a[s]); for (var key in from) g(key); h(from); } }'
r C13-regexp-const-not-substituted 'const w = /a/; const t = f() || g(w);'
r C14-collapse-into-member-lhs 'let C; export function g(){ if (!C) { C = ce("x", {}); C.id = 1; } }'
r C16-unused-cond-value 'export function c(){ let w = arguments.length > 0 ? arguments[0] : g(); h(); }'
r M2-decl-dropped-MISCOMPILE 'export function e(d){ const v = d.pop(); x = v; }'
r M3-defun-dropped-MISCOMPILE 'function cre(e){ r(e) }
function build(){ return () => cre(1) }
export function g(){ ce = build() }
export function h(){ ce = build() }'
r M3b-let-dropped-MISCOMPILE 'let r = q();
function cre(e){ r(e) }
function build(){ return () => cre(1) }
export function g(){ ce = build() }'
r M3c-assign-stmt-rhs-not-scanned 'function build(){ r() } export function g(){ x = build() } export function h(){ x = build() }'
r M3d-undeclared-global-write-dropped 'x = f(); y = f()'
r M4-missing-var-MISCOMPILE 'function pt(s){ return s && p(s) }
function gi(d){ return d.h + d.m }
export function n(v){ const r = pt(v); if (!r) return 0; return { i: gi(r) } }'
r M4b-var-read-only-in-object-dropped 'export function n(v){ var r = g(v), d; return {i: (d=r,d.h)} }'
r M2b-decl-dropped-in-block 'export function e(d){ if (d) { const v = d.pop(); x = v; } }'
echo "$same same, $diff differ"
