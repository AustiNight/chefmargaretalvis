"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getSiteSettings } from "@/utils/siteSettings"
import { saveFormSubmission } from "@/utils/formSubmissions"
import { v4 as uuidv4 } from "uuid"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ContactBooking() {
  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [contactType, setContactType] = useState("general")

  // Booking-specific fields
  const [date, setDate] = useState("")
  const [guests, setGuests] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Page content from settings
  const [contactTitle, setContactTitle] = useState("Contact Chef Margaret")
  const [contactSubtitle, setContactSubtitle] = useState("")
  const [availableServices, setAvailableServices] = useState<string[]>([])

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Check if special help text should be shown
  const showSpecialHelpText = selectedServices.some((service) => service === "private-dinner" || service === "catering")

  useEffect(() => {
    const settings = getSiteSettings()
    if (settings.contactTitle) {
      setContactTitle(settings.contactTitle)
    }
    if (settings.contactSubtitle) {
      setContactSubtitle(settings.contactSubtitle)
    }
    if (settings.availableServices) {
      setAvailableServices(settings.availableServices)
    }
  }, [])

  const handleServiceToggle = (service: string, checked: boolean) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, service])
    } else {
      setSelectedServices((prev) => prev.filter((s) => s !== service))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save the form submission
      saveFormSubmission({
        id: uuidv4(),
        type: "contact",
        timestamp: new Date().toISOString(),
        name,
        email,
        message,
        contactType: contactType === "general" ? "general" : "booking",
        date: contactType === "booking" ? date : undefined,
        guests: contactType === "booking" ? guests : undefined,
        serviceType: contactType === "booking" ? selectedServices.join(", ") : undefined,
      })

      // Show success message
      setIsSubmitted(true)

      // Reset form
      setName("")
      setEmail("")
      setMessage("")
      setContactType("general")
      setDate("")
      setGuests("")
      setSelectedServices([])
    } catch (error) {
      console.error("Error submitting contact form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">{contactTitle}</h1>
        <Alert className="max-w-md mx-auto bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Thank you for your message!</AlertTitle>
          <AlertDescription>
            Your message has been received. Chef Margaret will get back to you as soon as possible.
          </AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">{contactTitle}</h1>
      {contactSubtitle && <p className="text-lg mb-8">{contactSubtitle}</p>}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div className="space-y-4">
          <Label>What would you like to do?</Label>
          <RadioGroup value={contactType} onValueChange={setContactType} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="general" id="general" />
              <Label htmlFor="general">General Inquiry</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="booking" id="booking" />
              <Label htmlFor="booking">Book a Service</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {contactType === "booking" && (
            <>
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <Input id="guests" type="number" value={guests} onChange={(e) => setGuests(e.target.value)} required />
              </div>

              <div>
                <Label>Service Type (Select all that apply)</Label>
                <div className="mt-2 space-y-2">
                  {availableServices.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service}`}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                      />
                      <Label htmlFor={`service-${service}`} className="cursor-pointer">
                        {service
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedServices.length === 0 && contactType === "booking" && (
                  <p className="text-sm text-red-500 mt-1">Please select at least one service</p>
                )}
              </div>
            </>
          )}

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="message">{contactType === "general" ? "Message" : "Additional Details"}</Label>
              {showSpecialHelpText && (
                <div className="text-xs text-amber-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Important
                </div>
              )}
            </div>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required={contactType === "general"}
              rows={5}
              className={showSpecialHelpText ? "border-amber-300 focus-visible:ring-amber-400" : ""}
            />
            {showSpecialHelpText && (
              <Alert className="mt-2 py-2 text-sm bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Please include important information such as type of occasion, food allergies or special requests, and
                  any other details you'd like us to know!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || (contactType === "booking" && selectedServices.length === 0)}
        >
          {isSubmitting ? "Sending..." : contactType === "general" ? "Send Message" : "Request Booking"}
        </Button>
      </form>
    </div>
  )
}
