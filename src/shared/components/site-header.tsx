"use client"

import { AnimatePresence, m } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { trackEvent } from "@/lib/firebase/analytics"
import { QalamWordmark } from "@/shared/components/brand/qalam-mark"
import { ThemeToggle } from "@/shared/components/theme-toggle"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Container } from "@/shared/ui/container"

const NAV_ITEMS = [
  { href: "/about", label: "Story" },
  { href: "/blog", label: "Blog" },
  { href: "/roadmap", label: "Roadmap" },
] as const

/**
 * Sticky site header: brand, primary nav, theme toggle, waitlist CTA.
 * Gains a border + solid surface once the page scrolls.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || menuOpen
          ? "border-b bg-background/95 supports-[backdrop-filter]:bg-background/90 supports-[backdrop-filter]:backdrop-blur-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Qalam — home"
        >
          <QalamWordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => trackEvent("cta_click", { cta: "join_waitlist", location: "header" })}
          >
            <Link href="/#waitlist">Join the waitlist</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </Button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <m.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b bg-background md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    pathname.startsWith(item.href) ? "text-primary" : "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                asChild
                className="mt-2"
                onClick={() =>
                  trackEvent("cta_click", { cta: "join_waitlist", location: "mobile-menu" })
                }
              >
                <Link href="/#waitlist">Join the waitlist</Link>
              </Button>
            </Container>
          </m.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
