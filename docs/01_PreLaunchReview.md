# 01 — Pre-launch review, and what it changed

**Repo:** `qalam-web` (the Umberleaf marketing site) · **Branch:** `umberleaf-rebrand`
**Reviewed:** 2026-09-15 · **Scope:** the whole site, in depth — not just the rebrand diff
**Status:** ✅ all 16 findings fixed and verified · 3 owner decisions remain open (§5)

The rebrand itself came out clean: zero residual `qalam` strings outside the lockfile, all four
brand binaries regenerated from the generator in `4c57fa8`, `og.png` still 1200×630, and the
`6378107` copy alignment agrees with what D5 actually did (Story Map survived D5 — it was renamed
from Story Explorer, not deleted). The findings below are all pre-existing.

They cluster around one theme worth naming up front: **this site's failure modes are quiet.** A
rejected write is reported to the visitor as success. An invisible element looks like a slow page.
A doubled analytics event looks like good news. Nothing here was crashing, which is exactly why
none of it had been noticed.

---

## 1. What was wrong, and what it cost

### H1 · The honeypot disabled the form instead of catching bots

`company: z.string().max(0)` meant a filled honeypot **failed validation**, so react-hook-form
never called the submit handler — and the handler is where the anti-bot branch lived. The branch
was unreachable. No UI read `errors.company`, so nothing rendered: the form just went dead.

