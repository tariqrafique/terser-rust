#!/bin/bash
# repros.sh [PATTERN] : the lwc-rollup triage repros (compress/TRIAGE.md), terser (T) vs the port (R),
# lwc-rollup options with mangling off (rm_ entries: on). Uses target/fast/examples/try. PATTERN filters by id (grep -E).
cd "$(dirname "$0")/.."
O='{"compress":true,"mangle":false,"sourceMap":false,"format":{"wrap_func_args":false},"module":true}'
PAT="${1:-.}"
same=0; diff=0
r(){
  echo "$1" | grep -qE "$PAT" || return 0
  local o="${3:-$O}"
  T="$(printf '%s' "$2" | node tools/terser.mjs "$o")"
  R="$(printf '%s' "$2" | target/fast/examples/try "$o")"
  if [ "$T" = "$R" ]; then same=$((same+1)); echo "SAME $1"; else diff=$((diff+1)); echo "DIFF $1"; echo "  T: $T"; echo "  R: $R"; fi
}
# rm_: the same with mangling on (the full lwc-rollup options), for decisions that use mangled sizes.
M='{"compress":true,"mangle":true,"sourceMap":false,"format":{"wrap_func_args":false},"module":true}'
rm_(){ r "$1" "$2" "$M"; }
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
r R2g-outer-flatten-vars-block-inner-flatten 'function ae(t,type,cb){t.addEventListener(type,cb)}
function re(t,type,cb){t.removeEventListener(type,cb)}
export function rp(elm,tok,l){ae(elm,tok,l);return()=>re(elm,tok,l)}'
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
# Round 3 (compress/TRIAGE.md "Round 3"); T1a needs mangling on.
rm_ T1a-eval-through-const-mangled 'export function gt(d){const MINUTE=6e4;return [MINUTE*60, MINUTE, MINUTE]}'
r T1b-eval-compare-through-var 'var ff="Large";export function a(){return ff==="Large"}export function b(){return g(ff)}export function c(){return h(ff)}'
r T2a-injected-name-blocks-collapse 'function gt(name){return P.g(name)}export const gb=c=>gt(c);export const cs=n=>{const a=gc(n);const name=gn(n);return[a,name]};'
r T2b-injected-name-blocks-collapse-object 'function il(lo){return n(lo)&&m(lo)}export function v(){const k=il(this.lo)}export const gc=r=>{const lo=r.f.v;const la=r.f.w;return{lo,la}};'
r T3-compound-assign-fixed-value 'export function e(){let m=1;m+=2;f(m)}'
r T4-flatten-blocked-by-copied-method-param 'var name=1;function ca($A){return{t(name){return $A.t(name)}}}function gd(){return ca(w.$A)}let P=gd();export{P,name}'
r T5a-recursive-defun-copy-reoptimized 'export function p(d){function b(c){if(c){const f=g(b)}}h(b)}'
r T5b-recursive-defun-copy-negated 'function cd(){if(a){const p=g();if(p){h(cd)}}}var pu=cd();'
r T6-dead-outer-name-vs-lambda-param-collapse 'function gd(l="e",o={}){c.get(l).has(o)}export function df(p){const o=p||{};return v=>{const f=gd(s,p);return f(v)}}'
r T7a-copy-of-copy-ref-count 'function fl(s){g(arguments)}export function h(l){return fm(l,x,u)}function fm(l,v,u){return ff(v,u)}function ff(v,u){const a=m(v);const lb=v?"x":"y";return fl(lb,a)}'
r T7b-copy-stale-ref-count 'function gm(n){const o=s[n];if(!o){}return o}export function go(c){return gm(c)}'
r T8-arguments-value-not-collapsed 'export function c(){let cfg=arguments[0];p(cfg)}'
r T9-reassoc-left-negated 'function ck(p){if(p.n&&!H)return!1;if(p.m&&!T)return!1;if(A)return!1;return C}export function k(x){return ck(x)}'
r T10-template-value-not-collapsed 'export function f(u){const r=`a${u}`;return new R(r,1)}'
r T11-hoist-props-nested-object 'const AG={a:{G:1}};export function ga(){return P(AG.a.G)}'
echo "$same same, $diff differ"
