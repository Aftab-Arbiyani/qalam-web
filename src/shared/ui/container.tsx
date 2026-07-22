import * as React from "react"

import { cn } from "@/shared/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content width preset:
   * - `default` — marketing sections (max-w-6xl)
   * - `narrow`  — long-form reading (max-w-3xl)
   * - `wide`    — full-bleed moments on ultra-wide screens (max-w-7xl)
   */
  size?: "default" | "narrow" | "wide"
}

/** Horizontal rhythm for every section: consistent gutters, capped width. */
function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "default" && "max-w-6xl",
        size === "narrow" && "max-w-3xl",
        size === "wide" && "max-w-7xl",
        className,
      )}
      {...props}
    />
  )
}

export { Container }
