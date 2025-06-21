import { NextResponse } from "next/server"
import { getContentBySlug, isBlogPost, saveBlogPost, deleteBlogPost } from "@/utils/content"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  // Get blog post by slug
  const post = getContentBySlug(slug)

  if (!post || !isBlogPost(post)) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    const post = await request.json()

    // Validate blog post data
    if (!post.title || !post.content) {
      return NextResponse.json({ error: "Invalid blog post data" }, { status: 400 })
    }

    // Ensure slug matches
    if (post.slug !== slug) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 })
    }

    // Save blog post
    const updatedPost = saveBlogPost(post)

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    // Delete blog post
    const success = deleteBlogPost(slug)

    if (!success) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
