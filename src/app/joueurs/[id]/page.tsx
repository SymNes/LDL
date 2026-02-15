import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, TrendingUp, Target, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getPlayerById, getPlayerStatsBySeason } from "@/lib/db/queries";

interface PlayerPageProps {
  params: { id: string };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const playerId = parseInt(params.id);
  
  if (isNaN(playerId)) {
    notFound();
  }

  const [player, seasonStats] = await Promise.all([
    getPlayerById(playerId),
    getPlayerStatsBySeason(playerId),
  ]);

  if (!player) {
    notFound();
  }

  // Calculate career totals
  const careerTotals = seasonStats.reduce(
    (acc, season) => ({
      points: acc.points + (season.totalPoints || 0),
      wins: acc.wins + (season.totalWins || 0),
      losses: acc.losses + (season.totalLosses || 0),
      bullseyes: acc.bullseyes + (season.totalBullseyes || 0),
      triples: acc.triples + (season.totalTriples || 0),
      events: acc.events + (season.eventsPlayed || 0),
    }),
    { points: 0, wins: 0, losses: 0, bullseyes: 0, triples: 0, events: 0 }
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/joueurs">
        <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux joueurs
        </Button>
      </Link>

      {/* Player Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ldl-red to-red-600 flex items-center justify-center shadow-xl">
            {player.photoUrl ? (
              <Image
                src={player.photoUrl}
                alt={player.name}
                width={128}
                height={128}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-white" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-ldl-navy mb-2">{player.name}</h1>
            <p className="text-muted-foreground">
              Membre de la Ligue des Légendes
            </p>
          </div>
        </div>
      </div>

      {/* Career Stats */}
      <Card className="mb-8 border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-ldl-navy to-blue-900 text-white">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Statistiques en Carrière
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-3xl font-bold text-ldl-red">{careerTotals.points}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600">{careerTotals.wins}</p>
              <p className="text-sm text-muted-foreground">Victoires</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-3xl font-bold text-red-600">{careerTotals.losses}</p>
              <p className="text-sm text-muted-foreground">Défaites</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-3xl font-bold text-ldl-navy">{careerTotals.bullseyes}</p>
              <p className="text-sm text-muted-foreground">Bullseyes</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-3xl font-bold text-ldl-green">{careerTotals.triples}</p>
              <p className="text-sm text-muted-foreground">Triples</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-3xl font-bold text-ldl-gold">{careerTotals.events}</p>
              <p className="text-sm text-muted-foreground">Événements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Season Stats */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-ldl-red to-red-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Statistiques par Saison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-bold">Saison</TableHead>
                  <TableHead className="text-center font-bold">Points</TableHead>
                  <TableHead className="text-center font-bold">V</TableHead>
                  <TableHead className="text-center font-bold">D</TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Target className="w-4 h-4" />
                      Bulls
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Award className="w-4 h-4" />
                      Triples
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">Matchs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seasonStats.map((season) => (
                  <TableRow key={season.season}>
                    <TableCell className="font-medium">{season.season}</TableCell>
                    <TableCell className="text-center font-bold text-ldl-red">
                      {season.totalPoints || 0}
                    </TableCell>
                    <TableCell className="text-center text-green-600">
                      {season.totalWins || 0}
                    </TableCell>
                    <TableCell className="text-center text-red-600">
                      {season.totalLosses || 0}
                    </TableCell>
                    <TableCell className="text-center">{season.totalBullseyes || 0}</TableCell>
                    <TableCell className="text-center">{season.totalTriples || 0}</TableCell>
                    <TableCell className="text-center">{season.eventsPlayed || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {seasonStats.length === 0 && (
        <Card className="mt-8 border-dashed">
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ldl-navy mb-2">
              Aucune statistique disponible
            </h3>
            <p className="text-muted-foreground">
              Les statistiques de ce joueur seront bientôt disponibles.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
