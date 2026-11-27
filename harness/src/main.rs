#![forbid(unsafe_code)]

//! Byte-exact comparison harness for the terser port.
//! The `board` subcommand is added once the corpus and oracle exist.

fn main() {
    let mut args = std::env::args().skip(1);
    match args.next().as_deref() {
        Some("board") => {
            eprintln!("board is not built yet");
            std::process::exit(1);
        }
        _ => {
            eprintln!("usage: harness board");
            std::process::exit(2);
        }
    }
}
