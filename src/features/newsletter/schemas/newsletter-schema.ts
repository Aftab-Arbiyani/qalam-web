import { z } from "zod"

export const newsletterSchema = z.object({
  /** Normalize, then validate — see waitlist-schema for why the order matters. */
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(6, "We need an email to send the letters to.")
    .max(254, "That email is a little long.")
    .pipe(z.email("That doesn't look like an email address.")),
  /** Honeypot — accepts anything on purpose; see waitlist-schema. */
  company: z.string().optional(),
})

export type NewsletterFormValues = z.infer<typeof newsletterSchema>
