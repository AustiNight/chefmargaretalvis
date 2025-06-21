"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createEventAction } from "@/app/actions/events"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function EventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await createEventAction(formData)

      if (result.success) {
        toast({
          title: "Event Created",
          description: "Your event has been successfully created.",
          variant: "default",
        })

        // Reset the form
        const form = document.getElementById("event-form") as HTMLFormElement
        form.reset()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create event.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <form id="event-form" action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" placeholder="/community-event.png" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Event Date</Label>
            <Input id="date" name="date" type="datetime-local" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Enter event description..." rows={4} required />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
