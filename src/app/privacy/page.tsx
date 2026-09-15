import type { Metadata } from "next"

import { siteConfig } from "@/shared/lib/site-config"
import { Container } from "@/shared/ui/container"
import { Section } from "@/shared/ui/section"

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Umberleaf's pre-launch website collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
}

// The policy promises this date moves whenever the policy does. Adding a
// processor is material, so it moves.
const LAST_UPDATED = "September 15, 2026"

export default function PrivacyPage() {
  return (
    <Section spacing="hero">
      <Container size="narrow">
        <div className="mx-auto prose-umberleaf">
          <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">Legal</p>
          <h1 className="mt-2 mb-2 font-display text-3xl font-semibold md:text-4xl">
            Privacy policy
          </h1>
          <p className="mt-0 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

          <p>
            This policy covers the {siteConfig.name} pre-launch website at{" "}
            <a href={siteConfig.url}>{siteConfig.url}</a>. It is written to be read: short, in plain
            language, and honest about what we collect and why. When the {siteConfig.name} product
            launches, it will ship with its own policy.
          </p>

          <h2>What we collect</h2>
          <p>We collect information in exactly two situations, both initiated by you:</p>
          <ul>
            <li>
              <strong>Waitlist signups.</strong> Your name (a pen name is fine), email address, and
              what brings you to Umberleaf (writing, reading, or both), along with the time you
              joined and which part of the site you joined from.
            </li>
            <li>
              <strong>Newsletter subscriptions.</strong> Your email address, the time you
              subscribed, and where on the site you subscribed from.
            </li>
          </ul>
          <p>
            We also use Firebase Analytics (Google Analytics 4) to understand how the site is used
            in aggregate: pages viewed, how far people scroll, which buttons are clicked. This data
            is pseudonymous; we don&apos;t use it to identify you, and we don&apos;t buy, sell, or
            enrich it with data from anywhere else.
          </p>
          <p>
            Alongside it we use Vercel Analytics, which counts page views and where visitors arrived
            from. It sets no cookies and stores no identifier on your device: each view is recorded
            as a one-way hash that is discarded within a day, so it cannot follow you between visits
            or across sites, and there is nothing in it we could tie back to you.
          </p>

          <h2>What we use it for</h2>
          <ul>
            <li>To hold your place in line and email you when your circle opens.</li>
            <li>To send the newsletter you asked for: occasional letters, no drip campaigns.</li>
            <li>To understand which parts of this site work, so we can improve it.</li>
          </ul>
          <p>
            That&apos;s the whole list. We do not sell personal information. We do not share it with
            advertisers. We will never add you to a list you didn&apos;t ask to be on.
          </p>

          <h2>Where it lives</h2>
          <p>
            Waitlist and newsletter entries are stored in Google Cloud Firestore, and that analytics
            data is processed by Google&apos;s Firebase Analytics. Both are governed by{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google&apos;s privacy policy
            </a>{" "}
            in addition to this one. This website is hosted on Vercel, who also process the Vercel
            Analytics counts under{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              their privacy policy
            </a>
            .
          </p>

          <h2>Cookies & local storage</h2>
          <p>
            We use local storage for your theme preference (light or dark) and for basic client-side
            rate limiting on our forms. Firebase Analytics sets its own identifiers to distinguish
            visits; Vercel Analytics sets nothing at all. We run no third-party advertising or
            tracking pixels.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us at any time to show you the information we hold about you, correct it, or
            delete it entirely, including removing you from the waitlist or newsletter. One email to{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> is enough; we&apos;ll
            confirm when it&apos;s done. Every newsletter also carries an unsubscribe link.
          </p>

          <h2>Children</h2>
          <p>
            This site isn&apos;t directed at children under 13 (or the equivalent age in your
            jurisdiction), and we don&apos;t knowingly collect their information. If you believe a
            child has joined the waitlist, write to us and we&apos;ll remove the entry.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes, the date at the top changes with it, and material changes will
            be noted on this page. We won&apos;t quietly rewrite the terms of trust.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about privacy: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </Container>
    </Section>
  )
}
