import { prisma } from "@/lib/prisma";

/**
 * Serve le immagini salvate nel database: /img/<id>
 * Ogni caricamento crea un id nuovo, quindi il contenuto di un URL non cambia mai
 * → cache lunghissima nel browser (e in next/image).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Gli id generati da Prisma (cuid) sono solo lettere minuscole e numeri
  if (!/^[a-z0-9]{20,40}$/.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const image = await prisma.storedImage.findUnique({
    where: { id },
    select: { data: true, contentType: true },
  });

  if (!image) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}