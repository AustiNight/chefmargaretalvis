import { sql, handleDbError, checkDatabaseConnection } from "@/lib/db"
import type { SiteSettings } from "@/types"

// Mock data to use when database is not available
const mockSiteSettings = {
  title: "Chef Margaret Alvis",
  description: "Private Chef Services in Oak Cliff, Texas",
  heroImage: "/chef-cooking.png",
  logo: "/chef-logo.png",
  primaryColor: "#4A90E2",
  secondaryColor: "#50E3C2",
  services: [
    {
      title: "Private Chef Services",
      description: "Customized dining experiences in the comfort of your home.",
      icon: "utensils",
    },
    {
      title: "Cooking Classes",
      description: "Learn culinary techniques and recipes in interactive sessions.",
      icon: "book-open",
    },
    {
      title: "Catering",
      description: "Full-service catering for events of all sizes.",
      icon: "users",
    },
  ],
}

// Get site settings
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Using mock data for site settings.")
      return mockSiteSettings
    }

    const settings = await sql<{ value: SiteSettings }[]>`
      SELECT value
      FROM site_settings
      WHERE key = 'site_settings'
    `

    if (settings.length === 0) {
      return mockSiteSettings
    }

    return settings[0].value
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return mockSiteSettings
  }
}

// Save site settings
export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  try {
    if (!checkDatabaseConnection()) {
      console.warn("Database connection not available. Unable to save site settings.")
      return false
    }

    // Check if settings already exist
    const existingSettings = await getSiteSettings()

    if (existingSettings) {
      // Update existing settings
      await sql`
        UPDATE site_settings
        SET value = ${JSON.stringify(settings)}::jsonb, updated_at = NOW()
        WHERE key = 'site_settings'
      `
    } else {
      // Insert new settings
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES ('site_settings', ${JSON.stringify(settings)}::jsonb)
      `
    }

    return true
  } catch (error) {
    handleDbError(error, "save site settings")
    return false
  }
}
