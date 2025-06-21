"use client"

import { useEffect } from "react"

export default function FallbackPage() {
  useEffect(() => {
    console.log("⚠️ FallbackPage mounted - this means the main page failed to load")
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Chef Margaret Alvis</h1>
      <p className="text-xl mb-8">Private Chef Services in Oak Cliff, Texas</p>

      <div className="p-6 bg-yellow-100 rounded-lg max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Page Loading Issue</h2>
        <p className="mb-4">
          We're experiencing a technical issue loading the full website. Our team has been notified and is working to
          resolve this.
        </p>

        <div className="bg-white p-4 rounded-lg mt-4">
          <h3 className="font-medium mb-2">Troubleshooting Information</h3>
          <p className="text-sm text-gray-600">
            Time: {new Date().toISOString()}
            <br />
            URL: {typeof window !== "undefined" ? window.location.href : "Not available"}
            <br />
            User Agent: {typeof navigator !== "undefined" ? navigator.userAgent : "Not available"}
          </p>
        </div>

        <div className="mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )
}
