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

function writeTimestamps(key: string, timestamps: number[]): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(timestamps))
  } catch {
    // Storage full/blocked — fail open; Firestore rules still protect us.
  }
}

/**
 * Returns true when the action is allowed (and records the attempt),
 * false when the caller should back off.
 *
 * The attempt is recorded up front, not on completion, so that two rapid
 * submits can't both pass the check while the first is still in flight. The
 * cost of that ordering is paid back by `refundRateLimit`.
 */
export function consumeRateLimit({ key, max, windowMs }: RateLimitOptions): boolean {
  if (typeof window === "undefined") return true
  const now = Date.now()
  const recent = readTimestamps(key).filter((t) => now - t < windowMs)
  if (recent.length >= max) return false
  recent.push(now)
  writeTimestamps(key, recent)
  return true
}

/**
 * Hand back the most recent attempt.
 *
 * Call this when the submission failed for a reason that is ours, not theirs —
 * an unreachable backend, a missing config. Without it, three failed attempts
 * against a service that was never up would lock someone out for ten minutes
 * and blame them for trying too often.
 */
export function refundRateLimit(key: string): void {
  if (typeof window === "undefined") return
  const timestamps = readTimestamps(key)
  if (timestamps.length === 0) return
  timestamps.pop()
  writeTimestamps(key, timestamps)
}
