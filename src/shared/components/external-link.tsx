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
export function ExternalLink({ href, location, children, ...props }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("outbound_link", { url: href, location })}
      {...props}
    >
      {children}
    </a>
  )
}
