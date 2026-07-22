import * as React from "react"

import { cn } from "@/shared/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical rhythm preset. `hero` is taller; `compact` for utility strips. */
  spacing?: "default" | "hero" | "compact"
  /** Alternate warm surface to separate consecutive sections. */
  tone?: "default" | "muted"
}

/** Vertical rhythm for page sections — one spacing scale across the site. */
function Section({ className, spacing = "default", tone = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        spacing === "default" && "py-20 md:py-28",
        spacing === "hero" && "pt-28 pb-20 md:pt-40 md:pb-28",
        spacing === "compact" && "py-12 md:py-16",
        tone === "muted" && "bg-muted/50",
        className,
      )}
      {...props}
    />
  )
}

interface SectionHeadingProps {
  /** Small terracotta kicker above the title. */
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
  className?: string
  /** Heading level for the title (defaults to h2). */
  as?: "h1" | "h2" | "h3"
}

/** Consistent heading block: eyebrow → display title → supporting line. */
function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 flex max-w-2xl flex-col gap-4 md:mb-16",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
      ) : null}
      <Heading className="font-display text-display-sm font-semibold text-balance md:text-display">
        {title}
      </Heading>
      {description ? (
        <p className="text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { Section, SectionHeading }
