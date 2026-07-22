import Link from "next/link"

import { QalamMark } from "@/shared/components/brand/qalam-mark"
import { Button } from "@/shared/ui/button"
import { Container } from "@/shared/ui/container"
import { Section } from "@/shared/ui/section"

export default function NotFound() {
  return (
    <Section spacing="hero">
      <Container size="narrow" className="flex flex-col items-center text-center">
        <QalamMark size={56} className="mb-8 opacity-80" label={null} />
        <p className="mb-3 text-sm font-medium tracking-[0.18em] text-primary uppercase">404</p>
        <h1 className="mb-4 font-display text-display-sm font-semibold text-balance md:text-display">
          This page wandered off mid-sentence.
        </h1>
        <p className="mb-8 max-w-md leading-relaxed text-muted-foreground">
          Perhaps it&apos;s in a drawer somewhere, waiting for a better draft. The writing you came
          for is still here.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">Back to the beginning</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">Read the blog</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
