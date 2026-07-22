"use client"

import { faq } from "@/features/landing/content"
import { trackEvent } from "@/lib/firebase/analytics"
import { Reveal } from "@/shared/animations/reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion"
import { Container } from "@/shared/ui/container"
import { Section, SectionHeading } from "@/shared/ui/section"

/** FAQ accordion. The matching FAQPage JSON-LD is emitted by the page (server). */
export function Faq() {
  return (
    <Section id="faq">
      <Container size="narrow">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />
        <Reveal>
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border bg-card px-6 shadow-card sm:px-8"
            onValueChange={(value) => {
              const item = faq.items.find((entry) => entry.question === value)
              if (item) trackEvent("faq_open", { question: item.question })
            }}
          >
            {faq.items.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </Section>
  )
}
