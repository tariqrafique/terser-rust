//! Recursive descent parser. Token positions come from `token::Tokenizer`.

use crate::token::{PErr, TokVal, Tokenizer};
use ast::{Data, DefKind, FuncKind, Key, MethodKind, N, Node, SymKind};
use std::collections::HashSet;
use std::rc::Rc;

pub struct ParseError {
    pub message: String,
    pub line: u32,
    pub col: u32,
}

pub fn parse(src: &str) -> Result<N, ParseError> {
    let mut p = Parser::new(src);
    p.parse_toplevel()
}

struct Parser {
    tz: Tokenizer,
    token: usize,
    prev: Option<usize>,
    peeked: Option<usize>,
    started: bool,
    in_function: i32,
    in_async: i32,
    in_generator: i32,
    in_directives: bool,
    in_loop: i32,
    in_class: bool,
    labels: Vec<LabelFrame>,
}

#[derive(Clone)]
struct LabelFrame {
    name: String,
    continues: Vec<usize>,
}

struct Tracker {
    names: HashSet<String>,
    duplicate: Option<usize>,
    default_assign: bool,
    spread: bool,
    strict: bool,
    is_param: bool,
    duplicates_ok: bool,
}

impl Tracker {
    fn new(is_param: bool, strict: bool, duplicates_ok: bool) -> Self {
        Self {
            names: HashSet::new(),
            duplicate: None,
            default_assign: false,
            spread: false,
            strict,
            is_param,
            duplicates_ok,
        }
    }
    fn is_strict(&self) -> bool {
        self.default_assign || self.spread || self.strict
    }
}

impl Parser {
    fn new(src: &str) -> Self {
        Self {
            tz: Tokenizer::new(src, true, true),
            token: 0,
            prev: None,
            peeked: None,
            started: false,
            in_function: 0,
            in_async: -1,
            in_generator: -1,
            in_directives: true,
            in_loop: 0,
            in_class: false,
            labels: Vec::new(),
        }
    }

    fn parse_toplevel(&mut self) -> Result<N, ParseError> {
        self.bump()?;
        let start = self.token;
        self.tz.push_directives_stack();
        let mut body = Vec::new();
        while !self.is("eof", None) {
            let before = self.token;
            body.push(self.statement(false, false, false)?);
            if self.token == before {
                return Err(self.unexpected(self.token));
            }
        }
        self.tz.pop_directives_stack();
        let end = self.prev.unwrap_or(start);
        Ok(self.mk(Data::Toplevel { body }, start, end))
    }

    fn bump(&mut self) -> Result<(), ParseError> {
        if self.started {
            self.prev = Some(self.token);
        }
        if self.peeked.is_none() {
            let t = self.tz.next_token_outer(None).map_err(|e| self.perr(e))?;
            self.peeked = Some(t);
        }
        self.token = self.peeked.take().unwrap();
        let ty = self.ty().to_string();
        let semi = self.is("punc", Some(";"));
        self.in_directives = self.in_directives && (ty == "string" || semi);
        self.started = true;
        Ok(())
    }

    fn peek_tok(&mut self) -> Result<usize, ParseError> {
        if self.peeked.is_none() {
            let t = self.tz.next_token_outer(None).map_err(|e| self.perr(e))?;
            self.peeked = Some(t);
        }
        Ok(self.peeked.unwrap())
    }

