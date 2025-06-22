import { NextResponse } from "next/server";
import { getContentBySlug, isRecipe, saveRecipe, deleteRecipe } from "@/utils/content";

function extractSlug(url: string): string {
  return new URL(url).pathname.split("/").pop() || "";
}

export async function GET(request: Request) {
  const slug = extractSlug(request.url);
  const recipe = getContentBySlug(slug);
  if (!recipe || !isRecipe(recipe)) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }
  return NextResponse.json(recipe);
}

export async function PUT(request: Request) {
  const slug = extractSlug(request.url);
  try {
    const recipeData = await request.json();
    if (!recipeData.title || !recipeData.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    if (recipeData.slug !== slug) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 });
    }
    const updated = saveRecipe(recipeData);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json({ error: "Failed to update recipe" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const slug = extractSlug(request.url);
  try {
    const success = deleteRecipe(slug);
    if (!success) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
}
