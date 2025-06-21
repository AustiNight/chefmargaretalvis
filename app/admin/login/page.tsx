"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // For preview purposes, we'll simulate a successful login with the correct credentials
      if (email === "margaret@chefmargaretalvis.com" && password === "admin123") {
        // Set a preview auth cookie for the preview environment
        document.cookie = "preview_auth=enabled; path=/; max-age=86400" // 24 hours

        // Simulate successful login
        setTimeout(() => {
          router.push("/admin")
        }, 1000)
      } else {
        // Simulate failed login
        setError("Invalid email or password")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Please log in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Preview mode notice */}
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              <strong>Preview Mode:</strong> Use email: margaret@chefmargaretalvis.com and password: admin123
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">Forgot your password? Contact your website administrator.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
