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
import { saveSiteSettings, getSiteSettings, type SiteSettings } from "@/utils/siteSettings"
import { Save, ChefHat, Utensils, Users, Sparkles } from "lucide-react"

export default function ServicesEditor() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [newService, setNewService] = useState("")
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
        title: "Services updated",
        description: "Your services content has been updated successfully.",
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

  const handleAddService = () => {
    if (!settings) return

    if (newService && !settings.availableServices.includes(newService)) {
      setSettings({
        ...settings,
        availableServices: [...settings.availableServices, newService],
      })
      setNewService("")
    }
  }

  const handleRemoveService = (service: string) => {
    if (!settings) return

    setSettings({
      ...settings,
      availableServices: settings.availableServices.filter((s) => s !== service),
    })
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
        title="Edit Services"
        description="Update your service offerings and descriptions"
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
        helpText="This page allows you to edit your service offerings. Describe each service you provide and configure which services are available for booking."
      />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChefHat className="mr-2 h-5 w-5" />
              Available Services
            </CardTitle>
            <CardDescription>Configure which services are available for booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="availableServices">Available Services</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {settings.availableServices.map((service) => (
                  <div key={service} className="flex items-center bg-slate-100 rounded-md px-3 py-1">
                    <span>
                      {service
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1"
                      onClick={() => handleRemoveService(service)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newService"
                  placeholder="Add service (e.g., private-dinner)"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                />
                <Button type="button" onClick={handleAddService}>
                  Add
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Enter services in kebab-case (e.g., private-dinner, cooking-class). These will appear as options in the
                contact form.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2 h-5 w-5" />
              Private Dinner Service
            </CardTitle>
            <CardDescription>Update your private dinner service description</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="privateDinnerDescription">Private Dinner Description</Label>
              <Textarea
                id="privateDinnerDescription"
                value={settings.services.privateDinnerDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    services: {
                      ...settings.services,
                      privateDinnerDescription: e.target.value,
                    },
                  })
                }
                placeholder="Describe your private dinner service..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChefHat className="mr-2 h-5 w-5" />
              Cooking Class Service
            </CardTitle>
            <CardDescription>Update your cooking class service description</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="cookingClassDescription">Cooking Class Description</Label>
              <Textarea
                id="cookingClassDescription"
                value={settings.services.cookingClassDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    services: {
                      ...settings.services,
                      cookingClassDescription: e.target.value,
                    },
                  })
                }
                placeholder="Describe your cooking class service..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Catering Service
            </CardTitle>
            <CardDescription>Update your catering service description</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="cateringDescription">Catering Description</Label>
              <Textarea
                id="cateringDescription"
                value={settings.services.cateringDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    services: {
                      ...settings.services,
                      cateringDescription: e.target.value,
                    },
                  })
                }
                placeholder="Describe your catering service..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              Consultation Service
            </CardTitle>
            <CardDescription>Update your consultation service description</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="consultationDescription">Consultation Description</Label>
              <Textarea
                id="consultationDescription"
                value={settings.services.consultationDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    services: {
                      ...settings.services,
                      consultationDescription: e.target.value,
                    },
                  })
                }
                placeholder="Describe your consultation service..."
                rows={4}
              />
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
