//! Tokenizer for the terser 5.51.4 parser.
//! Positions are UTF-16 code units, matching JavaScript strings.

use ast::{Comment, Tok};
use regex::Regex;
use std::collections::HashMap;
use std::sync::OnceLock;

pub struct PErr {
    pub message: String,
    pub line: u32,
    pub col: u32,
    pub eof: bool,
}

impl PErr {
    pub fn msg(message: impl Into<String>, line: u32, col: u32) -> Self {
        Self { message: message.into(), line, col, eof: false }
    }
    pub fn eof() -> Self {
        Self { message: String::new(), line: 0, col: 0, eof: true }
    }
}

#[derive(Clone, Debug)]
pub enum TokVal {
    Undef,
    Str(String),
    Num(f64),
}

impl TokVal {
    /// JavaScript string concatenation (`+`) of the token value.
    pub fn error_string(&self) -> String {
        match self {
            TokVal::Undef => "undefined".to_string(),
            TokVal::Str(s) => s.clone(),
            TokVal::Num(n) => js_num_to_string(*n),
        }
    }
    pub fn ast_string(&self) -> String {
        match self {
            TokVal::Undef => String::new(),
            TokVal::Str(s) => s.clone(),
            TokVal::Num(n) => js_num_to_string(*n),
        }
    }
    pub fn as_str(&self) -> Option<&str> {
        match self {
            TokVal::Str(s) => Some(s),
            _ => None,
        }
    }
}

/// `Number.prototype.toString(10)`, including `e+` for positive exponents.
pub fn js_num_to_string(n: f64) -> String {
    if n.is_nan() {
        return "NaN".to_string();
    }
    if n.is_infinite() {
        return if n.is_sign_negative() {
            "-Infinity".to_string()
        } else {
            "Infinity".to_string()
        };
    }
    if n == 0.0 {
        return "0".to_string();
    }
    let neg = n.is_sign_negative();
    let mut buf = ryu::Buffer::new();
    let (digits, exp) = ryu_digits(buf.format_finite(n.abs()));
    let k = digits.len() as i32;
    let nexp = exp + k;
    let body = if k <= nexp && nexp <= 21 {
        let mut s = digits;
        for _ in 0..(nexp - k) {
            s.push('0');
        }
        s
    } else if nexp > 0 && nexp <= 21 {
        let mut s = digits[..nexp as usize].to_string();
        s.push('.');
        s.push_str(&digits[nexp as usize..]);
        s
    } else if nexp > -6 && nexp <= 0 {
        let mut s = String::from("0.");
        for _ in 0..(-nexp) {
            s.push('0');
        }
        s.push_str(&digits);
        s
    } else {
        let mut s = digits[..1].to_string();
        if k > 1 {
            s.push('.');
            s.push_str(&digits[1..]);
        }
        let e = nexp - 1;
        s.push('e');
        if e >= 0 {
            s.push('+');
        }
        s.push_str(&e.to_string());
        s
    };
    if neg {
        format!("-{body}")
    } else {
        body
    }
}

/// Significant digits and the power of ten of the last digit (`value = int(digits) * 10^exp`).
fn ryu_digits(raw: &str) -> (String, i32) {
    let (mant, exp_adj) = if let Some(e) = raw.find(['e', 'E']) {
        ( &raw[..e], raw[e + 1..].parse::<i32>().unwrap_or(0) )
    } else {
        (raw, 0)
    };
    let mut digits = String::new();
    let mut after_dot = 0i32;
    let mut seen_dot = false;
    for c in mant.chars() {
        if c == '.' {
            seen_dot = true;
        } else if c.is_ascii_digit() {
            digits.push(c);
            if seen_dot {
                after_dot += 1;
            }
        }
    }
    if digits.is_empty() {
        return ("0".into(), 0);
    }
    let mut exp = exp_adj - after_dot;
    while digits.len() > 1 && digits.ends_with('0') {
        digits.pop();
        exp += 1;
    }
    while digits.starts_with('0') && digits.len() > 1 {
        digits.remove(0);
    }
    (digits, exp)
}

#[derive(Clone, Copy)]
struct JsCh {
    units: [u16; 2],
    len: u8,
}

impl JsCh {
    fn empty() -> Self {
        Self { units: [0, 0], len: 0 }
    }
    fn one(u: u16) -> Self {
        Self { units: [u, 0], len: 1 }
    }
    fn two(a: u16, b: u16) -> Self {
        Self { units: [a, b], len: 2 }
    }
    fn is_empty(self) -> bool {
        self.len == 0
    }
    fn code0(self) -> Option<u16> {
        if self.len == 0 { None } else { Some(self.units[0]) }
    }
    fn units(self) -> &'static [u16] {
        // not static — use slice via method below
        &[]
    }
    fn slice(self) -> [u16; 2] {
        self.units
    }
    fn as_string(self) -> String {
        String::from_utf16_lossy(&self.units[..self.len as usize])
    }
    fn eq(self, s: &str) -> bool {
        let enc: Vec<u16> = s.encode_utf16().collect();
        enc.as_slice() == &self.units[..self.len as usize]
    }
    fn is_u(self, u: u16) -> bool {
        self.len == 1 && self.units[0] == u
    }
    fn le_tilde(self) -> bool {
        self.len == 1 && self.units[0] <= 0x7e && self.units[0] != 0
    }
}

fn is_high(u: u16) -> bool {
    (0xd800..=0xdbff).contains(&u)
}
fn is_low(u: u16) -> bool {
    (0xdc00..=0xdfff).contains(&u)
}

fn id_start_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"\A(?:[$_]|\p{ID_Start})\z").unwrap())
}
fn id_cont_re() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"\A(?:[$]|[\u{200C}\u{200D}]|\p{ID_Continue})\z").unwrap())
}

pub fn is_identifier_start_broad(ch: &JsCh) -> bool {
    if ch.is_empty() {
        return false;
    }
    let s = ch.as_string();
    id_start_re().is_match(&s)
}
pub fn is_identifier_char_broad(ch: &JsCh) -> bool {
    if ch.is_empty() {
        return false;
    }
    let s = ch.as_string();
    id_cont_re().is_match(&s)
}

fn re_hex() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"(?i)\A0x[0-9a-f]+\z").unwrap())
}
fn re_oct() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"\A0[0-7]+\z").unwrap())
}
fn re_es6_oct() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"(?i)\A0o[0-7]+\z").unwrap())
}
fn re_bin() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"(?i)\A0b[01]+\z").unwrap())
}
fn re_dec() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"(?i)\A\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?\z").unwrap())
}
fn re_bigint() -> &'static Regex {
    static RE: OnceLock<Regex> = OnceLock::new();
    RE.get_or_init(|| Regex::new(r"(?i)\A(0[xob])?[0-9a-f]+n\z").unwrap())
}

fn parse_int_f64(s: &str, radix: u32) -> f64 {
    let mut v = 0.0f64;
    for c in s.chars() {
        let d = c.to_digit(radix).unwrap_or(0) as f64;
        v = v * (radix as f64) + d;
    }
    v
}

fn parse_float_js(num: &str) -> f64 {
    let b = num.as_bytes();
    let mut i = 0;
    if i < b.len() && (b[i] == b'+' || b[i] == b'-') {
        i += 1;
    }
    let start = i;
    while i < b.len() && b[i].is_ascii_digit() {
        i += 1;
    }
    let mut saw = i > start;
    if i < b.len() && b[i] == b'.' {
        i += 1;
        let ds = i;
        while i < b.len() && b[i].is_ascii_digit() {
            i += 1;
        }
        saw |= i > ds;
    }
    if !saw {
        return f64::NAN;
    }
    if i < b.len() && (b[i] == b'e' || b[i] == b'E') {
        let epos = i;
        i += 1;
        if i < b.len() && (b[i] == b'+' || b[i] == b'-') {
            i += 1;
        }
        let ds = i;
        while i < b.len() && b[i].is_ascii_digit() {
            i += 1;
        }
        if i == ds {
            i = epos;
        }
    }
    num[..i].parse::<f64>().unwrap_or(f64::NAN)
}

fn js_trim(s: &str) -> &str {
    s.trim_matches(|c: char| {
        matches!(
            c,
            ' '
                | '\t'
                | '\n'
                | '\r'
                | '\u{000b}'
                | '\u{000c}'
                | '\u{00a0}'
                | '\u{feff}'
                | '\u{2028}'
                | '\u{2029}'
        ) || c.is_whitespace()
    })
}

