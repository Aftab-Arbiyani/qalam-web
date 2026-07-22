"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import {
  waitlistSchema,
  type WaitlistFormValues,
} from "@/features/waitlist/schemas/waitlist-schema"
import { addToWaitlist } from "@/features/waitlist/services/waitlist-service"
import type { WaitlistFailureReason } from "@/features/waitlist/types"
import { trackEvent } from "@/lib/firebase/analytics"
import { consumeRateLimit } from "@/shared/lib/rate-limit"

export type WaitlistStatus = "idle" | "submitting" | "success" | "duplicate" | "error"

/** Human copy for every failure mode — no raw error strings in the UI. */
const ERROR_MESSAGES: Record<WaitlistFailureReason, string> = {
  duplicate: "",
  "rate-limited": "A few too many tries — give it a minute and try again.",
  unavailable: "The waitlist isn't reachable right now. Please try again shortly.",
  unknown: "Something went wrong on our side. Please try again.",
}

/** Bots submit instantly; humans read the form first. */
const MIN_FILL_TIME_MS = 2500

/**
 * Everything the waitlist form needs: RHF wiring, spam gates, rate limiting,
 * submission state machine and analytics — the component stays presentational.
 */
export function useWaitlist(source: string) {
  const [status, setStatus] = useState<WaitlistStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mountedAt = useRef<number>(Date.now())

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { name: "", email: "", interest: "writing", company: "" },
  })

  const onSubmit = useCallback(
    async (values: WaitlistFormValues) => {
      setErrorMessage(null)

      // Spam gates: honeypot filled or superhuman fill speed → pretend success,
      // never write. Bots learn nothing; humans are unaffected.
      const isBot = Boolean(values.company) || Date.now() - mountedAt.current < MIN_FILL_TIME_MS
      if (isBot) {
        setStatus("success")
        return
      }

      if (!consumeRateLimit({ key: "waitlist", max: 3, windowMs: 10 * 60_000 })) {
        setStatus("error")
        setErrorMessage(ERROR_MESSAGES["rate-limited"])
        return
      }

      setStatus("submitting")
      const result = await addToWaitlist(values, source)

      if (result.ok) {
        setStatus("success")
        trackEvent("waitlist_signup", { source, interest: values.interest })
        return
      }
      if (result.reason === "duplicate") {
        // Not an error: they're already in. Celebrate accordingly.
        setStatus("duplicate")
        return
      }
      setStatus("error")
      setErrorMessage(ERROR_MESSAGES[result.reason])
    },
    [source],
  )

  return {
    form,
    status,
    errorMessage,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: status === "submitting",
    isDone: status === "success" || status === "duplicate",
  }
}
