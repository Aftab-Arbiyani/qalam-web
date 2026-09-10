/**
 * Client-side rate limiting (localStorage sliding window).
 *
 * First line of defence against accidental double-submits and low-effort
 * scripts. Real enforcement lives in firestore.rules (schema validation,
 * create-only, no overwrites) — this just keeps honest traffic polite.
 */

interface RateLimitOptions {
  /** Bucket name, e.g. "waitlist". */
  key: string
  /** Max attempts within the window. */
  max: number
  /** Window length in ms. */
  windowMs: number
}

const STORAGE_PREFIX = "umberleaf.rl."

function readTimestamps(key: string): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((t): t is number => typeof t === "number") : []
  } catch {
    return []
  }
}

/**
 * Returns true when the action is allowed (and records the attempt),
 * false when the caller should back off.
 */
export function consumeRateLimit({ key, max, windowMs }: RateLimitOptions): boolean {
  if (typeof window === "undefined") return true
  const now = Date.now()
  const recent = readTimestamps(key).filter((t) => now - t < windowMs)
  if (recent.length >= max) return false
  recent.push(now)
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(recent))
  } catch {
    // Storage full/blocked — fail open; Firestore rules still protect us.
  }
  return true
}
