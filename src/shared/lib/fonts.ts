import localFont from "next/font/local"

/**
 * Self-hosted variable fonts (latin subsets, woff2).
 *
 * Self-hosting via next/font/local (instead of next/font/google) keeps builds
 * deterministic and offline-safe, serves fonts from our own origin with
 * immutable caching, and removes any third-party request — better CLS/LCP.
 */

/** Fraunces — literary display serif. Headings, pull quotes, the wordmark. */
export const fraunces = localFont({
  src: [
    { path: "../../fonts/fraunces-latin.woff2", style: "normal", weight: "100 900" },
    { path: "../../fonts/fraunces-latin-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
})

/** Inter — humanist sans. Body copy, UI. */
export const inter = localFont({
  src: [
    { path: "../../fonts/inter-latin.woff2", style: "normal", weight: "100 900" },
    { path: "../../fonts/inter-latin-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
})
