// /utils/content.ts
import type { BlogPost, Recipe } from "@/types";
import { v4 as uuidv4 } from "uuid"
// ... (other utility functions like getContentBySlug, saveBlogPost, saveRecipe, etc.) ...

// Get all content (recipes and blog posts combined)
export function getAllContent(): ContentType[] {
  const recipes = getRecipes()
  const blogPosts = getBlogPosts()

  return [...recipes, ...blogPosts].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  )
}

// Get content by slug
export function getContentBySlug(slug: string): ContentType | undefined {
  const recipes = getRecipes()
  const blogPosts = getBlogPosts()

  return [...recipes, ...blogPosts].find((item) => item.slug === slug)
}

// Save a new recipe
export function saveRecipe(recipe: Omit<Recipe, "id">): Recipe {
  const newRecipe: Recipe = {
    ...recipe,
    id: uuidv4(),
  }

  const recipes = getRecipes()
  recipes.push(newRecipe)
  localStorage.setItem("recipes", JSON.stringify(recipes))

  return newRecipe
}

// Save a new blog post
export function saveBlogPost(post: Omit<BlogPost, "id">): BlogPost {
  const newPost: BlogPost = {
    ...post,
    id: uuidv4(),
  }

  const posts = getBlogPosts()
  posts.push(newPost)
  localStorage.setItem("blogPosts", JSON.stringify(posts))

  return newPost
}

// Update a recipe
export function updateRecipe(recipe: Recipe): void {
  const recipes = getRecipes()
  const updatedRecipes = recipes.map((r) => (r.id === recipe.id ? recipe : r))
  localStorage.setItem("recipes", JSON.stringify(updatedRecipes))
}

// Update a blog post
export function updateBlogPost(post: BlogPost): void {
  const posts = getBlogPosts()
  const updatedPosts = posts.map((p) => (p.id === post.id ? post : p))
  localStorage.setItem("blogPosts", JSON.stringify(updatedPosts))
}

// Delete a recipe
export function deleteRecipe(id: string): void {
  const recipes = getRecipes()
  const updatedRecipes = recipes.filter((r) => r.id !== id)
  localStorage.setItem("recipes", JSON.stringify(updatedRecipes))
}

// Delete a blog post
export function deleteBlogPost(id: string): void {
  const posts = getBlogPosts()
  const updatedPosts = posts.filter((p) => p.id !== id)
  localStorage.setItem("blogPosts", JSON.stringify(updatedPosts))
}
/**
 * Type guard to check if a given object is a BlogPost.
 * We assume BlogPost has at least 'title', 'slug', and 'excerpt' fields (excerpt is not present in Recipe).
 */
export function isBlogPost(data: any): data is BlogPost {
  return data 
    && typeof data === "object" 
    && typeof data.title === "string" 
    && typeof data.slug === "string" 
    && typeof data.excerpt === "string";
}

/**
 * Type guard to check if a given object is a Recipe.
 * We assume Recipe has at least 'title', 'slug', and 'ingredients' fields (ingredients array not present in BlogPost).
 */
export function isRecipe(data: any): data is Recipe {
  return data 
    && typeof data === "object" 
    && typeof data.title === "string" 
    && typeof data.slug === "string" 
    && Array.isArray(data.ingredients);
}


let fallbackRecipes: Recipe[] | null = null;
export function getRecipes(): Recipe[] {
  if (typeof window === "undefined") {
    if (!fallbackRecipes) {
      fallbackRecipes = [
      {
        id: "1",
        title: "Texas-Style Beef Brisket",
        slug: "texas-style-beef-brisket",
        featuredImage: "/placeholder.svg",
        description: "A classic Texas BBQ dish with a smoky, peppery bark and tender meat",
        ingredients: [
          "5-6 pound beef brisket, flat cut",
          "2 tablespoons kosher salt",
          "2 tablespoons coarse black pepper",
          "1 tablespoon garlic powder",
          "1 tablespoon onion powder",
        ],
        instructions: [
          "Trim excess fat from the brisket, leaving about 1/4 inch of fat cap",
          "Mix the salt, pepper, garlic powder, and onion powder in a bowl",
          "Rub the spice mixture all over the brisket",
          "Let the brisket sit at room temperature for 1 hour",
          "Preheat smoker to 225°F",
          "Smoke the brisket for 8-10 hours until internal temperature reaches 203°F",
          "Let rest for 30 minutes before slicing against the grain",
        ],
        prepTime: 30,
        cookTime: 600,
        servings: 8,
        cuisine: "Texan",
        difficulty: "medium",
        tags: ["beef", "bbq", "smoker", "texan", "dinner"],
        publishedDate: "2023-05-15T10:00:00Z",
        featured: true,
      },
      {
        id: "2",
        title: "Southern Peach Cobbler",
        slug: "southern-peach-cobbler",
        featuredImage: "/placeholder.svg",
        description: "A classic Southern dessert featuring sweet peaches and a buttery crust",
        ingredients: [
          "8 ripe peaches, peeled and sliced",
          "1 cup all-purpose flour",
          "1 cup sugar, divided",
          "1 teaspoon baking powder",
          "1/2 teaspoon salt",
          "1/2 cup cold butter, cubed",
          "1/4 cup boiling water",
          "Ground cinnamon",
        ],
        instructions: [
          "Preheat oven to 375°F",
          "Place peaches in a greased 8-inch square baking dish and sprinkle with 1/2 cup sugar",
          "In a bowl, combine flour, remaining sugar, baking powder, and salt",
          "Cut in butter until mixture resembles coarse crumbs",
          "Stir in water just until moistened",
          "Drop spoonfuls of dough over the peaches",
          "Sprinkle with cinnamon",
          "Bake for 45 minutes until golden brown",
        ],
        prepTime: 20,
        cookTime: 45,
        servings: 8,
        cuisine: "Southern",
        difficulty: "easy",
        tags: ["dessert", "peach", "southern", "baking"],
        publishedDate: "2023-06-20T14:00:00Z",
        featured: false,
      },  
      ];
    }
    return fallbackRecipes;
  }
  const stored = localStorage.getItem("recipes");
  return stored ? JSON.parse(stored) : [];
}

