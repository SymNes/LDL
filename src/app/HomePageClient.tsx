"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Calendar, Users, Target, TrendingUp, Award, Clock, ArrowRight, PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Event {
  id: number;
  type: string;
  date: Date;
  season: string;
  description: string | null;
}

interface TopPointsPlayer {
  playerId: number;
  playerName: string;
  totalPoints: number | null;
  totalBullseyes: number | null;
  totalTriples: number | null;
}

interface TopBullseyesPlayer {
  playerId: number;
  playerName: string;
  totalBullseyes: number | null;
}

interface TopTriplesPlayer {
  playerId: number;
  playerName: string;
  totalTriples: number | null;
}

interface HomePageClientProps {
  topPoints: TopPointsPlayer[];
  topBullseyes: TopBullseyesPlayer[];
  topTriples: TopTriplesPlayer[];
  nextEvent: Event | null;
  lastEvent: Event | null;
}

const eventTypeLabels: Record<string, { label: string; color: string }> = {
  "saison-solo": { label: "Saison Solo", color: "bg-ldl-red" },
  "saison-equipe": { label: "Saison Équipe", color: "bg-ldl-navy" },
  "tournois-solo": { label: "Tournoi Solo", color: "bg-ldl-green" },
  "tournois-equipe": { label: "Tournoi Équipe", color: "bg-ldl-gold" },
  "celebration": { label: "Célébration", color: "bg-purple-600" },
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatTimeRemaining(targetDate: Date): string {
  const now = new Date();
  const diff = new Date(targetDate).getTime() - now.getTime();

  if (diff <= 0) return "En cours !";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}j ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export default function HomePageClient({
  topPoints,
  topBullseyes,
  topTriples,
  nextEvent,
  lastEvent
}: HomePageClientProps) {
  // Simple, compact widgets: Last Event and Next Event
  const quickLinks = [
    {
      title: "Calendrier",
      description: "Voir toutes les soirées et événements",
      href: "/calendrier",
      icon: Calendar,
      color: "bg-ldl-red",
    },
    {
      title: "Classement",
      description: "Consultez le classement de la saison",
      href: "/classement",
      icon: Trophy,
      color: "bg-ldl-navy",
    },
    {
      title: "Joueurs",
      description: "Découvrez les statistiques des joueurs",
      href: "/joueurs",
      icon: Users,
      color: "bg-ldl-green",
    },
  ];

  const nextEventType = nextEvent ? eventTypeLabels[nextEvent.type] : null;
  const lastEventType = lastEvent ? eventTypeLabels[lastEvent.type] : null;
  const lastEventDate = lastEvent ? new Date(lastEvent.date) : null;
  const nextEventDate = nextEvent ? new Date(nextEvent.date) : null;
  const short = (d: Date | null) => d ? d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-ldl-navy mb-4">
          Ligue des Légendes
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          La compétition de fléchettes ultime. Rejoignez-nous pour des soirées
          intenses et des moments de légende !
        </p>
      </section>

      {/* Top 3 Widgets */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-ldl-navy mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-ldl-red" />
          Meilleurs Performeurs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Points */}
          <Card className="border-2 border-ldl-red/20 shadow-lg shadow-ldl-red/5 hover:shadow-xl hover:shadow-ldl-red/10 transition-shadow">
            <CardHeader className="bg-gradient-to-r from-ldl-red to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5" />
                Top 3 - Points
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {topPoints.map((player, index) => (
                  <div
                    key={player.playerId}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : index === 1
                              ? "bg-gray-300 text-gray-700"
                              : "bg-orange-400 text-orange-900"
                          }`}
                      >
                        {index + 1}
                      </span>
                      <Link
                        href={`/joueurs/${player.playerId}`}
                        className="font-medium text-ldl-navy hover:text-ldl-red transition-colors"
                      >
                        {player.playerName}
                      </Link>
                    </div>
                    <span className="font-bold text-blue-600">{player.totalPoints || 0} pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Bullseyes */}
          <Card className="border-2 border-ldl-green/20 shadow-lg shadow-ldl-green/5 hover:shadow-xl hover:shadow-ldl-green/10 transition-shadow">
            <CardHeader className="bg-gradient-to-r from-ldl-green to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5" />
                Top 3 - Bulls
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {topBullseyes.map((player, index) => (
                  <div
                    key={player.playerId}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : index === 1
                              ? "bg-gray-300 text-gray-700"
                              : "bg-orange-400 text-orange-900"
                          }`}
                      >
                        {index + 1}
                      </span>
                      <Link
                        href={`/joueurs/${player.playerId}`}
                        className="font-medium text-ldl-navy hover:text-ldl-green transition-colors"
                      >
                        {player.playerName}
                      </Link>
                    </div>
                    <span className="font-bold text-ldl-green">{player.totalBullseyes || 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Triples */}
          <Card className="border-2 border-ldl-navy/20 shadow-lg shadow-ldl-navy/5 hover:shadow-xl hover:shadow-ldl-navy/10 transition-shadow">
            <CardHeader className="bg-gradient-to-r from-ldl-navy to-blue-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5" />
                Top 3 - Triples
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {topTriples.map((player, index) => (
                  <div
                    key={player.playerId}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : index === 1
                              ? "bg-gray-300 text-gray-700"
                              : "bg-orange-400 text-orange-900"
                          }`}
                      >
                        {index + 1}
                      </span>
                      <Link
                        href={`/joueurs/${player.playerId}`}
                        className="font-medium text-ldl-navy hover:text-ldl-navy/80 transition-colors"
                      >
                        {player.playerName}
                      </Link>
                    </div>
                    <span className="font-bold text-ldl-navy">{player.totalTriples || 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold text-ldl-navy mb-6">Navigation Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${link.color} p-3 rounded-xl shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ldl-navy mb-1">{link.title}</h3>
                        <p className="text-muted-foreground text-sm">{link.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
