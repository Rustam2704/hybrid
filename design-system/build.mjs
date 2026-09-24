import { build } from "esbuild";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
mkdirSync("dist", { recursive: true });
await build({ entryPoints: ["src/index.ts"], outfile: "dist/index.js", bundle: true, format: "esm", jsx: "automatic", external: ["react", "react-dom", "react/jsx-runtime"], target: "es2020", sourcemap: false });
// one stylesheet: icons (remote), fonts, site styles
const fonts = ["shell-fonts.css", "google-fonts.css"].map(f => readFileSync("../assets/fonts/" + f, "utf8").replace(/url\('([^']+)'\)/g, "url('../../assets/fonts/$1')")).join("\n");
const css = ["../assets/css/style.css", "../assets/css/recipe.css"].map(f => readFileSync(f, "utf8")).join("\n");
writeFileSync("dist/styles.css", '@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css");\n' + fonts + "\n" + css.replace(/url\("\.\.\/img\//g, 'url("../../assets/img/'));
console.log("built dist/index.js + dist/styles.css");
