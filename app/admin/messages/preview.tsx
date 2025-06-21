"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Search, Trash2, AlertCircle, DollarSign, AtSign, Mail } from "lucide-react"
import Link from "next/link"

export default function AdminMessagesPreview() {
  const [activeTab, setActiveTab] = useState("all")

  const submissions = [
    {
      id: "1",
      type: "contact",
      contactType: "general",
      name: "John Smith",
      email: "john@example.com",
      message:
        "I'm interested in booking a private dinner for my anniversary next month. Could you please provide more information about your services and availability?",
      timestamp: "2023-05-15T14:30:00Z",
    },
    {
      id: "2",
      type: "gift-certificate",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      recipientName: "Michael Johnson",
      recipientEmail: "michael@example.com",
      amount: "100",
      paymentAppUsername: "@sarahjohnson",
      isProcessed: false,
      timestamp: "2023-05-14T10:15:00Z",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Message Center</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md relative mb-8">
        <h2 className="text-2xl font-bold mb-6">Message Center</h2>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="text-gray-400" />
            <Input placeholder="Search messages..." className="max-w-md" />
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
            <TabsList>
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="contact">Contact Inquiries</TabsTrigger>
              <TabsTrigger value="gift-certificate">Gift Certificates</TabsTrigger>
              <TabsTrigger value="unprocessed">Unprocessed Certificates</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-6">
          {submissions.map((submission) => (
            <Card
              key={submission.id}
              className={submission.type === "gift-certificate" && !submission.isProcessed ? "border-amber-300" : ""}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {submission.name}
                      {submission.type === "gift-certificate" && (
                        <Badge variant={submission.isProcessed ? "default" : "outline"} className="ml-2">
                          {submission.isProcessed ? "Processed" : "Pending"}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{formatDate(submission.timestamp)}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {submission.type === "gift-certificate" && !submission.isProcessed && (
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Mark Processed
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                          {submission.email}
                        </a>
                      </p>
                      {submission.type === "gift-certificate" && submission.paymentAppUsername && (
                        <p className="flex items-center gap-2 text-sm">
                          <AtSign className="h-4 w-4 text-gray-500" />
                          <span>{submission.paymentAppUsername}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {submission.type === "gift-certificate" && (
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Gift Certificate Details</h3>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>Amount: ${submission.amount}</span>
                        </p>
                        <p className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>Recipient: {submission.recipientName}</span>
                        </p>
                        <p className="flex items-center gap-2 text-sm">
                          <AtSign className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${submission.recipientEmail}`} className="text-blue-600 hover:underline">
                            {submission.recipientEmail}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {submission.message && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-sm mb-2">Message</h3>
                    <div className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-wrap">{submission.message}</div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between items-center">
                  <Badge variant="outline">
                    {submission.type === "contact"
                      ? submission.contactType === "general"
                        ? "General Inquiry"
                        : "Booking Request"
                      : "Gift Certificate"}
                  </Badge>
                  {submission.type === "gift-certificate" && !submission.isProcessed && (
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Action required: Verify payment and process certificate</span>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
