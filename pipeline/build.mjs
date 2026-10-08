import { build } from "esbuild";
import { solidPlugin } from "esbuild-plugin-solid";

// Solid's JSX compiler requires the JavaScript API plugin path.
await build({
  entryPoints: [process.argv[2] ?? "src/main.ts"],
  bundle: true,
  format: "esm",
  target: "es2020",
  platform: "browser",
  minify: true,
  sourcemap: true,
  outfile: "dist/main.js",
  plugins: [solidPlugin()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  conditions: ["browser", "production"],
});
