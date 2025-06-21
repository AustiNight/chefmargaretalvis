"use client"

import { useEffect, useState } from "react"
import GiftCertificates from "@/components/GiftCertificates"
import { getSiteSettings } from "@/utils/siteSettings"

export default function GiftCertificatesPage() {
  const [title, setTitle] = useState("Gift Certificates")

  useEffect(() => {
    const settings = getSiteSettings()
    if (settings.giftCertificates?.title) {
      setTitle(settings.giftCertificates.title)
    }
  }, [])

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <GiftCertificates />
    </div>
  )
}
