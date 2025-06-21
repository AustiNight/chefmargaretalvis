import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import type { Recipe, BlogPost, ContentType } from "@/types/recipe"

// Get all recipes
export async function getRecipesFromDB(): Promise<Recipe[]> {
  try {
    const recipes = await sql<Recipe[]>`
      SELECT 
        id, 
        title, 
        slug, 
        featured_image as "featuredImage", 
        description, 
        ingredients, 
        instructions, 
        prep_time as "prepTime", 
        cook_time as "cookTime", 
        servings, 
        cuisine, 
        difficulty, 
        tags, 
        published_date::text as "publishedDate", 
        featured
      FROM recipes
      ORDER BY published_date DESC
    `
    return recipes
  } catch (error) {
    console.error("Error fetching recipes from database:", error)
    return []
  }
}

// Get all blog posts
export async function getBlogPostsFromDB(): Promise<BlogPost[]> {
  try {
    const posts = await sql<BlogPost[]>`
      SELECT 
        id, 
        title, 
        slug, 
        featured_image as "featuredImage", 
        excerpt, 
        content, 
        published_date::text as "publishedDate", 
        tags, 
        category, 
        featured
      FROM blog_posts
      ORDER BY published_date DESC
    `
    return posts
  } catch (error) {
    console.error("Error fetching blog posts from database:", error)
    return []
  }
}

// Get all content (recipes and blog posts combined)
export async function getAllContentFromDB(): Promise<ContentType[]> {
  try {
    const recipes = await getRecipesFromDB()
    const blogPosts = await getBlogPostsFromDB()

    return [...recipes, ...blogPosts].sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
    )
  } catch (error) {
    console.error("Error fetching all content from database:", error)
    return []
  }
}

// Get content by slug
export async function getContentBySlugFromDB(slug: string): Promise<ContentType | null> {
  try {
    // Try to find a recipe with this slug
    const [recipe] = await sql<Recipe[]>`
      SELECT 
        id, 
        title, 
        slug, 
        featured_image as "featuredImage", 
        description, 
        ingredients, 
        instructions, 
        prep_time as "prepTime", 
        cook_time as "cookTime", 
        servings, 
        cuisine, 
        difficulty, 
        tags, 
        published_date::text as "publishedDate", 
        featured
      FROM recipes
      WHERE slug = ${slug}
    `

    if (recipe) return recipe

    // If no recipe found, try to find a blog post
    const [blogPost] = await sql<BlogPost[]>`
      SELECT 
        id, 
        title, 
        slug, 
        featured_image as "featuredImage", 
        excerpt, 
        content, 
        published_date::text as "publishedDate", 
        tags, 
        category, 
        featured
      FROM blog_posts
      WHERE slug = ${slug}
    `

    return blogPost || null
  } catch (error) {
    console.error("Error fetching content by slug from database:", error)
    return null
  }
}

