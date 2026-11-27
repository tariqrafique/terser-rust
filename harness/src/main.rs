#![forbid(unsafe_code)]

//! Byte-exact comparison harness for the terser port.

mod board;

fn main() {
    let mut args = std::env::args().skip(1);
    match args.next().as_deref() {
        Some("board") => {
            if let Err(error) = board::run() {
                eprintln!("{error}");
                std::process::exit(1);
            }
        }
        _ => {
            eprintln!("usage: harness board");
            std::process::exit(2);
        }
    }
}
