"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getAllTestimonials } from "@/app/actions/testimonials"
import type { Testimonial } from "@/lib/db/testimonials"

interface TestimonialsProps {
  initialTestimonials?: Testimonial[]
}

export default function Testimonials({ initialTestimonials }: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials || [])
  const [loading, setLoading] = useState(!initialTestimonials)

  useEffect(() => {
    if (initialTestimonials) {
      return // Skip loading if we have initial data
    }

    async function loadTestimonials() {
      try {
        const data = await getAllTestimonials()
        setTestimonials(data)
      } catch (error) {
        console.error("Error loading testimonials:", error)
        // Fallback to empty array if database fetch fails
        setTestimonials([])
      } finally {
        setLoading(false)
      }
    }

    loadTestimonials()
  }, [initialTestimonials])

  if (loading) {
    return (
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null // Don't show the section if there are no testimonials
  }

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <p className="font-semibold">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
