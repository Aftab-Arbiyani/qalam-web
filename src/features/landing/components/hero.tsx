"use client"

import { m } from "framer-motion"
import Link from "next/link"

import { easeOutSoft, staggerContainer } from "@/shared/animations/presets"
import { hero } from "@/features/landing/content"
import { HeroVisual } from "@/features/landing/components/hero-visual"
import { trackEvent } from "@/lib/firebase/analytics"
import { UmberleafMark } from "@/shared/components/brand/umberleaf-mark"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Container } from "@/shared/ui/container"
import { Section } from "@/shared/ui/section"

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOutSoft } },
}

/** Above the fold: the promise, the proof, the ask. */
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
        <m.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12)}
          className="flex max-w-xl flex-col items-start gap-6"
        >
          <m.div variants={item}>
            <Badge variant="accent">{hero.badge}</Badge>
          </m.div>

          <m.h1
            variants={item}
            className="font-display text-display-lg font-semibold text-balance md:text-display-xl"
          >
            {hero.headline}
          </m.h1>

          <m.p
            variants={item}
            className="text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl"
          >
            {hero.subheadline}
          </m.p>

          <m.div variants={item} className="flex flex-wrap items-center gap-3 pt-2">
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
          </m.div>

          <m.p variants={item} className="text-sm text-muted-foreground">
            {hero.assurance}
          </m.p>
        </m.div>

        <HeroVisual />
      </Container>
    </Section>
  )
}
