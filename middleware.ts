import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAuthCookie } from "@/utils/auth"

export function middleware(request: NextRequest) {
  // Check if the request is for an admin page (except login)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    // Check for preview cookie first - this allows bypassing auth in preview mode
    const previewAuth = request.cookies.get("preview_auth")?.value
    if (previewAuth === "enabled") {
      return NextResponse.next()
    }

    // Otherwise check for the real auth token
    const token = getAuthCookie(request)
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // We'll let the server-side API handle actual token verification
    return NextResponse.next()
  }

  // For all other routes, including root, just proceed normally
  return NextResponse.next()
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: ["/admin/:path*"],
}
