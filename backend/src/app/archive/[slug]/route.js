import { getArchiveEntry } from "@/lib/data";
import { ERRORS, json, notFound, preflight, serverError } from "@/lib/http";

/** GET /archive/{slug} — une photographie de l'archive. */
export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const entry = getArchiveEntry(slug);
    return entry ? json(entry) : notFound(ERRORS.entry);
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
