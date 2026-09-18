import { getArtist } from "@/lib/data";
import { ERRORS, json, notFound, preflight, serverError } from "@/lib/http";

/** GET /artists/{slug} — un artiste. */
export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const artist = getArtist(slug);
    return artist ? json(artist) : notFound(ERRORS.artist);
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
