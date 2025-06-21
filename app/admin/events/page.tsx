"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/layouts/AdminLayout"
import PageHeader from "@/components/admin/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import ImageUploader from "@/components/ImageUploader"
import AdminEventForm from "@/components/AdminEventForm"
import { getAllEvents } from "@/lib/db/events"
import { updateEventAction, deleteEventAction } from "@/app/actions/events"
import { getNewsletterSubscribersAction, updateUserLastContactedAction } from "@/app/actions/users"
import Link from "next/link"
import Image from "next/image"
import {
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  Mail,
  PlusCircle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Event } from "@/types"

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load events on component mount
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const allEvents = await getAllEvents()
      // Sort by date, earliest first
      allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setEvents(allEvents)
    } catch (error) {
      console.error("Error loading events:", error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent({ ...event })
  }

  const handleCancelEdit = () => {
    setEditingEvent(null)
  }

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingEvent) return

    setIsUpdating(true)

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("image", editingEvent.image as string)
      formData.append("date", editingEvent.date as string)
      formData.append("description", editingEvent.description)

      const result = await updateEventAction(editingEvent.id, formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      await loadEvents()
      toast({
        title: "Event updated",
        description: "The event has been updated successfully.",
      })
      setEditingEvent(null)
    } catch (error) {
      console.error("Error updating event:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        const result = await deleteEventAction(id)

        if (!result.success) {
          throw new Error(result.error)
        }

        await loadEvents()
        toast({
          title: "Event deleted",
          description: "The event has been deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting event:", error)
        toast({
          title: "Error",
          description: "There was a problem deleting the event. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSendEventNotification = async (event: Event) => {
    setIsSending(true)

    try {
      // Get all subscribed users
      const subscribedUsers = await getNewsletterSubscribersAction()

      if (subscribedUsers.length === 0) {
        toast({
          title: "No subscribers",
          description: "There are no subscribers to notify about this event.",
        })
        return
      }

      toast({
        title: "Sending notifications",
        description: `Notifying ${subscribedUsers.length} subscribers about this event...`,
      })

      // Update last contacted info for each subscriber
      const updatePromises = subscribedUsers.map((user) =>
        updateUserLastContactedAction(user.id, event.id, event.description),
      )

      await Promise.all(updatePromises)

      toast({
        title: "Notifications sent",
        description: `Successfully notified ${subscribedUsers.length} subscribers.`,
      })

      // Refresh events to update any changes
      await loadEvents()
    } catch (error) {
      console.error("Error sending notifications:", error)
      toast({
        title: "Error",
        description: "There was a problem sending the notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const hasDefaultEvents = events.some(
    (event) =>
      (event.description === "Summer Gala Dinner" || event.description === "Independence Day BBQ") &&
      event.image === "/placeholder.svg",
  )

  return (
    <AdminLayout>
      <PageHeader
        title="Event Management"
        description="Create, edit, and manage upcoming events"
        backHref="/admin"
        backLabel="Dashboard"
        actions={
          <Link href="/admin/events/categories">
            <Button variant="outline" size="sm">
              Manage Categories
            </Button>
          </Link>
        }
        helpText="This page allows you to create, edit, and delete events that will be displayed on your website."
      />

      {hasDefaultEvents && (
        <Alert className="mb-8 bg-amber-50 border-amber-200">
          <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle>Default Events Detected</AlertTitle>
          <AlertDescription>
            We've noticed you still have the default sample events. You can edit or delete these events and replace them
            with your own upcoming events using the tools below.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminEventForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Existing Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No events found. Create your first event using the form above.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event) => (
                <Card key={event.id} className="border-gray-200">
                  {editingEvent && editingEvent.id === event.id ? (
                    <CardContent className="pt-6">
                      <form onSubmit={handleUpdateEvent} className="space-y-4">
                        <div>
                          <Label htmlFor={`edit-date-${event.id}`}>Event Date</Label>
                          <Input
                            id={`edit-date-${event.id}`}
                            type="date"
                            value={
                              typeof editingEvent.date === "string"
                                ? editingEvent.date.split("T")[0]
                                : new Date(editingEvent.date).toISOString().split("T")[0]
                            }
                            onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-description-${event.id}`}>Event Description</Label>
                          <Textarea
                            id={`edit-description-${event.id}`}
                            value={editingEvent.description}
                            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                            required
                          />
                        </div>
                        <ImageUploader
                          id={`edit-image-${event.id}`}
                          label="Event Image"
                          currentImageUrl={editingEvent.image as string}
                          onImageChange={(url) => setEditingEvent({ ...editingEvent, image: url })}
                        />
                        <div className="flex space-x-2 justify-end">
                          <Button type="button" variant="outline" onClick={handleCancelEdit}>
                            <XCircleIcon className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isUpdating}>
                            <CheckCircleIcon className="mr-2 h-4 w-4" />
                            {isUpdating ? "Updating..." : "Update Event"}
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
                            onClick={() => handleSendEventNotification(event)}
                            disabled={isSending}
                          >
                            <Mail className="h-4 w-4" />
                            Notify Subscribers
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                          <Image
                            src={(event.image as string) || "/placeholder.svg"}
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
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