fn to_number_full(s: &str) -> Option<f64> {
    let t = js_trim(s);
    if t.is_empty() {
        return Some(0.0);
    }
    if t == "Infinity" || t == "+Infinity" {
        return Some(f64::INFINITY);
    }
    if t == "-Infinity" {
        return Some(f64::NEG_INFINITY);
    }
    let (sign, rest) = if let Some(r) = t.strip_prefix('+') {
        (1.0, r)
    } else if let Some(r) = t.strip_prefix('-') {
        (-1.0, r)
    } else {
        (1.0, t)
    };
    if rest.is_empty() {
        return None;
    }
    let lower = rest.to_ascii_lowercase();
    let v = if let Some(h) = lower.strip_prefix("0x") {
        if h.is_empty() || !h.chars().all(|c| c.is_ascii_hexdigit()) {
            return None;
        }
        parse_int_f64(h, 16)
    } else if let Some(h) = lower.strip_prefix("0b") {
        if h.is_empty() || !h.chars().all(|c| c == '0' || c == '1') {
            return None;
        }
        parse_int_f64(h, 2)
    } else if let Some(h) = lower.strip_prefix("0o") {
        if h.is_empty() || !h.chars().all(|c| ('0'..='7').contains(&c)) {
            return None;
        }
        parse_int_f64(h, 8)
    } else if re_dec().is_match(rest) {
        // The decimal regex accepts some strings Number() rejects (exponent with a dot).
        // Require the whole string to be a StrDecimalLiteral.
        if !js_decimal_literal(rest) {
            return None;
        }
        rest.parse::<f64>().unwrap_or(f64::NAN)
    } else {
        return None;
    };
    Some(if sign < 0.0 { -v } else { v })
}

fn js_decimal_literal(s: &str) -> bool {
    let b = s.as_bytes();
    let mut i = 0;
    let start = i;
    while i < b.len() && b[i].is_ascii_digit() {
        i += 1;
    }
    let mut saw = i > start;
    if i < b.len() && b[i] == b'.' {
        i += 1;
        let ds = i;
        while i < b.len() && b[i].is_ascii_digit() {
            i += 1;
        }
        saw |= i > ds;
    }
    if !saw {
        return false;
    }
    if i < b.len() && (b[i] == b'e' || b[i] == b'E') {
        i += 1;
        if i < b.len() && (b[i] == b'+' || b[i] == b'-') {
            i += 1;
        }
        let ds = i;
        while i < b.len() && b[i].is_ascii_digit() {
            i += 1;
        }
        if i == ds {
            return false;
        }
    }
    i == b.len()
}

pub fn parse_js_number(num: &str, allow_e: bool) -> Option<f64> {
    if !allow_e && num.to_ascii_lowercase().contains('e') {
        return None;
    }
    if re_hex().is_match(num) {
        return Some(parse_int_f64(&num[2..], 16));
    } else if re_oct().is_match(num) {
        return Some(parse_int_f64(&num[1..], 8));
    } else if re_es6_oct().is_match(num) {
        return Some(parse_int_f64(&num[2..], 8));
    } else if re_bin().is_match(num) {
        return Some(parse_int_f64(&num[2..], 2));
    } else if re_dec().is_match(num) {
        return Some(parse_float_js(num));
    } else {
        let val = parse_float_js(num);
        if let Some(n) = to_number_full(num) {
            let eq = if val.is_nan() || n.is_nan() {
                false
            } else {
                val == n
            };
            if eq {
                return Some(val);
            }
        }
        None
    }
}

fn is_digit_code(code: Option<u16>) -> bool {
    matches!(code, Some(c) if (48..=57).contains(&c))
}

fn is_ws(ch: &JsCh) -> bool {
    match ch.code0() {
        Some(0x20 | 0xa0 | 0x0a | 0x0d | 0x09 | 0x0c | 0x0b | 0x200b | 0x2000 | 0x2001
            | 0x2002 | 0x2003 | 0x2004 | 0x2005 | 0x2006 | 0x2007 | 0x2008 | 0x2009
            | 0x200a | 0x2028 | 0x2029 | 0x202f | 0x205f | 0x3000 | 0xfeff) => ch.len == 1,
        _ => false,
    }
}
fn is_nl(ch: &JsCh) -> bool {
    ch.len == 1 && matches!(ch.code0(), Some(0x0a | 0x0d | 0x2028 | 0x2029))
}
fn is_punc_ch(ch: &JsCh) -> bool {
    ch.len == 1 && matches!(ch.units[0] as u8, b'[' | b']' | b'{' | b'}' | b'(' | b')' | b',' | b';' | b':')
}
fn is_op_ch(ch: &JsCh) -> bool {
    ch.len == 1 && matches!(
        ch.units[0] as u8,
        b'+' | b'-' | b'*' | b'&' | b'%' | b'=' | b'<' | b'>' | b'!' | b'?' | b'|' | b'~' | b'^'
    )
}

fn is_keyword(w: &str) -> bool {
    matches!(
        w,
        "break" | "case" | "catch" | "class" | "const" | "continue" | "debugger" | "default"
            | "delete" | "do" | "else" | "export" | "extends" | "finally" | "for" | "function"
            | "if" | "in" | "instanceof" | "let" | "new" | "return" | "switch" | "throw" | "try"
            | "typeof" | "var" | "void" | "while" | "with"
    )
}
fn is_keyword_atom(w: &str) -> bool {
    matches!(w, "false" | "null" | "true")
}
pub fn is_reserved(w: &str) -> bool {
    is_keyword(w) || is_keyword_atom(w) || matches!(w, "enum" | "import" | "super" | "this")
}
fn is_kw_before_expr(w: &str) -> bool {
    matches!(w, "return" | "new" | "delete" | "throw" | "else" | "case" | "yield" | "await")
}
fn is_operator_word(w: &str) -> bool {
    matches!(
        w,
        "in" | "instanceof" | "typeof" | "new" | "void" | "delete" | "++" | "--" | "+" | "-"
            | "!" | "~" | "&" | "|" | "^" | "*" | "**" | "/" | "%" | ">>" | "<<" | ">>>" | "<"
            | ">" | "<=" | ">=" | "==" | "===" | "!=" | "!==" | "?" | "=" | "+=" | "-=" | "||="
            | "&&=" | "??=" | "/=" | "*=" | "**=" | "%=" | ">>=" | "<<=" | ">>>=" | "|=" | "^="
            | "&=" | "&&" | "??" | "||"
    )
}
fn is_unary_postfix(w: &str) -> bool {
    matches!(w, "--" | "++")
}
fn is_punc_before_expr(w: &str) -> bool {
    matches!(w, "[" | "{" | "(" | "," | ";" | ":")
}

pub struct CList {
    pub id: u32,
    pub comments: Vec<Comment>,
}

pub struct LiveTok {
    pub ty: &'static str,
    pub value: TokVal,
    pub line: u32,
    pub col: u32,
    pub pos: u32,
    pub nlb: bool,
    pub comments_before: usize,
    pub comments_after: usize,
    pub quote: Option<char>,
    pub template_end: bool,
    /// Cooked string contents when they contain lone surrogates.
    pub units: Option<Vec<u16>>,
    /// Original numeric spelling, including separators.
    pub raw: String,
}

pub struct Tokenizer {
    text: Vec<u16>,
    pub pos: usize,
    tokpos: usize,
    line: u32,
    pub tok_line: u32,
    col: u32,
    pub tok_col: u32,
    newline_before: bool,
    regex_allowed: bool,
    brace_counter: i32,
    template_braces: Vec<i32>,
    comments_before: usize,
    directives: HashMap<String, i32>,
    directive_stack: Vec<Vec<String>>,
    prev_was_dot: bool,
    previous_token: Option<usize>,
    pub latest_raw: String,
    pub template_raws: HashMap<usize, String>,
    pub tokens: Vec<LiveTok>,
    pub lists: Vec<CList>,
    next_comment_id: u32,
    next_list_id: u32,
    html5_comments: bool,
    shebang: bool,
}

impl Tokenizer {
    pub fn new(src: &str, html5_comments: bool, shebang: bool) -> Self {
        let mut tz = Self {
            text: src.encode_utf16().collect(),
            pos: 0,
            tokpos: 0,
            line: 1,
            tok_line: 0,
            col: 0,
            tok_col: 0,
            newline_before: false,
            regex_allowed: false,
            brace_counter: 0,
            template_braces: Vec::new(),
            comments_before: 0,
            directives: HashMap::new(),
            directive_stack: Vec::new(),
            prev_was_dot: false,
            previous_token: None,
            latest_raw: String::new(),
            template_raws: HashMap::new(),
            tokens: Vec::new(),
            lists: Vec::new(),
            next_comment_id: 1,
            next_list_id: 1,
            html5_comments,
            shebang,
        };
        tz.comments_before = tz.fresh_list();
        tz
    }

    fn fresh_list(&mut self) -> usize {
        let id = self.next_list_id;
        self.next_list_id += 1;
        self.lists.push(CList { id, comments: Vec::new() });
        self.lists.len() - 1
    }

