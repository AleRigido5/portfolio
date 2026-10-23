import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";

// Ordine e nomi delle categorie mostrate nella sezione "Chi sono".
// Il backend viene prima perché è il focus principale.
const CATEGORY_ORDER = ["BACKEND", "FRONTEND", "DATABASE", "DEVOPS", "TOOL"] as const;

export type SkillCategory = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  BACKEND: "Backend",
  FRONTEND: "Frontend",
  DATABASE: "Database",
  DEVOPS: "DevOps & Deploy",
  TOOL: "Strumenti",
};

export type SkillGroup = {
  category: SkillCategory;
  label: string;
  items: { id: string; name: string }[];
};

/**
 * Competenze raggruppate per categoria.
 * "use cache": la query viene eseguita al build e il risultato riusato,
 * quindi la home resta una pagina statica. Dopo una modifica ai dati
 * l'aggiornamento arriva entro un'ora, oppure subito con revalidateTag("technologies").
 */
export async function getSkillGroups(): Promise<SkillGroup[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("technologies");

  const technologies = await prisma.technology.findMany({
    where: { showInAbout: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, category: true },
  });

  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: technologies
      .filter((tech) => tech.category === category)
      .map(({ id, name }) => ({ id, name })),
  })).filter((group) => group.items.length > 0);
}