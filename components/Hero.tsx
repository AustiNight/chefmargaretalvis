"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getSiteSettings } from "@/utils/siteSettings"

export default function Hero() {
  console.log("🦸 Hero component rendering", { timestamp: new Date().toISOString() })

  const [title, setTitle] = useState("Chef Margaret Alvis")
  const [heroImage, setHeroImage] = useState("/placeholder.svg?height=1080&width=1920")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("🦸 Hero component mounted", { timestamp: new Date().toISOString() })

    try {
      console.log("🦸 Hero: Attempting to get site settings")
      const settings = getSiteSettings()
      console.log("🦸 Hero: Retrieved site settings", {
        hasTitle: !!settings.title,
        hasHeroImage: !!settings.heroImage,
      })

      if (settings.title) {
        setTitle(settings.title)
      }
      if (settings.heroImage) {
        setHeroImage(settings.heroImage)
      }
    } catch (error) {
      console.error("🚨 Error loading hero settings:", error)
      setError(error instanceof Error ? error.message : String(error))
    }

    // Add debug info to the page
    const debugOutput = document.getElementById("debug-output")
    if (debugOutput) {
      debugOutput.textContent += "\nHero component mounted"
    }
  }, [])

  console.log("🦸 Hero rendering with:", { title, heroImage, hasError: !!error })

  return (
    <div className="relative h-screen">
      {error && <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 z-50">Error: {error}</div>}

      <Image
        src={heroImage || "/placeholder.svg"}
        alt="Chef Margaret Alvis"
        fill
        style={{ objectFit: "cover" }}
        priority
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          console.error("🚨 Hero image failed to load, using fallback")
          const target = e.target as HTMLImageElement
          target.src = "/placeholder.svg?height=1080&width=1920"
          target.onerror = null
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold">{title}</h1>
          <p className="text-white text-xl md:text-2xl mt-4">Private Chef Services in Oak Cliff, Texas</p>
        </div>
      </div>
    </div>
  )
}
