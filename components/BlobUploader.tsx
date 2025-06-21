"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, File, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BlobUploaderProps {
  path?: string
  onUploadComplete?: (url: string) => void
  accept?: string
  maxSize?: number // in MB
}

export default function BlobUploader({
  path = "uploads",
  onUploadComplete,
  accept = "*/*",
  maxSize = 5, // 5MB default
}: BlobUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File size should be less than ${maxSize}MB`)
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Create form data for the upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("path", path)

      // Upload the file
      const response = await fetch("/api/blob/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data = await response.json()
      setUploadedUrl(data.url)

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully.",
      })

      if (onUploadComplete) {
        onUploadComplete(data.url)
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadError("Failed to upload file. Please try again.")

      toast({
        title: "Upload failed",
        description: "There was a problem uploading your file.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!uploadedUrl) return

    try {
      const response = await fetch(`/api/blob/delete?url=${encodeURIComponent(uploadedUrl)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      setUploadedUrl(null)

      toast({
        title: "File deleted",
        description: "Your file has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting file:", error)

      toast({
        title: "Delete failed",
        description: "There was a problem deleting your file.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        {/* File Upload */}
        <Label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50">
            <Upload size={16} />
            <span>{isUploading ? "Uploading..." : "Upload File"}</span>
            {isUploading && <Loader2 className="animate-spin ml-2" size={16} />}
          </div>
          <Input
            id="file-upload"
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </Label>

        {/* Error Message */}
        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

        {/* File Preview */}
        {uploadedUrl && (
          <div className="mt-4 p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <File size={20} />
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate max-w-xs"
                >
                  {uploadedUrl.split("/").pop()}
                </a>
              </div>
              <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
