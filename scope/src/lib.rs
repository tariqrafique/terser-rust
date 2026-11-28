#![forbid(unsafe_code)]

//! Scope analysis and name mangling for the terser 5.51.4 `mangle` set.
//!
//! One `Def` is shared by every binding and reference of a name. The mangled
//! spelling is chosen after character frequency is counted on the unmangled
//! print, which is what makes the output byte-exact.

use ast::{Data, FuncKind, Key, N, Node, SymKind};
use std::collections::HashMap;
use std::rc::Rc;

const LEADING: &[u8] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
const DIGITS: &[u8] = b"0123456789";

struct Def {
    name: String,
    mangled: Option<String>,
    scope: usize,
    global: bool,
    undeclared: bool,
    export_dont: bool,
    kind: SymKind,
    funarg: bool,
}

struct Scope {
    parent: Option<usize>,
    fn_scope: usize,
    block: bool,
    func: bool,
    strict: bool,
    pinned: bool,
    has_block_defun: bool,
    vars_order: Vec<usize>,
    vars: HashMap<String, usize>,
    enclosed: Vec<usize>,
    cname: i32,
}

enum LabelEvent {
    Enter,
    Label(N),
    Leave,
}

struct Analyzer {
    scopes: Vec<Scope>,
    defs: Vec<Def>,
    node_def: HashMap<usize, usize>,
    cur: usize,
    fn_scope: usize,
    label_stack: Vec<HashMap<String, usize>>,
    label_nodes: Vec<N>,
    label_ref_nodes: Vec<N>,
    label_events: Vec<LabelEvent>,
    label_refs: HashMap<usize, usize>,
    refs: Vec<(N, usize)>,
    error: Option<ScopeError>,
    privates: Vec<String>,
    opts: MangleOptions,
}

/// terser `scope.js` `format_mangler_options`. `module` implies `toplevel`.
#[derive(Clone, Debug, Default)]
pub struct MangleOptions {
    pub toplevel: bool,
    /// terser `figure_out_scope` with `module`: the code is strict, so a function
    /// declaration in a block is bound in the block.
    pub module: bool,
}

#[derive(Clone)]
pub struct ScopeError {
    pub message: String,
    pub line: u32,
    pub col: u32,
}

pub fn mangle_map(root: &N) -> Result<(HashMap<usize, String>, HashMap<String, String>), ScopeError> {
    mangle_map_with(root, &MangleOptions::default())
}

pub fn mangle_map_with(root: &N, opts: &MangleOptions) -> Result<(HashMap<usize, String>, HashMap<String, String>), ScopeError> {
    let mut a = Analyzer::new();
    a.opts = opts.clone();
    a.scopes[0].strict = opts.module;
    a.walk(root);
    if let Some(err) = a.error.clone() {
        return Err(err);
    }
    a.resolve_refs();
    a.enclose_redefined_catches();
    // Frequency is counted on the comment-free print. The mangled result
    // still keeps license comments.
    let printed = codegen::print_without_comments(root);
    let mut freq = Freq::new();
    freq.consider(&printed, 1);
    // terser's print hook subtracts a symbol at each place it is printed; the
    // compressor can put one node at several places (collapse's `multi_replacer`).
    let mangleable: HashMap<usize, String> = a.mangleable_nodes().into_iter().collect();
    fn uses(n: &N, out: &mut HashMap<usize, usize>) {
        *out.entry(Rc::as_ptr(n) as usize).or_insert(0) += 1;
        ast::walk_children(n, &mut |c| uses(c, out));
    }
    let mut counts = HashMap::new();
    uses(root, &mut counts);
    for (ptr, name) in &mangleable {
        for _ in 0..counts.get(ptr).copied().unwrap_or(1).max(1) {
            freq.consider(name, -1);
        }
    }
    freq.sort();
    a.assign(&freq);
    let mut map = HashMap::new();
    for (ptr, id) in &a.node_def {
        if let Some(m) = a.defs[*id].mangled.clone() {
            if m != a.defs[*id].name {
                map.insert(*ptr, m);
            }
        }
    }
    let mut privates = HashMap::new();
    let mut n = -1i32;
    for name in &a.privates {
        n += 1;
        privates.insert(name.clone(), freq.get(n));
    }
    Ok((map, privates))
}

