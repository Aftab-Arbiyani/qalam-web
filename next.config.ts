import type { NextConfig } from "next"

/**
 * Response headers.
 *
 * Vercel supplies HSTS and little else, so everything below is ours to send.
 * These are the headers that cost nothing and break nothing:
 *
 * - `nosniff` stops a browser from re-interpreting a response as a script.
 * - `Referrer-Policy` keeps full URLs off other people's servers.
 * - `Permissions-Policy` denies APIs this site has no use for.
 * - `frame-ancestors 'none'` is the modern, non-deprecated clickjacking
 *   defence; `X-Frame-Options` rides along for older agents that ignore CSP.
 *
 * A *full* Content-Security-Policy is deliberately not here. It would need a
 * nonce plumbed through next-themes' pre-hydration inline script and an
 * allowlist for Firestore and Google Analytics origins; shipped blind it would
 * silently break the forms. `frame-ancestors` is the one directive that is safe
 * to send on its own, because it restricts nothing about what the page loads.
 * See docs/01_PreLaunchReview.md.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
]

const nextConfig: NextConfig = {
  // Nothing gained by announcing the framework and its version.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
