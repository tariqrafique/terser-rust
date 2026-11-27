#![forbid(unsafe_code)]

//! JavaScript parser matching terser 5.51.4 with experimental TypeScript off.

mod parse;
mod token;

pub use parse::parse;
pub use parse::ParseError;
