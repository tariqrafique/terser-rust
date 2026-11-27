//! Read JS from stdin, print `minify` output with `{}` or the JSON options in argv[1].
use std::io::Read;

fn main() {
    let mut src = String::new();
    std::io::stdin().read_to_string(&mut src).unwrap();
    let opts = std::env::args()
        .nth(1)
        .filter(|s| !s.is_empty())
        .map(|s| serde_json::from_str(&s).expect("options JSON"))
        .unwrap_or_else(|| serde_json::json!({}));
    match terser::minify(&src, &terser::Options::new(opts)) {
        Ok(out) => println!("{}", out.code),
        Err(e) => println!("ERROR {e:?}"),
    }
}
