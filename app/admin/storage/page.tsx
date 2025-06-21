"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import BlobUploader from "@/components/BlobUploader"
import BlobList from "@/components/BlobList"

export default function StoragePage() {
  const [textContent, setTextContent] = useState("")
  const [textPath, setTextPath] = useState("articles/content.txt")
  const [isUploading, setIsUploading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { toast } = useToast()

  const handleTextUpload = async () => {
    if (!textContent || !textPath) {
      toast({
        title: "Error",
        description: "Please provide both content and path",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const response = await fetch("/api/blob/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: textPath,
          content: textContent,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload content")
      }

      const data = await response.json()

      toast({
        title: "Upload successful",
        description: "Your content has been uploaded successfully.",
      })

      // Refresh the blob list
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error uploading content:", error)

      toast({
        title: "Upload failed",
        description: "There was a problem uploading your content.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Storage Management</h1>

      <Tabs defaultValue="files" className="space-y-6">
        <TabsList>
          <TabsTrigger value="files">File Upload</TabsTrigger>
          <TabsTrigger value="text">Text Content</TabsTrigger>
          <TabsTrigger value="browse">Browse Files</TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload files to your storage. Supported file types include images, documents, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <BlobUploader path="uploads" onUploadComplete={() => setRefreshKey((prev) => prev + 1)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Upload Text Content</CardTitle>
              <CardDescription>
                Create and store text content such as articles, notes, or configuration files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-path">File Path</Label>
                  <Input
                    id="text-path"
                    value={textPath}
                    onChange={(e) => setTextPath(e.target.value)}
                    placeholder="articles/my-article.txt"
                  />
                  <p className="text-xs text-gray-500 mt-1">Specify the path where your content will be stored</p>
                </div>

                <div>
                  <Label htmlFor="text-content">Content</Label>
                  <Textarea
                    id="text-content"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter your content here..."
                    rows={10}
                  />
                </div>

                <Button onClick={handleTextUpload} disabled={isUploading || !textContent || !textPath}>
                  {isUploading ? "Uploading..." : "Upload Content"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browse">
          <BlobList key={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
