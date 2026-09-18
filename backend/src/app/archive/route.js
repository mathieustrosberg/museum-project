import { getArchive } from "@/lib/data";
import { ERRORS, json, preflight, query, serverError } from "@/lib/http";

/** GET /archive — les photographies de l'archive (maison, atelier, œuvres, détails, île), filtrables par type. */
export async function GET(request) {
  try {
    return json(getArchive(query(request)));
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
