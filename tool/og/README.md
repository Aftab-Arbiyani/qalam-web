# OG image generator

`public/og.png` (1200×630) is generated deterministically from `og.html`,
which uses the repo's self-hosted fonts and the canonical brand SVG.

Regenerate after changing the tagline or brand, from the repo root:

```bash
google-chrome --headless --disable-gpu --force-device-scale-factor=1 \
  --hide-scrollbars --allow-file-access-from-files \
  --screenshot=public/og.png --window-size=1200,630 \
  "file://$PWD/tool/og/og.html"
```

Font paths in `og.html` are relative to that file, so this works from any
checkout — no path editing needed.

**Then open the PNG.** If the fonts fail to load, Chrome silently falls back to
a generic serif and still writes a perfectly valid 1200×630 image, so this
pipeline cannot fail loudly. Confirm the headline is Fraunces (its distinctive
`a` and `g`) and that the leaf mark is drawn as a stroke, not a filled shape.

The brand tile in `og.html` is a hand-kept copy of the mark. If it looks wrong,
compare it against `src/app/icon.svg` — `pnpm brand:check` verifies the other
three copies, but not this one.
