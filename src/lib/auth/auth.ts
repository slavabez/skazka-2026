/**
 * Auth token duration in seconds. This is used to set the cookie expiration time. 7 days by default.
 */
export const PB_TOKEN_EXPIRY = 7 * 24 * 60 * 60;
/**
 * Auth token expiry threshold in seconds. This is used to check if the auth token needs to be refreshed. 1 day by default.
 */
export const PB_TOKEN_EXPIRY_THRESHOLD = 24 * 60 * 60;
/**
 * Auth token cookie name. This is used to set and get the auth token from the cookie. "pb_token" by default.
 */
export const PB_TOKEN_COOKIE_NAME = "pb_token";
export const PB_EXTERNAL_ID_COOKIE_NAME = "pb_external_id";

const PHONE_DIGITS_WITH_COUNTRY_CODE = 11;

export interface PocketBaseTokenPayload {
  id: string;
  exp: number;
  [key: string]: unknown;
}

export function parseJWT(token: string): PocketBaseTokenPayload {
  const parts = token.split(".");
  if (parts.length < 2) {
    throw new Error("Invalid JWT token");
  }

  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  const payload = JSON.parse(decoded) as PocketBaseTokenPayload;

  if (!payload.id || !payload.exp) {
    throw new Error("Invalid JWT payload");
  }

  return payload;
}

export function normalizeKzPhone(input: string): string | null {
  let normalizedDigits = input.replace(/\D/g, "");

  if (normalizedDigits.length === 10) {
    normalizedDigits = `7${normalizedDigits}`;
  } else if (
    normalizedDigits.length === PHONE_DIGITS_WITH_COUNTRY_CODE &&
    normalizedDigits.startsWith("8")
  ) {
    normalizedDigits = `7${normalizedDigits.slice(1)}`;
  }

  if (
    normalizedDigits.length !== PHONE_DIGITS_WITH_COUNTRY_CODE ||
    !normalizedDigits.startsWith("7")
  ) {
    return null;
  }

  return `+${normalizedDigits}`;
}

export function getTokenTimeLeft(expiry: number): number {
  return expiry - Math.floor(Date.now() / 1000);
}
