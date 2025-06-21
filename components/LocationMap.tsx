"use client"

import { MapPin } from "lucide-react"

interface LocationMapProps {
  address?: string
  coordinates?: { lat: number; lng: number }
  title?: string
  interactive?: boolean
  height?: string
  width?: string
  zoom?: number
  onLocationSelect?: (coordinates: { lat: number; lng: number }) => void
}

export default function LocationMap({
  address,
  coordinates,
  title = "Event Location",
  height = "400px",
  width = "100%",
}: LocationMapProps) {
  return (
    <div
      style={{ height, width }}
      className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 text-center"
    >
      <MapPin className="h-8 w-8 text-gray-400 mb-2" />
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {address && <p className="text-gray-500 mb-2">{address}</p>}
      {coordinates && (
        <p className="text-xs text-gray-400">
          {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </p>
      )}
      <div className="mt-4 text-sm text-gray-500">Map view is disabled in preview mode</div>
    </div>
  )
}
