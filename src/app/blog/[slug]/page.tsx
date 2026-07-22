import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { MdxContent, Prose } from "@/features/blog/components/mdx-content"
import { formatPostDate, PostCard } from "@/features/blog/components/post-card"
import { ReadTracker } from "@/features/blog/components/read-tracker"
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/features/blog/services/blog-service"
import { NewsletterForm } from "@/features/newsletter/components/newsletter-form"
import { articleSchema, breadcrumbSchema, JsonLd } from "@/shared/lib/seo/json-ld"
import { Badge } from "@/shared/ui/badge"
import { Container } from "@/shared/ui/container"
import { Section } from "@/shared/ui/section"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    keywords: [...post.tags],
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: `${post.date}T00:00:00.000Z`,
      authors: [post.author],
      tags: [...post.tags],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(post)

  return (
    <Section spacing="hero">
      <Container size="narrow">
        <article>
          <header className="mb-12">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link
                href="/blog"
                className="text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                ← Blog
              </Link>
              <span aria-hidden>·</span>
              <Badge variant="accent">{post.category}</Badge>
            </div>

            <h1 className="mb-5 font-display text-display-sm font-semibold text-balance md:text-display">
              {post.title}
            </h1>
            <p className="mb-6 text-lg leading-relaxed text-pretty text-muted-foreground">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-5 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{post.author}</span>
              {post.authorRole ? <span>{post.authorRole}</span> : null}
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTimeMinutes} min read</span>
            </div>
          </header>

          <Prose>
            <MdxContent source={post.content} />
          </Prose>

          <ReadTracker slug={post.slug} title={post.title} />

          {post.tags.length > 0 ? (
            <footer className="mt-12 flex flex-wrap gap-2 border-t pt-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </footer>
          ) : null}
        </article>

        <aside className="mt-16 rounded-2xl border bg-muted/50 p-8">
          <h2 className="mb-2 font-display text-lg font-semibold">Letters on craft</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Essays like this one, sent occasionally. No noise between them.
          </p>
          <NewsletterForm source="blog" />
        </aside>

        {related.length > 0 ? (
          <aside className="mt-16">
            <h2 className="mb-6 font-display text-xl font-semibold">Keep reading</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((relatedPost) => (
                <PostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </aside>
        ) : null}
      </Container>

      <JsonLd
        schema={articleSchema({
          title: post.title,
          description: post.description,
          slug: post.slug,
          datePublished: `${post.date}T00:00:00.000Z`,
          authorName: post.author,
          tags: post.tags,
        })}
      />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
    </Section>
  )
}
