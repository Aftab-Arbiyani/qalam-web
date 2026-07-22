/**
 * Firestore document shape for `newsletter/{sha256(email)}`.
 *
 * Kept deliberately close to the waitlist schema so a future email provider
 * sync (Resend, Buttondown, ConvertKit…) can consume both collections with
 * one mapper. `status` leaves room for a double-opt-in flow later
 * (subscribed → confirmed) without a migration.
 */
export interface NewsletterDoc {
  email: string
  /** serverTimestamp() */
  createdAt: unknown
  /** Where the signup happened, e.g. "footer", "blog", "contact". */
  source: string
  status: "subscribed"
}
