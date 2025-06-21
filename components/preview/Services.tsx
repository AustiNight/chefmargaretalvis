"use client"

import { ChefHat, Users, Utensils, MessageSquare } from "lucide-react"

export default function Services() {
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
            <p>
              Experience a personalized dining experience in the comfort of your own home. I'll work with you to create
              a custom menu tailored to your preferences and dietary needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 mr-3 text-gray-700" />
              <h3 className="text-xl font-semibold">Cooking Classes</h3>
            </div>
            <p>
              Learn new culinary skills and techniques in a fun and interactive environment. Classes are available for
              all skill levels and can be customized to focus on specific cuisines or techniques.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Utensils className="w-8 h-8 mr-3 text-gray-700" />
              <h3 className="text-xl font-semibold">Catering</h3>
            </div>
            <p>
              From intimate gatherings to large events, I offer full-service catering with customized menus to suit your
              occasion. All dietary restrictions can be accommodated.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <MessageSquare className="w-8 h-8 mr-3 text-gray-700" />
              <h3 className="text-xl font-semibold">Consultation</h3>
            </div>
            <p>
              Need help planning a menu for a special occasion or want advice on kitchen organization? Book a
              consultation session to get professional culinary advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
