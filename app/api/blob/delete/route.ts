import { type NextRequest, NextResponse } from "next/server"
import { deleteBlob } from "@/utils/blob"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    const result = await deleteBlob(url)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error in blob delete API:", error)
    return NextResponse.json({ error: "Failed to delete blob" }, { status: 500 })
  }
}
