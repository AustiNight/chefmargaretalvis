import { Suspense } from "react"
import { getAllTestimonials } from "@/app/actions/testimonials"
import TestimonialForm from "@/components/TestimonialForm"
import TestimonialList from "@/components/TestimonialList"
import { Skeleton } from "@/components/ui/skeleton"

export default function TestimonialsAdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Testimonials</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Testimonial</h2>
            <TestimonialForm />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Existing Testimonials</h2>
            <Suspense fallback={<TestimonialListSkeleton />}>
              <TestimonialListWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

async function TestimonialListWrapper() {
  const testimonials = await getAllTestimonials()
  return <TestimonialList testimonials={testimonials} />
}

function TestimonialListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border p-4 rounded-md">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex justify-end space-x-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
