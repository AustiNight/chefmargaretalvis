import { getEvents } from "@/utils/events"
import { getUsers, getNotificationHistory } from "@/utils/users"
import { getFormSubmissions } from "@/utils/formSubmissions"
import { getRecipes, getBlogPosts } from "@/utils/content"
import { getSiteSettings } from "@/utils/siteSettings"

import { saveEventToDB } from "@/utils/db/events"
import { saveUserToDB, saveNotificationToDB } from "@/utils/db/users"
import { saveFormSubmissionToDB } from "@/utils/db/formSubmissions"
import { saveRecipeToDB, saveBlogPostToDB } from "@/utils/db/content"
import { saveSiteSettingsToDB } from "@/utils/db/siteSettings"

export async function migrateDataToDatabase(): Promise<{
  success: boolean
  events: number
  users: number
  formSubmissions: number
  recipes: number
  blogPosts: number
  notifications: number
  siteSettings: boolean
}> {
  try {
    // Migrate events
    const events = getEvents()
    let eventCount = 0
    for (const event of events) {
      await saveEventToDB({
        image: event.image,
        date: event.date,
        description: event.description,
      })
      eventCount++
    }

    // Migrate users
    const users = getUsers()
    let userCount = 0
    for (const user of users) {
      await saveUserToDB({
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        subscribeNewsletter: user.subscribeNewsletter,
        lastContactedDate: user.lastContactedDate,
        lastContactedEventId: user.lastContactedEventId,
        lastContactedEventName: user.lastContactedEventName,
      })
      userCount++
    }

    // Migrate form submissions
    const formSubmissions = getFormSubmissions()
    let formSubmissionCount = 0
    for (const submission of formSubmissions) {
      await saveFormSubmissionToDB({
        type: submission.type,
        timestamp: submission.timestamp,
        name: submission.name,
        email: submission.email,
        message: submission.message,
        contactType: submission.contactType,
        date: submission.date,
        guests: submission.guests,
        serviceType: submission.serviceType,
        amount: submission.amount,
        customAmount: submission.customAmount,
        recipientName: submission.recipientName,
        recipientEmail: submission.recipientEmail,
        paymentAppUsername: submission.paymentAppUsername,
        isProcessed: submission.isProcessed,
      })
      formSubmissionCount++
    }

    // Migrate recipes
    const recipes = getRecipes()
    let recipeCount = 0
    for (const recipe of recipes) {
      await saveRecipeToDB({
        title: recipe.title,
        slug: recipe.slug,
        featuredImage: recipe.featuredImage,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        tags: recipe.tags,
        publishedDate: recipe.publishedDate,
        featured: recipe.featured,
      })
      recipeCount++
    }

    // Migrate blog posts
    const blogPosts = getBlogPosts()
    let blogPostCount = 0
    for (const post of blogPosts) {
      await saveBlogPostToDB({
        title: post.title,
        slug: post.slug,
        featuredImage: post.featuredImage,
        excerpt: post.excerpt,
        content: post.content,
        publishedDate: post.publishedDate,
        tags: post.tags,
        category: post.category,
        featured: post.featured,
      })
      blogPostCount++
    }

    // Migrate notification history
    const notifications = getNotificationHistory()
    let notificationCount = 0
    for (const notification of notifications) {
      await saveNotificationToDB({
        userId: notification.userId,
        eventId: notification.eventId,
        eventName: notification.eventName,
        sentDate: notification.sentDate,
        status: notification.status,
      })
      notificationCount++
    }

    // Migrate site settings
    const siteSettings = getSiteSettings()
    const siteSettingsSuccess = await saveSiteSettingsToDB(siteSettings)

    return {
      success: true,
      events: eventCount,
      users: userCount,
      formSubmissions: formSubmissionCount,
      recipes: recipeCount,
      blogPosts: blogPostCount,
      notifications: notificationCount,
      siteSettings: siteSettingsSuccess,
    }
  } catch (error) {
    console.error("Error migrating data to database:", error)
    throw error
  }
}
