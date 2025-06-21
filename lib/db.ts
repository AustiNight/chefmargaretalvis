import { neon, neonConfig } from "@neondatabase/serverless"

// Configure neon to use keep-alive connections
neonConfig.fetchConnectionCache = true

// Check if DATABASE_URL is available
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || ""

// Function to check if database connection is available
export function checkDatabaseConnection(): boolean {
  return !!dbUrl
}

// Create SQL client
export const sql = dbUrl ? neon(dbUrl) : null

// Handle database errors
export function handleDbError(error: any, operation: string): void {
  console.error(`Database error during ${operation}:`, error)

  // Check if it's a connection error
  if (error.message?.includes("connection") || error.code === "ECONNREFUSED") {
    console.warn("Database connection failed. Check your DATABASE_URL environment variable.")
  }
}
