#![forbid(unsafe_code)]

//! JavaScript parser. Not implemented in the harness milestone.

/// Marks the crate as linked into the minify pipeline.
pub fn touch() {
    ast::touch();
}
