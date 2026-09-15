#!/usr/bin/env bash
#
# Vendor the GENERATED Umberleaf brand outputs into this repo.
#
# The generator lives OUTSIDE the repo (~/projects/umberleaf-brand) and is the single
# source of truth for the mark. This script copies its outputs into the three slots
# that need them and then verifies they agree — because the previous mark drifted into
# four hand-maintained copies precisely because nothing could detect drift.
#
#   pnpm brand:sync    regenerate, copy, verify
#   pnpm brand:check   verify only (no generate, no copy)
#
# Override the generator location with UMBERLEAF_BRAND=/path/to/umberleaf-brand.
set -euo pipefail

B="${UMBERLEAF_BRAND:-$HOME/projects/umberleaf-brand}"
CHECK_ONLY=0
[ "${1:-}" = "--check" ] && CHECK_ONLY=1

ICON="src/app/icon.svg"
TILE="public/brand/umberleaf-tile.svg"
APPLE="src/app/apple-icon.png"
GLYPH="src/shared/components/brand/umberleaf-glyph.ts"

if [ "$CHECK_ONLY" -eq 0 ]; then
  [ -f "$B/generate_outline.py" ] || { echo "no generator at $B — set UMBERLEAF_BRAND"; exit 1; }
  python3 "$B/generate_outline.py"
  cp "$B/umberleaf_icon.svg"     "$ICON"
  cp "$B/umberleaf_icon.svg"     "$TILE"
  cp "$B/png/umberleaf_1024.png" "$APPLE"
fi

# The two vendored SVGs must stay byte-identical to each other.
cmp "$ICON" "$TILE"

# ...and the TS constant must still carry the same path data. This is the copy most
# likely to rot, since it is the only one a human edits by hand.
D=$(grep -o 'd="[^"]*"' "$ICON" | head -1 | cut -d'"' -f2)
[ -n "$D" ] || { echo "could not read a path from $ICON"; exit 1; }
grep -qF "$D" "$GLYPH" || {
  echo "DRIFT: UMBERLEAF_PATH in $GLYPH does not match $ICON."
  echo "Paste this in as UMBERLEAF_PATH:"
  echo "$D"
  exit 1
}

echo "brand assets in sync"
