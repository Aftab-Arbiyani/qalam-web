"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { trackEvent } from "@/lib/firebase/analytics"
import { Button } from "@/shared/ui/button"

/** Light/dark switch. Renders a stable placeholder until mounted (no hydration flicker). */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={
        mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"
      }
      onClick={() => {
        const next = isDark ? "light" : "dark"
        setTheme(next)
        trackEvent("theme_change", { theme: next })
      }}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-[18px]" aria-hidden />
        ) : (
          <Moon className="size-[18px]" aria-hidden />
        )
      ) : (
        <span className="size-[18px]" aria-hidden />
      )}
    </Button>
  )
}
