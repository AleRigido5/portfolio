import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";

export type ExperienceItem = {
  id: string;
  role: string;
  organization: string;
  location: string | null;
  url: string | null;
  startDate: string; // ISO "2026-01-01"
  endDate: string | null; // null = in corso
  description: string | null;
  highlights: string[];
  technologies: { slug: string; name: string }[];
};

// Il campo Json "highlights" può contenere qualsiasi cosa: teniamo solo le stringhe
function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim() !== "")
    : [];
}

/**
 * Esperienze lavorative, dalla più recente.
 * In cache come le altre sezioni: aggiornamento entro un'ora o con revalidateTag("experiences").
 */
export async function getWorkExperiences(): Promise<ExperienceItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("experiences");

  const experiences = await prisma.experience.findMany({
    where: { type: "WORK" },
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
    select: {
      id: true,
      role: true,
      organization: true,
      location: true,
      url: true,
      startDate: true,
      endDate: true,
      description: true,
      highlights: true,
      technologies: {
        select: { slug: true, name: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return experiences.map((e) => ({
    ...e,
    startDate: e.startDate.toISOString().slice(0, 10),
    endDate: e.endDate ? e.endDate.toISOString().slice(0, 10) : null,
    highlights: toStringArray(e.highlights),
  }));
}