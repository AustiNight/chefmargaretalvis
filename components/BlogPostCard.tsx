"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/types"

interface BlogPostCardProps {
  post: BlogPost
  onDelete: (id: string) => void
}

export default function BlogPostCard({ post, onDelete }: BlogPostCardProps) {
  const publishedDate = post.published_date instanceof Date ? post.published_date : new Date(post.published_date)

  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true })

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">{post.title}</CardTitle>
          {post.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          {timeAgo}
          {post.category && ` • ${post.category}`}
        </p>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        {post.featured_image && (
          <div className="mb-3">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
        <p className="text-sm line-clamp-3">{post.excerpt || post.content.substring(0, 150)}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex space-x-2">
          <Link
            href={`/admin/blog/edit/${post.slug}`}
            className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Edit
          </Link>
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20"
          >
            View
          </Link>
        </div>
        <button
          onClick={() => onDelete(post.id)}
          className="text-sm px-3 py-1 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20"
        >
          Delete
        </button>
      </CardFooter>
    </Card>
  )
}
