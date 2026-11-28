#!/usr/bin/env python3
"""tools/trace/diff.py TERSER.jsonl PORT.jsonl [--all] [-C N]

First divergent compressor decision between two trace logs (see tools/README.md,
"Trace diff").

By default the compared decisions are the ones that changed the tree: collapses
that replaced something, inlines that produced a value, inlined calls, pass
starts and (when traced) optimize results. drop_unused events are checkpoints:
they compare by the scope as drop_unused left it, so a `var` the port already
removed in collapse still agrees with terser removing it in drop_unused, and a
run that changed nothing may be skipped when only one side has it.

--all also compares the candidates and single-use reads that changed nothing.
The two sides filter candidates differently, so expect noise there.
"""
import difflib
import signal
import json
import sys
from collections import Counter

KINDS = ("pass", "collapse", "inline", "inline_call", "drop_unused", "opt")


def load(path):
    out = []
    with open(path, encoding="utf-8") as f:
        for line_no, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                ev = json.loads(line)
            except json.JSONDecodeError:
                ev = {"k": "bad_line", "text": line[:200]}
            ev["_line"] = line_no
            out.append(ev)
    return out


def kept(ev, everything):
    k = ev.get("k")
    if everything:
        return True
    if k == "collapse":
        return bool(ev.get("ok")) and (ev.get("replaced") or 0) > 0
    if k == "inline":
        return ev.get("out") is not None
    return True


def skippable(ev):
    """A checkpoint that changed nothing: missing on the other side is no divergence."""
    return ev.get("k") == "drop_unused" and ev.get("out") == "="


def key(ev, everything):
    k = ev.get("k")
    if k == "pass":
        return (k, ev.get("n"))
    if k == "collapse":
        return (k, ev.get("cand"), bool(ev.get("ok")), (ev.get("replaced") or 0) > 0)
    if k == "inline":
        return (k, ev.get("name"), ev.get("out")) + ((bool(ev.get("single")),) if everything else ())
    if k == "inline_call":
        return (k, ev.get("how"), ev.get("call"), ev.get("out"))
    if k == "drop_unused":
        out = ev.get("out")
        return (k, ev.get("code") if out == "=" else out)
    if k == "opt":
        return (k, ev.get("code"), ev.get("out"))
    return (k, json.dumps({a: b for a, b in ev.items() if a != "_line"}, sort_keys=True))


def show(ev):
    k = ev.get("k")
    extra = {a: b for a, b in ev.items() if a not in ("k", "_line")}
    if k == "pass":
        return f"pass {ev.get('n')}"
    if k == "collapse":
        head = f"collapse {ev.get('cand')}"
        extra.pop("cand", None)
    elif k == "inline":
        head = f"inline {ev.get('name')} -> {ev.get('out')}"
        extra.pop("name", None)
        extra.pop("out", None)
    elif k == "inline_call":
        return f"inline_call {ev.get('how')}: {ev.get('call')} -> {ev.get('out')}"
    elif k in ("drop_unused", "opt"):
        out = ev.get("out")
        return f"{k} {ev.get('t')}: {ev.get('code')}" + ("  (unchanged)" if out == "=" else f"\n{'':14}-> {out}")
    else:
        head = k
    tail = " ".join(f"{a}={json.dumps(b, ensure_ascii=False)}" for a, b in extra.items())
    return head + (f"  [{tail}]" if tail else "")


def counts(full, picked):
    total = Counter(e.get("k") for e in full)
    used = Counter(e.get("k") for e in picked)
    parts = []
    for k in list(KINDS) + sorted(set(total) - set(KINDS)):
        if total[k]:
            parts.append(f"{k} {used[k]}/{total[k]}" if used[k] != total[k] else f"{k} {total[k]}")
    return ", ".join(parts) or "no events"


def related(ev, full, lo, hi):
    """Events of the same candidate / symbol / call in `full[lo:hi]`, any outcome."""
    k = ev.get("k")
    field = {"collapse": "cand", "inline": "name", "inline_call": "call"}.get(k)
    if not field:
        return []
    return [e for e in full[lo:hi] if e.get("k") == k and e.get(field) == ev.get(field)]


