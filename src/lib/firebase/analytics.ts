import type { Analytics } from "firebase/analytics"

import { getFirebaseApp } from "@/lib/firebase/client"
import { isAnalyticsConfigured } from "@/lib/firebase/config"

/**
 * Typed, fire-and-forget analytics.
 *
 * - Lazy: `firebase/analytics` is imported on first use, never in the initial bundle.
 * - Safe: no-ops when unconfigured, unsupported (Safari ITP, ad blockers) or during SSR.
 * - Typed: every event name carries its exact params shape — no stringly-typed calls.
 */

/** Every product analytics event we emit, with its parameters. */
export interface AnalyticsEvents {
  page_view: { page_path: string; page_title?: string }
  waitlist_signup: { source: string; interest: string }
  newsletter_signup: { source: string }
  cta_click: { cta: string; location: string }
  scroll_depth: { percent: 25 | 50 | 75 | 100; page_path: string }
  blog_read: { slug: string; title: string }
  blog_read_complete: { slug: string; title: string }
  outbound_link: { url: string; location: string }
  theme_change: { theme: string }
  faq_open: { question: string }
}

export type AnalyticsEventName = keyof AnalyticsEvents

let analyticsPromise: Promise<Analytics | null> | null = null

function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === "undefined" || !isAnalyticsConfigured) {
    return Promise.resolve(null)
  }
  analyticsPromise ??= (async () => {
    try {
      const [{ getAnalytics, isSupported }, app] = await Promise.all([
        import("firebase/analytics"),
        getFirebaseApp(),
      ])
      if (!(await isSupported())) return null
      return getAnalytics(app)
    } catch {
      // Blocked by an extension or unsupported environment — analytics is
      // never worth breaking the page for.
      return null
    }
  })()
  return analyticsPromise
}

/** Log a typed event. Never throws, never blocks the UI. */
export function trackEvent<N extends AnalyticsEventName>(
  name: N,
  params: AnalyticsEvents[N],
): void {
  void (async () => {
    try {
      const analytics = await getAnalyticsInstance()
      if (!analytics) {
        if (process.env.NODE_ENV === "development") {
          console.debug(`[analytics:dev] ${name}`, params)
        }
        return
      }
      const { logEvent } = await import("firebase/analytics")
      logEvent(analytics, name as string, params)
    } catch {
      // Swallow — analytics must never surface errors to visitors.
    }
  })()
}

/** Convenience wrapper for SPA route changes. */
export function trackPageView(path: string, title?: string): void {
  trackEvent("page_view", { page_path: path, page_title: title })
}
