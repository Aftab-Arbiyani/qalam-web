# Umberleaf — marketing site

Pre-launch marketing website for **Umberleaf** (an umber leaf is an autumn leaf — and a
leaf is a page), a writing
platform for people who take words seriously. This site builds the audience before launch:
it tells the story, collects the **waitlist**, runs a **newsletter**, and hosts the **blog**.

Completely independent from the product apps — its own repo, its own Vercel project,
its own Firebase project.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · shadcn-style UI ·
Framer Motion · Firebase (Firestore + Analytics) · Vercel Analytics · React Hook Form + Zod ·
MDX blog · Vercel.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in Firebase web config (optional for local dev)
pnpm dev                     # http://localhost:3000
```

Without Firebase env vars the site runs fine — forms degrade gracefully with a
"not reachable" message instead of crashing. Analytics silently no-ops.

## Scripts

| Script                | What it does                                                |
| --------------------- | ----------------------------------------------------------- |
| `pnpm dev`            | Dev server                                                  |
| `pnpm build`          | Production build (all pages static)                         |
| `pnpm start`          | Serve the production build                                  |
| `pnpm lint`           | ESLint                                                      |
| `pnpm typecheck`      | `tsc --noEmit`                                              |
| `pnpm format`         | Prettier write                                              |
| `pnpm format:check`   | Prettier check (CI)                                         |
| `pnpm check:contract` | Assert the client and `firestore.rules` still agree (CI)    |
| `pnpm brand:check`    | Assert the vendored copies of the mark haven't drifted (CI) |

[CI](.github/workflows/ci.yml) runs all of these plus `build` on every push and PR.

## Architecture

Organized by feature; shared building blocks live under `shared/`.

```
content/blog/                 # MDX posts (frontmatter: title, description, date,
                              #   category, tags, author, featured)
src/
├── app/                      # App Router: routes, sitemap, robots, manifest, rss.xml
├── features/
│   ├── landing/              # content.ts (ALL landing copy) + section components
│   ├── waitlist/             # schema → hook → service → form (RHF + Zod + Firestore)
│   ├── newsletter/           # same shape as waitlist
│   └── blog/                 # MDX pipeline: fs → gray-matter → next-mdx-remote/rsc
├── lib/firebase/             # lazy client, typed analytics events, error mapping
└── shared/
    ├── ui/                   # Button, Card, Badge, Input, Accordion, Container, Section…
    ├── components/           # header, footer, theme, brand mark (stroked leaf path), trackers
    ├── animations/           # presets.ts (framer vocabulary) + CSS-driven Reveal/RevealGroup
    └── lib/                  # site-config (SEO source of truth), fonts, utils, rate-limit
tool/
├── brand/sync.sh             # vendor + verify the generated mark (pnpm brand:sync / :check)
├── og/                       # deterministic og.png generator (headless Chrome)
└── check-rules-contract.mjs  # client ↔ firestore.rules drift gate (pnpm check:contract)
docs/01_PreLaunchReview.md    # what the pre-launch review found, and what it changed
```

Key decisions:

- **Firestore SDK is lazy** — imported at form-submit time, never in the initial bundle.
  Components never touch Firestore directly; only `*-service.ts` modules do.
- **Duplicate prevention without reads:** doc ID = `sha256(email)`, and the rules require the
  id to _be_ that hash; rules allow `create` only, so a repeat signup becomes an update →
  denied → shown as "already on the list". Nobody can enumerate emails.
  ⚠️ **The corollary:** every _other_ rules rejection looks identical from the client, so a
  broken deploy congratulates every visitor while storing nothing. Two things guard that —
  `pnpm check:contract` before deploy, and the `*_duplicate` analytics events after it (a
  duplicate rate near 100% means nothing is being written). See
  [docs/01_PreLaunchReview.md](docs/01_PreLaunchReview.md) §H2.
- **Spam defence in depth:** honeypot field + minimum-fill-time gate + client rate limit
  (localStorage sliding window) + strict schema validation in `firestore.rules`.
  The honeypot field must **accept any value** — the decision belongs to the submit handler,
  which reports success without writing. Validating it away stops react-hook-form calling the
  handler at all, which kills the form instead of the bot. `check:contract` enforces this.
- **Entrances are CSS, not JavaScript** — a motion library's `initial` state serializes
  `opacity:0` into the static HTML, so revealed content would wait on hydration to become
  visible. The vocabulary lives in the "Entrances" block of `globals.css`; `Reveal` and friends
  are plain server components. Content is visible with scripts disabled entirely.
- **Fonts are self-hosted** (`next/font/local`, variable woff2) — deterministic builds,
  no third-party requests, no CLS.
- **Brand mark is a vector path** — the canonical Umberleaf leaf, stroked not filled, shared
  with the mobile app icon. No font dependency, crisp everywhere, themeable. It is vendored
  from `~/projects/umberleaf-brand`; run `pnpm brand:sync` to refresh all copies at once.
- **Every page is statically generated.** No server runtime needed beyond static hosting;
  Firestore writes happen client-side under security rules.

## Firestore schema

| Collection   | Doc ID          | Fields                                                                                           |
| ------------ | --------------- | ------------------------------------------------------------------------------------------------ |
| `waitlist`   | `sha256(email)` | email, name, interest (`writing\|reading\|both`), createdAt (server), source, status (`pending`) |
| `newsletter` | `sha256(email)` | email, createdAt (server), source, status (`subscribed`)                                         |

Rules in [firestore.rules](firestore.rules): create-only, exact key sets, type/size/enum
checks, `createdAt == request.time`, the document id bound to `sha256(email)`, everything else
locked. Deploy with `firebase deploy --only firestore:rules` — and **exercise a rules change in
the Playground first**, because a rejected write reaches the visitor as success, not as an error.

## Analytics events

Typed in [src/lib/firebase/analytics.ts](src/lib/firebase/analytics.ts):
`page_view` (SPA-aware), `waitlist_signup`, `newsletter_signup`, `waitlist_duplicate`,
`newsletter_duplicate`, `cta_click`, `scroll_depth` (25/50/75/100), `blog_read`,
`blog_read_complete`, `outbound_link`, `theme_change`, `faq_open`.

gtag's automatic page view is disabled (`send_page_view: false`) because `<AnalyticsTracker>`
sends its own — Firebase only auto-tracks the first load, never App Router navigations, and
leaving both on counted every landing twice.

The two `*_duplicate` events are a health check rather than a metric: they are the only signal
that distinguishes "already subscribed" from "the rules are rejecting everything".

**Vercel Analytics** runs alongside, mounted once in the root layout. It answers a different
question — reach (views, referrers, countries, devices) rather than behaviour — and it is
cookieless, sets no device identifier, and is served from our own origin
(`/_vercel/insights/*`), so it needs no consent gate and no CSP allowance. It reports only from
a Vercel deployment; locally the script 404s and the component is inert, which is expected.

Keep `trackEvent` as the single typed place product events are defined. If Vercel ever needs
custom events too, fan out **inside** `trackEvent` rather than adding a second call beside each
existing one — two hand-maintained event lists drift, and this repo has already paid for that
lesson once with the brand mark.

## Blog

Drop an `.mdx` file into `content/blog/` — frontmatter drives listing, categories, tags,
featured placement, related posts, reading time, RSS (`/rss.xml`), sitemap and Article
JSON-LD. No code changes needed per post.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full Vercel + Firebase runbook, and
[docs/01_PreLaunchReview.md](docs/01_PreLaunchReview.md) §5 for the decisions still open before
launch (analytics consent, social handles, roadmap dates).
