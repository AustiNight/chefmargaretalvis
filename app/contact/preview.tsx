"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ContactPreview() {
  const [contactType, setContactType] = useState("general")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const availableServices = ["private-dinner", "cooking-class", "catering", "consultation"]

  const handleServiceToggle = (service: string, checked: boolean) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, service])
    } else {
      setSelectedServices((prev) => prev.filter((s) => s !== service))
    }
  }

  // Check if special help text should be shown
  const showSpecialHelpText = selectedServices.some((service) => service === "private-dinner" || service === "catering")

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Contact Chef Margaret</h1>
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
      <h1 className="text-4xl font-bold mb-4">Contact Chef Margaret</h1>
      <p className="text-lg mb-8">
        Get in touch to book a private dinner, cooking class, or catering event. I'll get back to you as soon as
        possible.
      </p>

      <form className="max-w-md mx-auto space-y-6">
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
            <Input id="name" required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>

          {contactType === "booking" && (
            <>
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input id="date" type="date" required />
              </div>

              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <Input id="guests" type="number" required />
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

        <Button type="button" className="w-full" onClick={() => setIsSubmitted(true)}>
          {contactType === "general" ? "Send Message" : "Request Booking"}
        </Button>
      </form>
    </div>
  )
}
