import { sql, handleDbError } from "../db"
import type { Recipe } from "@/types"

// Get all recipes
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const recipes = await sql<Recipe[]>`
      SELECT id, title, slug, featured_image, description, ingredients, instructions,
             prep_time, cook_time, servings, cuisine, difficulty, tags, published_date, featured
      FROM recipes
      ORDER BY published_date DESC
    `
    return recipes
  } catch (error) {
    handleDbError(error, "fetch recipes")
  }
}

// Get featured recipes
export async function getFeaturedRecipes(limit = 3): Promise<Recipe[]> {
  try {
    const recipes = await sql<Recipe[]>`
      SELECT id, title, slug, featured_image, description, ingredients, instructions,
             prep_time, cook_time, servings, cuisine, difficulty, tags, published_date, featured
      FROM recipes
      WHERE featured = true
      ORDER BY published_date DESC
      LIMIT ${limit}
    `
    return recipes
  } catch (error) {
    handleDbError(error, "fetch featured recipes")
  }
}

// Get recipe by slug
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const [recipe] = await sql<Recipe[]>`
      SELECT id, title, slug, featured_image, description, ingredients, instructions,
             prep_time, cook_time, servings, cuisine, difficulty, tags, published_date, featured
      FROM recipes
      WHERE slug = ${slug}
    `
    return recipe || null
  } catch (error) {
    handleDbError(error, "fetch recipe by slug")
  }
}

// Get recipe by ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const [recipe] = await sql<Recipe[]>`
      SELECT id, title, slug, featured_image, description, ingredients, instructions,
             prep_time, cook_time, servings, cuisine, difficulty, tags, published_date, featured
      FROM recipes
      WHERE id = ${id}
    `
    return recipe || null
  } catch (error) {
    handleDbError(error, "fetch recipe by id")
  }
}

// Create a new recipe
export async function createRecipe(recipe: Omit<Recipe, "id" | "published_date">): Promise<Recipe> {
  try {
    const [newRecipe] = await sql<Recipe[]>`
      INSERT INTO recipes (
        title, slug, featured_image, description, ingredients, instructions,
        prep_time, cook_time, servings, cuisine, difficulty, tags, featured
      )
      VALUES (
        ${recipe.title}, ${recipe.slug}, ${recipe.featured_image}, ${recipe.description},
        ${recipe.ingredients}, ${recipe.instructions}, ${recipe.prep_time}, ${recipe.cook_time},
        ${recipe.servings}, ${recipe.cuisine}, ${recipe.difficulty}, ${recipe.tags}, ${recipe.featured}
      )
      RETURNING id, title, slug, featured_image, description, ingredients, instructions,
                prep_time, cook_time, servings, cuisine, difficulty, tags, published_date, featured
    `
    return newRecipe
  } catch (error) {
    handleDbError(error, "create recipe")
  }
}

// Update a recipe
export async function updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
  try {
    // Build the SET clause dynamically based on provided fields
    const updates = []

    if (recipe.title) updates.push(`title = ${recipe.title}`)
    if (recipe.slug) updates.push(`slug = ${recipe.slug}`)
    if (recipe.featured_image) updates.push(`featured_image = ${recipe.featured_image}`)
    if (recipe.description) updates.push(`description = ${recipe.description}`)
    if (recipe.ingredients) updates.push(`ingredients = ${recipe.ingredients}`)
    if (recipe.instructions) updates.push(`instructions = ${recipe.instructions}`)
    if (recipe.prep_time !== undefined) updates.push(`prep_time = ${recipe.prep_time}`)
    if (recipe.cook_time !== undefined) updates.push(`cook_time = ${recipe.cook_time}`)
    if (recipe.servings !== undefined) updates.push(`servings = ${recipe.servings}`)
    if (recipe.cuisine) updates.push(`cuisine = ${recipe.cuisine}`)
    if (recipe.difficulty) updates.push(`difficulty = ${recipe.difficulty}`)
    if (recipe.tags) updates.push(`tags = ${recipe.tags}`)
    if (recipe.featured !== undefined) updates.push(`featured = ${recipe.featured}`)

    if (updates.length === 0) {
      throw new Error("No fields to update")
    }

    const [updatedRecipe] = await sql<Recipe[]>`
      UPDATE recipes
      SET ${sql.raw(updates.join(", "))}
      WHERE id = ${id}
      RETURNING id, title, slug, featured_image, description, ingredients, instructions,
                prep_time, cook_time, servings, cuisine, difficulty, tags, published_date, featured
    `

    return updatedRecipe
  } catch (error) {
    handleDbError(error, "update recipe")
  }
}

// Delete a recipe
export async function deleteRecipe(id: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM recipes
      WHERE id = ${id}
    `
    return result.count > 0
  } catch (error) {
    handleDbError(error, "delete recipe")
  }
}

// Get recipes by tag
export async function getRecipesByTag(tag: string): Promise<Recipe[]> {
  try {
    const recipes = await sql<Recipe[]>`
      SELECT id, title, slug, featured_image, description, ingredients, instructions,
             prep_time, cook_time, servings, cuisine, difficulty, tags, published_date, featured
      FROM recipes
      WHERE ${tag} = ANY(tags)
      ORDER BY published_date DESC
    `
    return recipes
  } catch (error) {
    handleDbError(error, "fetch recipes by tag")
  }
}
