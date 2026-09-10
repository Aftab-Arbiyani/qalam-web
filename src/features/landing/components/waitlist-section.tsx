import { WaitlistForm } from "@/features/waitlist/components/waitlist-form"
import { waitlistSection } from "@/features/landing/content"
import { Reveal } from "@/shared/animations/reveal"
import { UmberleafMark } from "@/shared/components/brand/umberleaf-mark"
import { Container } from "@/shared/ui/container"
import { Section, SectionHeading } from "@/shared/ui/section"

/** The closer: the page's one true call to action. */
export function WaitlistSection() {
  return (
    <Section id="waitlist" tone="muted" className="scroll-mt-16">
      <Container className="flex flex-col items-center">
        <Reveal className="flex flex-col items-center">
          <UmberleafMark size={56} className="mb-8" label={null} />
          <SectionHeading
            eyebrow={waitlistSection.eyebrow}
            title={waitlistSection.title}
            description={waitlistSection.description}
            className="mb-10"
          />
        </Reveal>
        <Reveal delay={0.1} className="flex w-full justify-center">
          <WaitlistForm source="waitlist-section" />
        </Reveal>
      </Container>
    </Section>
  )
}
