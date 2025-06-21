import { createEvent } from "../db/events"
import { createUser } from "../db/users"
import { createContactSubmission, createGiftCertificateSubmission } from "../db/form-submissions"
import { createRecipe } from "../db/recipes"
import { createBlogPost } from "../db/blog-posts"
import { saveSiteSettings } from "../db/site-settings"
import type { Event, User, FormSubmission, Recipe, BlogPost, SiteSettings } from "@/types"

// Helper function to get data from localStorage
function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error)
    return defaultValue
  }
}

// Migrate events from localStorage to database
export async function migrateEvents(): Promise<{ success: boolean; count: number }> {
  try {
    const events = getFromLocalStorage<Event[]>("events", [])
    let count = 0

    for (const event of events) {
      await createEvent({
        image: event.image,
        date: event.date,
        description: event.description,
      })
      count++
    }

    return { success: true, count }
  } catch (error) {
    console.error("Error migrating events:", error)
    return { success: false, count: 0 }
  }
}

// Migrate users from localStorage to database
export async function migrateUsers(): Promise<{ success: boolean; count: number }> {
  try {
    const users = getFromLocalStorage<User[]>("users", [])
    let count = 0

    for (const user of users) {
      await createUser({
        full_name: user.full_name,
        email: user.email,
        address: user.address,
        subscribe_newsletter: user.subscribe_newsletter,
        last_contacted_date: user.last_contacted_date,
        last_contacted_event_id: user.last_contacted_event_id,
        last_contacted_event_name: user.last_contacted_event_name,
      })
      count++
    }

    return { success: true, count }
  } catch (error) {
    console.error("Error migrating users:", error)
    return { success: false, count: 0 }
  }
}

// Migrate form submissions from localStorage to database
export async function migrateFormSubmissions(): Promise<{ success: boolean; count: number }> {
  try {
    const submissions = getFromLocalStorage<FormSubmission[]>("formSubmissions", [])
    let count = 0

    for (const submission of submissions) {
      if (submission.type === "contact") {
        await createContactSubmission({
          name: submission.name,
          email: submission.email,
          message: submission.message || "",
          contact_type: submission.contact_type as "general" | "booking",
          event_date: submission.event_date ? new Date(submission.event_date) : undefined,
          guests: submission.guests,
          service_type: submission.service_type,
        })
      } else if (submission.type === "gift-certificate") {
        await createGiftCertificateSubmission({
          name: submission.name,
          email: submission.email,
          message: submission.message,
          amount: submission.amount,
          custom_amount: submission.custom_amount,
          recipient_name: submission.recipient_name || "",
          recipient_email: submission.recipient_email || "",
          payment_app_username: submission.payment_app_username || "",
        })
      }
      count++
    }

    return { success: true, count }
  } catch (error) {
    console.error("Error migrating form submissions:", error)
    return { success: false, count: 0 }
  }
}

// Migrate recipes from localStorage to database
export async function migrateRecipes(): Promise<{ success: boolean; count: number }> {
  try {
    const recipes = getFromLocalStorage<Recipe[]>("recipes", [])
    let count = 0

    for (const recipe of recipes) {
      await createRecipe({
        title: recipe.title,
        slug: recipe.slug,
        featured_image: recipe.featured_image,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
        servings: recipe.servings,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty as "easy" | "medium" | "hard",
        tags: recipe.tags,
        featured: recipe.featured,
      })
      count++
    }

    return { success: true, count }
  } catch (error) {
    console.error("Error migrating recipes:", error)
    return { success: false, count: 0 }
  }
}

// Migrate blog posts from localStorage to database
export async function migrateBlogPosts(): Promise<{ success: boolean; count: number }> {
  try {
    const posts = getFromLocalStorage<BlogPost[]>("blogPosts", [])
    let count = 0

    for (const post of posts) {
      await createBlogPost({
        title: post.title,
        slug: post.slug,
        featured_image: post.featured_image,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags,
        category: post.category,
        featured: post.featured,
      })
      count++
    }

    return { success: true, count }
  } catch (error) {
    console.error("Error migrating blog posts:", error)
    return { success: false, count: 0 }
  }
}

// Migrate site settings from localStorage to database
export async function migrateSiteSettings(): Promise<{ success: boolean }> {
  try {
    const settings = getFromLocalStorage<SiteSettings>("siteSettings", {} as SiteSettings)

    if (Object.keys(settings).length > 0) {
      await saveSiteSettings(settings)
      return { success: true }
    }

    return { success: false }
  } catch (error) {
    console.error("Error migrating site settings:", error)
    return { success: false }
  }
}

// Migrate all data from localStorage to database
export async function migrateAllData(): Promise<{
  events: { success: boolean; count: number }
  users: { success: boolean; count: number }
  formSubmissions: { success: boolean; count: number }
  recipes: { success: boolean; count: number }
  blogPosts: { success: boolean; count: number }
  siteSettings: { success: boolean }
}> {
  const events = await migrateEvents()
  const users = await migrateUsers()
  const formSubmissions = await migrateFormSubmissions()
  const recipes = await migrateRecipes()
  const blogPosts = await migrateBlogPosts()
  const siteSettings = await migrateSiteSettings()

  return {
    events,
    users,
    formSubmissions,
    recipes,
    blogPosts,
    siteSettings,
  }
}
