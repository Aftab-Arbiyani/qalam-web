import { z } from "zod"

/** Frontmatter contract for content/blog/*.mdx — validated at build time. */
export const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(300),
  /** ISO date, e.g. 2026-07-01 */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  category: z.string().min(1),
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
