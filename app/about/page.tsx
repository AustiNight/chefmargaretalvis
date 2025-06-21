"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getSiteSettings } from "@/utils/siteSettings"

export default function About() {
  const [aboutTitle, setAboutTitle] = useState("About Chef Margaret Alvis")
  const [aboutContent, setAboutContent] = useState("")
  const [aboutImage, setAboutImage] = useState("/placeholder.svg")

  useEffect(() => {
    const settings = getSiteSettings()
    if (settings.aboutTitle) {
      setAboutTitle(settings.aboutTitle)
    }
    if (settings.aboutContent) {
      setAboutContent(settings.aboutContent)
    }
    if (settings.aboutImage) {
      setAboutImage(settings.aboutImage)
    }
  }, [])

  // Split the content into paragraphs
  const paragraphs = aboutContent.split("\n\n").filter((p) => p.trim() !== "")

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">{aboutTitle}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Image
            src={aboutImage || "/placeholder.svg"}
            alt={aboutTitle}
            width={500}
            height={500}
            className="rounded-lg"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
              target.onerror = null
            }}
          />
        </div>
        <div className="md:w-1/2">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
