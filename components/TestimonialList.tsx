"use client"

import { useState } from "react"
import { updateTestimonial, removeTestimonial } from "@/app/actions/testimonials"
import { useToast } from "@/components/ui/use-toast"
import type { Testimonial } from "@/lib/db/testimonials"
import { Pencil, Trash2, X, Check } from "lucide-react"

type TestimonialListProps = {
  testimonials: Testimonial[]
}

export default function TestimonialList({ testimonials }: TestimonialListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editText, setEditText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  function startEditing(testimonial: Testimonial) {
    setEditingId(testimonial.id)
    setEditName(testimonial.name)
    setEditText(testimonial.text)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditName("")
    setEditText("")
  }

  async function handleUpdate(id: string) {
    if (!editName.trim() || !editText.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateTestimonial(id, { name: editName, text: editText })

      if (result.success) {
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        })
        cancelEditing()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error updating testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await removeTestimonial(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (testimonials.length === 0) {
    return <p className="text-gray-500 italic">No testimonials found.</p>
  }

  return (
    <div className="space-y-4">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="border p-4 rounded-md">
          {editingId === testimonial.id ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={cancelEditing}
                  className="px-3 py-1 border border-gray-300 rounded-md flex items-center"
                  disabled={isSubmitting}
                >
                  <X size={16} className="mr-1" /> Cancel
                </button>
                <button
                  onClick={() => handleUpdate(testimonial.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md flex items-center"
                  disabled={isSubmitting}
                >
                  <Check size={16} className="mr-1" /> Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-semibold">{testimonial.name}</h3>
              <p className="my-2">{testimonial.text}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => startEditing(testimonial)}
                  className="px-3 py-1 border border-gray-300 rounded-md flex items-center"
                  disabled={isSubmitting}
                >
                  <Pencil size={16} className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md flex items-center"
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
