"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload } from "lucide-react"

interface ImageUploaderProps {
  currentImageUrl: string
  onImageChange: (url: string) => void
  label: string
  id: string
}

export default function ImageUploader({ currentImageUrl, onImageChange, label, id }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState(currentImageUrl)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
    onImageChange(e.target.value)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file")
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Create form data for the upload
      const formData = new FormData()
      formData.append("file", file)

      // Upload the image
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      setImageUrl(data.url)
      onImageChange(data.url)
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex flex-col space-y-4">
        {/* URL Input */}
        <Input id={id} value={imageUrl} onChange={handleUrlChange} placeholder="Enter image URL or upload an image" />

        {/* File Upload */}
        <div className="flex items-center space-x-2">
          <Label htmlFor={`${id}-upload`} className="cursor-pointer">
            <div className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50">
              <Upload size={16} />
              <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
              {isUploading && <Loader2 className="animate-spin ml-2" size={16} />}
            </div>
            <Input
              id={`${id}-upload`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </Label>
        </div>

        {/* Error Message */}
        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

        {/* Image Preview */}
        {imageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Preview:</p>
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Preview"
              className="w-full max-w-xs h-32 object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
                e.currentTarget.onerror = null
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
