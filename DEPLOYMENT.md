# Deployment runbook — Vercel + Firebase

Two one-time setups (Firebase, Vercel), then every push deploys itself.

## 1. Firebase (one time)

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
   (e.g. `qalam-site`). Enable **Google Analytics** when asked (this creates the GA4
   property used by Firebase Analytics).
2. **Build → Firestore Database → Create database** → production mode → pick a region
   close to your audience (e.g. `europe-west` / `us-central`).
3. **Project settings → Your apps → Web app (</>)** → register `qalam-web`. Copy the
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

Vercel project → **Domains** → add `qalam.ink` (+ `www` redirect). Update
`NEXT_PUBLIC_SITE_URL` to match and redeploy — sitemap, robots, RSS, canonical URLs and
JSON-LD all read from it.

## 3. Post-deploy checklist

- [ ] `https://<domain>/` renders; dark mode toggles; waitlist submit succeeds
- [ ] Repeat waitlist submit with the same email shows "already on the list"
- [ ] Firestore console shows the `waitlist` doc with server `createdAt`
- [ ] `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/manifest.webmanifest` respond
- [ ] Share a URL in Slack/X — OG card renders (`/og.png`)
- [ ] Firebase console → Analytics → Realtime shows `page_view` events
- [ ] Lighthouse (mobile) ≥ 95 on `/` — the build is fully static, so regressions
      usually mean a newly added third-party script

## Operations notes

- **Reading signups:** the web client can only create. Read/export via the Firebase
  console or a server-side script with Admin SDK credentials (never shipped here).
- **Export waitlist:** `firebase firestore:export` or a small Admin-SDK script; doc IDs
  are `sha256(email)` and the plaintext email lives inside the doc.
- **Abuse response:** tighten limits in `firestore.rules` and redeploy rules only —
  no site deploy needed. App Check can be added later without code restructuring.
- **Blog publishing:** merge an `.mdx` file into `content/blog/` — the push redeploys
  and the post appears in listing, RSS, and sitemap automatically.
