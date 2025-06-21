"use client"

import { useState } from "react"
import { deleteBlogPost } from "@/app/actions/blog-posts"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import BlogPostCard from "@/components/BlogPostCard"
import type { BlogPost } from "@/types"

interface BlogPostListProps {
  initialPosts: BlogPost[]
}

export default function BlogPostList({ initialPosts }: BlogPostListProps) {
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter posts based on search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteBlogPost(postToDelete)

      if (result.success) {
        setPosts(posts.filter((post) => post.id !== postToDelete))
        toast({
          title: "Success",
          description: result.message,
        })
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
      setIsDeleting(false)
      setPostToDelete(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Input
          placeholder="Search posts by title, content, category, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{searchTerm ? "No posts match your search" : "No blog posts found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
