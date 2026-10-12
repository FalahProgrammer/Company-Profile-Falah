import "server-only";

import { z } from "zod";

const isBuild = process.env.NEXT_PHASE === "phase-production-build";

/** Treats `KEY=` (empty, e.g. copied from .env.example) the same as unset. */
const optional = <T extends z.ZodType>(type: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), type.optional());

const schema = z.object({
  /** Base URL of the CMS (server-to-server). Optional only for offline builds (CI). */
  CMS_URL: optional(z.string().url()),
  /** CMS URL as seen by the browser (visual editor). Defaults to CMS_URL. */
  CMS_PUBLIC_URL: optional(z.string().url()),
  REVALIDATE_SECRET: optional(z.string().min(32)),
  CMS_CONTACT_API_KEY: optional(z.string().min(32)),
  /** Public address of this website (https://example.com): absolute URLs in the sitemap, canonical links and previews. */
  SITE_URL: optional(z.string().url()),
  /** Google Search Console "HTML tag" verification: the content of the google-site-verification meta tag. */
  GOOGLE_SITE_VERIFICATION: optional(z.string().min(10)),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
  throw new Error(`Invalid environment configuration:\n${issues.join("\n")}`);
}

export const env = parsed.data;

/**
 * Without CMS_URL the site builds with no content (useful for CI lint/build
 * checks). At runtime in production the CMS is mandatory.
 */
if (!env.CMS_URL && process.env.NODE_ENV === "production" && !isBuild) {
  throw new Error("CMS_URL is required at runtime");
}
