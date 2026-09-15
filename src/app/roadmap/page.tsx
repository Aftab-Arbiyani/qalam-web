import type { Metadata } from "next"
import Link from "next/link"

import { Reveal, RevealGroup, RevealItem } from "@/shared/animations/reveal"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Container } from "@/shared/ui/container"
import { Section, SectionHeading } from "@/shared/ui/section"
import { cn } from "@/shared/lib/utils"

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What we're building and in what order: Umberleaf's public roadmap, from the waitlist to the first open circles.",
  alternates: { canonical: "/roadmap" },
}

type PhaseStatus = "now" | "next" | "later"

const STATUS_META: Record<
  PhaseStatus,
  { label: string; badgeVariant: "default" | "accent" | "outline" }
> = {
  now: { label: "In progress", badgeVariant: "default" },
  next: { label: "Up next", badgeVariant: "accent" },
  later: { label: "On the horizon", badgeVariant: "outline" },
}

interface Phase {
  status: PhaseStatus
  period: string
  title: string
  description: string
  items: readonly string[]
}

const PHASES: readonly Phase[] = [
  {
    status: "now",
    period: "Summer 2026",
    title: "The waitlist & the letters",
    description: "Gathering the first circles and writing in the open while the product hardens.",
    items: [
      "Waitlist open: circles form in order of joining",
      "Essays on craft and build notes on this blog",
      "Private testing of the editor with a small group of writers",
    ],
  },
  {
    status: "next",
    period: "Autumn 2026",
    title: "The first circle writes",
    description:
      "Early access for the first waitlist circles: the room, the pen, and the first readers.",
    items: [
      "The editor: focus mode, autosave, versions that make sense",
      "Publishing: clean pages, permanent addresses, beautiful typography",
      "The reading room: full pages, margin notes, no infinite scroll",
      "The craft companion, first edition: rhythm, clarity and structure notes",
    ],
  },
  {
    status: "later",
    period: "Winter 2026 →",
    title: "The doors open wider",
    description: "More circles, more surfaces, and the parts of the platform that reward patience.",
    items: [
      "iOS & Android apps: the same care on every screen",
      "Collections and serials: work that unfolds over time",
      "Story Map: the people, places and threads of a long work, drawn from the draft itself",
      "A writer's desk: readers, returns and resonance, in service of craft",
      "Fair, transparent supporter tools: writers paid without paywalls-by-ambush",
    ],
  },
] as const

export default function RoadmapPage() {
  return (
    <Section spacing="hero">
      <Container size="narrow">
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Roadmap"
          title="Built in the open, in order."
          description="Dates are seasons, not promises carved in stone. When reality and the roadmap disagree, we update the roadmap, here, in public."
        />

        <RevealGroup
          className="relative flex flex-col gap-10 border-l-2 border-border pl-8"
          stagger={0.12}
        >
          {PHASES.map((phase) => (
            <RevealItem key={phase.title} className="relative">
              {/* Timeline dot */}
              <span
                aria-hidden
                className={cn(
                  "absolute top-1.5 -left-[39px] size-3.5 rounded-full border-2 border-background",
                  phase.status === "now" ? "bg-primary" : "bg-border",
                )}
              />
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge variant={STATUS_META[phase.status].badgeVariant}>
                  {STATUS_META[phase.status].label}
                </Badge>
                <span className="text-sm text-muted-foreground">{phase.period}</span>
              </div>
              <h2 className="mb-2 font-display text-2xl font-semibold">{phase.title}</h2>
              <p className="mb-4 leading-relaxed text-muted-foreground">{phase.description}</p>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      aria-hidden
                      className="mt-[9px] size-1 shrink-0 rounded-full bg-primary"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-16 rounded-2xl border bg-muted/50 p-8 text-center">
            <h2 className="mb-2 font-display text-xl font-semibold">Your place in this timeline</h2>
            <p className="mx-auto mb-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Circles open in the order the waitlist formed. The earlier you join, the earlier you
              write.
            </p>
            <Button asChild size="lg">
              <Link href="/#waitlist">Join the waitlist</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
