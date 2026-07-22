import Link from "next/link"

import { NewsletterForm } from "@/features/newsletter/components/newsletter-form"
import { ExternalLink } from "@/shared/components/external-link"
import { QalamWordmark } from "@/shared/components/brand/qalam-mark"
import { siteConfig } from "@/shared/lib/site-config"
import { Container } from "@/shared/ui/container"

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our story" },
  { href: "/blog", label: "Blog" },
  { href: "/roadmap", label: "Roadmap" },
] as const

const COMPANY_LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const

/** Site footer: brand, sitemap, newsletter, socials, legal. Server component. */
export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <Container className="py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.6fr]">
          <div className="flex flex-col gap-4">
            <QalamWordmark />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}. <span className="font-display italic">Qalam</span> —{" "}
              <span lang="ar" dir="rtl">
                {siteConfig.nameArabic}
              </span>{" "}
              — is the Arabic word for pen.
            </p>
          </div>

          <nav aria-label="Explore" className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold tracking-wide">Explore</h2>
            {EXPLORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Company" className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold tracking-wide">Company</h2>
            {COMPANY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/rss.xml"
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              RSS
            </a>
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold tracking-wide">Letters on craft</h2>
            <p className="text-sm text-muted-foreground">
              Occasional essays on writing and the making of Qalam. Rare, and worth it.
            </p>
            <NewsletterForm source="footer" />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. Made for people who love the written
            word.
          </p>
          <div className="flex items-center gap-5">
            <ExternalLink
              href={siteConfig.social.twitter}
              location="footer"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              X / Twitter
            </ExternalLink>
            <ExternalLink
              href={siteConfig.social.instagram}
              location="footer"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Instagram
            </ExternalLink>
          </div>
        </div>
      </Container>
    </footer>
  )
}
