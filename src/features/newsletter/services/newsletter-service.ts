import type { NewsletterDoc } from "@/features/newsletter/types"
import { getDb } from "@/lib/firebase/client"
import { classifyFirestoreError, type SubmitResult } from "@/lib/firebase/errors"
import { sha256Hex } from "@/shared/lib/hash"

/**
 * Newsletter persistence — the only module that touches the `newsletter`
 * collection. Same dedupe strategy as the waitlist: doc ID = sha256(email),
 * create-only rules turn duplicates into permission-denied.
 */
export async function subscribeToNewsletter(email: string, source: string): Promise<SubmitResult> {
  try {
    const db = await getDb()
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")

    const normalized = email.trim().toLowerCase()
    const id = await sha256Hex(normalized)

    const entry: NewsletterDoc = {
      email: normalized,
      createdAt: serverTimestamp(),
      source: source.slice(0, 120),
      status: "subscribed",
    }

    await setDoc(doc(db, "newsletter", id), entry)
    return { ok: true }
  } catch (error) {
    return classifyFirestoreError(error)
  }
}
