import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/db/queries";

const eventTypeLabels: Record<string, string> = {
  "saison-solo": "Saison Solo",
  "saison-equipe": "Saison Équipe",
  "tournois-solo": "Tournoi Solo",
  "tournois-equipe": "Tournoi Équipe",
  "celebration": "Célébration",
};

function formatDate(dateInput: Date | string) {
  const date = new Date(dateInput);
  // Get date components directly to avoid timezone shift
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const localDate = new Date(year, month, day);
  
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(localDate);
}

export default async function AdminEventsPage() {
  const events = await getAllEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ldl-navy">Gestion du Calendrier</h1>
          <p className="text-muted-foreground">{events.length} événements programmés</p>
        </div>
        <Link href="/admin/calendrier/nouveau">
          <Button className="bg-ldl-navy hover:bg-blue-900 gap-2">
            <Plus className="w-4 h-4" />
            Nouvel événement
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold">Date</th>
                  <th className="text-left p-4 font-bold">Type</th>
                  <th className="text-left p-4 font-bold">Description</th>
                  <th className="text-left p-4 font-bold">Saison</th>
                  <th className="text-right p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">{formatDate(event.date)}</td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-ldl-red/10 text-ldl-red">
                        {eventTypeLabels[event.type] || event.type}
                      </span>
                    </td>
                    <td className="p-4">{event.description || "-"}</td>
                    <td className="p-4">{event.season}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/calendrier/${event.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
