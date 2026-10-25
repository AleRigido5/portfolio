import type { MetadataRoute } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

// Data dell'ultima modifica a progetti o esperienze: dice a Google quando ricontrollare il sito.
// In cache: si aggiorna quando salvi dall'admin (stessi tag) o al massimo una volta al giorno.
async function getLastContentUpdate() {
  "use cache";
  cacheLife("days");
  cacheTag("projects", "experiences");

  const [project, experience] = await Promise.all([
    prisma.project.findFirst({ where: { published: true }, orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.experience.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
  ]);

  const dates = [project?.updatedAt, experience?.updatedAt].filter((d): d is Date => !!d);
  return dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;
}

// Genera /sitemap.xml
// Il sito è una pagina unica: le sezioni (#about, #projects...) non vanno elencate,
// Google indicizza gli URL, non le ancore. Aggiungi qui le pagine future (es. /privacy).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = await getLastContentUpdate();

  return [
    {
      url: siteConfig.url,
      ...(lastModified && { lastModified }),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}