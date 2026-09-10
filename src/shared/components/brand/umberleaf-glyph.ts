/**
 * GENERATED — do not edit by hand.
 *
 * Source of truth: ~/projects/umberleaf-brand/generate_outline.py
 * (Umberleaf brand mark, variant D "Outline", finalised 2026-09-09)
 *
 * Master `umberleaf_icon.svg` is vendored into three places in this repo:
 * this file, `src/app/icon.svg`, and `public/brand/umberleaf-tile.svg`.
 * Refresh all of them together with `pnpm brand:sync`, which fails loudly if
 * they have drifted apart.
 *
 * One `d` with three subpaths: the closed leaf silhouette (Z), the midrib (L),
 * and the stem (C). They are CENTERLINES — stroke them, never fill them.
 * `fill="none"` is load-bearing: without it the closed silhouette renders as a
 * solid blob and the two open subpaths get implicitly closed and filled too.
 */

export const UMBERLEAF_PATH =
  "M383.35 753.71C718.71 824.44 788.59 409.74 680.66 194.56C456.07 225.76 165.50 515.95 383.35 753.71ZM392.27 736.93L603.36 339.94M383.35 753.71C360.61 796.48 313.84 814.29 296.47 829.44"

/**
 * Stroke width in viewBox user units — 0.052 of the leaf's design length, the
 * same constant the Flutter painter calls `kUmberleafStrokeWidth`.
 *
 * It scales with the viewBox automatically, so no per-size compensation is
 * needed. Note the Dart file's value (32.16) is authored in a 1000-box; this
 * one is the 1024-box equivalent. Same ratio — do not cross-copy them.
 */
export const UMBERLEAF_STROKE_WIDTH = 32.93

export const UMBERLEAF_TILE_RADIUS = 224
export const UMBERLEAF_VIEWBOX = 1024
