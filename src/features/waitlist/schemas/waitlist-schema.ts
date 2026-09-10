import { z } from "zod"

/** What brings someone to Umberleaf — mirrored in firestore.rules. */
export const WAITLIST_INTERESTS = ["writing", "reading", "both"] as const
export type WaitlistInterest = (typeof WAITLIST_INTERESTS)[number]

export const waitlistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tell us your name. Even a pen name works.")
    .max(80, "That name is a little long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(6, "We need an email to save your place.")
    .max(254, "That email is a little long.")
    .email("That doesn't look like an email address."),
  interest: z.enum(WAITLIST_INTERESTS, {
    message: "Choose what brings you here.",
  }),
  /**
   * Honeypot — invisible to humans, irresistible to bots. Any value fails
   * validation silently (the UI pretends success, the write never happens).
   */
  company: z.string().max(0).optional().or(z.literal("")),
})

export type WaitlistFormValues = z.infer<typeof waitlistSchema>
