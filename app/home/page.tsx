import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { getAllEvents } from "@/lib/db/events"
import { getSiteSettings } from "@/lib/db/site-settings"
import { getTestimonials } from "@/lib/db/testimonials"
import EventList from "@/components/EventList"
import Services from "@/components/Services"
import Testimonials from "@/components/Testimonials"
import InstagramFeed from "@/components/InstagramFeed"
import SignUpButton from "@/components/SignUpButton"
import { Skeleton } from "@/components/ui/skeleton"
import { redirect } from "next/navigation"

// Loading component for Suspense fallback
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

export default async function HomePage() {
  // Fetch site settings with error handling
  let siteSettings
  try {
    siteSettings = await getSiteSettings()
  } catch (error) {
    console.error("Error fetching site settings:", error)
    // Use default values if there's an error
    siteSettings = {
      title: "Chef Margaret Alvis",
      description: "Private Chef Services in Oak Cliff, Texas",
      heroImage: "/chef-cooking.png",
    }
  }

  // Redirect to home page if necessary
  if (siteSettings.redirectToHome) {
    redirect("/")
  }

  // Redirect to another page if necessary
  redirect("/")

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh]">
        <Image
          src={siteSettings?.heroImage || "/chef-cooking.png"}
          alt={siteSettings?.title || "Chef Margaret Alvis"}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{siteSettings?.title || "Chef Margaret Alvis"}</h1>
            <p className="text-xl md:text-2xl">
              {siteSettings?.description || "Private Chef Services in Oak Cliff, Texas"}
            </p>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <Suspense fallback={<LoadingSection />}>
        <EventListSection />
      </Suspense>

      {/* Services Section */}
      <Suspense fallback={<LoadingSection />}>
        <ServicesSection siteSettings={siteSettings} />
      </Suspense>

      {/* Testimonials Section */}
      <Suspense fallback={<LoadingSection />}>
        <TestimonialsSection />
      </Suspense>

      {/* Instagram Feed Section */}
      <Suspense fallback={<LoadingSection />}>
        <InstagramSection />
      </Suspense>

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

      {/* Sign Up Button */}
      <SignUpButton />
    </div>
  )
}

// Separate components for Suspense boundaries with error handling
async function EventListSection() {
  try {
    const events = await getAllEvents()
    return <EventList events={events.slice(0, 3)} showViewAll={true} />
  } catch (error) {
    console.error("Error in EventListSection:", error)
    return (
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
        <p className="text-center text-gray-500">Unable to load events. Please try again later.</p>
      </div>
    )
  }
}

function ServicesSection({ siteSettings }) {
  return <Services initialServices={siteSettings?.services} />
}

async function TestimonialsSection() {
  try {
    const testimonials = await getTestimonials()
    return <Testimonials initialTestimonials={testimonials} />
  } catch (error) {
    console.error("Error in TestimonialsSection:", error)
    return (
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h2>
        <p className="text-center text-gray-500">Unable to load testimonials. Please try again later.</p>
      </div>
    )
  }
}

function InstagramSection() {
  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Instagram</h2>
      <InstagramFeed limit={3} showViewAll={true} />
    </section>
  )
}
