import type { MetadataRoute } from "next";

import { defaultLocale, locales } from "@/lib/i18n/config";

const HOME_SLUG = "home";

type PageEntry = { slug: string; updatedAt?: string | null };
type CategoryEntry = { slug: string; hasDetailPage?: boolean | null; updatedAt?: string | null };

/**
 * Every public page in every language, each with its translations
 * (hreflang). Home lives at /<locale>; solution detail pages at
 * /<locale>/solution/<slug> when the category has one.
 */
export function buildSitemap(base: string, pages: PageEntry[], categories: CategoryEntry[]): MetadataRoute.Sitemap {
  const paths: { path: string; updatedAt?: string | null }[] = [
    ...pages.map((p) => ({ path: p.slug === HOME_SLUG ? "" : `/${p.slug}`, updatedAt: p.updatedAt })),
    ...categories.filter((c) => c.hasDetailPage).map((c) => ({ path: `/solution/${c.slug}`, updatedAt: c.updatedAt })),
  ];

  return paths.flatMap(({ path, updatedAt }) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: updatedAt ? new Date(updatedAt) : undefined,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])),
          "x-default": `${base}/${defaultLocale}${path}`,
        },
      },
    })),
  );
}
