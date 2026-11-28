# tools/rollup-check.py [MAXSIZE] : release `try` on every lwc-rollup input up to MAXSIZE bytes vs the expected output; lists failures by size.
import json, glob, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
O='{"compress":true,"mangle":true,"sourceMap":false,"format":{"wrap_func_args":false},"module":true}'
import pathlib; ROOT=str(pathlib.Path(__file__).resolve().parent.parent); root=ROOT+'/harness'
maxsize=int(sys.argv[1]) if len(sys.argv)>1 else 60000
jobs=[]
for exp in glob.glob(root+'/expected/lwc-rollup/**/*.json', recursive=True):
    rel=os.path.relpath(exp, root+'/expected/lwc-rollup')[:-5]
    inp=root+'/corpus/lwc-rollup/inputs/'+rel+'.js'
    if not os.path.exists(inp): continue
    sz=os.path.getsize(inp)
    if sz>maxsize: continue
    jobs.append((sz,rel,inp,exp))
def run(j):
    sz,rel,inp,exp=j
    e=json.load(open(exp))['sets']['lwc-rollup']
    if e.get('kind')!='code': return None
    try:
        r=subprocess.run([ROOT+'/target/release/examples/try',O],stdin=open(inp,'rb'),capture_output=True,timeout=60)
    except subprocess.TimeoutExpired:
        return (sz,rel,'timeout')
    a=r.stdout.decode('utf8','replace')
    if a.endswith('\n'): a=a[:-1]
    if a==e['code']: return None
    ec=e['code']; i=next((k for k in range(min(len(ec),len(a))) if ec[k]!=a[k]), min(len(ec),len(a)))
    return (sz,rel,i)
with ThreadPoolExecutor(8) as ex:
    res=[r for r in ex.map(run, jobs) if r]
res.sort()
print(len(jobs),'checked',len(res),'failing')
for r in res[:40]: print(r)
