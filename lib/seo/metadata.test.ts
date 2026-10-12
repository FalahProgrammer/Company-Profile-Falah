import { describe, expect, it } from "vitest";

import { openGraphFor, pageMetadata } from "./metadata";

const alternates = { canonical: "/en/about" };

describe("pageMetadata", () => {
  it("leaves out description and openGraph when the page has none, so the layout's apply", () => {
    const metadata = pageMetadata({ locale: "en", siteName: "Falah", alternates });
    expect("description" in metadata).toBe(false);
    expect("openGraph" in metadata).toBe(false);
    expect("title" in metadata).toBe(false);
    expect(metadata.alternates).toBe(alternates);
  });

  it("sets what the page has; its openGraph carries the site name and type", () => {
    const metadata = pageMetadata({
      locale: "id",
      siteName: "Falah",
      title: "About",
      description: "Tentang kami",
      image: "/media/x.webp",
      alternates,
    });
    expect(metadata.title).toBe("About");
    expect(metadata.description).toBe("Tentang kami");
    expect(metadata.openGraph).toMatchObject({
      siteName: "Falah",
      type: "website",
      locale: "id_ID",
      images: ["/media/x.webp"],
    });
  });
});

describe("openGraphFor", () => {
  it("has no images without a preview image", () => {
    expect(openGraphFor("en", "Falah").images).toBeUndefined();
    expect(openGraphFor("en", "Falah").locale).toBe("en_US");
  });
});
