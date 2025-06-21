"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet"
import { geocodeAddress } from "@/utils/geocoding"

// Fix for Leaflet marker icon issue in Next.js
const markerIcon = new Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Component to recenter the map when coordinates change
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap()
  map.setView(center, map.getZoom())
  return null
}

interface DynamicMapProps {
  address?: string
  coordinates?: { lat: number; lng: number }
  title?: string
  interactive?: boolean
  height?: string
  width?: string
  zoom?: number
  onLocationSelect?: (coordinates: { lat: number; lng: number }) => void
}

export function DynamicMap({
  address,
  coordinates,
  title = "Event Location",
  interactive = true,
  height = "400px",
  width = "100%",
  zoom = 15,
  onLocationSelect,
}: DynamicMapProps) {
  const [mapCoordinates, setMapCoordinates] = useState<[number, number] | null>(
    coordinates ? [coordinates.lat, coordinates.lng] : null,
  )
  const [isLoading, setIsLoading] = useState(!coordinates && !!address)
  const [error, setError] = useState<string | null>(null)
  const mapRef = useRef(null)

  // Geocode the address if provided
  useEffect(() => {
    if (address && !coordinates) {
      setIsLoading(true)
      setError(null)

      geocodeAddress(address)
        .then((result) => {
          if (result) {
            setMapCoordinates([result.lat, result.lng])
          } else {
            setError("Could not find coordinates for this address")
          }
        })
        .catch((err) => {
          console.error("Error geocoding address:", err)
          setError("Error finding location coordinates")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (coordinates) {
      setMapCoordinates([coordinates.lat, coordinates.lng])
      setIsLoading(false)
    }
  }, [address, coordinates])

  // Handle map click for interactive maps
  const handleMapClick = (e: any) => {
    if (interactive && onLocationSelect) {
      const { lat, lng } = e.latlng
      setMapCoordinates([lat, lng])
      onLocationSelect({ lat, lng })
    }
  }

  if (isLoading) {
    return (
      <div style={{ height, width }} className="flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  if (error || !mapCoordinates) {
    return (
      <div style={{ height, width }} className="flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500">{error || "No location information available"}</div>
      </div>
    )
  }

  return (
    <div style={{ height, width }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={mapCoordinates}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        onClick={handleMapClick}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={mapCoordinates} icon={markerIcon}>
          <Popup>{title}</Popup>
        </Marker>
        <ChangeView center={mapCoordinates} />
      </MapContainer>
    </div>
  )
}
