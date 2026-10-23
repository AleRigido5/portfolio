import { readFile } from "node:fs/promises";
import path from "node:path";

import { UPLOADS_DIR } from "@/lib/admin/uploads-dir";

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
};

/**
 * Serve le immagini caricate dall'admin quando sono salvate su disco
 * (sviluppo, test locale, VPS). Su Vercel le immagini stanno su Vercel Blob
 * e questa route non viene usata.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const filePath = path.resolve(UPLOADS_DIR, ...segments);

  // Niente "../": si possono leggere solo file dentro la cartella uploads
  const contentType = CONTENT_TYPES[path.extname(filePath)];
  if (!filePath.startsWith(UPLOADS_DIR + path.sep) || !contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        // Il nome contiene un timestamp: il file non cambia mai, cache lunga
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
