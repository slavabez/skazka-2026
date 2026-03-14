import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PB_TOKEN_COOKIE_NAME } from "@/lib/auth/auth";

export function proxy(request: NextRequest) {
  const hasTokenCookie = request.cookies.has(PB_TOKEN_COOKIE_NAME);
  if (hasTokenCookie) {
    return;
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/orders/:path*", "/reports/:path*", "/profile/:path*"],
};
