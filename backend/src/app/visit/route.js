import { getVisitInfo } from "@/lib/data";
import { ERRORS, json, preflight, serverError } from "@/lib/http";
import { getOpenDays } from "@/lib/visit";

/**
 * GET /visit — informations pratiques et jours d'ouverture à venir.
 * La liste dépend de la date du jour : cache CDN court (10 minutes).
 */
export async function GET() {
  try {
    return json({ ...getVisitInfo(), days: getOpenDays() }, { maxAge: 600 });
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
