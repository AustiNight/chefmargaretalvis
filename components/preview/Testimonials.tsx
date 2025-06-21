"use client"

import { motion } from "framer-motion"

export default function Testimonials() {
  const testimonials = [
    { id: 1, name: "John Doe", text: "Chef Margaret's culinary creations are simply outstanding!" },
    { id: 2, name: "Jane Smith", text: "The private dinner Chef Margaret prepared for us was unforgettable." },
    { id: 3, name: "Mike Johnson", text: "I learned so much in Chef Margaret's cooking class. Highly recommended!" },
  ]

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
