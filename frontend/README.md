<div align="center">

<img src="./src/app/opengraph-image.jpg" alt="Fenêtre du salon de la maison de Tahíche, ouverte sur la coulée de lave" width="100%" />

# Fondation César Manrique — le site

**Maison de César Manrique, Tahíche, Lanzarote**

Site réalisé dans le cadre d'un projet d'étude sur Next.js 16.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-000000?logo=react&logoColor=white)](https://react.dev)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-000000)](https://www.better-auth.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-000000?logo=greensock&logoColor=white)](https://gsap.com)
[![Vercel](https://img.shields.io/badge/Vercel-déployé-000000?logo=vercel&logoColor=white)](https://museum-website-teal.vercel.app)

[**Voir le site**](https://museum-website-teal.vercel.app) · [API](../backend/README.md) · [Critique de Next.js](../README.md#critique-constructive-de-nextjs-16)

</div>

---

## Sommaire

1. [Fonctionnalités](#fonctionnalités)
2. [Stack](#stack)
3. [Lancer le projet](#lancer-le-projet)
4. [Architecture](#architecture)
5. [Choix techniques](#choix-techniques)
6. [Déploiement](#déploiement)

---

## Fonctionnalités

| | |
|---|---|
| **Collection** | Dix fiches : six espaces de Lanzarote et Tenerife, quatre tableaux. Filtres par catégorie, type et lieu, recherche instantanée. |
| **Archives** | 27 photographies de la maison, de l'atelier, des œuvres et de l'île, classées par type. |
| **Visite** | Horaires, contact, billetterie de démonstration avec validation et page de confirmation. |
| **Comptes** | Inscription et connexion par e-mail et mot de passe, page Compte. |
| **Favoris** | Ajout depuis chaque fiche, retrait depuis Compte ou Favoris, mise à jour immédiate. |
| **Expérience** | Preloader en pile de cartes, transition entre pages, textes révélés ligne par ligne, horloge de Lanzarote. |
| **SEO** | Métadonnées par page, Open Graph, données structurées schema.org, sitemap, robots. |

## Stack

| | |
|---|---|
| **Framework** | Next.js 16.3.5 (App Router, Cache Components, Turbopack), React 19.2 |
| **Langage** | JavaScript, dossier `src/`, alias `@/*` |
| **Authentification** | Better Auth 1.7 et Kysely : Postgres (Neon) en production, SQLite local en développement |
| **Animations** | GSAP 3.15, voile WebGL entre les pages |
| **Styles** | CSS maison (tokens, composants), Tailwind v4 sans Preflight pour les ajouts |
| **Qualité** | Biome (lint et format), React Compiler |

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # prérend toutes les pages en lisant l'API
npm run start    # serveur de production
npm run lint     # Biome
```

> [!IMPORTANT]
> Le site lit ses données sur l'API ([`../backend`](../backend)). Elle doit tourner sur `http://localhost:4000` avant `npm run dev` ou `npm run build`.

<details>
<summary><strong>Variables d'environnement</strong></summary>

<br />

| Variable | Rôle |
|---|---|
| `FCM_API_URL` | URL de l'API (défaut `http://localhost:4000`) ; obligatoire au build |
| `BETTER_AUTH_SECRET` | secret des sessions (`openssl rand -base64 32`) ; obligatoire en production |
| `DATABASE_URL` | connexion Postgres des comptes et favoris ; absente, fichier `data/site.sqlite` créé au premier démarrage |
| `SITE_URL` | adresse publique, utile seulement avec un domaine personnalisé |

</details>

## Architecture

<details>
<summary><strong>Arborescence de <code>src/</code></strong></summary>

<br />

```
src/
  app/            routes : accueil, work, work/[slug], archive, archive/[slug], about, visit,
                  visit/confirmed, login, signup, account, favorites, api/auth, api/revalidate
  components/     Nav, Footer, Lines, WorkCard, SiteImage, PageReveal, PageTransition, Preloader…
  features/       par fonctionnalité : home, collection, visit, tickets, account, favorites
  lib/            api.js (client de l'API, "use cache"), content.js (vues des pages),
                  auth.js (Better Auth), favorites.js, metadata.js, reveal.js (GSAP)
  data/site.json  textes, libellés, navigation, sélection de l'accueil, cartes du preloader
  styles/         tokens, base, layout, composants, pages
```

</details>

Les données de la collection, de l'archive et de la visite viennent de l'API ; les textes viennent de `src/data/site.json`. Rien n'est écrit en dur dans les composants.

## Choix techniques

| | |
|---|---|
| **Rendu** | Chaque lecture de l'API est une fonction `"use cache"` revalidée toutes les heures. Les pages sont prérendues au build ; ce qui dépend de la requête (session, paramètres d'URL) est rendu en flux derrière `<Suspense>` (Partial Prerendering). |
| **Serveur d'abord** | Tout est Server Component. Les Client Components sont petits et bas dans l'arbre : menu, animations, formulaires, filtres. Les écritures passent par des Server Actions. |
| **Comptes** | Better Auth vit dans le site, avec sa propre base, distincte de l'API qui reste la seule source de la collection. |
| **Images** | Les photographies sont servies par l'API et optimisées par `next/image`. Les tableaux s'affichent entiers, les intérieurs passent en noir et blanc. |
| **Animations** | Les textes restent lisibles sans JavaScript ; toute animation GSAP vit dans un `useEffect` avec nettoyage. |

## Déploiement

Projet Vercel relié au dépôt, avec `frontend` comme « Root Directory ».

| | |
|---|---|
| **Variables** | `FCM_API_URL`, `BETTER_AUTH_SECRET` |
| **Base de données** | Neon (Postgres), reliée par l'intégration Vercel, qui pose `DATABASE_URL` |

> [!NOTE]
> Après une modification des données de l'API, redéployer le site sans le cache de build, ou attendre la revalidation d'une heure.

---

<div align="center">

Projet d'étude · Photographies : Vladimir Kysela et photographes de Pexels, crédités sur chaque fiche

</div>
