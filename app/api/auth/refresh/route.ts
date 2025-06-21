import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "1h" // Token expiration
const COOKIE_NAME = "auth_token"

export async function POST(request: Request) {
  try {
    // Get the current token from cookies
    const cookies = request.headers.get("cookie")
    if (!cookies) {
      return NextResponse.json({ success: false, message: "No token found" }, { status: 401 })
    }

    const tokenCookie = cookies.split(";").find((c) => c.trim().startsWith(`${COOKIE_NAME}=`))
    if (!tokenCookie) {
      return NextResponse.json({ success: false, message: "No token found" }, { status: 401 })
    }

    const token = tokenCookie.split("=")[1]

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Create a new token with the same user info but new expiration
      const newToken = jwt.sign({ user: decoded.user }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      })

      // Create response
      const response = NextResponse.json({
        success: true,
        message: "Token refreshed",
        user: decoded.user,
        token: newToken,
      })

      // Set new cookie
      response.cookies.set({
        name: COOKIE_NAME,
        value: newToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour in seconds
        path: "/",
        sameSite: "strict",
      })

      return response
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
