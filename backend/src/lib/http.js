/**
 * Réponses JSON de l'API : CORS ouvert (l'API est publique et en lecture),
 * cache CDN côté Vercel (s-maxage) et objets d'erreur { error } uniformes.
 */
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const ERRORS = {
  object: "Object not found",
  entry: "Archive entry not found",
  artist: "Artist not found",
  fetch: "Failed to fetch objects",
  invalid: "Invalid request",
  json: "Invalid JSON body",
};

/** Réponse JSON. `maxAge` : durée de cache CDN en secondes (0 = pas de cache). */
export function json(data, { status = 200, maxAge = 3600 } = {}) {
  const headers = { ...CORS_HEADERS };
  headers["Cache-Control"] =
    maxAge > 0
      ? `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=86400`
      : "no-store";
  return Response.json(data, { status, headers });
}

export function notFound(message) {
  return json({ error: message }, { status: 404, maxAge: 0 });
}

export function badRequest(message, fields) {
  return json(fields ? { error: message, fields } : { error: message }, {
    status: 400,
    maxAge: 0,
  });
}

export function serverError(message) {
  return json({ error: message }, { status: 500, maxAge: 0 });
}

/** Réponse à la requête préliminaire CORS (POST depuis un navigateur). */
export function preflight() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/** Paramètres de requête sous forme d'objet simple (?category=space&type=Jardin). */
export function query(request) {
  return Object.fromEntries(new URL(request.url).searchParams);
}
