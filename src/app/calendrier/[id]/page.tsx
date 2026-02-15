import { notFound } from "next/navigation";
import { getEventById, getEventStats } from "@/lib/db/queries";
import EventPageClient from "./EventPageClient";

interface EventPageProps {
  params: { id: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const eventId = parseInt(params.id);
  
  if (isNaN(eventId)) {
    notFound();
  }

  const event = await getEventById(eventId);
  
  if (!event) {
    notFound();
  }

  const stats = await getEventStats(eventId);

  return <EventPageClient event={event} stats={stats} />;
}
