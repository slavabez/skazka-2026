import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTokenTimeLeft, parseJWT, PB_TOKEN_COOKIE_NAME } from "@/lib/auth/auth";
import { getAuthCookieSettings, getPocketBaseUserById } from "@/lib/auth/pocketbase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("t");

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const tokenData = parseJWT(token);
    const timeLeft = getTokenTimeLeft(tokenData.exp);

    if (timeLeft <= 0) {
      return new NextResponse("Token expired", { status: 401 });
    }

    const userData = await getPocketBaseUserById({
      token,
      userId: tokenData.id,
    });

    const tokenCookieStore = await cookies();
    tokenCookieStore.set({
      name: PB_TOKEN_COOKIE_NAME,
      value: token,
      ...getAuthCookieSettings(),
    });

    return NextResponse.json({
      user: userData,
      expiry: tokenData.exp,
      session: {
        expiry: tokenData.exp,
        timeLeft,
      },
    });
  } catch (error) {
    console.error("Impersonation auth failed", error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
