"use client"

import { AnimatePresence, m } from "framer-motion"
import { PenLine, BookOpen, Sparkles } from "lucide-react"
import { useId } from "react"

import { easeOutSoft } from "@/shared/animations/presets"
import { useWaitlist } from "@/features/waitlist/hooks/use-waitlist"
import {
  WAITLIST_INTERESTS,
  type WaitlistInterest,
} from "@/features/waitlist/schemas/waitlist-schema"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Spinner } from "@/shared/ui/spinner"
import { cn } from "@/shared/lib/utils"

const INTEREST_META: Record<WaitlistInterest, { label: string; icon: typeof PenLine }> = {
  writing: { label: "I write", icon: PenLine },
  reading: { label: "I read", icon: BookOpen },
  both: { label: "Both", icon: Sparkles },
}

interface WaitlistFormProps {
  /** Analytics source tag, e.g. "hero", "waitlist-section". */
  source: string
  className?: string
}

/**
 * The primary conversion surface. Name + email + intent, three states:
 * form → submitting → success (or "already on the list", which we treat as
 * a success of its own).
 */
export function WaitlistForm({ source, className }: WaitlistFormProps) {
  const { form, status, errorMessage, onSubmit, isSubmitting, isDone } = useWaitlist(source)
  const {
    register,
    formState: { errors },
  } = form
  const uid = useId()

  const nameId = `${uid}-name`
  const emailId = `${uid}-email`

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {isDone ? (
          <m.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: easeOutSoft }}
            className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center shadow-card"
            role="status"
          >
            <SuccessCheck />
            <div className="space-y-1.5">
              <h3 className="font-display text-xl font-semibold">
                {status === "duplicate" ? "You're already on the list" : "You're on the list"}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {status === "duplicate"
                  ? "Good news: this email already has a place in line. We'll write to you before the doors open."
                  : "Welcome. We'll write to you before the doors open: no noise in between, just the letter that matters."}
              </p>
            </div>
          </m.div>
        ) : (
          <m.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeIn" }}
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-5"
            aria-label="Join the Umberleaf waitlist"
          >
            {/* Honeypot — visually hidden, ignored by humans and screen readers. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={`${uid}-company`}>Company</label>
              <input
                id={`${uid}-company`}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("company")}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={nameId}>Name</Label>
                <Input
                  id={nameId}
                  placeholder="Your name, or a pen name"
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? `${nameId}-error` : undefined}
                  {...register("name")}
                />
                {errors.name ? (
                  <p id={`${nameId}-error`} className="text-xs text-destructive" role="alert">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={emailId}>Email</Label>
                <Input
                  id={emailId}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? `${emailId}-error` : undefined}
                  {...register("email")}
                />
                {errors.email ? (
                  <p id={`${emailId}-error`} className="text-xs text-destructive" role="alert">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-medium">What brings you here?</legend>
              <div
                className="grid grid-cols-3 gap-2"
                role="radiogroup"
                aria-label="What brings you here?"
              >
                {WAITLIST_INTERESTS.map((interest) => {
                  const { label, icon: Icon } = INTEREST_META[interest]
                  return (
                    <label
                      key={interest}
                      className={cn(
                        "flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5",
                        "text-sm font-medium transition-colors duration-200",
                        "hover:border-primary/50",
                        "has-checked:border-primary has-checked:bg-accent has-checked:text-accent-foreground",
                        "has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background",
                      )}
                    >
                      <input
                        type="radio"
                        value={interest}
                        className="sr-only"
                        {...register("interest")}
                      />
                      <Icon className="size-4" aria-hidden />
                      {label}
                    </label>
                  )
                })}
              </div>
              {errors.interest ? (
                <p className="text-xs text-destructive" role="alert">
                  {errors.interest.message}
                </p>
              ) : null}
            </fieldset>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:self-start"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Saving your place…
                </>
              ) : (
                "Join the waitlist"
              )}
            </Button>

            <div aria-live="polite">
              {status === "error" && errorMessage ? (
                <p className="text-sm text-destructive">{errorMessage}</p>
              ) : null}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              No spam, no chain of onboarding emails. One letter when it matters. Unsubscribe with a
              word.
            </p>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Animated check: the circle draws itself, then the tick. */
function SuccessCheck() {
  return (
    <m.svg
      viewBox="0 0 52 52"
      className="size-14 text-primary"
      fill="none"
      aria-hidden="true"
      initial="hidden"
      animate="visible"
    >
      <m.circle
        cx="26"
        cy="26"
        r="23"
        stroke="currentColor"
        strokeWidth="2.5"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
      />
      <m.path
        d="M15 27l7.5 7.5L37 20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut", delay: 0.45 },
          },
        }}
      />
    </m.svg>
  )
}
