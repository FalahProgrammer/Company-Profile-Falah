import { describe, expect, it } from "vitest";

import { visibleLinks } from "./navigation";

describe("visibleLinks", () => {
  it("drops links switched off in the CMS; unset or null counts as on", () => {
    const links = [
      { id: "a", label: "About", href: "/about", visible: true },
      { id: "b", label: "Press Release", href: "/press", visible: false },
      { id: "c", label: "Old", href: "/old", visible: null },
      { id: "d", label: "Unset", href: "/unset" },
    ];
    expect(visibleLinks(links).map((l) => l.id)).toEqual(["a", "c", "d"]);
  });

  it("copes with a missing list", () => {
    expect(visibleLinks(undefined)).toEqual([]);
    expect(visibleLinks(null)).toEqual([]);
  });
});
