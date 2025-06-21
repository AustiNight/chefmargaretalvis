"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export default function DatabaseMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleMigration = async () => {
    if (
      !confirm(
        "Are you sure you want to migrate all data from localStorage to the database? This operation cannot be undone.",
      )
    ) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.stats)
      } else {
        setError(data.message || "Migration failed")
      }
    } catch (err) {
      setError("An error occurred during migration")
      console.error("Migration error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Migration</CardTitle>
        <CardDescription>Migrate data from localStorage to the PostgreSQL database</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          This utility will migrate all your existing data from browser localStorage to the PostgreSQL database. This is
          a one-time operation that should be performed after setting up the database.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Migration Successful</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                <li>{result.events} events migrated</li>
                <li>{result.users} users migrated</li>
                <li>{result.formSubmissions} form submissions migrated</li>
                <li>{result.recipes} recipes migrated</li>
                <li>{result.blogPosts} blog posts migrated</li>
                <li>{result.notifications} notifications migrated</li>
                <li>Site settings: {result.siteSettings ? "Migrated" : "Failed"}</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleMigration} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating Data...
            </>
          ) : (
            "Migrate Data to Database"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
