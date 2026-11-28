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
# Round 2 (compress/TRIAGE.md "Round 2")
r R1-negation-size-in 'f(p=>!(p in H)&&!(p in A))'
r R2a-block-let-blocks-collapse 'export function b(C){var _a;return _a=function(n){g(n)},_a.o=1,_a}
{let n=1;h(n)}'
r R2b-block-const-in-dead-fn-blocks-flatten 'function f(a){if(a){const m=g();h(m)}}
function rc(C,m){if(q(C))s(C,m);return C}
export const x=rc(r,{t:1});'
r R2c-block-const-blocks-flatten-arrow 'function f(a){if(a){const index=a.i;g(index)}}
const gm=index=>n=>r[index];const getName=gm(2);export const x=n=>getName(n);'
r R2d-top-block-const-blocks-flatten '{const m=g();h(m)}
function rc(C,m){if(q(C))s(C,m);return C}
export const x=rc(r,{t:1});'
r R2e-const-in-dead-fn-blocks-collapse-after-flatten 'function isF(o){return typeof o==="function"}
function sv(vm){const Ctor=vm.c;g(Ctor)}
function rc(Ctor,m){if(isF(Ctor)){k(Ctor);s(Ctor,m)}return Ctor}
class cB{}
rd(cB);
const x=rc(cB,{t:1})'
r R2f-class-value-collapse-after-flatten 'function isF(o){return typeof o==="function"}
function rc(Ctor,m){if(isF(Ctor)){k(Ctor);s(Ctor,m)}return Ctor}
class cB{a(){}}
rc(cB,{t:1});'
r R3a-switch-case-on-const-object 'const u={S:1};export function a(x){switch(x){case u.S:return 1;case u.Y:default:return 2}}'
r R3b-dot-on-const-object-kept 'export function f(c){const al={h:c.h};if(c.a){if(al.h===L){}else if(al.h===R){}}return al}'
r R4-host-of-flatten-not-inlined 'function rf(f,t){f.on(e=>t.d(e))}function mn(n){let m;rf(m,n)}function pm(r){const mr=n=>{const m=mn(n);g(m)};mr(r)}export function pt(){q.forEach(n=>pm(n))}'
r R5-const-string-inlined-into-copy 'const S="position: absolute; width: 1px";function pt(r){ge(r)}function ge(r){let e=M.get(r);if(!e){m.s("style",S)}}export function pq(){M.forEach((t,r)=>pt(r,t))}'
r R6a-reoptimized-after-drop-unused 'export function s(){if(F){g()}else{const t=this}}'
r R6b-reoptimized-then-flattened 'function ra(e,a){if(l){return}b.push(l);const m=b.join("")}export function mf(e,i){ra(e,i.f)}'
r R6c-inlined-class-body-reoptimized 'class A{f(r){for(;;){const[n,{p}]=S;if(v){let m=g(r);if(m){const k=x(v);p(m,k,n)}}}}}const c=rc(A);'
r R7a-hoist-props-symbol-values 'import l from "x";const i18n={a:l};export function b(){return i18n.a+i18n.a}'
r R7b-hoist-props-param-values 'export function s(x,y){const p={x:x,y:y};x=p.x+1;y=p.y-1;g(x,y)}'
r R8-or-chain-not-reassociated 'export function h(){if(a)return;if(!b)c?d:e()}'
r R8b-or-chain-in-sequence 'export function m(){x();if(a)return;b||c()}'
r R9-fn-not-inlined-into-constructor 'function tk(value){const tv=[..."Gy"];const tokens=[];let esc=false;[...value].forEach(char=>{const t=tv.indexOf(char)>=0?char:undefined;if(t!==undefined&&!esc){if(tokens.length>0){let l=tokens[0].length;l=l===undefined?1:l+1}}})}function ge(p,d,c){const tokens=tk(p);for(let i=0;i<tokens.length;i++){}}class D{constructor(o){this.expr=ge(this.p,this.d,this.c)}}export function g(o){cache.set(o,new D(o))}'
r R10-recursive-local-defun-not-inlined 'export function e(el,t){function h(){el.r("m",h)}if(!t){el.a("m",h)}}'
r R11-const-not-collapsed-in-copy 'function co({items:t,c:w}){const a=t.reduce((s,i)=>s+i.w,0);if(a<=w||w<=0){return{v:t}}for(let i=0;i<n;i++){const it=t[i];if(x.v===it.v){}else{}}}export function r(){const o=co({items:this.a})}'
r R11b-block-let-shadows-arrow-param 'export function co(t,w){const a=t.reduce(i=>i);if(a<=w)return 1;{let i=g();h(i)}}'
r R12-unused-arg-placeholder 'function pt(r){ge(r)}function ge(r){h()}export function pq(){m.forEach((t,r)=>pt(r,t))}'
r R13-unused-class-prop-assign 'class A{}A.v=1;'
r R14-void-const-not-collapsed 'function tk(v){let esc=false;v.forEach(c=>{if(!esc)h()})}function ge(p){const t=tk(p);g(t)}export function g(o){x=ge(o)}'
echo "$same same, $diff differ"
