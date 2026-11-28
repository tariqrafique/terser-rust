//! Read JS from stdin; compress it with the lwc-rollup options (mangling on, so sizes count a
//! mangleable symbol as one character) and print it without mangling. Compare with
//! `node tools/terser-aware.mjs`: the compressor decisions of a mangled build, with readable names.
use std::io::Read;

fn main() {
    let mut src = String::new();
    std::io::stdin().read_to_string(&mut src).unwrap();
    // `minify` copies the top-level `module` into `compress` and `mangle` (`resolve_options`).
    let opts = serde_json::json!({
        "compress": {"module": true},
        "mangle": {"module": true},
        "sourceMap": false,
        "format": {"wrap_func_args": false},
        "module": true
    });
    ast::reset_ids();
    match parser::parse(&src) {
        Ok(tree) => println!("{}", codegen::print(&compress::compress(&tree, &opts))),
        Err(e) => println!("ERROR {}", e.message),
    }
}
