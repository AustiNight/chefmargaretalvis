import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import type { User, NotificationHistory } from "@/types"

// Get all users
export async function getUsersFromDB(): Promise<User[]> {
  try {
    const users = await sql<User[]>`
      SELECT 
        id, 
        full_name as "fullName", 
        email, 
        address, 
        subscribe_newsletter as "subscribeNewsletter", 
        signup_date as "signupDate", 
        last_contacted_date as "lastContactedDate", 
        last_contacted_event_id as "lastContactedEventId", 
        last_contacted_event_name as "lastContactedEventName"
      FROM users
      ORDER BY signup_date DESC
    `
    return users
  } catch (error) {
    console.error("Error fetching users from database:", error)
    return []
  }
}

// Get user by ID
export async function getUserByIdFromDB(id: string): Promise<User | null> {
  try {
    const [user] = await sql<User[]>`
      SELECT 
        id, 
        full_name as "fullName", 
        email, 
        address, 
        subscribe_newsletter as "subscribeNewsletter", 
        signup_date as "signupDate", 
        last_contacted_date as "lastContactedDate", 
        last_contacted_event_id as "lastContactedEventId", 
        last_contacted_event_name as "lastContactedEventName"
      FROM users
      WHERE id = ${id}
    `
    return user || null
  } catch (error) {
    console.error("Error fetching user from database:", error)
    return null
  }
}

// Get user by email
export async function getUserByEmailFromDB(email: string): Promise<User | null> {
  try {
    const [user] = await sql<User[]>`
      SELECT 
        id, 
        full_name as "fullName", 
        email, 
        address, 
        subscribe_newsletter as "subscribeNewsletter", 
        signup_date as "signupDate", 
        last_contacted_date as "lastContactedDate", 
        last_contacted_event_id as "lastContactedEventId", 
        last_contacted_event_name as "lastContactedEventName"
      FROM users
      WHERE email = ${email}
    `
    return user || null
  } catch (error) {
    console.error("Error fetching user from database:", error)
    return null
  }
}

// Save a new user
export async function saveUserToDB(userData: Omit<User, "id" | "signupDate">): Promise<User> {
  try {
    // Check if user with this email already exists
    const existingUser = await getUserByEmailFromDB(userData.email)

    if (existingUser) {
      // Update existing user
      const [updatedUser] = await sql<User[]>`
        UPDATE users
        SET 
          full_name = ${userData.fullName},
          address = ${userData.address},
          subscribe_newsletter = ${userData.subscribeNewsletter}
        WHERE id = ${existingUser.id}
        RETURNING 
          id, 
          full_name as "fullName", 
          email, 
          address, 
          subscribe_newsletter as "subscribeNewsletter", 
          signup_date as "signupDate", 
          last_contacted_date as "lastContactedDate", 
          last_contacted_event_id as "lastContactedEventId", 
          last_contacted_event_name as "lastContactedEventName"
      `
      return updatedUser
    } else {
      // Add new user
      const id = uuidv4()
      const [newUser] = await sql<User[]>`
        INSERT INTO users (id, full_name, email, address, subscribe_newsletter)
        VALUES (${id}, ${userData.fullName}, ${userData.email}, ${userData.address}, ${userData.subscribeNewsletter})
        RETURNING 
          id, 
          full_name as "fullName", 
          email, 
          address, 
          subscribe_newsletter as "subscribeNewsletter", 
          signup_date as "signupDate", 
          last_contacted_date as "lastContactedDate", 
          last_contacted_event_id as "lastContactedEventId", 
          last_contacted_event_name as "lastContactedEventName"
      `
      return newUser
    }
  } catch (error) {
    console.error("Error saving user to database:", error)
    throw error
  }
}

// Update an existing user
export async function updateUserInDB(user: User): Promise<User> {
  try {
    const [updatedUser] = await sql<User[]>`
      UPDATE users
      SET 
        full_name = ${user.fullName},
        email = ${user.email},
        address = ${user.address},
        subscribe_newsletter = ${user.subscribeNewsletter},
        last_contacted_date = ${user.lastContactedDate},
        last_contacted_event_id = ${user.lastContactedEventId},
        last_contacted_event_name = ${user.lastContactedEventName}
      WHERE id = ${user.id}
      RETURNING 
        id, 
        full_name as "fullName", 
        email, 
        address, 
        subscribe_newsletter as "subscribeNewsletter", 
        signup_date as "signupDate", 
        last_contacted_date as "lastContactedDate", 
        last_contacted_event_id as "lastContactedEventId", 
        last_contacted_event_name as "lastContactedEventName"
    `
    return updatedUser
  } catch (error) {
    console.error("Error updating user in database:", error)
    throw error
  }
}

// Delete a user
export async function deleteUserFromDB(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error("Error deleting user from database:", error)
    return false
  }
}

// Get users by IDs
export async function getUsersByIdsFromDB(ids: string[]): Promise<User[]> {
  if (ids.length === 0) return []

  try {
    const users = await sql<User[]>`
      SELECT 
        id, 
        full_name as "fullName", 
        email, 
        address, 
        subscribe_newsletter as "subscribeNewsletter", 
        signup_date as "signupDate", 
        last_contacted_date as "lastContactedDate", 
        last_contacted_event_id as "lastContactedEventId", 
        last_contacted_event_name as "lastContactedEventName"
      FROM users
      WHERE id IN ${sql(ids)}
    `
    return users
  } catch (error) {
    console.error("Error fetching users by IDs from database:", error)
    return []
  }
}

// Update user's last contacted information
export async function updateUserContactInfoInDB(userId: string, eventId: string, eventName: string): Promise<boolean> {
  try {
    await sql`
      UPDATE users
      SET 
        last_contacted_date = NOW(),
        last_contacted_event_id = ${eventId},
        last_contacted_event_name = ${eventName}
      WHERE id = ${userId}
    `
    return true
  } catch (error) {
    console.error("Error updating user contact info in database:", error)
    return false
  }
}

// Get notification history
export async function getNotificationHistoryFromDB(): Promise<NotificationHistory[]> {
  try {
    const history = await sql<NotificationHistory[]>`
      SELECT 
        id, 
        user_id as "userId", 
        event_id as "eventId", 
        event_name as "eventName", 
        sent_date as "sentDate", 
        status
      FROM notification_history
      ORDER BY sent_date DESC
    `
    return history
  } catch (error) {
    console.error("Error fetching notification history from database:", error)
    return []
  }
}

// Save notification record
export async function saveNotificationToDB(
  notification: Omit<NotificationHistory, "id">,
): Promise<NotificationHistory> {
  try {
    const id = uuidv4()
    const [newNotification] = await sql<NotificationHistory[]>`
      INSERT INTO notification_history (id, user_id, event_id, event_name, status)
      VALUES (${id}, ${notification.userId}, ${notification.eventId}, ${notification.eventName}, ${notification.status})
      RETURNING 
        id, 
        user_id as "userId", 
        event_id as "eventId", 
        event_name as "eventName", 
        sent_date as "sentDate", 
        status
    `
    return newNotification
  } catch (error) {
    console.error("Error saving notification to database:", error)
    throw error
  }
}
