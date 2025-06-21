import { getEventById } from "@/lib/db/events"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImageGallery } from "@/components/ImageGallery"
import LocationMap from "@/components/LocationMap"

interface EventPageProps {
  params: {
    id: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/events" className="flex items-center text-muted-foreground mb-6 hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-4">
            {event.category && (
              <Badge style={{ backgroundColor: event.category.color || undefined }} className="text-white">
                {event.category.name}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-col space-y-2 mb-6 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
            </div>

            {event.time && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{event.time}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: event.description }} />

          {/* Location Map */}
          {(event.location || event.coordinates) && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <LocationMap
                address={event.location}
                coordinates={event.coordinates}
                title={event.title}
                interactive={true}
                height="400px"
                zoom={15}
              />
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-8">
            {event.gallery_images && event.gallery_images.length > 0 ? (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Event Gallery</h2>
                <ImageGallery images={[event.featured_image as string, ...event.gallery_images]} alt={event.title} />
              </div>
            ) : (
              <div className="relative aspect-video mb-6">
                <Image
                  src={(event.featured_image as string) || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <Button className="w-full">Register for Event</Button>
                <Link href="/contact" passHref>
                  <Button variant="outline" className="w-full">
                    Contact Organizer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
