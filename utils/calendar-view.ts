import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import type { Event } from "@/types"

// Get all days in a month including days from previous/next month to fill the calendar grid
export function getCalendarDays(date: Date): Date[] {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
}

// Get events for a specific day
export function getEventsForDay(day: Date, events: Event[]): Event[] {
  return events.filter((event) => {
    const eventDate = new Date(event.date)
    return isSameDay(day, eventDate)
  })
}

// Check if a day is in the current month
export function isCurrentMonth(day: Date, currentMonth: Date): boolean {
  return isSameMonth(day, currentMonth)
}

// Format date for display
export function formatDay(date: Date): string {
  return format(date, "d")
}

// Format month and year for display
export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy")
}

// Get next month
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1)
}

// Get previous month
export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1)
}

// Get a list of months for dropdown selection
export function getMonthOptions(): { value: number; label: string }[] {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2000, i, 1), "MMMM"),
  }))
}

// Get a list of years for dropdown selection (current year +/- 5 years)
export function getYearOptions(): { value: number; label: string }[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i
    return {
      value: year,
      label: year.toString(),
    }
  })
}
