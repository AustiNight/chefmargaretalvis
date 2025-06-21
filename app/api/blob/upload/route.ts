import { type NextRequest, NextResponse } from "next/server"
import { uploadBlob } from "@/utils/blob"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart form data
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("file") as File | null
      const path = (formData.get("path") as string) || "uploads"

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
      }

      // Generate a unique filename
      const uniqueId = uuidv4()
      const extension = file.name.split(".").pop()
      const fileName = `${path}/${uniqueId}.${extension}`

      const result = await uploadBlob(fileName, file)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({
        url: result.url,
        success: true,
      })
    } else {
      // Handle text/JSON content
      const body = await request.json()
      const { path, content } = body

      if (!path || !content) {
        return NextResponse.json({ error: "Path and content are required" }, { status: 400 })
      }

      const result = await uploadBlob(path, content)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({
        url: result.url,
        success: true,
      })
    }
  } catch (error) {
    console.error("Error in blob upload API:", error)
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 })
  }
}
