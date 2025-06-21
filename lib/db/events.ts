import { sql, checkDatabaseConnection } from "@/lib/db"
import type { Event } from "@/types"
import { getEventCategoryById } from "./event-categories" // Fixed import path

// Function to format date for SQL
function formatDateForSQL(date: Date): string {
  return date.toISOString().split("T")[0]
}

// Mock data to use when database is not available
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Cooking Class: Italian Cuisine",
    description: "Learn to cook authentic Italian dishes with Chef Margaret.",
    date: new Date("2023-12-15"),
    time: "6:00 PM - 9:00 PM",
    location: "Oak Cliff Community Center",
    featured_image: "/cooking-class.png",
    created_at: new Date("2023-11-01"),
  },
  {
    id: "2",
    title: "Private Dinner Experience",
    description: "Enjoy a customized fine dining experience in your home.",
    date: new Date("2023-12-20"),
    time: "7:00 PM - 10:00 PM",
    location: "Client's Residence",
    featured_image: "/private-dinner.png",
    created_at: new Date("2023-11-05"),
  },
  {
    id: "3",
    title: "Holiday Cooking Workshop",
    description: "Special holiday-themed cooking workshop for festive meals.",
    date: new Date("2023-12-10"),
    time: "2:00 PM - 5:00 PM",
    location: "Oak Cliff Culinary Studio",
    featured_image: "/holiday-cooking.png",
    created_at: new Date("2023-11-10"),
  },
]

// Get all events with categories
export async function getAllEvents(): Promise<Event[]> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for events.")
      return mockEvents
    }

    const events = await sql`
      SELECT 
        id, title, description, date, time, location, 
        COALESCE(featured_image, image) as featured_image, 
        created_at, lat, lng, 
        gallery_images, category_id
      FROM events 
      ORDER BY date DESC
    `

    return events.map((event) => ({
      ...event,
      id: event.id.toString(),
      date: new Date(event.date),
      created_at: new Date(event.created_at),
    }))
  } catch (error) {
    console.error("Error fetching events:", error)
    return mockEvents
  }
}

// Get upcoming events
export async function getUpcomingEvents(limit = 3): Promise<Event[]> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for events.")
      return mockEvents.filter((event) => event.date >= new Date()).slice(0, limit)
    }

    const events = await sql`
      SELECT 
        id, title, description, date, time, location, 
        COALESCE(featured_image, image) as featured_image, 
        created_at, lat, lng, 
        gallery_images, category_id
      FROM events 
      WHERE date >= CURRENT_DATE
      ORDER BY date ASC
      LIMIT ${limit}
    `

    return events.map((event) => ({
      ...event,
      id: event.id.toString(),
      date: new Date(event.date),
      created_at: new Date(event.created_at),
    }))
  } catch (error) {
    console.error("Error fetching upcoming events:", error)
    return mockEvents.filter((event) => event.date >= new Date()).slice(0, limit)
  }
}

// Get events by category
export async function getEventsByCategory(categoryId: string): Promise<Event[]> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for events.")
      return mockEvents.filter((event) => event.category_id === categoryId)
    }

    const events = await sql`
      SELECT 
        id, title, description, date, time, location, 
        COALESCE(featured_image, image) as featured_image, 
        created_at, lat, lng, 
        gallery_images, category_id
      FROM events 
      WHERE category_id = ${categoryId}
      ORDER BY date DESC
    `

    return events.map((event) => ({
      ...event,
      id: event.id.toString(),
      date: new Date(event.date),
      created_at: new Date(event.created_at),
    }))
  } catch (error) {
    console.error("Error fetching events by category:", error)
    return mockEvents.filter((event) => event.category_id === categoryId)
  }
}

// Get event by ID
export async function getEventById(id: string): Promise<Event | null> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for events.")
      return mockEvents.find((event) => event.id === id) || null
    }

    const [event] = await sql`
      SELECT 
        id, title, description, date, time, location, 
        COALESCE(featured_image, image) as featured_image, 
        created_at, lat, lng, 
        gallery_images, category_id
      FROM events 
      WHERE id = ${id}
    `

    if (!event) return null

    // Process the result to properly structure coordinates
    const { lat, lng, ...rest } = event
    const processedEvent = {
      ...rest,
      id: event.id.toString(),
      date: new Date(event.date),
      created_at: new Date(event.created_at),
      coordinates: lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined,
    }

    // If there's a category_id, fetch the category details
    if (processedEvent.category_id) {
      const category = await getEventCategoryById(processedEvent.category_id)
      return { ...processedEvent, category }
    }

    return processedEvent
  } catch (error) {
    console.error("Error fetching event:", error)
    return null
  }
}

