"use client"

import type { AnchorHTMLAttributes, ReactNode } from "react"

import { trackEvent } from "@/lib/firebase/analytics"

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** Analytics location tag, e.g. "footer", "contact". */
  location: string
  children: ReactNode
}

/** Outbound anchor with analytics + safe rel defaults. */
export function ExternalLink({ href, location, children, onClick, ...props }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // Spread first, then handle the click: a caller's `onClick` arriving in
      // `...props` would otherwise replace the tracking call outright rather
      // than run alongside it.
      {...props}
      onClick={(event) => {
        trackEvent("outbound_link", { url: href, location })
        onClick?.(event)
      }}
    >
      {children}
    </a>
  )
}
