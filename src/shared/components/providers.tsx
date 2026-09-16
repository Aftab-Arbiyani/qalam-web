"use client"

import { domAnimation, LazyMotion, MotionConfig } from "framer-motion"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

/**
 * Client-side context for the whole app.
 *
 * - next-themes drives dark mode via the `.dark` class (no flash: it inlines
 *   a script before hydration). The site opens in light mode for everyone;
 *   `enableSystem` is off deliberately, so a visitor whose OS is dark still
 *   lands on light and reaches dark only through the toggle.
 * - LazyMotion + `m` components keep framer-motion's initial payload small;
 *   `strict` makes an accidental `motion.*` import throw on render, so the
 *   mistake surfaces the first time the component is exercised. It is a runtime
 *   guard, not a compile-time one — nothing here substitutes for a test.
 * - MotionConfig honours the visitor's prefers-reduced-motion setting for
 *   every animation in the tree.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  )
}