The comment above it described the intended behaviour ("the UI pretends success, the write never
happens") accurately. The code did something else entirely.

Worse for humans than for bots: a password manager filling a hidden field named "Company" is
ordinary, and that person lost their signup in silence.

**Fixed:** the field accepts anything; the handler decides. Proved by extracting the shipped
expression from the file and parsing all three cases.

### H2 · Every rules rejection reads as "You're already on the list"

`permission-denied` is what a duplicate looks like — and also what rules-never-deployed,
rules-tightened-by-hand, and any client/rules drift look like. In all of those the visitor is
congratulated, nothing is stored, and `waitlist_signup` never fires.

This is inherent to the create-only, no-read design, which is the right design. What was missing
was any way to notice. **Fixed with two safeguards rather than a code change to the mapping:**

- `waitlist_duplicate` / `newsletter_duplicate` analytics events. Genuine duplicates are a few
  percent of submissions; a ratio near 100% means nothing is being written. This is the only
  production signal that separates the two cases — treat it as a health check, not a metric.
- `pnpm check:contract` (§3), which fails the build on drift before it can reach production.

### H3 · Blog posts shipped share cards with no image

Declaring `openGraph` on a page **replaces** the root layout's — Next does not merge them. Posts
set their own title/description and inherited nothing, so every post advertised
`twitter:card: summary_large_image` with no image behind it. Confirmed in the build output: 0
`og:image`, 0 `twitter:image`. On a pre-launch site the blog is the shareable surface.

**Fixed:** one `ogImage` constant in `site-config.ts`, spread into both. Now 8 tags per post.

### M1 · Thirty elements on `/` shipped invisible

Framer-motion's `initial="hidden"` serializes `style="opacity:0"` into the static HTML. Measured
in the build output: **`/` 30, `/about` 13, `/roadmap` 4, `/contact` 4** — including the `<h1>` and
the entire waitlist section, the page's one true call to action.

That content stayed invisible until the bundle downloaded, hydrated, and an IntersectionObserver
fired. It gated LCP on hydration and turned any script failure into a blank page.

**Fixed** by moving the entrance vocabulary into CSS (`globals.css`, "Entrances"). `Reveal`,
`RevealGroup` and `RevealItem` are now plain server components; the hero uses a `.stagger-in`
cascade. Where the browser has scroll-driven animations the reveal follows the element's own scroll
position, and where it doesn't the animation simply runs on load. Both paths end at opacity 1.

Verified in real Chrome over CDP — all `opacity: 1` by default, under `prefers-reduced-motion`,
**and with page scripts disabled entirely**; and the reveal still reveals (the sixth feature card
reads `0` before scroll, `1` after, driven by a native wheel gesture with scripts off).

Side effect: `/about` and `/roadmap` dropped 699 B → 167 B of client JS, `/contact` 975 B → 515 B.

The `prefers-reduced-motion` override needed care. The blanket rule in `@layer base` collapses
`animation-duration`, which a **scroll-driven** animation ignores — so without an explicit
`animation-name: none`, a reduced-motion visitor on a modern browser would have been left staring
at opacity 0. That block must stay last among the entrance rules; it wins on source order alone.

### M2 · `.env.example` was gitignored

`.gitignore`'s `.env*` caught the template too, so the file existed on exactly one machine while
both README and DEPLOYMENT.md told a new checkout to copy it. Contents verified secret-free.
**Fixed** with a `!.env.example` negation.

### M3 · Every page view was counted twice

gtag fires an automatic `page_view` when configured, and `<AnalyticsTracker>` fires its own on
mount — and that mount is what lazily initializes analytics, so the two were guaranteed to collide
rather than merely racing. Every landing doubled; every per-view conversion rate halved.

**Fixed:** `initializeAnalytics(app, { config: { send_page_view: false } })`. We own App Router
navigations (Firebase never sees them), so we own the first view too.

> Also worth doing once, in the console: GA4 **Enhanced measurement** auto-collects scroll-90% and
> outbound clicks, which overlap our `scroll_depth` and `outbound_link`. Not a code change.

### M4 · A failed lazy import poisoned the session

`appPromise ??= import(...)` memoises rejections as happily as successes. One failed chunk load on
a flaky connection and every later submit returned "something went wrong on our side" until the
visitor reloaded. **Fixed:** the slot is cleared on failure, so the next attempt is a real retry.

### M5 · Dedupe was a client convention, not a server guarantee

The rules checked that the document id _looked like_ a hash, never that it _was_ the hash of the
email in the document. Anyone holding the public config could write one address under unlimited
random 64-hex ids. **Fixed** with `idBindsEmail()`.

⚠️ **This is the one change nobody has executed — see §4 before deploying it.**

### M6 · No CI and no tests

No `.github/`, no specs. `format:check` and `brand:check` existed but nothing ran them; Vercel's
build was the only gate, and it checks one thing — that the site compiles. **Fixed:** a CI workflow
running all six gates, plus the contract check described in §3.

### Low (all fixed)

|                                          |                                                                                                                                                                                                                                                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rate limit punished our failures         | Three unreachable-backend errors locked someone out for 10 minutes and blamed them for trying too often. `refundRateLimit` hands the attempt back when the failure was ours.                                                                                                                   |
| No security headers                      | `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'` (+ `X-Frame-Options` for older agents), `poweredByHeader: false`. Verified served.                                                                                                                                |
| `categoryToSlug` wasn't URL-safe         | `Q&A` → `/blog/category/q&a`, which truncates and 404s. Categories are now constrained in the frontmatter schema, so a bad one fails the build. Separately, `Product` and `product` counted as two categories emitting one slug — two static pages at one URL. Now grouped case-insensitively. |
| `z.string().email()` deprecated in zod 4 | Replaced — but see the note below, the obvious fix was wrong.                                                                                                                                                                                                                                  |
| Manifest vs meta theme colour disagreed  | `#9e4b28` vs `#fbf8f3`; the browser chrome changed colour depending on how the page was opened. Both are the paper cream now.                                                                                                                                                                  |
| `aria-controls` pointed at nothing       | The mobile nav is unmounted when closed. Now set only while it exists, and Escape closes the menu and returns focus to the button that opened it.                                                                                                                                              |
| `ERROR_MESSAGES.duplicate: ""`           | `duplicate` is a success state with its own panel, not a message. Excluded from the type, so a future failure reason is a compile error rather than a blank string.                                                                                                                            |
| `ExternalLink` prop order                | `{...props}` came after `onClick`, so a caller's handler would have replaced the tracking call. No caller does today.                                                                                                                                                                          |
| `providers.tsx` comment was wrong        | LazyMotion `strict` throws at runtime; it is not a build-time error.                                                                                                                                                                                                                           |
| `crypto.subtle` on a LAN address         | `undefined` outside a secure context — exactly how you test a dev build from your phone. The bare TypeError landed in "unknown" ("something went wrong on our side"), sending you hunting for a Firebase fault that wasn't there. Now a named error mapped to "unavailable".                   |

> **A note on the zod fix, because it nearly shipped a regression.** The obvious replacement for
> `.string().email()` is `z.email()` — but that is a _base schema_, and a base schema validates
> before any chained transform runs. Leading with it checks the address **before** `.trim()`, so a
> pasted `"  me@example.com  "` (most addresses arriving from a phone keyboard) is rejected as
> malformed. Caught by diffing the three orderings against real input. The shipped form is
> `.string().trim().toLowerCase().min().max().pipe(z.email())` — normalize, then validate.

---

## 2. Verification

Every gate, on a clean build:

```
pnpm typecheck · pnpm lint · pnpm format:check · pnpm brand:check · pnpm check:contract · pnpm build
```

All green; 22/22 pages static; shared JS unchanged at 103 kB. Beyond the gates:

- **`opacity:0` in the static HTML:** 30 / 13 / 4 / 4 → **0 / 0 / 0 / 0**
- **OG + Twitter image tags on a blog post:** 0 → 8
- **Security headers:** served, confirmed against a running production build (`x-powered-by` gone)
- **Reveal behaviour:** real Chrome, three emulation modes, including scripts fully disabled
- **Honeypot:** the expression is read out of the source file and parsed, so the test can't drift
- **The contract checker itself:** mutation-tested — see §3

## 3. `pnpm check:contract`

`tool/check-rules-contract.mjs` holds the client↔rules contract as a table and reads **both** sides
as text, so a change to either fails until the other follows. No dependencies and no emulator: the
rules file isn't JavaScript, and standing up Firestore in CI to compare six numbers isn't worth it.

It exists because of H2. A rules mismatch has no runtime signal — it reaches production as a
congratulatory message and an empty collection.

A checker that cannot fail is worth nothing, so it was mutation-tested against four realistic
drifts, and each was caught:

| Mutation                                           | Caught as                                                               |
| -------------------------------------------------- | ----------------------------------------------------------------------- |
| rules drop `idBindsEmail`                          | `create rule does not bind the document id to the email`                |
| rules widen the email cap to 500                   | `validEmail must enforce a maximum size of 254`                         |
| a new interest lands on the client only            | `WAITLIST_INTERESTS is [both,editing,reading,writing], rules say [...]` |
| the honeypot is re-constrained (the H1 regression) | `the honeypot must stay z.string().optional()`                          |

## 4. ⚠️ The one thing not verified here

`idBindsEmail()` in `firestore.rules` uses `hashing.sha256(email).toHexString().lower()`.
**firebase-tools is not installed on this machine, so no rules change in this review has been
executed** — it is reviewed, not tested.

This matters more than a normal untested line. If the expression is wrong, every create is denied,
and a denied create is shown to the visitor as _"You're already on the list."_ The site would look
like it was working while the waitlist stayed empty.

**Before `firebase deploy --only firestore:rules`,** exercise it in the Rules Playground or the
emulator:

- ✅ `create waitlist/<sha256("me@example.com")>` with a valid body → **allow**
- ❌ the same body under any other 64-hex id → **deny**
- ❌ the same id, a different email in the body → **deny**

Then run the post-deploy checklist in DEPLOYMENT.md, which now ends by confirming a real row
appears in Firestore. "The form said success" is not evidence.

## 5. Open — owner decisions, not code

These were identified in the review and deliberately not decided here.

1. **GA4 loads without consent.** EU ePrivacy requires consent for analytics cookies, and the
   privacy page states there is no banner. The lazy init makes a consent gate easy — nothing calls
   `getAnalytics` until a form or a route change does — but whether to ship one is a product and
   legal call.
2. **`siteConfig.social` handles are unverified.** `@umberleaf` is emitted in JSON-LD `sameAs` and
   `twitter:site`. The config comment says "update handles before launch"; if those accounts aren't
   owned, every share card credits a stranger.
3. **The roadmap's seasons have drifted.** `/roadmap` shows "In progress · Summer 2026" on
   15 September. The page promises "when reality and the roadmap disagree, we update the roadmap,
   here, in public" — so this is a promise to keep, but only the owner knows the real dates. Left
   untouched: inventing a launch season would be worse than a stale one.

## 6. Not fixed on purpose

A **full** Content-Security-Policy. It needs a nonce plumbed through next-themes' pre-hydration
inline script and an allowlist for the Firestore and Google Analytics origins; shipped blind it
would silently break the forms — the same class of quiet failure as everything in §1.
`frame-ancestors` is the one directive safe to send alone, because it restricts nothing about what
the page loads. The rest is a task, not a line.
