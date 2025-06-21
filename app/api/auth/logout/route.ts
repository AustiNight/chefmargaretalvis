import { NextResponse } from "next/server"

const COOKIE_NAME = "auth_token"

export async function POST() {
  // Create response
  const response = NextResponse.json({
    success: true,
    message: "Logout successful",
  })

  // Clear cookie
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
  })

  return response
}
