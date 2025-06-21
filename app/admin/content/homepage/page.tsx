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
import { Save, Info, ImageIcon } from "lucide-react"

export default function HomepageEditor() {
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
        title: "Homepage updated",
        description: "Your homepage content has been updated successfully.",
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
        title="Edit Homepage"
        description="Update the content displayed on your website's main page"
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
        helpText="This page allows you to edit the content of your homepage. Make your changes and click 'Save Changes' to update your website."
      />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              Hero Section
            </CardTitle>
            <CardDescription>The main banner section at the top of your homepage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Website Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder="Enter your website title"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This appears as the main heading on your homepage and in browser tabs
              </p>
            </div>

            <div>
              <Label htmlFor="heroImage">Hero Image</Label>
              <ImageUploader
                id="heroImage"
                label="Hero Image"
                currentImageUrl={settings.heroImage}
                onImageChange={(url) => setSettings({ ...settings, heroImage: url })}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Recommended size: 1920x1080px. This is the large banner image on your homepage.
              </p>
            </div>

            <div>
              <Label htmlFor="signUpInstructions">Sign Up Instructions</Label>
              <Textarea
                id="signUpInstructions"
                value={settings.signUpInstructions}
                onChange={(e) => setSettings({ ...settings, signUpInstructions: e.target.value })}
                placeholder="Enter instructions for your newsletter signup"
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">This text appears in the newsletter signup form</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Footer Information
            </CardTitle>
            <CardDescription>Update the information displayed in your website footer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="footerText">Footer Text</Label>
              <Input
                id="footerText"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                placeholder="© 2023 Chef Margaret Alvis. All rights reserved."
              />
              <p className="text-sm text-muted-foreground mt-1">
                Copyright notice or additional information displayed at the bottom of every page
              </p>
            </div>

            <div>
              <Label>Social Media Links</Label>
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div>
                  <Label htmlFor="instagram" className="text-sm">
                    Instagram URL
                  </Label>
                  <Input
                    id="instagram"
                    value={settings.socialMedia.instagram}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialMedia: {
                          ...settings.socialMedia,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
                  <Label htmlFor="facebook" className="text-sm">
                    Facebook URL
                  </Label>
                  <Input
                    id="facebook"
                    value={settings.socialMedia.facebook}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialMedia: {
                          ...settings.socialMedia,
                          facebook: e.target.value,
                        },
                      })
                    }
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter" className="text-sm">
                    Twitter URL
                  </Label>
                  <Input
                    id="twitter"
                    value={settings.socialMedia.twitter}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialMedia: {
                          ...settings.socialMedia,
                          twitter: e.target.value,
                        },
                      })
                    }
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
              </div>
            </div>
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
