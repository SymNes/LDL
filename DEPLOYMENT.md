# 🚀 Guide de Déploiement - Ligue des Légendes

## ✅ Ce qui a été construit

Votre application web de ligue de fléchettes est **complète et prête à être déployée**!

### 📱 Fonctionnalités incluses:

1. **Page d'accueil** (`/`)
   - Widgets Top 3: Points, Bullseyes, Triples
   - Navigation rapide vers les autres pages
   - Design moderne et sportif avec les couleurs du logo

2. **Calendrier** (`/calendrier`)
   - Liste de tous les événements par saison
   - Types d'événements: Saison Solo, Saison Équipe, Tournoi Solo, Tournoi Équipe

3. **Classement** (`/classement`)
   - Tableau complet des statistiques par saison
   - Filtre par saison (dropdown)
   - Stats: Points, Victoires, Défaites, Bullseyes, Triples

4. **Joueurs** (`/joueurs`)
   - Grille de tous les 20 joueurs
   - Pages individuelles avec stats par saison et en carrière

5. **Admin** (`/admin`)
   - Protection par mot de passe: `darts2024`
   - Gestion des joueurs (ajouter)
   - Gestion du calendrier (ajouter des événements)
   - Saisie des résultats/statistiques

### 🎨 Design:
- **Couleurs:** Rouge (#DC2626), Bleu marine (#0F172A), Vert (#16A34A), Or (#F59E0B)
- **Style:** Sportif, moderne, responsive
- **Langue:** Français partout

### 🗄️ Base de données:
- **20 joueurs** pré-enregistrés avec leurs noms
- **2 événements** créés (16 janvier et 6 février 2025)
- **Données de stats** extraites des photos fournies

---

## 🚀 Étapes de déploiement

### Étape 1: Préparer la base de données (Turso)

1. **Créer un compte** sur [turso.tech](https://turso.tech)
2. **Installer le CLI Turso:**
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
3. **Se connecter:**
   ```bash
   turso auth login
   ```
4. **Créer la base de données:**
   ```bash
   turso db create ligue-des-legendes
   ```
5. **Obtenir les credentials:**
   ```bash
   # URL de la base
   turso db show ligue-des-legendes
   
   # Token d'authentification
   turso db tokens create ligue-des-legendes
   ```

### Étape 2: Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet:

```env
TURSO_DATABASE_URL=libsql://votre-db-url.turso.io
TURSO_AUTH_TOKEN=votre-token-ici
ADMIN_PASSWORD=darts2024
```

### Étape 3: Initialiser la base de données

```bash
# Dans le dossier du projet
cd ligue-des-legendes

# Générer les migrations
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Seeder avec les joueurs et événements
npm run db:seed
```

### Étape 4: Déployer sur Vercel

**Option A - Interface web:**
1. Pousser le code sur GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Importer le projet
4. Ajouter les variables d'environnement dans Settings > Environment Variables
5. Déployer

**Option B - CLI:**
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ajouter les variables d'environnement
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add ADMIN_PASSWORD

# Redéployer
vercel --prod
```

### Étape 5: Configurer le domaine personnalisé

1. Acheter le domaine `liguedeslegendes.com` (sur OVH, GoDaddy, Namecheap, etc.)
2. Dans Vercel Dashboard > Project Settings > Domains
3. Ajouter `liguedeslegendes.com`
4. Suivre les instructions DNS fournies par Vercel

---

## 🧪 Tester localement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

---

## 📊 Structure des données

### Joueurs (20 total):
Albatros, Bagheera, Bogey, Captain, Cobra Kai, Dart Gangster, Grizzly, Hitman, Joker, Maverick, Maxson Dart, Moneymaker, Phoenix, Rook, Russe, Sniper, Steelman, Tank, Thunder, Venom

### Événements:
1. **16 janvier 2025** - Saison Solo #1
2. **6 février 2025** - Saison Solo #2

### Stats extraites des photos:
Les données des deux soirées ont été saisies selon les tableaux fournis (V, D, B, T pour chaque joueur).

---

## 🔧 Commandes utiles

```bash
# Développement
npm run dev              # Serveur de dev
npm run build           # Build production
npm run lint            # Vérifier le code

# Base de données
npm run db:generate     # Générer migrations
npm run db:migrate      # Appliquer migrations
npm run db:seed         # Seeder les données
npm run db:studio       # Ouvrir Drizzle Studio (UI)
```

---

## 🆘 Support

Si vous rencontrez des problèmes:

1. **Erreur de connexion à la DB:** Vérifier TURSO_DATABASE_URL et TURSO_AUTH_TOKEN
2. **Erreur 500:** Vérifier que les migrations ont été appliquées
3. **Admin inaccessible:** Vérifier le cookie et rafraîchir la page

---

## 🎉 Prochaines étapes suggérées

1. **Ajouter des photos** aux profils des joueurs via l'admin
2. **Créer de nouveaux événements** au fur et à mesure des soirées
3. **Saisir les résultats** après chaque soirée
4. **Personnaliser** les couleurs ou le design si besoin
5. **Ajouter des fonctionnalités** comme des graphiques de progression

---

**Félicitations! Votre site est prêt! 🎯**
