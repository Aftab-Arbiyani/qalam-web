/**
 * Thrown when WebCrypto is unavailable.
 *
 * `crypto.subtle` exists only in a secure context, so it is `undefined` when
 * the site is opened over plain HTTP on a LAN address — which is exactly how
 * anyone tests a dev build from their phone. Without this the call throws a
 * bare TypeError that lands in the "unknown" bucket ("something went wrong on
 * our side"), sending people hunting for a Firebase fault that isn't there.
 */
export class SecureContextRequiredError extends Error {
  constructor() {
    super("WebCrypto requires a secure context (HTTPS or localhost)")
    this.name = "SecureContextRequiredError"
  }
}

/** SHA-256 hex digest via WebCrypto (built into every modern browser). */
export async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new SecureContextRequiredError()
  }
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
