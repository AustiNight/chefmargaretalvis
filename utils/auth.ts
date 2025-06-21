import type { NextRequest } from "next/server"

// Types
export type UserRole = "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface AuthToken {
  user: User
  exp: number
}

// Cookie name
const COOKIE_NAME = "auth_token"

// Client-side functions
export function loginUser(token: string): void {
  // In a client component, set the cookie
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
}

export function logoutUser() {
  // In a client component, remove the cookie
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}

// Refresh the auth token
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error refreshing token:", error)
    return false
  }
}

// Get current user from cookie (client-side only)
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    // Get token from cookie
    const cookies = document.cookie.split(";")
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`))

    if (!tokenCookie) {
      resolve(null)
      return
    }

    const token = tokenCookie.split("=")[1]

    try {
      // Simple parsing of JWT payload without verification
      // This is safe for UI purposes only, actual auth is done server-side
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )

      const decoded = JSON.parse(jsonPayload) as AuthToken

      // Check if token is about to expire (less than 5 minutes remaining)
      const expiryTime = decoded.exp * 1000 // Convert to milliseconds
      const currentTime = Date.now()
      const timeRemaining = expiryTime - currentTime

      // If token is about to expire, refresh it
      if (timeRemaining < 5 * 60 * 1000) {
        refreshToken().catch(console.error)
      }

      resolve(decoded.user)
    } catch (error) {
      resolve(null)
    }
  })
}

// Middleware helper (server-side only)
export function getAuthCookie(request: NextRequest): string | undefined {
  return request.cookies.get(COOKIE_NAME)?.value
}
