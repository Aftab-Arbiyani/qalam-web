import type { MetadataRoute } from "next"

import { siteConfig } from "@/shared/lib/site-config"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#fbf8f3",
    // Must match `viewport.themeColor` in layout.tsx — the paper cream, not the
    // terracotta accent. Two different values means the browser chrome changes
    // colour depending on whether the page was opened from the home screen.
    theme_color: "#fbf8f3",
    icons: [
      {
        src: "/brand/umberleaf-tile.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
