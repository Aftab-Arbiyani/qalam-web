"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

import { trackEvent, trackPageView } from "@/lib/firebase/analytics"

const SCROLL_MILESTONES = [25, 50, 75, 100] as const

/**
 * Invisible route-level analytics:
 * - page_view on every App Router navigation (Firebase only auto-tracks the
 *   initial load, not SPA transitions)
 * - scroll_depth milestones (25/50/75/100%), fired once per page view
 *
 * Rendered once in the root layout. Zero UI, passive listeners only.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()
  const firedMilestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    trackPageView(pathname, document.title)
    firedMilestones.current = new Set()
  }, [pathname])

  useEffect(() => {
    let ticking = false

    const measure = () => {
      ticking = false
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      // Pages shorter than the viewport count as fully read.
      const percent = scrollable <= 0 ? 100 : Math.round((window.scrollY / scrollable) * 100)
      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone && !firedMilestones.current.has(milestone)) {
          firedMilestones.current.add(milestone)
          trackEvent("scroll_depth", { percent: milestone, page_path: pathname })
        }
      }
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(measure)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [pathname])

  return null
}
