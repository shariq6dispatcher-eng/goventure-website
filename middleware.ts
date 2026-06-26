import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get("admin-auth");

  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  console.log("MIDDLEWARE HIT:", req.nextUrl.pathname);
  if (isAdminPage && !auth) {
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};