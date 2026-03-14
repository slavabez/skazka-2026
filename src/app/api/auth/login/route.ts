import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getTokenTimeLeft,
  normalizeKzPhone,
  parseJWT,
  PB_TOKEN_COOKIE_NAME,
} from "@/lib/auth/auth";
import {
  getAuthCookieSettings,
  loginWithPocketBase,
} from "@/lib/auth/pocketbase";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      phone?: string;
      password?: string;
    };

    if (!body.phone || !body.password) {
      return new NextResponse("Phone and password are required", {
        status: 400,
      });
    }

    const normalizedPhone = normalizeKzPhone(body.phone);
    if (!normalizedPhone) {
      return new NextResponse("Введите корректный номер телефона", {
        status: 400,
      });
    }

    const pbAuthData = await loginWithPocketBase({
      phone: normalizedPhone,
      password: body.password,
    });

    const tokenData = parseJWT(pbAuthData.token);
    const tokenCookieStore = await cookies();
    tokenCookieStore.set({
      name: PB_TOKEN_COOKIE_NAME,
      value: pbAuthData.token,
      ...getAuthCookieSettings(),
    });

    return NextResponse.json({
      user: pbAuthData.record,
      expiry: tokenData.exp,
      session: {
        expiry: tokenData.exp,
        timeLeft: getTokenTimeLeft(tokenData.exp),
      },
    });
  } catch (error) {
    console.error("Auth login failed", error);
    return new NextResponse("Неверный номер телефона или пароль", {
      status: 401,
    });
  }
}
