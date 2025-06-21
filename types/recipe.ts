export interface Recipe {
  id: string
  title: string
  slug: string
  featuredImage: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number // in minutes
  cookTime: number // in minutes
  servings: number
  cuisine: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  publishedDate: string
  featured: boolean
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  featuredImage: string
  excerpt: string
  content: string
  publishedDate: string
  tags: string[]
  category: string
  featured: boolean
}

export type ContentType = Recipe | BlogPost

export function isRecipe(content: ContentType): content is Recipe {
  return "ingredients" in content
}

export function isBlogPost(content: ContentType): content is BlogPost {
  return "content" in content
}
