import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

// Read per request: SITE_URL may only exist when the container runs, not while the image builds.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
