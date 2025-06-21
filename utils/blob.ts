import { put, list, del, head } from "@vercel/blob"

/**
 * Upload content to Vercel Blob storage
 * @param path The path where the blob will be stored
 * @param content The content to store (string, Buffer, or File)
 * @param options Optional configuration
 * @returns The URL of the stored blob
 */
export async function uploadBlob(
  path: string,
  content: string | Buffer | File,
  options = { access: "public" as const },
) {
  try {
    const { url } = await put(path, content, options)
    return { url, success: true }
  } catch (error) {
    console.error("Error uploading to blob storage:", error)
    return { error: "Failed to upload content", success: false }
  }
}

/**
 * List blobs in a directory
 * @param prefix The directory prefix to list
 * @param limit Maximum number of blobs to return
 * @returns Array of blob objects
 */
export async function listBlobs(prefix: string, limit = 100) {
  try {
    const { blobs } = await list({ prefix, limit })
    return { blobs, success: true }
  } catch (error) {
    console.error("Error listing blobs:", error)
    return { error: "Failed to list blobs", success: false }
  }
}

/**
 * Delete a blob from storage
 * @param url The URL of the blob to delete
 * @returns Success status
 */
export async function deleteBlob(url: string) {
  try {
    await del(url)
    return { success: true }
  } catch (error) {
    console.error("Error deleting blob:", error)
    return { error: "Failed to delete blob", success: false }
  }
}

/**
 * Check if a blob exists
 * @param url The URL of the blob to check
 * @returns Blob metadata if it exists
 */
export async function checkBlob(url: string) {
  try {
    const blob = await head(url)
    return { blob, exists: true, success: true }
  } catch (error) {
    return { exists: false, success: false }
  }
}
