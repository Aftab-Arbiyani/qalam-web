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
  /**
   * Fired when a write is rejected as a duplicate — which is also what every
   * *other* rules rejection looks like from the client (see errors.ts). Genuine
   * duplicates are a few percent of submissions; a ratio near 100% means the
   * rules are rejecting everything and no signup is being stored. This pair of
   * events is the only signal that distinguishes the two, so treat them as a
   * health check rather than a vanity metric.
   */
  waitlist_duplicate: { source: string }
  newsletter_duplicate: { source: string }
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
      const [{ initializeAnalytics, isSupported }, app] = await Promise.all([
        import("firebase/analytics"),
        getFirebaseApp(),
      ])
      if (!(await isSupported())) return null
      /*
        `send_page_view: false` is load-bearing. gtag fires an automatic
        page_view the moment it is configured, and <AnalyticsTracker> fires its
        own on mount — which is also what lazily initializes analytics in the
        first place, so the two are guaranteed to collide rather than merely
        racing. Every landing was counted twice, and every per-view conversion
        rate was halved. We own route changes (Firebase only auto-tracks the
        first load, never App Router navigations), so we own the first one too.
      */
      return initializeAnalytics(app, { config: { send_page_view: false } })
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
