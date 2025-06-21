"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createId } from "@paralleldrive/cuid2"
import type { Event } from "@/types"

export async function getAllEventsAction() {
  try {
    const events = await sql<Event[]>`
      SELECT 
        e.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color
      FROM 
        events e
      LEFT JOIN 
        event_categories c ON e.category_id = c.id
      ORDER BY 
        e.date DESC
    `

    // Transform the results to include category object
    return events.map((event) => ({
      ...event,
      category: event.category_id
        ? {
            id: event.category_id,
            name: event.category_name,
            slug: event.category_slug,
            color: event.category_color,
          }
        : undefined,
    }))
  } catch (error) {
    console.error("Error fetching events:", error)
    throw new Error("Failed to fetch events")
  }
}

// Add the missing getEventsByCategoryAction function after getAllEventsAction

export async function getEventsByCategoryAction(categoryId: string) {
  try {
    const events = await sql<Event[]>`
      SELECT 
        e.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color
      FROM 
        events e
      LEFT JOIN 
        event_categories c ON e.category_id = c.id
      WHERE 
        e.category_id = ${categoryId}
      ORDER BY 
        e.date DESC
    `

    // Transform the results to include category object
    return events.map((event) => ({
      ...event,
      category: event.category_id
        ? {
            id: event.category_id,
            name: event.category_name,
            slug: event.category_slug,
            color: event.category_color,
          }
        : undefined,
    }))
  } catch (error) {
    console.error(`Error fetching events for category ${categoryId}:`, error)
    throw new Error("Failed to fetch events by category")
  }
}

export async function createEventAction(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const location = formData.get("location") as string
    const featured_image = formData.get("featured_image") as string
    const category_id = formData.has("category_id") ? (formData.get("category_id") as string) : null

    // Handle gallery images
    const galleryImages = formData.getAll("gallery_images") as string[]
    const gallery_images_json = galleryImages.length > 0 ? JSON.stringify(galleryImages) : null

    // Handle coordinates
    let coordinates_json = null
    const lat = formData.get("lat") as string
    const lng = formData.get("lng") as string

    if (lat && lng) {
      coordinates_json = JSON.stringify({ lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) })
    }

    const id = createId()

    const result = await sql`
      INSERT INTO events (
        id, 
        title, 
        description, 
        date, 
        time, 
        location, 
        coordinates,
        featured_image, 
        gallery_images,
        category_id,
        created_at, 
        updated_at
      ) 
      VALUES (
        ${id}, 
        ${title}, 
        ${description}, 
        ${date}, 
        ${time || null}, 
        ${location || null}, 
        ${coordinates_json}::jsonb,
        ${featured_image}, 
        ${gallery_images_json}::jsonb,
        ${category_id},
        NOW(), 
        NOW()
      )
      RETURNING *
    `

    revalidatePath("/admin/events")
    revalidatePath("/events")

    return {
      success: true,
      event: result[0],
    }
  } catch (error) {
    console.error("Error creating event:", error)
    return {
      success: false,
      error: "Failed to create event",
    }
  }
}

export async function updateEventAction(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const location = formData.get("location") as string
    const featured_image = formData.get("featured_image") as string
    const category_id = formData.has("category_id") ? (formData.get("category_id") as string) : null

    // Handle gallery images
    const galleryImages = formData.getAll("gallery_images") as string[]
    const gallery_images_json = galleryImages.length > 0 ? JSON.stringify(galleryImages) : null

    // Handle coordinates
    let coordinates_json = null
    const lat = formData.get("lat") as string
    const lng = formData.get("lng") as string

    if (lat && lng) {
      coordinates_json = JSON.stringify({ lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) })
    }

    const result = await sql`
      UPDATE events
      SET 
        title = ${title}, 
        description = ${description}, 
        date = ${date}, 
        time = ${time || null}, 
        location = ${location || null}, 
        coordinates = ${coordinates_json}::jsonb,
        featured_image = ${featured_image}, 
        gallery_images = ${gallery_images_json}::jsonb,
        category_id = ${category_id},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    revalidatePath("/admin/events")
    revalidatePath("/events")

    return {
      success: true,
      event: result[0],
    }
  } catch (error) {
    console.error("Error updating event:", error)
    return {
      success: false,
      error: "Failed to update event",
    }
  }
}

export async function deleteEventAction(id: string) {
  try {
    await sql`
      DELETE FROM events
      WHERE id = ${id}
    `

    revalidatePath("/admin/events")
    revalidatePath("/events")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting event:", error)
    return {
      success: false,
      error: "Failed to delete event",
    }
  }
}
