import { FirebaseNotConfiguredError } from "@/lib/firebase/client"
import { SecureContextRequiredError } from "@/shared/lib/hash"

/** Why a write failed, in UI vocabulary (never raw Firebase codes). */
export type SubmitFailureReason = "duplicate" | "rate-limited" | "unavailable" | "unknown"

/** Result contract shared by every public-write service (waitlist, newsletter). */
export type SubmitResult = { ok: true } | { ok: false; reason: SubmitFailureReason }

/** Map raw Firebase errors onto the UI's result vocabulary. */
export function classifyFirestoreError(error: unknown): SubmitResult {
  if (error instanceof FirebaseNotConfiguredError || error instanceof SecureContextRequiredError) {
    return { ok: false, reason: "unavailable" }
  }
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code)
    /*
      `permission-denied` is read as "already on the list" — and it is worth
      being precise about how much that claim is worth.

      Create-only rules with no read access mean a duplicate cannot be detected
      directly: writing an existing doc ID becomes an update, and updates are
      denied. That is the intended design. But permission-denied is ALSO what
      every other rules failure returns: rules never deployed (a production-mode
      database denies everything by default), rules tightened by hand during an
      abuse response, or any drift between these schemas and firestore.rules.

      In each of those cases the visitor is congratulated and nothing is stored.
      There is no client-side way to tell them apart, so the safeguards live
      elsewhere: `pnpm check:contract` fails the build on client/rules drift,
      and the duplicate branch emits a `*_duplicate` analytics event whose share
      of submissions is the production canary. See docs/01_PreLaunchReview.md.
    */
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
