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

export function getFirebaseApp(): Promise<FirebaseApp> {
  if (!isFirebaseConfigured) {
    return Promise.reject(new FirebaseNotConfiguredError())
  }
  appPromise ??= import("firebase/app").then(({ getApps, initializeApp }) => {
    const existing = getApps()
    return existing.length > 0 ? existing[0] : initializeApp(firebaseConfig)
  })
  return appPromise
}

export function getDb(): Promise<Firestore> {
  dbPromise ??= getFirebaseApp().then(async (app) => {
    const { getFirestore } = await import("firebase/firestore")
    return getFirestore(app)
  })
  return dbPromise
}

/** Thrown when env vars are absent (previews / local dev without Firebase). */
export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super("Firebase is not configured in this environment")
    this.name = "FirebaseNotConfiguredError"
  }
}
