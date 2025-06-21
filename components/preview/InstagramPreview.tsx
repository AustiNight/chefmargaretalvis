"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, InstagramIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InstagramPreview() {
  const posts = [
    {
      id: "1",
      imageUrl: "/placeholder.svg?height=300&width=300",
      caption: "Preparing for tonight's private dinner. Can't wait to serve this beautiful dish!",
      permalink: "#",
    },
    {
      id: "2",
      imageUrl: "/placeholder.svg?height=300&width=300",
      caption: "Fresh ingredients from the local farmer's market for today's cooking class.",
      permalink: "#",
    },
    {
      id: "3",
      imageUrl: "/placeholder.svg?height=300&width=300",
      caption: "Behind the scenes at yesterday's catering event. What a wonderful celebration!",
      permalink: "#",
    },
  ]

  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Instagram</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt="Instagram post"
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="View on Instagram"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-gray-700" />
                </a>
              </div>
              <div className="p-3">
                <p className="text-xs line-clamp-2">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/instagram">
            <Button variant="outline" size="sm">
              <InstagramIcon className="mr-2 h-4 w-4" />
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
