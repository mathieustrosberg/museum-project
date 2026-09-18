import { getArchive, getArtists, getObjects, getVisitInfo } from "@/lib/data";
import { getOpenDays } from "@/lib/visit";

/**
 * Documentation de l'API (Server Component). Les exemples de réponse sont
 * produits à partir des vraies données : la documentation ne peut pas dériver.
 */
const BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/`
  : "http://localhost:4000/";

const show = (value) => JSON.stringify(value, null, 2);

/** Liste JSON abrégée : le premier élément puis un commentaire. */
function list(items, label) {
  const first = show(items[0])
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
  return `[\n${first},\n  // ${items.length - 1} autres ${label}\n]`;
}

const OBJECT_FIELDS = [
  ["id", "number", "Identifiant numérique de l'œuvre"],
  ["slug", "string", "Identifiant unique dans les URL"],
  ["title", "string", "Titre de l'œuvre"],
  ["artist", "string", "Nom de l'artiste"],
  ["artistSlug", "string", "Slug de l'artiste (voir /artists/{slug})"],
  [
    "category",
    "string",
    "work (tableau ou œuvre) ou space (espace de la maison)",
  ],
  ["year", "number | null", "Année de réalisation, null si non documentée"],
  [
    "type",
    "string",
    "Type (Maison-atelier, Jameo, Jardin… ; Peinture pour un tableau)",
  ],
  ["medium", "string", "Technique d'un tableau ou matériaux d'un espace"],
  ["dimensions", "string", "Dimensions ou surface, si documentées (optionnel)"],
  ["sheets", "number", "Nombre de photographies"],
  ["inventory", "string", "Numéro d'inventaire"],
  ["color", "boolean", "Vrai si les photographies sont affichées en couleur"],
  [
    "description",
    "string",
    "Notice, en texte brut, avec le crédit des photographies",
  ],
  ["image", "string", "Lien vers la photographie principale"],
  ["gallery", "string array", "Liens des autres photographies, dans l'ordre"],
  ["location", "string", "Lieu (commune, île)"],
  ["similar", "string array", "Slugs de quatre œuvres proches"],
];

const ARCHIVE_FIELDS = [
  ["id", "number", "Identifiant numérique"],
  ["slug", "string", "Identifiant unique dans les URL"],
  ["title", "string", "Titre de la photographie (Salon, Atelier…)"],
  ["date", "string", "Année"],
  ["type", "string", "Maison, Atelier, Œuvre, Détail, Photographie ou Île"],
  ["orientation", "string", "portrait (3:4) ou landscape (4:3)"],
  ["description", "string", "Légende"],
  ["image", "string", "Lien vers l'image, servie par l'API"],
  [
    "color",
    "boolean",
    "Vrai si la photo est affichée en couleur, sans le filtre noir et blanc du site",
  ],
];

const ARTIST_FIELDS = [
  ["id", "number", "Identifiant numérique"],
  ["slug", "string", "Identifiant unique dans les URL"],
  ["name", "string", "Nom"],
  ["born", "string", "Année et lieu de naissance"],
  ["based", "string", "Ville de travail"],
  ["practice", "string", "Pratique, en une phrase"],
  ["works", "string array", "Slugs des œuvres de la collection"],
];

const VISIT_FIELDS = [
  ["name", "string", "Nom du lieu"],
  ["address", "string", "Adresse postale"],
  ["addressLink", "string", "Lien vers la carte"],
  ["email", "string", "Adresse de contact"],
  ["phone", "string", "Téléphone"],
  ["timeZone", "string", "Fuseau horaire du musée"],
  ["hours", "string", "Horaires des jours d'ouverture"],
  [
    "openWeekdays",
    "number array",
    "Jours d'ouverture (0 = dimanche … 6 = samedi)",
  ],
  ["weeksAhead", "number", "Horizon de réservation, en semaines"],
  ["closedDates", "string array", "Fermetures exceptionnelles (YYYY-MM-DD)"],
  ["maxPerType", "number", "Nombre maximal de billets par catégorie"],
  ["currency", "string", "Devise"],
  [
    "admission",
    "object array",
    "Catégories de billets : id, label, price, note",
  ],
  [
    "days",
    "object array",
    "Jours d'ouverture à venir : value (YYYY-MM-DD) et label",
  ],
];

const TICKET_FIELDS = [
  ["reference", "string", "Référence de retrait, format FCM-AAMMJJ-XXXX"],
  ["date", "string", "Jour de visite (YYYY-MM-DD)"],
  ["dateLabel", "string", "Jour de visite, en clair"],
  ["tickets", "object array", "Lignes retenues : id, label, quantity, price"],
  ["total", "number", "Montant à régler à l'entrée"],
  ["currency", "string", "Devise"],
  ["name", "string", "Nom du visiteur, tel que reçu"],
];

