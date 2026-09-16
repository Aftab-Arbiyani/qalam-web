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
  /*
    `.pipe(z.email())` rather than `z.email().trim()`: zod 4 deprecated the
    `.email()` *method*, but the replacement is a base schema, and a base schema
    validates before any chained transform runs. Leading with it would check the
    address before it had been trimmed, so a pasted "  me@example.com  " — which
    is most addresses arriving from a phone keyboard — would be rejected as
    malformed. Piping keeps the original order: normalize, then validate.
  */
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(6, "We need an email to save your place.")
    .max(254, "That email is a little long.")
    .pipe(z.email("That doesn't look like an email address.")),
  interest: z.enum(WAITLIST_INTERESTS, {
    message: "Choose what brings you here.",
  }),
  /**
   * Honeypot — invisible to humans, irresistible to bots.
   *
   * This field must ACCEPT any value. The decision belongs to the submit
   * handler, which treats a filled honeypot as a bot and reports success
   * without writing. Constraining it here (it was `.max(0)`) made the field
   * fail validation instead, so react-hook-form never called the handler at
   * all: the bot branch was unreachable, nothing rendered the error, and the
   * form simply went dead — including for a human whose password manager
   * filled the hidden "Company" input.
   */
  company: z.string().optional(),
})

export type WaitlistFormValues = z.infer<typeof waitlistSchema>
