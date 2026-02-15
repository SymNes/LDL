"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Calendar, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Accueil", href: "/", icon: Trophy },
  { name: "Calendrier", href: "/calendrier", icon: Calendar },
  { name: "Classement", href: "/classement", icon: Trophy },
  { name: "Joueurs", href: "/joueurs", icon: Users },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-ldl-red rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg shadow-ldl-red/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-ldl-navy leading-tight">
                Ligue des Légendes
              </h1>
              <p className="text-xs text-muted-foreground">LDL</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-ldl-red text-white shadow-md shadow-ldl-red/20"
                      : "text-ldl-navy hover:bg-slate-100 hover:text-ldl-red"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
