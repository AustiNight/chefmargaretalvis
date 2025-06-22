import { NextResponse } from "next/server";
import { getContentBySlug, isBlogPost, saveBlogPost, deleteBlogPost } from "@/utils/content";

// Utility to extract the slug from URL
function extractSlug(url: string): string {
  return new URL(url).pathname.split("/").pop() || "";
}

// GET – fetch a blog post by slug
export async function GET(request: Request) {
  const slug = extractSlug(request.url);
  const post = getContentBySlug(slug);
  if (!post || !isBlogPost(post)) {
    // Not found or not a BlogPost – return 404 JSON
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

// PUT – update an existing blog post by slug
export async function PUT(request: Request) {
  const slug = extractSlug(request.url);
  try {
    const postData = await request.json();
    // Basic validation
    if (!postData.title || !postData.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    if (postData.slug !== slug) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 });
    }
    const updatedPost = saveBlogPost(postData);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

// DELETE – remove a blog post by slug
export async function DELETE(request: Request) {
  const slug = extractSlug(request.url);
  try {
    const success = deleteBlogPost(slug);
    if (!success) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
