// Loaded in the terser worker via --import, before the plugin entry runs.
import { register } from "node:module";

register("./capture-loader.mjs", import.meta.url);
