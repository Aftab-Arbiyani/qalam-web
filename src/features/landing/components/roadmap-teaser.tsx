import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { roadmapTeaser } from "@/features/landing/content"
import { Reveal } from "@/shared/animations/reveal"
import { Button } from "@/shared/ui/button"
import { Container } from "@/shared/ui/container"
import { Section } from "@/shared/ui/section"

/** The future, in one breath — details live on /roadmap. */
export function RoadmapTeaser() {
  return (
    <Section spacing="compact">
      <Container size="narrow">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border bg-card p-8 sm:flex-row sm:items-center md:p-10">
            <div className="max-w-md">
              <p className="mb-2 text-sm font-medium tracking-[0.18em] text-primary uppercase">
                {roadmapTeaser.eyebrow}
              </p>
              <h2 className="mb-2 font-display text-xl font-semibold md:text-2xl">
                {roadmapTeaser.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {roadmapTeaser.description}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/roadmap">
                {roadmapTeaser.cta}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