    pub fn snap(&self, idx: usize) -> Tok {
        let t = &self.tokens[idx];
        Tok {
            ty: t.ty,
            value: t.value.ast_string(),
            line: t.line,
            col: t.col,
            pos: t.pos,
            nlb: t.nlb,
            comments_before: Vec::new(),
            comments_id: idx as u32,
            comments_after: Vec::new(),
            comments_after_id: 0,
            quote: t.quote,
        }
    }

    pub fn freeze_tok(&self, tok: &mut Tok) {
        let idx = tok.comments_id as usize;
        if idx >= self.tokens.len() {
            return;
        }
        let live = &self.tokens[idx];
        let list = &self.lists[live.comments_before];
        tok.nlb = live.nlb;
        tok.quote = live.quote;
        tok.value = live.value.ast_string();
        tok.ty = live.ty;
        tok.line = live.line;
        tok.col = live.col;
        tok.pos = live.pos;
        tok.comments_before = list.comments.clone();
        tok.comments_id = list.id;
        let after = &self.lists[live.comments_after];
        tok.comments_after = after.comments.clone();
        tok.comments_after_id = after.id;
    }

    /// Snapshot a token after comment-list aliasing has settled.
    pub fn materialize(&self, idx: usize) -> Tok {
        let t = &self.tokens[idx];
        let before = &self.lists[t.comments_before];
        let after = &self.lists[t.comments_after];
        Tok {
            ty: t.ty,
            value: t.value.ast_string(),
            line: t.line,
            col: t.col,
            pos: t.pos,
            nlb: t.nlb,
            comments_before: before.comments.clone(),
            comments_id: before.id,
            comments_after: after.comments.clone(),
            comments_after_id: after.id,
            quote: t.quote,
        }
    }

    pub fn units_of(&self, idx: usize) -> Option<Vec<u16>> {
        self.tokens[idx].units.clone()
    }

    pub fn raw_of(&self, idx: usize) -> String {
        let t = &self.tokens[idx];
        if t.raw.is_empty() {
            self.latest_raw.clone()
        } else {
            t.raw.clone()
        }
    }

