import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PostCard } from "@/features/blog/components/post-card"
import {
  categoryFromSlug,
  categoryToSlug,
  getCategories,
  getPostsByCategory,
} from "@/features/blog/services/blog-service"
import { Container } from "@/shared/ui/container"
import { Section, SectionHeading } from "@/shared/ui/section"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: categoryToSlug(category) }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params
  const category = categoryFromSlug(slug)
  if (!category) return {}
  return {
    title: `${category} · Blog`,
    description: `Posts filed under ${category} on the Umberleaf blog.`,
    alternates: { canonical: `/blog/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params
  const category = categoryFromSlug(slug)
  if (!category) notFound()

  const posts = getPostsByCategory(category)

  return (
    <Section spacing="hero">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Filed under"
          title={category}
          description={`${posts.length} ${posts.length === 1 ? "post" : "posts"} in this category.`}
        />
        <p className="mb-10 text-center">
          <Link href="/blog" className="text-sm text-primary underline-offset-4 hover:underline">
            ← All posts
          </Link>
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