impl Analyzer {
    fn new() -> Self {
        let top = Scope {
            parent: None,
            fn_scope: 0,
            block: false,
            func: true,
            strict: false,
            pinned: false,
            has_block_defun: false,
            vars_order: Vec::new(),
            vars: HashMap::new(),
            enclosed: Vec::new(),
            cname: -1,
        };
        Self {
            scopes: vec![top],
            defs: Vec::new(),
            node_def: HashMap::new(),
            cur: 0,
            fn_scope: 0,
            label_stack: vec![HashMap::new()],
            label_nodes: Vec::new(),
            label_ref_nodes: Vec::new(),
            label_events: Vec::new(),
            label_refs: HashMap::new(),
            refs: Vec::new(),
            error: None,
            privates: Vec::new(),
            opts: MangleOptions::default(),
        }
    }

    fn note_private(&mut self, name: &str) {
        if !self.privates.iter().any(|p| p == name) {
            self.privates.push(name.to_string());
        }
    }

    fn define(&mut self, scope: usize, node: &N, name: &str, kind: SymKind) -> Result<(), ScopeError> {
        let ptr = Rc::as_ptr(node) as usize;
        if let Some(id) = self.scopes[scope].vars.get(name).copied() {
            if redeclares(&self.defs[id], kind) {
                let (line, col) = node.start.as_ref().map(|t| (t.line, t.col)).unwrap_or((1, 0));
                let err = ScopeError { message: format!("\"{name}\" is redeclared"), line, col };
                self.error = Some(err.clone());
                return Err(err);
            }
            self.node_def.insert(ptr, id);
            if scope != self.cur || self.scopes[self.cur].block {
                self.note_enclosed(self.cur, id);
            }
            return Ok(());
        }
        let id = self.defs.len();
        let global = self.scopes[scope].parent.is_none();
        self.defs.push(Def {
            name: name.to_string(),
            mangled: None,
            scope,
            global,
            undeclared: false,
            export_dont: false,
            kind,
            funarg: kind == SymKind::Funarg,
        });
        self.scopes[scope].vars.insert(name.to_string(), id);
        self.scopes[scope].vars_order.push(id);
        self.node_def.insert(ptr, id);
        if scope != self.cur || self.scopes[self.cur].block {
            self.note_enclosed(self.cur, id);
        }
        Ok(())
    }

    /// `catch (name) { var name }` prints the catch with the function-scoped
    /// variable's mangled name. The two defs stay separate.
    fn redefined_catch(&self, id: usize) -> Option<usize> {
        let def = &self.defs[id];
        if def.kind != SymKind::Catch || !self.scopes[def.scope].block {
            return None;
        }
        let defun = self.scopes[def.scope].fn_scope;
        self.scopes[defun].vars.get(&def.name).copied()
    }

    fn def_global(&mut self, node: &N, name: &str) {
        let ptr = Rc::as_ptr(node) as usize;
        if let Some(&id) = self.scopes[0].vars.get(name) {
            self.node_def.insert(ptr, id);
            self.note_enclosed(self.cur, id);
            return;
        }
        let id = self.defs.len();
        self.defs.push(Def {
            name: name.to_string(),
            mangled: None,
            scope: 0,
            global: true,
            undeclared: true,
            export_dont: false,
            kind: SymKind::Ref,
            funarg: false,
        });
        self.scopes[0].vars.insert(name.to_string(), id);
        self.scopes[0].vars_order.push(id);
        self.node_def.insert(ptr, id);
        self.note_enclosed(self.cur, id);
    }

    fn find(&self, scope: usize, name: &str) -> Option<usize> {
        let mut s = Some(scope);
        while let Some(id) = s {
            if let Some(def) = self.scopes[id].vars.get(name) {
                return Some(*def);
            }
            s = self.scopes[id].parent;
        }
        None
    }

    fn note_enclosed(&mut self, from: usize, def: usize) {
        let target = self.defs[def].scope;
        let mut s = Some(from);
        while let Some(id) = s {
            if !self.scopes[id].enclosed.contains(&def) {
                self.scopes[id].enclosed.push(def);
            }
            if id == target {
                break;
            }
            s = self.scopes[id].parent;
        }
    }

    fn push_scope(&mut self, block: bool, func: bool, strict: bool) -> usize {
        let id = self.scopes.len();
        let parent = self.cur;
        let fn_scope = if func { id } else { self.fn_scope };
        self.scopes.push(Scope {
            parent: Some(parent),
            fn_scope,
            block,
            func,
            strict: strict || self.scopes[parent].strict,
            pinned: false,
            has_block_defun: false,
            vars_order: Vec::new(),
            vars: HashMap::new(),
            enclosed: Vec::new(),
            cname: -1,
        });
        self.cur = id;
        if func {
            self.fn_scope = id;
            if !matches_arrow_scope() {
                // arguments is installed by walk_func when it is not an arrow
            }
        }
        id
    }

