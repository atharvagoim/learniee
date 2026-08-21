import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "learniee_session";
const PROTECTED_PATHS = ["/dashboard"];
const AUTH_PATHS = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
