# Qalam — marketing site

Pre-launch marketing website for **Qalam** (قلم — the Arabic word for _pen_), a writing
platform for people who take words seriously. This site builds the audience before launch:
it tells the story, collects the **waitlist**, runs a **newsletter**, and hosts the **blog**.

Completely independent from the product apps — its own repo, its own Vercel project,
its own Firebase project.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · shadcn-style UI ·
Framer Motion · Firebase (Firestore + Analytics) · React Hook Form + Zod · MDX blog · Vercel.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in Firebase web config (optional for local dev)
pnpm dev                     # http://localhost:3000
```

Without Firebase env vars the site runs fine — forms degrade gracefully with a
"not reachable" message instead of crashing. Analytics silently no-ops.

## Scripts

| Script              | What it does                        |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Dev server                          |
| `pnpm build`        | Production build (all pages static) |
| `pnpm start`        | Serve the production build          |
| `pnpm lint`         | ESLint                              |
| `pnpm typecheck`    | `tsc --noEmit`                      |
| `pnpm format`       | Prettier write                      |
| `pnpm format:check` | Prettier check (CI)                 |

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
    ├── components/           # header, footer, theme, brand mark (path-based ق), trackers
    ├── animations/           # presets.ts (motion vocabulary) + Reveal/RevealGroup
    └── lib/                  # site-config (SEO source of truth), fonts, utils, rate-limit
```

Key decisions:

- **Firestore SDK is lazy** — imported at form-submit time, never in the initial bundle.
  Components never touch Firestore directly; only `*-service.ts` modules do.
- **Duplicate prevention without reads:** doc ID = `sha256(email)`; rules allow `create`
  only, so a repeat signup becomes an update → denied → shown as "already on the list".
  Nobody can enumerate emails.
- **Spam defence in depth:** honeypot field + minimum-fill-time gate + client rate limit
  (localStorage sliding window) + strict schema validation in `firestore.rules`.
- **Fonts are self-hosted** (`next/font/local`, variable woff2) — deterministic builds,
  no third-party requests, no CLS.
- **Brand mark is a vector path** (the same canonical qāf used by the mobile app icon) —
  no font dependency, crisp everywhere, themeable.
- **Every page is statically generated.** No server runtime needed beyond static hosting;
  Firestore writes happen client-side under security rules.

## Firestore schema

| Collection   | Doc ID          | Fields                                                                                           |
| ------------ | --------------- | ------------------------------------------------------------------------------------------------ |
| `waitlist`   | `sha256(email)` | email, name, interest (`writing\|reading\|both`), createdAt (server), source, status (`pending`) |
| `newsletter` | `sha256(email)` | email, createdAt (server), source, status (`subscribed`)                                         |

Rules in [firestore.rules](firestore.rules): create-only, exact key sets, type/size/enum
checks, `createdAt == request.time`, everything else locked. Deploy with
`firebase deploy --only firestore:rules`.

## Analytics events

Typed in [src/lib/firebase/analytics.ts](src/lib/firebase/analytics.ts):
`page_view` (SPA-aware), `waitlist_signup`, `newsletter_signup`, `cta_click`,
`scroll_depth` (25/50/75/100), `blog_read`, `blog_read_complete`, `outbound_link`,
`theme_change`, `faq_open`.

## Blog

Drop an `.mdx` file into `content/blog/` — frontmatter drives listing, categories, tags,
featured placement, related posts, reading time, RSS (`/rss.xml`), sitemap and Article
JSON-LD. No code changes needed per post.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full Vercel + Firebase runbook.
