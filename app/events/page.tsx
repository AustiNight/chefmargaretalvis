import { getAllEvents } from "@/lib/db/events"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"

export default async function EventsPage() {
  const events = await getAllEvents()

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <Link href="/events/calendar" passHref>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar View</span>
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-muted-foreground">No events found. Check back soon for upcoming events!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={event.featured_image || "/placeholder.svg"}
                  alt={`Event on ${format(new Date(event.date), "MMMM d, yyyy")}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">{event.description.replace(/<[^>]*>/g, "")}</p>
                <div className="mt-4">
                  <Link href={`/events/${event.id}`} passHref>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
