import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

/**
 * Scroll-reveal wrappers.
 *
 * These are plain server components: the entrance lives entirely in CSS (see
 * the "Entrances" block in globals.css), so revealed content is present *and
 * visible* in the static HTML instead of waiting on hydration. Nothing here
 * ships JavaScript, and nothing here can hide content if a script fails.
 */

interface RevealProps {
  children: ReactNode
  className?: string
  /**
   * Extra delay (s) before the entrance starts.
   *
   * Only applies where the browser lacks scroll-driven animations and every
   * reveal therefore runs on load. With a view timeline the element's own
   * scroll position already sequences it, and the delay is ignored.
   */
  delay?: number
  /** Render as a different HTML element. Defaults to div. */
  as?: "div" | "section" | "span" | "li"
}

export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  return (
    <Tag
      className={cn("reveal", className)}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}

/**
 * Staggered scroll-reveal: each direct child enters in sequence.
 *
 * The cascade is driven by :nth-child in CSS, so the stagger is uniform across
 * the site and needs no per-call-site tuning.
 */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("reveal-group", className)}>{children}</div>
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
