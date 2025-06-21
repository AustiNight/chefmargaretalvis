import { notFound } from "next/navigation"
import { getBlogPost } from "@/app/actions/blog-posts"
import BlogPostForm from "@/components/BlogPostForm"

interface EditBlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: EditBlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Blog Post Not Found - Chef Margaret Alvis",
    }
  }

  return {
    title: `Edit: ${post.title} - Chef Margaret Alvis`,
  }
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      <BlogPostForm post={post} isEditing={true} />
    </div>
  )
}