    fn pop_scope(&mut self, prev_cur: usize, prev_fn: usize) {
        self.cur = prev_cur;
        self.fn_scope = prev_fn;
    }

    fn pin_eval(&mut self) {
        let mut s = Some(self.cur);
        while let Some(id) = s {
            self.scopes[id].pinned = true;
            s = self.scopes[id].parent;
        }
    }

    fn walk(&mut self, n: &N) {
        self.scan_private(n);
        match &n.data {
            Data::Func { kind, name, args, body, .. } => self.walk_func(n, *kind, name.as_ref(), args, body),
            Data::Class { name, extends, props, .. } => {
                // A declaration name is bound outside the class. An expression
                // name is bound inside, and `extends` is resolved from inside
                // so the class scope will not reuse that binding's name.
                if let Some(name) = name {
                    if let Data::Symbol { name: nm, kind: SymKind::DefClass, .. } = &name.data {
                        let _ = self.define(self.cur, name, nm, SymKind::DefClass);
                    }
                }
                let prev_c = self.cur;
                let prev_f = self.fn_scope;
                self.push_scope(false, true, true);
                if let Some(name) = name {
                    if let Data::Symbol { kind: SymKind::Class, name: nm, .. } = &name.data {
                        self.define(self.cur, name, nm, SymKind::Class);
                    }
                }
                if let Some(ext) = extends {
                    self.walk(ext);
                }
                for p in props {
                    self.walk(p);
                }
                self.pop_scope(prev_c, prev_f);
            }
            Data::Toplevel { body } => {
                if body_is_strict(body) {
                    self.scopes[self.cur].strict = true;
                }
                for stmt in body {
                    self.walk(stmt);
                }
            }
            Data::StaticBlock { body } => {
                // A static block is its own function scope: `var` stays inside it.
                let prev_c = self.cur;
                let prev_f = self.fn_scope;
                self.push_scope(false, true, true);
                for stmt in body {
                    self.walk(stmt);
                }
                self.pop_scope(prev_c, prev_f);
            }
            Data::Block { body } => self.walk_block(body),
            Data::For { init, cond, step, body } => {
                let prev_c = self.cur;
                let prev_f = self.fn_scope;
                self.push_scope(true, false, false);
                if let Some(i) = init {
                    self.walk(i);
                }
                if let Some(c) = cond {
                    self.walk(c);
                }
                if let Some(s) = step {
                    self.walk(s);
                }
                self.walk(body);
                self.pop_scope(prev_c, prev_f);
            }
            Data::ForIn { init, object, body, .. } => {
                let prev_c = self.cur;
                let prev_f = self.fn_scope;
                self.push_scope(true, false, false);
                self.walk(init);
                self.walk(object);
                self.walk(body);
                self.pop_scope(prev_c, prev_f);
            }
            Data::ForOf { init, object, body, .. } => {
                let prev_c = self.cur;
                let prev_f = self.fn_scope;
                self.push_scope(true, false, false);
                self.walk(init);
                self.walk(object);
                self.walk(body);
                self.pop_scope(prev_c, prev_f);
            }
            Data::Switch { expr, body } => {
                self.walk(expr);
                let prev_c = self.cur;
                let prev_f = self.fn_scope;
                self.push_scope(true, false, false);
                for b in body {
                    self.walk(b);
                }
                self.pop_scope(prev_c, prev_f);
            }
            Data::Catch { arg, body } => {
                let prev_c = self.cur;
                let prev_f = self.fn_scope;
                self.push_scope(true, false, false);
                if let Some(arg) = arg {
                    self.bind_pattern(arg, self.cur);
                }
                // The catch parameter and the catch block share one scope.
                // A nested block would restart the name counter and reuse the
                // parameter's mangled name.
                match &body.data {
                    Data::Block { body } => {
                        for stmt in body {
                            self.walk(stmt);
                        }
                    }
                    _ => self.walk(body),
                }
                self.pop_scope(prev_c, prev_f);
            }
            Data::Labeled { label, body } => {
                if let Data::Symbol { name, .. } = &label.data {
                    self.label_stack.push(HashMap::new());
                    let top = self.label_stack.len() - 1;
                    self.label_stack[top].insert(name.clone(), Rc::as_ptr(label) as usize);
                    self.label_nodes.push(Rc::clone(label));
                    self.label_events.push(LabelEvent::Enter);
                    self.label_events.push(LabelEvent::Label(Rc::clone(label)));
                    self.walk(body);
                    self.label_events.push(LabelEvent::Leave);
                    self.label_stack.pop();
                } else {
                    self.walk(body);
                }
            }
            Data::With { expr, body } => {
                self.walk(expr);
                self.pin_eval();
                self.walk(body);
            }
            Data::Defs { defs, .. } => {
                for d in defs {
                    self.walk_vardef(d);
                }
            }
            Data::Symbol { kind, name, .. } => self.see_symbol(n, *kind, name),
            Data::Call { expr, args, is_new, .. } => {
                let eval_call = !*is_new && matches!(&expr.data, Data::Symbol { name, kind: SymKind::Ref, .. } if name == "eval");
                self.walk(expr);
                for a in args {
                    self.walk(a);
                }
                if eval_call {
                    self.pin_eval();
                }
            }
            Data::Break { label } | Data::Continue { label } => {
                if let Some(label) = label {
                    self.refs_label(label);
                }
            }
            // terser `mark_export`: a declaration directly under `export`
            // keeps its name, except a default-exported function or class.
            Data::Export { is_default, definition: Some(def), .. } => {
                self.walk_children(&n.data);
                let default_decl = *is_default
                    && matches!(def.data, Data::Func { kind: FuncKind::Decl, .. } | Data::Class { stmt: true, .. });
                if !default_decl {
                    let mut syms = Vec::new();
                    export_decl_symbols(def, &mut syms);
                    for sym in syms {
                        if let Some(&id) = self.node_def.get(&(Rc::as_ptr(&sym) as usize)) {
                            self.defs[id].export_dont = true;
                        }
                    }
                }
            }
            other => self.walk_children(other),
        }
    }

