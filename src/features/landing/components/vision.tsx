import { vision } from "@/features/landing/content"
import { Reveal } from "@/shared/animations/reveal"
import { Container } from "@/shared/ui/container"
import { Section } from "@/shared/ui/section"

/** Problem → vision, told as a short manifesto rather than a feature list. */
export function Vision() {
  return (
    <Section tone="muted">
      <Container size="narrow">
        <Reveal>
          <p className="mb-4 text-sm font-medium tracking-[0.18em] text-primary uppercase">
            {vision.eyebrow}
          </p>
          <h2 className="mb-8 font-display text-display-sm font-semibold text-balance md:text-display">
            {vision.title}
          </h2>
        </Reveal>

        <div className="space-y-6">
          {vision.paragraphs.map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.08}>
              <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <blockquote className="mt-12 border-l-2 border-primary pl-6">
            <p className="font-display text-2xl leading-snug text-balance italic md:text-3xl">
              {vision.pullQuote}
            </p>
          </blockquote>
        </Reveal>
      </Container>
    </Section>
  )
}
