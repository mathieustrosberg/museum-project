/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Racine du projet pour Turbopack (un lockfile parent hors dépôt serait sinon pris en compte).
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
