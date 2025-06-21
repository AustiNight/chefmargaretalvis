"use server"

import {
  getAllEventCategories,
  getEventCategoryById,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
} from "@/lib/db/event-categories"
import { revalidatePath } from "next/cache"
import type { EventCategory } from "@/types"

export async function getAllEventCategoriesAction() {
  try {
    const categories = await getAllEventCategories()
    return categories
  } catch (error) {
    console.error("Error fetching event categories:", error)
    throw new Error("Failed to fetch event categories")
  }
}

export async function getEventCategoryByIdAction(id: string) {
  try {
    const category = await getEventCategoryById(id)
    return category
  } catch (error) {
    console.error(`Error fetching event category with ID ${id}:`, error)
    throw new Error("Failed to fetch event category")
  }
}

export async function createEventCategoryAction(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const color = formData.get("color") as string

    if (!name || !slug) {
      return {
        success: false,
        error: "Name and slug are required",
      }
    }

    const category = await createEventCategory({
      name,
      slug,
      description,
      color,
    })

    revalidatePath("/admin/events/categories")
    revalidatePath("/events")

    return {
      success: true,
      category,
    }
  } catch (error) {
    console.error("Error creating event category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create event category",
    }
  }
}

export async function updateEventCategoryAction(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const color = formData.get("color") as string

    if (!name || !slug) {
      return {
        success: false,
        error: "Name and slug are required",
      }
    }

    const updateData: Partial<EventCategory> = {
      name,
      slug,
      description,
      color,
    }

    const category = await updateEventCategory(id, updateData)

    revalidatePath("/admin/events/categories")
    revalidatePath("/events")

    return {
      success: true,
      category,
    }
  } catch (error) {
    console.error("Error updating event category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update event category",
    }
  }
}

export async function deleteEventCategoryAction(id: string) {
  try {
    const success = await deleteEventCategory(id)

    revalidatePath("/admin/events/categories")
    revalidatePath("/events")

    return {
      success,
    }
  } catch (error) {
    console.error("Error deleting event category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete event category",
    }
  }
}
