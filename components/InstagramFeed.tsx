"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getSiteSettings } from "@/lib/db/site-settings"
import { Skeleton } from "@/components/ui/skeleton"

type InstagramFeedProps = {
  limit?: number
  showViewAll?: boolean
}

export default function InstagramFeed({ limit = 6, showViewAll = false }: InstagramFeedProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Get Instagram settings from database
        const siteSettings = await getSiteSettings()
        setSettings(siteSettings?.instagram || {})

        // For now, use placeholder images since we don't have actual Instagram API integration
        const placeholderPosts = Array.from({ length: limit }, (_, i) => ({
          id: `post-${i}`,
          image: `/placeholder.svg?height=600&width=600&query=food+${i}`,
          caption: `Delicious dish #${i + 1}. #food #cooking #chef`,
          url: `https://instagram.com/p/placeholder-${i}`,
        }))

        setPosts(placeholderPosts)
      } catch (err) {
        console.error("Error fetching Instagram feed:", err)
        setError("Failed to load Instagram feed")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square group overflow-hidden">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.caption || "Instagram post"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {settings?.showCaptions && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-end">
                <p className="text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm line-clamp-3">
                  {post.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showViewAll && (
        <div className="mt-8 text-center">
          <Link
            href="/instagram"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View All Posts
          </Link>
        </div>
      )}
    </>
  )
}
