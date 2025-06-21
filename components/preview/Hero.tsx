"use client"

import Image from "next/image"

export default function Hero() {
  return (
    <div className="relative h-screen">
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt="Chef Margaret Alvis"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
          Chef Margaret Alvis
          <br />
          <span className="text-2xl md:text-3xl">Oak Cliff, Texas</span>
        </h1>
      </div>
    </div>
  )
}
