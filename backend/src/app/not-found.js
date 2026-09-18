import Link from "next/link";

const ROUTES = [
  "/objects",
  "/objects/{slug}",
  "/archive",
  "/archive/{slug}",
  "/artists",
  "/artists/{slug}",
  "/visit",
  "/tickets (POST)",
];

export const metadata = { title: "API Fondation César Manrique — 404" };

/** Route inconnue : rappel des endpoints et lien vers la documentation. */
export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 text-neutral-900">
      <p className="font-mono text-xs text-neutral-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold">Route inconnue</h1>
      <p className="mt-4 text-sm leading-relaxed">
        Cette adresse ne correspond à aucun endpoint de l'API de la Fondation
        César Manrique. Les routes disponibles sont :
      </p>
      <ul className="my-4 list-disc space-y-1 pl-6 text-sm">
        {ROUTES.map((route) => (
          <li key={route}>
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em]">
              {route}
            </code>
          </li>
        ))}
      </ul>
      <Link className="text-sm underline underline-offset-4" href="/">
        Voir la documentation
      </Link>
    </main>
  );
}
