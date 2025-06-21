"use client"

import type React from "react"

import { Inter } from "next/font/google"
import Header from "@/components/preview/Header"
import Footer from "@/components/preview/Footer"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayoutPreview({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
