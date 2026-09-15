/**
 * Single source of truth for site-wide identity, URLs and social handles.
 * Everything SEO-related (metadata, JSON-LD, sitemap, RSS) reads from here.
 */
export const siteConfig = {
  name: "Umberleaf",
  tagline: "A quieter home for the written word",
  description:
    "Umberleaf is a writing platform for people who take words seriously: a focused editor, a craft-first companion, and readers who actually read. Coming soon. Join the waitlist.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://umberleaf.com",
  /** Contact + social identity. Update handles before launch. */
  email: "hello@umberleaf.com",
  pressEmail: "press@umberleaf.com",
  social: {
    twitter: "https://twitter.com/umberleaf",
    twitterHandle: "@umberleaf",
    instagram: "https://instagram.com/umberleaf",
    github: "https://github.com/umberleaf",
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
    "Umberleaf",
  ],
  /** Used by JSON-LD Organization schema. */
  foundingYear: 2026,
} as const

export type SiteConfig = typeof siteConfig

/**
 * The share card, in the shape both `openGraph.images` and `twitter.images`
 * expect.
 *
 * Next.js REPLACES `openGraph` and `twitter` wholesale when a page declares
 * them — it does not merge them with the root layout's. Any page that sets its
 * own social metadata must therefore restate the image, or it ships a
 * `summary_large_image` card with no image at all. Spread this rather than
 * rebuilding it, so there is one thing to change when the artwork does.
 */
export const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} · ${siteConfig.tagline}`,
} as const

/** Absolute URL builder for metadata, sitemap, RSS and JSON-LD. */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "")
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
