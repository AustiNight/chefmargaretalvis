"use server"

import { sql } from "@/lib/db"

export async function getDatabaseStats() {
  try {
    const [userCount] = await sql<[{ count: number }]>`SELECT COUNT(*) as count FROM users`
    const [eventCount] = await sql<[{ count: number }]>`SELECT COUNT(*) as count FROM events`
    const [formSubmissionCount] = await sql<[{ count: number }]>`SELECT COUNT(*) as count FROM form_submissions`
    const [recipeCount] = await sql<[{ count: number }]>`SELECT COUNT(*) as count FROM recipes`
    const [blogPostCount] = await sql<[{ count: number }]>`SELECT COUNT(*) as count FROM blog_posts`

    return {
      success: true,
      stats: {
        users: userCount?.count || 0,
        events: eventCount?.count || 0,
        formSubmissions: formSubmissionCount?.count || 0,
        recipes: recipeCount?.count || 0,
        blogPosts: blogPostCount?.count || 0,
      },
    }
  } catch (error) {
    console.error("Error fetching database stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fetching database stats",
    }
  }
}
