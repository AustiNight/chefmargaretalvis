import { sql } from "@/lib/db"
import type { SiteSettings } from "@/utils/siteSettings"

// Get site settings
export async function getSiteSettingsFromDB(): Promise<SiteSettings | null> {
  try {
    const [settings] = await sql<{ value: SiteSettings }[]>`
      SELECT value
      FROM site_settings
      WHERE key = 'site_settings'
    `

    return settings?.value || null
  } catch (error) {
    console.error("Error fetching site settings from database:", error)
    return null
  }
}

// Save site settings
export async function saveSiteSettingsToDB(settings: SiteSettings): Promise<boolean> {
  try {
    // Check if settings already exist
    const existingSettings = await getSiteSettingsFromDB()

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
    console.error("Error saving site settings to database:", error)
    return false
  }
}
