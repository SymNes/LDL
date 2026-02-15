# Ligue des Légendes - Darts League Website

Site web officiel de la Ligue des Légendes, une compétition de fléchettes.

## 🎯 Fonctionnalités

- **Page d'accueil** avec top 3 des meilleurs joueurs (points, bullseyes, triples)
- **Calendrier** des soirées et événements
- **Classement** par saison avec filtres
- **Profils des joueurs** avec statistiques détaillées par saison
- **Section admin** protégée par mot de passe pour gérer les données

## 🛠️ Technologies

- **Framework:** Next.js 14 avec App Router
- **Langage:** TypeScript
- **Base de données:** Turso (SQLite cloud)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **Hébergement:** Vercel

## 🚀 Déploiement

### 1. Configuration de la base de données (Turso)

1. Créer un compte sur [Turso](https://turso.tech)
2. Créer une nouvelle base de données:
   ```bash
   turso db create ligue-des-legendes
   ```
3. Obtenir l'URL et le token:
   ```bash
   turso db show ligue-des-legendes
   turso db tokens create ligue-des-legendes
   ```

### 2. Configuration des variables d'environnement

Créer un fichier `.env.local`:

```env
TURSO_DATABASE_URL=libsql://votre-db-url.turso.io
TURSO_AUTH_TOKEN=votre-token
ADMIN_PASSWORD=darts2024
```

### 3. Migration et seeding de la base de données

```bash
# Générer les migrations
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Seeder la base de données avec les joueurs et événements
npm run db:seed
```

### 4. Déploiement sur Vercel

1. Connecter votre repo GitHub à Vercel
2. Ajouter les variables d'environnement dans les paramètres Vercel
3. Déployer!

Ou utiliser le CLI Vercel:

```bash
npm i -g vercel
vercel
```

## 📁 Structure du projet

```
src/
├── app/
│   ├── api/           # API routes
│   ├── admin/         # Section admin
│   ├── calendrier/    # Page calendrier
│   ├── classement/    # Page classement
│   ├── joueurs/       # Pages joueurs
│   ├── page.tsx       # Page d'accueil
│   └── layout.tsx     # Layout principal
├── components/        # Composants React
├── lib/
│   └── db/           # Configuration base de données
└── middleware.ts     # Authentification admin
```

## 🔐 Accès Admin

- **URL:** `/admin`
- **Mot de passe:** `darts2024`

## 📝 Scripts disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build pour production
npm run db:generate  # Générer les migrations Drizzle
npm run db:migrate   # Appliquer les migrations
npm run db:seed      # Seeder la base de données
npm run db:studio    # Ouvrir Drizzle Studio
```

## 🎨 Design

Le design utilise les couleurs du logo officiel:
- **Rouge:** `#DC2626` (LDL Red)
- **Bleu marine:** `#0F172A` (LDL Navy)
- **Vert:** `#16A34A` (Bullseye Green)
- **Or:** `#F59E0B` (Accent Gold)

## 📧 Contact

Pour toute question ou suggestion, contactez l'administrateur de la ligue.

---

© 2025 Ligue des Légendes - Tous droits réservés
