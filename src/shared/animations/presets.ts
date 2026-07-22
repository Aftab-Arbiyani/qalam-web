import type { Transition, Variants } from "framer-motion"

/**
 * Motion vocabulary for the whole site.
 *
 * Principles: subtle, short, eased-out. Motion supports reading — it never
 * competes with it. Distances stay under ~24px, durations under ~0.8s.
 * Reduced motion is honoured globally via <MotionConfig reducedMotion="user">.
 */

/** Soft ease-out — the house curve (mirrors --ease-out-soft in globals.css). */
export const easeOutSoft: Transition["ease"] = [0.22, 1, 0.36, 1]

export const durations = {
  fast: 0.3,
  base: 0.55,
  slow: 0.8,
} as const

/** Fade in while rising slightly. The default entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easeOutSoft },
  },
}

/** Plain fade, for elements where vertical motion would distract. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.slow, ease: "easeOut" } },
}

/** Gentle scale-settle for imagery and cards. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.slow, ease: easeOutSoft },
  },
}

/** Parent container that staggers its children's `hidden → visible`. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

/** Micro-interaction presets for interactive elements. */
export const pressable = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.98 },
  transition: { duration: durations.fast, ease: easeOutSoft },
} as const

/** Viewport config for scroll-reveals: trigger once, slightly before entry. */
export const revealViewport = { once: true, margin: "0px 0px -80px 0px" } as const
