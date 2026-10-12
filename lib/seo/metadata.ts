import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n/config";

export const FALLBACK_SITE_NAME = "Falah Inovasi Teknologi";

/** Open Graph block for the site (and for a page with its own preview image). */
export function openGraphFor(locale: Locale, siteName: string, image?: string): NonNullable<Metadata["openGraph"]> {
  return {
    siteName,
    type: "website",
    locale: locale === "id" ? "id_ID" : "en_US",
    images: image ? [image] : undefined,
  };
}

/**
 * Metadata of a CMS page. Keys without a value are left out on purpose: Next.js
 * lets a child's `description: undefined` or `openGraph: undefined` wipe what
 * the layout set, which removed the site description and every og: tag.
 * A page's own openGraph replaces the layout's wholesale, so it repeats the site
 * name and type; without a preview image of its own the layout's applies.
 */
export function pageMetadata({
  locale,
  siteName,
  title,
  description,
  image,
  alternates,
}: {
  locale: Locale;
  siteName: string;
  title?: string | null;
  description?: string | null;
  image?: string;
  alternates: Metadata["alternates"];
}): Metadata {
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(image ? { openGraph: openGraphFor(locale, siteName, image) } : {}),
    alternates,
  };
}
