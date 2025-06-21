import { getSiteSettings } from "./siteSettings"

export type InstagramPost = {
  id: string
  imageUrl: string
  caption: string
  permalink: string
  timestamp: string
}

// Cache for Instagram data
let instagramCache: {
  posts: InstagramPost[]
  timestamp: number
} | null = null

export async function fetchInstagramFeed(): Promise<InstagramPost[]> {
  const settings = getSiteSettings()
  const { accessToken, displayCount, cacheTime } = settings.instagram

  // If no access token, return placeholder data
  if (!accessToken) {
    return generatePlaceholderPosts(displayCount)
  }

  // Check if we have cached data that's still valid
  const now = Date.now()
  if (instagramCache && instagramCache.posts.length > 0 && now - instagramCache.timestamp < cacheTime * 60 * 1000) {
    return instagramCache.posts.slice(0, displayCount)
  }

  try {
    // Fetch data from Instagram API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${accessToken}`,
    )

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response from Instagram API")
    }

    // Transform the data
    const posts: InstagramPost[] = data.data.map((post: any) => ({
      id: post.id,
      imageUrl: post.media_url,
      caption: post.caption || "",
      permalink: post.permalink,
      timestamp: post.timestamp,
    }))

    // Update cache
    instagramCache = {
      posts,
      timestamp: now,
    }

    return posts.slice(0, displayCount)
  } catch (error) {
    console.error("Error fetching Instagram feed:", error)
    return generatePlaceholderPosts(displayCount)
  }
}

function generatePlaceholderPosts(count: number): InstagramPost[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: `placeholder-${index}`,
    imageUrl: "/placeholder.svg",
    caption: "Sample Instagram post. Connect your Instagram account in the admin settings.",
    permalink: "#",
    timestamp: new Date().toISOString(),
  }))
}
