import type { FirebaseApp } from "firebase/app"
import type { Firestore } from "firebase/firestore"

import { firebaseConfig, isFirebaseConfigured } from "@/lib/firebase/config"

/**
 * Lazy Firebase singletons.
 *
 * `firebase/app` and `firebase/firestore` are imported dynamically so none of
 * the SDK lands in the initial page bundle — visitors who never touch a form
 * never download Firestore. First call wires everything; later calls reuse it.
 */

let appPromise: Promise<FirebaseApp> | null = null
let dbPromise: Promise<Firestore> | null = null

/**
 * Cache the promise, but never a rejection.
 *
 * A memoised rejected promise is permanent: one failed chunk load on a flaky
 * connection would poison every later submit for the rest of the session, and
 * the visitor would be told "something went wrong on our side" until they
 * reloaded the page. Clearing the slot on failure makes the next attempt a
 * genuine retry.
 */
function once<T>(
  slot: () => Promise<T> | null,
  store: (value: Promise<T> | null) => void,
  create: () => Promise<T>,
): Promise<T> {
  const existing = slot()
  if (existing) return existing
  const created = create().catch((error: unknown) => {
    store(null)
    throw error
  })
  store(created)
  return created
}

export function getFirebaseApp(): Promise<FirebaseApp> {
  if (!isFirebaseConfigured) {
    return Promise.reject(new FirebaseNotConfiguredError())
  }
  return once(
    () => appPromise,
    (value) => (appPromise = value),
    async () => {
      const { getApps, initializeApp } = await import("firebase/app")
      const existing = getApps()
      return existing.length > 0 ? existing[0] : initializeApp(firebaseConfig)
    },
  )
}

export function getDb(): Promise<Firestore> {
  return once(
    () => dbPromise,
    (value) => (dbPromise = value),
    async () => {
      const app = await getFirebaseApp()
      const { getFirestore } = await import("firebase/firestore")
      return getFirestore(app)
    },
  )
}

/** Thrown when env vars are absent (previews / local dev without Firebase). */
export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super("Firebase is not configured in this environment")
    this.name = "FirebaseNotConfiguredError"
  }
}
