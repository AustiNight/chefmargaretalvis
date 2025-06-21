import { v4 as uuidv4 } from "uuid"

export type Event = {
  id: string
  image: string
  date: string
  description: string
  createdAt: string
}

// Get all events
export function getEvents(): Event[] {
  if (typeof window === "undefined") {
    return []
  }

  const storedEvents = localStorage.getItem("events")
  if (!storedEvents) {
    // Return default events for initial setup
    const defaultEvents = [
      {
        id: "1",
        image: "/placeholder.svg",
        date: "2023-06-15",
        description: "Summer Gala Dinner",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        image: "/placeholder.svg",
        date: "2023-07-04",
        description: "Independence Day BBQ",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("events", JSON.stringify(defaultEvents))
    return defaultEvents
  }

  try {
    return JSON.parse(storedEvents) as Event[]
  } catch (error) {
    console.error("Error parsing events:", error)
    return []
  }
}

// Save a new event
export function saveEvent(event: Omit<Event, "id" | "createdAt">): Event {
  const newEvent: Event = {
    ...event,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }

  const events = getEvents()
  events.push(newEvent)
  localStorage.setItem("events", JSON.stringify(events))
  return newEvent
}

// Update an existing event
export function updateEvent(event: Event): void {
  const events = getEvents()
  const updatedEvents = events.map((e) => (e.id === event.id ? event : e))
  localStorage.setItem("events", JSON.stringify(updatedEvents))
}

// Delete an event
export function deleteEvent(id: string): void {
  const events = getEvents()
  const updatedEvents = events.filter((e) => e.id !== id)
  localStorage.setItem("events", JSON.stringify(updatedEvents))
}
