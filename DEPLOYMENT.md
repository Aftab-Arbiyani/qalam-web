# Deployment runbook — Vercel + Firebase

Two one-time setups (Firebase, Vercel), then every push deploys itself.

## 1. Firebase (one time)

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
   (e.g. `umberleaf-site`). Enable **Google Analytics** when asked (this creates the GA4
   property used by Firebase Analytics).
2. **Build → Firestore Database → Create database** → production mode → pick a region
   close to your audience (e.g. `europe-west` / `us-central`).
3. **Project settings → Your apps → Web app (</>)** → register `umberleaf-web`. Copy the
   config values — they map 1:1 onto the `NEXT_PUBLIC_FIREBASE_*` vars in
   [.env.example](.env.example).
4. Deploy the security rules (they are the entire protection model — do not skip):

   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use <your-project-id>
   firebase deploy --only firestore:rules
   ```

5. Verify in the console → Firestore → Rules that the deployed rules match
   [firestore.rules](firestore.rules).

No indexes are needed — the site only ever creates documents.

### ⚠️ Exercise a rules change before you deploy it

**A rejected write is shown to the visitor as "You're already on the list."** That is by design —
create-only rules with no read access can't distinguish a duplicate from any other denial — but it
means a broken rules deploy does not look like an outage. It looks like a working site with an
empty waitlist.

So never deploy an edit to `firestore.rules` you haven't run. Console → Firestore → Rules →
**Rules Playground**, or the local emulator. The three cases that matter, using the `waitlist`
collection and `sha256("me@example.com")` as the document id:

- ✅ a valid body at that id → **allow**
- ❌ the same body at any other 64-hex id → **deny**
- ❌ that id with a different email in the body → **deny**

The last two exist because the rules bind the document id to the address it carries
(`idBindsEmail`); without that, dedupe is a client-side convention anyone can ignore.

Run `pnpm check:contract` first — it catches drift between the rules and the client schemas, which
is the other way this failure arrives.

## 2. Vercel (one time)

1. Push this repo to GitHub/GitLab.
2. [vercel.com/new](https://vercel.com/new) → import the repo. Framework preset:
   **Next.js** (auto-detected). Build command `pnpm build` (auto).
3. **Environment variables** → add everything from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` → your canonical production URL (Production scope only;
     leave unset for Previews so metadata falls back cleanly)
   - `NEXT_PUBLIC_FIREBASE_*` → from step 1.3 (all scopes)
4. Deploy. Every push to the default branch now ships to production; every PR gets a
   preview URL.

### Custom domain

Vercel project → **Domains** → add `umberleaf.com` (+ `www` redirect). Update
`NEXT_PUBLIC_SITE_URL` to match and redeploy — sitemap, robots, RSS, canonical URLs and
JSON-LD all read from it.

## 3. Post-deploy checklist

- [ ] `https://<domain>/` renders; dark mode toggles; waitlist submit succeeds
- [ ] **Firestore console shows the new `waitlist` doc, with a server `createdAt`.**
      Do this one before believing any of the others — the form saying "you're on the list" is
      not evidence that anything was written (see the rules warning above).
- [ ] Repeat waitlist submit with the same email shows "already on the list"
- [ ] A _different_ email still succeeds — if the second address also reports "already on the
      list", the rules are denying everything and the first row was a coincidence of timing
- [ ] `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/manifest.webmanifest` respond
- [ ] Share a URL in Slack/X — OG card renders (`/og.png`). **Check a blog post too**, not just
      the home page: pages that declare their own `openGraph` replace the root's rather than
      merging with it, so a missing image there is invisible from `/`
- [ ] Firebase console → Analytics → Realtime shows `page_view` events — **one per navigation,
      not two.** Two means `send_page_view: false` was lost in `analytics.ts`
- [ ] Response headers carry `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
      and `Content-Security-Policy: frame-ancestors 'none'` (`curl -I https://<domain>/`)
- [ ] With JavaScript disabled, `/` still shows its headline, body copy and the waitlist
      section — entrances are CSS, and a regression to motion-driven reveals would hide them
- [ ] Lighthouse (mobile) ≥ 95 on `/` — the build is fully static, so regressions
      usually mean a newly added third-party script

## Operations notes

- **Watch the duplicate rate.** `waitlist_duplicate` / `newsletter_duplicate` are emitted every
  time a write is refused. Genuine duplicates are a few percent of submissions; a share near 100%
  means the rules are rejecting everything and the site is quietly storing nothing. This is the
  only production signal for that failure — nothing errors, and the visitors are all told they
  succeeded.
- **Reading signups:** the web client can only create. Read/export via the Firebase
  console or a server-side script with Admin SDK credentials (never shipped here).
- **Export waitlist:** `firebase firestore:export` or a small Admin-SDK script; doc IDs
  are `sha256(email)` and the plaintext email lives inside the doc.
- **Abuse response:** tighten limits in `firestore.rules` and redeploy rules only —
  no site deploy needed. App Check can be added later without code restructuring.
  Tightening the rules is exactly the change that starts denying legitimate signups while still
  telling everyone they're on the list, so run `pnpm check:contract` and the Playground cases
  above even when the site itself isn't being redeployed.
- **Blog publishing:** merge an `.mdx` file into `content/blog/` — the push redeploys
  and the post appears in listing, RSS, and sitemap automatically.
