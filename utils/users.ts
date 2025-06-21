import { v4 as uuidv4 } from "uuid"
import type { User, NotificationHistory } from "@/types"

// Get all users
export function getUsers(): User[] {
  if (typeof window === "undefined") {
    return []
  }

  const storedUsers = localStorage.getItem("users")
  if (!storedUsers) {
    return []
  }

  try {
    return JSON.parse(storedUsers) as User[]
  } catch (error) {
    console.error("Error parsing users:", error)
    return []
  }
}

// Save a new user
export function saveUser(userData: Omit<User, "id" | "signupDate">): User {
  const newUser: User = {
    ...userData,
    id: uuidv4(),
    signupDate: new Date().toISOString(),
  }

  const users = getUsers()

  // Check if user with this email already exists
  const existingUserIndex = users.findIndex((user) => user.email.toLowerCase() === newUser.email.toLowerCase())

  if (existingUserIndex >= 0) {
    // Update existing user
    users[existingUserIndex] = {
      ...users[existingUserIndex],
      fullName: newUser.fullName,
      address: newUser.address,
      subscribeNewsletter: newUser.subscribeNewsletter,
    }
  } else {
    // Add new user
    users.push(newUser)
  }

  localStorage.setItem("users", JSON.stringify(users))
  return newUser
}

// Update an existing user
export function updateUser(user: User): void {
  const users = getUsers()
  const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
  localStorage.setItem("users", JSON.stringify(updatedUsers))
}

// Delete a user
export function deleteUser(id: string): void {
  const users = getUsers()
  const updatedUsers = users.filter((u) => u.id !== id)
  localStorage.setItem("users", JSON.stringify(updatedUsers))
}

// Get notification history
export function getNotificationHistory(): NotificationHistory[] {
  if (typeof window === "undefined") {
    return []
  }

  const storedHistory = localStorage.getItem("notificationHistory")
  if (!storedHistory) {
    return []
  }

  try {
    return JSON.parse(storedHistory) as NotificationHistory[]
  } catch (error) {
    console.error("Error parsing notification history:", error)
    return []
  }
}

// Save notification record
export function saveNotification(notification: Omit<NotificationHistory, "id">): NotificationHistory {
  const newNotification: NotificationHistory = {
    ...notification,
    id: uuidv4(),
  }

  const history = getNotificationHistory()
  history.push(newNotification)
  localStorage.setItem("notificationHistory", JSON.stringify(history))

  return newNotification
}

// Update user's last contacted information
export function updateUserContactInfo(userId: string, eventId: string, eventName: string): void {
  const users = getUsers()
  const updatedUsers = users.map((user) => {
    if (user.id === userId) {
      return {
        ...user,
        lastContactedDate: new Date().toISOString(),
        lastContactedEventId: eventId,
        lastContactedEventName: eventName,
      }
    }
    return user
  })

  localStorage.setItem("users", JSON.stringify(updatedUsers))
}

// Get users by IDs
export function getUsersByIds(ids: string[]): User[] {
  const users = getUsers()
  return users.filter((user) => ids.includes(user.id))
}
