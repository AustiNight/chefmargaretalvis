// /app/events/[id]/page.tsx
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { ImageGallery } from "@/components/ImageGallery";
import LocationMap from "@/components/LocationMap";
import type { Metadata } from "next";
import { getEventById } from "@/lib/db/events";  // (Assuming getEventById is defined in your lib)

interface EventPageProps {
  params: { id: string }
}

// Generate dynamic metadata (title) based on event data
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await getEventById(params.id);
  if (!event) {
    return { title: "Event Not Found – Chef Margaret Alvis" };
  }
  return { title: `${event.title} – Chef Margaret Alvis` };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventById(params.id);
  if (!event) {
    return (
      <div className="p-8">
        <h1>Event Not Found</h1>
        <Link href="/events" className="text-blue-600 hover:underline">
          <ArrowLeft className="inline mr-2" aria-hidden="true" />
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <Link href="/events" className="text-blue-600 hover:underline">
        <ArrowLeft className="inline mr-2" aria-hidden="true" />
        Back to Events
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-2">{event.title}</h1>
      {/* Event date, time, location */}
      <div className="text-gray-600 mb-6 flex items-center space-x-4">
        {event.date && (
          <span><Calendar className="inline mr-1" aria-hidden="true" /> {event.date}</span>
        )}
        {event.time && (
          <span><Clock className="inline mr-1" aria-hidden="true" /> {event.time}</span>
        )}
        {event.location && (
          <span><MapPin className="inline mr-1" aria-hidden="true" /> {event.location}</span>
        )}
      </div>

      {/* Image gallery for event (if any images) */}
      {event.images && event.images.length > 0 && (
        <ImageGallery images={event.images} className="mb-6" />
      )}

      {/* Event description (rendered as HTML content) */}
      <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: event.description }} />

      {/* Location map (only if location or coordinates are available) */}
      {(event.coordinates || event.location) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Location</h2>
          <LocationMap location={event.location} coordinates={event.coordinates} />
        </div>
      )}

      {/* ...you can include other event details or sections here... */}
    </div>
  );
}
