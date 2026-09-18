import { badRequest, ERRORS, json, preflight } from "@/lib/http";
import { validateRequest } from "@/lib/visit";

/**
 * POST /tickets — demande de billets.
 * Corps JSON : { name, email, date: "YYYY-MM-DD", tickets: { full: 2, reduced: 1 } }.
 * 201 : { reference, date, dateLabel, tickets, total, currency, name }.
 * 400 : { error: "Invalid request", fields: { date, tickets, name, email } } (codes par champ).
 * Aucune persistance : les billets sont réglés à l'entrée sur présentation de la référence.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest(ERRORS.json);
  }
  if (!body || typeof body !== "object") return badRequest(ERRORS.json);

  const result = validateRequest(body);
  if (!result.ok) return badRequest(ERRORS.invalid, result.fields);
  return json(result.request, { status: 201, maxAge: 0 });
}

export function OPTIONS() {
  return preflight();
}