def main():
    args = sys.argv[1:]
    everything = "--all" in args
    context = 4
    files = []
    i = 0
    while i < len(args):
        if args[i] == "-C":
            context = int(args[i + 1])
            i += 1
        elif not args[i].startswith("-"):
            files.append(args[i])
        i += 1
    t_full, p_full = load(files[0]), load(files[1])
    t = [e for e in t_full if kept(e, everything)]
    p = [e for e in p_full if kept(e, everything)]
    print(f"terser: {counts(t_full, t)}")
    print(f"port:   {counts(p_full, p)}")
    print(f"compared: {'every event (--all)' if everything else 'decisions that changed the tree, drop_unused as checkpoints'}")

    # Walk both; equal keys agree, an unmatched no-op checkpoint is skipped.
    a = b = 0
    agreed = []
    skipped = Counter()
    while a < len(t) and b < len(p):
        if key(t[a], everything) == key(p[b], everything):
            agreed.append(t[a])
            a += 1
            b += 1
        elif skippable(t[a]):
            skipped["terser"] += 1
            a += 1
        elif skippable(p[b]):
            skipped["port"] += 1
            b += 1
        else:
            break
    while a < len(t) and skippable(t[a]):
        skipped["terser"] += 1
        a += 1
    while b < len(p) and skippable(p[b]):
        skipped["port"] += 1
        b += 1
    note = ""
    if skipped:
        note = " (skipped no-op drop_unused: " + ", ".join(f"{s} {n}" for s, n in skipped.items()) + ")"
    if a == len(t) and b == len(p):
        print(f"\nno divergence: {len(agreed)} decisions agree{note}")
        return
    print(f"\nfirst divergence after {len(agreed)} agreeing decisions{note}")
    if agreed:
        print("\nlast agreeing:")
        for e in agreed[-context:]:
            print(f"  = T{e['_line']:<5} {show(e)}")
    print("\nterser next:")
    for e in t[a:a + context]:
        print(f"  T{e['_line']:<7} {show(e)}")
    if a >= len(t):
        print("  (end of log)")
    print("\nport next:")
    for e in p[b:b + context]:
        print(f"  P{e['_line']:<7} {show(e)}")
    if b >= len(p):
        print("  (end of log)")

    # The other side's view of each first divergent decision: every outcome of the
    # same candidate / symbol / call between the last agreement and a little past here.
    for name, ev, full, picked, at, tag in (
        ("terser", t[a] if a < len(t) else None, p_full, p, b, "P"),
        ("port", p[b] if b < len(p) else None, t_full, t, a, "T"),
    ):
        if ev is None:
            continue
        lo = picked[at - 1]["_line"] if at else 0
        hi = picked[at + context]["_line"] if at + context < len(picked) else len(full)
        rel = related(ev, full, lo, hi)
        if rel:
            other = "port" if name == "terser" else "terser"
            print(f"\n{other} on {name}'s next decision (all outcomes nearby):")
            for e in rel[:6]:
                print(f"  {tag}{e['_line']:<7} {show(e)}")

    # Where the two agree again (no-op checkpoints left out).
    tk = [key(e, everything) for e in t[a:] if not skippable(e)][:600]
    pk = [key(e, everything) for e in p[b:] if not skippable(e)][:600]
    ops = difflib.SequenceMatcher(None, tk, pk, autojunk=False).get_opcodes()
    if ops and ops[0][0] != "equal":
        tag, a0, a1, b0, b1 = ops[0]
        agree = ops[1][2] - ops[1][1] if len(ops) > 1 and ops[1][0] == "equal" else 0
        what = {"insert": f"port has {b1 - b0} extra", "delete": f"terser has {a1 - a0} extra",
                "replace": f"terser {a1 - a0} vs port {b1 - b0} differ"}[tag]
        print(f"\nresync: {what}, then {agree} agree")


if __name__ == "__main__":
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
