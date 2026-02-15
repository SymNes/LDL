"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Users, PartyPopper, Calendar, Target, Award, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const eventTypeLabels: Record<string, { label: string; icon: typeof Trophy; color: string }> = {
  "saison-solo": { label: "Saison Solo", icon: Trophy, color: "bg-ldl-red" },
  "saison-equipe": { label: "Saison Équipe", icon: Users, color: "bg-ldl-navy" },
  "tournois-solo": { label: "Tournoi Solo", icon: Trophy, color: "bg-ldl-green" },
  "tournois-equipe": { label: "Tournoi Équipe", icon: Users, color: "bg-ldl-gold" },
  "celebration": { label: "Célébration", icon: PartyPopper, color: "bg-purple-600" },
};

interface EventStat {
  playerId: number;
  playerName: string;
  photoUrl: string | null;
  points: number | null;
  wins: number | null;
  losses: number | null;
  bullseyes: number | null;
  triples: number | null;
}

interface Event {
  id: number;
  type: string;
  date: Date;
  season: string;
  description: string | null;
}

interface EventPageClientProps {
  event: Event;
  stats: EventStat[];
}

type SortField = "points" | "wins" | "losses" | "bullseyes" | "triples" | "playerName";
type SortDirection = "asc" | "desc";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function EventPageClient({ event, stats }: EventPageClientProps) {
  const [sortField, setSortField] = useState<SortField>("points");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedStats = useMemo(() => {
    return [...stats].sort((a, b) => {
      let aValue: number | string = a[sortField] ?? 0;
      let bValue: number | string = b[sortField] ?? 0;
      
      if (sortField === "playerName") {
        aValue = a.playerName;
        bValue = b.playerName;
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [stats, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="font-bold cursor-pointer hover:bg-slate-100" 
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-center">
        {children}
        {getSortIcon(field)}
      </div>
    </TableHead>
  );

  const eventType = eventTypeLabels[event.type] || {
    label: event.type,
    icon: Trophy,
    color: "bg-gray-500",
  };
  const Icon = eventType.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/calendrier">
        <Button variant="ghost" className="mb-6 pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au calendrier
        </Button>
      </Link>

      {/* Event Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`${eventType.color} p-4 rounded-2xl`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ldl-navy">{eventType.label}</h1>
            <p className="text-muted-foreground capitalize">{formatDate(event.date)}</p>
          </div>
        </div>
        
        {event.description && (
          <p className="text-lg text-muted-foreground mt-4">{event.description}</p>
        )}
      </div>

      {/* Stats Table */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-ldl-navy to-blue-900 text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Résultats de l&apos;événement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sortedStats.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="w-16 text-center font-bold">#</TableHead>
                    <SortableHeader field="playerName">Joueur</SortableHeader>
                    <SortableHeader field="points">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Points
                      </div>
                    </SortableHeader>
                    <SortableHeader field="wins">Victoires</SortableHeader>
                    <SortableHeader field="losses">Défaites</SortableHeader>
                    <SortableHeader field="bullseyes">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="w-4 h-4" />
                        Bulls
                      </div>
                    </SortableHeader>
                    <SortableHeader field="triples">
                      <div className="flex items-center justify-center gap-1">
                        <Award className="w-4 h-4" />
                        Triples
                      </div>
                    </SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStats.map((stat, index) => (
                    <TableRow key={stat.playerId} className="hover:bg-slate-50">
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex w-8 h-8 items-center justify-center rounded-full font-bold text-sm ${
                            index === 0
                              ? "bg-yellow-400 text-yellow-900"
                              : index === 1
                              ? "bg-gray-300 text-gray-700"
                              : index === 2
                              ? "bg-orange-400 text-orange-900"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/joueurs/${stat.playerId}`} className="hover:text-ldl-red transition-colors">
                          {stat.playerName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center font-bold text-ldl-red">
                        {stat.points || 0}
                      </TableCell>
                      <TableCell className="text-center text-green-600">
                        {stat.wins || 0}
                      </TableCell>
                      <TableCell className="text-center text-red-600">
                        {stat.losses || 0}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {stat.bullseyes || 0}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {stat.triples || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ldl-navy mb-2">
                Aucune statistique disponible
              </h3>
              <p className="text-muted-foreground">
                Les statistiques pour cet événement ne sont pas encore disponibles.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
