#![forbid(unsafe_code)]

//! Byte-exact comparison harness for the terser port.

mod board;

fn main() {
    let mut args = std::env::args().skip(1);
    match args.next().as_deref() {
        Some("board") => {
            let parsed = match board::Args::parse(args) {
                Ok(parsed) => parsed,
                Err(error) => {
                    eprintln!("{error}");
                    eprintln!("{}", board::USAGE);
                    std::process::exit(2);
                }
            };
            if let Err(error) = board::run(parsed) {
                eprintln!("{error}");
                std::process::exit(1);
            }
        }
        Some("-h") | Some("--help") => {
            println!("{}", board::USAGE);
        }
        _ => {
            eprintln!("{}", board::USAGE);
            std::process::exit(2);
        }
    }
}
