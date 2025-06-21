"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import HelpGuide from "@/components/HelpGuide"
import ImageUploader from "@/components/ImageUploader"
import { MultipleImageUploader } from "@/components/MultipleImageUploader"
import { CategorySelector } from "@/components/CategorySelector"
import { RichTextEditor } from "@/components/RichTextEditor"
import { createEventAction } from "@/app/actions/events"
import { getNewsletterSubscribersAction } from "@/app/actions/users"
import { updateUserLastContactedAction } from "@/app/actions/users"
import { useToast } from "@/components/ui/use-toast"
import { MapPin } from "lucide-react"

// Default image to use if none is selected
const DEFAULT_EVENT_IMAGE = "/cooking-class.png"

export default function AdminEventForm() {
  const [eventTitle, setEventTitle] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventCoordinates, setEventCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [eventDescription, setEventDescription] = useState("")
  const [featuredImage, setFeaturedImage] = useState(DEFAULT_EVENT_IMAGE)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [notifySubscribers, setNotifySubscribers] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("title", eventTitle)
      formData.append("date", eventDate)
      formData.append("time", eventTime || "")
      formData.append("location", eventLocation || "")
      formData.append("description", eventDescription)

      // Ensure we always have an image
      const imageToUse = featuredImage || DEFAULT_EVENT_IMAGE
      formData.append("featured_image", imageToUse)

      // Add coordinates if available
      if (eventCoordinates) {
        formData.append("lat", eventCoordinates.lat.toString())
        formData.append("lng", eventCoordinates.lng.toString())
      }

      // Add gallery images
      galleryImages.forEach((image) => {
        formData.append("gallery_images", image)
      })

      // Add category if selected
      if (categoryId) {
        formData.append("category_id", categoryId)
      }

      // Save the event
      const result = await createEventAction(formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Show success message
      toast({
        title: "Event created",
        description: "The event has been added successfully.",
      })

      // Notify subscribers if option is selected
      if (notifySubscribers) {
        // Get all subscribed users
        const subscribedUsers = await getNewsletterSubscribersAction()

        if (subscribedUsers.length > 0) {
          toast({
            title: "Sending notifications",
            description: `Notifying ${subscribedUsers.length} subscribers about the new event...`,
          })

          // Update last contacted info for each subscriber
          const updatePromises = subscribedUsers.map((user) =>
            updateUserLastContactedAction(user.id, result.event.id, result.event.title),
          )

          await Promise.all(updatePromises)

          toast({
            title: "Notifications sent",
            description: `Successfully notified ${subscribedUsers.length} subscribers.`,
          })
        } else {
          toast({
            title: "No subscribers",
            description: "There are no subscribers to notify about this event.",
          })
        }
      }

      // Reset form
      setEventTitle("")
      setEventDate("")
      setEventTime("")
      setEventLocation("")
      setEventCoordinates(null)
      setEventDescription("")
      setFeaturedImage(DEFAULT_EVENT_IMAGE)
      setGalleryImages([])
      setCategoryId(undefined)
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "There was a problem creating the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to generate mock coordinates based on address
  const handleAddressChange = (address: string) => {
    setEventLocation(address)

    // If address is empty, clear coordinates
    if (!address.trim()) {
      setEventCoordinates(null)
      return
    }

    // Generate mock coordinates based on address length
    // This is just for preview purposes
    const mockLat = 40.7128 + (address.length % 10) * 0.01
    const mockLng = -74.006 + (address.length % 5) * 0.01

    setEventCoordinates({ lat: mockLat, lng: mockLng })
  }

  return (
    <div className="relative">
      <HelpGuide title="Event Form">
        <p>
          <strong>What:</strong> This form allows you to create new events that will be displayed on your website.
        </p>
        <p>
          <strong>Where:</strong> Events will appear in the "Upcoming Events" section on your homepage.
        </p>
        <p>
          <strong>When:</strong> Create events as soon as they are scheduled to give visitors advance notice.
        </p>
        <p>
          <strong>Why:</strong> Keeping your events calendar updated helps attract attendees and showcases your active
          schedule.
        </p>
        <p>
          <strong>How:</strong> Fill out all fields and click "Create Event" to add a new event:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Event Title:</strong> A clear, concise title for your event.
          </li>
          <li>
            <strong>Event Date & Time:</strong> When the event will take place.
          </li>
          <li>
            <strong>Event Location:</strong> Where the event will be held.
          </li>
          <li>
            <strong>Event Description:</strong> Provide a detailed description of the event.
          </li>
          <li>
            <strong>Featured Image:</strong> The main image that represents the event.
          </li>
          <li>
            <strong>Gallery Images:</strong> Additional images for the event gallery.
          </li>
          <li>
            <strong>Category:</strong> Categorize your event for better organization.
          </li>
          <li>
            <strong>Notify Subscribers:</strong> Toggle this option to automatically send an email notification about
            this event to all your newsletter subscribers.
          </li>
        </ul>
      </HelpGuide>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input id="eventTitle" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="eventTime">Event Time</Label>
                <Input id="eventTime" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="eventLocation">Event Location</Label>
              <Input
                id="eventLocation"
                value={eventLocation}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="e.g., 123 Main St, City, State"
              />
              {eventCoordinates && (
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {eventCoordinates.lat.toFixed(6)}, {eventCoordinates.lng.toFixed(6)}
                </p>
              )}
            </div>

            <CategorySelector
              id="eventCategory"
              label="Event Category"
              selectedCategoryId={categoryId}
              onChange={setCategoryId}
            />

            <div className="flex items-center space-x-2">
              <Switch id="notifySubscribers" checked={notifySubscribers} onCheckedChange={setNotifySubscribers} />
              <Label htmlFor="notifySubscribers">Notify subscribers about this event</Label>
            </div>
          </div>

          <div className="space-y-4">
            <ImageUploader
              id="featuredImage"
              label="Featured Image"
              currentImageUrl={featuredImage}
              onImageChange={(url) => setFeaturedImage(url)}
            />

            <MultipleImageUploader
              id="galleryImages"
              label="Gallery Images"
              currentImages={galleryImages}
              onImagesChange={setGalleryImages}
              maxImages={5}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="eventDescription">Event Description</Label>
          <RichTextEditor
            value={eventDescription}
            onChange={setEventDescription}
            placeholder="Describe your event..."
            minHeight="200px"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </div>
  )
}
