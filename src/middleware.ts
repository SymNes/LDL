import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the request is for the admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check for the admin password in cookies
    const adminAuth = request.cookies.get("admin_auth")?.value;
    
    if (adminAuth !== "authenticated") {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
