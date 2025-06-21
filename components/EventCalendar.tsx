"use client"

import { useState, useEffect } from "react"
import { isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDay } from "@/components/CalendarDay"
import { getAllEventsAction } from "@/app/actions/events"
import { getAllEventCategoriesAction } from "@/app/actions/event-categories"
import {
  getCalendarDays,
  formatMonthYear,
  getNextMonth,
  getPreviousMonth,
  isCurrentMonth,
  getMonthOptions,
  getYearOptions,
} from "@/utils/calendar-view"
import type { Event, EventCategory } from "@/types"

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const calendarDays = getCalendarDays(currentDate)
  const monthOptions = getMonthOptions()
  const yearOptions = getYearOptions()

  useEffect(() => {
    loadEvents()
    loadCategories()
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const fetchedEvents = await getAllEventsAction()
      if (fetchedEvents && fetchedEvents.length > 0) {
        setEvents(fetchedEvents)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getAllEventCategoriesAction()
      setCategories(fetchedCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handlePreviousMonth = () => {
    setCurrentDate(getPreviousMonth(currentDate))
  }

  const handleNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate))
  }

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(Number.parseInt(month))
    setCurrentDate(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate)
    newDate.setFullYear(Number.parseInt(year))
    setCurrentDate(newDate)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? null : categoryId)
  }

  const filteredEvents = selectedCategory ? events.filter((event) => event.category_id === selectedCategory) : events

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.date)
      return isSameDay(day, eventDate)
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{formatMonthYear(currentDate)}</h1>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Select value={currentDate.getMonth().toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentDate.getFullYear().toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {categories.length > 0 && (
            <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-px mb-px">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center font-medium bg-muted">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-border">
            {calendarDays.map((day) => (
              <CalendarDay
                key={day.toString()}
                day={day}
                events={getEventsForDay(day)}
                isCurrentMonth={isCurrentMonth(day, currentDate)}
                isToday={isToday(day)}
              />
            ))}
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>Click on a day with events to see details.</p>
          </div>
        </>
      )}
    </div>
  )
}