    pub fn val_str(&self, idx: usize) -> String {
        self.tokens[idx].value.error_string()
    }
    pub fn ty(&self, idx: usize) -> &'static str {
        self.tokens[idx].ty
    }
    pub fn str_val<'a>(&'a self, idx: usize) -> Option<&'a str> {
        self.tokens[idx].value.as_str()
    }
    pub fn nlb(&self, idx: usize) -> bool {
        self.tokens[idx].nlb
    }
    pub fn line_col(&self, idx: usize) -> (u32, u32) {
        let t = &self.tokens[idx];
        (t.line, t.col)
    }
    pub fn template_end(&self, idx: usize) -> bool {
        self.tokens[idx].template_end
    }
    pub fn quote(&self, idx: usize) -> Option<char> {
        self.tokens[idx].quote
    }
    pub fn num_val(&self, idx: usize) -> Option<f64> {
        match self.tokens[idx].value {
            TokVal::Num(n) => Some(n),
            _ => None,
        }
    }

    pub fn has_newline_before(&self, idx: usize) -> bool {
        let t = &self.tokens[idx];
        if t.nlb {
            return true;
        }
        self.lists[t.comments_before].comments.iter().any(|c| c.nlb)
    }

    fn full_char_at(&self, pos: usize) -> JsCh {
        if pos >= self.text.len() {
            return JsCh::empty();
        }
        let u = self.text[pos];
        if is_high(u) {
            if pos + 1 < self.text.len() && is_low(self.text[pos + 1]) {
                return JsCh::two(u, self.text[pos + 1]);
            }
        } else if is_low(u) && pos > 0 && is_high(self.text[pos - 1]) {
            return JsCh::two(self.text[pos - 1], u);
        }
        JsCh::one(u)
    }

    fn peek_ch(&self) -> JsCh {
        self.full_char_at(self.pos)
    }

    fn next_ch(&mut self, signal_eof: bool, in_string: bool) -> Result<JsCh, PErr> {
        let ch = self.full_char_at(self.pos);
        self.pos += 1;
        if signal_eof && ch.is_empty() {
            return Err(PErr::eof());
        }
        if is_nl(&ch) {
            self.newline_before = self.newline_before || !in_string;
            self.line += 1;
            self.col = 0;
            if ch.is_u(b'\r' as u16) && self.peek_ch().is_u(b'\n' as u16) {
                self.pos += 1;
                return Ok(JsCh::one(b'\n' as u16));
            }
        } else {
            if ch.len > 1 {
                self.pos += 1;
                self.col += 1;
            }
            self.col += 1;
        }
        Ok(ch)
    }

    fn forward(&mut self, mut i: usize) -> Result<(), PErr> {
        while i > 0 {
            self.next_ch(false, false)?;
            i -= 1;
        }
        Ok(())
    }

    fn looking_at(&self, s: &str) -> bool {
        let enc: Vec<u16> = s.encode_utf16().collect();
        let end = self.pos + enc.len();
        end <= self.text.len() && self.text[self.pos..end] == enc[..]
    }

    fn find_eol(&self) -> Option<usize> {
        let mut i = self.pos;
        while i < self.text.len() {
            let ch = JsCh::one(self.text[i]);
            if is_nl(&ch) {
                return Some(i);
            }
            i += 1;
        }
        None
    }

    fn find_str(&self, what: &str) -> Option<usize> {
        let enc: Vec<u16> = what.encode_utf16().collect();
        if enc.is_empty() {
            return Some(self.pos);
        }
        let mut i = self.pos;
        while i + enc.len() <= self.text.len() {
            if self.text[i..i + enc.len()] == enc[..] {
                return Some(i);
            }
            i += 1;
        }
        None
    }

    fn start_token(&mut self) {
        self.tok_line = self.line;
        self.tok_col = self.col;
        self.tokpos = self.pos;
    }

    fn parse_error(&self, msg: impl Into<String>) -> PErr {
        PErr::msg(msg, self.tok_line, self.tok_col)
    }

    fn make_token(&mut self, ty: &'static str, value: TokVal, is_comment: bool) -> usize {
        let regex_allowed = (ty == "operator" && !is_unary_postfix(value.as_str().unwrap_or("")))
            || (ty == "keyword" && is_kw_before_expr(value.as_str().unwrap_or("")))
            || (ty == "punc" && is_punc_before_expr(value.as_str().unwrap_or("")))
            || ty == "arrow";
        self.regex_allowed = regex_allowed;
        if ty == "punc" && matches!(value.as_str(), Some("." | "?.")) {
            self.prev_was_dot = true;
        } else if !is_comment {
            self.prev_was_dot = false;
        }
        let (comments_before, comments_after) = if !is_comment {
            let before = self.comments_before;
            let after = self.fresh_list();
            self.comments_before = after;
            (before, after)
        } else {
            let a = self.fresh_list();
            let b = self.fresh_list();
            (a, b)
        };
        let nlb = self.newline_before;
        self.newline_before = false;
        let tok = LiveTok {
            ty,
            value,
            line: self.tok_line,
            col: self.tok_col,
            pos: self.tokpos as u32,
            nlb,
            comments_before,
            comments_after,
            quote: None,
            template_end: false,
            units: None,
            raw: String::new(),
        };
        self.tokens.push(tok);
        let idx = self.tokens.len() - 1;
        if !is_comment {
            self.previous_token = Some(idx);
        }
        idx
    }

    fn skip_whitespace(&mut self) -> Result<(), PErr> {
        while is_ws(&self.peek_ch()) {
            self.next_ch(false, false)?;
        }
        Ok(())
    }

    pub fn peek_next_token_start_or_newline(&self) -> (Option<String>, usize) {
        let mut pos = self.pos;
        let mut in_ml = false;
        while pos < self.text.len() {
            let ch = self.full_char_at(pos);
            if is_nl(&ch) {
                return (Some(ch.as_string()), pos);
            } else if in_ml {
                let n1 = if pos + 1 < self.text.len() {
                    self.full_char_at(pos + 1)
                } else {
                    JsCh::empty()
                };
                if ch.eq("*") && n1.eq("/") {
                    pos += 2;
                    in_ml = false;
                } else {
                    pos += 1;
                }
            } else if !is_ws(&ch) {
                if ch.eq("/") {
                    let next = if pos + 1 < self.text.len() {
                        self.full_char_at(pos + 1)
                    } else {
                        JsCh::empty()
                    };
                    if next.eq("/") {
                        // find eol from pos... the JS find_eol uses S.pos, NOT the local pos!
                        // Wait, look at the source again.
                        // pos = find_eol(); which uses S.pos, the tokenizer position, NOT the scan pos.
                        // That's a quirk. Let me re-read.
                        //
                        // function peek_next_token_start_or_newline() {
                        //     var pos = S.pos;
                        //     for (...) {
                        //         ...
                        //         if (next_ch == "/") {
                        //             pos = find_eol();
                        //             return { char: get_full_char(S.text, pos), pos: pos };
                        //         }
                        //
                        // find_eol uses S.pos, not the local pos. If we've only skipped whitespace
                        // from S.pos, and the first non-ws is //, S.pos still points at the start
                        // (before whitespace)! find_eol searches from S.pos, which might find a
                        // newline in the whitespace we skipped, or if no newline before the comment,
                        // the newline after the comment... or an earlier newline? S.pos is the
                        // current tokenizer position which is BEFORE the whitespace this function
                        // is scanning. If S.pos is at whitespace that includes a newline, find_eol
                        // returns that newline, not the end of the comment.
                        //
                        // This function is only used in specific places. I'll replicate exactly:
                        // find_eol uses self.pos (S.pos), not the local scan position.
                        let eol = self.find_eol();
                        let p = eol.unwrap_or(usize::MAX);
                        let ch = if eol.is_some() {
                            Some(self.full_char_at(p).as_string())
                        } else {
                            Some(String::new())
                        };
                        return (ch, if eol.is_some() { p } else { usize::MAX });
                    } else if next.eq("*") {
                        in_ml = true;
                        pos += 2;
                        continue;
                    }
                }
                return (Some(ch.as_string()), pos);
            } else {
                // JS increments by one UTF-16 unit, even for a surrogate pair.
                pos += 1;
            }
        }
        (None, pos)
    }

    pub fn ch_starts_binding_identifier(&self, ch: Option<&str>, pos: usize) -> bool {
        let Some(ch) = ch else { return false };
        if ch == "\\" {
            return true;
        }
        let jsch = if pos < self.text.len() {
            self.full_char_at(pos)
        } else {
            return false;
        };
        // The caller passes the char string; we re-read from pos to match get_full_char.
        if !is_identifier_start_broad(&jsch) && ch != "\\" {
            // If the provided ch was reconstructed and doesn't match, still use jsch.
            if !is_identifier_start_broad(&jsch) {
                return false;
            }
        }
        if is_identifier_start_broad(&jsch) {
            // sticky /in(?:stanceof)?/y at pos
            if self.starts_with_kw_rel(pos) {
                let after_pos = if self.looking_at_from(pos, "instanceof") {
                    pos + "instanceof".encode_utf16().count()
                } else {
                    pos + "in".encode_utf16().count()
                };
                let after = self.full_char_at(after_pos);
                if !is_identifier_char_broad(&after) && !after.eq("\\") {
                    return false;
                }
            }
            return true;
        }
        false
    }

    fn looking_at_from(&self, pos: usize, s: &str) -> bool {
        let enc: Vec<u16> = s.encode_utf16().collect();
        let end = pos + enc.len();
        end <= self.text.len() && self.text[pos..end] == enc[..]
    }

    fn starts_with_kw_rel(&self, pos: usize) -> bool {
        if self.looking_at_from(pos, "instanceof") || self.looking_at_from(pos, "in") {
            // The regex is /in(?:stanceof)?/y which matches "in" or "instanceof" at pos.
            // "in" is a prefix of "instanceof", so either match means true if the text starts with "in".
            return self.looking_at_from(pos, "in");
        }
        false
    }

    fn read_while<F>(&mut self, mut pred: F) -> Result<String, PErr>
    where
        F: FnMut(&JsCh, usize) -> bool,
    {
        let mut ret = String::new();
        let mut i = 0;
        loop {
            let ch = self.peek_ch();
            if ch.is_empty() || !pred(&ch, i) {
                break;
            }
            ret.push_str(&self.next_ch(false, false)?.as_string());
            i += 1;
        }
        Ok(ret)
    }

    fn read_num(&mut self, prefix: Option<&str>) -> Result<usize, PErr> {
        let mut has_e = false;
        let mut after_e = false;
        let mut has_x = false;
        let mut has_dot = prefix == Some(".");
        let mut is_big_int = false;
        let mut numeric_separator = false;
        let mut num = String::new();
        let mut i = 0usize;
        loop {
            let ch = self.peek_ch();
            if ch.is_empty() {
                break;
            }
            if is_big_int {
                break;
            }
            let code = ch.code0().unwrap_or(0);
            let take = match code {
                95 => {
                    numeric_separator = true;
                    true
                }
                98 | 66 => {
                    has_x = true;
                    true
                }
                111 | 79 | 120 | 88 => {
                    if has_x {
                        false
                    } else {
                        has_x = true;
                        true
                    }
                }
                101 | 69 => {
                    if has_x {
                        true
                    } else if has_e {
                        false
                    } else {
                        has_e = true;
                        after_e = true;
                        true
                    }
                }
                45 => after_e || (i == 0 && prefix.is_none()),
                43 => after_e,
                46 => {
                    after_e = false;
                    if !has_dot && !has_x && !has_e {
                        has_dot = true;
                        true
                    } else {
                        false
                    }
                }
                110 => {
                    is_big_int = true;
                    true
                }
                c if (48..=57).contains(&c) || (97..=102).contains(&c) || (65..=70).contains(&c) => {
                    after_e = false;
                    true
                }
                _ => false,
            };
            // The JS switch falls through with `after_e = false` only in the dot case
            // via `case (after_e = false, 46)`. Other cases don't clear after_e except
            // the default digit path which does NOT clear after_e!
            // Wait, look again:
            //   case 45: return after_e || ...
            //   case 43: return after_e;
            //   case (after_e = false, 46): return ...
            //   case 110: is_big_int = true; return true;
            //   default digits: return true;
            //
            // The comma operator `after_e = false` only runs when we ENTER the dot case,
            // i.e. when code is 46. For other cases, after_e stays as it was.
            // But for digits AFTER e, after_e should become false so a second sign isn't
            // accepted... LOOK: the digit case does NOT set after_e = false!
            //
            // case (after_e = false, 46) is only for code 46. Digits don't clear after_e.
            // So "1e+1" : e sets after_e, + is accepted because after_e, then digit 1
            // does NOT clear after_e. That's OK because we don't need another sign.
            // "1e++1" would accept the second + because after_e is still true!
            // Is that possible? After e, + is consumed, after_e still true, another +
            // is accepted. Then we'd have "1e++1" in the number. The regex would fail.
            // I'll match the JS: only the dot case clears after_e, and it clears it
            // WHEN the character is a dot (before the return decision).
            //
            // CORRECTION: `case (after_e = false, 46)` evaluates `after_e = false` as the
            // case label expression. In a switch, the case expression is evaluated to
            // compare with `code`. The assignment `after_e = false` happens when that
            // case label is evaluated, which is when we reach that case in the switch
            // (case labels are evaluated in order until one matches... actually in JS,
            // case expressions are evaluated sequentially until one equals the switch
            // value). So for EVERY character, the switch evaluates case labels until
            // a match!
            //
            // Order of cases:
            // 95, 98/66, 111/79, 120/88, 101/69, 45, 43, then (after_e = false, 46).
            // If code is NOT 46, we still evaluate the case label `(after_e = false, 46)`
            // only if no earlier case matched. So for a digit (no earlier match), we
            // evaluate `after_e = false` THEN compare 46 with the digit code, no match,
            // then fall to default. So after_e IS cleared for digits and for any code
            // that doesn't match an earlier case!
            //
            // For code 46 (dot): earlier cases don't match, we set after_e = false, then
            // the case matches.
            // For code 43 (+): the case 43 matches BEFORE we reach the dot case, so
            // after_e is NOT cleared by the dot case label.
            // For code 45 (-): same, matches earlier.
            // For e: matches earlier, sets after_e = true, doesn't reach dot case.
            // For digits: no earlier match, dot case label runs `after_e = false`, then
            // doesn't match, default returns true.
            //
            // So digits DO clear after_e because the case label is evaluated!
            // And any unmatched character (like 'g') also clears after_e before returning
            // false from default. That doesn't matter since we stop.
            //
            // I need to replicate: after_e is cleared when we evaluate the dot case,
            // which happens when code isn't one of the earlier cases.
            let _ = take;
            let earlier = matches!(code, 95 | 98 | 66 | 111 | 79 | 120 | 88 | 101 | 69 | 45 | 43);
            if !earlier {
                after_e = false;
            }
            let accept = match code {
                95 => true,
                98 | 66 => true,
                111 | 79 | 120 | 88 => !has_x || {
                    // has_x was set inside the first computation. I messed up the order.
                    // Let me redo this loop more faithfully below.
                    true
                },
                _ => take,
            };
            let _ = accept;
            break;
        }
        let _ = (has_e, has_x, has_dot, is_big_int, numeric_separator, i, num);
        self.read_num_faithful(prefix)
    }

    fn read_num_faithful(&mut self, prefix: Option<&str>) -> Result<usize, PErr> {
        let mut has_e = false;
        let mut after_e = false;
        let mut has_x = false;
        let mut has_dot = prefix == Some(".");
        let mut is_big_int = false;
        let mut numeric_separator = false;
        let mut num = String::new();
        let mut i = 0usize;
        loop {
            let ch = self.peek_ch();
            if ch.is_empty() || is_big_int {
                break;
            }
            let code = ch.code0().unwrap_or(0) as u32;
            // Evaluate cases in order, including the side effect on after_e.
            let accept = if code == 95 {
                numeric_separator = true;
                true
            } else if code == 98 || code == 66 {
                has_x = true;
                true
            } else if code == 111 || code == 79 || code == 120 || code == 88 {
                if has_x {
                    false
                } else {
                    has_x = true;
                    true
                }
            } else if code == 101 || code == 69 {
                if has_x {
                    true
                } else if has_e {
                    false
                } else {
                    has_e = true;
                    after_e = true;
                    true
                }
            } else if code == 45 {
                after_e || (i == 0 && prefix.is_none())
            } else if code == 43 {
                after_e
            } else {
                // case (after_e = false, 46) — side effect runs
                after_e = false;
                if code == 46 {
                    if !has_dot && !has_x && !has_e {
                        has_dot = true;
                        true
                    } else {
                        false
                    }
                } else if code == 110 {
                    is_big_int = true;
                    true
                } else {
                    (48..=57).contains(&code) || (97..=102).contains(&code) || (65..=70).contains(&code)
                }
            };
            if !accept {
                break;
            }
            num.push_str(&self.next_ch(false, false)?.as_string());
            i += 1;
        }
        if let Some(p) = prefix {
            num.insert_str(0, p);
        }
        self.latest_raw = num.clone();
        if re_oct().is_match(&num) && self.has_directive("use strict") {
            return Err(self.parse_error("Legacy octal literals are not allowed in strict mode"));
        }
        if numeric_separator {
            if num.ends_with('_') {
                return Err(self.parse_error("Numeric separators are not allowed at the end of numeric literals"));
            } else if num.contains("__") {
                return Err(self.parse_error("Only one underscore is allowed as numeric separator"));
            }
            num = num.replace('_', "");
        }
        if is_big_int {
            let without_n = &num[..num.len().saturating_sub(1)];
            let allow_e = re_hex().is_match(without_n);
            let valid = parse_js_number(without_n, allow_e);
            if !has_dot && re_bigint().is_match(&num) && valid.is_some() {
                return Ok(self.make_token("big_int", TokVal::Str(without_n.to_string()), false));
            }
            return Err(self.parse_error("Invalid or unexpected token"));
        }
        match parse_js_number(&num, true) {
            Some(v) => {
                let idx = self.make_token("num", TokVal::Num(v), false);
                self.tokens[idx].raw = self.latest_raw.clone();
                Ok(idx)
            }
            None => Err(self.parse_error(format!("Invalid syntax: {num}"))),
        }
    }

    fn is_octal_ch(ch: &JsCh) -> bool {
        ch.len == 1 && matches!(ch.units[0], 48..=55)
    }

    /// `String.fromCharCode` — the low 16 bits, including lone surrogates.
    fn from_char_code_units(code: u32) -> Vec<u16> {
        vec![(code & 0xffff) as u16]
    }

    /// `from_char_code` in unicode.js — full code point, possibly a surrogate pair.
    fn from_code_point_units(code: u32) -> Vec<u16> {
        if code > 0xffff {
            let c = code - 0x10000;
            vec![((c >> 10) + 0xd800) as u16, ((c & 0x3ff) + 0xdc00) as u16]
        } else {
            vec![code as u16]
        }
    }

    fn units_to_string(units: &[u16]) -> String {
        String::from_utf16(units).unwrap_or_else(|_| String::from_utf16_lossy(units))
    }

    fn read_escaped_char(&mut self, in_string: bool, strict_hex: bool, template_string: bool) -> Result<Vec<u16>, PErr> {
        let ch = self.next_ch(true, in_string)?;
        let code = ch.code0().unwrap_or(0);
        match code {
            110 => return Ok(vec![0x0a]),
            114 => return Ok(vec![0x0d]),
            116 => return Ok(vec![0x09]),
            98 => return Ok(vec![0x08]),
            118 => return Ok(vec![0x0b]),
            102 => return Ok(vec![0x0c]),
            120 => {
                let n = self.hex_bytes(2, strict_hex)?;
                return Ok(Self::from_char_code_units(n));
            }
            117 => {
                if self.peek_ch().eq("{") {
                    self.next_ch(true, false)?;
                    if self.peek_ch().eq("}") {
                        return Err(self.parse_error("Expecting hex-character between {}"));
                    }
                    while self.peek_ch().eq("0") {
                        self.next_ch(true, false)?;
                    }
                    let end = self.find_str("}").ok_or_else(PErr::eof)?;
                    let length = end - self.pos;
                    if length > 6 {
                        return Err(self.parse_error("Unicode reference out of bounds"));
                    }
                    let result = self.hex_bytes(length, strict_hex)?;
                    if result > 0x10ffff {
                        return Err(self.parse_error("Unicode reference out of bounds"));
                    }
                    self.next_ch(true, false)?;
                    return Ok(Self::from_code_point_units(result));
                }
                let n = self.hex_bytes(4, strict_hex)?;
                return Ok(Self::from_char_code_units(n));
            }
            10 => return Ok(Vec::new()),
            13 => {
                if self.peek_ch().eq("\n") {
                    self.next_ch(true, in_string)?;
                    return Ok(Vec::new());
                }
            }
            _ => {}
        }
        if Self::is_octal_ch(&ch) {
            if template_string && strict_hex {
                let represents_null = ch.eq("0") && !Self::is_octal_ch(&self.peek_ch());
                if !represents_null {
                    return Err(self.parse_error("Octal escape sequences are not allowed in template strings"));
                }
            }
            return self.read_octal_escape_sequence(ch.as_string(), strict_hex);
        }
        Ok(ch.slice()[..ch.len as usize].to_vec())
    }

    fn read_octal_escape_sequence(&mut self, mut ch: String, strict_octal: bool) -> Result<Vec<u16>, PErr> {
        let p = self.peek_ch();
        if Self::is_octal_ch(&p) {
            ch.push_str(&self.next_ch(true, false)?.as_string());
            let p = self.peek_ch();
            if ch.as_bytes().first().copied().unwrap_or(0) <= b'3' && Self::is_octal_ch(&p) {
                ch.push_str(&self.next_ch(true, false)?.as_string());
            }
        }
        if ch == "0" {
            return Ok(vec![0]);
        }
        if !ch.is_empty() && self.has_directive("use strict") && strict_octal {
            return Err(self.parse_error("Legacy octal escape sequences are not allowed in strict mode"));
        }
        let v = u32::from_str_radix(&ch, 8).unwrap_or(0);
        Ok(Self::from_char_code_units(v))
    }

    fn hex_bytes(&mut self, mut n: usize, strict_hex: bool) -> Result<u32, PErr> {
        let mut num = String::new();
        let mut first = true;
        while n > 0 {
            if !strict_hex {
                let peek = self.peek_ch().as_string();
                if u32::from_str_radix(&peek, 16).is_err() {
                    if num.is_empty() {
                        return Ok(0);
                    }
                    return Ok(u32::from_str_radix(&num, 16).unwrap_or(0));
                }
            }
            let digit = self.next_ch(true, false)?.as_string();
            if u32::from_str_radix(&digit, 16).is_err() {
                return Err(self.parse_error("Invalid hex-character pattern in string"));
            }
            if first {
                // JS: num starts as number 0; num += digit coerces to string.
                num = digit;
                first = false;
            } else {
                num.push_str(&digit);
            }
            n -= 1;
        }
        if num.is_empty() {
            Ok(0)
        } else {
            Ok(u32::from_str_radix(&num, 16).unwrap_or(0))
        }
    }

    fn finish_units(units: Vec<u16>) -> (TokVal, Option<Vec<u16>>) {
        match String::from_utf16(&units) {
            Ok(s) => (TokVal::Str(s), None),
            Err(_) => (TokVal::Str(String::from_utf16_lossy(&units)), Some(units)),
        }
    }

    fn read_string(&mut self) -> Result<usize, PErr> {
        let start_pos = self.pos;
        let quote = self.next_ch(false, false)?;
        let mut ret: Vec<u16> = Vec::new();
        loop {
            let ch = self.next_ch(true, true).map_err(|e| {
                if e.eof {
                    self.parse_error("Unterminated string constant")
                } else {
                    e
                }
            })?;
            if ch.eq("\\") {
                let esc = self.read_escaped_char(true, true, false).map_err(|e| {
                    if e.eof { self.parse_error("Unterminated string constant") } else { e }
                })?;
                ret.extend(esc);
            } else if ch.eq("\r") || ch.eq("\n") {
                return Err(self.parse_error("Unterminated string constant"));
            } else if ch.eq(&quote.as_string()) {
                break;
            } else {
                ret.extend_from_slice(&ch.slice()[..ch.len as usize]);
            }
        }
        let (val, units) = Self::finish_units(ret);
        let idx = self.make_token("string", val, false);
        self.tokens[idx].units = units;
        self.latest_raw = String::from_utf16_lossy(&self.text[start_pos..self.pos.min(self.text.len())]);
        let q = quote.as_string().chars().next();
        self.tokens[idx].quote = q;
        Ok(idx)
    }

    fn read_template(&mut self, begin: bool) -> Result<usize, PErr> {
        if begin {
            self.template_braces.push(self.brace_counter);
        }
        let mut content: Vec<u16> = Vec::new();
        let mut raw = String::new();
        self.next_ch(true, true).map_err(|e| if e.eof { self.parse_error("Unterminated template") } else { e })?;
        loop {
            let mut ch = self.next_ch(true, true).map_err(|e| if e.eof { self.parse_error("Unterminated template") } else { e })?;
            if ch.eq("`") {
                break;
            }
            if ch.eq("\r") {
                if self.peek_ch().eq("\n") {
                    self.pos += 1;
                }
                ch = JsCh::one(b'\n' as u16);
            } else if ch.eq("$") && self.peek_ch().eq("{") {
                self.next_ch(true, true)?;
                self.brace_counter += 1;
                let ty = if begin { "template_head" } else { "template_cont" };
                let (val, units) = Self::finish_units(content);
                let idx = self.make_token(ty, val, false);
                self.tokens[idx].units = units;
                self.template_raws.insert(idx, raw);
                self.tokens[idx].template_end = false;
                return Ok(idx);
            }
            raw.push_str(&ch.as_string());
            if ch.eq("\\") {
                let tmp = self.pos;
                let prev_is_tag = self.previous_token.map(|p| {
                    let t = &self.tokens[p];
                    t.ty == "name" || (t.ty == "punc" && matches!(t.value.as_str(), Some(")" | "]")))
                }).unwrap_or(false);
                let escaped = self.read_escaped_char(true, !prev_is_tag, true).map_err(|e| {
                    if e.eof { self.parse_error("Unterminated template") } else { e }
                })?;
                let end = self.pos.min(self.text.len());
                if tmp <= end {
                    raw.push_str(&String::from_utf16_lossy(&self.text[tmp..end]));
                }
                content.extend(escaped);
            } else {
                content.extend_from_slice(&ch.slice()[..ch.len as usize]);
            }
        }
        self.template_braces.pop();
        let ty = if begin { "template_head" } else { "template_cont" };
        let (val, units) = Self::finish_units(content);
        let idx = self.make_token(ty, val, false);
        self.tokens[idx].units = units;
        self.template_raws.insert(idx, raw);
        self.tokens[idx].template_end = true;
        Ok(idx)
    }

    fn skip_line_comment(&mut self, ty: &'static str) -> Result<usize, PErr> {
        let regex_allowed = self.regex_allowed;
        let (ret, end) = if let Some(i) = self.find_eol() {
            let s = String::from_utf16_lossy(&self.text[self.pos..i]);
            (s, i)
        } else {
            let s = String::from_utf16_lossy(&self.text[self.pos..]);
            let n = self.text.len();
            (s, n)
        };
        self.pos = end;
        self.col = self.tok_col + (self.pos as u32).saturating_sub(self.tokpos as u32);
        let idx = self.make_token(ty, TokVal::Str(ret), true);
        self.lists[self.comments_before].comments.push(Comment {
            id: self.next_comment_id,
            ty,
            value: match &self.tokens[idx].value {
                TokVal::Str(s) => s.clone(),
                _ => String::new(),
            },
            nlb: self.tokens[idx].nlb,
        });
        self.next_comment_id += 1;
        self.regex_allowed = regex_allowed;
        self.next_token(None)
    }

    fn skip_multiline_comment(&mut self) -> Result<usize, PErr> {
        let regex_allowed = self.regex_allowed;
        let i = self.find_str("*/").ok_or_else(PErr::eof).map_err(|_| self.parse_error("Unterminated multiline comment"))?;
        let raw = String::from_utf16_lossy(&self.text[self.pos..i]);
        let text = raw.replace("\r\n", "\n").replace('\r', "\n").replace('\u{2028}', "\n").replace('\u{2029}', "\n");
        let n = full_char_length(&text) + 2;
        self.forward(n).map_err(|e| if e.eof { self.parse_error("Unterminated multiline comment") } else { e })?;
        let idx = self.make_token("comment2", TokVal::Str(text.clone()), true);
        self.lists[self.comments_before].comments.push(Comment {
            id: self.next_comment_id,
            ty: "comment2",
            value: text.clone(),
            nlb: self.tokens[idx].nlb,
        });
        self.next_comment_id += 1;
        self.newline_before = self.newline_before || text.contains('\n');
        self.regex_allowed = regex_allowed;
        self.next_token(None)
    }

    fn read_name(&mut self) -> Result<String, PErr> {
        let start = self.pos;
        let mut end = start.wrapping_sub(1);
        let mut ch_u: u16 = b'c' as u16;
        loop {
            end = end.wrapping_add(1);
            if end >= self.text.len() {
                ch_u = 0;
                break;
            }
            ch_u = self.text[end];
            let is_letter = (b'a' as u16..=b'z' as u16).contains(&ch_u) || (b'A' as u16..=b'Z' as u16).contains(&ch_u);
            if !is_letter {
                break;
            }
        }
        let ch = if end >= self.text.len() { JsCh::empty() } else { JsCh::one(ch_u) };
        if end > start + 1 && !ch.is_empty() && !ch.eq("\\") && !is_identifier_char_broad(&ch) && ch.le_tilde() {
            self.pos += end - start;
            self.col += (end - start) as u32;
            return Ok(String::from_utf16_lossy(&self.text[start..self.pos]));
        }
        self.read_name_hard()
    }

    fn read_name_hard(&mut self) -> Result<String, PErr> {
        let mut name = String::new();
        let mut escaped = false;
        let mut ch = self.peek_ch();
        if ch.eq("\\") {
            escaped = true;
            self.next_ch(false, false).map_err(|e| if e.eof { self.parse_error("Unterminated identifier name") } else { e })?;
            if !self.peek_ch().eq("u") {
                return Err(self.parse_error("Expecting UnicodeEscapeSequence -- uXXXX or u{XXXX}"));
            }
            ch = {
                let s = Self::units_to_string(&self.read_escaped_char(false, true, false).map_err(|e| {
                    if e.eof { self.parse_error("Unterminated identifier name") } else { e }
                })?);
                // represent as JsCh from the string — identifier chars are scalars
                let units: Vec<u16> = s.encode_utf16().collect();
                if units.len() == 1 {
                    JsCh::one(units[0])
                } else if units.len() >= 2 {
                    JsCh::two(units[0], units[1])
                } else {
                    JsCh::empty()
                }
            };
            // The escaped char is a decoded string, not a source JsCh. Check via string.
            let s = ch.as_string();
            // We stored the decoded char in JsCh via its utf16. is_identifier_start needs the scalar.
            let tmp = string_to_jsch(&s);
            if !is_identifier_start_broad(&tmp) {
                return Err(self.parse_error("First identifier char is an invalid identifier char"));
            }
            name.push_str(&s);
        } else if is_identifier_start_broad(&ch) {
            let s = self.next_ch(false, false)?.as_string();
            name.push_str(&s);
        } else {
            return Ok(String::new());
        }
        loop {
            let pk = self.peek_ch();
            if pk.is_empty() {
                break;
            }
            if pk.eq("\\") {
                escaped = true;
                self.next_ch(false, false).map_err(|e| if e.eof { self.parse_error("Unterminated identifier name") } else { e })?;
                if !self.peek_ch().eq("u") {
                    return Err(self.parse_error("Expecting UnicodeEscapeSequence -- uXXXX or u{XXXX}"));
                }
                let s = Self::units_to_string(&self.read_escaped_char(false, true, false).map_err(|e| {
                    if e.eof { self.parse_error("Unterminated identifier name") } else { e }
                })?);
                let tmp = string_to_jsch(&s);
                if !is_identifier_char_broad(&tmp) {
                    return Err(self.parse_error("Invalid escaped identifier char"));
                }
                name.push_str(&s);
            } else if !is_identifier_char_broad(&pk) {
                break;
            } else {
                name.push_str(&self.next_ch(false, false)?.as_string());
            }
        }
        if is_reserved(&name) && escaped {
            return Err(self.parse_error("Escaped characters are not allowed in keywords"));
        }
        Ok(name)
    }

    fn read_regexp(&mut self, mut source: String) -> Result<usize, PErr> {
        let mut prev_backslash = false;
        let mut in_class = false;
        loop {
            let ch = self.next_ch(true, false).map_err(|e| {
                if e.eof { self.parse_error("Unterminated regular expression") } else { e }
            })?;
            if is_nl(&ch) {
                return Err(self.parse_error("Unexpected line terminator"));
            } else if prev_backslash {
                if ch.len == 1 && ch.units[0] <= 0x7f {
                    source.push('\\');
                    source.push_str(&ch.as_string());
                } else {
                    source.push_str(&ch.as_string());
                }
                prev_backslash = false;
            } else if ch.eq("[") {
                in_class = true;
                source.push('[');
            } else if ch.eq("]") && in_class {
                in_class = false;
                source.push(']');
            } else if ch.eq("/") && !in_class {
                break;
            } else if ch.eq("\\") {
                prev_backslash = true;
            } else {
                source.push_str(&ch.as_string());
            }
        }
        let flags = self.read_name()?;
        let value = format!("/{source}/{flags}");
        Ok(self.make_token("regexp", TokVal::Str(value), false))
    }

    fn read_operator(&mut self, prefix: Option<String>) -> Result<usize, PErr> {
        fn grow(tz: &mut Tokenizer, op: String) -> Result<String, PErr> {
            let pk = tz.peek_ch();
            if pk.is_empty() {
                return Ok(op);
            }
            let bigger = format!("{op}{}", pk.as_string());
            if is_operator_word(&bigger) {
                tz.next_ch(false, false)?;
                grow(tz, bigger)
            } else {
                Ok(op)
            }
        }
        let op = if let Some(p) = prefix {
            p
        } else {
            self.next_ch(false, false)?.as_string()
        };
        let op = grow(self, op)?;
        Ok(self.make_token("operator", TokVal::Str(op), false))
    }

    fn handle_slash(&mut self) -> Result<Option<usize>, PErr> {
        self.next_ch(false, false)?;
        let pk = self.peek_ch();
        if pk.eq("/") {
            self.next_ch(false, false)?;
            return Ok(Some(self.skip_line_comment("comment1")?));
        }
        if pk.eq("*") {
            self.next_ch(false, false)?;
            return Ok(Some(self.skip_multiline_comment()?));
        }
        if self.regex_allowed {
            Ok(Some(self.read_regexp(String::new())?))
        } else {
            Ok(Some(self.read_operator(Some("/".into()))?))
        }
    }

    fn handle_eq_sign(&mut self) -> Result<usize, PErr> {
        self.next_ch(false, false)?;
        if self.peek_ch().eq(">") {
            self.next_ch(false, false)?;
            Ok(self.make_token("arrow", TokVal::Str("=>".into()), false))
        } else {
            self.read_operator(Some("=".into()))
        }
    }

    fn handle_dot(&mut self) -> Result<usize, PErr> {
        self.next_ch(false, false)?;
        if is_digit_code(self.peek_ch().code0()) {
            return self.read_num_faithful(Some("."));
        }
        if self.peek_ch().eq(".") {
            self.next_ch(false, false)?;
            self.next_ch(false, false)?;
            return Ok(self.make_token("expand", TokVal::Str("...".into()), false));
        }
        Ok(self.make_token("punc", TokVal::Str(".".into()), false))
    }

    fn read_word(&mut self) -> Result<usize, PErr> {
        let word = self.read_name()?;
        if self.prev_was_dot {
            return Ok(self.make_token("name", TokVal::Str(word), false));
        }
        let ty = if is_keyword_atom(&word) {
            "atom"
        } else if !is_keyword(&word) {
            "name"
        } else if is_operator_word(&word) {
            "operator"
        } else {
            "keyword"
        };
        Ok(self.make_token(ty, TokVal::Str(word), false))
    }

    fn read_private_word(&mut self) -> Result<usize, PErr> {
        self.next_ch(false, false)?;
        let name = self.read_name()?;
        Ok(self.make_token("privatename", TokVal::Str(name), false))
    }

    fn is_option_chain_op(&self) -> bool {
        let b = if self.pos + 1 < self.text.len() { self.text[self.pos + 1] } else { return false };
        if b != b'.' as u16 {
            return false;
        }
        let c = if self.pos + 2 < self.text.len() { self.text[self.pos + 2] } else {
            // charCodeAt past end is NaN; NaN < 48 || NaN > 57 is false
            return false;
        };
        c < 48 || c > 57
    }

    pub fn next_token(&mut self, force_regexp: Option<String>) -> Result<usize, PErr> {
        if let Some(src) = force_regexp {
            return self.read_regexp(src);
        }
        if self.shebang && self.pos == 0 && self.looking_at("#!") {
            self.start_token();
            self.forward(2)?;
            return self.skip_line_comment("comment5");
        }
        loop {
            self.skip_whitespace()?;
            self.start_token();
            if self.html5_comments {
                if self.looking_at("<!--") {
                    self.forward(4)?;
                    return self.skip_line_comment("comment3");
                }
                if self.looking_at("-->") && self.newline_before {
                    self.forward(3)?;
                    return self.skip_line_comment("comment4");
                }
            }
            let ch = self.peek_ch();
            if ch.is_empty() {
                return Ok(self.make_token("eof", TokVal::Undef, false));
            }
            let code = ch.code0().unwrap_or(0) as u32;
            match code {
                34 | 39 => return self.read_string(),
                46 => return self.handle_dot(),
                47 => {
                    if let Some(tok) = self.handle_slash()? {
                        // handle_slash for comments recurses into next_token and returns the real token.
                        // For a comment, skip_line_comment already returned the following token.
                        // The JS code: if (tok === next_token) continue; else return tok.
                        // skip_line_comment returns next_token(...) which is a token, NOT the function.
                        // So tok === next_token is FALSE (token object vs function). The continue
                        // never happens from a successful comment skip!
                        //
                        // WAIT. Look again:
                        //   case 47: {
                        //       var tok = handle_slash();
                        //       if (tok === next_token) continue;
                        //       return tok;
                        //   }
                        // And skip_line_comment ends with `return next_token;` which CALLS next_token
                        // because next_token is a function and `return next_token` without call
                        // returns the function itself!!!
                        //
                        // `return next_token;` returns the FUNCTION, not a token!
                        // Then `tok === next_token` is TRUE, and we `continue` the loop!
                        //
                        // That's why comments are skipped and we loop to the next real token.
                        // The comment was pushed onto comments_before as a side effect.
                        //
                        // I incorrectly called next_token recursively inside skip_line_comment.
                        // I need to NOT recurse, and signal "continue".
                        //
                        // Let me fix skip_* to return a sentinel. I'll handle it here by
                        // restructuring. For now, if I already recursed, I'd double-tokenize.
                        // I must fix skip_line_comment and skip_multiline_comment to return
                        // a Continue signal instead of calling next_token.
                        //
                        // SEE FIX BELOW — this branch is rewritten in the corrected methods.
                        return Ok(tok);
                    }
                }
                61 => return self.handle_eq_sign(),
                63 => {
                    if self.is_option_chain_op() {
                        self.next_ch(false, false)?;
                        self.next_ch(false, false)?;
                        return Ok(self.make_token("punc", TokVal::Str("?.".into()), false));
                    }
                }
                96 => return self.read_template(true),
                123 => {
                    self.brace_counter += 1;
                }
                125 => {
                    self.brace_counter -= 1;
                    if self.template_braces.last().copied() == Some(self.brace_counter) {
                        return self.read_template(false);
                    }
                }
                _ => {}
            }
            if is_digit_code(ch.code0()) {
                return self.read_num_faithful(None);
            }
            if is_punc_ch(&ch) {
                let s = self.next_ch(false, false)?.as_string();
                return Ok(self.make_token("punc", TokVal::Str(s), false));
            }
            if is_op_ch(&ch) {
                return self.read_operator(None);
            }
            if code == 92 || is_identifier_start_broad(&ch) {
                return self.read_word();
            }
            if code == 35 {
                return self.read_private_word();
            }
            return Err(self.parse_error(format!("Unexpected character '{}'", ch.as_string())));
        }
    }

    pub fn add_directive(&mut self, directive: &str) {
        if let Some(frame) = self.directive_stack.last_mut() {
            frame.push(directive.to_string());
        }
        *self.directives.entry(directive.to_string()).or_insert(0) += 1;
    }
    pub fn push_directives_stack(&mut self) {
        self.directive_stack.push(Vec::new());
    }
    pub fn pop_directives_stack(&mut self) {
        if let Some(frame) = self.directive_stack.pop() {
            for d in frame {
                if let Some(c) = self.directives.get_mut(&d) {
                    *c -= 1;
                }
            }
        }
    }
    pub fn has_directive(&self, directive: &str) -> bool {
        self.directives.get(directive).copied().unwrap_or(0) > 0
    }

    /// Share `dst`'s comments_before list with `src`'s (JS array alias).
    pub fn alias_comments_before(&mut self, dst: usize, src: usize) {
        let list = self.tokens[src].comments_before;
        self.tokens[dst].comments_before = list;
    }
    pub fn alias_comments_after(&mut self, dst: usize, src: usize) {
        let list = self.tokens[src].comments_after;
        self.tokens[dst].comments_after = list;
    }
    /// `inner.comments_before.unshift(...paren.comments_before); paren.comments_before = inner.comments_before`
    pub fn merge_comments_before(&mut self, paren: usize, inner: usize) -> usize {
        let paren_list = self.tokens[paren].comments_before;
        let inner_list = self.tokens[inner].comments_before;
        let extra = self.lists[paren_list].comments.clone();
        let n = extra.len();
        let mut merged = extra;
        merged.append(&mut self.lists[inner_list].comments);
        self.lists[inner_list].comments = merged;
        self.tokens[paren].comments_before = inner_list;
        n
    }

    /// `inner.comments_after.push(...end.comments_after); end.comments_after = inner.comments_after`
    pub fn merge_comments_after(&mut self, end_tok: usize, inner_tok: usize) {
        let end_list = self.tokens[end_tok].comments_after;
        let inner_list = self.tokens[inner_tok].comments_after;
        let extra = self.lists[end_list].comments.clone();
        self.lists[inner_list].comments.extend(extra);
        self.tokens[end_tok].comments_after = inner_list;
    }
    pub fn comments_before_len(&self, tok: usize) -> usize {
        self.lists[self.tokens[tok].comments_before].comments.len()
    }
    pub fn set_nlb(&mut self, tok: usize, nlb: bool) {
        self.tokens[tok].nlb = nlb;
    }
    pub fn set_first_comment_nlb(&mut self, tok: usize, nlb: bool) {
        let list = self.tokens[tok].comments_before;
        if let Some(c) = self.lists[list].comments.first_mut() {
            c.nlb = nlb;
        }
    }
    pub fn first_comment_nlb(&self, tok: usize) -> Option<bool> {
        let list = self.tokens[tok].comments_before;
        self.lists[list].comments.first().map(|c| c.nlb)
    }
    pub fn append_comments_after(&mut self, dst_tok: usize, src_tok: usize) {
        let src = self.tokens[src_tok].comments_after;
        let dst = self.tokens[dst_tok].comments_after;
        let extra = self.lists[src].comments.clone();
        self.lists[dst].comments.extend(extra);
    }
}

