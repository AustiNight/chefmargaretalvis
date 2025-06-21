import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// Simple loading component for Suspense fallback
function LoadingSection() {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-6">
        <Skeleton className="h-8 w-48 mb-8 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh]">
        <Image src="/chef-cooking.png" alt="Chef Margaret Alvis" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Chef Margaret Alvis</h1>
            <p className="text-xl md:text-2xl">Private Chef Services in Oak Cliff, Texas</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="w-full bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Private Dinners</h3>
              <p className="text-gray-600">Enjoy a restaurant-quality dining experience in the comfort of your home.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Cooking Classes</h3>
              <p className="text-gray-600">
                Learn new culinary skills with hands-on cooking classes for all skill levels.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Special Events</h3>
              <p className="text-gray-600">Make your special occasion memorable with custom catering services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-gray-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Culinary Experience?</h2>
          <p className="text-lg mb-6">Contact Chef Margaret today to discuss your event or book a service.</p>
          <Link href="/contact" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Contact Now
          </Link>
        </div>
      </section>
    </div>
  )
}
