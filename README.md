<div align="center">

<img src="./frontend/src/app/opengraph-image.jpg" alt="Fenêtre du salon de la maison de Tahíche, ouverte sur la coulée de lave" width="100%" />

# Fondation César Manrique

**Maison de César Manrique, Tahíche, Lanzarote**

Site et API réalisés dans le cadre d'un projet d'étude sur Next.js 16.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-000000?logo=react&logoColor=white)](https://react.dev)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-000000)](https://www.better-auth.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-000000?logo=greensock&logoColor=white)](https://gsap.com)
[![Vercel](https://img.shields.io/badge/Vercel-déployé-000000?logo=vercel&logoColor=white)](https://museum-website-teal.vercel.app)

[**Voir le site**](https://museum-website-teal.vercel.app) · [Voir l'API](https://museum-api-topaz.vercel.app) · [Critique de Next.js](#critique-constructive-de-nextjs-16)

</div>

---

## Le dépôt

| Dossier | Contenu | Documentation |
|---|---|---|
| [`frontend/`](./frontend) | Le site : collection, archives, visite et billetterie, comptes et favoris | [README du site](./frontend/README.md) |
| [`backend/`](./backend) | L'API de contenu : fiches, photographies, informations de visite, billets | [README de l'API](./backend/README.md) |

```bash
# 1. l'API, sur http://localhost:4000
cd backend && npm install && npm run dev

# 2. le site, sur http://localhost:3000 (dans un second terminal)
cd frontend && npm install && npm run dev
```

---

## Critique constructive de Next.js 16

### Ce qui a bien fonctionné

Ayant déjà travaillé avec Next.js avant ce projet, j’ai surtout pu me concentrer sur les nouveautés de cette version. J’ai particulièrement apprécié les **Server Components**, qui permettent de limiter le JavaScript côté client, ainsi que les **Server Actions**, très pratiques pour gérer les formulaires.

Le nouveau système de cache avec `"use cache"`, `cacheLife` et `cacheTag` est aussi intéressant, car il permet de mieux contrôler la durée de vie des données. Le **Partial Prerendering** est également utile pour mélanger facilement du contenu statique avec des éléments dynamiques liés à l’utilisateur.

### Les points plus compliqués

La principale difficulté a été la gestion du cache et des composants dynamiques. Certaines erreurs liées aux cookies, aux headers ou à `<Suspense>` ne sont pas toujours très claires.

J’ai aussi rencontré quelques comportements surprenants, notamment avec le cache qui peut conserver d’anciennes données ou les formulaires React 19 qui peuvent se réinitialiser après une erreur.

### Bilan

Dans l’ensemble, Next.js 16 reste très agréable à utiliser, notamment pour ses performances et sa gestion du rendu serveur. Ce projet m’a surtout permis d’approfondir certaines fonctionnalités plus récentes du framework, en particulier le cache, les Server Actions et le rendu partiel.

---

<div align="center">

Projet d'étude · Photographies : Vladimir Kysela et photographes de Pexels, crédités sur chaque fiche

</div>