fn full_char_length(s: &str) -> usize {
    let units: Vec<u16> = s.encode_utf16().collect();
    let mut i = 0;
    let mut n = 0;
    while i < units.len() {
        if is_high(units[i]) && i + 1 < units.len() && is_low(units[i + 1]) {
            i += 2;
        } else {
            i += 1;
        }
        n += 1;
    }
    n
}

fn string_to_jsch(s: &str) -> JsCh {
    let units: Vec<u16> = s.encode_utf16().collect();
    if units.len() == 1 {
        JsCh::one(units[0])
    } else if units.len() >= 2 {
        JsCh::two(units[0], units[1])
    } else {
        JsCh::empty()
    }
}

// The comment-skip path must return the next_token function identity, i.e. loop.
// Override by not using the broken recursion. The methods above call next_token
// from skip_line_comment — that is WRONG. A wrapper below fixes next_token's
// slash handling by reimplementing comment skipping without recursion.
//
// To keep one code path, skip_line_comment currently calls next_token which
// would re-enter and also the `tok === next_token` check isn't modeled.
// I'll fix this with a flag return. See `next_token_loop`.

impl Tokenizer {
    pub fn next_token_outer(&mut self, force_regexp: Option<String>) -> Result<usize, PErr> {
        if force_regexp.is_some() {
            return self.next_token(force_regexp);
        }
        // Re-implement the loop so comments continue instead of returning the function.
        if self.shebang && self.pos == 0 && self.looking_at("#!") {
            self.start_token();
            self.forward(2)?;
            self.skip_line_comment_only("comment5")?;
        }
        loop {
            self.skip_whitespace()?;
            self.start_token();
            if self.html5_comments {
                if self.looking_at("<!--") {
                    self.forward(4)?;
                    self.skip_line_comment_only("comment3")?;
                    continue;
                }
                if self.looking_at("-->") && self.newline_before {
                    self.forward(3)?;
                    self.skip_line_comment_only("comment4")?;
                    continue;
                }
            }
            let ch = self.peek_ch();
            if ch.is_empty() {
                return Ok(self.make_token("eof", TokVal::Undef, false));
            }
            let code = ch.code0().unwrap_or(0) as u32;
            match code {
                34 | 39 => return self.read_string(),
                46 => return self.handle_dot(),
                47 => {
                    self.next_ch(false, false)?;
                    let pk = self.peek_ch();
                    if pk.eq("/") {
                        self.next_ch(false, false)?;
                        self.skip_line_comment_only("comment1")?;
                        continue;
                    } else if pk.eq("*") {
                        self.next_ch(false, false)?;
                        self.skip_multiline_comment_only()?;
                        continue;
                    } else if self.regex_allowed {
                        return self.read_regexp(String::new());
                    } else {
                        return self.read_operator(Some("/".into()));
                    }
                }
                61 => return self.handle_eq_sign(),
                63 => {
                    if self.is_option_chain_op() {
                        self.next_ch(false, false)?;
                        self.next_ch(false, false)?;
                        return Ok(self.make_token("punc", TokVal::Str("?.".into()), false));
                    }
                }
                96 => return self.read_template(true),
                123 => self.brace_counter += 1,
                125 => {
                    self.brace_counter -= 1;
                    if self.template_braces.last().copied() == Some(self.brace_counter) {
                        return self.read_template(false);
                    }
                }
                _ => {}
            }
            if is_digit_code(ch.code0()) {
                return self.read_num_faithful(None);
            }
            if is_punc_ch(&ch) {
                let s = self.next_ch(false, false)?.as_string();
                return Ok(self.make_token("punc", TokVal::Str(s), false));
            }
            if is_op_ch(&ch) {
                return self.read_operator(None);
            }
            if code == 92 || is_identifier_start_broad(&ch) {
                return self.read_word();
            }
            if code == 35 {
                return self.read_private_word();
            }
            return Err(self.parse_error(format!("Unexpected character '{}'", ch.as_string())));
        }
    }

