import type { WaitlistInterest } from "@/features/waitlist/schemas/waitlist-schema"

/**
 * Firestore document shape for `waitlist/{sha256(email)}`.
 *
 * The document ID is the SHA-256 hex of the normalized (trimmed, lowercased)
 * email — deterministic, so a second signup with the same email targets the
 * same document and is rejected by rules (create-only, no update). No PII in
 * document IDs, no read access needed for duplicate detection.
 */
export interface WaitlistDoc {
  email: string
  name: string
  interest: WaitlistInterest
  /** serverTimestamp() — the server clock, not the client's. */
  createdAt: unknown
  /** Where the signup happened, e.g. "hero", "waitlist-section", "footer". */
  source: string
  /** Lifecycle: pending → invited → converted (managed by ops, not clients). */
  status: "pending"
}

/** Submission result vocabulary is shared across public-write features. */
export type {
  SubmitFailureReason as WaitlistFailureReason,
  SubmitResult as WaitlistSubmitResult,
} from "@/lib/firebase/errors"
