import type { Metadata } from "next"
import Link from "next/link"

import { PostCard } from "@/features/blog/components/post-card"
import {
  categoryToSlug,
  getAllPosts,
  getCategories,
  getFeaturedPost,
} from "@/features/blog/services/blog-service"
import { Badge } from "@/shared/ui/badge"
import { Container } from "@/shared/ui/container"
import { Section, SectionHeading } from "@/shared/ui/section"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from the desk — essays on craft, the making of Umberleaf, and the slower side of writing on the internet.",
  alternates: { canonical: "/blog" },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const featured = getFeaturedPost()
  const rest = featured ? posts.filter((post) => post.slug !== featured.slug) : posts
  const categories = getCategories()

  return (
    <Section spacing="hero">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="The blog"
          title="Notes from the desk"
          description="Essays on craft, the making of Umberleaf, and the slower side of writing on the internet."
        />

        {categories.length > 0 ? (
          <nav aria-label="Post categories" className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog/category/${categoryToSlug(category)}`}
                className="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Badge
                  variant="outline"
                  className="px-4 py-1.5 transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {category}
                </Badge>
              </Link>
            ))}
          </nav>
        ) : null}

        {featured ? (
          <div className="mb-10">
            <PostCard post={featured} featured />
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : null}

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            The first letters are being written. Check back soon.
          </p>
        ) : null}
      </Container>
    </Section>
  )
}
