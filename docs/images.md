# PLAYR — Image System

All imagery resolves through **js/images.js** (`window.PLAYR_IMG`) — the single
source of truth. Rules:

1. **Deterministic only.** Variants are picked by explicit index or hashed from
   a content id (`PLAYR_IMG.sport(key, "event-id")`). `Math.random()` is never
   used for imagery.
2. **Sport-keyed families.** Each sport owns its photo family — a sport never
   renders another sport's photo (no Formula 1 → boxing class errors). Every
   key in `PLAYR_IMG.legacy` resolves to a unique URL (asserted in tests).
3. **Variant rotation.** Sections that show the same sport in different places
   (hero collage v0, strips v1, mosaic v2, world examples v3) pass an explicit
   variant index so grids never repeat a photo.
4. **Products use product photography** (`PLAYR_IMG.product(type)`) — shoes
   look like shoes, rackets like rackets — layered over gradients with
   `onerror` hiding so the designed tile always shows.

## Prototype licensing note
Demo imagery is hotlinked from Unsplash for prototype use only. Before any
commercial launch, replace `RAW` / `PRODUCTS` id tables with licensed or
original assets — every consumer keeps working because they only reference
this module.
