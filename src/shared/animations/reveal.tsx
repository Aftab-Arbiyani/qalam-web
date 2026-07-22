"use client"

import { m } from "framer-motion"
import type { ReactNode } from "react"

import { fadeUp, revealViewport, staggerContainer } from "@/shared/animations/presets"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Extra delay (s) before the entrance starts. */
  delay?: number
  /** Render as a different HTML element. Defaults to div. */
  as?: "div" | "section" | "span" | "li"
}

/**
 * Scroll-reveal wrapper: fades content up once when it enters the viewport.
 *
 * A client component by necessity, but children passed from server components
 * remain server-rendered — only the wrapper hydrates.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={{
        hidden: fadeUp.hidden,
        visible: {
          ...fadeUp.visible,
          transition: {
            ...(typeof fadeUp.visible === "object" && "transition" in fadeUp.visible
              ? fadeUp.visible.transition
              : {}),
            delay,
          },
        },
      }}
    >
      {children}
    </Tag>
  )
}

interface RevealGroupProps {
  children: ReactNode
  className?: string
  /** Seconds between each child's entrance. */
  stagger?: number
}

/**
 * Staggered scroll-reveal: each <RevealItem> child enters in sequence.
 */
export function RevealGroup({ children, className, stagger = 0.08 }: RevealGroupProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={staggerContainer(stagger)}
    >
      {children}
    </m.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div className={className} variants={fadeUp}>
      {children}
    </m.div>
  )
}
