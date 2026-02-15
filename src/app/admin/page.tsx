"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Calendar, 
  Trophy, 
  LogOut, 
  Plus,
  Edit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
    router.refresh();
  };

  const adminSections = [
    {
      title: "Gestion des Joueurs",
      description: "Ajouter, modifier ou supprimer des joueurs",
      href: "/admin/joueurs",
      icon: Users,
      color: "bg-ldl-red",
      actions: [
        { label: "Ajouter", href: "/admin/joueurs/nouveau", icon: Plus },
        { label: "Liste", href: "/admin/joueurs", icon: Edit },
      ],
    },
    {
      title: "Gestion du Calendrier",
      description: "Gérer les soirées et événements",
      href: "/admin/calendrier",
      icon: Calendar,
      color: "bg-ldl-navy",
      actions: [
        { label: "Ajouter", href: "/admin/calendrier/nouveau", icon: Plus },
        { label: "Liste", href: "/admin/calendrier", icon: Edit },
      ],
    },
    {
      title: "Gestion des Stats",
      description: "Saisir les résultats des soirées",
      href: "/admin/classement",
      icon: Trophy,
      color: "bg-ldl-green",
      actions: [
        { label: "Saisir", href: "/admin/classement", icon: Plus },
        { label: "Voir", href: "/classement", icon: Edit },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ldl-navy">Administration</h1>
          <p className="text-muted-foreground">Gérez la Ligue des Légendes</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="border-0 shadow-lg">
              <CardHeader className={`${section.color} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">{section.description}</p>
                <div className="flex gap-2">
                  {section.actions.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <Link key={action.label} href={action.href} className="flex-1">
                        <Button variant="outline" className="w-full gap-2">
                          <ActionIcon className="w-4 h-4" />
                          {action.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
