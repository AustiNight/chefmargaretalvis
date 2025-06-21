import BlogPostForm from "@/components/BlogPostForm"

export const metadata = {
  title: "Create New Blog Post - Chef Margaret Alvis",
}

export default function NewBlogPostPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
      <BlogPostForm />
    </div>
  )
}
