"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

interface HelpGuideProps {
  title: string
  children: React.ReactNode
}

export default function HelpGuide({ title, children }: HelpGuideProps) {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className="relative">
      <div className="absolute top-0 right-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center text-sm"
        >
          <Info className="w-4 h-4 mr-1" />
          {showGuide ? "Hide Guide" : "Show Guide"}
        </Button>
      </div>

      {showGuide && (
        <Card className="mt-8 border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">{title} Guide</h3>
            <div className="text-sm text-gray-700 space-y-4">{children}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
