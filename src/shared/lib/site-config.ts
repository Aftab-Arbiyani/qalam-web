/**
 * Single source of truth for site-wide identity, URLs and social handles.
 * Everything SEO-related (metadata, JSON-LD, sitemap, RSS) reads from here.
 */
export const siteConfig = {
  name: "Qalam",
  /** The Arabic word for "pen" — the brand mark is the letter qāf (ق). */
  nameArabic: "قلم",
  tagline: "A quieter home for the written word",
  description:
    "Qalam is a writing platform for people who take words seriously — a focused editor, a craft-first companion, and readers who actually read. Coming soon. Join the waitlist.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://qalam.ink",
  /** Contact + social identity. Update handles before launch. */
  email: "hello@qalam.ink",
  pressEmail: "press@qalam.ink",
  social: {
    twitter: "https://twitter.com/qalam",
    twitterHandle: "@qalam",
    instagram: "https://instagram.com/qalam.ink",
    github: "https://github.com/qalam",
  },
  keywords: [
    "writing platform",
    "writing app",
    "writers community",
    "focused writing",
    "publishing platform",
    "essays",
    "fiction",
    "poetry",
    "Qalam",
  ],
  /** Used by JSON-LD Organization schema. */
  foundingYear: 2026,
} as const

export type SiteConfig = typeof siteConfig

/** Absolute URL builder for metadata, sitemap, RSS and JSON-LD. */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "")
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
