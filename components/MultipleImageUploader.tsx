"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MultipleImageUploaderProps {
  id: string
  label: string
  currentImages: string[]
  onImagesChange: (urls: string[]) => void
  maxImages?: number
  className?: string
}

export function MultipleImageUploader({
  id,
  label,
  currentImages = [],
  onImagesChange,
  maxImages = 10,
  className,
}: MultipleImageUploaderProps) {
  const [newImageUrl, setNewImageUrl] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleAddImage = () => {
    if (!newImageUrl) {
      setError("Please enter an image URL")
      return
    }

    if (currentImages.length >= maxImages) {
      setError(`You can only add up to ${maxImages} images`)
      return
    }

    if (currentImages.includes(newImageUrl)) {
      setError("This image is already in the gallery")
      return
    }

    const updatedImages = [...currentImages, newImageUrl]
    onImagesChange(updatedImages)
    setNewImageUrl("")
    setError(null)
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...currentImages]
    updatedImages.splice(index, 1)
    onImagesChange(updatedImages)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddImage()
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Label htmlFor={id}>{label}</Label>

      {/* Current images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new image */}
      {currentImages.length < maxImages && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              id={id}
              type="text"
              placeholder="Enter image URL"
              value={newImageUrl}
              onChange={(e) => {
                setNewImageUrl(e.target.value)
                setError(null)
              }}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddImage} className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-sm text-muted-foreground">
            {currentImages.length} of {maxImages} images added
          </p>
        </div>
      )}
    </div>
  )
}