    fn scan_private(&mut self, n: &N) {
        match &n.data {
            Data::Dot { prop, private: true, .. } => self.note_private(prop),
            Data::Field { key: Key::Private(name), .. } | Data::Prop { key: Key::Private(name), .. } => self.note_private(name),
            Data::Symbol { kind: SymKind::Private, name, .. } => self.note_private(name),
            _ => {}
        }
    }

    fn walk_children(&mut self, data: &Data) {
        let kids: Vec<N> = child_nodes(data);
        for k in kids {
            self.walk(&k);
        }
    }

    fn walk_func(&mut self, n: &N, kind: FuncKind, name: Option<&N>, args: &[N], body: &[N]) {
        let strict_body = body_is_strict(body) || self.scopes[self.cur].strict || kind == FuncKind::Accessor;
        if kind == FuncKind::Decl && self.scopes[self.cur].block {
            let fs = self.fn_scope;
            self.scopes[fs].has_block_defun = true;
        }
        if kind == FuncKind::Decl {
            if let Some(name) = name {
                if let Data::Symbol { name: nm, kind: sk, .. } = &name.data {
                    let target = if self.scopes[self.cur].strict { self.cur } else { self.fn_scope };
                    self.define(target, name, nm, *sk);
                }
            }
        }
        let prev_c = self.cur;
        let prev_f = self.fn_scope;
        self.push_scope(false, true, strict_body);
        let fs = self.cur;
        if kind != FuncKind::Arrow {
            self.define_arguments(fs);
        }
        if kind != FuncKind::Decl {
            if let Some(name) = name {
                if let Data::Symbol { name: nm, kind: sk, .. } = &name.data {
                    self.define(fs, name, nm, *sk);
                }
            }
        }
        for arg in args {
            self.bind_pattern(arg, fs);
        }
        for stmt in body {
            self.walk(stmt);
        }
        self.pop_scope(prev_c, prev_f);
        let _ = n;
    }

    fn define_arguments(&mut self, scope: usize) {
        if self.scopes[scope].vars.contains_key("arguments") {
            return;
        }
        let id = self.defs.len();
        self.defs.push(Def {
            name: "arguments".into(),
            mangled: None,
            scope,
            global: false,
            undeclared: false,
            export_dont: false,
            kind: SymKind::Funarg,
            funarg: true,
        });
        self.scopes[scope].vars.insert("arguments".into(), id);
        self.scopes[scope].vars_order.push(id);
    }

    fn walk_block(&mut self, body: &[N]) {
        let prev_c = self.cur;
        let prev_f = self.fn_scope;
        self.push_scope(true, false, false);
        for s in body {
            self.walk(s);
        }
        self.pop_scope(prev_c, prev_f);
    }

