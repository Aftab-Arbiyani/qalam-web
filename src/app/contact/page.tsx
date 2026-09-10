import { Mail, Newspaper, MessageCircle } from "lucide-react"
import type { Metadata } from "next"

import { NewsletterForm } from "@/features/newsletter/components/newsletter-form"
import { Reveal, RevealGroup, RevealItem } from "@/shared/animations/reveal"
import { ExternalLink } from "@/shared/components/external-link"
import { siteConfig } from "@/shared/lib/site-config"
import { Card, CardContent } from "@/shared/ui/card"
import { Container } from "@/shared/ui/container"
import { Section, SectionHeading } from "@/shared/ui/section"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to the Umberleaf team — questions, press, partnerships, or just a good sentence.",
  alternates: { canonical: "/contact" },
}

const CHANNELS = [
  {
    icon: Mail,
    title: "Say hello",
    body: "Questions, ideas, or a sentence you're proud of — we read everything.",
    action: { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
  },
  {
    icon: Newspaper,
    title: "Press & partnerships",
    body: "Writing about Umberleaf, or building something adjacent to it?",
    action: { label: siteConfig.pressEmail, href: `mailto:${siteConfig.pressEmail}` },
  },
  {
    icon: MessageCircle,
    title: "Follow along",
    body: "Build notes and short thoughts between the longer letters.",
    action: { label: "X / Twitter", href: siteConfig.social.twitter, external: true },
  },
] as const

export default function ContactPage() {
  return (
    <Section spacing="hero">
      <Container size="narrow">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Write to us. We're partial to letters."
          description="A small team reads this inbox — expect a human reply, at human speed."
        />

        <RevealGroup className="grid gap-5 sm:grid-cols-3" stagger={0.08}>
          {CHANNELS.map((channel) => (
            <RevealItem key={channel.title} className="h-full">
              <Card className="h-full text-center">
                <CardContent className="flex h-full flex-col items-center gap-3 p-7">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <channel.icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="font-display text-lg font-semibold">{channel.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{channel.body}</p>
                  {"external" in channel.action && channel.action.external ? (
                    <ExternalLink
                      href={channel.action.href}
                      location="contact"
                      className="mt-auto text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {channel.action.label}
                    </ExternalLink>
                  ) : (
                    <a
                      href={channel.action.href}
                      className="mt-auto text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {channel.action.label}
                    </a>
                  )}
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-14 rounded-2xl border bg-muted/50 p-8">
            <h2 className="mb-2 font-display text-lg font-semibold">Prefer we write first?</h2>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Occasional letters on craft and the making of Umberleaf.
            </p>
            <NewsletterForm source="contact" />
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
