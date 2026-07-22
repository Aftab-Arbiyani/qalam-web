/**
 * Firebase web-app configuration, read from public env vars.
 *
 * These values are public by design (they identify the project, they don't
 * authorize access) — all protection lives in firestore.rules.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} as const

/**
 * True when the required config is present. The site builds and renders
 * without Firebase (previews, local dev) — forms degrade with a clear message
 * instead of crashing.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

/** Analytics needs its own flag — measurementId is optional. */
export const isAnalyticsConfigured = isFirebaseConfigured && Boolean(firebaseConfig.measurementId)
