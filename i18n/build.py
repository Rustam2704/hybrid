#!/usr/bin/env python3
"""Build the English pages (en/*.html) from the Ukrainian sources using i18n/en.json.
Text nodes and translatable attributes are replaced by exact match; relative asset
URLs get a ../ prefix; the language switcher and hreflang links are flipped.
Prints every Cyrillic string left untranslated so nothing slips through.
usage: python3 i18n/build.py   (run from the hybrid/ folder)"""
import json, os, re, sys
from bs4 import BeautifulSoup, Comment, NavigableString

os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
T = json.load(open("i18n/en.json", encoding="utf-8"))
ATTRS = ("alt", "aria-label", "placeholder", "title", "content")
CYR = re.compile(r"[А-Яа-яІіЇїЄєҐґ]")
os.makedirs("en", exist_ok=True)
missing = set()

def tr(v):
    key = " ".join(v.split())
    if key in T: return T[key]
    if CYR.search(key): missing.add(key)
    return None

for page in ("index.html", "recipe.html"):
    soup = BeautifulSoup(open(page, encoding="utf-8").read(), "lxml")
    soup.html["lang"] = "en"
    for t in list(soup.find_all(string=True)):
        if isinstance(t, Comment) or t.parent.name in ("script", "style"): continue
        raw = str(t); new = tr(raw)
        if new is not None:
            lead = raw[:len(raw) - len(raw.lstrip())]; tail = raw[len(raw.rstrip()):]
            t.replace_with(NavigableString(lead + new + tail))
    for el in soup.find_all(True):
        for a in ATTRS:
            if el.get(a):
                new = tr(el[a])
                if new is not None: el[a] = new
    # relative URLs: assets live one level up
    for el in soup.find_all(True):
        for a in ("href", "src", "srcset"):
            v = el.get(a)
            if not v: continue
            if a == "srcset":
                el[a] = ", ".join(("../" + p.strip()) if p.strip().startswith("assets/") else p.strip() for p in v.split(","))
            elif v.startswith("assets/"):
                el[a] = "../" + v
    # language switcher + hreflang alternates
    for a in soup.select(".lang a"):
        if a.get("data-lang") == "uk":
            a["href"] = "../" + ("" if page == "index.html" else page); a["class"] = []
        else:
            a["href"] = "./" if page == "index.html" else page; a["class"] = ["is-active"]
    for l in soup.find_all("link", rel="alternate"):
        if l.get("hreflang") == "uk": l["href"] = "../" + ("" if page == "index.html" else page)
        else: l["href"] = "./" if page == "index.html" else page
    out = str(soup)
    out = out.replace("<!DOCTYPE html>", "<!DOCTYPE html>", 1)
    open(f"en/{page}", "w", encoding="utf-8").write(out)
    print("built en/" + page)

if missing:
    print("\nUNTRANSLATED:"); print("\n".join(sorted(missing))); sys.exit(1)
print("all strings translated")
