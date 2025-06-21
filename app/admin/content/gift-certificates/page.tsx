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
import { Save, Gift, CreditCard, QrCode } from "lucide-react"

export default function GiftCertificatesEditor() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [newAmount, setNewAmount] = useState("")
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
        title: "Gift certificates updated",
        description: "Your gift certificates content has been updated successfully.",
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

  const handleAddAmount = () => {
    if (!settings) return

    if (newAmount && !settings.giftCertificates.amounts.includes(newAmount)) {
      setSettings({
        ...settings,
        giftCertificates: {
          ...settings.giftCertificates,
          amounts: [...settings.giftCertificates.amounts, newAmount],
        },
      })
      setNewAmount("")
    }
  }

  const handleRemoveAmount = (amount: string) => {
    if (!settings) return

    setSettings({
      ...settings,
      giftCertificates: {
        ...settings.giftCertificates,
        amounts: settings.giftCertificates.amounts.filter((a) => a !== amount),
      },
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
        title="Gift Certificates"
        description="Configure gift certificate options and descriptions"
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
        helpText="This page allows you to configure gift certificate options, payment methods, and promotional text for your gift certificate offerings."
      />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="mr-2 h-5 w-5" />
              Gift Certificate Details
            </CardTitle>
            <CardDescription>Configure the main gift certificate information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="giftCertificatesTitle">Title</Label>
              <Input
                id="giftCertificatesTitle"
                value={settings.giftCertificates.title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      title: e.target.value,
                    },
                  })
                }
                placeholder="Gift Certificates"
              />
              <p className="text-sm text-muted-foreground mt-1">The main heading for your Gift Certificates page</p>
            </div>

            <div>
              <Label htmlFor="giftCertificatesSubtitle">Subtitle</Label>
              <Textarea
                id="giftCertificatesSubtitle"
                value={settings.giftCertificates.subtitle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      subtitle: e.target.value,
                    },
                  })
                }
                placeholder="Perfect for birthdays, anniversaries, or any special occasion."
                rows={2}
              />
              <p className="text-sm text-muted-foreground mt-1">
                A brief description of your gift certificates and their benefits
              </p>
            </div>

            <div>
              <Label htmlFor="giftCertificatesPromo">Promotional Text</Label>
              <Textarea
                id="giftCertificatesPromo"
                value={settings.giftCertificates.promoText}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      promoText: e.target.value,
                    },
                  })
                }
                placeholder="Looking for a unique gift? Give the gift of a memorable culinary experience."
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Additional marketing text to encourage gift certificate purchases
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Available Amounts
            </CardTitle>
            <CardDescription>Configure the gift certificate denominations you offer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="giftCertificatesAmounts">Available Amounts</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {settings.giftCertificates.amounts.map((amount) => (
                  <div key={amount} className="flex items-center bg-slate-100 rounded-md px-3 py-1">
                    <span>{amount.startsWith("$") ? amount : `${amount}`}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1"
                      onClick={() => handleRemoveAmount(amount)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newAmount"
                  placeholder="Add amount (e.g., 50)"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
                <Button type="button" onClick={handleAddAmount}>
                  Add
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Enter amounts without the dollar sign. Add "Custom" to allow custom amounts.
              </p>
            </div>

            <div>
              <Label htmlFor="giftCertificatesTerms">Terms and Conditions</Label>
              <Textarea
                id="giftCertificatesTerms"
                value={settings.giftCertificates.termsAndConditions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      termsAndConditions: e.target.value,
                    },
                  })
                }
                placeholder="Gift certificates are valid for one year from the date of purchase."
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Rules or restrictions that apply to gift certificates
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              Payment Information
            </CardTitle>
            <CardDescription>Configure payment methods and instructions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentQrCodeUrl">Payment App QR Code</Label>
              <ImageUploader
                id="paymentQrCodeUrl"
                label="Payment App QR Code"
                currentImageUrl={settings.giftCertificates.paymentQrCodeUrl}
                onImageChange={(url) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      paymentQrCodeUrl: url,
                    },
                  })
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload a QR code image from your payment app (Venmo, Cash App, etc.) that customers can scan to send
                payment.
              </p>
            </div>

            <div>
              <Label htmlFor="paymentInstructions">Payment Instructions</Label>
              <Textarea
                id="paymentInstructions"
                value={settings.giftCertificates.paymentInstructions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      paymentInstructions: e.target.value,
                    },
                  })
                }
                placeholder="To purchase a gift certificate, scan the QR code with your payment app and enter the desired amount..."
                rows={4}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Instructions for customers on how to use the payment QR code and what to expect after payment
              </p>
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
