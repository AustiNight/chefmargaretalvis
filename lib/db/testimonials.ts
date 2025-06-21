import { sql, handleDbError, checkDatabaseConnection } from "@/lib/db"

export type Testimonial = {
  id: string
  name: string
  text: string
  created_at?: string | Date
}

// Mock data to use when database is not available
const mockTestimonials = [
  {
    id: "1",
    name: "John Doe",
    text: "Chef Margaret's culinary creations are simply outstanding!",
    created_at: new Date("2023-10-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    text: "The private dinner Chef Margaret prepared for us was unforgettable.",
    created_at: new Date("2023-10-20"),
  },
  {
    id: "3",
    name: "Mike Johnson",
    text: "I learned so much in Chef Margaret's cooking class. Highly recommended!",
    created_at: new Date("2023-11-05"),
  },
]

// Get all testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for testimonials.")
      return mockTestimonials
    }

    const testimonials = await sql<Testimonial[]>`
      SELECT id, name, text, created_at
      FROM testimonials
      ORDER BY created_at DESC
    `

    return testimonials.map((testimonial) => ({
      ...testimonial,
      id: testimonial.id.toString(),
      created_at: new Date(testimonial.created_at),
    }))
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return mockTestimonials
  }
}

// Alias for getTestimonials for backward compatibility
export const getAllTestimonials = getTestimonials

// Get testimonial by ID
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for testimonials.")
      return mockTestimonials.find((testimonial) => testimonial.id === id) || null
    }

    const [testimonial] = await sql<Testimonial[]>`
      SELECT id, name, text, created_at
      FROM testimonials
      WHERE id = ${id}
    `
    return testimonial || null
  } catch (error) {
    handleDbError(error, "fetch testimonial")
    return null
  }
}

// Create a new testimonial
export async function createTestimonial(testimonial: Omit<Testimonial, "id" | "created_at">): Promise<Testimonial> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for testimonials.")
      const newTestimonial = {
        id: (mockTestimonials.length + 1).toString(),
        ...testimonial,
        created_at: new Date(),
      }
      mockTestimonials.push(newTestimonial)
      return newTestimonial
    }

    const [newTestimonial] = await sql<Testimonial[]>`
      INSERT INTO testimonials (name, text)
      VALUES (${testimonial.name}, ${testimonial.text})
      RETURNING id, name, text, created_at
    `
    return newTestimonial
  } catch (error) {
    handleDbError(error, "create testimonial")
    throw error
  }
}

// Update a testimonial
export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for testimonials.")
      const index = mockTestimonials.findIndex((testimonial) => testimonial.id === id)
      if (index === -1) {
        throw new Error("Testimonial not found")
      }
      const updatedTestimonial = {
        ...mockTestimonials[index],
        ...testimonial,
        created_at: new Date(mockTestimonials[index].created_at),
      }
      mockTestimonials[index] = updatedTestimonial
      return updatedTestimonial
    }

    const updates = []

    if (testimonial.name) updates.push(`name = ${testimonial.name}`)
    if (testimonial.text) updates.push(`text = ${testimonial.text}`)

    if (updates.length === 0) {
      throw new Error("No fields to update")
    }

    const [updatedTestimonial] = await sql<Testimonial[]>`
      UPDATE testimonials
      SET ${sql.raw(updates.join(", "))}
      WHERE id = ${id}
      RETURNING id, name, text, created_at
    `

    return updatedTestimonial
  } catch (error) {
    handleDbError(error, "update testimonial")
    throw error
  }
}

// Delete a testimonial
export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for testimonials.")
      const index = mockTestimonials.findIndex((testimonial) => testimonial.id === id)
      if (index !== -1) {
        mockTestimonials.splice(index, 1)
        return true
      }
      return false
    }

    const result = await sql`
      DELETE FROM testimonials
      WHERE id = ${id}
    `
    return result.count > 0
  } catch (error) {
    handleDbError(error, "delete testimonial")
    throw error
  }
}
