"use client"

import { useState } from "react"
import { ChefHat, Users, Utensils, MessageSquare } from "lucide-react"

type ServicesProps = {
  initialServices?: {
    privateDinnerDescription: string
    cookingClassDescription: string
    cateringDescription: string
    consultationDescription: string
  }
}

export default function Services({ initialServices }: ServicesProps) {
  const [services, setServices] = useState({
    privateDinnerDescription: initialServices?.privateDinnerDescription || "",
    cookingClassDescription: initialServices?.cookingClassDescription || "",
    cateringDescription: initialServices?.cateringDescription || "",
    consultationDescription: initialServices?.consultationDescription || "",
  })

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <ChefHat className="w-8 h-8 mr-3 text-gray-700" />
              <h3 className="text-xl font-semibold">Private Dinners</h3>
            </div>
            <p>{services.privateDinnerDescription}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 mr-3 text-gray-700" />
              <h3 className="text-xl font-semibold">Cooking Classes</h3>
            </div>
            <p>{services.cookingClassDescription}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Utensils className="w-8 h-8 mr-3 text-gray-700" />
              <h3 className="text-xl font-semibold">Catering</h3>
            </div>
            <p>{services.cateringDescription}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <MessageSquare className="w-8 h-8 mr-3 text-gray-700" />
              <h3 className="text-xl font-semibold">Consultation</h3>
            </div>
            <p>{services.consultationDescription}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
