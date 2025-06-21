"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ExternalLink, InstagramIcon } from "lucide-react"
import { getSiteSettings } from "@/utils/siteSettings"
import { fetchInstagramFeed, type InstagramPost } from "@/utils/instagramFeed"
import { Button } from "@/components/ui/button"

export default function Instagram() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    title: "Instagram Feed",
    subtitle: "Follow me on Instagram for behind-the-scenes content and culinary inspiration.",
    showCaptions: true,
  })

  useEffect(() => {
    const siteSettings = getSiteSettings()
    setSettings({
      title: siteSettings.instagram.title,
      subtitle: siteSettings.instagram.subtitle,
      showCaptions: siteSettings.instagram.showCaptions,
    })

    async function loadInstagramFeed() {
      setIsLoading(true)
      try {
        const feed = await fetchInstagramFeed()
        setPosts(feed)
        setError(null)
      } catch (err) {
        console.error("Error loading Instagram feed:", err)
        setError("Unable to load Instagram feed. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadInstagramFeed()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{settings.title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{settings.subtitle}</p>

        {siteSettings.socialMedia?.instagram && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.open(siteSettings.socialMedia.instagram, "_blank")}
          >
            <InstagramIcon className="mr-2 h-4 w-4" />
            Follow on Instagram
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden bg-gray-100 animate-pulse">
              <div className="w-full h-64"></div>
              {settings.showCaptions && <div className="p-4 h-16"></div>}
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.caption.substring(0, 50) || "Instagram post"}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="View on Instagram"
                >
                  <ExternalLink className="h-4 w-4 text-gray-700" />
                </a>
              </div>
              {settings.showCaptions && (
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-2">{formatDate(post.timestamp)}</p>
                  <p className="text-sm line-clamp-3">{post.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p>No Instagram posts found. Please check your Instagram settings in the admin dashboard.</p>
        </div>
      )}
    </div>
  )
}

function siteSettings() {
  return getSiteSettings()
}
