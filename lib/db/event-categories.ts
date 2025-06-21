import { sql, handleDbError } from "../db"
import type { EventCategory } from "@/types"

// Get all event categories
export async function getAllEventCategories(): Promise<EventCategory[]> {
  try {
    const categories = await sql<EventCategory[]>`
      SELECT id, name, slug, description, color
      FROM event_categories
      ORDER BY name ASC
    `
    return categories
  } catch (error) {
    handleDbError(error, "fetch event categories")
  }
}

// Get event category by ID
export async function getEventCategoryById(id: string): Promise<EventCategory | null> {
  try {
    const [category] = await sql<EventCategory[]>`
      SELECT id, name, slug, description, color
      FROM event_categories
      WHERE id = ${id}
    `
    return category || null
  } catch (error) {
    handleDbError(error, "fetch event category")
  }
}

// Get event category by slug
export async function getEventCategoryBySlug(slug: string): Promise<EventCategory | null> {
  try {
    const [category] = await sql<EventCategory[]>`
      SELECT id, name, slug, description, color
      FROM event_categories
      WHERE slug = ${slug}
    `
    return category || null
  } catch (error) {
    handleDbError(error, "fetch event category by slug")
  }
}

// Create a new event category
export async function createEventCategory(category: Omit<EventCategory, "id">): Promise<EventCategory> {
  try {
    const [newCategory] = await sql<EventCategory[]>`
      INSERT INTO event_categories (name, slug, description, color)
      VALUES (${category.name}, ${category.slug}, ${category.description}, ${category.color})
      RETURNING id, name, slug, description, color
    `
    return newCategory
  } catch (error) {
    handleDbError(error, "create event category")
  }
}

// Update an event category
export async function updateEventCategory(id: string, category: Partial<EventCategory>): Promise<EventCategory> {
  try {
    // Build the SET clause dynamically based on provided fields
    const updates = []

    if (category.name) updates.push(`name = ${category.name}`)
    if (category.slug) updates.push(`slug = ${category.slug}`)
    if (category.description !== undefined) updates.push(`description = ${category.description}`)
    if (category.color !== undefined) updates.push(`color = ${category.color}`)

    if (updates.length === 0) {
      throw new Error("No fields to update")
    }

    const [updatedCategory] = await sql<EventCategory[]>`
      UPDATE event_categories
      SET ${sql.raw(updates.join(", "))}
      WHERE id = ${id}
      RETURNING id, name, slug, description, color
    `

    return updatedCategory
  } catch (error) {
    handleDbError(error, "update event category")
  }
}

// Delete an event category
export async function deleteEventCategory(id: string): Promise<boolean> {
  try {
    // First, update any events using this category to set category_id to null
    await sql`
      UPDATE events
      SET category_id = NULL
      WHERE category_id = ${id}
    `

    // Then delete the category
    const result = await sql`
      DELETE FROM event_categories
      WHERE id = ${id}
    `
    return result.count > 0
  } catch (error) {
    handleDbError(error, "delete event category")
  }
}
