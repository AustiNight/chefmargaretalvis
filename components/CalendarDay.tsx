"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { Event } from "@/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CalendarDayProps {
  day: Date
  events: Event[]
  isCurrentMonth: boolean
  isToday: boolean
}

export function CalendarDay({ day, events, isCurrentMonth, isToday }: CalendarDayProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const hasEvents = events.length > 0

  return (
    <>
      <div
        className={cn(
          "min-h-[100px] p-2 border border-border hover:bg-accent/5 transition-colors",
          !isCurrentMonth && "opacity-40 bg-muted/20",
          isToday && "ring-2 ring-primary ring-inset",
          hasEvents && "cursor-pointer",
        )}
        onClick={() => hasEvents && setIsDialogOpen(true)}
      >
        <div className="flex justify-between items-start">
          <span className={cn("text-sm font-medium", isToday && "text-primary")}>{format(day, "d")}</span>
          {hasEvents && (
            <Badge variant="outline" className="text-xs">
              {events.length}
            </Badge>
          )}
        </div>
        {hasEvents && (
          <div className="mt-1 space-y-1 max-h-[80px] overflow-hidden">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="text-xs p-1 rounded bg-primary/10 truncate"
                style={{
                  backgroundColor: event.category?.color ? `${event.category.color}20` : undefined,
                  borderLeft: event.category?.color ? `3px solid ${event.category.color}` : undefined,
                }}
              >
                {event.title}
              </div>
            ))}
            {events.length > 2 && (
              <div className="text-xs text-muted-foreground text-center">+{events.length - 2} more</div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Events on {format(day, "MMMM d, yyyy")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative h-32 md:h-full">
                    <Image
                      src={(event.featured_image as string) || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      {event.category && (
                        <Badge style={{ backgroundColor: event.category.color || undefined }} className="text-white">
                          {event.category.name}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="line-clamp-2 text-sm mb-3">{event.description.replace(/<[^>]*>/g, "")}</div>
                    <Link href={`/events/${event.id}`} passHref>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
