import { cookies } from "next/headers";
import {
  getTokenTimeLeft,
  PB_EXTERNAL_ID_COOKIE_NAME,
  PB_TOKEN_COOKIE_NAME,
  parseJWT,
} from "@/lib/auth/auth";

export interface AuthRequestContext {
  pocketBaseUserId: string;
  pocketBaseToken: string;
  externalUserId: string;
}

export async function getAuthRequestContext(): Promise<AuthRequestContext> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PB_TOKEN_COOKIE_NAME)?.value;
  const externalUserId = cookieStore.get(PB_EXTERNAL_ID_COOKIE_NAME)?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }
  if (!externalUserId) {
    throw new Error("External user id cookie is missing");
  }

  const tokenData = parseJWT(token);
  if (getTokenTimeLeft(tokenData.exp) <= 0) {
    throw new Error("Session expired");
  }

  return {
    pocketBaseUserId: tokenData.id,
    pocketBaseToken: token,
    externalUserId,
  };
}
