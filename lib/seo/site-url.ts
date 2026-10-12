/** The public address of the live website; the default for production builds that don't set SITE_URL. */
export const PRODUCTION_SITE_URL = "https://falahtech.co.id";

/**
 * Public address of the website without a trailing slash. SITE_URL wins; a
 * production build without it falls back to the live domain, so canonical
 * links are absolute even when the build environment has no SITE_URL. Not set
 * in development, where relative links are fine.
 */
export function resolveSiteUrl(siteUrl: string | undefined, nodeEnv: string | undefined): string | undefined {
  const url = siteUrl || (nodeEnv === "production" ? PRODUCTION_SITE_URL : undefined);
  return url?.replace(/\/+$/, "");
}
