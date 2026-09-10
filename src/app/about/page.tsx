import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "@/shared/animations/reveal"
import { UmberleafMark } from "@/shared/components/brand/umberleaf-mark"
import { Button } from "@/shared/ui/button"
import { Container } from "@/shared/ui/container"
import { Section } from "@/shared/ui/section"

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Why Umberleaf exists: the story, mission and vision behind a quieter home for the written word.",
  alternates: { canonical: "/about" },
}

const MISSION_POINTS = [
  {
    title: "Protect the act of writing",
    body: "Every product decision starts with one test: does this help someone write better, or does it help us hold their attention? If it's the second, it doesn't ship.",
  },
  {
    title: "Coach craft, never replace it",
    body: "Our AI reads like an editor and asks like a mentor. It has no path to your page — the words are always yours.",
  },
  {
    title: "Honor the reader",
    body: "Reading is the other half of writing. We build for people who finish pieces, return to writers, and leave notes in margins.",
  },
] as const

export default function AboutPage() {
  return (
    <>
      <Section spacing="hero">
        <Container size="narrow">
          <Reveal>
            <UmberleafMark size={56} className="mb-8" label={null} />
            <p className="mb-4 text-sm font-medium tracking-[0.18em] text-primary uppercase">
              Our story
            </p>
            <h1 className="mb-8 font-display text-display-sm font-semibold text-balance md:text-display-lg">
              It started with a leaf and a page.
            </h1>
          </Reveal>

          <div className="prose-umberleaf">
            <Reveal>
              <p>
                An <em>umber leaf</em> is an autumn leaf — umber for the earth pigment, the deep
                red-brown of a season turning. We chose it because a leaf is already a page: thin,
                particular, and ready in its own time. It names the oldest promise of this craft —
                something between a mind and a page, and nothing else in the way.
              </p>
            </Reveal>
            <Reveal>
              <p>
                Umberleaf began as a frustration shared over too many cups of coffee: everyone we
                knew who loved writing had quietly stopped publishing. Not writing —{" "}
                <em>publishing</em>. The platforms had turned the town square into a trading floor,
                and the writers we admired had drawers full of work that deserved readers and no
                room worth putting it in.
              </p>
            </Reveal>
            <Reveal>
              <p>
                So we started building the room we couldn&apos;t find: an editor with the calm of
                paper, a companion with the ear of a good editor, and a reading experience designed
                for the current page instead of the next scroll.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container size="narrow">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-[0.18em] text-primary uppercase">
              Mission
            </p>
            <h2 className="mb-10 font-display text-display-sm font-semibold text-balance">
              Make the internet a better place to be a writer.
            </h2>
          </Reveal>
          <div className="flex flex-col gap-8">
            {MISSION_POINTS.map((point, index) => (
              <Reveal key={point.title} delay={index * 0.06}>
                <div className="flex gap-5">
                  <span className="mt-0.5 font-display text-2xl font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mb-1.5 font-display text-lg font-semibold">{point.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{point.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <Reveal>
            <p className="mb-4 text-sm font-medium tracking-[0.18em] text-primary uppercase">
              Vision
            </p>
            <h2 className="mb-8 font-display text-display-sm font-semibold text-balance">
              A generation of writers who never learned to perform.
            </h2>
          </Reveal>
          <div className="prose-umberleaf">
            <Reveal>
              <p>
                Ten years from now, we want there to be writers who came of age on Umberleaf and
                find the old bargain strange — who assume readers arrive to read, that feedback
                sounds like editing rather than scoring, and that the measure of a piece is whether
                it was worth someone&apos;s whole attention.
              </p>
            </Reveal>
            <Reveal>
              <blockquote>
                <p>
                  The pen is the instrument. The writing is the point. Everything else is furniture.
                </p>
              </blockquote>
            </Reveal>
            <Reveal>
              <p>
                We&apos;re a small team, building slowly and in the open. If this sounds like a room
                you&apos;d write in, there&apos;s a place in line with your name on it.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/#waitlist">Join the waitlist</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/roadmap">See the roadmap</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
