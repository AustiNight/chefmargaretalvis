"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function GiftCertificatesPreview() {
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const settings = {
    title: "Gift Certificates",
    subtitle: "Perfect for birthdays, anniversaries, or any special occasion.",
    amounts: ["50", "100", "200", "500", "Custom"],
    termsAndConditions: "Gift certificates are valid for one year from the date of purchase.",
    promoText: "Looking for a unique gift? Give the gift of a memorable culinary experience.",
    paymentQrCodeUrl: "/placeholder.svg?height=200&width=200",
    paymentInstructions:
      "To purchase a gift certificate, scan the QR code with your payment app and enter the desired amount. Please include your payment app username and recipient details in the form below. You will receive an email confirmation once your payment has been processed, which may take up to two business days.",
  }

  if (isSubmitted) {
    return (
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <Alert className="max-w-md mx-auto bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Thank you for your purchase!</AlertTitle>
            <AlertDescription>
              Your gift certificate request has been submitted. You will receive an email confirmation once your payment
              has been processed, which may take up to two business days.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={() => setIsSubmitted(false)}>Purchase Another Gift Certificate</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4 text-center">{settings.title}</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{settings.subtitle}</p>

        {settings.promoText && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 max-w-2xl mx-auto">
            <p className="italic text-gray-700">{settings.promoText}</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Instructions and QR Code */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Payment Instructions</h3>
            <p className="mb-6 text-gray-700">{settings.paymentInstructions}</p>

            <div className="flex justify-center mb-4">
              <div className="border p-4 rounded-lg bg-white inline-block">
                <Image
                  src={settings.paymentQrCodeUrl || "/placeholder.svg"}
                  alt="Payment QR Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </div>

            {settings.termsAndConditions && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Terms and Conditions</h4>
                <p className="text-sm text-gray-600">{settings.termsAndConditions}</p>
              </div>
            )}
          </div>

          {/* Gift Certificate Form */}
          <form className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold mb-4">Gift Certificate Details</h3>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <RadioGroup value={amount} onValueChange={setAmount} className="mt-2 space-y-2">
                {settings.amounts.map((amt) => (
                  <div key={amt} className="flex items-center space-x-2">
                    <RadioGroupItem value={amt} id={`amount-${amt}`} />
                    <Label htmlFor={`amount-${amt}`} className="cursor-pointer">
                      {amt === "Custom" ? "Custom Amount" : `$${amt}`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {amount === "Custom" && (
              <div>
                <Label htmlFor="customAmount">Enter Custom Amount ($)</Label>
                <Input
                  id="customAmount"
                  type="number"
                  min="10"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" required />
            </div>

            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input id="email" type="email" required />
            </div>

            <div>
              <Label htmlFor="paymentAppUsername">Your Payment App Username</Label>
              <Input id="paymentAppUsername" required placeholder="e.g., @username" />
              <p className="text-xs text-gray-500 mt-1">
                This helps us match your payment to your gift certificate request.
              </p>
            </div>

            <div>
              <Label htmlFor="recipientName">Recipient's Name</Label>
              <Input id="recipientName" required />
            </div>

            <div>
              <Label htmlFor="recipientEmail">Recipient's Email</Label>
              <Input id="recipientEmail" type="email" required />
            </div>

            <div>
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Input id="message" />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => setIsSubmitted(true)}
              disabled={!amount || (amount === "Custom" && !customAmount)}
            >
              Submit Gift Certificate Request
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
