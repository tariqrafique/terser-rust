#![forbid(unsafe_code)]

//! Public minify API. The harness compares this function's output, byte for
//! byte, with terser 5.51.4.

use serde_json::Value;

/// Minify options in the terser 5.51.4 JSON shape.
///
/// Compress fixtures may contain tagged values:
/// `{ "__terser_type": "RegExp", "source", "flags" }` and
/// `{ "__terser_type": "Function", "source" }`.
#[derive(Debug, Clone)]
pub struct Options {
    value: Value,
}

impl Default for Options {
    fn default() -> Self {
        Self {
            value: Value::Object(Default::default()),
        }
    }
}

impl Options {
    pub fn new(value: Value) -> Self {
        Self { value }
    }

    pub fn as_value(&self) -> &Value {
        &self.value
    }
}

/// Successful minify output. Comparison is on the UTF-8 bytes of `code`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Output {
    pub code: String,
}

/// Failure from [`minify`].
///
/// `name`, `line`, and `col` are set for parse errors so the board can match
/// the oracle's canonical error text. Other failures use name `error`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MinifyError {
    name: String,
    message: String,
    line: Option<i64>,
    col: Option<i64>,
}

impl MinifyError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            name: "error".into(),
            message: message.into(),
            line: None,
            col: None,
        }
    }

    pub fn syntax(message: impl Into<String>, line: u32, col: u32) -> Self {
        Self {
            name: "SyntaxError".into(),
            message: message.into(),
            line: Some(line as i64),
            col: Some(col as i64),
        }
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn line(&self) -> Option<i64> {
        self.line
    }

    pub fn col(&self) -> Option<i64> {
        self.col
    }
}

impl std::fmt::Display for MinifyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for MinifyError {}

/// Minify `src` with `opts`.
pub fn minify(src: &str, opts: &Options) -> Result<Output, MinifyError> {
    let ast = parser::parse(src).map_err(|err| MinifyError::syntax(err.message, err.line, err.col))?;
    let ast = compress::compress(&ast, opts.as_value());
    let code = if mangle_on(opts) {
        let (map, privates) = scope::mangle_map(&ast).map_err(|err| MinifyError::syntax(err.message, err.line, err.col))?;
        codegen::print_mangled(&ast, map, privates)
    } else {
        codegen::print(&ast)
    };
    Ok(Output { code })
}

/// Missing `mangle` is terser's default, which turns mangling on.
/// `false` leaves names alone. An object is a mangler config.
fn mangle_on(opts: &Options) -> bool {
    match opts.as_value().get("mangle") {
        Some(Value::Bool(false)) => false,
        _ => true,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_keeps_a_toplevel_binding() {
        let out = minify("var a = 1;", &Options::default()).unwrap();
        assert_eq!(out.code, "var a=1;");
    }
}
