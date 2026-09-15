import * as React from "react"

import {
  UMBERLEAF_PATH,
  UMBERLEAF_STROKE_WIDTH,
  UMBERLEAF_TILE_RADIUS,
  UMBERLEAF_VIEWBOX,
} from "@/shared/components/brand/umberleaf-glyph"
import { cn } from "@/shared/lib/utils"

/**
 * Floor for the rendered stroke, in CSS px.
 *
 * The brand stroke (32.93 of 1024) lands at 0.96px when the mark is drawn at
 * 30px — a sub-pixel hairline that antialiases to a pale smear on a 1x display.
 * This clamp only engages below size ~39, so the app icon, the 56px page marks
 * and the 560px hero watermark keep the exact brand weight. The tradeoff is a
 * deliberate ~30% heavier stroke at 30px, which is invisible at that size and
 * the difference between reading as a leaf and reading as a smudge.
 */
const MIN_STROKE_PX = 1.25

interface UmberleafMarkProps {
  /** Rendered size in px (width = height). */
  size?: number
  /**
   * `tile`  — white stroked leaf on the terracotta rounded tile (the app icon).
   * `glyph` — the leaf alone, stroked with currentColor.
   */
  variant?: "tile" | "glyph"
  className?: string
  /** Accessible name. Pass null when a visible "Umberleaf" wordmark sits beside it. */
  label?: string | null
  /**
   * Escape hatch: stroke width in viewBox user units, bypassing MIN_STROKE_PX.
   * Only reach for this with a measured reason.
   */
  strokeWidth?: number
}

/**
 * The Umberleaf brand mark — one leaf as a single stroke: silhouette, midrib,
 * stem. Identical to the mobile app icon. Pure vector: deterministic,
 * font-free, themeable.
 *
 * The glyph is a STROKE, not a fill. Never put a `fill-*` or `stroke-*`
 * Tailwind utility on this component's className — CSS beats SVG presentation
 * attributes, so `fill-current` would fill the silhouette solid, and
 * `stroke-2` would set the width to 2 *user units* (2/1024 of the rendered
 * size, i.e. invisible) while silently overriding the prop.
 */
export function UmberleafMark({
  size = 32,
  variant = "tile",
  className,
  label = "Umberleaf",
  strokeWidth,
}: UmberleafMarkProps) {
  // One shared object, so the two variants can never drift apart on `fill="none"`.
  const leaf: React.SVGProps<SVGPathElement> = {
    d: UMBERLEAF_PATH,
    fill: "none",
    strokeWidth:
      strokeWidth ?? Math.max(UMBERLEAF_STROKE_WIDTH, (MIN_STROKE_PX * UMBERLEAF_VIEWBOX) / size),
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${UMBERLEAF_VIEWBOX} ${UMBERLEAF_VIEWBOX}`}
      className={cn("shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
    >
      {variant === "tile" ? (
        <>
          <rect
            width={UMBERLEAF_VIEWBOX}
            height={UMBERLEAF_VIEWBOX}
            rx={UMBERLEAF_TILE_RADIUS}
            className="fill-flame-600"
          />
          <path {...leaf} stroke="#ffffff" />
        </>
      ) : (
        <path {...leaf} stroke="currentColor" />
      )}
    </svg>
  )
}

/** Brand lockup: tile mark + "Umberleaf" wordmark in the display serif. */
export function UmberleafWordmark({
  className,
  markSize = 30,
}: {
  className?: string
  markSize?: number
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <UmberleafMark size={markSize} label={null} />
      <span className="font-display text-xl font-semibold tracking-tight">Umberleaf</span>
    </span>
  )
}
