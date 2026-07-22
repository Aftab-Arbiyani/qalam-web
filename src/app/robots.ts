import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/shared/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
