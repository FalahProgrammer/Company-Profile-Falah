import { afterEach, describe, expect, it, vi } from "vitest";

import { randomId } from "./random-id";

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("randomId", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses crypto.randomUUID when the browser has it", () => {
    expect(randomId()).toMatch(UUID_V4);
  });

  it("still works without crypto.randomUUID (plain HTTP on an IP address)", () => {
    const real = globalThis.crypto;
    vi.stubGlobal("crypto", { getRandomValues: real.getRandomValues.bind(real) });
    expect(typeof globalThis.crypto.randomUUID).toBe("undefined");
    const ids = new Set(Array.from({ length: 50 }, () => randomId()));
    expect(ids.size).toBe(50);
    for (const id of ids) expect(id).toMatch(UUID_V4);
  });
});
