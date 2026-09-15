"use client"

import { AnimatePresence, m } from "framer-motion"
import { CornerDownRight, Sparkles } from "lucide-react"
import { useId, useRef, useState } from "react"

import { easeOutSoft } from "@/shared/animations/presets"
import { sneakPeek } from "@/features/landing/content"
import { Container } from "@/shared/ui/container"
import { Section, SectionHeading } from "@/shared/ui/section"
import { cn } from "@/shared/lib/utils"

type PanelId = (typeof sneakPeek.panels)[number]["id"]

/**
 * Three corners of the product, sketched as typographic vignettes.
 * Accessible tabs (roving focus, arrow keys) — no screenshots to go stale.
 */
export function SneakPeek() {
  const [active, setActive] = useState<PanelId>("editor")
  const uid = useId()
  const tabRefs = useRef<Map<PanelId, HTMLButtonElement>>(new Map())

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const count = sneakPeek.panels.length
    let next: number | null = null
    if (event.key === "ArrowRight") next = (index + 1) % count
    if (event.key === "ArrowLeft") next = (index - 1 + count) % count
    if (event.key === "Home") next = 0
    if (event.key === "End") next = count - 1
    if (next !== null) {
      event.preventDefault()
      const panel = sneakPeek.panels[next]
      setActive(panel.id)
      tabRefs.current.get(panel.id)?.focus()
    }
  }

  const activePanel = sneakPeek.panels.find((panel) => panel.id === active) ?? sneakPeek.panels[0]

  return (
    <Section id="peek">
      <Container>
        <SectionHeading
          eyebrow={sneakPeek.eyebrow}
          title={sneakPeek.title}
          description={sneakPeek.description}
        />

        <div
          role="tablist"
          aria-label="Product previews"
          className="mx-auto mb-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border bg-card p-1"
        >
          {sneakPeek.panels.map((panel, index) => (
            <button
              key={panel.id}
              ref={(el) => {
                if (el) tabRefs.current.set(panel.id, el)
              }}
              role="tab"
              id={`${uid}-tab-${panel.id}`}
              aria-selected={active === panel.id}
              aria-controls={`${uid}-panel-${panel.id}`}
              tabIndex={active === panel.id ? 0 : -1}
              onClick={() => setActive(panel.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                active === panel.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {panel.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`${uid}-panel-${activePanel.id}`}
          aria-labelledby={`${uid}-tab-${activePanel.id}`}
          className="mx-auto max-w-3xl"
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={activePanel.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: easeOutSoft }}
            >
              <p className="mb-4 text-center text-sm text-muted-foreground">
                {activePanel.description}
              </p>
              <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-10">
                {activePanel.id === "editor" ? <EditorVignette /> : null}
                {activePanel.id === "reader" ? <ReaderVignette /> : null}
                {activePanel.id === "desk" ? <DeskVignette /> : null}
              </div>
            </m.div>
          </AnimatePresence>
          <p className="mt-4 text-center text-xs text-muted-foreground">{sneakPeek.caption}</p>
        </div>
      </Container>
    </Section>
  )
}

/* ── Vignettes — typographic sketches of the product, aria-hidden decorative ── */

function EditorVignette() {
  return (
    <div aria-hidden="true" className="grid gap-6 sm:grid-cols-[1fr_180px]">
      <div>
        <p className="mb-1 text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Essay · Draft 3
        </p>
        <h4 className="mb-4 font-display text-xl font-semibold">On Walking Home</h4>
        <div className="space-y-2.5 font-display text-[15px] leading-relaxed text-foreground/85 italic">
          <p>The long way home adds twelve minutes and</p>
          <p>subtracts the whole day&apos;s noise. I take it</p>
          <p>
            when a paragraph refuses to end
            <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-caret-blink bg-primary" />
          </p>
        </div>
        <p className="mt-6 border-t pt-3 text-xs text-muted-foreground">
          289 words · focus mode · autosaved
        </p>
      </div>
      <div className="hidden flex-col gap-3 sm:flex">
        <div className="rounded-lg border bg-background p-3">
          <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold tracking-wide text-primary uppercase">
            <Sparkles className="size-3" />
            Craft note
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Three sentences open with &ldquo;The.&rdquo; Vary the door you enter by?
          </p>
        </div>
        <div className="rounded-lg border bg-background p-3">
          <p className="mb-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            Rhythm
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Long · long · short. The short one lands.
          </p>
        </div>
      </div>
    </div>
  )
}

function ReaderVignette() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-md">
      <div className="mb-5 h-0.5 w-1/3 rounded-full bg-primary/60" />
      <h4 className="mb-1 font-display text-2xl font-semibold">The Weight of Small Hours</h4>
      <p className="mb-5 text-xs text-muted-foreground">Amira H. · 11 min read · Essays on time</p>
      <div className="space-y-3 text-sm leading-[1.9] text-foreground/85">
        <p>
          There is a kind of tiredness that sleep doesn&apos;t answer. It collects in the hours
          nobody claims: the twenty minutes before a meeting, the platform wait, the kettle&apos;s
          slow argument with itself.
        </p>
        <p className="rounded-md bg-accent/70 px-2 py-1">
          We gave those hours away so quietly we never noticed the signature.
        </p>
      </div>
      <p className="mt-6 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
        <CornerDownRight className="size-3.5" />
        14 readers left margin notes on this passage
      </p>
    </div>
  )
}

function DeskVignette() {
  const stats = [
    { label: "Readers this month", value: "1,204" },
    { label: "Returned to read more", value: "38%" },
    { label: "Read to the end", value: "61%" },
  ]
  const pieces = [
    { title: "On Walking Home", resonance: 86 },
    { title: "The Weight of Small Hours", resonance: 72 },
    { title: "Letters I Never Sent", resonance: 54 },
  ]
  return (
    <div aria-hidden="true">
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-background p-4">
            <p className="font-display text-2xl font-semibold text-primary">{stat.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Resonance by piece
      </p>
      <div className="space-y-2.5">
        {pieces.map((piece) => (
          <div key={piece.title} className="flex items-center gap-3">
            <p className="w-44 truncate text-xs">{piece.title}</p>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${piece.resonance}%` }}
              />
            </div>
            <p className="w-8 text-right text-[11px] text-muted-foreground">{piece.resonance}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
