import { Calendar, Trophy, Users, PartyPopper } from "lucide-react";
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

                return (
                  <Card
                    key={event.id}
                    className="hover:shadow-lg transition-shadow border-0 shadow-md"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`${eventType.color} p-3 rounded-xl shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-ldl-navy mb-1">
                            {eventType.label}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {formatDate(event.date)}
                          </p>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
