import { describe, expect, it } from "vitest";

import { PRODUCTION_SITE_URL, resolveSiteUrl } from "./site-url";

describe("resolveSiteUrl", () => {
  it("uses SITE_URL when set, without a trailing slash", () => {
    expect(resolveSiteUrl("https://example.com/", "production")).toBe("https://example.com");
    expect(resolveSiteUrl("https://example.com", "development")).toBe("https://example.com");
  });

  it("falls back to the live domain in production", () => {
    expect(resolveSiteUrl(undefined, "production")).toBe(PRODUCTION_SITE_URL);
    expect(resolveSiteUrl("", "production")).toBe(PRODUCTION_SITE_URL);
  });

  it("stays unset in development and tests", () => {
    expect(resolveSiteUrl(undefined, "development")).toBeUndefined();
    expect(resolveSiteUrl(undefined, undefined)).toBeUndefined();
  });
});
