"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getFormSubmissionsAction,
  deleteFormSubmissionAction,
  updateSubmissionProcessedStatusAction,
} from "@/app/actions/form-submissions"
import { CheckCircle, Search, Trash2, AlertCircle, Calendar, Users, Tag, DollarSign, AtSign, Mail } from "lucide-react"
import HelpGuide from "@/components/HelpGuide"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import type { FormSubmission } from "@/types"

export default function AdminMessages() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load submissions on component mount
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    setIsLoading(true)
    try {
      const allSubmissions = await getFormSubmissionsAction()
      // Sort by timestamp, newest first
      allSubmissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setSubmissions(allSubmissions)
    } catch (error) {
      console.error("Error loading submissions:", error)
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSubmission = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      try {
        const result = await deleteFormSubmissionAction(id)
        if (result.success) {
          // Remove the deleted submission from the state
          setSubmissions((prev) => prev.filter((submission) => submission.id !== id))
          toast({
            title: "Message deleted",
            description: "The message has been permanently deleted.",
          })
        } else {
          throw new Error(result.message)
        }
      } catch (error) {
        console.error("Error deleting submission:", error)
        toast({
          title: "Error",
          description: "Failed to delete message. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleMarkAsProcessed = async (id: string) => {
    try {
      const result = await updateSubmissionProcessedStatusAction(id, true)
      if (result.success) {
        // Update the processed status in the state
        setSubmissions((prev) =>
          prev.map((submission) => (submission.id === id ? { ...submission, is_processed: true } : submission)),
        )
        toast({
          title: "Gift certificate marked as processed",
          description: "The gift certificate has been marked as processed.",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error marking as processed:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Filter submissions based on search term and active tab
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.message && submission.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (submission.payment_app_username &&
        submission.payment_app_username.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "contact") return matchesSearch && submission.type === "contact"
    if (activeTab === "gift-certificate") return matchesSearch && submission.type === "gift-certificate"
    if (activeTab === "unprocessed")
      return matchesSearch && submission.type === "gift-certificate" && !submission.is_processed
    return matchesSearch
  })

  return (
    <div className="container mx-auto px-6 py-12">
      <Toaster />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Message Center</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md relative mb-8">
        <HelpGuide title="Message Center">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">Understanding the Message Center</h4>
              <p>
                <strong>What:</strong> The Message Center collects all form submissions from your website, including
                contact form inquiries and gift certificate requests.
              </p>
              <p>
                <strong>Where:</strong> Messages come from the Contact page and Gift Certificates page on your website.
              </p>
              <p>
                <strong>When:</strong> Check this page regularly to respond to inquiries and process gift certificate
                requests.
              </p>
              <p>
                <strong>Why:</strong> Staying on top of customer communications helps maintain good relationships and
                ensures timely processing of gift certificates.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Message Types</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Contact Inquiries:</strong> General questions or booking requests from the Contact page.
                </li>
                <li>
                  <strong>Gift Certificate Requests:</strong> Requests for gift certificates, including payment
                  information.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Managing Gift Certificates</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Verify Payment:</strong> Check your payment app to confirm the customer has sent the payment
                  using their payment app username.
                </li>
                <li>
                  <strong>Mark as Processed:</strong> Once you've verified payment and sent the gift certificate, mark
                  the request as processed.
                </li>
                <li>
                  <strong>Send Confirmation:</strong> Email the gift certificate to both the purchaser and the recipient
                  (if different).
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Best Practices</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Check the Message Center daily to ensure timely responses.</li>
                <li>Process gift certificate requests within two business days.</li>
                <li>Keep a record of all communications with customers.</li>
                <li>Delete old messages only after they've been fully addressed.</li>
              </ul>
            </div>
          </div>
        </HelpGuide>

        <h2 className="text-2xl font-bold mb-6">Message Center</h2>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="contact">Contact Inquiries</TabsTrigger>
              <TabsTrigger value="gift-certificate">Gift Certificates</TabsTrigger>
              <TabsTrigger value="unprocessed">Unprocessed Certificates</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No messages found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSubmissions.map((submission) => (
              <Card
                key={submission.id}
                className={submission.type === "gift-certificate" && !submission.is_processed ? "border-amber-300" : ""}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {submission.name}
                        {submission.type === "gift-certificate" && (
                          <Badge variant={submission.is_processed ? "default" : "outline"} className="ml-2">
                            {submission.is_processed ? "Processed" : "Pending"}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{formatDate(submission.timestamp)}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {submission.type === "gift-certificate" && !submission.is_processed && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => handleMarkAsProcessed(submission.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Processed
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteSubmission(submission.id)}
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
                        {submission.type === "gift-certificate" && submission.payment_app_username && (
                          <p className="flex items-center gap-2 text-sm">
                            <AtSign className="h-4 w-4 text-gray-500" />
                            <span>{submission.payment_app_username}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {submission.type === "contact" && submission.contact_type === "booking" && (
                      <div>
                        <h3 className="font-semibold text-sm mb-2">Booking Details</h3>
                        <div className="space-y-2">
                          {submission.event_date && (
                            <p className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>{new Date(submission.event_date).toLocaleDateString()}</span>
                            </p>
                          )}
                          {submission.guests && (
                            <p className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span>{submission.guests} guests</span>
                            </p>
                          )}
                          {submission.service_type && (
                            <p className="flex items-center gap-2 text-sm">
                              <Tag className="h-4 w-4 text-gray-500" />
                              <span>
                                {submission.service_type
                                  .split("-")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {submission.type === "gift-certificate" && (
                      <div>
                        <h3 className="font-semibold text-sm mb-2">Gift Certificate Details</h3>
                        <div className="space-y-2">
                          <p className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span>
                              Amount: ${submission.amount === "Custom" ? submission.custom_amount : submission.amount}
                            </span>
                          </p>
                          <p className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>Recipient: {submission.recipient_name}</span>
                          </p>
                          <p className="flex items-center gap-2 text-sm">
                            <AtSign className="h-4 w-4 text-gray-500" />
                            <a href={`mailto:${submission.recipient_email}`} className="text-blue-600 hover:underline">
                              {submission.recipient_email}
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
                        ? submission.contact_type === "general"
                          ? "General Inquiry"
                          : "Booking Request"
                        : "Gift Certificate"}
                    </Badge>
                    {submission.type === "gift-certificate" && !submission.is_processed && (
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
        )}
      </div>
    </div>
  )
}
