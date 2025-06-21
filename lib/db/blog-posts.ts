import { sql, handleDbError } from "../db"
import type { BlogPost } from "@/types"

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await sql<BlogPost[]>`
      SELECT id, title, slug, featured_image, excerpt, content, 
             published_date, tags, category, featured
      FROM blog_posts
      ORDER BY published_date DESC
    `
    return posts
  } catch (error) {
    handleDbError(error, "fetch blog posts")
  }
}

// Get featured blog posts
export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const posts = await sql<BlogPost[]>`
      SELECT id, title, slug, featured_image, excerpt, content, 
             published_date, tags, category, featured
      FROM blog_posts
      WHERE featured = true
      ORDER BY published_date DESC
      LIMIT ${limit}
    `
    return posts
  } catch (error) {
    handleDbError(error, "fetch featured blog posts")
  }
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const [post] = await sql<BlogPost[]>`
      SELECT id, title, slug, featured_image, excerpt, content, 
             published_date, tags, category, featured
      FROM blog_posts
      WHERE slug = ${slug}
    `
    return post || null
  } catch (error) {
    handleDbError(error, "fetch blog post by slug")
  }
}

// Get blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const [post] = await sql<BlogPost[]>`
      SELECT id, title, slug, featured_image, excerpt, content, 
             published_date, tags, category, featured
      FROM blog_posts
      WHERE id = ${id}
    `
    return post || null
  } catch (error) {
    handleDbError(error, "fetch blog post by id")
  }
}

// Create a new blog post
export async function createBlogPost(post: Omit<BlogPost, "id" | "published_date">): Promise<BlogPost> {
  try {
    const [newPost] = await sql<BlogPost[]>`
      INSERT INTO blog_posts (
        title, slug, featured_image, excerpt, content, tags, category, featured
      )
      VALUES (
        ${post.title}, ${post.slug}, ${post.featured_image}, ${post.excerpt},
        ${post.content}, ${post.tags}, ${post.category}, ${post.featured}
      )
      RETURNING id, title, slug, featured_image, excerpt, content, 
                published_date, tags, category, featured
    `
    return newPost
  } catch (error) {
    handleDbError(error, "create blog post")
  }
}

// Update a blog post
export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
  try {
    // Build the SET clause dynamically based on provided fields
    const updates = []

    if (post.title) updates.push(`title = ${post.title}`)
    if (post.slug) updates.push(`slug = ${post.slug}`)
    if (post.featured_image) updates.push(`featured_image = ${post.featured_image}`)
    if (post.excerpt) updates.push(`excerpt = ${post.excerpt}`)
    if (post.content) updates.push(`content = ${post.content}`)
    if (post.tags) updates.push(`tags = ${post.tags}`)
    if (post.category) updates.push(`category = ${post.category}`)
    if (post.featured !== undefined) updates.push(`featured = ${post.featured}`)

    if (updates.length === 0) {
      throw new Error("No fields to update")
    }

    const [updatedPost] = await sql<BlogPost[]>`
      UPDATE blog_posts
      SET ${sql.raw(updates.join(", "))}
      WHERE id = ${id}
      RETURNING id, title, slug, featured_image, excerpt, content, 
                published_date, tags, category, featured
    `

    return updatedPost
  } catch (error) {
    handleDbError(error, "update blog post")
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM blog_posts
      WHERE id = ${id}
    `
    return result.count > 0
  } catch (error) {
    handleDbError(error, "delete blog post")
  }
}

// Get blog posts by category
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const posts = await sql<BlogPost[]>`
      SELECT id, title, slug, featured_image, excerpt, content, 
             published_date, tags, category, featured
      FROM blog_posts
      WHERE category = ${category}
      ORDER BY published_date DESC
    `
    return posts
  } catch (error) {
    handleDbError(error, "fetch blog posts by category")
  }
}

// Get blog posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const posts = await sql<BlogPost[]>`
      SELECT id, title, slug, featured_image, excerpt, content, 
             published_date, tags, category, featured
      FROM blog_posts
      WHERE ${tag} = ANY(tags)
      ORDER BY published_date DESC
    `
    return posts
  } catch (error) {
    handleDbError(error, "fetch blog posts by tag")
  }
}
