"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/features/newsletter/schemas/newsletter-schema"
import { subscribeToNewsletter } from "@/features/newsletter/services/newsletter-service"
import type { SubmitFailureReason } from "@/lib/firebase/errors"
import { trackEvent } from "@/lib/firebase/analytics"
import { consumeRateLimit } from "@/shared/lib/rate-limit"

export type NewsletterStatus = "idle" | "submitting" | "success" | "duplicate" | "error"

const ERROR_MESSAGES: Record<SubmitFailureReason, string> = {
  duplicate: "",
  "rate-limited": "A few too many tries. Give it a minute.",
  unavailable: "Can't reach the mailing list right now. Try again shortly.",
  unknown: "Something went wrong on our side. Please try again.",
}

const MIN_FILL_TIME_MS = 1500

/** Submission state machine for the one-field newsletter form. */
export function useNewsletter(source: string) {
  const [status, setStatus] = useState<NewsletterStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mountedAt = useRef<number>(Date.now())

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", company: "" },
  })

  const onSubmit = useCallback(
    async (values: NewsletterFormValues) => {
      setErrorMessage(null)

      const isBot = Boolean(values.company) || Date.now() - mountedAt.current < MIN_FILL_TIME_MS
      if (isBot) {
        setStatus("success")
        return
      }

      if (!consumeRateLimit({ key: "newsletter", max: 3, windowMs: 10 * 60_000 })) {
        setStatus("error")
        setErrorMessage(ERROR_MESSAGES["rate-limited"])
        return
      }

      setStatus("submitting")
      const result = await subscribeToNewsletter(values.email, source)

      if (result.ok) {
        setStatus("success")
        trackEvent("newsletter_signup", { source })
        return
      }
      if (result.reason === "duplicate") {
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
