import { getObject } from "@/lib/data";
import { ERRORS, json, notFound, preflight, serverError } from "@/lib/http";

/** GET /objects/{slug} — une œuvre. */
export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const object = getObject(slug);
    return object ? json(object) : notFound(ERRORS.object);
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
