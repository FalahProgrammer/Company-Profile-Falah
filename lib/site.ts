import "server-only";

import { env } from "@/lib/env";

/** Public address of the website without a trailing slash, or undefined when it isn't configured. */
export const siteUrl = (): string | undefined => env.SITE_URL?.replace(/\/+$/, "");
