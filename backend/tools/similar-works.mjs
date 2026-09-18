// Calcule le champ `similar` (4 slugs) de chaque fiche de src/data/objects.json et l'écrit dans le fichier.
// Règle, par ordre de poids : même type (3), même artiste (2),
// matériaux ou techniques en commun (0,5 chacun : lave, chaux, bois, pierre, eau de mer, huile, toile…),
// puis proximité d'année, puis la fiche la moins citée jusqu'ici (rééquilibrage), puis le titre.
// Usage : node tools/similar-works.mjs   (relancer après tout ajout ou retrait d'œuvre)
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../src/data/objects.json", import.meta.url);
const COUNT = 4;
const KEYWORDS = [
  "lave",
  "basalte",
  "rofe",
  "pierre",
  "chaux",
  "béton",
  "bois",
  "verre",
  "eau de mer",
  "palmier",
  "huile",
  "acrylique",
  "toile",
  "sable",
  "papier",
];

const works = JSON.parse(await readFile(FILE, "utf8"));
const tokens = (w) =>
  new Set(
    KEYWORDS.filter((k) => `${w.type} ${w.medium}`.toLowerCase().includes(k)),
  );
const overlap = (a, b) => [...a].filter((k) => b.has(k)).length;

const cited = new Map(works.map((w) => [w.slug, 0]));
for (const w of works) {
  const own = tokens(w);
  const ranked = works
    .filter((o) => o.slug !== w.slug)
    .map((o) => ({
      slug: o.slug,
      title: o.title,
      score:
        (o.type === w.type ? 3 : 0) +
        (o.artistSlug === w.artistSlug ? 2 : 0) +
        0.5 * overlap(own, tokens(o)),
      dy: Math.abs((o.year ?? 0) - (w.year ?? 0)),
      cited: cited.get(o.slug),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.dy - b.dy ||
        a.cited - b.cited ||
        a.title.localeCompare(b.title),
    );
  w.similar = ranked.slice(0, COUNT).map((r) => r.slug);
  for (const slug of w.similar) cited.set(slug, cited.get(slug) + 1);
}

// Garantie : chaque œuvre est citée au moins une fois. Une œuvre orpheline remplace la 4e carte
// de l'œuvre qui la classe le mieux, à condition que la carte remplacée reste citée ailleurs.
const rank = (from, to) => {
  const a = tokens(from),
    b = tokens(to);
  return (
    (to.type === from.type ? 3 : 0) +
    (to.artistSlug === from.artistSlug ? 2 : 0) +
    0.5 * overlap(a, b) -
    Math.abs((to.year ?? 0) - (from.year ?? 0)) / 100
  );
};
for (const orphan of works.filter((w) => cited.get(w.slug) === 0)) {
  const host = works
    .filter(
      (w) => w.slug !== orphan.slug && cited.get(w.similar[COUNT - 1]) > 1,
    )
    .sort((a, b) => rank(b, orphan) - rank(a, orphan))[0];
  if (!host) continue;
  const dropped = host.similar[COUNT - 1];
  host.similar[COUNT - 1] = orphan.slug;
  cited.set(dropped, cited.get(dropped) - 1);
  cited.set(orphan.slug, 1);
  console.log(
    `orphelin ${orphan.slug} placé chez ${host.slug} à la place de ${dropped}`,
  );
}

await writeFile(FILE, `${JSON.stringify(works, null, 2)}\n`);
for (const w of works)
  console.log(w.slug.padEnd(18), "→", w.similar.join(", "));
console.log("citations :", [...cited].map(([s, n]) => `${s} ${n}`).join(", "));
