// Redirect the worker's `import { minify } from "terser"` to a pass-through wrapper.
// Absolute imports of the real package are left alone.

const wrapper = new URL("./terser-wrap.mjs", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
    if (specifier === "terser") {
        return {
            url: wrapper.href,
            shortCircuit: true,
        };
    }
    return nextResolve(specifier, context);
}
