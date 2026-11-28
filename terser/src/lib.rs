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
    // Node ids are compared within this tree only; number it from zero.
    ast::reset_ids();
    let ast = parser::parse(src).map_err(|err| MinifyError::syntax(err.message, err.line, err.col))?;
    let resolved = resolve_options(opts.as_value());
    let ast = compress::compress(&ast, &resolved);
    let code = if mangle_on(opts) {
        let (map, privates) = scope::mangle_map_with(&ast, &mangle_options(&resolved))
            .map_err(|err| MinifyError::syntax(err.message, err.line, err.col))?;
        codegen::print_mangled(&ast, map, privates)
    } else {
        codegen::print(&ast)
    };
    Ok(Output { code })
}

/// terser `minify.js`: `set_shorthand("module", ...)` and `set_shorthand("toplevel", ...)`
/// copy the top-level flags into `compress` and `mangle` when those are objects
/// or `true`.
fn resolve_options(value: &Value) -> Value {
    let mut out = value.clone();
    let Some(obj) = out.as_object_mut() else { return out };
    for key in ["module", "toplevel"] {
        let Some(flag) = obj.get(key).cloned() else { continue };
        if matches!(flag, Value::Bool(false) | Value::Null) || flag.as_f64() == Some(0.0) || flag.as_str() == Some("") {
            continue;
        }
        for section in ["compress", "mangle"] {
            match obj.get_mut(section) {
                Some(Value::Bool(false)) => {}
                Some(Value::Object(inner)) => {
                    inner.entry(key.to_string()).or_insert(flag.clone());
                }
                _ => {
                    let mut inner = serde_json::Map::new();
                    inner.insert(key.to_string(), flag.clone());
                    obj.insert(section.to_string(), Value::Object(inner));
                }
            }
        }
    }
    out
}

fn mangle_options(value: &Value) -> scope::MangleOptions {
    let mut opts = scope::MangleOptions::default();
    if let Some(Value::Object(m)) = value.get("mangle") {
        let truthy = |k: &str| m.get(k).is_some_and(|v| !matches!(v, Value::Bool(false) | Value::Null));
        opts.toplevel = truthy("toplevel") || truthy("module");
    }
    opts
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
