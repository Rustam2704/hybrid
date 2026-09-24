# design-sync notes — taste-of-health-ds

- The package lives in `hybrid/design-system/`; `.design-sync/` and `.ds-sync/` are inside it (config home = package dir). Run all converter commands from this directory with `--node-modules ./node_modules --entry ./dist/index.js`.
- Build: `npm run build` = esbuild (ESM bundle, react external) + `tsc --emitDeclarationOnly`. `build.mjs` also writes `dist/styles.css` = Font Awesome CDN `@import` + the site's font-face files + `../assets/css/style.css` + `recipe.css` (font/image urls rewritten to `../../assets/...`).
- Fonts: Roboto Condensed, Manrope, Lora (Google, latin + cyrillic subsets) and Lato 2.0 (OFL, with Cyrillic) are self-hosted in `hybrid/assets/fonts/`; passed via `extraFonts`. The build log reports "dead @font-face blocks dropped" for the duplicates that `cssEntry` and `extraFonts` both carry — harmless.
- Icons come from Font Awesome 6 via cdnjs (`@import` at the top of `styles.css`, `[FONT_REMOTE]` informational). Cards need network access to show icons.
- Preview images are absolute URLs to https://fanatic.space/hybrid/assets/img/… so cards show the real photos; offline the layout still renders.
- `.design-sync/previews/_data.ts` holds shared preview data (recipes, socials, nav); it is not a component.
- Hero previews set `className="e-animated"` on their wrapper so the check-mark animation ends drawn.
- No provider, no context; all components are pure.

## Known render warns
- none recorded yet

## Re-sync risks
- Preview photos are fetched from the live site; if `fanatic.space/hybrid` moves, cards show broken images (layout intact).
- Font Awesome is loaded from cdnjs at render time; a CDN outage blanks the icons only.
- `styles.css` is generated from the site's CSS at build time — edit `hybrid/assets/css/*.css`, never `dist/styles.css`.
