import Link from "next/link";
import Image from "next/image";
import { Users, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllPlayers } from "@/lib/db/queries";

export default async function JoueursPage() {
  const players = await getAllPlayers();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ldl-navy mb-2">Joueurs</h1>
        <p className="text-muted-foreground">
          Découvrez tous les joueurs de la Ligue des Légendes et leurs statistiques
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <Link key={player.id} href={`/joueurs/${player.id}`}>
            <Card className="h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 shadow-md group">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ldl-red to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    {player.photoUrl ? (
                      <Image
                        src={player.photoUrl}
                        alt={player.name}
                        width={80}
                        height={80}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-ldl-navy group-hover:text-ldl-red transition-colors">
                    {player.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Voir les statistiques →
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {players.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ldl-navy mb-2">
              Aucun joueur enregistré
            </h3>
            <p className="text-muted-foreground">
              Les joueurs seront ajoutés prochainement.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
