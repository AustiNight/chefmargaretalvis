import { NextResponse } from "next/server"
import { getContentBySlug, isRecipe, saveRecipe, deleteRecipe } from "@/utils/content"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  // Get recipe by slug
  const recipe = getContentBySlug(slug)

  if (!recipe || !isRecipe(recipe)) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
  }

  return NextResponse.json(recipe)
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    const recipe = await request.json()

    // Validate recipe data
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      return NextResponse.json({ error: "Invalid recipe data" }, { status: 400 })
    }

    // Ensure slug matches
    if (recipe.slug !== slug) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 })
    }

    // Save recipe
    const updatedRecipe = saveRecipe(recipe)

    return NextResponse.json(updatedRecipe)
  } catch (error) {
    console.error("Error updating recipe:", error)
    return NextResponse.json({ error: "Failed to update recipe" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    // Delete recipe
    const success = deleteRecipe(slug)

    if (!success) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 })
  }
}
