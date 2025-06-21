"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
          <div className="flex flex-col items-center max-w-md text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Critical Error</h1>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. A critical error occurred while loading the application.
            </p>
            <Button onClick={reset} variant="default">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
