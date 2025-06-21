"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Home from "./page"
import AdminDashboardPreview from "./admin/preview"
import AdminMessagesPreview from "./admin/messages/preview"
import ContactPreview from "./contact/preview"
import GiftCertificatesPreview from "./gift-certificates/preview"
import AdminLoginPreview from "./admin/login/preview"

export default function Preview() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Chef Margaret Alvis Website Preview</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="contact">Contact Page</TabsTrigger>
          <TabsTrigger value="gift">Gift Certificates</TabsTrigger>
          <TabsTrigger value="admin-login">Admin Login</TabsTrigger>
          <TabsTrigger value="admin-dashboard">Admin Dashboard</TabsTrigger>
          <TabsTrigger value="admin-messages">Message Center</TabsTrigger>
        </TabsList>

        <div className="border rounded-lg p-4 bg-gray-50">
          <TabsContent value="home">
            <Home />
          </TabsContent>

          <TabsContent value="contact">
            <ContactPreview />
          </TabsContent>

          <TabsContent value="gift">
            <GiftCertificatesPreview />
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
        </div>
      </Tabs>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-bold mb-2">How to Use This Preview</h2>
        <p className="mb-4">
          This preview shows the key pages of the Chef Margaret Alvis website. Use the tabs above to navigate between
          different sections.
        </p>

        <h3 className="font-bold mt-4">Admin Access</h3>
        <p>To access the admin area in the real application, use these credentials:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            <strong>Email:</strong> margaret@chefmargaretalvis.com
          </li>
          <li>
            <strong>Password:</strong> admin123
          </li>
        </ul>

        <h3 className="font-bold mt-4">Working Features</h3>
        <p>In the full application, these features are now working:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>JWT-based authentication system</li>
          <li>Email notifications for form submissions</li>
          <li>Form submission storage and management</li>
          <li>Content customization through the admin interface</li>
          <li>Image uploads via Vercel Blob Storage</li>
        </ul>
      </div>
    </div>
  )
}
