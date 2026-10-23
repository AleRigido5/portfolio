import { existsSync } from "node:fs";
import path from "node:path";

// Caricamenti locali (quando non si usa Vercel Blob): fuori da public/,
// che `next start` non rilegge dopo il build. Li serve src/app/uploads/[...path]/route.ts
export const UPLOADS_DIR = path.join(process.cwd(), "uploads");

/**
 * true se l'immagine esiste davvero: URL esterni (Vercel Blob) sempre,
 * file locali solo se presenti su disco. Evita richieste 404 ed errori in console.
 */
export function imageExists(src: string): boolean {
  if (/^https?:\/\//.test(src)) return true;
  if (src.startsWith("/uploads/")) {
    return existsSync(path.join(UPLOADS_DIR, src.slice("/uploads/".length)));
  }
  return existsSync(path.join(process.cwd(), "public", src));
}
