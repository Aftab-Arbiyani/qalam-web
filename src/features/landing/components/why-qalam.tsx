import { MoveRight } from "lucide-react"

import { whyQalam } from "@/features/landing/content"
import { RevealGroup, RevealItem } from "@/shared/animations/reveal"
import { Container } from "@/shared/ui/container"
import { Section, SectionHeading } from "@/shared/ui/section"

/** The difference, drawn as elsewhere → here. No competitor names needed. */
export function WhyQalam() {
  return (
    <Section tone="muted">
      <Container size="narrow">
        <SectionHeading
          eyebrow={whyQalam.eyebrow}
          title={whyQalam.title}
          description={whyQalam.description}
        />

        <RevealGroup className="flex flex-col gap-3" stagger={0.09}>
          {whyQalam.rows.map((row) => (
            <RevealItem key={row.here}>
              <div className="grid items-center gap-2 rounded-xl border bg-card p-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
                <p className="text-sm leading-relaxed text-muted-foreground line-through decoration-border decoration-1">
                  {row.elsewhere}
                </p>
                <MoveRight className="hidden size-4 shrink-0 text-primary sm:block" aria-hidden />
                <p className="text-sm leading-relaxed font-medium">{row.here}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  )
}