    fn ty(&self) -> &'static str {
        self.tz.ty(self.token)
    }
    fn sval(&self) -> String {
        self.tz.val_str(self.token)
    }
    fn is(&self, ty: &str, val: Option<&str>) -> bool {
        if self.tz.ty(self.token) != ty {
            return false;
        }
        match val {
            None => true,
            Some(v) => self.tz.str_val(self.token) == Some(v),
        }
    }
    fn is_at(&self, idx: usize, ty: &str, val: Option<&str>) -> bool {
        if self.tz.ty(idx) != ty {
            return false;
        }
        match val {
            None => true,
            Some(v) => self.tz.str_val(idx) == Some(v),
        }
    }
    fn perr(&self, e: PErr) -> ParseError {
        ParseError { message: e.message, line: e.line, col: e.col }
    }
    fn at(&self, msg: impl Into<String>, idx: usize) -> ParseError {
        let (line, col) = self.tz.line_col(idx);
        ParseError { message: msg.into(), line, col }
    }
    fn croak(&self, msg: impl Into<String>) -> ParseError {
        self.at(msg, self.token)
    }
    fn unexpected(&self, idx: usize) -> ParseError {
        let ty = self.tz.ty(idx);
        let val = self.tz.val_str(idx);
        self.at(format!("Unexpected token: {ty} ({val})"), idx)
    }
    fn unexpected_tok(&self, tok: &ast::Tok) -> ParseError {
        let val = if tok.ty == "eof" && tok.value.is_empty() {
            "undefined".to_string()
        } else {
            tok.value.clone()
        };
        ParseError { message: format!("Unexpected token: {} ({val})", tok.ty), line: tok.line, col: tok.col }
    }
    fn expect(&mut self, ty: &str, val: &str) -> Result<(), ParseError> {
        if self.is(ty, Some(val)) {
            self.bump()?;
            Ok(())
        } else {
            let got_ty = self.ty();
            let got = self.sval();
            Err(self.croak(format!("Unexpected token {got_ty} «{got}», expected {ty} «{val}»")))
        }
    }
    fn expect_punc(&mut self, p: &str) -> Result<(), ParseError> {
        self.expect("punc", p)
    }

    fn mk(&mut self, data: Data, start: usize, end: usize) -> N {
        let mut s = self.tz.snap(start);
        let mut e = self.tz.snap(end);
        self.tz.freeze_tok(&mut s);
        self.tz.freeze_tok(&mut e);
        Rc::new(Node { start: Some(s), end: Some(e), data })
    }

    fn can_asi(&self) -> bool {
        self.is("eof", None) || self.is("punc", Some("}")) || self.tz.has_newline_before(self.token)
    }
    fn semicolon(&mut self, optional: bool) -> Result<(), ParseError> {
        if self.is("punc", Some(";")) {
            self.bump()?;
        } else if !optional && !self.can_asi() {
            return Err(self.unexpected(self.token));
        }
        Ok(())
    }
    fn in_generator(&self) -> bool {
        self.in_generator == self.in_function
    }
    fn can_await(&self) -> bool {
        self.in_async == self.in_function || (self.in_function == 0 && self.tz.has_directive("use strict"))
    }

    fn handle_regexp(&mut self) -> Result<(), ParseError> {
        if self.is("operator", Some("/")) || self.is("operator", Some("/=")) {
            let v = self.sval();
            let rest = if v.len() > 1 { v[1..].to_string() } else { String::new() };
            self.peeked = None;
            self.token = self.tz.next_token(Some(rest)).map_err(|e| self.perr(e))?;
        }
        Ok(())
    }

    fn statement(&mut self, export_default: bool, for_body: bool, if_body: bool) -> Result<N, ParseError> {
        let start = self.token;
        self.handle_regexp()?;
        let node = self.statement_inner(export_default, for_body, if_body)?;
        let end = self.prev.unwrap_or(start);
        Ok(self.restamp(node, start, end))
    }

    fn stamp_start(&mut self, node: N, start: usize) -> N {
        let mut node = node;
        if let Some(n) = Rc::get_mut(&mut node) {
            let mut s = self.tz.snap(start);
            self.tz.freeze_tok(&mut s);
            n.start = Some(s);
        }
        node
    }

    fn restamp(&mut self, node: N, start: usize, end: usize) -> N {
        let mut node = node;
        if let Some(n) = Rc::get_mut(&mut node) {
            let mut s = self.tz.snap(start);
            let mut e = self.tz.snap(end);
            self.tz.freeze_tok(&mut s);
            self.tz.freeze_tok(&mut e);
            n.start = Some(s);
            n.end = Some(e);
        }
        node
    }

    fn statement_inner(&mut self, export_default: bool, for_body: bool, if_body: bool) -> Result<N, ParseError> {
        match self.ty() {
            "string" => {
                if self.in_directives {
                    let pk = self.peek_tok()?;
                    // Peek can overwrite LATEST_RAW; terser checks after the peek.
                    let raw = self.tz.latest_raw.clone();
                    let ends = self.is_at(pk, "punc", Some(";"))
                        || self.is_at(pk, "punc", Some("}"))
                        || self.tz.has_newline_before(pk)
                        || self.is_at(pk, "eof", None);
                    if !raw.contains('\\') && ends {
                        let dir = self.sval();
                        self.tz.add_directive(&dir);
                    } else {
                        self.in_directives = false;
                    }
                }
                let dir = self.in_directives;
                let stat = self.simple_statement()?;
                if dir {
                    if let Data::Simple { body } = &stat.data {
                        if let Data::String { value, quote, units } = &body.data {
                            return Ok(self.mk(
                                Data::Directive { value: value.clone(), quote: *quote, units: units.clone() },
                                body.start.as_ref().map(|_| self.prev.unwrap_or(self.token)).unwrap_or(self.token),
                                self.prev.unwrap_or(self.token),
                            ));
                        }
                    }
                }
                Ok(stat)
            }
            "num" | "big_int" | "regexp" | "operator" | "atom" | "template_head" => self.simple_statement(),
            "name" => {
                let v = self.sval();
                let pk = self.peek_tok()?;
                if v == "async" && self.is_at(pk, "keyword", Some("function")) {
                    self.bump()?;
                    self.bump()?;
                    if for_body {
                        return Err(self.croak("functions are not allowed as the body of a loop"));
                    }
                    return self.function(FuncKind::Decl, false, true, export_default);
                }
                if v == "import" && !self.is_at(pk, "punc", Some("(")) && !self.is_at(pk, "punc", Some(".")) {
                    self.bump()?;
                    let node = self.import_statement()?;
                    self.semicolon(false)?;
                    return Ok(node);
                }
                if v == "using" && self.is_at(pk, "name", None) && !self.tz.has_newline_before(pk) {
                    self.bump()?;
                    let node = self.using_decl(false)?;
                    self.semicolon(false)?;
                    return Ok(node);
                }
                if v == "await" && self.can_await() && self.is_at(pk, "name", Some("using")) && !self.tz.has_newline_before(pk) {
                    let (ch, pos) = self.tz.peek_next_token_start_or_newline();
                    if self.tz.ch_starts_binding_identifier(ch.as_deref(), pos) {
                        self.bump()?;
                        let node = self.await_using(false)?;
                        self.semicolon(false)?;
                        return Ok(node);
                    }
                }
                if (v == "type" || v == "interface") && self.is_at(pk, "name", None) && !self.tz.has_newline_before(pk) {
                    return Err(self.unexpected(self.token));
                }
                if self.is_at(pk, "punc", Some(":")) {
                    self.labeled()
                } else {
                    self.simple_statement()
                }
            }
            "privatename" => {
                if !self.in_class {
                    return Err(self.croak("Private field must be used in an enclosing class"));
                }
                self.simple_statement()
            }
            "punc" => match self.sval().as_str() {
                "{" => {
                    let start = self.token;
                    let body = self.block()?;
                    let end = self.prev.unwrap_or(start);
                    Ok(self.mk(Data::Block { body }, start, end))
                }
                "[" | "(" => self.simple_statement(),
                ";" => {
                    self.in_directives = false;
                    let t = self.token;
                    self.bump()?;
                    Ok(self.mk(Data::Empty, t, t))
                }
                _ => Err(self.unexpected(self.token)),
            },
            "keyword" => match self.sval().as_str() {
                "break" => {
                    self.bump()?;
                    self.break_cont(true)
                }
                "continue" => {
                    self.bump()?;
                    self.break_cont(false)
                }
                "debugger" => {
                    let t = self.token;
                    self.bump()?;
                    self.semicolon(false)?;
                    Ok(self.mk(Data::Debugger, t, self.prev.unwrap_or(t)))
                }
                "do" => {
                    self.bump()?;
                    self.in_loop += 1;
                    let body = self.statement(false, false, false)?;
                    self.in_loop -= 1;
                    self.expect("keyword", "while")?;
                    self.expect_punc("(")?;
                    let cond = self.expression(true, false)?;
                    self.expect_punc(")")?;
                    self.semicolon(true)?;
                    Ok(self.mk(Data::Do { body, cond }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
                }
                "while" => {
                    self.bump()?;
                    self.expect_punc("(")?;
                    let cond = self.expression(true, false)?;
                    self.expect_punc(")")?;
                    self.in_loop += 1;
                    let body = self.statement(false, true, false)?;
                    self.in_loop -= 1;
                    Ok(self.mk(Data::While { cond, body }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
                }
                "for" => {
                    self.bump()?;
                    self.for_stmt()
                }
                "class" => {
                    self.bump()?;
                    if for_body {
                        return Err(self.croak("classes are not allowed as the body of a loop"));
                    }
                    if if_body {
                        return Err(self.croak("classes are not allowed as the body of an if"));
                    }
                    self.class_decl(true, export_default)
                }
                "function" => {
                    self.bump()?;
                    if for_body {
                        return Err(self.croak("functions are not allowed as the body of a loop"));
                    }
                    self.function(FuncKind::Decl, false, false, export_default)
                }
                "if" => {
                    self.bump()?;
                    self.if_stmt()
                }
                "return" => {
                    if self.in_function == 0 {
                        return Err(self.croak("'return' outside of function"));
                    }
                    self.bump()?;
                    let value = if self.is("punc", Some(";")) {
                        self.bump()?;
                        None
                    } else if !self.can_asi() {
                        let v = self.expression(true, false)?;
                        self.semicolon(false)?;
                        Some(v)
                    } else {
                        None
                    };
                    Ok(self.mk(Data::Return { value }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
                }
                "switch" => {
                    self.bump()?;
                    self.expect_punc("(")?;
                    let expr = self.expression(true, false)?;
                    self.expect_punc(")")?;
                    let body = self.switch_body()?;
                    Ok(self.mk(Data::Switch { expr, body }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
                }
                "throw" => {
                    self.bump()?;
                    if self.tz.has_newline_before(self.token) {
                        return Err(self.croak("Illegal newline after 'throw'"));
                    }
                    let value = self.expression(true, false)?;
                    self.semicolon(false)?;
                    Ok(self.mk(Data::Throw { value }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
                }
                "try" => {
                    self.bump()?;
                    self.try_stmt()
                }
                "var" => {
                    self.bump()?;
                    let node = self.var_decl(DefKind::Var, false, false)?;
                    self.semicolon(false)?;
                    Ok(node)
                }
                "let" => {
                    self.bump()?;
                    let node = self.var_decl(DefKind::Let, false, false)?;
                    self.semicolon(false)?;
                    Ok(node)
                }
                "const" => {
                    self.bump()?;
                    let node = self.var_decl(DefKind::Const, false, false)?;
                    self.semicolon(false)?;
                    Ok(node)
                }
                "with" => {
                    if self.tz.has_directive("use strict") {
                        return Err(self.croak("Strict mode may not include a with statement"));
                    }
                    self.bump()?;
                    self.expect_punc("(")?;
                    let expr = self.expression(true, false)?;
                    self.expect_punc(")")?;
                    let body = self.statement(false, false, false)?;
                    Ok(self.mk(Data::With { expr, body }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
                }
                "export" => {
                    let pk = self.peek_tok()?;
                    if !self.is_at(pk, "punc", Some("(")) {
                        self.bump()?;
                        let node = self.export_statement()?;
                        if self.is("punc", Some(";")) {
                            self.semicolon(false)?;
                        }
                        return Ok(node);
                    }
                    Err(self.unexpected(self.token))
                }
                _ => Err(self.unexpected(self.token)),
            },
            _ => Err(self.unexpected(self.token)),
        }
    }

    fn simple_statement(&mut self) -> Result<N, ParseError> {
        let body = self.expression(true, false)?;
        self.semicolon(false)?;
        Ok(self.mk(Data::Simple { body }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
    }

    fn labeled(&mut self) -> Result<N, ParseError> {
        let label = self.symbol(SymKind::Label)?;
        let name = match &label.data {
            Data::Symbol { name, .. } => name.clone(),
            _ => String::new(),
        };
        if name == "await" && self.in_async == self.in_function && self.in_function != 0 {
            return Err(self.at("await cannot be used as label inside async function", self.prev.unwrap_or(self.token)));
        }
        if self.labels.iter().any(|l| l.name == name) {
            return Err(self.croak(format!("Label {name} defined twice")));
        }
        self.expect_punc(":")?;
        self.labels.push(LabelFrame { name: name.clone(), continues: Vec::new() });
        let body = self.statement(false, false, false)?;
        let frame = self.labels.pop().unwrap();
        if !is_iteration(&body) {
            if let Some(tok) = frame.continues.first().copied() {
                return Err(self.at(
                    format!("Continue label `{name}` refers to non-IterationStatement."),
                    tok,
                ));
            }
        }
        Ok(self.mk(Data::Labeled { label, body }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
    }

    fn break_cont(&mut self, is_break: bool) -> Result<N, ParseError> {
        let label = if !self.can_asi() && self.is("name", None) {
            let idx = self.token;
            let node = self.symbol(SymKind::LabelRef)?;
            let lname = match &node.data {
                Data::Symbol { name, .. } => name.clone(),
                _ => String::new(),
            };
            if let Some(frame) = self.labels.iter_mut().rev().find(|l| l.name == lname) {
                if !is_break {
                    frame.continues.push(idx);
                }
            } else {
                return Err(self.croak(format!("Undefined label {lname}")));
            }
            Some(node)
        } else {
            None
        };
        if label.is_none() && self.in_loop == 0 {
            let word = if is_break { "Break" } else { "Continue" };
            return Err(self.croak(format!("{word} not inside a loop or switch")));
        }
        self.semicolon(false)?;
        let data = if is_break { Data::Break { label } } else { Data::Continue { label } };
        Ok(self.mk(data, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
    }

    fn switch_like(&self) -> bool {
        false
    }

    fn block(&mut self) -> Result<Vec<N>, ParseError> {
        self.expect_punc("{")?;
        let mut body = Vec::new();
        while !self.is("punc", Some("}")) {
            if self.is("eof", None) {
                return Err(self.unexpected(self.token));
            }
            let before = self.token;
            body.push(self.statement(false, false, false)?);
            if self.token == before {
                return Err(self.unexpected(self.token));
            }
        }
        self.bump()?;
        Ok(body)
    }

    fn if_stmt(&mut self) -> Result<N, ParseError> {
        self.expect_punc("(")?;
        let cond = self.expression(true, false)?;
        self.expect_punc(")")?;
        let body = self.statement(false, false, true)?;
        let alt = if self.is("keyword", Some("else")) {
            self.bump()?;
            Some(self.statement(false, false, true)?)
        } else {
            None
        };
        Ok(self.mk(Data::If { cond, body, alt }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
    }

    fn switch_body(&mut self) -> Result<Vec<N>, ParseError> {
        self.expect_punc("{")?;
        let mut body = Vec::new();
        self.in_loop += 1;
        while !self.is("punc", Some("}")) && !self.is("eof", None) {
            if self.is("keyword", Some("case")) {
                let start = self.token;
                self.bump()?;
                let expr = self.expression(true, false)?;
                self.expect_punc(":")?;
                let stmts = self.switch_stmts()?;
                body.push(self.mk(Data::Case { expr, body: stmts }, start, self.prev.unwrap_or(start)));
            } else if self.is("keyword", Some("default")) {
                let start = self.token;
                self.bump()?;
                self.expect_punc(":")?;
                let stmts = self.switch_stmts()?;
                body.push(self.mk(Data::Default { body: stmts }, start, self.prev.unwrap_or(start)));
            } else {
                return Err(self.unexpected(self.token));
            }
        }
        self.in_loop -= 1;
        self.expect_punc("}")?;
        Ok(body)
    }

    fn switch_stmts(&mut self) -> Result<Vec<N>, ParseError> {
        let mut stmts = Vec::new();
        while !self.is("punc", Some("}"))
            && !self.is("keyword", Some("case"))
            && !self.is("keyword", Some("default"))
            && !self.is("eof", None)
        {
            let before = self.token;
            stmts.push(self.statement(false, false, false)?);
            if self.token == before {
                return Err(self.unexpected(self.token));
            }
        }
        Ok(stmts)
    }

    fn try_stmt(&mut self) -> Result<N, ParseError> {
        let body_stmts = self.block()?;
        let start_body = self.prev.unwrap_or(self.token);
        let body = self.mk(Data::Block { body: body_stmts }, start_body, start_body);
        let catch = if self.is("keyword", Some("catch")) {
            let start = self.token;
            self.bump()?;
            let arg = if self.is("punc", Some("(")) {
                self.bump()?;
                let a = if self.is("punc", Some("{")) || self.is("punc", Some("[")) {
                    self.binding(SymKind::Catch, &mut Tracker::new(false, self.tz.has_directive("use strict"), false))?
                } else {
                    self.symbol(SymKind::Catch)?
                };
                self.expect_punc(")")?;
                Some(a)
            } else {
                None
            };
            let stmts = self.block()?;
            let bstart = self.prev.unwrap_or(start);
            let b = self.mk(Data::Block { body: stmts }, bstart, bstart);
            Some(self.mk(Data::Catch { arg, body: b }, start, self.prev.unwrap_or(start)))
        } else {
            None
        };
        let finally = if self.is("keyword", Some("finally")) {
            let start = self.token;
            self.bump()?;
            let stmts = self.block()?;
            let block = self.mk(Data::Block { body: stmts }, start, self.prev.unwrap_or(start));
            Some(self.mk(Data::Finally { body: block }, start, self.prev.unwrap_or(start)))
        } else {
            None
        };
        if catch.is_none() && finally.is_none() {
            return Err(self.croak("Missing catch/finally blocks"));
        }
        Ok(self.mk(Data::Try { body, catch, finally }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
    }

    fn for_stmt(&mut self) -> Result<N, ParseError> {
        let mut await_tok = false;
        if self.is("name", Some("await")) {
            if !self.can_await() {
                return Err(self.croak("`for await` invalid in this context"));
            }
            await_tok = true;
            self.bump()?;
        }
        self.expect_punc("(")?;
        let mut init = None;
        if !self.is("punc", Some(";")) {
            if self.is("keyword", Some("var")) {
                self.bump()?;
                init = Some(self.var_decl(DefKind::Var, true, false)?);
            } else if self.is("keyword", Some("let")) {
                self.bump()?;
                init = Some(self.var_decl(DefKind::Let, true, false)?);
            } else if self.is("keyword", Some("const")) {
                self.bump()?;
                init = Some(self.var_decl(DefKind::Const, true, false)?);
            } else if self.is("name", Some("using")) {
                let pk = self.peek_tok()?;
                let take = self.is_at(pk, "name", None)
                    && (self.tz.str_val(pk) != Some("of") || {
                        let (ch, _) = self.tz.peek_next_token_start_or_newline();
                        ch.as_deref() == Some("=")
                    });
                if take {
                    self.bump()?;
                    init = Some(self.using_decl(true)?);
                } else {
                    init = Some(self.expression(true, true)?);
                }
            } else if self.is("name", Some("await")) && self.can_await() && {
                let pk = self.peek_tok()?;
                self.is_at(pk, "name", Some("using"))
            } {
                self.bump()?;
                init = Some(self.await_using(true)?);
            } else {
                init = Some(self.expression(true, true)?);
            }
            let is_in = self.is("operator", Some("in"));
            let is_of = self.is("name", Some("of"));
            if await_tok && !is_of {
                return Err(self.croak("`for await` invalid in this context"));
            }
            if is_in || is_of {
                if let Some(init_node) = &init {
                    if let Data::Defs { defs, kind, .. } = &init_node.data {
                        if defs.len() > 1 {
                            return Err(self.at_node(init_node, "Only one variable declaration allowed in for..in loop"));
                        }
                        if is_in && *kind == DefKind::Using {
                            return Err(self.at_node(init_node, "Invalid using declaration in for..in loop"));
                        }
                    } else if !is_assignable(init_node) {
                        let d = self.to_destructuring(init_node.clone())?;
                        if !matches!(d.data, Data::Destructuring { .. }) {
                            return Err(self.at_node(&d, "Invalid left-hand side in for..in loop"));
                        }
                        init = Some(d);
                    }
                }
                self.bump()?;
                let init = init.ok_or_else(|| self.croak("Invalid left-hand side in for..in loop"))?;
                let object = self.expression(true, false)?;
                self.expect_punc(")")?;
                self.in_loop += 1;
                let body = self.statement(false, true, false)?;
                self.in_loop -= 1;
                return if is_in {
                    Ok(self.mk(Data::ForIn { init, object, body }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
                } else {
                    Ok(self.mk(
                        Data::ForOf { init, object, body, await_: await_tok },
                        self.prev.unwrap_or(self.token),
                        self.prev.unwrap_or(self.token),
                    ))
                };
            }
        } else if await_tok {
            return Err(self.croak("`for await` invalid in this context"));
        }
        self.expect_punc(";")?;
        let cond = if self.is("punc", Some(";")) { None } else { Some(self.expression(true, false)?) };
        self.expect_punc(";")?;
        let step = if self.is("punc", Some(")")) { None } else { Some(self.expression(true, false)?) };
        self.expect_punc(")")?;
        self.in_loop += 1;
        let body = self.statement(false, true, false)?;
        self.in_loop -= 1;
        Ok(self.mk(Data::For { init, cond, step, body }, self.prev.unwrap_or(self.token), self.prev.unwrap_or(self.token)))
    }

    fn var_decl(&mut self, kind: DefKind, no_in: bool, await_: bool) -> Result<N, ParseError> {
        let sym = match kind {
            DefKind::Var => SymKind::Var,
            DefKind::Let => SymKind::Let,
            DefKind::Const => SymKind::Const,
            DefKind::Using => SymKind::Using,
        };
        let start = self.prev.unwrap_or(self.token);
        let defs = self.vardefs(no_in, kind, sym)?;
        Ok(self.mk(Data::Defs { kind, defs, await_ }, start, self.prev.unwrap_or(start)))
    }

    fn using_decl(&mut self, no_in: bool) -> Result<N, ParseError> {
        self.var_decl(DefKind::Using, no_in, false)
    }

    fn await_using(&mut self, no_in: bool) -> Result<N, ParseError> {
        self.bump()?;
        self.var_decl(DefKind::Using, no_in, true)
    }

    fn vardefs(&mut self, no_in: bool, kind: DefKind, sym: SymKind) -> Result<Vec<N>, ParseError> {
        let mut defs = Vec::new();
        loop {
            let start = self.token;
            let name = if self.is("punc", Some("{")) || self.is("punc", Some("[")) {
                self.binding(sym, &mut Tracker::new(false, self.tz.has_directive("use strict"), kind == DefKind::Var))?
            } else {
                self.symbol(sym)?
            };
            if matches!(&name.data, Data::Symbol { name, .. } if name == "import") {
                return Err(self.croak("Unexpected token: import"));
            }
            let value = if self.is("operator", Some("=")) {
                self.bump()?;
                Some(self.expression(false, no_in)?)
            } else {
                None
            };
            if value.is_none() && !no_in && matches!(kind, DefKind::Const | DefKind::Using) {
                let label = match kind {
                    DefKind::Const => "const",
                    DefKind::Using => "using",
                    _ => "const",
                };
                return Err(self.croak(format!("Missing initializer in {label} declaration")));
            }
            defs.push(self.mk(Data::VarDef { name, value }, start, self.prev.unwrap_or(start)));
            if !self.is("punc", Some(",")) {
                break;
            }
            self.bump()?;
        }
        Ok(defs)
    }

    fn function(&mut self, kind: FuncKind, generator: bool, async_: bool, export_default: bool) -> Result<N, ParseError> {
        let mut generator = generator;
        let mut kind = kind;
        if self.is("operator", Some("*")) {
            generator = true;
            self.bump()?;
        }
        let in_stmt = kind == FuncKind::Decl;
        let name = if self.is("name", None) {
            Some(self.symbol(if in_stmt { SymKind::Defun } else { SymKind::Lambda })?)
        } else {
            None
        };
        if in_stmt && name.is_none() {
            if export_default {
                kind = FuncKind::Expr;
            } else {
                return Err(self.unexpected(self.token));
            }
        }
        let start = self.token;
        let (args, body) = self.function_body(true, generator, async_, true)?;
        Ok(self.mk(
            Data::Func { kind, name, args, body, async_, generator },
            start,
            self.prev.unwrap_or(start),
        ))
    }

    fn function_body(&mut self, block: bool, generator: bool, async_: bool, parse_params: bool) -> Result<(Vec<N>, Vec<N>), ParseError> {
        let loop_ = self.in_loop;
        let labels = self.labels.clone();
        let gen = self.in_generator;
        let asy = self.in_async;
        self.in_function += 1;
        if generator {
            self.in_generator = self.in_function;
        }
        if async_ {
            self.in_async = self.in_function;
        }
        let args = if parse_params {
            self.parameters()?
        } else {
            Vec::new()
        };
        if block {
            self.in_directives = true;
        }
        self.in_loop = 0;
        self.labels.clear();
        let body = if block {
            self.tz.push_directives_stack();
            let b = self.block()?;
            self.tz.pop_directives_stack();
            b
        } else {
            let start = self.token;
            let value = self.expression(false, false)?;
            vec![self.mk(Data::Return { value: Some(value) }, start, self.prev.unwrap_or(start))]
        };
        self.in_function -= 1;
        self.in_loop = loop_;
        self.labels = labels;
        self.in_generator = gen;
        self.in_async = asy;
        Ok((args, body))
    }

    fn parameters(&mut self) -> Result<Vec<N>, ParseError> {
        let mut tr = Tracker::new(true, self.tz.has_directive("use strict"), false);
        self.expect_punc("(")?;
        let mut params = Vec::new();
        while !self.is("punc", Some(")")) {
            params.push(self.parameter(&mut tr)?);
            if !self.is("punc", Some(")")) {
                self.expect_punc(",")?;
            }
            if matches!(params.last().map(|p| &p.data), Some(Data::Spread { .. })) {
                break;
            }
        }
        self.bump()?;
        self.check_strict(&tr)?;
        Ok(params)
    }

    fn parameter(&mut self, tr: &mut Tracker) -> Result<N, ParseError> {
        let mut expand = None;
        if self.is("expand", None) || self.is("punc", Some("...")) || self.sval() == "..." {
            expand = Some(self.token);
            tr.spread = true;
            self.bump()?;
        }
        let mut param = self.binding(SymKind::Funarg, tr)?;
        if self.is("operator", Some("=")) && expand.is_none() {
            tr.default_assign = true;
            let start = self.token_index_of(&param).unwrap_or(self.token);
            self.bump()?;
            let right = self.expression(false, false)?;
            param = self.mk(Data::DefaultAssign { left: param, right }, start, self.prev.unwrap_or(self.token));
        }
        if let Some(exp) = expand {
            if !self.is("punc", Some(")")) {
                return Err(self.unexpected(self.token));
            }
            param = self.mk(Data::Spread { expr: param }, exp, exp);
        }
        self.check_strict(tr)?;
        Ok(param)
    }

    fn check_strict(&self, tr: &Tracker) -> Result<(), ParseError> {
        if tr.is_strict() {
            if let Some(dup) = tr.duplicate {
                if !tr.duplicates_ok {
                    let name = self.tz.val_str(dup);
                    return Err(self.at(format!("Parameter {name} was used already"), dup));
                }
            }
        }
        Ok(())
    }

    fn binding(&mut self, sym: SymKind, tr: &mut Tracker) -> Result<N, ParseError> {
        if self.is("punc", Some("[")) {
            return self.array_binding(sym, tr);
        }
        if self.is("punc", Some("{")) {
            return self.object_binding(sym, tr);
        }
        if self.is("name", None) {
            if self.sval() == "this" {
                return Err(self.unexpected(self.token));
            }
            if tr.is_param {
                self.track_name(tr, self.token)?;
            }
            return self.symbol(sym);
        }
        Err(self.croak("Invalid function parameter"))
    }

    fn track_name(&mut self, tr: &mut Tracker, tok: usize) -> Result<(), ParseError> {
        let name = self.tz.val_str(tok);
        if !tr.names.insert(name.clone()) {
            if tr.duplicate.is_none() {
                tr.duplicate = Some(tok);
            }
            self.check_strict(tr)?;
        } else if tr.is_param && tr.strict && matches!(name.as_str(), "arguments" | "eval" | "yield") {
            return Err(self.at(format!("Unexpected {name} identifier as parameter inside strict mode"), tok));
        }
        Ok(())
    }

    fn array_binding(&mut self, sym: SymKind, tr: &mut Tracker) -> Result<N, ParseError> {
        let start = self.token;
        self.bump()?;
        let mut names = Vec::new();
        let mut first = true;
        while !self.is("punc", Some("]")) {
            if first {
                first = false;
            } else {
                self.expect_punc(",")?;
            }
            if self.is("punc", Some("]")) {
                break;
            }
            let mut expand = None;
            if self.sval() == "..." {
                expand = Some(self.token);
                tr.spread = true;
                self.bump()?;
            }
            if self.is("punc", Some(",")) {
                names.push(self.mk(Data::Hole, self.token, self.token));
                continue;
            }
            let mut el = self.binding(sym, tr)?;
            if self.is("operator", Some("=")) && expand.is_none() {
                tr.default_assign = true;
                self.bump()?;
                let right = self.expression(false, false)?;
                el = self.mk(Data::DefaultAssign { left: el, right }, start, self.prev.unwrap_or(start));
            }
            if let Some(exp) = expand {
                if !self.is("punc", Some("]")) {
                    return Err(self.croak("Rest element must be last element"));
                }
                el = self.mk(Data::Spread { expr: el }, exp, exp);
            }
            names.push(el);
        }
        self.expect_punc("]")?;
        Ok(self.mk(Data::Destructuring { array: true, names }, start, self.prev.unwrap_or(start)))
    }

    fn object_binding(&mut self, sym: SymKind, tr: &mut Tracker) -> Result<N, ParseError> {
        let start = self.token;
        self.bump()?;
        let mut names = Vec::new();
        let mut first = true;
        while !self.is("punc", Some("}")) {
            if first {
                first = false;
            } else {
                self.expect_punc(",")?;
            }
            if self.is("punc", Some("}")) {
                break;
            }
            if self.sval() == "..." {
                let exp = self.token;
                self.bump()?;
                let expr = self.binding(sym, tr)?;
                names.push(self.mk(Data::Spread { expr }, exp, self.prev.unwrap_or(exp)));
                continue;
            }
            if self.is("punc", Some("[")) {
                let prop_start = self.token;
                self.bump()?;
                let expr = self.expression(false, false)?;
                self.expect_punc("]")?;
                self.expect_punc(":")?;
                let value = self.binding(sym, tr)?;
                names.push(self.mk(
                    Data::Prop {
                        method: None,
                        key: Key::Computed(expr),
                        value,
                        static_: false,
                        private: false,
                        generator: false,
                        async_: false,
                    },
                    prop_start,
                    self.prev.unwrap_or(prop_start),
                ));
                continue;
            }
            let prop_start = self.token;
            if self.is("name", None) {
                let pk = self.peek_tok()?;
                let pv = self.tz.str_val(pk).unwrap_or("").to_string();
                if matches!(pv.as_str(), "," | "}" | "=") {
                    let key_name = self.sval();
                    if tr.is_param {
                        self.track_name(tr, self.token)?;
                    }
                    let value = self.symbol(sym)?;
                    let mut value = value;
                    if self.is("operator", Some("=")) {
                        tr.default_assign = true;
                        self.bump()?;
                        let right = self.expression(false, false)?;
                        value = self.mk(Data::DefaultAssign { left: value.clone(), right }, prop_start, self.prev.unwrap_or(prop_start));
                    }
                    names.push(self.mk(
                        Data::Prop {
                            method: None,
                            key: Key::Static { name: key_name, quote: None },
                            value,
                            static_: false,
                            private: false,
                            generator: false,
                            async_: false,
                        },
                        prop_start,
                        self.prev.unwrap_or(prop_start),
                    ));
                    continue;
                }
            }
            let (key, quote) = self.property_key()?;
            self.expect_punc(":")?;
            let mut value = self.binding(sym, tr)?;
            if self.is("operator", Some("=")) {
                self.bump()?;
                let right = self.expression(false, false)?;
                value = self.mk(Data::DefaultAssign { left: value, right }, prop_start, self.prev.unwrap_or(prop_start));
            }
            let key = match key {
                Some(k) => Key::Static { name: k, quote },
                None => return Err(self.unexpected(prop_start)),
            };
            names.push(self.mk(
                Data::Prop {
                    method: None,
                    key,
                    value,
                    static_: false,
                    private: false,
                    generator: false,
                    async_: false,
                },
                prop_start,
                self.prev.unwrap_or(prop_start),
            ));
        }
        self.expect_punc("}")?;
        Ok(self.mk(Data::Destructuring { array: false, names }, start, self.prev.unwrap_or(start)))
    }

    fn symbol(&mut self, kind: SymKind) -> Result<N, ParseError> {
        if !self.is("name", None) && !self.is("privatename", None) {
            return Err(self.croak("Name expected"));
        }
        let name = self.sval();
        let start = self.token;
        let quote = self.tz.quote(start);
        self.verify_symbol(&name, kind, start)?;
        self.bump()?;
        let data = if name == "this" {
            Data::This
        } else if name == "super" {
            Data::Super
        } else {
            Data::Symbol { name, kind, quote }
        };
        Ok(self.mk(data, start, start))
    }

    fn verify_symbol(&self, name: &str, kind: SymKind, tok: usize) -> Result<(), ParseError> {
        if self.in_generator() && name == "yield" {
            return Err(self.at("Yield cannot be used as identifier inside generators", tok));
        }
        if self.tz.has_directive("use strict") {
            if name == "yield" {
                return Err(self.at("Unexpected yield identifier inside strict mode", tok));
            }
            let decl = !matches!(kind, SymKind::Ref | SymKind::Label | SymKind::LabelRef);
            if decl && (name == "arguments" || name == "eval") {
                if matches!(kind, SymKind::Funarg | SymKind::Catch) {
                    return Err(self.at(format!("Unexpected {name} identifier as parameter inside strict mode"), tok));
                }
                return Err(self.at(format!("Unexpected {name} in strict mode"), tok));
            }
        }
        Ok(())
    }

    fn expression(&mut self, commas: bool, no_in: bool) -> Result<N, ParseError> {
        let start = self.token;
        let mut exprs = vec![self.maybe_assign(no_in)?];
        if commas {
            while self.is("punc", Some(",")) {
                self.bump()?;
                exprs.push(self.maybe_assign(no_in)?);
            }
        }
        if exprs.len() == 1 {
            Ok(exprs.pop().unwrap())
        } else {
            Ok(self.mk(Data::Seq { exprs }, start, self.prev.unwrap_or(start)))
        }
    }

    fn maybe_assign(&mut self, no_in: bool) -> Result<N, ParseError> {
        self.handle_regexp()?;
        let start = self.token;
        if self.is("name", Some("yield")) {
            if self.in_generator() {
                self.bump()?;
                return self.yield_expr();
            } else if self.tz.has_directive("use strict") {
                return Err(self.at("Unexpected yield identifier inside strict mode", self.token));
            }
        }
        let left = self.maybe_conditional(no_in)?;
        if self.is("operator", None) && is_assign_op(&self.sval()) {
            let op = self.sval();
            let logical = matches!(op.as_str(), "||=" | "&&=" | "??=");
            let mut left = left;
            if !is_assignable(&left) {
                left = self.to_destructuring(left)?;
                if !matches!(left.data, Data::Destructuring { .. }) {
                    return Err(self.croak("Invalid assignment"));
                }
            }
            self.bump()?;
            let right = self.maybe_assign(no_in)?;
            return Ok(self.mk(Data::Assign { op, left, right, logical }, start, self.prev.unwrap_or(start)));
        }
        Ok(left)
    }

    fn maybe_conditional(&mut self, no_in: bool) -> Result<N, ParseError> {
        let start = self.token;
        let expr = self.expr_ops(no_in, 0)?;
        if self.is("operator", Some("?")) {
            self.bump()?;
            let cons = self.expression(false, false)?;
            self.expect_punc(":")?;
            let alt = self.expression(false, no_in)?;
            return Ok(self.mk(Data::Cond { cond: expr, cons, alt }, start, self.prev.unwrap_or(start)));
        }
        Ok(expr)
    }

    fn expr_ops(&mut self, no_in: bool, min_prec: i32) -> Result<N, ParseError> {
        if !no_in && min_prec < prec("in") && self.is("privatename", None) {
            if !self.in_class {
                return Err(self.croak("Private field must be used in an enclosing class"));
            }
            let start = self.token;
            let key = self.mk(Data::Symbol { name: self.sval(), kind: SymKind::Private, quote: None }, start, start);
            self.bump()?;
            self.expect("operator", "in")?;
            let value = self.expr_ops(no_in, prec("in"))?;
            let node = self.mk(Data::PrivateIn { key, value }, start, self.prev.unwrap_or(start));
            return self.expr_op(node, 0, no_in);
        }
        let left = self.maybe_unary()?;
        self.expr_op(left, min_prec, no_in)
    }

    fn expr_op(&mut self, left: N, min_prec: i32, no_in: bool) -> Result<N, ParseError> {
        let mut left = left;
        loop {
            if !self.is("operator", None) {
                break;
            }
            let op = self.sval();
            if op == "in" && no_in {
                break;
            }
            let Some(p) = prec_opt(&op) else { break };
            if !(p > min_prec || (op == "**" && min_prec == p)) {
                break;
            }
            if op == "**" {
                if let Data::Unary { op: uop, prefix: true, .. } = &left.data {
                    if uop != "++" && uop != "--" {
                        let is_paren = left.start.as_ref().map(|t| t.ty == "punc" && t.value == "(").unwrap_or(false);
                        if !is_paren {
                            if let Some(t) = left.start.clone() {
                                return Err(self.unexpected_tok(&t));
                            }
                            return Err(self.unexpected(self.token));
                        }
                    }
                }
            }
            self.bump()?;
            let right = self.expr_ops(no_in, p)?;
            let start = left.start.as_ref().map(|t| t.pos as usize).unwrap_or(0);
            let _ = start;
            let end = self.prev.unwrap_or(self.token);
            let span_start = self.token_index_of(&left).unwrap_or(end);
            left = self.mk(Data::Binary { op, left, right }, span_start, end);
        }
        Ok(left)
    }

    fn token_index_of(&self, node: &N) -> Option<usize> {
        let pos = node.start.as_ref()?.pos;
        self.tz.tokens.iter().position(|t| t.pos == pos)
    }

    fn maybe_unary(&mut self) -> Result<N, ParseError> {
        if self.is("name", Some("await")) && self.can_await() {
            let start = self.token;
            self.bump()?;
            let expr = self.maybe_unary()?;
            return Ok(self.mk(Data::Await { expr }, start, self.prev.unwrap_or(start)));
        }
        if self.is("operator", None) && is_unary_prefix(&self.sval()) {
            let start = self.token;
            let op = self.sval();
            self.bump()?;
            self.handle_regexp()?;
            let expr = self.maybe_unary()?;
            if matches!(op.as_str(), "++" | "--") && !is_assignable(&expr) {
                return Err(self.at(format!("Invalid use of {op} operator"), start));
            }
            if op == "delete" {
                if let Data::Symbol { kind: SymKind::Ref, .. } = &expr.data {
                    if self.tz.has_directive("use strict") {
                        let line = expr.start.as_ref().map(|t| t.line).unwrap_or(0);
                        let col = expr.start.as_ref().map(|t| t.col).unwrap_or(0);
                        return Err(ParseError {
                            message: "Calling delete on expression not allowed in strict mode".into(),
                            line,
                            col,
                        });
                    }
                }
            }
            return Ok(self.mk(Data::Unary { op, expr, prefix: true }, start, self.prev.unwrap_or(start)));
        }
        let start = self.token;
        let mut val = self.expr_atom()?;
        while self.is("operator", None) && is_unary_postfix(&self.sval()) && !self.tz.has_newline_before(self.token) {
            if matches!(val.data, Data::Func { kind: FuncKind::Arrow, .. }) {
                return Err(self.unexpected(self.token));
            }
            let op = self.sval();
            if !is_assignable(&val) {
                return Err(self.at(format!("Invalid use of {op} operator"), self.token));
            }
            let end = self.token;
            self.bump()?;
            val = self.mk(Data::Unary { op, expr: val, prefix: false }, start, end);
        }
        Ok(val)
    }

    fn expr_atom(&mut self) -> Result<N, ParseError> {
        if self.is("operator", Some("new")) {
            return self.new_expr();
        }
        if self.is("name", Some("import")) {
            return self.import_expr();
        }
        let start = self.token;
        let mut async_node = None;
        if self.is("name", Some("async")) {
            let pk = self.peek_tok()?;
            let pv = self.tz.str_val(pk).unwrap_or("");
            if pv != "[" && self.tz.ty(pk) != "arrow" {
                async_node = Some(self.atom_node()?);
            }
        }
        if self.is("punc", None) {
            match self.sval().as_str() {
                "(" => {
                    let paren = self.token;
                    let exprs = self.params_or_seq(true, async_node.is_none())?;
                    if self.is("arrow", Some("=>")) {
                        let args = self.to_fun_args_list(exprs)?;
                        return self.arrow(start, args, async_node.is_some());
                    }
                    let ex = if let Some(callee) = async_node {
                        let end = self.prev.unwrap_or(start);
                        self.mk(Data::Call { expr: callee, args: exprs, optional: false, is_new: false }, start, end)
                    } else if exprs.len() == 1 {
                        self.stamp_start(exprs.into_iter().next().unwrap(), paren)
                    } else if exprs.is_empty() {
                        return Err(self.croak("Invalid parenthesized expression"));
                    } else {
                        self.mk(Data::Seq { exprs }, start, self.prev.unwrap_or(start))
                    };
                    return self.subscripts(ex, true);
                }
                "[" => {
                    let arr = self.array_lit()?;
                    return self.subscripts(arr, true);
                }
                "{" => {
                    let obj = self.object_lit()?;
                    return self.subscripts(obj, true);
                }
                _ => {
                    if async_node.is_none() {
                        return Err(self.unexpected(self.token));
                    }
                }
            }
        }
        if self.is("name", None) {
            let pk = self.peek_tok()?;
            if self.tz.ty(pk) == "arrow" {
                let name = self.sval();
                let param = self.mk(Data::Symbol { name, kind: SymKind::Funarg, quote: None }, start, start);
                self.bump()?;
                return self.arrow(start, vec![param], async_node.is_some());
            }
        }
        if self.is("keyword", Some("function")) {
            self.bump()?;
            let func = self.function(FuncKind::Expr, false, async_node.is_some(), false)?;
            return self.subscripts(func, true);
        }
        if let Some(node) = async_node {
            return self.subscripts(node, true);
        }
        if self.is("keyword", Some("class")) {
            self.bump()?;
            let cls = self.class_decl(false, false)?;
            return self.subscripts(cls, true);
        }
        if self.is("template_head", None) {
            let t = self.template_string()?;
            return self.subscripts(t, true);
        }
        if matches!(self.ty(), "name" | "num" | "big_int" | "string" | "regexp" | "atom") {
            let node = self.atom_node()?;
            return self.subscripts(node, true);
        }
        Err(self.unexpected(self.token))
    }

    fn atom_node(&mut self) -> Result<N, ParseError> {
        let start = self.token;
        let ty = self.ty();
        let node = match ty {
            "name" | "privatename" => {
                let name = self.sval();
                let quote = self.tz.quote(start);
                if name == "this" {
                    Data::This
                } else if name == "super" {
                    Data::Super
                } else {
                    Data::Symbol { name, kind: SymKind::Ref, quote }
                }
            }
            "num" => {
                let n = self.tz.num_val(start).unwrap_or(f64::NAN);
                if n.is_infinite() {
                    Data::Infinity
                } else {
                    Data::Number { value: n, raw: self.tz.latest_raw.clone() }
                }
            }
            "big_int" => Data::BigInt { value: self.sval() },
            "string" => Data::String {
                value: self.sval(),
                quote: self.tz.quote(start).unwrap_or('"'),
                units: self.tz.units_of(start),
            },
            "regexp" => {
                let raw = self.sval();
                let (source, flags) = split_regexp(&raw);
                Data::RegExp { source, flags }
            }
            "atom" => match self.sval().as_str() {
                "false" => Data::False,
                "true" => Data::True,
                "null" => Data::Null,
                _ => return Err(self.unexpected(start)),
            },
            _ => return Err(self.unexpected(start)),
        };
        self.bump()?;
        Ok(self.mk(node, start, start))
    }

    fn new_expr(&mut self) -> Result<N, ParseError> {
        let start = self.token;
        self.expect("operator", "new")?;
        if self.is("punc", Some(".")) {
            self.bump()?;
            self.expect("name", "target")?;
            let node = self.mk(Data::NewTarget, start, self.prev.unwrap_or(start));
            return self.subscripts(node, true);
        }
        let expr = self.expr_atom_no_call()?;
        let args = if self.is("punc", Some("(")) {
            self.bump()?;
            self.expr_list(")", true, false)?
        } else {
            Vec::new()
        };
        let node = self.mk(Data::Call { expr, args, optional: false, is_new: true }, start, self.prev.unwrap_or(start));
        self.subscripts(node, true)
    }

    fn expr_atom_no_call(&mut self) -> Result<N, ParseError> {
        // expr_atom with allow_calls false is only used for `new`. Reuse expr_atom but stop calls
        // by parsing a restricted atom. Fall back to expr_atom which allows calls; `new foo()` is
        // `new` + member, and the call parens belong to new. expr_atom's subscripts would consume
        // the call. So parse without subscripts' calls.
        self.expr_atom_limited()
    }

    fn expr_atom_limited(&mut self) -> Result<N, ParseError> {
        if self.is("operator", Some("new")) {
            return self.new_expr();
        }
        let start = self.token;
        if self.is("punc", Some("(")) {
            self.bump()?;
            let expr = self.expression(true, false)?;
            self.expect_punc(")")?;
            return self.subscripts_limited(expr);
        }
        if self.is("punc", Some("[")) {
            let arr = self.array_lit()?;
            return self.subscripts_limited(arr);
        }
        if self.is("punc", Some("{")) {
            let obj = self.object_lit()?;
            return self.subscripts_limited(obj);
        }
        if self.is("keyword", Some("function")) {
            self.bump()?;
            let func = self.function(FuncKind::Expr, false, false, false)?;
            return self.subscripts_limited(func);
        }
        if self.is("keyword", Some("class")) {
            self.bump()?;
            let cls = self.class_decl(false, false)?;
            return self.subscripts_limited(cls);
        }
        if matches!(self.ty(), "name" | "num" | "big_int" | "string" | "regexp" | "atom" | "template_head") {
            let node = if self.is("template_head", None) { self.template_string()? } else { self.atom_node()? };
            let _ = start;
            return self.subscripts_limited(node);
        }
        Err(self.unexpected(self.token))
    }

    fn subscripts_limited(&mut self, mut expr: N) -> Result<N, ParseError> {
        loop {
            if self.is("punc", Some(".")) || self.is("punc", Some("[")) || self.is("punc", Some("?.")) {
                expr = self.one_subscript(expr, false)?;
            } else {
                break;
            }
        }
        Ok(expr)
    }

    fn subscripts(&mut self, expr: N, allow_calls: bool) -> Result<N, ParseError> {
        self.subscripts_chain(expr, allow_calls, false)
    }

    fn subscripts_chain(&mut self, expr: N, allow_calls: bool, is_chain: bool) -> Result<N, ParseError> {
        let mut expr = expr;
        loop {
            if self.is("punc", Some(".")) || self.is("punc", Some("[")) || (allow_calls && self.is("punc", Some("("))) || self.is("punc", Some("?.")) || self.is("template_head", None)
            {
                if self.is("template_head", None) {
                    if is_chain {
                        return Err(self.unexpected(self.token));
                    }
                    let template = self.template_string()?;
                    let start = self.prev.unwrap_or(self.token);
                    expr = self.mk(Data::TaggedTemplate { tag: expr, template }, start, self.prev.unwrap_or(start));
                    continue;
                }
                if self.is("punc", Some("?.")) {
                    expr = self.optional_chain(expr, allow_calls)?;
                    break;
                }
                expr = self.one_subscript(expr, allow_calls)?;
            } else {
                break;
            }
        }
        Ok(expr)
    }

    fn one_subscript(&mut self, expr: N, allow_calls: bool) -> Result<N, ParseError> {
        let start = self.token;
        if self.is("punc", Some(".")) {
            self.bump()?;
            if self.is("privatename", None) && !self.in_class {
                return Err(self.croak("Private field must be used in an enclosing class"));
            }
            let private = self.is("privatename", None);
            let prop = if self.is("name", None) || self.is("privatename", None) {
                let n = self.sval();
                self.bump()?;
                n
            } else {
                return Err(self.unexpected(self.token));
            };
            return Ok(self.mk(
                Data::Dot { expr, prop, optional: false, quote: None, private },
                start,
                self.prev.unwrap_or(start),
            ));
        }
        if self.is("punc", Some("[")) {
            self.bump()?;
            let prop = self.expression(true, false)?;
            self.expect_punc("]")?;
            return Ok(self.mk(Data::Sub { expr, prop, optional: false }, start, self.prev.unwrap_or(start)));
        }
        if allow_calls && self.is("punc", Some("(")) {
            self.bump()?;
            let args = self.call_args()?;
            return Ok(self.mk(
                Data::Call { expr, args, optional: false, is_new: false },
                start,
                self.prev.unwrap_or(start),
            ));
        }
        Ok(expr)
    }

    fn optional_chain(&mut self, expr: N, allow_calls: bool) -> Result<N, ParseError> {
        let head = expr.start.clone();
        let start = self.token;
        self.bump()?;
        let inner = if allow_calls && self.is("punc", Some("(")) {
            self.bump()?;
            let args = self.call_args()?;
            self.mk(Data::Call { expr, args, optional: true, is_new: false }, start, self.prev.unwrap_or(start))
        } else if self.is("name", None) || self.is("privatename", None) {
            if self.is("privatename", None) && !self.in_class {
                return Err(self.croak("Private field must be used in an enclosing class"));
            }
            let private = self.is("privatename", None);
            let prop = self.sval();
            self.bump()?;
            self.mk(Data::Dot { expr, prop, optional: true, quote: None, private }, start, self.prev.unwrap_or(start))
        } else if self.is("punc", Some("[")) {
            self.bump()?;
            let prop = self.expression(true, false)?;
            self.expect_punc("]")?;
            self.mk(Data::Sub { expr, prop, optional: true }, start, self.prev.unwrap_or(start))
        } else {
            return Err(self.unexpected(self.token));
        };
        let continued = self.subscripts_chain(inner, allow_calls, true)?;
        if matches!(continued.data, Data::Chain { .. }) {
            return Ok(self.with_start(continued, head));
        }
        let chain = self.mk(Data::Chain { expr: continued }, start, self.prev.unwrap_or(start));
        Ok(self.with_start(chain, head))
    }

    fn with_start(&self, mut node: N, start: Option<ast::Tok>) -> N {
        if let Some(s) = start {
            if let Some(n) = Rc::get_mut(&mut node) {
                n.start = Some(s);
            }
        }
        node
    }

    fn call_args(&mut self) -> Result<Vec<N>, ParseError> {
        let mut args = Vec::new();
        while !self.is("punc", Some(")")) {
            if self.sval() == "..." {
                let start = self.token;
                self.bump()?;
                let expr = self.expression(false, false)?;
                args.push(self.mk(Data::Spread { expr }, start, self.prev.unwrap_or(start)));
            } else {
                args.push(self.expression(false, false)?);
            }
            if !self.is("punc", Some(")")) {
                self.expect_punc(",")?;
            }
        }
        self.bump()?;
        Ok(args)
    }

    fn expr_list(&mut self, closing: &str, trailing: bool, holes: bool) -> Result<Vec<N>, ParseError> {
        let mut a = Vec::new();
        let mut first = true;
        while !self.is("punc", Some(closing)) {
            if first {
                first = false;
            } else {
                self.expect_punc(",")?;
            }
            if trailing && self.is("punc", Some(closing)) {
                break;
            }
            if holes && self.is("punc", Some(",")) {
                a.push(self.mk(Data::Hole, self.token, self.token));
            } else if self.sval() == "..." {
                let start = self.token;
                self.bump()?;
                let expr = self.expression(false, false)?;
                a.push(self.mk(Data::Spread { expr }, start, self.prev.unwrap_or(start)));
            } else {
                a.push(self.expression(false, false)?);
            }
        }
        self.bump()?;
        Ok(a)
    }

    fn array_lit(&mut self) -> Result<N, ParseError> {
        let start = self.token;
        self.expect_punc("[")?;
        let elements = self.expr_list("]", true, true)?;
        Ok(self.mk(Data::Array { elements }, start, self.prev.unwrap_or(start)))
    }

    fn object_lit(&mut self) -> Result<N, ParseError> {
        let start = self.token;
        self.expect_punc("{")?;
        let mut props = Vec::new();
        let mut first = true;
        while !self.is("punc", Some("}")) {
            if first {
                first = false;
            } else {
                self.expect_punc(",")?;
            }
            if self.is("punc", Some("}")) {
                break;
            }
            let prop_start = self.token;
            if self.is("privatename", None) {
                return Err(self.croak("private fields are not allowed in an object"));
            }
            if self.sval() == "..." {
                self.bump()?;
                let expr = self.expression(false, false)?;
                props.push(self.mk(Data::Spread { expr }, prop_start, self.prev.unwrap_or(prop_start)));
                continue;
            }
            if let Some(prop) = self.method_or_key(false)? {
                props.push(prop);
                continue;
            }
            let (key_name, quote) = self.property_key()?;
            let value = if !self.is("punc", Some(":")) {
                let name = key_name.clone().unwrap_or_default();
                self.mk(Data::Symbol { name, kind: SymKind::Ref, quote: None }, self.prev.unwrap_or(prop_start), self.prev.unwrap_or(prop_start))
            } else {
                self.bump()?;
                self.expression(false, false)?
            };
            let key = match key_name {
                Some(name) => Key::Static { name, quote },
                None => return Err(self.unexpected(prop_start)),
            };
            props.push(self.mk(
                Data::Prop { method: None, key, value, static_: false, private: false, generator: false, async_: false },
                prop_start,
                self.prev.unwrap_or(prop_start),
            ));
        }
        self.expect_punc("}")?;
        Ok(self.mk(Data::Object { props }, start, self.prev.unwrap_or(start)))
    }

    fn method_or_key(&mut self, is_class: bool) -> Result<Option<N>, ParseError> {
        let start = self.token;
        let mut static_ = false;
        let mut async_ = false;
        let mut generator = false;
        let mut accessor: Option<String> = None;
        if is_class && self.sval() == "static" {
            let pk = self.peek_tok()?;
            let next_is_method_end = self.is_at(pk, "punc", Some("("))
                || self.is_at(pk, "punc", Some(","))
                || self.is_at(pk, "punc", Some("}"))
                || self.is_at(pk, "punc", Some(";"))
                || self.is_at(pk, "operator", Some("="));
            if !next_is_method_end {
                if self.is_at(pk, "punc", Some("{")) {
                    self.bump()?;
                    let body = self.block()?;
                    return Ok(Some(self.mk(Data::StaticBlock { body }, start, self.prev.unwrap_or(start))));
                }
                static_ = true;
                self.bump()?;
            }
        }
        if self.sval() == "async" {
            let pk = self.peek_tok()?;
            let ends = self.is_at(pk, "punc", Some("("))
                || self.is_at(pk, "punc", Some(":"))
                || self.is_at(pk, "operator", Some("="))
                || self.is_at(pk, "punc", Some(";"))
                || self.is_at(pk, "punc", Some("}"))
                || self.is_at(pk, "punc", Some(","));
            if !ends && !self.is("privatename", None) {
                async_ = true;
                self.bump()?;
            }
        }
        if self.is("operator", Some("*")) {
            generator = true;
            self.bump()?;
        }
        if self.sval() == "get" || self.sval() == "set" {
            let pk = self.peek_tok()?;
            let ends = self.is_at(pk, "punc", Some("("))
                || self.is_at(pk, "punc", Some(":"))
                || self.is_at(pk, "operator", Some("="))
                || self.is_at(pk, "punc", Some(";"))
                || self.is_at(pk, "punc", Some("}"))
                || self.is_at(pk, "punc", Some(","));
            if !ends {
                accessor = Some(self.sval());
                self.bump()?;
            }
        }
        if self.is("punc", Some("(")) && !is_class {
            // concise method whose name was already... we haven't read the name.
        }
        let private = self.is("privatename", None);
        let key_tok = self.token;
        let quote = self.tz.quote(key_tok);
        let key = if self.is("punc", Some("[")) {
            self.bump()?;
            let expr = self.expression(false, false)?;
            self.expect_punc("]")?;
            Key::Computed(expr)
        } else if self.is("operator", None) && self.sval().chars().all(|c| c.is_ascii_alphabetic()) {
            let name = self.sval();
            self.bump()?;
            Key::Static { name, quote: None }
        } else if self.is("name", None) || self.is("privatename", None) || self.is("string", None) || self.is("keyword", None) || self.is("atom", None) || self.is("num", None) || self.is("big_int", None) {
            let name = if self.is("num", None) {
                self.tz.num_val(self.token).map(|n| js_key(n)).unwrap_or_else(|| self.sval())
            } else {
                self.sval()
            };
            self.bump()?;
            if private || self.tz.ty(key_tok) == "privatename" {
                Key::Private(name)
            } else {
                Key::Static { name, quote }
            }
        } else if is_class && (self.is("punc", Some(";")) || self.is("punc", Some("}"))) {
            return Ok(None);
        } else {
            return Ok(None);
        };
        if accessor.is_some() || self.is("punc", Some("(")) {
            let method = match accessor.as_deref() {
                Some("get") => Some(MethodKind::Get),
                Some("set") => Some(MethodKind::Set),
                _ => Some(MethodKind::Method),
            };
            let (args, body) = self.function_body(true, generator, async_, true)?;
            let value = self.mk(
                Data::Func {
                    kind: if accessor.is_some() { FuncKind::Accessor } else { FuncKind::Expr },
                    name: None,
                    args,
                    body,
                    async_,
                    generator,
                },
                key_tok,
                self.prev.unwrap_or(key_tok),
            );
            let private_key = matches!(key, Key::Private(_));
            return Ok(Some(self.mk(
                Data::Prop { method, key, value, static_, private: private_key, generator, async_ },
                start,
                self.prev.unwrap_or(start),
            )));
        }
        if is_class {
            let value = if self.is("operator", Some("=")) {
                self.bump()?;
                Some(self.expression(false, false)?)
            } else {
                None
            };
            if value.is_some()
                || self.is("punc", Some(";"))
                || self.is("punc", Some("}"))
                || self.is("punc", Some("["))
                || self.is("name", None)
                || self.is("privatename", None)
                || self.is("string", None)
                || self.is("num", None)
                || self.is("big_int", None)
                || self.is("operator", Some("*"))
            {
                if self.is("punc", Some(";")) {
                    // semicolon printed by the field printer; consume it so the class loop progresses
                    self.bump()?;
                }
                let private_key = matches!(key, Key::Private(_)) || private;
                return Ok(Some(self.mk(
                    Data::Field { key, value, static_, private: private_key },
                    start,
                    self.prev.unwrap_or(start),
                )));
            }
        }
        // Not a method. Rewind is hard; signal the caller by returning None only when we didn't consume.
        // We already consumed the key. Build a keyval and let the caller not double-read.
        // Represent a pending key by returning a Prop with a dummy and let object_lit handle colon.
        // If the next token is `:`, this is a keyval and we should not have returned None.
        if self.is("punc", Some(":")) || self.is("operator", Some("=")) {
            let value = if self.is("punc", Some(":")) {
                self.bump()?;
                self.expression(false, false)?
            } else {
                let name = match &key {
                    Key::Static { name, .. } => name.clone(),
                    _ => String::new(),
                };
                let sym = self.mk(Data::Symbol { name, kind: SymKind::Ref, quote: None }, key_tok, key_tok);
                if self.is("operator", Some("=")) {
                    self.bump()?;
                    let right = self.expression(false, false)?;
                    self.mk(Data::DefaultAssign { left: sym, right }, key_tok, self.prev.unwrap_or(key_tok))
                } else {
                    sym
                }
            };
            return Ok(Some(self.mk(
                Data::Prop { method: None, key, value, static_: false, private: false, generator: false, async_: false },
                start,
                self.prev.unwrap_or(start),
            )));
        }
        let name = match &key {
            Key::Static { name, .. } => name.clone(),
            Key::Private(name) => name.clone(),
            Key::Computed(_) => String::new(),
        };
        let value = self.mk(Data::Symbol { name, kind: SymKind::Ref, quote: None }, key_tok, key_tok);
        Ok(Some(self.mk(
            Data::Prop { method: None, key, value, static_: false, private: false, generator: false, async_: false },
            start,
            self.prev.unwrap_or(start),
        )))
    }

    fn property_key(&mut self) -> Result<(Option<String>, Option<char>), ParseError> {
        if self.is("punc", Some("[")) {
            return Ok((None, None));
        }
        let word_op = self.is("operator", None) && self.sval().chars().all(|c| c.is_ascii_alphabetic());
        let ok = self.is("name", None)
            || self.is("privatename", None)
            || self.is("string", None)
            || self.is("keyword", None)
            || self.is("atom", None)
            || self.is("num", None)
            || self.is("big_int", None)
            || word_op;
        if !ok {
            return Err(self.unexpected(self.token));
        }
        let quote = self.tz.quote(self.token);
        let name = if self.is("num", None) {
            self.tz.num_val(self.token).map(js_key).unwrap_or_else(|| self.sval())
        } else {
            self.sval()
        };
        self.bump()?;
        Ok((Some(name), quote))
    }

    fn class_decl(&mut self, stmt: bool, export_default: bool) -> Result<N, ParseError> {
        let start = self.prev.unwrap_or(self.token);
        self.tz.push_directives_stack();
        self.tz.add_directive("use strict");
        let mut name = None;
        if self.is("name", None) && self.sval() != "extends" {
            name = Some(self.symbol(if stmt { SymKind::DefClass } else { SymKind::Class })?);
        }
        if stmt && name.is_none() && !export_default {
            return Err(self.unexpected(self.token));
        }
        let extends = if self.sval() == "extends" {
            self.bump()?;
            Some(self.expression(true, false)?)
        } else {
            None
        };
        self.expect_punc("{")?;
        let save = self.in_class;
        self.in_class = true;
        while self.is("punc", Some(";")) {
            self.bump()?;
        }
        let mut props = Vec::new();
        while !self.is("punc", Some("}")) && !self.is("eof", None) {
            if let Some(prop) = self.method_or_key(true)? {
                props.push(prop);
            } else {
                return Err(self.unexpected(self.token));
            }
            while self.is("punc", Some(";")) {
                self.bump()?;
            }
        }
        self.in_class = save;
        self.expect_punc("}")?;
        self.tz.pop_directives_stack();
        Ok(self.mk(Data::Class { stmt, name, extends, props }, start, self.prev.unwrap_or(start)))
    }

    fn arrow(&mut self, start: usize, args: Vec<N>, async_: bool) -> Result<N, ParseError> {
        if self.tz.has_newline_before(self.token) {
            return Err(self.croak("Unexpected newline before arrow (=>)"));
        }
        self.expect("arrow", "=>")?;
        let block = self.is("punc", Some("{"));
        let (_empty, body) = self.function_body(block, false, async_, false)?;
        // terser sets end to the statement array's `.end`, which is undefined.
        let mut node = self.mk(
            Data::Func { kind: FuncKind::Arrow, name: None, args, body, async_, generator: false },
            start,
            self.prev.unwrap_or(start),
        );
        if let Some(n) = Rc::get_mut(&mut node) {
            n.end = None;
        }
        Ok(node)
    }

    fn params_or_seq(&mut self, allow_arrows: bool, maybe_seq: bool) -> Result<Vec<N>, ParseError> {
        self.expect_punc("(")?;
        let mut a = Vec::new();
        let mut spread_tok: Option<usize> = None;
        let mut trailing: Option<usize> = None;
        let mut invalid: Option<usize> = None;
        while !self.is("punc", Some(")")) {
            if let Some(tok) = spread_tok {
                return Err(self.unexpected(tok));
            }
            if self.is("expand", None) {
                spread_tok = Some(self.token);
                if maybe_seq {
                    invalid = Some(self.token);
                }
                let st = self.token;
                self.bump()?;
                let expr = self.expression(false, false)?;
                a.push(self.mk(Data::Spread { expr }, st, self.prev.unwrap_or(st)));
            } else {
                a.push(self.expression(false, false)?);
            }
            if !self.is("punc", Some(")")) {
                self.expect_punc(",")?;
                if self.is("punc", Some(")")) {
                    trailing = self.prev;
                    if maybe_seq {
                        invalid = self.prev;
                    }
                    break;
                }
            }
        }
        self.expect_punc(")")?;
        if allow_arrows && self.is("arrow", Some("=>")) {
            if spread_tok.is_some() {
                if let Some(tok) = trailing {
                    return Err(self.unexpected(tok));
                }
            }
        } else if let Some(tok) = invalid {
            return Err(self.unexpected(tok));
        }
        Ok(a)
    }

    fn at_node(&self, node: &N, msg: &str) -> ParseError {
        if let Some(t) = &node.start {
            ParseError { message: msg.into(), line: t.line, col: t.col }
        } else {
            self.croak(msg)
        }
    }

    fn to_fun_args_list(&mut self, exprs: Vec<N>) -> Result<Vec<N>, ParseError> {
        exprs.into_iter().map(|e| self.to_fun_arg(e)).collect()
    }

    fn to_fun_arg(&mut self, ex: N) -> Result<N, ParseError> {
        match &ex.data {
            Data::Symbol { name, .. } => {
                let start = self.token_index_of(&ex).unwrap_or(self.token);
                Ok(self.mk(Data::Symbol { name: name.clone(), kind: SymKind::Funarg, quote: None }, start, start))
            }
            Data::Assign { left, right, op, .. } if op == "=" => {
                let left = self.to_fun_arg(left.clone())?;
                let start = self.token_index_of(&ex).unwrap_or(self.token);
                Ok(self.mk(Data::DefaultAssign { left, right: right.clone() }, start, start))
            }
            Data::Array { .. } | Data::Object { .. } => self.to_destructuring(ex),
            Data::Spread { expr } => {
                let inner = self.to_fun_arg(expr.clone())?;
                let start = self.token_index_of(&ex).unwrap_or(self.token);
                Ok(self.mk(Data::Spread { expr: inner }, start, start))
            }
            Data::Destructuring { .. } | Data::DefaultAssign { .. } => Ok(ex),
            _ => Err(self.croak("Invalid function parameter")),
        }
    }

    fn to_destructuring(&mut self, node: N) -> Result<N, ParseError> {
        let data = node.data.clone();
        match data {
            Data::Object { props } => {
                let mut names = Vec::new();
                for p in props {
                    names.push(self.to_destructuring(p)?);
                }
                let start = self.token_index_of_lost();
                Ok(self.mk(Data::Destructuring { array: false, names }, start, start))
            }
            Data::Array { elements } => {
                let mut names = Vec::new();
                for (i, el) in elements.into_iter().enumerate() {
                    let last = false;
                    let _ = (i, last);
                    names.push(self.to_destructuring(el)?);
                }
                let start = self.token;
                Ok(self.mk(Data::Destructuring { array: true, names }, start, start))
            }
            Data::Prop { key, value, .. } => {
                let value = self.to_destructuring(value)?;
                let start = self.token;
                Ok(self.mk(
                    Data::Prop { method: None, key, value, static_: false, private: false, generator: false, async_: false },
                    start,
                    start,
                ))
            }
            Data::Assign { left, right, .. } => {
                let left = self.to_destructuring(left)?;
                Ok(Rc::new(Node {
                    start: node.start.clone(),
                    end: node.end.clone(),
                    data: Data::DefaultAssign { left, right },
                }))
            }
            Data::Spread { expr } => {
                let expr = self.to_destructuring(expr)?;
                let start = self.token;
                Ok(self.mk(Data::Spread { expr }, start, start))
            }
            other => Ok(Rc::new(Node { start: node.start.clone(), end: node.end.clone(), data: other })),
        }
    }

    fn token_index_of_lost(&self) -> usize {
        self.prev.unwrap_or(self.token)
    }

    fn yield_expr(&mut self) -> Result<N, ParseError> {
        let start = self.prev.unwrap_or(self.token);
        let mut star = false;
        let expr = if self.can_asi() || (self.is("punc", None) && matches!(self.sval().as_str(), ";" | ")" | "]" | "," | ":")) {
            None
        } else if self.is("operator", Some("*")) {
            star = true;
            self.bump()?;
            Some(self.maybe_assign(false)?)
        } else {
            Some(self.maybe_assign(false)?)
        };
        Ok(self.mk(Data::Yield { expr, star }, start, self.prev.unwrap_or(start)))
    }

    fn template_string(&mut self) -> Result<N, ParseError> {
        let start = self.token;
        let mut segments = Vec::new();
        loop {
            let raw = self.tz.template_raws.get(&self.token).cloned().unwrap_or_default();
            let value = self.sval();
            let end = self.tz.template_end(self.token);
            let units = self.tz.units_of(self.token);
            segments.push(ast::Seg::Cooked { value, raw, units });
            if end {
                self.bump()?;
                break;
            }
            self.bump()?;
            self.handle_regexp()?;
            segments.push(ast::Seg::Expr(self.expression(true, false)?));
            if !self.is("template_cont", None) && !self.is("template_head", None) {
                return Err(self.unexpected(self.token));
            }
        }
        Ok(self.mk(Data::Template { segments }, start, self.prev.unwrap_or(start)))
    }

    fn import_expr(&mut self) -> Result<N, ParseError> {
        let start = self.token;
        self.expect("name", "import")?;
        if self.is("punc", Some("(")) {
            self.bump()?;
            let args = self.expr_list(")", true, false)?;
            let node = self.mk(Data::DynImport { args, phase: None }, start, self.prev.unwrap_or(start));
            return self.subscripts(node, true);
        }
        self.expect_punc(".")?;
        if self.is("name", Some("source")) || self.is("name", Some("defer")) {
            let phase = self.sval();
            self.bump()?;
            if !self.is("punc", Some("(")) {
                return Err(self.croak(format!("'import.{phase}' can only be used in a dynamic import")));
            }
            self.bump()?;
            let args = self.expr_list(")", true, false)?;
            let node = self.mk(Data::DynImport { args, phase: Some(phase) }, start, self.prev.unwrap_or(start));
            return self.subscripts(node, true);
        }
        self.expect("name", "meta")?;
        let node = self.mk(Data::ImportMeta, start, self.prev.unwrap_or(start));
        self.subscripts(node, true)
    }

    fn import_statement(&mut self) -> Result<N, ParseError> {
        let start = self.prev.unwrap_or(self.token);
        let mut phase = None;
        if self.is("name", Some("source")) || self.is("name", Some("defer")) {
            let pk = self.peek_tok()?;
            if !self.is_at(pk, "name", Some("from")) && !self.is_at(pk, "punc", Some(",")) {
                phase = Some(self.sval());
                self.bump()?;
            }
        }
        let imported_name = if self.is("name", None) { Some(self.symbol(SymKind::Import)?) } else { None };
        if self.is("punc", Some(",")) {
            self.bump()?;
        }
        let imported_names = self.map_names(true)?;
        if imported_name.is_some() || imported_names.is_some() {
            self.expect("name", "from")?;
        }
        if !self.is("string", None) {
            return Err(self.unexpected(self.token));
        }
        let module_name = self.atom_node()?;
        let attributes = self.maybe_attributes()?;
        Ok(self.mk(
            Data::Import { phase, imported_name, imported_names, module_name, attributes },
            start,
            self.prev.unwrap_or(start),
        ))
    }

    fn maybe_attributes(&mut self) -> Result<Option<N>, ParseError> {
        if (self.is("keyword", Some("with")) || self.is("name", Some("assert"))) && !self.tz.has_newline_before(self.token) {
            self.bump()?;
            return Ok(Some(self.object_lit()?));
        }
        Ok(None)
    }

    fn map_names(&mut self, is_import: bool) -> Result<Option<Vec<N>>, ParseError> {
        if self.is("punc", Some("{")) {
            self.bump()?;
            let mut names = Vec::new();
            while !self.is("punc", Some("}")) {
                names.push(self.map_name(is_import)?);
                if !self.is("punc", Some("}")) {
                    self.expect_punc(",")?;
                }
            }
            self.bump()?;
            return Ok(Some(names));
        }
        if self.is("operator", Some("*")) {
            self.bump()?;
            let mapped = if self.is("name", Some("as")) {
                self.bump()?;
                if is_import {
                    Some(self.symbol(SymKind::Import)?)
                } else {
                    Some(self.symbol_or_string(SymKind::ExportForeign)?)
                }
            } else {
                None
            };
            let start = self.prev.unwrap_or(self.token);
            let star = self.mk(Data::Symbol { name: "*".into(), kind: if is_import { SymKind::ImportForeign } else { SymKind::Export }, quote: None }, start, start);
            let (foreign, name) = if is_import {
                let name = mapped.unwrap_or_else(|| self.mk(Data::Symbol { name: "*".into(), kind: SymKind::Import, quote: None }, start, start));
                (star, name)
            } else {
                let foreign = mapped.unwrap_or_else(|| self.mk(Data::Symbol { name: "*".into(), kind: SymKind::ExportForeign, quote: None }, start, start));
                (foreign, star)
            };
            return Ok(Some(vec![self.mk(Data::NameMap { foreign, name }, start, start)]));
        }
        Ok(None)
    }

    fn map_name(&mut self, is_import: bool) -> Result<N, ParseError> {
        let start = self.token;
        let quote = self.tz.quote(start);
        let first = self.symbol_or_string(if is_import { SymKind::ImportForeign } else { SymKind::Export })?;
        let _ = quote;
        if self.is("name", Some("as")) {
            self.bump()?;
            let second = self.symbol_or_string(if is_import { SymKind::Import } else { SymKind::ExportForeign })?;
            let (foreign, name) = if is_import { (first, second) } else { (second, first) };
            Ok(self.mk(Data::NameMap { foreign, name }, start, self.prev.unwrap_or(start)))
        } else {
            let clone = self.clone_symbol(&first, if is_import { SymKind::Import } else { SymKind::ExportForeign });
            let (foreign, name) = if is_import { (first, clone) } else { (clone, first) };
            Ok(self.mk(Data::NameMap { foreign, name }, start, self.prev.unwrap_or(start)))
        }
    }

    fn clone_symbol(&mut self, node: &N, kind: SymKind) -> N {
        let (name, quote) = match &node.data {
            Data::Symbol { name, quote, .. } => (name.clone(), *quote),
            _ => (String::new(), None),
        };
        let start = self.token_index_of(node).unwrap_or(self.token);
        self.mk(Data::Symbol { name, kind, quote }, start, start)
    }

    fn symbol_or_string(&mut self, kind: SymKind) -> Result<N, ParseError> {
        if self.is("string", None) {
            let start = self.token;
            let name = self.sval();
            let quote = self.tz.quote(start);
            self.bump()?;
            return Ok(self.mk(Data::Symbol { name, kind, quote }, start, start));
        }
        if self.is("operator", None) && self.sval().chars().all(|c| c.is_ascii_alphabetic()) {
            let start = self.token;
            let name = self.sval();
            self.bump()?;
            return Ok(self.mk(Data::Symbol { name, kind, quote: None }, start, start));
        }
        if self.is("keyword", None) || self.is("name", None) {
            if self.is("keyword", None) {
                let start = self.token;
                let name = self.sval();
                self.bump()?;
                return Ok(self.mk(Data::Symbol { name, kind, quote: None }, start, start));
            }
            return self.symbol(kind);
        }
        Err(self.croak("Name or string expected"))
    }

    fn export_statement(&mut self) -> Result<N, ParseError> {
        let start = self.token;
        if self.is("name", Some("type")) || self.is("name", Some("interface")) {
            return Err(self.unexpected(self.token));
        }
        let mut is_default = false;
        if self.is("keyword", Some("default")) {
            is_default = true;
            self.bump()?;
        } else if let Some(names) = self.map_names(false)? {
            if self.is("name", Some("from")) {
                self.bump()?;
                if !self.is("string", None) {
                    return Err(self.unexpected(self.token));
                }
                let module_name = self.atom_node()?;
                let attributes = self.maybe_attributes()?;
                return Ok(self.mk(
                    Data::Export {
                        is_default,
                        names: Some(names),
                        value: None,
                        definition: None,
                        module_name: Some(module_name),
                        attributes,
                    },
                    start,
                    self.prev.unwrap_or(start),
                ));
            }
            return Ok(self.mk(
                Data::Export { is_default, names: Some(names), value: None, definition: None, module_name: None, attributes: None },
                start,
                self.prev.unwrap_or(start),
            ));
        }
        let pk = self.peek_tok()?;
        if self.is("punc", Some("{"))
            || (is_default && (self.is("keyword", Some("class")) || self.is("keyword", Some("function"))) && self.is_at(pk, "punc", None))
        {
            let value = self.expression(false, false)?;
            self.semicolon(false)?;
            return Ok(self.mk(
                Data::Export { is_default, names: None, value: Some(value), definition: None, module_name: None, attributes: None },
                start,
                self.prev.unwrap_or(start),
            ));
        }
        let node = self.statement(is_default, false, false)?;
        if matches!(node.data, Data::Defs { .. }) && is_default {
            if let Some(t) = node.start.clone() {
                return Err(self.unexpected_tok(&t));
            }
            return Err(self.unexpected(start));
        }
        if matches!(node.data, Data::Defs { .. } | Data::Func { kind: FuncKind::Decl, .. } | Data::Class { stmt: true, .. }) {
            return Ok(self.mk(
                Data::Export { is_default, names: None, value: None, definition: Some(node), module_name: None, attributes: None },
                start,
                self.prev.unwrap_or(start),
            ));
        }
        let value = match &node.data {
            Data::Simple { body } => Rc::clone(body),
            _ => node.clone(),
        };
        Ok(self.mk(
            Data::Export { is_default, names: None, value: Some(value), definition: None, module_name: None, attributes: None },
            start,
            self.prev.unwrap_or(start),
        ))
    }
}

fn is_iteration(n: &N) -> bool {
    matches!(
        n.data,
        Data::Do { .. } | Data::While { .. } | Data::For { .. } | Data::ForIn { .. } | Data::ForOf { .. }
    )
}

fn is_assignable(n: &N) -> bool {
    matches!(n.data, Data::Symbol { kind: SymKind::Ref, .. } | Data::Dot { .. } | Data::Sub { .. })
}

fn is_assign_op(op: &str) -> bool {
    matches!(
        op,
        "=" | "+=" | "-=" | "??=" | "&&=" | "||=" | "/=" | "*=" | "**=" | "%=" | ">>=" | "<<=" | ">>>=" | "|=" | "^=" | "&="
    )
}
fn is_unary_prefix(op: &str) -> bool {
    matches!(op, "typeof" | "void" | "delete" | "--" | "++" | "!" | "~" | "-" | "+")
}
fn is_unary_postfix(op: &str) -> bool {
    matches!(op, "--" | "++")
}
fn prec(op: &str) -> i32 {
    prec_opt(op).unwrap_or(0)
}
fn prec_opt(op: &str) -> Option<i32> {
    Some(match op {
        "||" => 1,
        "??" => 2,
        "&&" => 3,
        "|" => 4,
        "^" => 5,
        "&" => 6,
        "==" | "===" | "!=" | "!==" => 7,
        "<" | ">" | "<=" | ">=" | "in" | "instanceof" => 8,
        ">>" | "<<" | ">>>" => 9,
        "+" | "-" => 10,
        "*" | "/" | "%" => 11,
        "**" => 12,
        _ => return None,
    })
}

fn split_regexp(raw: &str) -> (String, String) {
    let bytes = raw.as_bytes();
    if bytes.first() != Some(&b'/') {
        return (raw.to_string(), String::new());
    }
    let mut i = raw.len();
    while i > 1 && bytes[i - 1].is_ascii_alphanumeric() {
        i -= 1;
    }
    if bytes.get(i - 1) == Some(&b'/') {
        (raw[1..i - 1].to_string(), raw[i..].to_string())
    } else {
        (raw.trim_start_matches('/').trim_end_matches('/').to_string(), String::new())
    }
}

fn js_key(n: f64) -> String {
    if n.is_infinite() {
        return if n.is_sign_negative() { "-Infinity".into() } else { "Infinity".into() };
    }
    if n == 0.0 {
        return "0".into();
    }
    let mut buf = ryu::Buffer::new();
    let mut s = buf.format_finite(n).to_string();
    if let Some(head) = s.strip_suffix(".0") {
        if !head.contains('.') && !head.contains('e') && !head.is_empty() {
            s = head.to_string();
        }
    }
    if let Some(i) = s.find('e') {
        if s.as_bytes().get(i + 1) != Some(&b'+') && s.as_bytes().get(i + 1) != Some(&b'-') {
            s.insert(i + 1, '+');
        }
    }
    s
}

// ryu is not a parser dependency. Format keys with Display.
fn _touch_val(v: TokVal) -> bool {
    matches!(v, TokVal::Undef)
}
