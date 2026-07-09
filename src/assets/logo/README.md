# BRT Inc. — Logo Suite

Combined pattern: Draft A wordmark + Draft B survey-mark glyph.

## Files

| File | Use |
|---|---|
| `logo.svg` | Primary horizontal lockup (glyph + wordmark). Navigation, headers, letterhead. |
| `logo-white.svg` | Reverse lockup for dark backgrounds. |
| `logo-mark.svg` | Standalone survey-mark glyph, navy on transparent. Small contexts, avatars, social. |
| `logo-mark-white.svg` | Standalone glyph, reverse. Dark-mode favicon. |
| `favicon.svg` | Optimized 32×32 SVG favicon (cream background rect + navy glyph). |
| `logo-a-wordmark.svg` | Draft A alone (kept for reference / typographic contexts where the glyph would compete). |
| `logo-b-mark-and-word.svg` | Draft B alone (kept for reference; superseded by `logo.svg`). |
| `logo-c-underline.svg` | Draft C alone (kept for reference; use only for legal/formal documents where the "— Manzini" locale is helpful). |

## Palette

- Navy `#0F1E2E` — primary
- Cream `#FAF9F7` — reverse / background

## Construction rules (for anyone modifying)

- Glyph height = cap-height of wordmark (both 128px at reference scale).
- Gap between glyph and wordmark = 0.5 × cap-height (64px).
- Both align to the same baseline (y = 122 in the 160-unit viewBox).
- Stroke width scales geometrically with the viewBox; use `vector-effect="non-scaling-stroke"` if you need a fixed 1.5-2px stroke at very small sizes.
- Typeface stack: Inter, IBM Plex Sans, Helvetica Neue, Arial, sans-serif. All are widely available; the design does not depend on any single face.
- Never re-color to a saturated hue. Navy or cream only. If a project demands an accent, use it in the surrounding UI, not on the mark.

## Deriving raster assets

Raster deliverables (`favicon.ico`, `apple-touch-icon.png` 180×180, `og-image.png` 1200×630) are NOT committed here — they should be generated from the SVGs at build time:

```bash
# Requires imagemagick + inkscape (or resvg-cli, or sharp).
inkscape --export-type=png --export-width=180  --export-filename=apple-touch-icon.png logo-mark.svg
inkscape --export-type=png --export-width=32   --export-filename=favicon-32.png       favicon.svg
inkscape --export-type=png --export-width=16   --export-filename=favicon-16.png       favicon.svg
convert favicon-16.png favicon-32.png favicon.ico
# og-image: 1200×630, cream background, glyph left-aligned + wordmark centered.
# Build a dedicated og.svg for this composition; do not scale logo.svg to 1200×630 without repositioning.
```

Deliverables land under `~/my-projects/personal/CBahtaria/brt-inc/public/` (the Vercel-served static root) or wherever the current build system expects favicons.
