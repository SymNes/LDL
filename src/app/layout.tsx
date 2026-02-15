import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Les Légendes - Ligue de Darts",
  description: "Site officiel de la Ligue des Légendes - Compétition de fléchettes",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          {children}
        </main>
      </body>
    </html>
  );
}