// Create a new event
export async function createEvent(event: Omit<Event, "id" | "created_at" | "updated_at">): Promise<Event> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for events.")
      const newEvent = { ...event, id: (mockEvents.length + 1).toString(), created_at: new Date() }
      mockEvents.push(newEvent)
      return newEvent
    }

    // Format the date for SQL
    const formattedDate = formatDateForSQL(event.date)

    // Insert into both image and featured_image columns to handle the constraint
    const [newEvent] = await sql`
      INSERT INTO events (
        title, description, date, time, location, 
        image, featured_image, gallery_images, category_id,
        lat, lng
      )
      VALUES (
        ${event.title}, ${event.description}, ${formattedDate}, 
        ${event.time || null}, ${event.location || null}, 
        ${event.featured_image}, ${event.featured_image}, ${event.gallery_images || null}, ${event.category_id || null},
        ${event.coordinates?.lat || null}, ${event.coordinates?.lng || null}
      )
      RETURNING id, title, description, date, time, location, 
                COALESCE(featured_image, image) as featured_image, 
                gallery_images, category_id, created_at, updated_at,
                lat, lng
    `

    // Process the result to properly structure coordinates
    const { lat, lng, ...rest } = newEvent
    const processedEvent = {
      ...rest,
      id: newEvent.id.toString(),
      date: new Date(newEvent.date),
      created_at: new Date(newEvent.created_at),
      coordinates: lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined,
    }

    // If there's a category_id, fetch the category details
    if (processedEvent.category_id) {
      const category = await getEventCategoryById(processedEvent.category_id)
      return { ...processedEvent, category }
    }

    return processedEvent
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

// Update an event
export async function updateEvent(id: string, event: Partial<Event>): Promise<Event> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for events.")
      const index = mockEvents.findIndex((e) => e.id === id)
      if (index === -1) throw new Error("Event not found")
      const updatedEvent = { ...mockEvents[index], ...event }
      mockEvents[index] = updatedEvent
      return updatedEvent
    }

    // Build the SET clause dynamically based on provided fields
    const updates = []

    if (event.title) updates.push(`title = ${event.title}`)
    if (event.description !== undefined) updates.push(`description = ${event.description}`)
    if (event.date) {
      // Format the date for SQL
      const formattedDate = formatDateForSQL(event.date)
      updates.push(`date = ${formattedDate}`)
    }
    if (event.time !== undefined) updates.push(`time = ${event.time}`)
    if (event.location !== undefined) updates.push(`location = ${event.location}`)
    if (event.featured_image) {
      updates.push(`featured_image = ${event.featured_image}`)
      updates.push(`image = ${event.featured_image}`) // Update both columns
    }
    if (event.gallery_images) updates.push(`gallery_images = ${event.gallery_images}`)
    if (event.category_id !== undefined) updates.push(`category_id = ${event.category_id}`)

    // Add coordinates updates
    if (event.coordinates) {
      updates.push(`lat = ${event.coordinates.lat}`)
      updates.push(`lng = ${event.coordinates.lng}`)
    } else if (event.coordinates === null) {
      updates.push(`lat = NULL`)
      updates.push(`lng = NULL`)
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`)

    if (updates.length === 0) {
      throw new Error("No fields to update")
    }

    const [updatedEvent] = await sql`
      UPDATE events
      SET ${sql.raw(updates.join(", "))}
      WHERE id = ${id}
      RETURNING id, title, description, date, time, location, 
                COALESCE(featured_image, image) as featured_image, 
                gallery_images, category_id, created_at, updated_at,
                lat, lng
    `

    // Process the result to properly structure coordinates
    const { lat, lng, ...rest } = updatedEvent
    const processedEvent = {
      ...rest,
      id: updatedEvent.id.toString(),
      date: new Date(updatedEvent.date),
      created_at: new Date(updatedEvent.created_at),
      coordinates: lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined,
    }

    // If there's a category_id, fetch the category details
    if (processedEvent.category_id) {
      const category = await getEventCategoryById(processedEvent.category_id)
      return { ...processedEvent, category }
    }

    return processedEvent
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

// Delete an event
export async function deleteEvent(id: string): Promise<boolean> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for events.")
      const index = mockEvents.findIndex((e) => e.id === id)
      if (index !== -1) {
        mockEvents.splice(index, 1)
        return true
      }
      return false
    }

    const result = await sql`
      DELETE FROM events
      WHERE id = ${id}
    `
    return result.count > 0
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}
