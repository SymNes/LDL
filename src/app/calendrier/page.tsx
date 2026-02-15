import Link from "next/link";
import { Calendar, Trophy, Users, PartyPopper, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllEvents, getAllSeasons } from "@/lib/db/queries";

const eventTypeLabels: Record<string, { label: string; icon: typeof Trophy; color: string }> = {
  "saison-solo": { label: "Saison Solo", icon: Trophy, color: "bg-ldl-red" },
  "saison-equipe": { label: "Saison Équipe", icon: Users, color: "bg-ldl-navy" },
  "tournois-solo": { label: "Tournoi Solo", icon: Trophy, color: "bg-ldl-green" },
  "tournois-equipe": { label: "Tournoi Équipe", icon: Users, color: "bg-ldl-gold" },
  "celebration": { label: "Célébration", icon: PartyPopper, color: "bg-purple-600" },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function isEventPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isEventToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate.getTime() === today.getTime();
}

export default async function CalendrierPage() {
  const [events, seasons] = await Promise.all([getAllEvents(), getAllSeasons()]);

  // Group events by season
  const eventsBySeason = seasons.map((season) => ({
    season,
    events: events.filter((e) => e.season === season),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ldl-navy mb-2">Calendrier</h1>
        <p className="text-muted-foreground">
          Consultez toutes les soirées et événements de la Ligue des Légendes
        </p>
      </div>

      <div className="space-y-8">
        {eventsBySeason.map(({ season, events: seasonEvents }) => (
          <div key={season}>
            <h2 className="text-xl font-bold text-ldl-navy mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ldl-red" />
              Saison {season}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasonEvents.map((event) => {
                const eventType = eventTypeLabels[event.type] || {
                  label: event.type,
                  icon: Trophy,
                  color: "bg-gray-500",
                };
                const Icon = eventType.icon;
                const isPast = isEventPast(event.date);
                const isToday = isEventToday(event.date);

                return (
                  <Link key={event.id} href={`/calendrier/${event.id}`}>
                    <Card
                      className={`hover:shadow-lg transition-all border-0 shadow-md cursor-pointer group ${
                        isPast ? "opacity-75" : ""
                      } ${isToday ? "ring-2 ring-ldl-red" : ""}`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`${eventType.color} p-3 rounded-xl shrink-0 relative`}>
                            <Icon className="w-5 h-5 text-white" />
                            {isPast && (
                              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {isToday && (
                              <div className="absolute -top-1 -right-1 bg-ldl-red rounded-full p-0.5 animate-pulse">
                                <Clock className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-ldl-navy mb-1">
                                {eventType.label}
                              </h3>
                              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className={`text-sm capitalize ${isPast ? "text-muted-foreground" : "text-ldl-navy font-medium"}`}>
                              {formatDate(event.date)}
                            </p>
                            {isPast && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Terminé
                              </span>
                            )}
                            {isToday && (
                              <span className="inline-flex items-center gap-1 text-xs text-ldl-red font-semibold mt-1">
                                <Clock className="w-3 h-3" />
                                Aujourd&apos;hui
                              </span>
                            )}
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ldl-navy mb-2">
              Aucun événement programmé
            </h3>
            <p className="text-muted-foreground">
              Revenez bientôt pour découvrir les prochaines soirées !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
