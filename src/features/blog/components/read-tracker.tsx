"use client"

import { useEffect, useRef } from "react"

import { trackEvent } from "@/lib/firebase/analytics"

interface ReadTrackerProps {
  slug: string
  title: string
}

/**
 * Blog engagement analytics: `blog_read` when the article mounts, and
 * `blog_read_complete` once the end-of-article sentinel becomes visible.
 * Renders an invisible sentinel — place it after the article body.
 */
export function ReadTracker({ slug, title }: ReadTrackerProps) {
  const sentinelRef = useRef<HTMLSpanElement>(null)
  const completed = useRef(false)

  useEffect(() => {
    trackEvent("blog_read", { slug, title })
  }, [slug, title])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !completed.current) {
          completed.current = true
          trackEvent("blog_read_complete", { slug, title })
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [slug, title])

  return <span ref={sentinelRef} aria-hidden="true" />
}
