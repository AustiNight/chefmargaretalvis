"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import HomePagePreview from "./page-preview"
import AdminDashboardPreview from "./admin/preview"
import AdminMessagesPreview from "./admin/messages/preview"
import ContactPreview from "./contact/preview"
import GiftCertificatesPreview from "./gift-certificates/preview"
import AdminLoginPreview from "./admin/login/preview"
import AdminEventsPreview from "./admin/events/preview"
import AdminUsersPreview from "./admin/users/preview"
import AdminThemePreview from "./admin/theme/preview"
import RecipesPreview from "./recipes/preview"
import BlogPreview from "./blog/preview"
import InstagramPreview from "./instagram/preview"
import AboutPreview from "./about/preview"
import ServicesPreview from "./services/preview"

export default function ComprehensivePreview() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Chef Margaret Alvis Website - Complete Preview</h1>

      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Preview Mode Notice</AlertTitle>
        <AlertDescription>
          This is a comprehensive preview of all website features. In this preview mode, functionality that requires
          backend processing (like form submissions, authentication, and email notifications) is simulated. In the
          actual deployed website, these features are fully functional with the configured environment variables.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="gift">Gift Certificates</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="admin-login">Admin Login</TabsTrigger>
          <TabsTrigger value="admin-dashboard">Admin Dashboard</TabsTrigger>
          <TabsTrigger value="admin-messages">Message Center</TabsTrigger>
          <TabsTrigger value="admin-events">Event Management</TabsTrigger>
          <TabsTrigger value="admin-users">User Management</TabsTrigger>
          <TabsTrigger value="admin-theme">Theme Management</TabsTrigger>
        </TabsList>

        <div className="border rounded-lg p-4 bg-gray-50">
          <TabsContent value="home">
            <HomePagePreview />
          </TabsContent>
          <TabsContent value="about">
            <AboutPreview />
          </TabsContent>
          <TabsContent value="services">
            <ServicesPreview />
          </TabsContent>
          <TabsContent value="contact">
            <ContactPreview />
          </TabsContent>
          <TabsContent value="gift">
            <GiftCertificatesPreview />
          </TabsContent>
          <TabsContent value="instagram">
            <InstagramPreview />
          </TabsContent>
          <TabsContent value="recipes">
            <RecipesPreview />
          </TabsContent>
          <TabsContent value="blog">
            <BlogPreview />
          </TabsContent>
          <TabsContent value="admin-login">
            <AdminLoginPreview />
          </TabsContent>
          <TabsContent value="admin-dashboard">
            <AdminDashboardPreview />
          </TabsContent>
          <TabsContent value="admin-messages">
            <AdminMessagesPreview />
          </TabsContent>
          <TabsContent value="admin-events">
            <AdminEventsPreview />
          </TabsContent>
          <TabsContent value="admin-users">
            <AdminUsersPreview />
          </TabsContent>
          <TabsContent value="admin-theme">
            <AdminThemePreview />
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold mb-4">Complete Feature Overview & Testing Guide</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Public-Facing Website Features</h3>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>
                <strong>Home Page:</strong> Hero image, upcoming events, services overview, testimonials, Instagram feed
                preview, and newsletter signup button
              </li>
              <li>
                <strong>About Page:</strong> Chef's biography with customizable content and image
              </li>
              <li>
                <strong>Services Page:</strong> Detailed descriptions of all offered services
              </li>
              <li>
                <strong>Contact Form:</strong> General inquiries and booking requests with conditional fields based on
                selection
              </li>
              <li>
                <strong>Gift Certificates:</strong> Purchase form with payment instructions, QR code, and recipient
                details
              </li>
              <li>
                <strong>Instagram Integration:</strong> Display of Instagram posts with captions and links
              </li>
              <li>
                <strong>Recipes Section:</strong> Browsable recipe collection with detailed individual recipe pages
              </li>
              <li>
                <strong>Blog:</strong> Articles and cooking tips with category filtering
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Admin Features</h3>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>
                <strong>Secure Authentication:</strong> JWT-based login system with protected routes
              </li>
              <li>
                <strong>Dashboard:</strong> Overview of all admin sections with quick access cards
              </li>
              <li>
                <strong>Site Settings:</strong> Comprehensive content management for all website sections
              </li>
              <li>
                <strong>Message Center:</strong> View, manage, and process contact form submissions and gift certificate
                requests
              </li>
              <li>
                <strong>Event Management:</strong> Create, edit, delete, and notify subscribers about events
              </li>
              <li>
                <strong>User Management:</strong> View and manage newsletter subscribers with bulk actions
              </li>
              <li>
                <strong>Theme Management:</strong> Customize website appearance with color schemes, fonts, and layout
                options
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Backend Functionality (Active with Environment Variables)</h3>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>
                <strong>JWT Authentication:</strong> Secure admin login using JWT_SECRET environment variable
              </li>
              <li>
                <strong>Email Notifications:</strong> Automated emails for form submissions using RESEND_API_KEY
              </li>
              <li>
                <strong>Image Uploads:</strong> Image storage using Vercel Blob Storage with BLOB_READ_WRITE_TOKEN
              </li>
              <li>
                <strong>Form Submissions:</strong> Storage and management of contact and gift certificate requests
              </li>
              <li>
                <strong>Data Persistence:</strong> Local storage for site settings, events, users, and content
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Testing Guide</h3>
            <p>To thoroughly test all features in the deployed application:</p>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>Browse all public pages to verify content and responsive design</li>
              <li>Submit a contact form and verify email notification (if enabled)</li>
              <li>Submit a gift certificate request and verify email notification</li>
              <li>Log in to the admin area using the provided credentials</li>
              <li>Update site content in various sections and verify changes on the public site</li>
              <li>Create a new event and test the notification system</li>
              <li>Process a gift certificate request in the Message Center</li>
              <li>Customize the theme and verify visual changes</li>
              <li>Upload images using the image uploader components</li>
              <li>Test the Instagram integration if an access token is provided</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Admin Access</h3>
            <p>To access the admin area in the deployed application, use these credentials:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                <strong>Email:</strong> margaret@chefmargaretalvis.com
              </li>
              <li>
                <strong>Password:</strong> admin123
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
