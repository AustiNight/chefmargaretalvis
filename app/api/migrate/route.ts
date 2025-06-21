import { NextResponse } from "next/server"
import { migrateDataToDatabase } from "@/utils/migrateToDatabase"

export async function POST(request: Request) {
  try {
    const result = await migrateDataToDatabase()

    return NextResponse.json({
      success: true,
      message: "Data migration completed successfully",
      stats: result,
    })
  } catch (error) {
    console.error("Error in migration API route:", error)
    return NextResponse.json(
      { success: false, message: "Data migration failed", error: String(error) },
      { status: 500 },
    )
  }
}