    fn walk_vardef(&mut self, n: &N) {
        if let Data::VarDef { name, value } = &n.data {
            let scope = match binding_scope_kind(name) {
                Some(SymKind::Var) => self.fn_scope,
                Some(_) => self.cur,
                None => self.cur,
            };
            self.bind_pattern(name, scope);
            if let Some(v) = value {
                self.walk(v);
            }
        } else {
            self.walk(n);
        }
    }

    fn bind_pattern(&mut self, n: &N, scope: usize) {
        match &n.data {
            Data::Symbol { kind, name, .. } if is_binding(*kind) => {
                let where_ = if *kind == SymKind::Var { self.fn_scope } else { scope };
                self.define(where_, n, name, *kind);
            }
            Data::DefaultAssign { left, right } | Data::Assign { left, right, .. } => {
                self.bind_pattern(left, scope);
                self.walk(right);
            }
            Data::Destructuring { names, .. } => {
                for name in names {
                    self.bind_pattern(name, scope);
                }
            }
            Data::Spread { expr } => self.bind_pattern(expr, scope),
            Data::Prop { key, value, .. } => {
                if let Key::Computed(e) = key {
                    self.walk(e);
                }
                self.bind_pattern(value, scope);
            }
            Data::Hole => {}
            _ => self.walk(n),
        }
    }

    fn see_symbol(&mut self, n: &N, kind: SymKind, name: &str) {
        match kind {
            SymKind::Ref | SymKind::Export => self.refs.push((Rc::clone(n), self.cur)),
            SymKind::Label => self.label_nodes.push(Rc::clone(n)),
            SymKind::LabelRef => self.refs_label(n),
            SymKind::Var | SymKind::Let | SymKind::Const | SymKind::Using | SymKind::Funarg | SymKind::Catch | SymKind::Import => {
                let scope = if kind == SymKind::Var || kind == SymKind::Funarg { self.fn_scope } else { self.cur };
                if !self.node_def.contains_key(&(Rc::as_ptr(n) as usize)) {
                    self.define(scope, n, name, kind);
                }
            }
            _ => {}
        }
    }

    fn refs_label(&mut self, n: &N) {
        if let Data::Symbol { name, .. } = &n.data {
            for frame in self.label_stack.iter().rev() {
                if let Some(label_ptr) = frame.get(name) {
                    self.label_refs.insert(Rc::as_ptr(n) as usize, *label_ptr);
                    self.label_ref_nodes.push(Rc::clone(n));
                    return;
                }
            }
        }
    }

    fn enclose_redefined_catches(&mut self) {
        let catches: Vec<usize> = self
            .defs
            .iter()
            .enumerate()
            .filter(|(_, def)| def.kind == SymKind::Catch)
            .map(|(id, _)| id)
            .collect();
        for id in catches {
            if let Some(redef) = self.redefined_catch(id) {
                self.note_enclosed(self.defs[id].scope, redef);
            }
        }
    }

    fn resolve_refs(&mut self) {
        let refs = std::mem::take(&mut self.refs);
        for (n, scope) in &refs {
            if let Data::Symbol { name, kind, .. } = &n.data {
                if *kind == SymKind::LabelRef || *kind == SymKind::Label {
                    continue;
                }
                if let Some(id) = self.find(*scope, name) {
                    self.node_def.insert(Rc::as_ptr(n) as usize, id);
                    self.note_enclosed(*scope, id);
                } else {
                    let saved = self.cur;
                    self.cur = *scope;
                    self.def_global(n, name);
                    self.cur = saved;
                }
            }
        }
    }

    fn mangleable_nodes(&self) -> Vec<(usize, String)> {
        let mut out = Vec::new();
        for (ptr, id) in &self.node_def {
            if self.freq_subtract(*id) {
                out.push((*ptr, self.defs[*id].name.clone()));
            }
        }
        for n in &self.label_nodes {
            if let Data::Symbol { name, .. } = &n.data {
                out.push((Rc::as_ptr(n) as usize, name.clone()));
            }
        }
        for n in &self.label_ref_nodes {
            if let Data::Symbol { name, .. } = &n.data {
                out.push((Rc::as_ptr(n) as usize, name.clone()));
            }
        }
        out
    }

    /// Names removed from the frequency count. Reserved names such as
    /// `arguments` are still subtracted, because terser's print hook uses
    /// `unmangleable` and that check does not look at `reserved`.
    fn freq_subtract(&self, id: usize) -> bool {
        !self.unmangleable(id)
    }

    fn can_mangle(&self, id: usize) -> bool {
        self.freq_subtract(id) && !is_reserved(&self.defs[id].name)
    }

