// Admin Dashboard Preview
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboardPreview() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Button variant="outline">Log Out</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white rounded-lg shadow-md relative">
          <h2 className="text-xl font-bold mb-2">Site Settings</h2>
          <p className="text-gray-600">Manage website content and settings</p>
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow-md relative">
          <h2 className="text-xl font-bold mb-2">Analytics</h2>
          <p className="text-gray-600">View website traffic and business metrics</p>
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow-md relative">
          <h2 className="text-xl font-bold mb-2">User Management</h2>
          <p className="text-gray-600">Manage newsletter subscribers</p>
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow-md relative">
          <h2 className="text-xl font-bold mb-2">Message Center</h2>
          <p className="text-gray-600">View and manage contact inquiries and gift certificate requests</p>
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow-md relative">
          <h2 className="text-xl font-bold mb-2">Event Management</h2>
          <p className="text-gray-600">Create and manage upcoming events</p>
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow-md relative">
          <h2 className="text-xl font-bold mb-2">Theme Management</h2>
          <p className="text-gray-600">Customize your website's appearance</p>
        </Card>
      </div>

      <Card className="bg-white p-6 rounded-lg shadow-md relative">
        <h2 className="text-2xl font-bold mb-6">Site Settings</h2>

        <Tabs defaultValue="general" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="about">About Page</TabsTrigger>
            <TabsTrigger value="contact">Contact Page</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="gift-certificates">Gift Certificates</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="border p-4 rounded-md bg-gray-50">
              <p className="text-center text-gray-500">General settings content would appear here</p>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button>Save Changes</Button>
        </div>
      </Card>
    </div>
  )
}
