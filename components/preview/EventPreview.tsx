"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Share2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventPreview() {
  const events = [
    {
      id: "1",
      image: "/placeholder.svg?height=600&width=1200",
      date: "2023-06-15",
      description: "Summer Gala Dinner",
    },
    {
      id: "2",
      image: "/placeholder.svg?height=600&width=1200",
      date: "2023-07-04",
      description: "Independence Day BBQ",
    },
  ]

  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>

      {events.map((event) => (
        <motion.div
          key={event.id}
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.description}
            width={1200}
            height={600}
            className="rounded-lg shadow-lg"
          />
          <div className="mt-4">
            <h3 className="text-xl font-semibold">{event.description}</h3>
            <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
            <div className="mt-2 space-x-2">
              <Button variant="outline" className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Save to Calendar
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  )
}
