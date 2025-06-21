import { type NextRequest, NextResponse } from "next/server"
import { listBlobs } from "@/utils/blob"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get("prefix") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const result = await listBlobs(prefix, limit)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      blobs: result.blobs,
      success: true,
    })
  } catch (error) {
    console.error("Error in blob list API:", error)
    return NextResponse.json({ error: "Failed to list blobs" }, { status: 500 })
  }
}
