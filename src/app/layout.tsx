import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"

import { AnalyticsTracker } from "@/shared/components/analytics-tracker"
import { Providers } from "@/shared/components/providers"
import { SiteFooter } from "@/shared/components/site-footer"
import { SiteHeader } from "@/shared/components/site-header"
import { fraunces, inter } from "@/shared/lib/fonts"
import { JsonLd, organizationSchema, websiteSchema } from "@/shared/lib/seo/json-ld"
import { siteConfig } from "@/shared/lib/site-config"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: {
    canonical: "./",
    types: { "application/rss+xml": [{ url: "/rss.xml", title: `${siteConfig.name} Blog` }] },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.social.twitterHandle,
    creator: siteConfig.social.twitterHandle,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#161210" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-svh flex-col antialiased">
        <Providers>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <AnalyticsTracker />
        </Providers>
        <JsonLd schema={organizationSchema()} />
        <JsonLd schema={websiteSchema()} />
      </body>
    </html>
  )
}
