"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSiteSettings, getThemeVariables } from "@/utils/siteSettings"

type ThemeContextType = {
  themeVariables: Record<string, string>
  refreshTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  themeVariables: {},
  refreshTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  console.log("🎨 ThemeProvider rendering", { timestamp: new Date().toISOString() })

  const [themeVariables, setThemeVariables] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const refreshTheme = () => {
    console.log("🎨 ThemeProvider: refreshTheme called")

    if (typeof window !== "undefined") {
      try {
        const settings = getSiteSettings()
        const variables = getThemeVariables(settings)
        setThemeVariables(variables)
        setError(null)

        // Apply CSS variables to root element
        Object.entries(variables).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value)
        })

        console.log("🎨 ThemeProvider: Theme refreshed successfully", {
          variableCount: Object.keys(variables).length,
        })
      } catch (error) {
        console.error("🚨 Error refreshing theme:", error)
        setError(error instanceof Error ? error.message : String(error))
      }
    }
  }

  useEffect(() => {
    console.log("🎨 ThemeProvider mounted", { timestamp: new Date().toISOString() })

    refreshTheme()

    // Add debug info to the page
    const debugOutput = document.getElementById("debug-output")
    if (debugOutput) {
      debugOutput.textContent += "\nThemeProvider mounted"
    }

    // Set up an interval to check for theme changes
    const interval = setInterval(() => {
      console.log("🎨 ThemeProvider: Checking for theme changes")
      refreshTheme()
    }, 5000)

    return () => {
      console.log("🎨 ThemeProvider unmounting")
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      {error && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "red",
            color: "white",
            padding: "5px",
            zIndex: 9999,
            textAlign: "center",
          }}
        >
          ThemeProvider Error: {error}
        </div>
      )}
      <ThemeContext.Provider value={{ themeVariables, refreshTheme }}>{children}</ThemeContext.Provider>
    </>
  )
}

export const useTheme = () => useContext(ThemeContext)
