// /utils/content.ts (PostgreSQL + Prisma version)

import { PrismaClient } from "@prisma/client"
import type { BlogPost, Recipe } from "@/types"

const prisma = new PrismaClient()

// Get all content
export async function getAllContent(): Promise<(BlogPost | Recipe)[]> {
  const [recipes, blogPosts] = await Promise.all([
    prisma.recipe.findMany(),
    prisma.blogPost.findMany(),
  ])
  return [...recipes, ...blogPosts].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  )
}

// Get content by slug
export async function getContentBySlug(slug: string): Promise<BlogPost | Recipe | null> {
  const recipe = await prisma.recipe.findUnique({ where: { slug } })
  if (recipe) return recipe

  const blogPost = await prisma.blogPost.findUnique({ where: { slug } })
  return blogPost || null
}

// Save new recipe
export async function saveRecipe(recipe: Omit<Recipe, "id">): Promise<Recipe> {
  return await prisma.recipe.create({ data: recipe })
}

// Save new blog post
export async function saveBlogPost(post: Omit<BlogPost, "id">): Promise<BlogPost> {
  return await prisma.blogPost.create({ data: post })
}

// Update recipe
export async function updateRecipe(recipe: Recipe): Promise<Recipe> {
  return await prisma.recipe.update({ where: { id: recipe.id }, data: recipe })
}

// Update blog post
export async function updateBlogPost(post: BlogPost): Promise<BlogPost> {
  return await prisma.blogPost.update({ where: { id: post.id }, data: post })
}

// Delete recipe
export async function deleteRecipe(id: string): Promise<void> {
  await prisma.recipe.delete({ where: { id } })
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<void> {
  await prisma.blogPost.delete({ where: { id } })
}

// Type guards
export function isBlogPost(data: any): data is BlogPost {
  return (
    data &&
    typeof data === "object" &&
    typeof data.title === "string" &&
    typeof data.slug === "string" &&
    typeof data.excerpt === "string"
  )
}

export function isRecipe(data: any): data is Recipe {
  return (
    data &&
    typeof data === "object" &&
    typeof data.title === "string" &&
    typeof data.slug === "string" &&
    Array.isArray(data.ingredients)
  )
}
