import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getTokenTimeLeft,
  PB_TOKEN_COOKIE_NAME,
  parseJWT,
} from "@/lib/auth/auth";
import {
  getAuthCookieSettings,
  refreshPocketBaseToken,
} from "@/lib/auth/pocketbase";

export async function GET() {
  const tokenCookieStore = await cookies();
  const token = tokenCookieStore.get(PB_TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const refreshedToken = await refreshPocketBaseToken(token);
    const tokenData = parseJWT(refreshedToken);

    tokenCookieStore.set({
      name: PB_TOKEN_COOKIE_NAME,
      value: refreshedToken,
      ...getAuthCookieSettings(),
    });

    return NextResponse.json({
      expiry: tokenData.exp,
      timeLeft: getTokenTimeLeft(tokenData.exp),
    });
  } catch (error) {
    console.error("Token refresh failed", error);
    return new NextResponse("Failed to refresh token", { status: 500 });
  }
}
