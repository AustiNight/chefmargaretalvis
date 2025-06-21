"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDatabaseStats } from "@/app/actions/database-stats"
import { Loader2 } from "lucide-react"

export default function DatabaseStats() {
  const [stats, setStats] = useState<{
    users: number
    events: number
    formSubmissions: number
    recipes: number
    blogPosts: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDatabaseStats()
        if (result.success) {
          setStats(result.stats)
        } else {
          setError(result.error || "Failed to fetch database statistics")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Users" description="User accounts" count={stats?.users || 0} />
      <StatCard title="Events" description="Upcoming and past events" count={stats?.events || 0} />
      <StatCard
        title="Form Submissions"
        description="Contact and gift certificate requests"
        count={stats?.formSubmissions || 0}
      />
      <StatCard title="Recipes" description="Cooking recipes" count={stats?.recipes || 0} />
      <StatCard title="Blog Posts" description="Articles and posts" count={stats?.blogPosts || 0} />
    </div>
  )
}

function StatCard({ title, description, count }: { title: string; description: string; count: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{count}</p>
      </CardContent>
    </Card>
  )
}
