import { PB_TOKEN_EXPIRY } from "@/lib/auth/auth";
import type { UsersRecord } from "@/types/user";

interface PocketBaseAuthResponse {
  token: string;
  record: UsersRecord;
}

function getPocketBaseUrl(): string {
  const pbUrl = process.env.DB_URL;
  if (!pbUrl) {
    throw new Error("DB_URL is not set");
  }
  return pbUrl;
}

export async function loginWithPocketBase({
  phone,
  password,
}: {
  phone: string;
  password: string;
}): Promise<PocketBaseAuthResponse> {
  const response = await fetch(
    `${getPocketBaseUrl()}/api/collections/users/auth-with-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity: phone,
        password,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Invalid phone number or password");
  }

  return (await response.json()) as PocketBaseAuthResponse;
}

export async function refreshPocketBaseToken(token: string): Promise<string> {
  const response = await fetch(
    `${getPocketBaseUrl()}/api/collections/users/auth-refresh`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = (await response.json()) as { token?: string };
  if (!data.token) {
    throw new Error("No token returned from PocketBase refresh");
  }

  return data.token;
}

export async function getPocketBaseUserById({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): Promise<UsersRecord> {
  const response = await fetch(
    `${getPocketBaseUrl()}/api/collections/users/records/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("User not found or unauthorized");
  }

  return (await response.json()) as UsersRecord;
}

export function getAuthCookieSettings() {
  return {
    maxAge: PB_TOKEN_EXPIRY,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}
