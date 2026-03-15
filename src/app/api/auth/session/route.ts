import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getTokenTimeLeft,
  PB_EXTERNAL_ID_COOKIE_NAME,
  PB_TOKEN_COOKIE_NAME,
  PB_TOKEN_EXPIRY_THRESHOLD,
  parseJWT,
} from "@/lib/auth/auth";
import {
  getAuthCookieSettings,
  getPocketBaseUserById,
  refreshPocketBaseToken,
} from "@/lib/auth/pocketbase";

export async function GET() {
  const tokenCookieStore = await cookies();
  const token = tokenCookieStore.get(PB_TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    let activeToken = token;
    let tokenData = parseJWT(activeToken);
    let timeLeft = getTokenTimeLeft(tokenData.exp);

    if (timeLeft <= 0) {
      return new NextResponse("Session expired", { status: 401 });
    }

    if (timeLeft < PB_TOKEN_EXPIRY_THRESHOLD) {
      activeToken = await refreshPocketBaseToken(activeToken);
      tokenData = parseJWT(activeToken);
      timeLeft = getTokenTimeLeft(tokenData.exp);

      tokenCookieStore.set({
        name: PB_TOKEN_COOKIE_NAME,
        value: activeToken,
        ...getAuthCookieSettings(),
      });
    }

    const userData = await getPocketBaseUserById({
      token: activeToken,
      userId: tokenData.id,
    });
    tokenCookieStore.set({
      name: PB_EXTERNAL_ID_COOKIE_NAME,
      value: userData.externalId,
      ...getAuthCookieSettings(),
    });

    return NextResponse.json({
      session: {
        expiry: tokenData.exp,
        timeLeft,
      },
      user: userData,
    });
  } catch (error) {
    console.error("Session check failed", error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
