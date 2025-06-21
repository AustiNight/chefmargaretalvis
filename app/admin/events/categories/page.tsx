"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import {
  getAllEventCategoriesAction,
  createEventCategoryAction,
  updateEventCategoryAction,
  deleteEventCategoryAction,
} from "@/app/actions/event-categories"
import { PencilIcon, TrashIcon, XCircleIcon, CheckCircleIcon, PlusCircle } from "lucide-react"
import type { EventCategory } from "@/types"

export default function EventCategoriesPage() {
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#6366f1",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const fetchedCategories = await getAllEventCategoriesAction()
      setCategories(fetchedCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCategory = (category: EventCategory) => {
    setEditingCategory({ ...category })
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingCategory) return

    setIsUpdating(true)

    try {
      const formData = new FormData()
      formData.append("name", editingCategory.name)
      formData.append("slug", editingCategory.slug)
      formData.append("description", editingCategory.description || "")
      formData.append("color", editingCategory.color || "")

      const result = await updateEventCategoryAction(editingCategory.id, formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      await loadCategories()
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      })
      setEditingCategory(null)
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        const result = await deleteEventCategoryAction(id)

        if (!result.success) {
          throw new Error(result.error)
        }

        await loadCategories()
        toast({
          title: "Category deleted",
          description: "The category has been deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting category:", error)
        toast({
          title: "Error",
          description: "There was a problem deleting the category. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const formData = new FormData()
      formData.append("name", newCategory.name)
      formData.append("slug", newCategory.slug)
      formData.append("description", newCategory.description)
      formData.append("color", newCategory.color)

      const result = await createEventCategoryAction(formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      await loadCategories()
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      })

      // Reset form
      setNewCategory({
        name: "",
        slug: "",
        description: "",
        color: "#6366f1",
      })
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "There was a problem creating the category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleNameChange = (value: string) => {
    setNewCategory({
      ...newCategory,
      name: value,
      slug: value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    })
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Toaster />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Event Categories</h1>
        <div className="flex gap-2">
          <Link href="/admin/events">
            <Button variant="outline">Back to Events</Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Used in URLs. Auto-generated from name.</p>
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Badge style={{ backgroundColor: newCategory.color }}>Preview</Badge>
                  </div>
                </div>
                <Button type="submit" disabled={isCreating} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {isCreating ? "Creating..." : "Create Category"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No categories found. Create your first category using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <Card key={category.id} className="border-gray-200">
                      {editingCategory && editingCategory.id === category.id ? (
                        <CardContent className="pt-6">
                          <form onSubmit={handleUpdateCategory} className="space-y-4">
                            <div>
                              <Label htmlFor={`edit-name-${category.id}`}>Category Name</Label>
                              <Input
                                id={`edit-name-${category.id}`}
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`edit-slug-${category.id}`}>Slug</Label>
                              <Input
                                id={`edit-slug-${category.id}`}
                                value={editingCategory.slug}
                                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`edit-description-${category.id}`}>Description</Label>
                              <Textarea
                                id={`edit-description-${category.id}`}
                                value={editingCategory.description || ""}
                                onChange={(e) =>
                                  setEditingCategory({ ...editingCategory, description: e.target.value })
                                }
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`edit-color-${category.id}`}>Color</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id={`edit-color-${category.id}`}
                                  type="color"
                                  value={editingCategory.color || "#6366f1"}
                                  onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                                  className="w-16 h-10 p-1"
                                />
                                <Badge style={{ backgroundColor: editingCategory.color }}>Preview</Badge>
                              </div>
                            </div>
                            <div className="flex space-x-2 justify-end">
                              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                <XCircleIcon className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                              <Button type="submit" disabled={isUpdating}>
                                <CheckCircleIcon className="mr-2 h-4 w-4" />
                                {isUpdating ? "Updating..." : "Update Category"}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      ) : (
                        <CardContent className="flex items-center justify-between py-4">
                          <div className="flex items-center space-x-4">
                            <Badge style={{ backgroundColor: category.color || undefined }}>{category.name}</Badge>
                            <div>
                              <p className="text-sm text-muted-foreground">Slug: {category.slug}</p>
                              {category.description && <p className="text-sm mt-1">{category.description}</p>}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
