#!/usr/bin/env bash
# Build the English pages, stage the public files under .site/hybrid (hard links) and deploy the Worker.
set -euo pipefail
cd "$(dirname "$0")"
python3 i18n/build.py
rm -rf .site && mkdir -p .site/hybrid
for f in index.html recipe.html checkout.html thanks.html README.md; do [ -f "$f" ] && ln "$f" ".site/hybrid/$f"; done
cp -al assets .site/hybrid/assets
cp -al en .site/hybrid/en
[ -d downloads ] && cp -al downloads .site/hybrid/downloads
echo "staged $(find .site -type f | wc -l) files"
exec ~/.local/bin/wrangler deploy "$@"
