import "server-only";

import { env } from "@/lib/env";
import { resolveSiteUrl } from "@/lib/seo/site-url";

/** Public address of the website without a trailing slash (see resolveSiteUrl). */
export const siteUrl = (): string | undefined => resolveSiteUrl(env.SITE_URL, process.env.NODE_ENV);
