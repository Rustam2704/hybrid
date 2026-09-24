# hybrid — a static site that blends theproof.com and cookingforpeanuts.com

Prototype of a nutritionist's website for a Ukrainian audience, built as a hybrid of two references:

- **theproof.com** gives the shell: fixed vertical sidebar navigation, full-screen hero with the giant condensed headline and its animated check mark, framed cream sections with 2px green rules, outlined uppercase buttons, the "latest episode" and program blocks, the Instagram-style grid and the dark green footer.
- **cookingforpeanuts.com** gives the recipe machinery: the beige title band, uppercase serif section titles with italic subtitles, 3:4 recipe grids (4 and 5 columns), the rounded quote-bubble feature cards, the full-width search band, the author card and the single-recipe page with a WP-Recipe-Maker-style card.

Every size, colour, font weight and spacing was measured on the originals with `getComputedStyle`
(see `../FINDINGS.md` and `../tools/`). Plain HTML + CSS + 40 lines of JS, no framework, no build step
except the English generator.

Live: https://fanatic.space/hybrid/ (Ukrainian) · https://fanatic.space/hybrid/en/ (English)

## Payments

`checkout.html` / `thanks.html` + the Cloudflare Worker in `worker/` (LiqPay, monobank, Paddle for EU/US/Canada,
orders in Workers KV, protected downloads). Everything is deployed; each provider switches on the moment its
keys are added with `wrangler secret put`. Full instructions: `PAYMENTS.md`.

## Design system for Claude Design

`design-system/` is a React component library (21 components) built from the same CSS, synced to the
Claude Design project «Taste of Health Design System» with `/design-sync` (config in `design-system/.design-sync/`).
Re-sync after changing components: `cd design-system && npm run build && node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./dist/index.js --out ./ds-bundle`.

## Structure

```
index.html, recipe.html,
checkout.html, thanks.html   Ukrainian pages (source of truth)
worker/                      payments API (Cloudflare Worker), PAYMENTS.md explains it
design-system/               React component library synced to Claude Design
en/                          English pages, generated: python3 i18n/build.py
i18n/en.json                 translation dictionary (Ukrainian string -> English)
assets/css/style.css         shell + home page styles
assets/css/recipe.css        single-recipe page
assets/js/main.js            headline animation, mobile menu, active section in the sidebar
assets/fonts/                self-hosted: Lato 2.0 (OFL, with Cyrillic), Lora, Roboto Condensed, Manrope
assets/img/her, pets         the owner's photos, resized for the web
assets/img/recipes           PLACEHOLDER recipe photos taken from cookingforpeanuts.com — replace with your own
```

## Fonts

theproof.com uses Roc Grotesk (Adobe Fonts); its web files contain no Cyrillic glyphs, so the shell uses
Roboto Condensed 700 for the condensed headlines and Manrope for body text. cookingforpeanuts.com uses
Lato + Lora; Google's Lato has no Cyrillic, so Lato 2.0 from latofonts.com (OFL) is bundled instead.

## Editing

Edit the Ukrainian pages, add or change strings in `i18n/en.json`, run `python3 i18n/build.py`
(it fails loudly if any Cyrillic string is left untranslated), then `./deploy.sh`.
All links are relative, so the folder works at any URL prefix.
