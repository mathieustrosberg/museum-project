/**
 * URL des photographies. Elles sont servies par l'API depuis `public/images`
 * (chemin commençant par « / ») : l'URL complète est construite à partir de
 * l'adresse publique de l'API (déploiement Vercel, sinon localhost:4000).
 */

/** Adresse publique de l'API, pour les fichiers de `public`. */
export const PUBLIC_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT ?? 4000}`;

export function imageUrl(path) {
  return `${PUBLIC_URL}${path}`;
}
