"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEventsByCategoryAction } from "@/app/actions/events"

export default function EventList({ events = [], showViewAll = false, categoryFilter = false }) {
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Extract unique categories from events
  const categories = events.reduce((acc, event) => {
    if (event.category && !acc.some((cat) => cat.id === event.category.id)) {
      acc.push(event.category)
    }
    return acc
  }, [])

  const handleCategoryFilter = async (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
      setFilteredEvents(events)
      return
    }

    setIsLoading(true)
    setSelectedCategory(categoryId)

    try {
      const categoryEvents = await getEventsByCategoryAction(categoryId)
      setFilteredEvents(categoryEvents)
    } catch (error) {
      console.error("Error filtering events by category:", error)
      // Fallback to client-side filtering if server action fails
      const filtered = events.filter((event) => event.category && event.category.id === categoryId)
      setFilteredEvents(filtered)
    } finally {
      setIsLoading(false)
    }
  }

  const displayEvents = filteredEvents.length > 0 ? filteredEvents : events

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Upcoming Events</h2>

          {categoryFilter && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="group">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={event.image || "/community-event.png"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {event.category && <Badge className="absolute top-2 right-2 z-10">{event.category.name}</Badge>}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{event.title}</h3>
                    <div className="flex items-center text-gray-500 mb-2">
                      <Calendar size={16} className="mr-2" />
                      <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center text-gray-500 mb-2">
                      <Clock size={16} className="mr-2" />
                      <span>{event.time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-500">
                        <MapPin size={16} className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found.</p>
          </div>
        )}

        {showViewAll && events.length > 3 && (
          <div className="mt-8 text-center">
            <Link href="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
