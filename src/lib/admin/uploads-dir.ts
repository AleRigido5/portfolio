import { existsSync } from "node:fs";
import path from "node:path";

/**
 * true se l'immagine esiste davvero, così non si generano richieste 404:
 * - "/img/<id>"  → immagini salvate nel database (caricate dall'admin)
 * - URL esterni  → vecchie immagini su Vercel Blob, finché non le ricarichi
 * - altri percorsi → file statici in public/
 */
export function imageExists(src: string): boolean {
  if (src.startsWith("/img/")) return true;
  if (/^https?:\/\//.test(src)) return true;
  return existsSync(path.join(process.cwd(), "public", src));
}