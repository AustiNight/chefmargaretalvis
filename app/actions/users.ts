"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getAllUsersAction() {
  try {
    const users = await sql`
      SELECT * FROM users
      ORDER BY signup_date DESC
    `
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function getUsersByIdsAction(ids: string[]) {
  try {
    if (ids.length === 0) return []

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ")
    const query = `SELECT * FROM users WHERE id IN (${placeholders})`

    const users = await sql.unsafe(query, ...ids)
    return users
  } catch (error) {
    console.error("Error fetching users by IDs:", error)
    throw new Error("Failed to fetch users by IDs")
  }
}

export async function updateUserLastContactedAction(userId: string, eventId: string, eventName: string) {
  try {
    const result = await sql`
      UPDATE users
      SET last_contacted_date = NOW(),
          last_contacted_event_id = ${eventId},
          last_contacted_event_name = ${eventName}
      WHERE id = ${userId}
      RETURNING *
    `

    revalidatePath("/admin/users")

    return {
      success: true,
      user: result[0] || null,
    }
  } catch (error) {
    console.error("Error updating user last contacted:", error)
    return {
      success: false,
      message: "Failed to update user contact information",
    }
  }
}

export async function deleteUserAction(id: string) {
  try {
    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `

    revalidatePath("/admin/users")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      message: "Failed to delete user",
    }
  }
}

export async function getNewsletterSubscribersAction() {
  try {
    const subscribers = await sql`
      SELECT * FROM users
      WHERE subscribe_newsletter = true
    `
    return subscribers
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error)
    throw new Error("Failed to fetch newsletter subscribers")
  }
}

export async function getUsersCountAction() {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM users
    `
    return Number.parseInt(result[0].count, 10)
  } catch (error) {
    console.error("Error counting users:", error)
    return 0
  }
}
