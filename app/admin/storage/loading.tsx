import { Loader2 } from "lucide-react"

export default function StorageLoading() {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
      <h2 className="text-xl font-medium text-gray-600">Loading storage management...</h2>
    </div>
  )
}
