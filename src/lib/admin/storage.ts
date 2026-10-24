import "server-only";
import sharp from "sharp";

import { prisma } from "@/lib/prisma";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Prefisso degli URL delle immagini salvate nel database (vedi src/app/img/[id]/route.ts) */
export const DB_IMAGE_PREFIX = "/img/";

export type StoredImage = {
  url: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Formato non supportato: usa JPG, PNG, WebP o AVIF.";
  if (file.size > MAX_UPLOAD_BYTES) return "L'immagine supera i 4 MB.";
  return null;
}

/**
 * Ottimizza e salva un'immagine nel database:
 * - ridimensionata a max 1600px di larghezza e convertita in WebP
 * - dimensioni lette dal file (servono a next/image per evitare layout shift)
 * - placeholder sfocato generato in automatico
 * Restituisce l'URL "/img/<id>" da salvare in Project.coverImage.
 */
export async function saveImage(file: File, _name?: string): Promise<StoredImage> {
  const input = Buffer.from(await file.arrayBuffer());

  const { data, info } = await sharp(input)
    .rotate() // rispetta l'orientamento EXIF delle foto
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 90 }) // qualità alta: gli screenshot contengono testo
    .toBuffer({ resolveWithObject: true });

  const blur = await sharp(data).resize(16).webp({ quality: 40 }).toBuffer();
  const blurDataURL = `data:image/webp;base64,${blur.toString("base64")}`;

  const image = await prisma.storedImage.create({
    data: {
      data: new Uint8Array(data),
      contentType: "image/webp",
      size: data.length,
    },
    select: { id: true },
  });

  return {
    url: `${DB_IMAGE_PREFIX}${image.id}`,
    width: info.width,
    height: info.height,
    blurDataURL,
  };
}

/**
 * Elimina un'immagine caricata dall'admin.
 * Le immagini statiche (public/) e quelle vecchie su Vercel Blob vengono ignorate.
 */
export async function deleteImage(url: string) {
  if (!url.startsWith(DB_IMAGE_PREFIX)) return;
  try {
    await prisma.storedImage.deleteMany({ where: { id: url.slice(DB_IMAGE_PREFIX.length) } });
  } catch (error) {
    console.error("[storage] eliminazione immagine fallita", error);
  }
}