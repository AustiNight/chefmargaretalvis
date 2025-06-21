"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Palette, Check, Paintbrush, Sliders, Layout } from "lucide-react"

export default function AdminThemePreview() {
  const [preset, setPreset] = useState("classic")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  // Sample colors for the theme presets
  const presetColors = {
    classic: {
      primary: "#4A5568",
      secondary: "#718096",
      accent: "#F56565",
      background: "#FFFFFF",
      text: "#1A202C",
    },
    modern: {
      primary: "#3182CE",
      secondary: "#63B3ED",
      accent: "#F6AD55",
      background: "#F7FAFC",
      text: "#2D3748",
    },
    elegant: {
      primary: "#805AD5",
      secondary: "#B794F4",
      accent: "#F687B3",
      background: "#FFFAF0",
      text: "#2D3748",
    },
  }

  const currentColors = presetColors[preset as keyof typeof presetColors]

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Theme Management</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
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
                      value={preset}
                      onValueChange={setPreset}
                      className="grid grid-cols-1 gap-4"
                    >
                      {Object.entries(presetColors).map(([key, colors]) => (
                        <div key={key} className="relative">
                          <RadioGroupItem value={key} id={`preset-${key}`} className="peer sr-only" />
                          <Label
                            htmlFor={`preset-${key}`}
                            className="flex flex-col items-start p-4 border rounded-md cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          >
                            <div className="flex justify-between w-full">
                              <span className="text-lg font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                              {preset === key && <Check className="h-5 w-5 text-primary" />}
                            </div>
                            <span className="text-sm text-gray-500 mt-1">
                              {key === "classic" 
                                ? "A timeless design with elegant typography and a warm color palette" 
                                : key === "modern"
                                  ? "A clean, contemporary design with vibrant colors and smooth edges"
                                  : "  contemporary design with vibrant colors and smooth edges"\
                                  : "A sophisticated design with serif fonts and a refined color palette"}
                            </span>
                            <div className="flex mt-3 space-x-2">
                              {Object.values(colors).map((color, index) => (
                                <div
                                  key={index}
                                  className="h-6 w-6 rounded-full border"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
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
                          style={{ backgroundColor: currentColors.primary }}
                        />
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={currentColors.primary}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={currentColors.primary}
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor" className="flex items-center">
                        Secondary Color
                        <div
                          className="ml-2 h-4 w-4 rounded-full border"
                          style={{ backgroundColor: currentColors.secondary }}
                        />
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={currentColors.secondary}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={currentColors.secondary}
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accentColor" className="flex items-center">
                        Accent Color
                        <div
                          className="ml-2 h-4 w-4 rounded-full border"
                          style={{ backgroundColor: currentColors.accent }}
                        />
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="accentColor"
                          type="color"
                          value={currentColors.accent}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={currentColors.accent}
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
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="Inter, sans-serif">Inter (Sans-serif)</option>
                        <option value="Montserrat, sans-serif">Montserrat (Sans-serif)</option>
                        <option value="Playfair Display, serif">Playfair Display (Serif)</option>
                        <option value="Merriweather, serif">Merriweather (Serif)</option>
                      </select>
                      <p className="text-sm text-gray-500 mt-1">
                        Sample: <span style={{ fontFamily: "Inter, sans-serif" }}>This is a heading</span>
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="bodyFont">Body Font</Label>
                      <select
                        id="bodyFont"
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="Inter, sans-serif">Inter (Sans-serif)</option>
                        <option value="Roboto, sans-serif">Roboto (Sans-serif)</option>
                        <option value="Merriweather, serif">Merriweather (Serif)</option>
                        <option value="Open Sans, sans-serif">Open Sans (Sans-serif)</option>
                      </select>
                      <p className="text-sm text-gray-500 mt-1">
                        Sample: <span style={{ fontFamily: "Inter, sans-serif" }}>This is body text</span>
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
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="compact">Compact (Less space between elements)</option>
                        <option value="normal">Normal (Standard spacing)</option>
                        <option value="spacious">Spacious (More breathing room)</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button className="w-full">Save Theme Settings</Button>
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
              
              {/* Theme Preview */}
              <div 
                className="border shadow-sm p-6 rounded-lg"
                style={{ 
                  backgroundColor: currentColors.background,
                  color: currentColors.text,
                  maxWidth: previewMode === "mobile" ? "375px" : "100%",
                  margin: "0 auto"
                }}
              >
                <h2 style={{ color: currentColors.primary }} className="text-2xl font-bold mb-4">
                  Theme Preview
                </h2>
                <p className="mb-4">This is how your website will look with the selected theme settings.</p>
                <p className="mb-6">
                  Primary color is used for <span style={{ color: currentColors.primary }}>headings and buttons</span>, 
                  secondary color for <span style={{ color: currentColors.secondary }}>supporting elements</span>, 
                  and accent color for <span style={{ color: currentColors.accent }}>highlights and calls to action</span>.
                </p>
                <div className="flex space-x-4 mb-6">
                  <button style={{ backgroundColor: currentColors.primary, color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none" }}>
                    Primary Button
                  </button>
                  <button style={{ backgroundColor: currentColors.secondary, color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none" }}>
                    Secondary Button
                  </button>
                  <button style={{ backgroundColor: currentColors.accent, color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "none" }}>
                    Accent Button
                  </button>
                </div>
                <div
                  style={{
                    backgroundColor: currentColors.secondary,
                    color: "#fff",
                    padding: "1rem",
                    borderRadius: "0.375rem",
                  }}
                  className="mb-4"
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
