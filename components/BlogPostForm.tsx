"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createNewBlogPost, updateExistingBlogPost } from "@/app/actions/blog-posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import type { BlogPost } from "@/types"

interface BlogPostFormProps {
  post?: BlogPost
  isEditing?: boolean
}

export default function BlogPostForm({ post, isEditing = false }: BlogPostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [content, setContent] = useState(post?.content || "")
  const [category, setCategory] = useState(post?.category || "")
  const [tags, setTags] = useState(post?.tags?.join(", ") || "")
  const [featured, setFeatured] = useState(post?.featured || false)

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title && !slug) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      )
    }
  }, [title, slug, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("slug", slug)
      formData.append("featuredImage", featuredImage)
      formData.append("excerpt", excerpt)
      formData.append("content", content)
      formData.append("category", category)
      formData.append("tags", tags)
      formData.append("featured", featured.toString())

      let result

      if (isEditing && post?.id) {
        result = await updateExistingBlogPost(post.id, formData)
      } else {
        result = await createNewBlogPost(formData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/admin/blog")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="blog-post-slug" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featuredImage">Featured Image URL</Label>
        <Input
          id="featuredImage"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          placeholder="/food-blog.png"
        />
        {featuredImage && (
          <div className="mt-2">
            <img
              src={featuredImage || "/placeholder.svg"}
              alt="Featured image preview"
              className="max-h-40 rounded-md object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A brief summary of the blog post"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Blog post content in Markdown format"
          rows={10}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Cooking Tips, Recipes, Personal"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., seasonal, cooking, tips"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
        <Label htmlFor="featured">Featured post</Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
