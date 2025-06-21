import Link from "next/link"
import { getBlogPosts } from "@/app/actions/blog-posts"
import { Button } from "@/components/ui/button"
import BlogPostList from "./blog-post-list"

export const metadata = {
  title: "Blog Management - Chef Margaret Alvis",
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage your blog posts</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <BlogPostList initialPosts={posts} />
    </div>
  )
}
