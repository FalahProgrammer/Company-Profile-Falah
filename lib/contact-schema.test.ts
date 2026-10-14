import { describe, expect, it } from "vitest";

import { antiSpamSchema, contactSchema } from "./contact-schema";

const valid = { fullName: "Faiz", organization: "Falah", email: "  Faiz@Example.COM ", phone: "+622126961651" };

describe("contact form", () => {
  it("accepts a valid submission and normalises the email", () => {
    const parsed = contactSchema.parse(valid);
    expect(parsed.email).toBe("faiz@example.com");
    expect(parsed.message).toBe("");
  });

  it.each([
    ["short name", { fullName: "F" }],
    ["bad email", { email: "not-an-email" }],
    ["bad phone", { phone: "call me" }],
    ["phone with spaces", { phone: "+62 21 2696 1651" }],
    ["phone with dashes", { phone: "0812-3456-7890" }],
    ["phone with letters", { phone: "0812345678a" }],
    ["phone too short", { phone: "0812345" }],
    ["phone too long", { phone: "0812345678901234" }],
    ["plus in the middle", { phone: "0812+3456789" }],
    ["long message", { message: "x".repeat(2001) }],
  ])("rejects %s", (_, override) => {
    expect(contactSchema.safeParse({ ...valid, ...override }).success).toBe(false);
  });

  it("accepts a phone number of digits, with or without the country code", () => {
    for (const phone of ["081234567890", "+6281234567890", "02126961651"]) {
      expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(true);
    }
  });

  it("the honeypot must stay empty", () => {
    expect(antiSpamSchema.safeParse({ website: "", startedAt: Date.now() }).success).toBe(true);
    expect(antiSpamSchema.safeParse({ website: "spam.com", startedAt: Date.now() }).success).toBe(false);
  });
});
