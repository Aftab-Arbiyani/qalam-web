"use client"

import Link from "next/link"

import { hero } from "@/features/landing/content"
import { HeroVisual } from "@/features/landing/components/hero-visual"
import { trackEvent } from "@/lib/firebase/analytics"
import { UmberleafMark } from "@/shared/components/brand/umberleaf-mark"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Container } from "@/shared/ui/container"
import { Section } from "@/shared/ui/section"

/**
 * Above the fold: the promise, the proof, the ask.
 *
 * The entrance is the CSS `.stagger-in` cascade rather than a motion variant.
 * Motion variants serialize `opacity:0` into the HTML, which would leave the
 * headline — the LCP element on most screens — unpainted until hydration.
 */
export function Hero() {
  return (
    <Section spacing="hero" className="relative overflow-hidden">
      {/*
        Oversized leaf watermark — brand presence without an image.

        `-right-36`, not `-right-40`: the inked bbox reaches x 407px at this size, and
        `right: -160px` would clip 7px off the tip's round cap under Section's
        overflow-hidden. The tilted tip is the most identity-bearing part of the leaf.
        Don't nudge `-top-24` either — it clears the ink by only 1.4px.

        Opacity is lifted from the previous mark's 0.045/0.06: total ink is near-identical
        (6.64% vs 6.73% of canvas), but the outline carries less broad sweep
        (median local thickness -27%), so it needs a little more presence.
      */}
      <UmberleafMark
        variant="glyph"
        size={560}
        label={null}
        className="pointer-events-none absolute -top-24 -right-36 text-flame-600 opacity-[0.055] select-none dark:opacity-[0.07]"
      />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="stagger-in flex max-w-xl flex-col items-start gap-6">
          <div>
            <Badge variant="accent">{hero.badge}</Badge>
          </div>

          <h1 className="font-display text-display-lg font-semibold text-balance md:text-display-xl">
            {hero.headline}
          </h1>

          <p className="text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
            {hero.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              onClick={() => trackEvent("cta_click", { cta: "join_waitlist", location: "hero" })}
            >
              <a href="#waitlist">{hero.primaryCta}</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              onClick={() => trackEvent("cta_click", { cta: "read_story", location: "hero" })}
            >
              <Link href="/about">{hero.secondaryCta}</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">{hero.assurance}</p>
        </div>

        <HeroVisual />
      </Container>
    </Section>
  )
}
