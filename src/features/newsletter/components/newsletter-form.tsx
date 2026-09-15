"use client"

import { AnimatePresence, m } from "framer-motion"
import { MailCheck } from "lucide-react"
import { useId } from "react"

import { useNewsletter } from "@/features/newsletter/hooks/use-newsletter"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Spinner } from "@/shared/ui/spinner"
import { cn } from "@/shared/lib/utils"

interface NewsletterFormProps {
  /** Analytics source tag, e.g. "footer", "blog". */
  source: string
  className?: string
}

/**
 * Compact inline newsletter signup — a single email field. Used in the
 * footer and beside long-form content.
 */
export function NewsletterForm({ source, className }: NewsletterFormProps) {
  const { form, status, errorMessage, onSubmit, isSubmitting, isDone } = useNewsletter(source)
  const {
    register,
    formState: { errors },
  } = form
  const uid = useId()
  const emailId = `${uid}-nl-email`

  return (
    <div className={cn("w-full max-w-md", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {isDone ? (
          <m.p
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-2 text-sm text-foreground"
            role="status"
          >
            <MailCheck className="size-4 shrink-0 text-primary" aria-hidden />
            {status === "duplicate"
              ? "You're already subscribed. The next letter is on its way."
              : "Subscribed. Letters on craft, sent rarely and only when worth it."}
          </m.p>
        ) : (
          <m.form
            key="form"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-2"
            aria-label="Subscribe to the Umberleaf newsletter"
          >
            {/* Honeypot */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={`${uid}-nl-company`}>Company</label>
              <input
                id={`${uid}-nl-company`}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("company")}
              />
            </div>

            <div className="flex gap-2">
              <label htmlFor={emailId} className="sr-only">
                Email address
              </label>
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
              <Button type="submit" disabled={isSubmitting} aria-label="Subscribe">
                {isSubmitting ? <Spinner /> : "Subscribe"}
              </Button>
            </div>

            <div aria-live="polite">
              {errors.email ? (
                <p id={`${emailId}-error`} className="text-xs text-destructive" role="alert">
                  {errors.email.message}
                </p>
              ) : status === "error" && errorMessage ? (
                <p className="text-xs text-destructive">{errorMessage}</p>
              ) : null}
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}