    fn unmangleable(&self, id: usize) -> bool {
        let d = &self.defs[id];
        if (d.global && !self.opts.toplevel) || d.undeclared || d.export_dont {
            return true;
        }
        if self.scopes[d.scope].pinned {
            return true;
        }
        if d.kind == SymKind::Method {
            return true;
        }
        false
    }

    fn assign(&mut self, freq: &Freq) {
        // Sibling labels reuse names. The counter is saved around each
        // labeled statement and restored after its body.
        let mut lname = -1i32;
        let mut saved: Vec<i32> = Vec::new();
        let events = std::mem::take(&mut self.label_events);
        let mut label_names: HashMap<usize, String> = HashMap::new();
        for event in &events {
            match event {
                LabelEvent::Enter => saved.push(lname),
                LabelEvent::Leave => lname = saved.pop().unwrap_or(-1),
                LabelEvent::Label(n) => {
                    let original = match &n.data {
                        Data::Symbol { name, .. } => name.clone(),
                        _ => String::new(),
                    };
                    let mut name;
                    loop {
                        lname += 1;
                        name = freq.get(lname);
                        if !is_reserved(&name) {
                            break;
                        }
                    }
                    label_names.insert(Rc::as_ptr(n) as usize, name.clone());
                    let id = self.defs.len();
                    self.defs.push(Def {
                        name: original,
                        mangled: Some(name),
                        scope: 0,
                        global: false,
                        undeclared: false,
                        export_dont: false,
                        kind: SymKind::Label,
                        funarg: false,
                    });
                    self.node_def.insert(Rc::as_ptr(n) as usize, id);
                }
            }
        }
        let refs = self.label_refs.clone();
        for (rptr, lptr) in refs {
            if let Some(name) = label_names.get(&lptr) {
                let original = self
                    .label_nodes
                    .iter()
                    .find(|n| Rc::as_ptr(n) as usize == lptr)
                    .and_then(|n| match &n.data {
                        Data::Symbol { name, .. } => Some(name.clone()),
                        _ => None,
                    })
                    .unwrap_or_else(|| name.clone());
                let id = self.defs.len();
                self.defs.push(Def {
                    name: original,
                    mangled: Some(name.clone()),
                    scope: 0,
                    global: false,
                    undeclared: false,
                    export_dont: false,
                    kind: SymKind::LabelRef,
                    funarg: false,
                });
                self.node_def.insert(rptr, id);
            }
        }

        let mut order = Vec::new();
        self.collect(0, &mut order);
        for id in order {
            if self.defs[id].mangled.is_some() {
                continue;
            }
            if self.defs[id].kind == SymKind::Catch {
                if let Some(redef) = self.redefined_catch(id) {
                    let name = self.defs[redef]
                        .mangled
                        .clone()
                        .unwrap_or_else(|| self.defs[redef].name.clone());
                    self.defs[id].mangled = Some(name);
                    continue;
                }
            }
            if !self.can_mangle(id) {
                continue;
            }
            let scope = self.defs[id].scope;
            let name = self.next_mangled(scope, freq);
            self.defs[id].mangled = Some(name);
        }
    }

    fn collect(&self, scope: usize, out: &mut Vec<usize>) {
        for id in &self.scopes[scope].vars_order {
            out.push(*id);
        }
        let children: Vec<usize> = self.scopes.iter().enumerate().filter(|(_, s)| s.parent == Some(scope)).map(|(i, _)| i).collect();
        for c in children {
            self.collect(c, out);
        }
    }

    fn next_mangled(&mut self, mut scope: usize, freq: &Freq) -> String {
        if self.scopes[scope].block {
            let fs = self.scopes[scope].fn_scope;
            if self.scopes[fs].has_block_defun {
                scope = fs;
            }
        }
        loop {
            self.scopes[scope].cname += 1;
            let m = freq.get(self.scopes[scope].cname);
            if is_reserved(&m) {
                continue;
            }
            let hit = self.scopes[scope].enclosed.iter().any(|id| {
                let d = &self.defs[*id];
                if let Some(mangled) = &d.mangled {
                    mangled == &m
                } else if self.unmangleable(*id) {
                    d.name == m
                } else {
                    false
                }
            });
            if !hit {
                return m;
            }
        }
    }
}

fn matches_arrow_scope() -> bool {
    false
}

