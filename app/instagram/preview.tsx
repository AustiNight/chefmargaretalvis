"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, InstagramIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InstagramPreview() {
  const [isLoading, setIsLoading] = useState(false)

  const posts = [
    {
      id: "1",
      imageUrl: "/placeholder.svg?height=400&width=400&text=Instagram+Post+1",
      caption:
        "Preparing for tonight's private dinner. Can't wait to serve this beautiful dish! #chefalvis #privatechef #oakcliff",
      permalink: "#",
      timestamp: "2023-05-15T14:30:00Z",
    },
    {
      id: "2",
      imageUrl: "/placeholder.svg?height=400&width=400&text=Instagram+Post+2",
      caption:
        "Fresh ingredients from the local farmer's market for today's cooking class. #farmtotable #localingredients #cookingclass",
      permalink: "#",
      timestamp: "2023-05-10T09:15:00Z",
    },
    {
      id: "3",
      imageUrl: "/placeholder.svg?height=400&width=400&text=Instagram+Post+3",
      caption:
        "Behind the scenes at yesterday's catering event. What a wonderful celebration! #catering #eventfood #cheflife",
      permalink: "#",
      timestamp: "2023-05-05T18:45:00Z",
    },
    {
      id: "4",
      imageUrl: "/placeholder.svg?height=400&width=400&text=Instagram+Post+4",
      caption:
        "Experimenting with new dessert recipes in the kitchen today. This one's a winner! #dessert #pastry #sweettooth",
      permalink: "#",
      timestamp: "2023-04-28T11:20:00Z",
    },
    {
      id: "5",
      imageUrl: "/placeholder.svg?height=400&width=400&text=Instagram+Post+5",
      caption: "Teaching knife skills at today's cooking class. Safety first! #knifeskills #cookingclass #chefalvis",
      permalink: "#",
      timestamp: "2023-04-22T15:10:00Z",
    },
    {
      id: "6",
      imageUrl: "/placeholder.svg?height=400&width=400&text=Instagram+Post+6",
      caption:
        "A beautiful table setting for tonight's private dinner party. #tablesetting #privatechef #diningexperience",
      permalink: "#",
      timestamp: "2023-04-18T17:30:00Z",
    },
  ]

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
        <h1 className="text-4xl font-bold mb-4">Instagram Feed</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Follow me on Instagram for behind-the-scenes content and culinary inspiration.
        </p>

        <Button variant="outline" className="mt-4">
          <InstagramIcon className="mr-2 h-4 w-4" />
          Follow on Instagram
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden bg-gray-100 animate-pulse">
              <div className="w-full h-64"></div>
              <div className="p-4 h-16"></div>
            </div>
          ))}
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
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{formatDate(post.timestamp)}</p>
                <p className="text-sm line-clamp-3">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
