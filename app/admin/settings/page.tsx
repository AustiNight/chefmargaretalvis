"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/layouts/AdminLayout"
import PageHeader from "@/components/admin/PageHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { saveSiteSettings, getSiteSettings } from "@/utils/siteSettings"
import { Bell, Save, Mail } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any | null>(null)
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
        title: "Settings saved",
        description: "Your site settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your settings. Please try again.",
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
        title="Site Settings"
        description="Configure global website settings and notifications"
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
        helpText="This page allows you to configure global settings for your website. These settings affect various features across your site."
      />

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="instagram">
            <Mail className="h-4 w-4 mr-2" />
            Instagram
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Message Notifications
              </CardTitle>
              <CardDescription>Configure email notifications for form submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="notificationsEnabled"
                  checked={settings.messageNotifications.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      messageNotifications: {
                        ...settings.messageNotifications,
                        enabled: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="notificationsEnabled">Enable email notifications for new messages</Label>
              </div>

              <div>
                <Label htmlFor="notificationEmails">Notification Email Addresses</Label>
                <Textarea
                  id="notificationEmails"
                  value={settings.messageNotifications.emailAddresses}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      messageNotifications: {
                        ...settings.messageNotifications,
                        emailAddresses: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter email addresses separated by commas, semicolons, or line breaks"
                  className={!settings.messageNotifications.enabled ? "opacity-50" : ""}
                  disabled={!settings.messageNotifications.enabled}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  These email addresses will receive notifications whenever someone submits a contact form or gift
                  certificate request on your website. Separate multiple addresses with commas, semicolons, or line
                  breaks.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instagram">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Instagram Integration
              </CardTitle>
              <CardDescription>Configure your Instagram feed settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="instagramAccessToken">Instagram Access Token</Label>
                <Input
                  id="instagramAccessToken"
                  type="password"
                  value={settings.instagram.accessToken}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      instagram: {
                        ...settings.instagram,
                        accessToken: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter your Instagram access token"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This is required to fetch your Instagram posts. Learn how to get your access token in the{" "}
                  <a
                    href="https://developers.facebook.com/docs/instagram-basic-display-api/getting-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Instagram API documentation
                  </a>
                  .
                </p>
              </div>

              <div>
                <Label htmlFor="instagramTitle">Instagram Feed Title</Label>
                <Input
                  id="instagramTitle"
                  value={settings.instagram.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      instagram: {
                        ...settings.instagram,
                        title: e.target.value,
                      },
                    })
                  }
                  placeholder="Instagram Feed"
                />
              </div>

              <div>
                <Label htmlFor="instagramSubtitle">Instagram Feed Subtitle</Label>
                <Textarea
                  id="instagramSubtitle"
                  value={settings.instagram.subtitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      instagram: {
                        ...settings.instagram,
                        subtitle: e.target.value,
                      },
                    })
                  }
                  placeholder="Follow me on Instagram for behind-the-scenes content and culinary inspiration."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="instagramDisplayCount">Number of Posts to Display</Label>
                <Input
                  id="instagramDisplayCount"
                  type="number"
                  min="1"
                  max="20"
                  value={settings.instagram.displayCount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      instagram: {
                        ...settings.instagram,
                        displayCount: Number.parseInt(e.target.value) || 6,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="instagramShowCaptions"
                  checked={settings.instagram.showCaptions}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      instagram: {
                        ...settings.instagram,
                        showCaptions: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="instagramShowCaptions">Show Post Captions</Label>
              </div>

              <div>
                <Label htmlFor="instagramCacheTime">Cache Duration (minutes)</Label>
                <Input
                  id="instagramCacheTime"
                  type="number"
                  min="5"
                  max="1440"
                  value={settings.instagram.cacheTime}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      instagram: {
                        ...settings.instagram,
                        cacheTime: Number.parseInt(e.target.value) || 60,
                      },
                    })
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">
                  How long to cache Instagram data to improve performance and reduce API calls. Recommended: 60 minutes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
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
    </AdminLayout>
  )
}
