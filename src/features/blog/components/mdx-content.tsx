import { MDXRemote } from "next-mdx-remote/rsc"
import Link from "next/link"
import type { AnchorHTMLAttributes, ReactNode } from "react"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

/**
 * Server-side MDX renderer. Styling comes from the .prose-umberleaf utility;
 * only elements needing behavior are overridden here.
 */

function MdxLink({ href = "", children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href.startsWith("/") || href.startsWith("#")
  if (isInternal) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

const components = {
  a: MdxLink,
}

export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      }}
    />
  )
}

/** Narrow prose column shared by blog posts and legal pages. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="mx-auto prose-umberleaf">{children}</div>
}
