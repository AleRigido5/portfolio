import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import sharp from "sharp";

import { UPLOADS_DIR } from "./uploads-dir";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel accetta richieste fino a 4,5 MB)
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

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
 * Ottimizza e salva un'immagine:
 * - ridimensionata a max 1600px di larghezza e convertita in WebP
 * - dimensioni lette dal file (servono a next/image per evitare layout shift)
 * - placeholder sfocato generato in automatico
 * Con BLOB_READ_WRITE_TOKEN finisce su Vercel Blob; altrimenti (solo fuori da Vercel) nella cartella uploads/.
 */
export async function saveImage(file: File, name: string): Promise<StoredImage> {
  const input = Buffer.from(await file.arrayBuffer());

  const { data, info } = await sharp(input)
    .rotate() // rispetta l'orientamento EXIF delle foto
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  const blur = await sharp(data).resize(16).webp({ quality: 40 }).toBuffer();
  const blurDataURL = `data:image/webp;base64,${blur.toString("base64")}`;

  const filename = `${name}-${Date.now()}.webp`;
  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`projects/${filename}`, data, {
      access: "public",
      contentType: "image/webp",
    });
    url = blob.url;
  } else if (!process.env.VERCEL) {
    // Fuori da Vercel (sviluppo, test locale, VPS) si salva su disco.
    // Su Vercel il disco è in sola lettura: lì serve Vercel Blob.
    const dir = path.join(UPLOADS_DIR, "projects");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), data);
    url = `/uploads/projects/${filename}`;
  } else {
    throw new Error("BLOB_READ_WRITE_TOKEN non configurato");
  }

  return { url, width: info.width, height: info.height, blurDataURL };
}

/** Elimina un'immagine caricata dall'admin (ignora le immagini statiche del progetto) */
export async function deleteImage(url: string) {
  try {
    if (url.includes(".blob.vercel-storage.com")) {
      await del(url);
    } else if (url.startsWith("/uploads/")) {
      await unlink(path.join(UPLOADS_DIR, url.replace(/^\/uploads\//, "")));
    }
  } catch (error) {
    console.error("[storage] eliminazione immagine fallita", error);
  }
}
