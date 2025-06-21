"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-12">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="bg-red-100 p-3 rounded-full mb-4">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. An error occurred while loading this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
