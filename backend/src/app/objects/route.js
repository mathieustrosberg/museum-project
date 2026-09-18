import { getObjects } from "@/lib/data";
import { ERRORS, json, preflight, query, serverError } from "@/lib/http";

/** GET /objects — toute la collection (tableaux et espaces), filtrable (category, type, artist, q). */
export async function GET(request) {
  try {
    return json(getObjects(query(request)));
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