fn binding_scope_kind(n: &N) -> Option<SymKind> {
    match &n.data {
        Data::Symbol { kind, .. } => Some(*kind),
        Data::DefaultAssign { left, .. } | Data::Assign { left, .. } => binding_scope_kind(left),
        Data::Destructuring { names, .. } => names.first().and_then(binding_scope_kind),
        Data::Prop { value, .. } => binding_scope_kind(value),
        Data::Spread { expr } => binding_scope_kind(expr),
        _ => None,
    }
}

fn is_binding(kind: SymKind) -> bool {
    matches!(
        kind,
        SymKind::Var | SymKind::Let | SymKind::Const | SymKind::Using | SymKind::Funarg | SymKind::Catch | SymKind::Import | SymKind::Defun | SymKind::Lambda | SymKind::Class | SymKind::DefClass
    )
}

fn child_nodes(data: &Data) -> Vec<N> {
    let mut v = Vec::new();
    match data {
        Data::Toplevel { body } | Data::Block { body } | Data::StaticBlock { body } | Data::Default { body } => v.extend(body.iter().cloned()),
        Data::Simple { body } | Data::Throw { value: body } | Data::Spread { expr: body } | Data::Await { expr: body } | Data::Chain { expr: body } => v.push(Rc::clone(body)),
        Data::Return { value } | Data::Yield { expr: value, .. } => {
            if let Some(x) = value { v.push(Rc::clone(x)); }
        }
        Data::If { cond, body, alt } => {
            v.push(Rc::clone(cond));
            v.push(Rc::clone(body));
            if let Some(a) = alt { v.push(Rc::clone(a)); }
        }
        Data::While { cond, body } | Data::Do { body, cond } => {
            v.push(Rc::clone(cond));
            v.push(Rc::clone(body));
        }
        Data::Try { body, catch, finally } => {
            v.push(Rc::clone(body));
            if let Some(c) = catch { v.push(Rc::clone(c)); }
            if let Some(f) = finally { v.push(Rc::clone(f)); }
        }
        Data::Finally { body } => v.push(Rc::clone(body)),
        Data::Case { expr, body } => {
            v.push(Rc::clone(expr));
            v.extend(body.iter().cloned());
        }
        Data::VarDef { name, value } => {
            v.push(Rc::clone(name));
            if let Some(x) = value { v.push(Rc::clone(x)); }
        }
        Data::Array { elements } | Data::Seq { exprs: elements } | Data::Destructuring { names: elements, .. } => {
            v.extend(elements.iter().cloned())
        }
        Data::Object { props } => v.extend(props.iter().cloned()),
        Data::Prop { key, value, .. } => {
            if let Key::Computed(e) = key { v.push(Rc::clone(e)); }
            v.push(Rc::clone(value));
        }
        Data::Field { key, value, .. } => {
            if let Key::Computed(e) = key { v.push(Rc::clone(e)); }
            if let Some(x) = value { v.push(Rc::clone(x)); }
        }
        Data::Binary { left, right, .. } | Data::Assign { left, right, .. } | Data::DefaultAssign { left, right } | Data::PrivateIn { key: left, value: right } => {
            v.push(Rc::clone(left));
            v.push(Rc::clone(right));
        }
        Data::Unary { expr, .. } | Data::Dot { expr, .. } | Data::Sub { expr, .. } => v.push(Rc::clone(expr)),
        Data::Cond { cond, cons, alt } => {
            v.push(Rc::clone(cond));
            v.push(Rc::clone(cons));
            v.push(Rc::clone(alt));
        }
        Data::Template { segments } => {
            for s in segments {
                if let ast::Seg::Expr(e) = s { v.push(Rc::clone(e)); }
            }
        }
        Data::TaggedTemplate { tag, template } => {
            v.push(Rc::clone(tag));
            v.push(Rc::clone(template));
        }
        Data::DynImport { args, .. } => v.extend(args.iter().cloned()),
        Data::NameMap { foreign, name } => {
            v.push(Rc::clone(foreign));
            v.push(Rc::clone(name));
        }
        Data::Import { imported_name, imported_names, module_name, attributes, .. } => {
            if let Some(n) = imported_name { v.push(Rc::clone(n)); }
            if let Some(ns) = imported_names { v.extend(ns.iter().cloned()); }
            v.push(Rc::clone(module_name));
            if let Some(a) = attributes { v.push(Rc::clone(a)); }
        }
        Data::Export { names, value, definition, module_name, attributes, .. } => {
            if let Some(ns) = names { v.extend(ns.iter().cloned()); }
            if let Some(x) = value { v.push(Rc::clone(x)); }
            if let Some(x) = definition { v.push(Rc::clone(x)); }
            if let Some(x) = module_name { v.push(Rc::clone(x)); }
            if let Some(x) = attributes { v.push(Rc::clone(x)); }
        }
        _ => {}
    }
    // Dot and Sub both pushed expr; Sub also needs prop. The Sub arm above
    // only pushed expr via the combined pattern, then a second Sub arm is
    // unreachable. Handle prop in the combined arm instead.
    if let Data::Sub { prop, .. } = data {
        v.push(Rc::clone(prop));
    }
    v
}

