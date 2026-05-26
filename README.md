# Minstrel Mobile

Application mobile de lecture audio construite avec **React Native / Expo**, pensée pour consommer une **API .NET** normalisée exposée par le backend **Minstrel**.

Le projet suit une approche **mobile-first** avec une interface inspirée du style **Library-first moderne** :

- thème sombre
- accent cyan/bleu
- bibliothèque structurée
- mini-player global
- navigation simple et lisible

## Objectif

Minstrel est un player audio mobile centré sur l’écoute et l’exploration de bibliothèque.

Le MVP vise les fonctionnalités suivantes :

- bibliothèque
- recherche
- albums / artistes / playlists
- file d’attente
- lecture en arrière-plan
- écran “Now Playing”
- cache / offline simple

Le mobile **ne dialogue pas directement avec les services externes**.  
Il consomme une **API backend .NET** qui agrège et normalise les données.

## Stack technique

- **Expo**
- **React Native**
- **TypeScript**
- **Expo Router**
- **Zustand**
- **lucide-react-native**

## Backend associé

Ce projet est prévu pour fonctionner avec le repo backend **Minstrel Backend**.

Exemples d’endpoints utilisés :

- `GET /sources`
- `GET /library/albums`
- `GET /library/artists`
- `GET /library/tracks`
- `GET /library/playlists`
- `GET /search?q=...`
- `GET /playback/tracks/{id}/stream`

## Structure du projet

```text
src/
  app/
    _layout.tsx
    index.tsx
    (tabs)/
      _layout.tsx
      home.tsx
      library.tsx
      search.tsx
      offline.tsx
    album/
      [id].tsx
    artist/
      [id].tsx
    playlist/
      [id].tsx
    now-playing.tsx

  api/
    client.ts
    libraryApi.ts
    searchApi.ts
    playbackApi.ts
    sourcesApi.ts

  components/
    layout/
    navigation/
    inputs/
    media/
    player/
    offline/
    feedback/

  domain/
    dto/
    models/
    mappers/

  hooks/
    useLibraryScreen.ts
    useNowPlayingScreen.ts

  services/
    player/
      player.service.ts

  stores/
    library.store.ts
    playback.store.ts
    offline.store.ts
    search.store.ts
    favorites.store.ts

  theme/
    colors.ts
    spacing.ts
    radius.ts
    typography.ts

  utils/
    formatDuration.ts
```

## Design system

La direction visuelle retenue est **Library-first moderne**.

### Couleurs principales

- `bg`: `#111318`
- `bgElevated`: `#161B22`
- `surface`: `#1B222C`
- `surfaceAlt`: `#202938`
- `border`: `#2A3442`

- `textPrimary`: `#F8FAFC`
- `textSecondary`: `#AAB4C3`
- `textMuted`: `#6C788A`

- `accent`: `#22D3EE`
- `accentPressed`: `#06B6D4`
- `accentSoft`: `rgba(34, 211, 238, 0.14)`

## Prérequis

- Node.js
- npm ou pnpm
- backend Minstrel démarré localement
- appareil mobile ou navigateur Expo web

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_API_URL=http://192.168.1.80:5063
```

Remplacer l’IP par celle de la machine qui exécute le backend Minstrel.

## Lancement

```bash
npx expo start
```

Important : les commandes doivent être lancées depuis [`src/`](src/), qui contient le `package.json`.

## Validation Player

Une checklist de test sur appareil natif est disponible ici :

- [`docs/player-device-test-checklist.md`](docs/player-device-test-checklist.md)

## État actuel

Le projet dispose d’un player fonctionnel et d’une bibliothèque navigable :

**Lecture**
- Lecture / pause, seek, répétition, lecture aléatoire (shuffle)
- File d’attente
- Lecture en arrière-plan
- Mini-player global persistent
- Écran Now Playing

**Bibliothèque**
- Navigation par Albums, Artistes, Playlists, Morceaux
- Écrans dédiés album `album/[id]`, artiste `artist/[id]`, playlist `playlist/[id]`
- Tri et filtrage par source
- Favoris (ajout / suppression)

**Offline**
- Scan de la bibliothèque locale (stockage appareil)
- Téléchargements avec suivi de progression
- Extraction des métadonnées audio (via `music-metadata-browser`)

**Recherche**
- Recherche via l’API backend

## Routing

L’application utilise **Expo Router**.

### Tabs principales

- `home`
- `library`
- `search`
- `offline`

### Écrans additionnels

- `album/[id]`
- `now-playing`

## Stores

### `library.store.ts`

Gère :

- l’onglet de contenu actif
- le filtre de source
- le tri courant

### `playback.store.ts`

Gère :

- le morceau courant
- la file d’attente
- l’état lecture/pause

### `offline.store.ts`

Gère :

- les téléchargements et leur progression
- la bibliothèque locale (fichiers sur l'appareil)
- la synchronisation pCloud
- les contenus disponibles hors ligne

### `search.store.ts`

Gère :

- la requête de recherche
- les résultats (morceaux, albums, artistes)
- l'état de chargement

### `favorites.store.ts`

Gère :

- la liste des morceaux / albums favoris
- l'ajout et la suppression de favoris

## Conventions du projet

- composants UI réutilisables dans `src/components`
- logique écran dans `src/hooks`
- état global dans `src/stores`
- appels backend dans `src/api`
- mapping DTO → modèle dans `src/domain/mappers`
- thème centralisé dans `src/theme`

## Roadmap MVP

### Fait

- Bibliothèque (albums, artistes, playlists, morceaux)
- Navigation par onglets
- Mini-player global
- Écran Now Playing
- Player audio (lecture, pause, seek, repeat, shuffle)
- File d'attente
- Recherche
- Favoris
- Tri dans la bibliothèque
- Offline : scan local, téléchargements
- Écrans dédiés album / artiste / playlist

### En cours

- Workflow d'import (multi-source, confirmation)
- Covers : extraction et cache depuis les fichiers locaux

### À venir

- Recherche dans la bibliothèque offline (indexation locale)
- Playlists custom (création / édition)
- Intégration sources externes (pCloud, etc.)
- Gestion des erreurs (fichiers corrompus, source indisponible)
- Polish Now Playing : transitions, gestes swipe-to-dismiss
- Paramètres audio (equalizer si supporté par expo-audio)

## Notes

- Le projet est actuellement en phase de MVP.
- Les données affichées peuvent provenir d’un provider mock côté backend.
- Le support multi-source est prévu côté backend, mais le mobile reste source-agnostic.
