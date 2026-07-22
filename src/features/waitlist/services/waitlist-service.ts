import type { WaitlistFormValues } from "@/features/waitlist/schemas/waitlist-schema"
import type { WaitlistDoc } from "@/features/waitlist/types"
import { getDb } from "@/lib/firebase/client"
import { classifyFirestoreError, type SubmitResult } from "@/lib/firebase/errors"
import { sha256Hex } from "@/shared/lib/hash"

/**
 * Waitlist persistence. The ONLY module that touches the `waitlist`
 * collection — components never import Firestore directly.
 *
 * Duplicate prevention without read access: the doc ID is derived from the
 * normalized email, and firestore.rules only allow `create`. Writing the same
 * email twice targets the same ID, becomes an update, and is denied — which
 * the UI translates into a friendly "already on the list" state.
 */
export async function addToWaitlist(
  values: Pick<WaitlistFormValues, "name" | "email" | "interest">,
  source: string,
): Promise<SubmitResult> {
  try {
    const db = await getDb()
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")

    const email = values.email.trim().toLowerCase()
    const id = await sha256Hex(email)

    const entry: WaitlistDoc = {
      email,
      name: values.name.trim(),
      interest: values.interest,
      createdAt: serverTimestamp(),
      source: source.slice(0, 120),
      status: "pending",
    }

    await setDoc(doc(db, "waitlist", id), entry)
    return { ok: true }
  } catch (error) {
    return classifyFirestoreError(error)
  }
}