// Save a new recipe
export async function saveRecipeToDB(recipe: Omit<Recipe, "id">): Promise<Recipe> {
  try {
    // Check if a recipe with this slug already exists
    const existingRecipe = await getContentBySlugFromDB(recipe.slug)

    if (existingRecipe && "ingredients" in existingRecipe) {
      // Update existing recipe
      const [updatedRecipe] = await sql<Recipe[]>`
        UPDATE recipes
        SET 
          title = ${recipe.title},
          featured_image = ${recipe.featuredImage},
          description = ${recipe.description},
          ingredients = ${sql.array(recipe.ingredients, "text")},
          instructions = ${sql.array(recipe.instructions, "text")},
          prep_time = ${recipe.prepTime},
          cook_time = ${recipe.cookTime},
          servings = ${recipe.servings},
          cuisine = ${recipe.cuisine},
          difficulty = ${recipe.difficulty},
          tags = ${sql.array(recipe.tags || [], "text")},
          published_date = ${recipe.publishedDate},
          featured = ${recipe.featured}
        WHERE id = ${existingRecipe.id}
        RETURNING 
          id, 
          title, 
          slug, 
          featured_image as "featuredImage", 
          description, 
          ingredients, 
          instructions, 
          prep_time as "prepTime", 
          cook_time as "cookTime", 
          servings, 
          cuisine, 
          difficulty, 
          tags, 
          published_date::text as "publishedDate", 
          featured
      `
      return updatedRecipe
    } else {
      // Add new recipe
      const id = uuidv4()
      const [newRecipe] = await sql<Recipe[]>`
        INSERT INTO recipes (
          id,
          title,
          slug,
          featured_image,
          description,
          ingredients,
          instructions,
          prep_time,
          cook_time,
          servings,
          cuisine,
          difficulty,
          tags,
          published_date,
          featured
        )
        VALUES (
          ${id},
          ${recipe.title},
          ${recipe.slug},
          ${recipe.featuredImage},
          ${recipe.description},
          ${sql.array(recipe.ingredients, "text")},
          ${sql.array(recipe.instructions, "text")},
          ${recipe.prepTime},
          ${recipe.cookTime},
          ${recipe.servings},
          ${recipe.cuisine},
          ${recipe.difficulty},
          ${sql.array(recipe.tags || [], "text")},
          ${recipe.publishedDate},
          ${recipe.featured}
        )
        RETURNING 
          id, 
          title, 
          slug, 
          featured_image as "featuredImage", 
          description, 
          ingredients, 
          instructions, 
          prep_time as "prepTime", 
          cook_time as "cookTime", 
          servings, 
          cuisine, 
          difficulty, 
          tags, 
          published_date::text as "publishedDate", 
          featured
      `
      return newRecipe
    }
  } catch (error) {
    console.error("Error saving recipe to database:", error)
    throw error
  }
}

// Save a new blog post
export async function saveBlogPostToDB(post: Omit<BlogPost, "id">): Promise<BlogPost> {
  try {
    // Check if a blog post with this slug already exists
    const existingPost = await getContentBySlugFromDB(post.slug)

    if (existingPost && "excerpt" in existingPost) {
      // Update existing blog post
      const [updatedPost] = await sql<BlogPost[]>`
        UPDATE blog_posts
        SET 
          title = ${post.title},
          featured_image = ${post.featuredImage},
          excerpt = ${post.excerpt},
          content = ${post.content},
          tags = ${sql.array(post.tags || [], "text")},
          category = ${post.category},
          published_date = ${post.publishedDate},
          featured = ${post.featured}
        WHERE id = ${existingPost.id}
        RETURNING 
          id, 
          title, 
          slug, 
          featured_image as "featuredImage", 
          excerpt, 
          content, 
          published_date::text as "publishedDate", 
          tags, 
          category, 
          featured
      `
      return updatedPost
    } else {
      // Add new blog post
      const id = uuidv4()
      const [newPost] = await sql<BlogPost[]>`
        INSERT INTO blog_posts (
          id,
          title,
          slug,
          featured_image,
          excerpt,
          content,
          tags,
          category,
          published_date,
          featured
        )
        VALUES (
          ${id},
          ${post.title},
          ${post.slug},
          ${post.featuredImage},
          ${post.excerpt},
          ${post.content},
          ${sql.array(post.tags || [], "text")},
          ${post.category},
          ${post.publishedDate},
          ${post.featured}
        )
        RETURNING 
          id, 
          title, 
          slug, 
          featured_image as "featuredImage", 
          excerpt, 
          content, 
          published_date::text as "publishedDate", 
          tags, 
          category, 
          featured
      `
      return newPost
    }
  } catch (error) {
    console.error("Error saving blog post to database:", error)
    throw error
  }
}

// Delete a recipe
export async function deleteRecipeFromDB(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM recipes
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error("Error deleting recipe from database:", error)
    return false
  }
}

// Delete a blog post
export async function deleteBlogPostFromDB(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM blog_posts
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error("Error deleting blog post from database:", error)
    return false
  }
}
