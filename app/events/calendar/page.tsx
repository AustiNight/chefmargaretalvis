import { EventCalendar } from "@/components/EventCalendar"

export const metadata = {
  title: "Event Calendar",
  description: "View upcoming events in a monthly calendar format",
}

export default function EventCalendarPage() {
  return (
    <div className="container mx-auto py-10">
      <EventCalendar />
    </div>
  )
}
