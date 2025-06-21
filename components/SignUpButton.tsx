"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { getSiteSettings } from "@/lib/db/site-settings"

export default function SignUpButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [instructions, setInstructions] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSiteSettings()
        setInstructions(settings?.signUpInstructions || "")
      } catch (error) {
        console.error("Error loading signup instructions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  if (loading || !instructions) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        Sign Up for Updates
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">Sign Up for Updates</h3>
            <div dangerouslySetInnerHTML={{ __html: instructions }} />
          </div>
        </div>
      )}
    </>
  )
}
