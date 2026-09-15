import type { Metadata } from "next"

import { Faq } from "@/features/landing/components/faq"
import { Features } from "@/features/landing/components/features"
import { Hero } from "@/features/landing/components/hero"
import { RoadmapTeaser } from "@/features/landing/components/roadmap-teaser"
import { SneakPeek } from "@/features/landing/components/sneak-peek"
import { Vision } from "@/features/landing/components/vision"
import { WaitlistSection } from "@/features/landing/components/waitlist-section"
import { WhyUmberleaf } from "@/features/landing/components/why-umberleaf"
import { faq } from "@/features/landing/content"
import { faqSchema, JsonLd } from "@/shared/lib/seo/json-ld"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

/**
 * The landing page. Narrative order: promise (hero) → problem & vision →
 * solution (features) → proof (sneak peek) → difference (why) → future
 * (roadmap) → objections (faq) → ask (waitlist).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Vision />
      <Features />
      <SneakPeek />
      <WhyUmberleaf />
      <RoadmapTeaser />
      <Faq />
      <WaitlistSection />
      <JsonLd schema={faqSchema(faq.items)} />
    </>
  )
}
