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
    theme_color: "#9e4b28",
    icons: [
      {
        src: "/brand/qalam-tile.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
