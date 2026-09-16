import { Sparkles } from "lucide-react"

import { UmberleafMark } from "@/shared/components/brand/umberleaf-mark"

const MANUSCRIPT_LINES = [
  "The lighthouse keeper's daughter learned to read",
  "by the sweep of the lamp, four seconds of light,",
  "four of dark. Her father said the sea taught",
  "patience; she suspected it taught rhythm,",
] as const

/**
 * The hero's "living manuscript": a typeset page writing itself, with a
 * craft note arriving in the margin. Pure HTML/CSS/SVG — no screenshots,
 * nothing to load, crisp at every DPI, honest about being a sketch.
 *
 * Decorative (aria-hidden), but still rendered visibly in the static HTML: on a
 * wide screen this card is a candidate for the largest contentful paint, and an
 * element that starts at opacity 0 is skipped by LCP until it fades in. The
 * staged sequence is CSS delays on a server component — no motion library, no
 * hydration in the critical path.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
      {/* Soft backdrop wash — one restrained radial, not a gradient festival. */}
      <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(closest-side,--alpha(var(--color-flame-500)/9%),transparent)]" />

      {/* The page */}
      <div
        className="fade-in-up relative rounded-2xl border bg-card p-8 shadow-card sm:p-10"
        style={{ animationDelay: "0.15s" }}
      >
        <p className="mb-1 text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Draft · Chapter one
        </p>
        <h3 className="mb-6 font-display text-2xl font-semibold tracking-tight">
          The Keeper&apos;s Daughter
        </h3>

        <div className="space-y-3 font-display text-[15px] leading-relaxed text-foreground/85 italic sm:text-base">
          {MANUSCRIPT_LINES.map((line, index) => (
            <p
              key={line}
              className="fade-in-up"
              style={{ animationDelay: `${0.6 + index * 0.35}s` }}
            >
              {line}
              {index === MANUSCRIPT_LINES.length - 1 ? (
                <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-caret-blink bg-primary" />
              ) : null}
            </p>
          ))}
        </div>

        <div
          className="fade-in mt-8 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground"
          style={{ animationDelay: "2.4s" }}
        >
          <span>412 words · saved a moment ago</span>
          <UmberleafMark variant="glyph" size={16} label={null} />
        </div>
      </div>

      {/* Margin craft note */}
      <div
        className="fade-in-right absolute -right-3 bottom-5 w-56 rounded-xl border bg-background p-4 shadow-card-hover sm:-right-8"
        style={{ animationDelay: "2.1s" }}
      >
        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-primary uppercase">
          <Sparkles className="size-3.5" />
          Craft note
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          &ldquo;Rhythm&rdquo; is doing quiet work here. What if the sentence ended on it?
        </p>
      </div>
    </div>
  )
}
