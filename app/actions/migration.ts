"use server"

import { migrateAllData } from "@/lib/migration/migrate-to-database"

export async function migrateDataFromLocalStorage() {
  try {
    const result = await migrateAllData()
    return { success: true, result }
  } catch (error) {
    console.error("Error in migration server action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during migration",
    }
  }
}
