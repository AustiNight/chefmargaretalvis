import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// In a real app, this would be stored in a database
const ADMIN_USERS = [
  {
    id: "1",
    email: "margaret@chefmargaretalvis.com",
    password: "admin123", // This would be hashed in a real app
    name: "Margaret Alvis",
    role: "admin",
  },
]

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "1h" // Token expiration (changed from 7d to 1h for security)
const COOKIE_NAME = "auth_token"

// Simple rate limiting
interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()
const RATE_LIMIT_MAX = 5 // Maximum attempts
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in milliseconds

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  // If no record exists or the window has expired, create a new record
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return false
  }

  // Increment the count
  record.count++

  // Check if the limit has been exceeded
  if (record.count > RATE_LIMIT_MAX) {
    return true
  }

  return false
}

export async function POST(request: Request) {
  try {
    // Get client IP (in a real app, you'd use request headers)
    const ip = request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limit
    if (isRateLimited(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please try again later." },
        { status: 429 },
      )
    }

    const { email, password } = await request.json()

    // Find user
    const user = ADMIN_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      console.warn(`Failed login attempt for email: ${email} from IP: ${ip}`)
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Create user object without password
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    // Create JWT token with expiration
    const token = jwt.sign({ user: userWithoutPassword }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token: token, // Send token to client
    })

    // Set cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour in seconds
      path: "/",
      sameSite: "strict",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
