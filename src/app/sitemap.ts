import type { MetadataRoute } from "next"

import { categoryToSlug, getAllPosts, getCategories } from "@/features/blog/services/blog-service"
import { absoluteUrl } from "@/shared/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const newestPostDate = posts[0] ? new Date(`${posts[0].date}T00:00:00Z`) : new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/roadmap"), changeFrequency: "weekly", priority: 0.8 },
    {
      url: absoluteUrl("/blog"),
      lastModified: newestPostDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ]

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const categoryPages: MetadataRoute.Sitemap = getCategories().map((category) => ({
    url: absoluteUrl(`/blog/category/${categoryToSlug(category)}`),
    changeFrequency: "weekly",
    priority: 0.4,
  }))

  return [...staticPages, ...postPages, ...categoryPages]
}
