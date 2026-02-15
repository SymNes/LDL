import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllPlayers } from "@/lib/db/queries";

export default async function AdminPlayersPage() {
  const players = await getAllPlayers();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ldl-navy">Gestion des Joueurs</h1>
          <p className="text-muted-foreground">{players.length} joueurs enregistrés</p>
        </div>
        <Link href="/admin/joueurs/nouveau">
          <Button className="bg-ldl-red hover:bg-red-700 gap-2">
            <Plus className="w-4 h-4" />
            Nouveau joueur
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-bold">Nom</th>
                  <th className="text-center p-4 font-bold">Photo</th>
                  <th className="text-right p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-medium">{player.name}</td>
                    <td className="p-4 text-center">
                      {player.photoUrl ? (
                        <span className="text-green-600">Oui</span>
                      ) : (
                        <span className="text-gray-400">Non</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
