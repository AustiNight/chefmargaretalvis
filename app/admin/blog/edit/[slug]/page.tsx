import { notFound } from 'next/navigation';
import BlogPostForm from '@/components/BlogPostForm';
import { getBlogPost } from '@/lib/blog';  // Adjust import path as needed

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return {
    title: post 
      ? `Edit: ${post.title} - Chef Margaret Alvis` 
      : `Edit: Post Not Found - Chef Margaret Alvis`
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostForm post={post} mode="edit" />;
}
