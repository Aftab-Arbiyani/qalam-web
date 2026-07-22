import { FirebaseNotConfiguredError } from "@/lib/firebase/client"

/** Why a write failed, in UI vocabulary (never raw Firebase codes). */
export type SubmitFailureReason = "duplicate" | "rate-limited" | "unavailable" | "unknown"

/** Result contract shared by every public-write service (waitlist, newsletter). */
export type SubmitResult = { ok: true } | { ok: false; reason: SubmitFailureReason }

/** Map raw Firebase errors onto the UI's result vocabulary. */
export function classifyFirestoreError(error: unknown): SubmitResult {
  if (error instanceof FirebaseNotConfiguredError) {
    return { ok: false, reason: "unavailable" }
  }
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code)
    // Rules deny updates, so a duplicate email surfaces as permission-denied.
    if (code === "permission-denied" || code === "already-exists") {
      return { ok: false, reason: "duplicate" }
    }
    if (code === "resource-exhausted") {
      return { ok: false, reason: "rate-limited" }
    }
    if (code === "unavailable" || code === "deadline-exceeded") {
      return { ok: false, reason: "unavailable" }
    }
  }
  return { ok: false, reason: "unknown" }
}
