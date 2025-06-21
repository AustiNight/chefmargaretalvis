import { sql, handleDbError } from "../db"
import type { User } from "@/types"

// Get all users
export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await sql<User[]>`
      SELECT id, full_name, email, address, subscribe_newsletter, signup_date, 
             last_contacted_date, last_contacted_event_id, last_contacted_event_name
      FROM users
      ORDER BY signup_date DESC
    `
    return users
  } catch (error) {
    handleDbError(error, "fetch users")
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const [user] = await sql<User[]>`
      SELECT id, full_name, email, address, subscribe_newsletter, signup_date, 
             last_contacted_date, last_contacted_event_id, last_contacted_event_name
      FROM users
      WHERE id = ${id}
    `
    return user || null
  } catch (error) {
    handleDbError(error, "fetch user")
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await sql<User[]>`
      SELECT id, full_name, email, address, subscribe_newsletter, signup_date, 
             last_contacted_date, last_contacted_event_id, last_contacted_event_name
      FROM users
      WHERE email = ${email}
    `
    return user || null
  } catch (error) {
    handleDbError(error, "fetch user by email")
  }
}

// Create a new user
export async function createUser(user: Omit<User, "id" | "signup_date">): Promise<User> {
  try {
    const [newUser] = await sql<User[]>`
      INSERT INTO users (full_name, email, address, subscribe_newsletter)
      VALUES (${user.full_name}, ${user.email}, ${user.address}, ${user.subscribe_newsletter})
      RETURNING id, full_name, email, address, subscribe_newsletter, signup_date, 
                last_contacted_date, last_contacted_event_id, last_contacted_event_name
    `
    return newUser
  } catch (error) {
    handleDbError(error, "create user")
  }
}

// Update a user
export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  try {
    // Build the SET clause dynamically based on provided fields
    const updates = []

    if (user.full_name) updates.push(`full_name = ${user.full_name}`)
    if (user.email) updates.push(`email = ${user.email}`)
    if (user.address !== undefined) updates.push(`address = ${user.address}`)
    if (user.subscribe_newsletter !== undefined) updates.push(`subscribe_newsletter = ${user.subscribe_newsletter}`)
    if (user.last_contacted_date) updates.push(`last_contacted_date = ${user.last_contacted_date}`)
    if (user.last_contacted_event_id) updates.push(`last_contacted_event_id = ${user.last_contacted_event_id}`)
    if (user.last_contacted_event_name) updates.push(`last_contacted_event_name = ${user.last_contacted_event_name}`)

    if (updates.length === 0) {
      throw new Error("No fields to update")
    }

    const [updatedUser] = await sql<User[]>`
      UPDATE users
      SET ${sql.raw(updates.join(", "))}
      WHERE id = ${id}
      RETURNING id, full_name, email, address, subscribe_newsletter, signup_date, 
                last_contacted_date, last_contacted_event_id, last_contacted_event_name
    `

    return updatedUser
  } catch (error) {
    handleDbError(error, "update user")
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM users
      WHERE id = ${id}
    `
    return result.count > 0
  } catch (error) {
    handleDbError(error, "delete user")
  }
}

// Update user's last contacted information
export async function updateUserLastContacted(id: string, eventId: string, eventName: string): Promise<User> {
  try {
    const [updatedUser] = await sql<User[]>`
      UPDATE users
      SET last_contacted_date = NOW(),
          last_contacted_event_id = ${eventId},
          last_contacted_event_name = ${eventName}
      WHERE id = ${id}
      RETURNING id, full_name, email, address, subscribe_newsletter, signup_date, 
                last_contacted_date, last_contacted_event_id, last_contacted_event_name
    `

    return updatedUser
  } catch (error) {
    handleDbError(error, "update user last contacted")
  }
}

// Get newsletter subscribers
export async function getNewsletterSubscribers(): Promise<User[]> {
  try {
    const users = await sql<User[]>`
      SELECT id, full_name, email, address, subscribe_newsletter, signup_date, 
             last_contacted_date, last_contacted_event_id, last_contacted_event_name
      FROM users
      WHERE subscribe_newsletter = true
      ORDER BY signup_date DESC
    `
    return users
  } catch (error) {
    handleDbError(error, "fetch newsletter subscribers")
  }
}
