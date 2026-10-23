import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Adapter MySQL/MariaDB condiviso da app, seed e script admin.
 *
 * - Legge host, porta, utente, password e database da DATABASE_URL
 *   (i parametri dopo "?", es. sslaccept/sslcert, servono solo alla CLI di Prisma).
 * - Se DATABASE_CA_CERT è impostata (database in cloud, es. Aiven) la connessione
 *   è cifrata con SSL e il certificato del server viene verificato.
 *   In locale (XAMPP) basta non impostarla.
 */
export function createDbAdapter(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) throw new Error("DATABASE_URL non configurata");

  const url = new URL(databaseUrl);
  // Su Vercel le variabili su più righe a volte arrivano con "\n" letterali
  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");

  return new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: 5,
    ...(ca && { ssl: { ca, rejectUnauthorized: true } }),
  });
}