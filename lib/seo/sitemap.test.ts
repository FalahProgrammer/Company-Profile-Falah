import { describe, expect, it } from "vitest";

import { buildSitemap } from "./sitemap";

describe("buildSitemap", () => {
  const base = "https://example.com";
  const sitemap = buildSitemap(
    base,
    [
      { slug: "home", updatedAt: "2026-10-12T04:00:00.000Z" },
      { slug: "about", updatedAt: "2026-10-05T04:00:00.000Z" },
    ],
    [
      { slug: "virtual-training-suite", hasDetailPage: true, updatedAt: "2026-10-01T00:00:00.000Z" },
      { slug: "cyber", hasDetailPage: false },
    ],
  );

  it("lists each page in every language; home sits at /<locale>", () => {
    expect(sitemap.map((e) => e.url)).toEqual([
      "https://example.com/en",
      "https://example.com/id",
      "https://example.com/en/about",
      "https://example.com/id/about",
      "https://example.com/en/solution/virtual-training-suite",
      "https://example.com/id/solution/virtual-training-suite",
    ]);
  });

  it("leaves out categories without a detail page", () => {
    expect(sitemap.some((e) => e.url.includes("cyber"))).toBe(false);
  });

  it("links every entry to its translations, x-default being English", () => {
    expect(sitemap[2]!.alternates?.languages).toEqual({
      en: "https://example.com/en/about",
      id: "https://example.com/id/about",
      "x-default": "https://example.com/en/about",
    });
  });

  it("carries the last change date", () => {
    expect(sitemap[0]!.lastModified).toEqual(new Date("2026-10-12T04:00:00.000Z"));
  });
});
