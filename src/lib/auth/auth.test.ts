import { describe, expect, it, vi } from "vitest";
import { getTokenTimeLeft, normalizeKzPhone, parseJWT } from "./auth";

function createFakeJwt(payload: Record<string, unknown>) {
  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `header.${encodedPayload}.signature`;
}

describe("normalizeKzPhone", () => {
  it("normalizes 8xxxxxxxxxx to +7xxxxxxxxxx", () => {
    expect(normalizeKzPhone("87051234567")).toBe("+77051234567");
  });

  it("keeps +7 format and strips symbols", () => {
    expect(normalizeKzPhone("+7 (705) 123-45-67")).toBe("+77051234567");
  });

  it("returns null for invalid phone number", () => {
    expect(normalizeKzPhone("12345")).toBeNull();
  });
});

describe("parseJWT", () => {
  it("returns id and exp from valid payload", () => {
    const token = createFakeJwt({ id: "user_1", exp: 1_800_000_000 });
    const parsed = parseJWT(token);

    expect(parsed.id).toBe("user_1");
    expect(parsed.exp).toBe(1_800_000_000);
  });

  it("throws for invalid token format", () => {
    expect(() => parseJWT("not-a-jwt")).toThrow();
  });
});

describe("getTokenTimeLeft", () => {
  it("calculates seconds before expiry", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-14T00:00:00.000Z"));

    expect(getTokenTimeLeft(1_773_446_460)).toBe(60);

    vi.useRealTimers();
  });
});
