"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { File, Trash2, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Blob {
  url: string
  pathname: string
  contentType: string
  contentLength: number
  uploadedAt: string
}

interface BlobListProps {
  prefix?: string
  limit?: number
  onDelete?: () => void
}

export default function BlobList({ prefix = "", limit = 100, onDelete }: BlobListProps) {
  const [blobs, setBlobs] = useState<Blob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBlobs = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/blob/list?prefix=${encodeURIComponent(prefix)}&limit=${limit}`)

      if (!response.ok) {
        throw new Error("Failed to fetch blobs")
      }

      const data = await response.json()
      setBlobs(data.blobs || [])
    } catch (error) {
      console.error("Error fetching blobs:", error)
      setError("Failed to load files. Please try again.")

      toast({
        title: "Error",
        description: "Failed to load files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (url: string) => {
    try {
      const response = await fetch(`/api/blob/delete?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      // Remove the deleted blob from the list
      setBlobs(blobs.filter((blob) => blob.url !== url))

      toast({
        title: "File deleted",
        description: "Your file has been deleted successfully.",
      })

      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error("Error deleting file:", error)

      toast({
        title: "Delete failed",
        description: "There was a problem deleting your file.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchBlobs()
  }, [prefix, limit])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Files</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchBlobs} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : blobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No files found</div>
        ) : (
          <div className="space-y-2">
            {blobs.map((blob) => (
              <div key={blob.url} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <File className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  <div className="overflow-hidden">
                    <a
                      href={blob.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline truncate block"
                    >
                      {blob.pathname.split("/").pop()}
                    </a>
                    <div className="flex space-x-4 text-xs text-gray-500">
                      <span>{formatFileSize(blob.contentLength)}</span>
                      <span>{formatDate(blob.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(blob.url)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
