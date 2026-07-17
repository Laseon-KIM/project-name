# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static site that displays team mobile prototypes inside an iPhone mockup. No build step, no dependencies, no tests, no package.json — plain HTML/CSS/ES5-style JS served as files.

Comments, docs, and UI copy are in Korean. Match that when editing.

## Commands

```bash
python3 -m http.server 8000    # → http://localhost:8000
```

Must be served over HTTP, not opened via `file://` — the app loads prototypes into an iframe and reads `location.hash`.

Deploy: push to `main`. `.github/workflows/deploy.yml` uploads the repo as-is to GitHub Pages (no build). `.nojekyll` disables Jekyll processing.

## Architecture

**Shell + iframe.** `index.html` is the only real page. It renders a sidebar and an iPhone frame containing `<iframe id="screen">`. Every prototype is a standalone HTML file loaded into that iframe. Prototypes never know they're being framed.

**`assets/js/pages.js` is the registry and the coupling point.** It sets a `window.TEAM` global that `app.js` reads at startup — there is no module system. Load order in `index.html` matters: `pages.js` before `app.js`.

**Routing is `#/{owner}/{page}`** (e.g. `#/laseon/home`). `app.js` parses the hash, finds the matching entry in `TEAM`, and assigns `page.file` to the iframe's `src`. An unknown route `location.replace()`s to the first available page rather than erroring. Adding a prototype always means two edits: the HTML file *and* its `pages.js` entry — a file with no entry is unreachable.

**Two different path bases — this is the easy mistake:**
- `file:` in `pages.js` is **root-relative** (`laseon/home.html`), because it resolves against `index.html` at the root.
- Asset links *inside* a prototype are **folder-relative** (`../assets/css/proto.css`), because the prototype lives one level down.

**Fixed 393 × 852 (iPhone 15 Pro).** `proto.css` hard-locks `html, body` to those dimensions with `overflow: hidden`. Scaling is display-only: `applyZoom()` in `app.js` computes a ratio from `frame.offsetWidth/offsetHeight` (layout values, unaffected by transform) and writes it to the `--scale` CSS variable, which `style.css` applies as `transform: scale()` on `.phone`. Never adapt a prototype's layout to the zoom level — it's a viewport-independent canvas.

**Chrome comes from `proto.css` + `proto.js`, not from each prototype.** `.status`, `.tabbar`, `.home-indicator`, and `.screen` (the scrollable body region) are provided. `proto.js` fills every `.status` element once at script execution — it's one-shot with no re-render, so status bar content set after load won't be picked up.

Prototype skeleton — copy an existing `home.html` rather than starting blank:

```html
<link rel="stylesheet" href="../assets/css/proto.css">
...
<div class="status"></div>         <!-- data-time / data-battery / data-dark -->
<div class="screen">...</div>      <!-- scrollable content -->
<nav class="tabbar">...</nav>
<div class="home-indicator"></div>
<script src="../assets/js/proto.js"></script>
```

Per-prototype styles go in an inline `<style>` block in that file. Don't add to `proto.css` unless it's genuinely shared chrome.

## Typography

**Korean text renders in Pretendard, Latin text in SF Pro.** Don't implement this by tagging elements or splitting markup — you get it for free from CSS per-glyph fallback by ordering the stack SF-first:

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Pretendard, sans-serif;
```

SF Pro has no Hangul glyphs, so Korean characters fall through to Pretendard on their own while Latin stops at SF Pro. Order is the whole mechanism — putting Pretendard first would give it both scripts. `-apple-system`/`BlinkMacSystemFont` is how you address SF Pro; the literal `"SF Pro Text"` name isn't reliably resolvable on its own.

Pretendard is **not a Google Fonts family** — a `fonts.googleapis.com/css2?family=Pretendard` link returns `400: Font family not found`. Load it from jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@latest/dist/web/variable/pretendardvariable-dynamic-subset.css">
```

Every prototype needs this link itself — it's in an iframe and inherits nothing from `index.html`.

Two caveats worth knowing when the split looks wrong:
- On macOS, `-apple-system` can trigger CoreText's own fallback and render Hangul in Apple SD Gothic Neo instead of reaching Pretendard. If you see that, scope the fonts explicitly with `@font-face` + `unicode-range` rather than reordering.
- Pretendard's Latin is SF-adjacent by design, so a missing Pretendard often still *looks* plausible. Verify in DevTools (Computed → Rendered Fonts), not by eye.

## Conventions

- **Member folders are English** (`laseon/`, `yunjin/`, `jiwon/`) so URLs don't percent-encode; the Korean display name lives in `pages.js` as `name`. Same split for pages: `id` is English/digits/hyphens (used in the URL), `title` is Korean (shown in the sidebar).
- **Don't touch other members' folders.**
- `pages.js` is shared and conflicts often — edit only your own block.
