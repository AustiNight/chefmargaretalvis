"use server"

import { revalidatePath } from "next/cache"
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost as dbDeleteBlogPost,
} from "@/lib/db/blog-posts"
import type { BlogPost } from "@/types"

// Get all blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await getAllBlogPosts()
    return posts || []
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

// Get blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return await getBlogPostBySlug(slug)
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

// Create a new blog post
export async function createNewBlogPost(
  formData: FormData,
): Promise<{ success: boolean; message: string; post?: BlogPost }> {
  try {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const featuredImage = formData.get("featuredImage") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const tagsString = formData.get("tags") as string
    const featured = formData.get("featured") === "true"

    // Validate required fields
    if (!title || !slug || !content) {
      return {
        success: false,
        message: "Title, slug, and content are required",
      }
    }

    // Process tags
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    // Create new blog post
    const newPost = await createBlogPost({
      title,
      slug,
      featured_image: featuredImage,
      excerpt,
      content,
      tags,
      category,
      featured,
    })

    revalidatePath("/admin/blog")
    revalidatePath("/blog")

    return {
      success: true,
      message: "Blog post created successfully",
      post: newPost,
    }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return {
      success: false,
      message: `Failed to create blog post: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// Update an existing blog post
export async function updateExistingBlogPost(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; message: string; post?: BlogPost }> {
  try {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const featuredImage = formData.get("featuredImage") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const tagsString = formData.get("tags") as string
    const featured = formData.get("featured") === "true"

    // Validate required fields
    if (!title || !slug || !content) {
      return {
        success: false,
        message: "Title, slug, and content are required",
      }
    }

    // Process tags
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    // Update blog post
    const updatedPost = await updateBlogPost(id, {
      title,
      slug,
      featured_image: featuredImage,
      excerpt,
      content,
      tags,
      category,
      featured,
    })

    revalidatePath("/admin/blog")
    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)

    return {
      success: true,
      message: "Blog post updated successfully",
      post: updatedPost,
    }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return {
      success: false,
      message: `Failed to update blog post: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const success = await dbDeleteBlogPost(id)

    if (!success) {
      return {
        success: false,
        message: "Blog post not found",
      }
    }

    revalidatePath("/admin/blog")
    revalidatePath("/blog")

    return {
      success: true,
      message: "Blog post deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return {
      success: false,
      message: `Failed to delete blog post: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
