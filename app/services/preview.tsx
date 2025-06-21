"use client"

import { ChefHat, Users, Utensils, MessageSquare } from "lucide-react"

export default function ServicesPreview() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Services</h1>
      <p className="text-lg mb-8">
        Chef Margaret offers a variety of culinary services to meet your needs. From private dinners to cooking classes,
        catering, and consultations, she brings her expertise and passion to every event.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <ChefHat className="w-8 h-8 mr-3 text-gray-700" />
            <h3 className="text-xl font-semibold">Private Dinners</h3>
          </div>
          <p className="mb-4">
            Experience a personalized dining experience in the comfort of your own home. I'll work with you to create a
            custom menu tailored to your preferences and dietary needs.
          </p>
          <p className="mb-4">
            Each private dinner includes menu planning, grocery shopping, cooking, serving, and cleanup. You just relax
            and enjoy a restaurant-quality meal with your guests.
          </p>
          <p>
            <strong>Pricing:</strong> Starting at $150 per person (minimum 4 guests)
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 mr-3 text-gray-700" />
            <h3 className="text-xl font-semibold">Cooking Classes</h3>
          </div>
          <p className="mb-4">
            Learn new culinary skills and techniques in a fun and interactive environment. Classes are available for all
            skill levels and can be customized to focus on specific cuisines or techniques.
          </p>
          <p className="mb-4">
            Classes can be held in your home or at a venue of your choice. All ingredients and equipment are provided,
            and you'll get to enjoy the delicious food you prepare.
          </p>
          <p>
            <strong>Pricing:</strong> Group classes from $75 per person, private classes from $300
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Utensils className="w-8 h-8 mr-3 text-gray-700" />
            <h3 className="text-xl font-semibold">Catering</h3>
          </div>
          <p className="mb-4">
            From intimate gatherings to large events, I offer full-service catering with customized menus to suit your
            occasion. All dietary restrictions can be accommodated.
          </p>
          <p className="mb-4">
            Catering services include menu planning, food preparation, delivery, setup, service, and cleanup. I work
            closely with you to create a memorable culinary experience for your guests.
          </p>
          <p>
            <strong>Pricing:</strong> Custom quotes based on event size, menu complexity, and service requirements
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-8 h-8 mr-3 text-gray-700" />
            <h3 className="text-xl font-semibold">Consultation</h3>
          </div>
          <p className="mb-4">
            Need help planning a menu for a special occasion or want advice on kitchen organization? Book a consultation
            session to get professional culinary advice.
          </p>
          <p className="mb-4">
            Consultations can cover menu planning, kitchen setup, equipment recommendations, or general cooking advice.
            Sessions can be conducted in person or virtually.
          </p>
          <p>
            <strong>Pricing:</strong> $75 per hour
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Booking Information</h2>
        <p className="mb-4">
          To inquire about availability or to book any of these services, please visit the Contact page or call (555)
          123-4567.
        </p>
        <p className="mb-4">
          A 50% deposit is required to secure your booking, with the balance due on the day of service. Cancellations
          made less than 48 hours before the scheduled service are subject to a cancellation fee.
        </p>
        <p>
          All services are available in the Oak Cliff area and throughout the Dallas-Fort Worth metroplex. Travel fees
          may apply for locations outside of this area.
        </p>
      </div>
    </div>
  )
}
