import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

import { postFrontmatterSchema, type Post, type PostMeta } from "@/features/blog/types"

/**
 * Filesystem-backed blog. Server-only (uses node:fs) — imported exclusively
 * from server components, route handlers, sitemap and RSS.
 *
 * Posts are MDX files in content/blog/; the filename is the slug. Frontmatter
 * is validated with zod so a malformed post fails the build loudly instead of
 * shipping a broken page.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog")
const WORDS_PER_MINUTE = 220

function estimateReadingTime(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ") // code blocks read differently — skip
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

function loadPost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "")
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8")
  const { data, content } = matter(raw)

  const parsed = postFrontmatterSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in content/blog/${fileName}: ${parsed.error.message}`)
  }

  return {
    ...parsed.data,
    slug,
    readingTimeMinutes: estimateReadingTime(content),
    content,
  }
}

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(loadPost)
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostBySlug(slug: string): Post | null {
  // Slug comes from the URL — never let it traverse paths.
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  for (const ext of [".mdx", ".md"]) {
    const file = path.join(BLOG_DIR, `${slug}${ext}`)
    if (fs.existsSync(file)) {
      const post = loadPost(`${slug}${ext}`)
      return post.published ? post : null
    }
  }
  return null
}

/** Distinct categories, ordered by frequency (most posts first). */
export function getCategories(): string[] {
  const counts = new Map<string, number>()
  for (const post of getAllPosts()) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([category]) => category)
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category.toLowerCase() === category.toLowerCase())
}

/** The featured post for the listing hero (newest featured, else newest). */
export function getFeaturedPost(): Post | null {
  const posts = getAllPosts()
  return posts.find((post) => post.featured) ?? posts[0] ?? null
}

/**
 * Related posts: shared category counts double, each shared tag counts once.
 * Deterministic tie-break by recency.
 */
export function getRelatedPosts(current: PostMeta, limit = 2): Post[] {
  return getAllPosts()
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      let score = 0
      if (post.category === current.category) score += 2
      for (const tag of post.tags) {
        if (current.tags.includes(tag)) score += 1
      }
      return { post, score }
    })
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((entry) => entry.post)
}

/** Slugify a category for /blog/category/[category] URLs. */
export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-")
}

export function categoryFromSlug(slug: string): string | null {
  return getCategories().find((category) => categoryToSlug(category) === slug) ?? null
}
