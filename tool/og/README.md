# OG image generator

`public/og.png` (1200×630) is generated deterministically from `og.html`,
which uses the repo's self-hosted fonts and the canonical brand SVG.

Regenerate after changing the tagline or brand:

```bash
google-chrome --headless --disable-gpu --force-device-scale-factor=1 \
  --screenshot=public/og.png --window-size=1200,630 --hide-scrollbars \
  "file://$PWD/tool/og/og.html"
```

Note: `og.html` references fonts via absolute `file://` paths — adjust the
paths to your checkout (or run from repo root with relative paths) if needed.
