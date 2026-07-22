import type { Metadata } from "next"

import { siteConfig } from "@/shared/lib/site-config"
import { Container } from "@/shared/ui/container"
import { Section } from "@/shared/ui/section"

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that govern your use of Qalam's pre-launch website.",
  alternates: { canonical: "/terms" },
}

const LAST_UPDATED = "July 22, 2026"

export default function TermsPage() {
  return (
    <Section spacing="hero">
      <Container size="narrow">
        <div className="mx-auto prose-qalam">
          <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">Legal</p>
          <h1 className="mt-2 mb-2 font-display text-3xl font-semibold md:text-4xl">
            Terms of service
          </h1>
          <p className="mt-0 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <p>
            These terms cover the {siteConfig.name} pre-launch website at{" "}
            <a href={siteConfig.url}>{siteConfig.url}</a> — the pages, the blog, the waitlist and
            the newsletter. They&apos;re deliberately short: this is a marketing site, not the
            product. The {siteConfig.name} platform will have its own terms when it launches.
          </p>

          <h2>Using this site</h2>
          <p>
            You&apos;re welcome to browse, read, share links, and join the waitlist or newsletter.
            You agree not to abuse the site — no attempting to disrupt it, probe or overload our
            forms, scrape subscriber information, or submit entries on behalf of people who
            didn&apos;t ask you to.
          </p>

          <h2>The waitlist</h2>
          <p>
            Joining the waitlist reserves a place in line for early access to {siteConfig.name}. It
            doesn&apos;t create an account, cost anything, or obligate either of us: we may open
            circles at whatever pace keeps the product good, and you can leave the list at any time
            by writing to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. Positions
            can&apos;t be sold or transferred.
          </p>

          <h2>Our content</h2>
          <p>
            The writing, design, and brand on this site — including the {siteConfig.name} name, the
            qāf mark, and the essays on the blog — belong to {siteConfig.name}. You may quote and
            share excerpts with attribution and a link; republishing whole pieces requires
            permission (ask — we&apos;re friendly:{" "}
            <a href={`mailto:${siteConfig.pressEmail}`}>{siteConfig.pressEmail}</a>).
          </p>

          <h2>No warranties</h2>
          <p>
            This site is provided as-is. We work to keep it accurate and available, but we make no
            guarantees — about uptime, about launch dates (the <a href="/roadmap">roadmap</a> speaks
            in seasons for a reason), or about features described before they ship. Plans described
            here may change as the product takes shape.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, {siteConfig.name} isn&apos;t liable for
            indirect, incidental, or consequential damages arising from your use of this pre-launch
            site. Since the site is free and collects only what you offer it, our total liability is
            limited to the amount you paid to use it: nothing.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms as the site evolves; the date above will always reflect the
            current version. Continuing to use the site after a change means you accept the updated
            terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </Container>
    </Section>
  )
}