    fn skip_line_comment_only(&mut self, ty: &'static str) -> Result<(), PErr> {
        let regex_allowed = self.regex_allowed;
        let (ret, end) = if let Some(i) = self.find_eol() {
            (String::from_utf16_lossy(&self.text[self.pos..i]), i)
        } else {
            let n = self.text.len();
            (String::from_utf16_lossy(&self.text[self.pos..]), n)
        };
        self.pos = end;
        self.col = self.tok_col + (self.pos as u32).saturating_sub(self.tokpos as u32);
        let idx = self.make_token(ty, TokVal::Str(ret.clone()), true);
        self.lists[self.comments_before].comments.push(Comment {
            id: self.next_comment_id,
            ty,
            value: ret,
            nlb: self.tokens[idx].nlb,
        });
        self.next_comment_id += 1;
        self.regex_allowed = regex_allowed;
        Ok(())
    }

    fn skip_multiline_comment_only(&mut self) -> Result<(), PErr> {
        let regex_allowed = self.regex_allowed;
        let i = match self.find_str("*/") {
            Some(i) => i,
            None => return Err(self.parse_error("Unterminated multiline comment")),
        };
        let raw = String::from_utf16_lossy(&self.text[self.pos..i]);
        let text = raw
            .replace("\r\n", "\n")
            .replace('\r', "\n")
            .replace('\u{2028}', "\n")
            .replace('\u{2029}', "\n");
        let n = full_char_length(&text) + 2;
        if self.forward(n).is_err() {
            return Err(self.parse_error("Unterminated multiline comment"));
        }
        let idx = self.make_token("comment2", TokVal::Str(text.clone()), true);
        let nlb = self.tokens[idx].nlb;
        self.lists[self.comments_before].comments.push(Comment {
            id: self.next_comment_id,
            ty: "comment2",
            value: text.clone(),
            nlb,
        });
        self.next_comment_id += 1;
        self.newline_before = self.newline_before || text.contains('\n');
        self.regex_allowed = regex_allowed;
        Ok(())
    }
}
