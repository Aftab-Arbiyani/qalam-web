import * as React from "react"

import { QAF_PATH, QALAM_TILE_RADIUS, QALAM_VIEWBOX } from "@/shared/components/brand/qalam-glyph"
import { cn } from "@/shared/lib/utils"

interface QalamMarkProps {
  /** Rendered size in px (width = height). */
  size?: number
  /**
   * `tile`  — white qāf on the terracotta rounded tile (the app icon).
   * `glyph` — the qāf alone, tinted with currentColor.
   */
  variant?: "tile" | "glyph"
  className?: string
  /** Accessible name. Pass null when a visible "Qalam" wordmark sits beside it. */
  label?: string | null
}

/**
 * The Qalam brand mark — the Arabic letter qāf (ق) — identical to the mobile
 * app icon. Pure vector path: deterministic, font-free, themeable.
 */
export function QalamMark({
  size = 32,
  variant = "tile",
  className,
  label = "Qalam",
}: QalamMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${QALAM_VIEWBOX} ${QALAM_VIEWBOX}`}
      className={cn("shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
    >
      {variant === "tile" ? (
        <>
          <rect
            width={QALAM_VIEWBOX}
            height={QALAM_VIEWBOX}
            rx={QALAM_TILE_RADIUS}
            className="fill-flame-600"
          />
          <path d={QAF_PATH} fill="#ffffff" />
        </>
      ) : (
        <path d={QAF_PATH} fill="currentColor" />
      )}
    </svg>
  )
}

/** Brand lockup: tile mark + "Qalam" wordmark in the display serif. */
export function QalamWordmark({
  className,
  markSize = 30,
}: {
  className?: string
  markSize?: number
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <QalamMark size={markSize} label={null} />
      <span className="font-display text-xl font-semibold tracking-tight">Qalam</span>
    </span>
  )
}
