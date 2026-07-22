import { getAllPosts } from "@/features/blog/services/blog-service"
import { absoluteUrl, siteConfig } from "@/shared/lib/site-config"

/** RSS 2.0 feed, statically generated at build time. */
export const dynamic = "force-static"

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export function GET(): Response {
  const posts = getAllPosts()

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.name} Blog`)}</title>
    <link>${absoluteUrl("/blog")}</link>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
