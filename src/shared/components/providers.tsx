"use client"

import { domAnimation, LazyMotion, MotionConfig } from "framer-motion"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

/**
 * Client-side context for the whole app.
 *
 * - next-themes drives dark mode via the `.dark` class (no flash: it inlines
 *   a script before hydration).
 * - LazyMotion + `m` components keep framer-motion's initial payload small;
 *   `strict` makes accidental `motion.*` imports a build-time error.
 * - MotionConfig honours the visitor's prefers-reduced-motion setting for
 *   every animation in the tree.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  )
}
