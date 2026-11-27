#![forbid(unsafe_code)]

//! Public minify API. The implementation is intentionally a stub until the
//! parser, scope analysis, compressor, and codegen land. The harness compares
//! this function's output, byte for byte, with terser 5.51.4.

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

/// Failure from [`minify`]. The stub always returns this.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MinifyError {
    message: String,
}

impl MinifyError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}

impl std::fmt::Display for MinifyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for MinifyError {}

/// Minify `src` with `opts`.
///
/// This returns `Err` until the port can emit code. The error is not a
/// substitute for a terser parse error: the harness compares error text
/// byte for byte as well, so a blanket error does not count as a pass.
pub fn minify(src: &str, opts: &Options) -> Result<Output, MinifyError> {
    let _ = (src, opts);
    // Keep the pipeline crates linked so the workspace graph stays real.
    parser::touch();
    compress::touch();
    codegen::touch();
    Err(MinifyError::new("minify is not implemented"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn stub_returns_err() {
        let err = minify("var a = 1;", &Options::default()).unwrap_err();
        assert_eq!(err.to_string(), "minify is not implemented");
    }
}
