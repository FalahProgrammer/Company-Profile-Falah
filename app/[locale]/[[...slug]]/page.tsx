import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { mediaUrl } from "@/lib/cms/media";
import { getPage, getPageSlugs, getSiteData, getSiteSettings } from "@/lib/cms/queries";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeAlternates } from "@/lib/i18n/metadata";
import { FALLBACK_SITE_NAME, pageMetadata } from "@/lib/seo/metadata";

const HOME_SLUG = "home";

type Params = { locale: string; slug?: string[] };

/** "/" → home; "/about" → about; nested paths are not CMS pages. */
function resolveSlug(segments: string[] | undefined): string | null {
  if (!segments?.length) return HOME_SLUG;
  if (segments.length > 1 || segments[0] === HOME_SLUG) return null;
  return segments[0];
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getPageSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug: slug === HOME_SLUG ? [] : [slug] })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug: segments } = await params;
  const slug = resolveSlug(segments);
  if (!isLocale(locale) || !slug) return {};
  const [page, settings] = await Promise.all([getPage(slug, locale), getSiteSettings(locale)]);
  if (!page) return {};

  const isHome = slug === HOME_SLUG;
  return pageMetadata({
    locale,
    siteName: settings?.siteName ?? FALLBACK_SITE_NAME,
    // The home page keeps the site name from the layout unless an SEO title is set.
    title: isHome ? page.meta?.title : page.meta?.title || page.title,
    description: page.meta?.description,
    image: mediaUrl(page.meta?.image),
    alternates: localeAlternates(isHome ? "" : slug, locale),
  });
}

export default async function CmsPage({ params }: { params: Promise<Params> }) {
  const { locale, slug: segments } = await params;
  const slug = resolveSlug(segments);
  if (!isLocale(locale) || !slug) notFound();

  const [page, data] = await Promise.all([getPage(slug, locale), getSiteData(locale)]);
  if (!page) notFound();

  return <RenderBlocks blocks={page.layout} ctx={{ locale, t: getDictionary(locale), data }} />;
}
