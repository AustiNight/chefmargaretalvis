import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import type { Event } from "@/types"

// Get all events
export async function getEventsFromDB(): Promise<Event[]> {
  try {
    const events = await sql<Event[]>`
      SELECT id, image, date::text, description, created_at as "createdAt"
      FROM events
      ORDER BY date DESC
    `
    return events
  } catch (error) {
    console.error("Error fetching events from database:", error)
    return []
  }
}

// Get event by ID
export async function getEventByIdFromDB(id: string): Promise<Event | null> {
  try {
    const [event] = await sql<Event[]>`
      SELECT id, image, date::text, description, created_at as "createdAt"
      FROM events
      WHERE id = ${id}
    `
    return event || null
  } catch (error) {
    console.error("Error fetching event from database:", error)
    return null
  }
}

// Save a new event
export async function saveEventToDB(event: Omit<Event, "id" | "createdAt">): Promise<Event> {
  try {
    const id = uuidv4()
    const [newEvent] = await sql<Event[]>`
      INSERT INTO events (id, image, date, description)
      VALUES (${id}, ${event.image}, ${event.date}, ${event.description})
      RETURNING id, image, date::text, description, created_at as "createdAt"
    `
    return newEvent
  } catch (error) {
    console.error("Error saving event to database:", error)
    throw error
  }
}

// Update an existing event
export async function updateEventInDB(event: Event): Promise<Event> {
  try {
    const [updatedEvent] = await sql<Event[]>`
      UPDATE events
      SET image = ${event.image}, date = ${event.date}, description = ${event.description}
      WHERE id = ${event.id}
      RETURNING id, image, date::text, description, created_at as "createdAt"
    `
    return updatedEvent
  } catch (error) {
    console.error("Error updating event in database:", error)
    throw error
  }
}

// Delete an event
export async function deleteEventFromDB(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM events
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error("Error deleting event from database:", error)
    return false
  }
}
