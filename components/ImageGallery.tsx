"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  alt?: string
  className?: string
}

export function ImageGallery({ images, alt = "Gallery image", className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious()
    } else if (e.key === "ArrowRight") {
      handleNext()
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main image */}
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${alt} ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full"
          onClick={() => setIsOpen(true)}
        >
          <Maximize2 className="h-5 w-5" />
          <span className="sr-only">View fullscreen</span>
        </Button>
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2",
                index === currentIndex ? "border-primary" : "border-transparent",
              )}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <div className="relative h-[80vh]">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${alt} ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                  <span className="sr-only">Previous image</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8" />
                  <span className="sr-only">Next image</span>
                </Button>
              </>
            )}
          </div>
          <div className="p-4 bg-black text-white">
            <p className="text-center text-sm">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
