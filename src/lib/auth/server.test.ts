import { beforeEach, describe, expect, it, vi } from "vitest";
import { PB_EXTERNAL_ID_COOKIE_NAME, PB_TOKEN_COOKIE_NAME } from "./auth";
import { getAuthRequestContext } from "./server";

const { cookiesMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

function createFakeJwt(payload: Record<string, unknown>) {
  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `header.${encodedPayload}.signature`;
}

function mockCookies(values: Record<string, string | undefined>) {
  cookiesMock.mockResolvedValue({
    get: (name: string) => {
      const value = values[name];
      return value ? { value } : undefined;
    },
  });
}

describe("getAuthRequestContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns auth context for valid cookies", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T00:00:00.000Z"));

    const token = createFakeJwt({ id: "pb-user-1", exp: 1_774_000_000 });
    mockCookies({
      [PB_TOKEN_COOKIE_NAME]: token,
      [PB_EXTERNAL_ID_COOKIE_NAME]: "external-1",
    });

    await expect(getAuthRequestContext()).resolves.toEqual({
      pocketBaseUserId: "pb-user-1",
      pocketBaseToken: token,
      externalUserId: "external-1",
    });

    vi.useRealTimers();
  });

  it("throws when token is missing", async () => {
    mockCookies({
      [PB_EXTERNAL_ID_COOKIE_NAME]: "external-1",
    });

    await expect(getAuthRequestContext()).rejects.toThrow("Unauthorized");
  });

  it("throws when external user id is missing", async () => {
    const token = createFakeJwt({ id: "pb-user-1", exp: 1_774_000_000 });
    mockCookies({
      [PB_TOKEN_COOKIE_NAME]: token,
    });

    await expect(getAuthRequestContext()).rejects.toThrow(
      "External user id cookie is missing",
    );
  });

  it("throws when session is expired", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T00:00:00.000Z"));

    const token = createFakeJwt({ id: "pb-user-1", exp: 1_700_000_000 });
    mockCookies({
      [PB_TOKEN_COOKIE_NAME]: token,
      [PB_EXTERNAL_ID_COOKIE_NAME]: "external-1",
    });

    await expect(getAuthRequestContext()).rejects.toThrow("Session expired");

    vi.useRealTimers();
  });
});
