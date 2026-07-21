import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminLoginPath = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === adminLoginPath) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");

  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL(adminLoginPath, request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
