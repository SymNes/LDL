"use client";

import { useState, useEffect } from "react";
import { Trophy, Save, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Player {
  id: number;
  name: string;
}

interface Event {
  id: number;
  type: string;
  date: string;
  description: string | null;
}

export default function AdminStatsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [stats, setStats] = useState<Record<number, {
    wins: number;
    losses: number;
    bullseyes: number;
    triples: number;
  }>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch players and events
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data));

    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const handleStatChange = (playerId: number, field: string, value: number) => {
    setStats((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    setSuccess(false);

    try {
      const eventId = parseInt(selectedEvent);
      
      // Submit stats for each player
      for (const [playerIdStr, playerStats] of Object.entries(stats)) {
        const playerId = parseInt(playerIdStr);
        
        await fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId,
            eventId,
            points: playerStats.wins,
            wins: playerStats.wins,
            losses: playerStats.losses,
            bullseyes: playerStats.bullseyes,
            triples: playerStats.triples,
          }),
        });
      }

      setSuccess(true);
      setStats({});
    } catch (error) {
      console.error("Error saving stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedEventData = events.find((e) => e.id.toString() === selectedEvent);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ldl-navy">Saisie des Résultats</h1>
        <p className="text-muted-foreground">
          Entrez les statistiques pour une soirée
        </p>
      </div>

      <Card className="border-0 shadow-xl mb-6">
        <CardHeader className="bg-gradient-to-r from-ldl-green to-green-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Choisir un événement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-full md:w-[400px]">
              <SelectValue placeholder="Sélectionner un événement" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  {new Date(event.date).toLocaleDateString("fr-FR")} - {event.description || event.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedEventData && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <p className="font-medium">{selectedEventData.description || selectedEventData.type}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedEventData.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedEvent && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle>Statistiques des Joueurs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-bold">Joueur</th>
                    <th className="text-center p-4 font-bold">Victoires (V)</th>
                    <th className="text-center p-4 font-bold">Défaites (D)</th>
                    <th className="text-center p-4 font-bold">Bulls (B)</th>
                    <th className="text-center p-4 font-bold">Triples (T)</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-medium">{player.name}</td>
                      <td className="p-4">
                        <Input
                          type="number"
                          min="0"
                          className="w-20 mx-auto text-center"
                          value={stats[player.id]?.wins || 0}
                          onChange={(e) =>
                            handleStatChange(player.id, "wins", parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          min="0"
                          className="w-20 mx-auto text-center"
                          value={stats[player.id]?.losses || 0}
                          onChange={(e) =>
                            handleStatChange(player.id, "losses", parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          min="0"
                          className="w-20 mx-auto text-center"
                          value={stats[player.id]?.bullseyes || 0}
                          onChange={(e) =>
                            handleStatChange(player.id, "bullseyes", parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          min="0"
                          className="w-20 mx-auto text-center"
                          value={stats[player.id]?.triples || 0}
                          onChange={(e) =>
                            handleStatChange(player.id, "triples", parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t bg-slate-50">
              {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Résultats enregistrés avec succès !
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full md:w-auto bg-ldl-green hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Enregistrement..." : "Enregistrer les résultats"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
