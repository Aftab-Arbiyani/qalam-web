import { z } from "zod"

/** Frontmatter contract for content/blog/*.mdx — validated at build time. */
export const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(300),
  /** ISO date, e.g. 2026-07-01 */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  /**
   * Becomes a URL segment via `categoryToSlug`, so it is constrained to
   * characters that survive one: letters, digits, spaces and hyphens. A
   * category like "Q&A" would otherwise generate `/blog/category/q&a`, which
   * truncates at the ampersand and 404s. Failing at build time is the point.
   */
  category: z
    .string()
    .min(1)
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9 -]*$/,
      "category must be letters, digits, spaces or hyphens (it becomes a URL segment)",
    ),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  author: z.string().min(1),
  authorRole: z.string().optional(),
  /** Set false to keep a draft out of production builds. */
  published: z.boolean().default(true),
})

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>

export interface PostMeta extends PostFrontmatter {
  slug: string
  /** Estimated minutes, 220 wpm. */
  readingTimeMinutes: number
}

export interface Post extends PostMeta {
  /** Raw MDX body (without frontmatter). */
  content: string
}
