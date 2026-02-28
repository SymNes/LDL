"use client";

import { useState, useEffect } from "react";
import { Trophy, Save, CheckCircle, Loader2 } from "lucide-react";
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

interface Stat {
  id: number;
  playerId: number;
  eventId: number;
  points: number;
  wins: number;
  losses: number;
  bullseyes: number;
  triples: number;
}

export default function AdminStatsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [existingStats, setExistingStats] = useState<Stat[]>([]);
  const [stats, setStats] = useState<Record<number, {
    id?: number;
    points: number;
    wins: number;
    losses: number;
    bullseyes: number;
    triples: number;
  }>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  // Fetch existing stats when event is selected
  useEffect(() => {
    if (!selectedEvent) {
      setExistingStats([]);
      setStats({});
      return;
    }

    setLoading(true);
    fetch(`/api/stats?eventId=${selectedEvent}`)
      .then((res) => res.json())
      .then((data: Stat[]) => {
        setExistingStats(data);
        
        // Initialize stats from existing data
        const statsMap: Record<number, {
          id?: number;
          points: number;
          wins: number;
          losses: number;
          bullseyes: number;
          triples: number;
        }> = {};
        
        data.forEach((stat) => {
          statsMap[stat.playerId] = {
            id: stat.id,
            points: stat.points,
            wins: stat.wins,
            losses: stat.losses,
            bullseyes: stat.bullseyes,
            triples: stat.triples,
          };
        });
        
        setStats(statsMap);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedEvent]);

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

    setSaving(true);
    setSuccess(false);

    try {
      const eventId = parseInt(selectedEvent);
      
      // Submit/update stats for each player
      for (const [playerIdStr, playerStats] of Object.entries(stats)) {
        const playerId = parseInt(playerIdStr);
        
        // Use PUT to either create or update
        await fetch(`/api/stats?playerId=${playerId}&eventId=${eventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            points: playerStats.points,
            wins: playerStats.wins,
            losses: playerStats.losses,
            bullseyes: playerStats.bullseyes,
            triples: playerStats.triples,
          }),
        });
      }

      setSuccess(true);
      // Refresh stats
      const res = await fetch(`/api/stats?eventId=${selectedEvent}`);
      const data: Stat[] = await res.json();
      setExistingStats(data);
      
      const statsMap: Record<number, {
        id?: number;
        points: number;
        wins: number;
        losses: number;
        bullseyes: number;
        triples: number;
      }> = {};
      data.forEach((stat) => {
        statsMap[stat.playerId] = {
          id: stat.id,
          points: stat.points,
          wins: stat.wins,
          losses: stat.losses,
          bullseyes: stat.bullseyes,
          triples: stat.triples,
        };
      });
      setStats(statsMap);
    } catch (error) {
      console.error("Error saving stats:", error);
    } finally {
      setSaving(false);
    }
  };

  const selectedEventData = events.find((e) => e.id.toString() === selectedEvent);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ldl-navy">Saisie des Résultats</h1>
        <p className="text-muted-foreground">
          Entrez ou modifiez les statistiques pour une soirée
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
            <CardTitle className="flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Statistiques des Joueurs
              {existingStats.length > 0 && (
                <span className="text-sm font-normal text-green-600 ml-2">
                  (données existantes chargées)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-bold">Joueur</th>
                    <th className="text-center p-4 font-bold text-ldl-red">Points</th>
                    <th className="text-center p-4 font-bold">V</th>
                    <th className="text-center p-4 font-bold">D</th>
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
                          className="w-20 mx-auto text-center font-bold text-ldl-red"
                          value={stats[player.id]?.points ?? 0}
                          onChange={(e) =>
                            handleStatChange(player.id, "points", parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          min="0"
                          className="w-16 mx-auto text-center"
                          value={stats[player.id]?.wins ?? 0}
                          onChange={(e) =>
                            handleStatChange(player.id, "wins", parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          min="0"
                          className="w-16 mx-auto text-center"
                          value={stats[player.id]?.losses ?? 0}
                          onChange={(e) =>
                            handleStatChange(player.id, "losses", parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          min="0"
                          className="w-16 mx-auto text-center"
                          value={stats[player.id]?.bullseyes ?? 0}
                          onChange={(e) =>
                            handleStatChange(player.id, "bullseyes", parseInt(e.target.value) || 0)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          min="0"
                          className="w-16 mx-auto text-center"
                          value={stats[player.id]?.triples ?? 0}
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
                disabled={saving}
                className="w-full md:w-auto bg-ldl-green hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer les résultats
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
