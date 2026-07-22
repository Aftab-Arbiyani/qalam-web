import Link from "next/link"

import type { PostMeta } from "@/features/blog/types"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent } from "@/shared/ui/card"
import { cn } from "@/shared/lib/utils"

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

interface PostCardProps {
  post: PostMeta
  /** Featured cards render larger with display type. */
  featured?: boolean
}

/** Blog listing card — the whole card is one link, title is the accent. */
export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Card className={cn("group relative h-full hover:shadow-card-hover")}>
      <CardContent className={cn("flex h-full flex-col gap-3", featured ? "p-8 md:p-10" : "p-7")}>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Badge variant="accent">{post.category}</Badge>
          <span>{formatPostDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>

        <h3
          className={cn(
            "font-display font-semibold text-balance transition-colors group-hover:text-primary",
            featured ? "text-2xl md:text-display-sm" : "text-xl",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="focus-visible:outline-none">
            {/* Stretched link: the whole card is clickable, one tab stop. */}
            <span
              className="absolute inset-0 rounded-2xl group-has-focus-visible:ring-2 group-has-focus-visible:ring-ring"
              aria-hidden
            />
            {post.title}
          </Link>
        </h3>

        <p
          className={cn(
            "leading-relaxed text-pretty text-muted-foreground",
            featured ? "text-base" : "text-sm",
          )}
        >
          {post.description}
        </p>

        <p className="mt-auto pt-2 text-xs text-muted-foreground">
          {post.author}
          {post.authorRole ? ` · ${post.authorRole}` : ""}
        </p>
      </CardContent>
    </Card>
  )
}
