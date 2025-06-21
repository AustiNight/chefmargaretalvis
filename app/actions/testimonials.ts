"use server"

import { revalidatePath } from "next/cache"
import {
  getTestimonials,
  getTestimonialById as fetchTestimonialById,
  createTestimonial,
  updateTestimonial as updateTestimonialData,
  deleteTestimonial,
} from "@/lib/db/testimonials"
import type { Testimonial } from "@/lib/db/testimonials"

// Get all testimonials
export async function getAllTestimonials() {
  return getTestimonials()
}

// Get testimonial by ID
export async function getTestimonialById(id: string) {
  return fetchTestimonialById(id)
}

// Create a new testimonial
export async function addTestimonial(data: { name: string; text: string }) {
  try {
    const testimonial = await createTestimonial({
      name: data.name,
      text: data.text,
    })

    revalidatePath("/")
    revalidatePath("/home")

    return { success: true, testimonial }
  } catch (error) {
    console.error("Failed to add testimonial:", error)
    return { success: false, error: "Failed to add testimonial" }
  }
}

// Update a testimonial
export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  try {
    const testimonial = await updateTestimonialData(id, data)

    revalidatePath("/")
    revalidatePath("/home")

    return { success: true, testimonial }
  } catch (error) {
    console.error(`Failed to update testimonial ${id}:`, error)
    return { success: false, error: "Failed to update testimonial" }
  }
}

// Delete a testimonial
export async function removeTestimonial(id: string) {
  try {
    await deleteTestimonial(id)

    revalidatePath("/")
    revalidatePath("/home")

    return { success: true }
  } catch (error) {
    console.error(`Failed to delete testimonial ${id}:`, error)
    return { success: false, error: "Failed to delete testimonial" }
  }
}
