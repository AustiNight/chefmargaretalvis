"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/layouts/AdminLayout"
import PageHeader from "@/components/admin/PageHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import ImageUploader from "@/components/ImageUploader"
import { saveSiteSettings, getSiteSettings, type SiteSettings } from "@/utils/siteSettings"
import { Save, User, ImageIcon } from "lucide-react"

export default function AboutPageEditor() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load settings on component mount
    const currentSettings = getSiteSettings()
    setSettings(currentSettings)
  }, [])

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      // Save settings
      saveSiteSettings(settings)

      // Show success message
      toast({
        title: "About page updated",
        description: "Your about page content has been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Edit About Page"
        description="Update your biography and professional information"
        backHref="/admin"
        backLabel="Dashboard"
        actions={
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        }
        helpText="This page allows you to edit the content of your About page. Use this space to share your story, experience, and qualifications with your audience."
      />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              About Page Content
            </CardTitle>
            <CardDescription>Update your biographical information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="aboutTitle">About Page Title</Label>
              <Input
                id="aboutTitle"
                value={settings.aboutTitle}
                onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                placeholder="About Chef Margaret Alvis"
              />
              <p className="text-sm text-muted-foreground mt-1">The main heading displayed on your About page</p>
            </div>

            <div>
              <Label htmlFor="aboutContent">About Page Content</Label>
              <Textarea
                id="aboutContent"
                value={settings.aboutContent}
                onChange={(e) => setSettings({ ...settings, aboutContent: e.target.value })}
                placeholder="Share your story, experience, and qualifications..."
                rows={8}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your biography and professional background. Use double line breaks to create paragraphs.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              About Page Image
            </CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              id="aboutImage"
              label="About Page Image"
              currentImageUrl={settings.aboutImage}
              onImageChange={(url) => setSettings({ ...settings, aboutImage: url })}
            />
            <p className="text-sm text-muted-foreground mt-1">
              A professional photo of yourself. Recommended size: 500x500px.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
