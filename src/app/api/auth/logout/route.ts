import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PB_TOKEN_COOKIE_NAME } from "@/lib/auth/auth";

async function clearSessionCookie() {
  const tokenCookieStore = await cookies();
  tokenCookieStore.delete(PB_TOKEN_COOKIE_NAME);
}

export async function GET() {
  await clearSessionCookie();
  return new NextResponse("Successfully logged out", { status: 200 });
}

export async function POST() {
  await clearSessionCookie();
  return new NextResponse("Successfully logged out", { status: 200 });
}
