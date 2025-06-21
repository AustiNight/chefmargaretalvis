"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, PencilIcon, TrashIcon, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AdminEventsPreview() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const events = [
    {
      id: "1",
      image: "/placeholder.svg?height=600&width=1200",
      date: "2023-06-15",
      description: "Summer Gala Dinner",
    },
    {
      id: "2",
      image: "/placeholder.svg?height=600&width=1200",
      date: "2023-07-04",
      description: "Independence Day BBQ",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSendNotification = () => {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      alert("Notification sent to subscribers!")
    }, 1500)
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Event Management</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md relative mb-8">
        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="eventDate">Event Date</Label>
            <Input id="eventDate" type="date" required />
          </div>
          <div>
            <Label htmlFor="eventDescription">Event Description</Label>
            <Textarea id="eventDescription" required />
          </div>

          <div>
            <Label htmlFor="eventImage">Event Image</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <div className="space-y-1">
                <div className="flex justify-center">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Upload+Image"
                    alt="Upload preview"
                    width={400}
                    height={200}
                    className="rounded-md"
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <Button type="button">Upload Image</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="notifySubscribers" defaultChecked />
            <Label htmlFor="notifySubscribers">Notify subscribers about this event</Label>
          </div>

          <Button type="button">Create Event</Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Manage Existing Events</h2>

        <div className="space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="border-gray-200">
              {isEditing && event.id === "1" ? (
                <CardContent className="pt-6">
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor={`edit-date-${event.id}`}>Event Date</Label>
                      <Input id={`edit-date-${event.id}`} type="date" defaultValue={event.date} required />
                    </div>
                    <div>
                      <Label htmlFor={`edit-description-${event.id}`}>Event Description</Label>
                      <Textarea id={`edit-description-${event.id}`} defaultValue={event.description} required />
                    </div>
                    <div>
                      <Label htmlFor={`edit-image-${event.id}`}>Event Image</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <div className="space-y-1">
                          <div className="flex justify-center">
                            <Image
                              src={event.image || "/placeholder.svg"}
                              alt={event.description}
                              width={400}
                              height={200}
                              className="rounded-md"
                            />
                          </div>
                          <div className="flex justify-center mt-4">
                            <Button type="button">Change Image</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={() => setIsEditing(false)}>
                        Update Event
                      </Button>
                    </div>
                  </form>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{event.description}</CardTitle>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        {formatDate(event.date)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={handleSendNotification}
                        disabled={isSending}
                      >
                        <Mail className="h-4 w-4" />
                        {isSending ? "Sending..." : "Notify Subscribers"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => event.id === "1" && setIsEditing(true)}>
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.description}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
