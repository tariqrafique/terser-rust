#![forbid(unsafe_code)]

//! Code generator. Not implemented in the harness milestone.

/// Marks the crate as linked into the minify pipeline.
pub fn touch() {
    ast::touch();
}
