import type { MetadataRoute } from "next";

import { getPagesForSitemap, getSolutionCategories } from "@/lib/cms/queries";
import { buildSitemap } from "@/lib/seo/sitemap";
import { siteUrl } from "@/lib/site";

// Built per request (the CMS isn't reachable while the image builds); the CMS
// responses behind it are cached and refreshed through the usual revalidate tags.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  if (!base) return [];
  const [pages, categories] = await Promise.all([getPagesForSitemap(), getSolutionCategories("en")]);
  return buildSitemap(base, pages, categories);
}