let fallbackBlogPosts: BlogPost[] | null = null;
export function getBlogPosts(): BlogPost[] {
  if (typeof window === "undefined") {
    if (!fallbackBlogPosts) {
      fallbackBlogPosts = [
      {
        id: "1",
        title: "5 Essential Kitchen Tools Every Home Chef Needs",
        slug: "essential-kitchen-tools",
        featuredImage: "/placeholder.svg",
        excerpt: "Discover the must-have tools that will elevate your cooking game and make meal preparation a breeze.",
        content: `
# 5 Essential Kitchen Tools Every Home Chef Needs

As a professional chef, I'm often asked what tools are absolutely essential in the kitchen. While there are many gadgets and appliances available, I believe in starting with a solid foundation. Here are the five tools I consider essential for any home chef:

## 1. A High-Quality Chef's Knife

Nothing is more fundamental than a good chef's knife. It doesn't need to be the most expensive one, but investing in a knife that feels comfortable in your hand and holds its edge well is crucial. A good 8-inch chef's knife can handle about 90% of your cutting tasks.

## 2. Cast Iron Skillet

A well-seasoned cast iron skillet is incredibly versatile. It can go from stovetop to oven, retains heat beautifully, and will last a lifetime with proper care. From perfect searing to baking cornbread, this is a true kitchen workhorse.

## 3. Digital Kitchen Scale

Precision matters in cooking, especially in baking. A digital kitchen scale ensures consistency in your recipes and helps you achieve professional results. It also makes it easier to follow recipes from around the world that use weight measurements.

## 4. Stainless Steel Mixing Bowls

A set of nesting stainless steel mixing bowls is indispensable. They're lightweight, durable, and perfect for everything from mixing batters to tossing salads. The variety of sizes ensures you always have the right bowl for the job.

## 5. Heat-Resistant Silicone Spatula

A good silicone spatula can be used for mixing, folding, scraping bowls clean, and won't melt when used with hot ingredients. Look for one with a sturdy handle and a flexible, heat-resistant head.

Remember, it's not always about having the most tools, but having the right ones. Master these essentials first, then gradually add specialized tools as you expand your cooking repertoire.

Happy cooking!
        `,
        publishedDate: "2023-04-10T09:00:00Z",
        tags: ["kitchen tools", "cooking tips", "equipment"],
        category: "Kitchen Essentials",
        featured: true,
      },
      {
        id: "2",
        title: "The Art of Food Plating: How to Make Your Dishes Look Professional",
        slug: "art-of-food-plating",
        featuredImage: "/placeholder.svg",
        excerpt:
          "Learn the techniques professional chefs use to transform ordinary meals into visually stunning culinary creations.",
        content: `
# The Art of Food Plating: How to Make Your Dishes Look Professional

They say we eat with our eyes first, and as a chef, I've found this to be absolutely true. Even the most delicious dish can be elevated by thoughtful presentation. Here are some professional techniques to make your home-cooked meals look as good as they taste:

## Choose the Right Canvas

Your plate is the canvas for your culinary creation. In general, white plates allow your food's colors to pop and provide a neutral background. Consider plate size as well—too large and your portion will look small; too small and the plate will appear crowded.

## The Rule of Odds

Odd numbers of elements tend to look more natural and appealing than even numbers. Try plating three scallops instead of four, or five asparagus spears instead of six.

## Create Height

Building vertical elements adds dimension to your dish. Try layering components or leaning items against each other. For example, slice a chicken breast and fan it over risotto, or place a protein atop a vegetable puree.

## Negative Space

Don't feel obligated to fill the entire plate. Leaving some empty space creates a more elegant, focused presentation. Think of it like the white space in a beautiful photograph.

## The Clock Method

For a balanced plate, think of it as a clock. Protein at 6 o'clock, starch at 2 o'clock, and vegetables at 10 o'clock gives a pleasing, balanced arrangement.

## Consider Color and Contrast

Complementary colors (opposite on the color wheel) create vibrant contrast. Think green herbs against red tomatoes or orange carrots against blue plates.

## Sauce with Purpose

Apply sauces thoughtfully rather than drowning your creation. Try drizzling, dotting, or creating a small pool as a base. Consider using squeeze bottles or the back of a spoon for more control.

## Finishing Touches

Fresh herbs, microgreens, edible flowers, or a light dusting of spices can add that final professional touch. These garnishes should be edible and relevant to the flavors in your dish.

With these simple techniques, you can transform your home cooking into restaurant-worthy presentations that will impress family and friends alike.
        `,
        publishedDate: "2023-03-15T11:30:00Z",
        tags: ["plating", "food presentation", "culinary arts"],
        category: "Culinary Techniques",
        featured: false,
      },  
      ];
    }
    return fallbackBlogPosts;
  }
  const stored = localStorage.getItem("blogPosts");
  return stored ? JSON.parse(stored) : [];
}

