"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getAllEventCategoriesAction } from "@/app/actions/event-categories"
import type { EventCategory } from "@/types"

interface CategorySelectorProps {
  id: string
  label: string
  selectedCategoryId?: string
  onChange: (categoryId: string | undefined) => void
  className?: string
}

export function CategorySelector({ id, label, selectedCategoryId, onChange, className }: CategorySelectorProps) {
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true)
        const fetchedCategories = await getAllEventCategoriesAction()
        setCategories(fetchedCategories)
      } catch (err) {
        console.error("Error loading categories:", err)
        setError("Failed to load categories")
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleChange = (value: string) => {
    onChange(value === "none" ? undefined : value)
  }

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Select value={selectedCategoryId || "none"} onValueChange={handleChange} disabled={isLoading}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select a category">
            {selectedCategory ? (
              <Badge style={{ backgroundColor: selectedCategory.color || undefined }}>{selectedCategory.name}</Badge>
            ) : (
              "No category"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No category</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <Badge style={{ backgroundColor: category.color || undefined }}>{category.name}</Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
