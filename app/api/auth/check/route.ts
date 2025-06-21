import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const COOKIE_NAME = "auth_token"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found",
      })
    }

    try {
      // Make sure JWT_SECRET is available
      if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined")
        return NextResponse.json(
          {
            authenticated: false,
            message: "Server configuration error",
          },
          { status: 500 },
        )
      }

      const decoded = jwt.verify(token, JWT_SECRET)
      return NextResponse.json({
        authenticated: true,
        user: (decoded as any).user,
      })
    } catch (error) {
      console.error("Token verification error:", error)
      // Token verification failed - return a 401 instead of 500
      return NextResponse.json(
        {
          authenticated: false,
          message: "Invalid token",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Auth check error:", error)
    // Return a proper JSON response even in case of error
    return NextResponse.json(
      {
        authenticated: false,
        message: "Server error",
      },
      { status: 500 },
    )
  }
}
