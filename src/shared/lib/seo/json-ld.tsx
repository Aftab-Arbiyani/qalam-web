import { absoluteUrl, siteConfig } from "@/shared/lib/site-config"

/**
 * JSON-LD structured data helpers.
 *
 * Each builder returns a plain object; <JsonLd> serializes it into a
 * script tag. Schemas: Organization + WebSite (site-wide), Article (blog
 * posts), FAQPage (landing FAQ), BreadcrumbList (blog posts).
 */

type Schema = Record<string, unknown>

export function JsonLd({ schema }: { schema: Schema }) {
  return (
    <script
      type="application/ld+json"
      // Escape < to prevent </script> breakouts from content strings.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  )
}

export function organizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/brand/umberleaf-tile.svg"),
    foundingDate: String(siteConfig.foundingYear),
    email: siteConfig.email,
    sameAs: [siteConfig.social.twitter, siteConfig.social.instagram],
  }
}

export function websiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  }
}

export interface ArticleSchemaInput {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  authorName: string
  tags?: readonly string[]
}

export function articleSchema(input: ArticleSchemaInput): Schema {
  const url = absoluteUrl(`/blog/${input.slug}`)
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { "@type": "Person", name: input.authorName },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/umberleaf-tile.svg") },
    },
    keywords: input.tags?.join(", "),
    image: absoluteUrl("/og.png"),
  }
}

export function faqSchema(items: ReadonlyArray<{ question: string; answer: string }>): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}

export function breadcrumbSchema(items: ReadonlyArray<{ name: string; path: string }>): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