fn body_is_strict(body: &[N]) -> bool {
    body.iter().any(|n| matches!(&n.data, Data::Directive { value, .. } if value == "use strict"))
}

fn redeclares(old: &Def, kind: SymKind) -> bool {
    let block = matches!(kind, SymKind::Let | SymKind::Const | SymKind::Using | SymKind::Class | SymKind::DefClass | SymKind::Catch);
    let old_block = matches!(old.kind, SymKind::Let | SymKind::Const | SymKind::Using | SymKind::Class | SymKind::DefClass | SymKind::Catch);
    if block && old_block {
        return true;
    }
    if block && matches!(old.kind, SymKind::Defun | SymKind::Var) {
        return true;
    }
    if matches!(kind, SymKind::Defun | SymKind::Var) && old_block {
        return true;
    }
    false
}

fn is_reserved(name: &str) -> bool {
    matches!(
        name,
        "break" | "case" | "catch" | "class" | "const" | "continue" | "debugger" | "default"
            | "delete" | "do" | "else" | "export" | "extends" | "finally" | "for" | "function"
            | "if" | "in" | "instanceof" | "let" | "new" | "return" | "switch" | "throw" | "try"
            | "typeof" | "var" | "void" | "while" | "with" | "enum" | "import" | "super" | "this"
            | "false" | "null" | "true" | "implements" | "interface" | "package" | "private"
            | "protected" | "public" | "static" | "arguments"
    )
}

struct Freq {
    leading: Vec<char>,
    digits: Vec<char>,
    count: HashMap<char, i32>,
    chars: Vec<char>,
}

impl Freq {
    fn new() -> Self {
        let leading: Vec<char> = LEADING.iter().map(|b| *b as char).collect();
        let digits: Vec<char> = DIGITS.iter().map(|b| *b as char).collect();
        let mut count = HashMap::new();
        for c in leading.iter().chain(digits.iter()) {
            count.insert(*c, 0);
        }
        Self { leading, digits, count, chars: Vec::new() }
    }

    fn consider(&mut self, s: &str, delta: i32) {
        for c in s.chars().rev() {
            if let Some(n) = self.count.get_mut(&c) {
                *n += delta;
            }
        }
    }

    fn sort(&mut self) {
        let cmp = |a: &char, b: &char| {
            let fb = self.count.get(b).copied().unwrap_or(0);
            let fa = self.count.get(a).copied().unwrap_or(0);
            fb.cmp(&fa)
        };
        let mut leading = self.leading.clone();
        let mut digits = self.digits.clone();
        leading.sort_by(cmp);
        digits.sort_by(cmp);
        self.chars = leading;
        self.chars.extend(digits);
    }

    fn get(&self, mut num: i32) -> String {
        let mut ret = String::new();
        let mut base = 54i32;
        num += 1;
        loop {
            num -= 1;
            let idx = (num % base) as usize;
            ret.push(self.chars.get(idx).copied().unwrap_or('a'));
            num /= base;
            base = 64;
            if num <= 0 {
                break;
            }
        }
        ret
    }
}

pub fn touch() {
    ast::touch();
}

/// Declaration symbols of an `export` definition.
fn export_decl_symbols(n: &N, out: &mut Vec<N>) {
    fn pattern(n: &N, out: &mut Vec<N>) {
        match &n.data {
            Data::Symbol { .. } => out.push(Rc::clone(n)),
            Data::Destructuring { names, .. } => names.iter().for_each(|x| pattern(x, out)),
            Data::DefaultAssign { left, .. } | Data::Spread { expr: left } => pattern(left, out),
            Data::Prop { value, .. } => pattern(value, out),
            _ => {}
        }
    }
    match &n.data {
        Data::Func { name: Some(nm), .. } | Data::Class { name: Some(nm), .. } => out.push(Rc::clone(nm)),
        Data::Defs { defs, .. } => {
            for d in defs {
                if let Data::VarDef { name, .. } = &d.data {
                    pattern(name, out);
                }
            }
        }
        _ => {}
    }
}
