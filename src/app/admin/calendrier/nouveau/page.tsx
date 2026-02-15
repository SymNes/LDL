"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const eventTypes = [
  { value: "saison-solo", label: "Saison Solo" },
  { value: "saison-equipe", label: "Saison Équipe" },
  { value: "tournois-solo", label: "Tournoi Solo" },
  { value: "tournois-equipe", label: "Tournoi Équipe" },
  { value: "celebration", label: "Célébration" },
];

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    season: "2024-2025",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/calendrier");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Une erreur est survenue");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin/calendrier">
        <Button variant="ghost" className="mb-6 pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </Link>

      <Card className="max-w-2xl mx-auto border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-ldl-navy to-blue-800 text-white">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Nouvel Événement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Type d&apos;événement *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Saison *</Label>
              <Input
                id="season"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                placeholder="2024-2025"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Soirée Saison Solo #3"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/admin/calendrier" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 bg-ldl-navy hover:bg-blue-900"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
