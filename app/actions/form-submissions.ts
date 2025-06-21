"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { FormSubmission } from "@/types"

export async function getFormSubmissionsAction() {
  try {
    const submissions = await sql<FormSubmission[]>`
      SELECT * FROM form_submissions
      ORDER BY timestamp DESC
    `
    return submissions
  } catch (error) {
    console.error("Error fetching form submissions:", error)
    throw new Error("Failed to fetch form submissions")
  }
}

export async function deleteFormSubmissionAction(id: string) {
  try {
    await sql`
      DELETE FROM form_submissions
      WHERE id = ${id}
    `

    revalidatePath("/admin/messages")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting form submission:", error)
    return {
      success: false,
      message: "Failed to delete form submission",
    }
  }
}

export async function updateSubmissionProcessedStatusAction(id: string, isProcessed: boolean) {
  try {
    await sql`
      UPDATE form_submissions
      SET is_processed = ${isProcessed}
      WHERE id = ${id}
    `

    revalidatePath("/admin/messages")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating submission processed status:", error)
    return {
      success: false,
      message: "Failed to update submission status",
    }
  }
}

export async function getMessageCountAction() {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM form_submissions
    `
    return Number.parseInt(result[0].count, 10)
  } catch (error) {
    console.error("Error counting messages:", error)
    return 0
  }
}