function H2({ children }) {
  return <h2 className="mt-12 mb-4 text-2xl font-semibold">{children}</h2>;
}

function H3({ children }) {
  return <h3 className="mt-10 mb-3 text-lg font-semibold">{children}</h3>;
}

function H4({ children }) {
  return <h4 className="mt-6 mb-2 font-semibold">{children}</h4>;
}

function Code({ children }) {
  return (
    <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  );
}

function Block({ children }) {
  return (
    <pre className="my-3 overflow-x-auto rounded-md bg-neutral-100 p-4 font-mono text-xs leading-relaxed">
      {children}
    </pre>
  );
}

function Fields({ items }) {
  return (
    <ul className="my-2 list-disc space-y-1 pl-6 text-sm">
      {items.map(([name, type, text]) => (
        <li key={name}>
          <Code>{name}</Code> ({type}) : {text}
        </li>
      ))}
    </ul>
  );
}

function Route({ method, path }) {
  return (
    <p className="my-2 text-sm">
      <span className="mr-2 rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-xs text-white">
        {method}
      </span>
      <Code>{path}</Code>
    </p>
  );
}

export default function DocumentationPage() {
  const objects = getObjects();
  const archive = getArchive();
  const artists = getArtists();
  const visit = { ...getVisitInfo(), days: getOpenDays().slice(0, 2) };
  const [firstDay] = visit.days;

  const ticketRequest = {
    name: "Ana García",
    email: "ana@example.com",
    date: firstDay?.value,
    tickets: { full: 2, under18: 1 },
  };
  const ticketResponse = {
    reference: `FCM-${firstDay.value.replaceAll("-", "").slice(2)}-K7RM`,
    date: firstDay?.value,
    dateLabel: firstDay?.label,
    tickets: [
      { id: "full", label: "Plein tarif", quantity: 2, price: 8 },
      { id: "under18", label: "-18 ans", quantity: 1, price: 0 },
    ],
    total: 16,
    currency: visit.currency,
    name: "Ana García",
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 text-neutral-900">
      <h1 className="text-3xl font-semibold">API Fondation César Manrique</h1>

      <H2>Introduction</H2>
      <p className="text-sm leading-relaxed">
        Cette API fournit les données du site de la Fondation César Manrique,
        installée dans l'ancienne maison de l'artiste à Tahíche, Lanzarote. Elle
        donne accès aux espaces et œuvres de la collection et à leur fiche, aux
        photographies de l'archive, aux artistes et aux informations de visite,
        et reçoit les demandes de billets. Projet d'étude : la billetterie est
        une démonstration, aucune demande n'est transmise à la Fondation.
      </p>

      <H2>Base URL</H2>
      <Block>{BASE_URL}</Block>

      <H2>Endpoints</H2>

      <H3>1. Obtenir toutes les œuvres</H3>
      <Route method="GET" path="/objects" />
      <p className="text-sm">
        Retourne la liste de toutes les œuvres de la collection.
      </p>
      <H4>Paramètres (optionnels)</H4>
      <Fields
        items={[
          ["category", "string", "work (œuvres) ou space (espaces)"],
          ["type", "string", "Filtre par type, par exemple Jardin"],
          ["artist", "string", "Filtre par slug d'artiste"],
          [
            "q",
            "string",
            "Recherche libre sur le titre, l'artiste, le médium et l'année",
          ],
        ]}
      />
      <H4>Réponse</H4>
      <p className="text-sm">
        La réponse est un tableau d'objets JSON, chaque objet représentant une
        œuvre avec les propriétés suivantes :
      </p>
      <Fields items={OBJECT_FIELDS} />
      <H4>Exemple de réponse</H4>
      <Block>{list(objects, "œuvres")}</Block>

      <H3>2. Obtenir une œuvre spécifique</H3>
      <Route method="GET" path="/objects/{slug}" />
      <p className="text-sm">
        Retourne les détails d'une œuvre à partir de son slug.
      </p>
      <H4>Paramètres</H4>
      <Fields items={[["slug", "string", "L'identifiant unique de l'œuvre"]]} />
      <H4>Réponse</H4>
      <p className="text-sm">
        Un objet JSON représentant l'œuvre, avec la même structure que dans la
        liste complète.
      </p>
      <Block>{show(objects[1])}</Block>

      <H3>3. Obtenir l'archive</H3>
      <Route method="GET" path="/archive" />
      <p className="text-sm">
        Retourne les photographies de l'archive : maison et atelier de César
        Manrique, tableaux et détails, vues de l'île (photographies de Vladimir
        Kysela).
      </p>
      <H4>Paramètres (optionnels)</H4>
      <Fields
        items={[["type", "string", "Filtre par type, par exemple Atelier"]]}
      />
      <H4>Réponse</H4>
      <Fields items={ARCHIVE_FIELDS} />
      <H4>Exemple de réponse</H4>
      <Block>{list(archive, "entrées")}</Block>

      <H3>4. Obtenir une entrée d'archive</H3>
      <Route method="GET" path="/archive/{slug}" />
      <p className="text-sm">
        Retourne une entrée du journal, avec la même structure que dans la
        liste.
      </p>

      <H3>5. Obtenir les artistes</H3>
      <Route method="GET" path="/artists" />
      <Route method="GET" path="/artists/{slug}" />
      <p className="text-sm">
        Retourne la liste des artistes de la collection, ou un artiste à partir
        de son slug.
      </p>
      <H4>Réponse</H4>
      <Fields items={ARTIST_FIELDS} />
      <H4>Exemple de réponse</H4>
      <Block>{show(artists[0])}</Block>

      <H3>6. Obtenir les informations de visite</H3>
      <Route method="GET" path="/visit" />
      <p className="text-sm">
        Retourne l'adresse, les horaires, les tarifs et la liste des jours
        d'ouverture à venir, calculée chaque jour dans le fuseau du musée.
      </p>
      <H4>Réponse</H4>
      <Fields items={VISIT_FIELDS} />
      <H4>Exemple de réponse</H4>
      <Block>{show(visit)}</Block>

      <H3>7. Demander des billets</H3>
      <Route method="POST" path="/tickets" />
      <p className="text-sm">
        Enregistre une demande de billets pour un jour d'ouverture. Aucun
        paiement en ligne : l'API valide la demande et émet une référence de
        retrait, les billets sont réglés à l'entrée. Le corps de la requête est
        un objet JSON.
      </p>
      <H4>Corps de la requête</H4>
      <Fields
        items={[
          ["name", "string", "Nom du visiteur (obligatoire)"],
          ["email", "string", "Adresse email (obligatoire)"],
          ["date", "string", "Jour de visite, parmi les days de /visit"],
          [
            "tickets",
            "object",
            "Quantités par catégorie (id de admission) : au moins un billet, au plus maxPerType par catégorie",
          ],
        ]}
      />
      <Block>{show(ticketRequest)}</Block>
      <H4>Réponse (201)</H4>
      <Fields items={TICKET_FIELDS} />
      <Block>{show(ticketResponse)}</Block>
      <H4>Demande refusée (400)</H4>
      <p className="text-sm">
        Un code par champ en erreur : <Code>date</Code> unavailable,{" "}
        <Code>tickets</Code> empty ou max, <Code>name</Code> required,{" "}
        <Code>email</Code> invalid.
      </p>
      <Block>
        {show({
          error: "Invalid request",
          fields: { date: "unavailable", tickets: "empty" },
        })}
      </Block>

      <H2>Gestion des erreurs</H2>
      <p className="text-sm">
        En cas d'erreur, l'API retourne un objet JSON avec une propriété{" "}
        <Code>error</Code> décrivant l'erreur.
      </p>
      <H4>Exemples d'erreurs</H4>
      <ul className="my-2 list-disc space-y-3 pl-6 text-sm">
        <li>
          Œuvre non trouvée (404) :
          <Block>{show({ error: "Object not found" })}</Block>
        </li>
        <li>
          Requête invalide (400) :
          <Block>{show({ error: "Invalid JSON body" })}</Block>
        </li>
        <li>
          Erreur serveur (500) :
          <Block>{show({ error: "Failed to fetch objects" })}</Block>
        </li>
      </ul>

      <H2>Notes</H2>
      <ul className="my-2 list-disc space-y-1 pl-6 text-sm">
        <li>
          Toutes les URL d'images sont des URL complètes, incluant le protocole
          et le nom de domaine.
        </li>
        <li>
          Les photographies de la collection et de l'archive sont servies par
          l'API elle-même (dossier <Code>public/images</Code>, redimensionnées à
          2000 px environ).
        </li>
        <li>
          Le champ <Code>slug</Code> peut être utilisé pour construire les URL
          conviviales de chaque œuvre, entrée d'archive, artiste ou exposition.
        </li>
        <li>
          Certains champs peuvent manquer sur certains objets (par exemple{" "}
          <Code>dimensions</Code> pour un espace non documenté).
        </li>
        <li>
          Les réponses en lecture sont mises en cache par le CDN (une heure, dix
          minutes pour <Code>/visit</Code>) et acceptent les requêtes depuis
          n'importe quelle origine (CORS).
        </li>
      </ul>
    </main>
  );
}
