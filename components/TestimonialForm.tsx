"use client"

import type React from "react"

import { useState } from "react"
import { addTestimonial } from "@/app/actions/testimonials"
import { useToast } from "@/components/ui/use-toast"

export default function TestimonialForm() {
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim() || !text.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addTestimonial({ name, text })

      if (result.success) {
        toast({
          title: "Success",
          description: "Testimonial added successfully",
        })

        // Reset form
        setName("")
        setText("")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error adding testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to add testimonial",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
          Testimonial
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Share your experience..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add Testimonial"}
      </button>
    </form>
  )
}
