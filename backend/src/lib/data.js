/**
 * Accès aux données. Les fichiers de src/data sont la source ; ce module les
 * met en forme pour l'API : URL d'images complètes, liens entre fiches et
 * artistes, filtres de la liste de la collection.
 */
import archive from "@/data/archive.json";
import artists from "@/data/artists.json";
import objects from "@/data/objects.json";
import visit from "@/data/visit.json";
import { imageUrl } from "@/lib/images";

/** Fiche telle que l'API l'expose : photographie de couverture + galerie des autres. */
function shapeObject(object) {
  const { images, ...rest } = object;
  return {
    ...rest,
    image: imageUrl(images[0]),
    gallery: images.slice(1).map(imageUrl),
  };
}

function shapeEntry(entry) {
  return { ...entry, image: imageUrl(entry.image) };
}

const normalize = (s) =>
  String(s).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/**
 * Liste des œuvres et espaces, filtrable : category ("work" | "space"), type,
 * artist (slug), q (texte libre sur titre, artiste, type, technique, année).
 */
export function getObjects(filters = {}) {
  let list = objects.map(shapeObject);
  const { category, type, artist, q } = filters;
  if (category) list = list.filter((o) => o.category === category);
  if (type) list = list.filter((o) => normalize(o.type) === normalize(type));
  if (artist) list = list.filter((o) => o.artistSlug === artist);
  if (q) {
    const needle = normalize(q);
    list = list.filter((o) =>
      normalize(
        `${o.title} ${o.artist} ${o.type} ${o.medium} ${o.year}`,
      ).includes(needle),
    );
  }
  return list;
}

export function getObject(slug) {
  const object = objects.find((o) => o.slug === slug);
  return object ? shapeObject(object) : null;
}

export function getArchive(filters = {}) {
  let list = archive.map(shapeEntry);
  if (filters.type)
    list = list.filter((e) => normalize(e.type) === normalize(filters.type));
  return list;
}

export function getArchiveEntry(slug) {
  const entry = archive.find((e) => e.slug === slug);
  return entry ? shapeEntry(entry) : null;
}

export function getArtists() {
  return artists;
}

export function getArtist(slug) {
  return artists.find((a) => a.slug === slug) ?? null;
}

/** Informations pratiques (adresse, horaires, tarifs) ; les jours d'ouverture sont calculés dans lib/visit. */
export function getVisitInfo() {
  return visit;
}
