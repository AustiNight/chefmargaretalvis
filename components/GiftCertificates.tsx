"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getSiteSettings } from "@/utils/siteSettings"
import { saveFormSubmission } from "@/utils/formSubmissions"
import { v4 as uuidv4 } from "uuid"
import Image from "next/image"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function GiftCertificates() {
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [message, setMessage] = useState("")
  const [paymentAppUsername, setPaymentAppUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [settings, setSettings] = useState({
    title: "Gift Certificates",
    subtitle: "Perfect for birthdays, anniversaries, or any special occasion.",
    amounts: ["50", "100", "200", "500", "Custom"],
    termsAndConditions: "Gift certificates are valid for one year from the date of purchase.",
    promoText: "Looking for a unique gift? Give the gift of a memorable culinary experience.",
    paymentQrCodeUrl: "",
    paymentInstructions:
      "To purchase a gift certificate, scan the QR code with your payment app and enter the desired amount. Please include your payment app username and recipient details in the form below. You will receive an email confirmation once your payment has been processed, which may take up to two business days.",
  })

  useEffect(() => {
    const siteSettings = getSiteSettings()
    if (siteSettings.giftCertificates) {
      setSettings(siteSettings.giftCertificates)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get the final amount (either selected or custom)
      const finalAmount = amount === "Custom" ? customAmount : amount

      // Save the form submission
      saveFormSubmission({
        id: uuidv4(),
        type: "gift-certificate",
        timestamp: new Date().toISOString(),
        name,
        email,
        amount: finalAmount,
        customAmount: amount === "Custom" ? customAmount : undefined,
        recipientName,
        recipientEmail,
        message,
        paymentAppUsername,
        isProcessed: false,
      })

      // Show success message
      setIsSubmitted(true)

      // Reset form
      setAmount("")
      setCustomAmount("")
      setRecipientName("")
      setRecipientEmail("")
      setMessage("")
      setPaymentAppUsername("")
      setName("")
      setEmail("")
    } catch (error) {
      console.error("Error submitting gift certificate form:", error)
    } finally {
      setIsSubmitting(false)
    }
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

            {settings.paymentQrCodeUrl ? (
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
            ) : (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment QR Code Not Available</AlertTitle>
                <AlertDescription>Please contact Chef Margaret directly to arrange payment.</AlertDescription>
              </Alert>
            )}

            {settings.termsAndConditions && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Terms and Conditions</h4>
                <p className="text-sm text-gray-600">{settings.termsAndConditions}</p>
              </div>
            )}
          </div>

          {/* Gift Certificate Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
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
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="paymentAppUsername">Your Payment App Username</Label>
              <Input
                id="paymentAppUsername"
                value={paymentAppUsername}
                onChange={(e) => setPaymentAppUsername(e.target.value)}
                required
                placeholder="e.g., @username"
              />
              <p className="text-xs text-gray-500 mt-1">
                This helps us match your payment to your gift certificate request.
              </p>
            </div>

            <div>
              <Label htmlFor="recipientName">Recipient's Name</Label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="recipientEmail">Recipient's Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Input id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !amount || (amount === "Custom" && !customAmount)}
            >
              {isSubmitting ? "Submitting..." : "Submit Gift Certificate Request"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
