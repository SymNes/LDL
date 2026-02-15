import { Trophy, TrendingUp, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllSeasons, getCurrentSeason, getRankingsBySeason } from "@/lib/db/queries";

interface ClassementPageProps {
  searchParams: { saison?: string };
}

export default async function ClassementPage({ searchParams }: ClassementPageProps) {
  const seasons = await getAllSeasons();
  const currentSeason = await getCurrentSeason();
  const selectedSeason = searchParams.saison || currentSeason;
  
  const rankings = await getRankingsBySeason(selectedSeason);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ldl-navy mb-2">Classement</h1>
          <p className="text-muted-foreground">
            Classement de la saison avec tous les statistiques
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Saison:</span>
          <Select defaultValue={selectedSeason}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choisir une saison" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-ldl-navy to-blue-900 text-white">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Classement Saison {selectedSeason}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-16 text-center font-bold">#</TableHead>
                  <TableHead className="font-bold">Joueur</TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Points
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">Victoires</TableHead>
                  <TableHead className="text-center font-bold">Défaites</TableHead>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((player, index) => (
                  <TableRow key={player.playerId} className="hover:bg-slate-50">
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
                    <TableCell className="font-medium">{player.playerName}</TableCell>
                    <TableCell className="text-center font-bold text-ldl-red">
                      {player.totalPoints || 0}
                    </TableCell>
                    <TableCell className="text-center text-green-600">
                      {player.totalWins || 0}
                    </TableCell>
                    <TableCell className="text-center text-red-600">
                      {player.totalLosses || 0}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {player.totalBullseyes || 0}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {player.totalTriples || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {rankings.length === 0 && (
        <Card className="mt-8 border-dashed">
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ldl-navy mb-2">
              Aucune donnée disponible
            </h3>
            <p className="text-muted-foreground">
              Les statistiques pour cette saison seront bientôt disponibles.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
