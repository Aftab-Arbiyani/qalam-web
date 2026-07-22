import { z } from "zod"

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(6, "We need an email to send the letters to.")
    .max(254, "That email is a little long.")
    .email("That doesn't look like an email address."),
  /** Honeypot — see waitlist-schema. */
  company: z.string().max(0).optional().or(z.literal("")),
})

export type NewsletterFormValues = z.infer<typeof newsletterSchema>
