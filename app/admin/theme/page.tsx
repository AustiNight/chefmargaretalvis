"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import HelpGuide from "@/components/HelpGuide"
import { getSiteSettings, saveSiteSettings, type SiteSettings } from "@/utils/siteSettings"
import Link from "next/link"
import { Palette, Check, Paintbrush, Sliders, Layout } from "lucide-react"

// Define default theme settings to prevent undefined errors
const defaultTheme: SiteSettings["theme"] = {
  preset: "classic",
  colors: {
    primary: "#4A5568",
    secondary: "#718096",
    accent: "#F56565",
    background: "#FFFFFF",
    text: "#1A202C",
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  borderRadius: "medium",
  spacing: "normal",
  contentWidth: "normal",
  buttons: {
    style: "default",
    hoverEffect: "darken",
  },
  animations: "none",
}

export default function ThemeManagement() {
  const [settings, setSettings] = useState<SiteSettings["theme"]>(defaultTheme)
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const { toast } = useToast()

  // Load settings on component mount
  useEffect(() => {
    try {
      const siteSettings = getSiteSettings()
      if (siteSettings && siteSettings.theme) {
        setSettings(siteSettings.theme)
      }
    } catch (error) {
      console.error("Error loading theme settings:", error)
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Get current site settings and update theme
      const siteSettings = getSiteSettings()
      const updatedSettings = {
        ...siteSettings,
        theme: settings,
      }

      // Save settings
      saveSiteSettings(updatedSettings)

      // Show success message
      toast({
        title: "Theme settings saved",
        description: "Your theme settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving theme settings:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your theme settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePresetChange = (preset: string) => {
    // Define preset themes
    const presets: Record<string, any> = {
      classic: {
        preset: "classic",
        colors: {
          primary: "#4A5568", // Slate gray
          secondary: "#718096", // Light slate
          accent: "#F56565", // Coral red
          background: "#FFFFFF", // White
          text: "#1A202C", // Dark gray
        },
        fonts: {
          heading: "Inter, sans-serif",
          body: "Inter, sans-serif",
        },
        borderRadius: "medium",
        spacing: "normal",
      },
      modern: {
        preset: "modern",
        colors: {
          primary: "#3182CE", // Blue
          secondary: "#63B3ED", // Light blue
          accent: "#F6AD55", // Orange
          background: "#F7FAFC", // Very light gray
          text: "#2D3748", // Dark gray
        },
        fonts: {
          heading: "Montserrat, sans-serif",
          body: "Roboto, sans-serif",
        },
        borderRadius: "large",
        spacing: "spacious",
      },
      elegant: {
        preset: "elegant",
        colors: {
          primary: "#805AD5", // Purple
          secondary: "#B794F4", // Light purple
          accent: "#F687B3", // Pink
          background: "#FFFAF0", // Cream
          text: "#2D3748", // Dark gray
        },
        fonts: {
          heading: "Playfair Display, serif",
          body: "Merriweather, serif",
        },
        borderRadius: "small",
        spacing: "compact",
      },
    }

    // Update settings with the selected preset
    if (presets[preset]) {
      setSettings({
        ...settings,
        ...presets[preset],
      })
    }
  }

  const handleCustomColorChange = (colorKey: string, value: string) => {
    setSettings({
      ...settings,
      preset: "custom",
      colors: {
        ...settings.colors,
        [colorKey]: value,
      },
    })
  }

  const handleFontChange = (fontKey: string, value: string) => {
    setSettings({
      ...settings,
      fonts: {
        ...settings.fonts,
        [fontKey]: value,
      },
    })
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Toaster />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Theme Management</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="relative">
        <HelpGuide title="Theme Management">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">Understanding Theme Management</h4>
              <p>
                <strong>What:</strong> The Theme Management section allows you to customize the visual appearance of
                your website, including colors, fonts, and layout settings.
              </p>
              <p>
                <strong>Where:</strong> Changes made here affect the entire website's appearance for all visitors.
              </p>
              <p>
                <strong>When:</strong> Update your theme when you want to refresh your brand identity or create a new
                visual experience for your visitors.
              </p>
              <p>
                <strong>Why:</strong> A well-designed theme enhances user experience and helps establish your brand
                identity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Theme Presets</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Classic:</strong> A timeless design with elegant typography and a warm color palette. Ideal
                  for traditional culinary services.
                </li>
                <li>
                  <strong>Modern:</strong> A clean, contemporary design with vibrant colors and smooth edges. Perfect
                  for a fresh, innovative approach.
                </li>
                <li>
                  <strong>Elegant:</strong> A sophisticated design with serif fonts and a refined color palette. Great
                  for high-end culinary experiences.
                </li>
                <li>
                  <strong>Custom:</strong> Create your own unique theme by customizing colors, fonts, and layout
                  settings.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Color Settings</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Primary Color:</strong> Used for main elements like headings, buttons, and navigation.
                </li>
                <li>
                  <strong>Secondary Color:</strong> Used for supporting elements and backgrounds.
                </li>
                <li>
                  <strong>Accent Color:</strong> Used for highlights, calls to action, and important elements.
                </li>
                <li>
                  <strong>Background Color:</strong> The main background color of your website.
                </li>
                <li>
                  <strong>Text Color:</strong> The color of your main body text.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Layout Settings</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Border Radius:</strong> Controls how rounded corners appear throughout your site.
                </li>
                <li>
                  <strong>Spacing:</strong> Controls the amount of space between elements on your site.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Best Practices</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Choose colors that reflect your brand identity and culinary style.</li>
                <li>Ensure there's enough contrast between text and background colors for readability.</li>
                <li>Preview your theme on both desktop and mobile to ensure it looks good on all devices.</li>
                <li>Consider your target audience when selecting fonts and colors.</li>
              </ul>
            </div>
          </div>
        </HelpGuide>

        <h2 className="text-2xl font-bold mb-6">Theme Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Theme Settings
              </CardTitle>
              <CardDescription>
                Customize your website's appearance by selecting a preset theme or creating your own.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="presets" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="presets">Theme Presets</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                </TabsList>

                <TabsContent value="presets" className="space-y-6">
                  <div className="space-y-4">
                    <Label>Select a Theme Preset</Label>
                    <RadioGroup
                      value={settings.preset}
                      onValueChange={handlePresetChange}
                      className="grid grid-cols-1 gap-4"
                    >
                      {["classic", "modern", "elegant"].map((preset) => (
                        <div key={preset} className="relative">
                          <RadioGroupItem value={preset} id={`preset-${preset}`} className="peer sr-only" />
                          <Label
                            htmlFor={`preset-${preset}`}
                            className="flex flex-col items-start p-4 border rounded-md cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          >
                            <div className="flex justify-between w-full">
                              <span className="text-lg font-medium">
                                {preset.charAt(0).toUpperCase() + preset.slice(1)}
                              </span>
                              {settings.preset === preset && <Check className="h-5 w-5 text-primary" />}
                            </div>
                            <span className="text-sm text-gray-500 mt-1">
                              {preset === "classic"
                                ? "A timeless design with elegant typography and a warm color palette"
                                : preset === "modern"
                                  ? "A clean, contemporary design with vibrant colors and smooth edges"
                                  : "A sophisticated design with serif fonts and a refined color palette"}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="primaryColor" className="flex items-center">
                        Primary Color
                        <div
                          className="ml-2 h-4 w-4 rounded-full border"
                          style={{ backgroundColor: settings.colors.primary }}
                        />
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.colors.primary}
                          onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={settings.colors.primary}
                          onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor" className="flex items-center">
                        Secondary Color
                        <div
                          className="ml-2 h-4 w-4 rounded-full border"
                          style={{ backgroundColor: settings.colors.secondary }}
                        />
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={settings.colors.secondary}
                          onChange={(e) => handleCustomColorChange("secondary", e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={settings.colors.secondary}
                          onChange={(e) => handleCustomColorChange("secondary", e.target.value)}
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accentColor" className="flex items-center">
                        Accent Color
                        <div
                          className="ml-2 h-4 w-4 rounded-full border"
                          style={{ backgroundColor: settings.colors.accent }}
                        />
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="accentColor"
                          type="color"
                          value={settings.colors.accent}
                          onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={settings.colors.accent}
                          onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="backgroundColor" className="flex items-center">
                        Background Color
                        <div
                          className="ml-2 h-4 w-4 rounded-full border"
                          style={{ backgroundColor: settings.colors.background }}
                        />
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={settings.colors.background}
                          onChange={(e) => handleCustomColorChange("background", e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={settings.colors.background}
                          onChange={(e) => handleCustomColorChange("background", e.target.value)}
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="textColor" className="flex items-center">
                        Text Color
                        <div
                          className="ml-2 h-4 w-4 rounded-full border"
                          style={{ backgroundColor: settings.colors.text }}
                        />
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="textColor"
                          type="color"
                          value={settings.colors.text}
                          onChange={(e) => handleCustomColorChange("text", e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={settings.colors.text}
                          onChange={(e) => handleCustomColorChange("text", e.target.value)}
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="headingFont">Heading Font</Label>
                      <select
                        id="headingFont"
                        value={settings.fonts.heading}
                        onChange={(e) => handleFontChange("heading", e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="Inter, sans-serif">Inter (Sans-serif)</option>
                        <option value="Montserrat, sans-serif">Montserrat (Sans-serif)</option>
                        <option value="Playfair Display, serif">Playfair Display (Serif)</option>
                        <option value="Merriweather, serif">Merriweather (Serif)</option>
                        <option value="Roboto, sans-serif">Roboto (Sans-serif)</option>
                        <option value="Lora, serif">Lora (Serif)</option>
                      </select>
                      <p className="text-sm text-gray-500 mt-1">
                        Sample: <span style={{ fontFamily: settings.fonts.heading }}>This is a heading</span>
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="bodyFont">Body Font</Label>
                      <select
                        id="bodyFont"
                        value={settings.fonts.body}
                        onChange={(e) => handleFontChange("body", e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="Inter, sans-serif">Inter (Sans-serif)</option>
                        <option value="Roboto, sans-serif">Roboto (Sans-serif)</option>
                        <option value="Merriweather, serif">Merriweather (Serif)</option>
                        <option value="Open Sans, sans-serif">Open Sans (Sans-serif)</option>
                        <option value="Lora, serif">Lora (Serif)</option>
                        <option value="Source Sans Pro, sans-serif">Source Sans Pro (Sans-serif)</option>
                      </select>
                      <p className="text-sm text-gray-500 mt-1">
                        Sample: <span style={{ fontFamily: settings.fonts.body }}>This is body text</span>
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="borderRadius">Border Radius</Label>
                      <select
                        id="borderRadius"
                        value={settings.borderRadius}
                        onChange={(e) => setSettings({ ...settings, borderRadius: e.target.value as any })}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="none">None (Square corners)</option>
                        <option value="small">Small (Subtle rounding)</option>
                        <option value="medium">Medium (Moderate rounding)</option>
                        <option value="large">Large (Rounded corners)</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="spacing">Element Spacing</Label>
                      <select
                        id="spacing"
                        value={settings.spacing}
                        onChange={(e) => setSettings({ ...settings, spacing: e.target.value as any })}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="compact">Compact (Less space between elements)</option>
                        <option value="normal">Normal (Standard spacing)</option>
                        <option value="spacious">Spacious (More breathing room)</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="contentWidth">Content Width</Label>
                      <select
                        id="contentWidth"
                        value={settings.contentWidth}
                        onChange={(e) => setSettings({ ...settings, contentWidth: e.target.value as any })}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="narrow">Narrow (60rem / 960px)</option>
                        <option value="normal">Normal (65rem / 1040px)</option>
                        <option value="wide">Wide (75rem / 1200px)</option>
                        <option value="full">Full Width (100%)</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? "Saving..." : "Save Theme Settings"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Paintbrush className="mr-2 h-5 w-5" />
                Theme Preview
              </CardTitle>
              <CardDescription>See how your website will look with the current theme settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <div className="inline-flex rounded-md shadow-sm">
                  <Button
                    variant={previewMode === "desktop" ? "default" : "outline"}
                    className="rounded-r-none"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "default" : "outline"}
                    className="rounded-l-none"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Sliders className="h-4 w-4 mr-2" />
                    Mobile
                  </Button>
                </div>
              </div>

              {/* Simple Theme Preview */}
              <div
                className="border shadow-sm p-6 rounded-lg"
                style={{
                  backgroundColor: settings.colors.background,
                  color: settings.colors.text,
                  maxWidth: previewMode === "mobile" ? "375px" : "100%",
                  margin: "0 auto",
                  fontFamily: settings.fonts.body,
                }}
              >
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{
                    color: settings.colors.primary,
                    fontFamily: settings.fonts.heading,
                  }}
                >
                  Theme Preview
                </h2>
                <p className="mb-4">This is how your website will look with the selected theme settings.</p>
                <p className="mb-6">
                  Primary color is used for <span style={{ color: settings.colors.primary }}>headings and buttons</span>
                  , secondary color for <span style={{ color: settings.colors.secondary }}>supporting elements</span>,
                  and accent color for{" "}
                  <span style={{ color: settings.colors.accent }}>highlights and calls to action</span>.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    className="px-4 py-2 rounded text-white"
                    style={{
                      backgroundColor: settings.colors.primary,
                      borderRadius:
                        settings.borderRadius === "none"
                          ? "0"
                          : settings.borderRadius === "small"
                            ? "0.25rem"
                            : settings.borderRadius === "medium"
                              ? "0.5rem"
                              : "1rem",
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded text-white"
                    style={{
                      backgroundColor: settings.colors.secondary,
                      borderRadius:
                        settings.borderRadius === "none"
                          ? "0"
                          : settings.borderRadius === "small"
                            ? "0.25rem"
                            : settings.borderRadius === "medium"
                              ? "0.5rem"
                              : "1rem",
                    }}
                  >
                    Secondary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded text-white"
                    style={{
                      backgroundColor: settings.colors.accent,
                      borderRadius:
                        settings.borderRadius === "none"
                          ? "0"
                          : settings.borderRadius === "small"
                            ? "0.25rem"
                            : settings.borderRadius === "medium"
                              ? "0.5rem"
                              : "1rem",
                    }}
                  >
                    Accent Button
                  </button>
                </div>
                <div
                  className="p-4 text-white mb-4"
                  style={{
                    backgroundColor: settings.colors.secondary,
                    borderRadius:
                      settings.borderRadius === "none"
                        ? "0"
                        : settings.borderRadius === "small"
                          ? "0.25rem"
                          : settings.borderRadius === "medium"
                            ? "0.5rem"
                            : "1rem",
                  }}
                >
                  This is a sample card with the secondary color as background.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
