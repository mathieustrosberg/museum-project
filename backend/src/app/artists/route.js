import { getArtists } from "@/lib/data";
import { ERRORS, json, preflight, serverError } from "@/lib/http";

/** GET /artists — les artistes de la collection, avec les slugs de leurs œuvres. */
export async function GET() {
  try {
    return json(getArtists());
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
