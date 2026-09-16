import { features } from "@/features/landing/content"
import { RevealGroup, RevealItem } from "@/shared/animations/reveal"
import { Card, CardContent } from "@/shared/ui/card"
import { Container } from "@/shared/ui/container"
import { Section, SectionHeading } from "@/shared/ui/section"

/** The solution, in six commitments. */
export function Features() {
  return (
    <Section id="features">
      <Container>
        <SectionHeading
          eyebrow={features.eyebrow}
          title={features.title}
          description={features.description}
        />

        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((feature) => (
            <RevealItem key={feature.title} className="h-full">
              <Card className="group h-full hover:shadow-card-hover">
                <CardContent className="flex h-full flex-col gap-4 p-7">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  )
}
