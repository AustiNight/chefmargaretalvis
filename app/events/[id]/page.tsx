import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageGallery } from "@/components/ImageGallery";
import LocationMap from "@/components/LocationMap";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Event } from "@/types";  // Assume an Event type is defined in your types

interface EventPageProps {
  params: { id: string }
}

// Optionally, generateMetadata can be kept or simplified
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
    notFound();  // Throw a 404 if the event doesn’t exist
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/events" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="mr-2" /> Back to Events
      </Link>

      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <div className="text-gray-600 flex items-center gap-4 mb-8">
        <span><Calendar className="inline-block mr-1" /> {event.date}</span>
        <span><Clock className="inline-block mr-1" /> {event.time}</span>
        {event.location && (
          <span><MapPin className="inline-block mr-1" /> {event.location}</span>
        )}
      </div>

      {/* Event description (pre-formatted rich text) */}
      <div 
        className="prose max-w-none mb-8" 
        dangerouslySetInnerHTML={{ __html: event.description }} 
      />

      {/* Conditional Location Map */}
      {(event.location || event.coordinates) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Location</h2>
          <LocationMap address={event.location} coordinates={event.coordinates} />
        </div>
      )}

      {/* Image gallery, if any images */}
      {event.images && event.images.length > 0 && (
        <ImageGallery images={event.images} />
      )}
    </div>
  );
}
