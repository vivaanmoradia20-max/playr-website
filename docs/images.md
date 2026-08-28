# PLAYR — Visual System (v2: zero photography)

All visuals resolve through **js/images.js**. PLAYR uses **no photographic
assets** — every sport, product, community, event and cover visual is a
generated SVG (data URI) or CSS gradient:

- **Sport tiles** — `PLAYR_IMG.sport(key, variant)` / `.bg()`: per-sport
  gradient (hue derived from the sport's category accent) + grid + glow +
  the sport's own catalogue glyph as the hero element. Formula 1 → 🏎️,
  boxing → 🥊 — mapping comes from the catalogue, so cross-sport mix-ups
  are impossible.
- **Variants are deterministic** — explicit index or hash of a content id;
  angle/hue/glow drift per variant so grids never repeat. No Math.random,
  no network requests, nothing to 404.
- **Product art** — `PLAYR_IMG.product(type)`: lime line-art silhouettes
  (shoe, tee, jersey, cap, bottle, bag, rackets, dumbbell, bat).
- **Brand monograms** — `PLAYR_IMG.brandLogo(brand)`: typographic
  wordmark + "× PLAYR — CONCEPT". Official logo assets are NOT used;
  real licensed artwork replaces these at commercial launch.
- **Covers** — `PLAYR_IMG.cover(key)`: pure CSS gradients.
- **Avatars** — js/avatars.js (generated, gender from profile only).

Accessibility rule: every glyph is paired with a text label by its
consumer; tiles carry SVG <title>. See test/visual_test.js.
