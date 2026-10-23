import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { imageExists } from "@/lib/admin/uploads-dir";
import { prisma } from "@/lib/prisma";

export type ProjectTech = { slug: string; name: string };

export type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null; // testo esteso, mostrato nella gallery
  role: string | null;
  client: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  year: number | null;
  featured: boolean;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL: string | null;
  } | null;
  technologies: ProjectTech[];
};

/**
 * Progetti pubblicati: prima quelli in evidenza, poi per sortOrder.
 * In cache come le competenze: aggiornamento entro un'ora o con revalidateTag("projects").
 */
export async function getPublishedProjects(): Promise<ProjectCardData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");

  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      description: true,
      role: true,
      client: true,
      liveUrl: true,
      repoUrl: true,
      featured: true,
      completedAt: true,
      coverImage: true,
      coverAlt: true,
      coverWidth: true,
      coverHeight: true,
      coverBlur: true,
      technologies: {
        select: { slug: true, name: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    description: p.description,
    role: p.role,
    client: p.client,
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
    featured: p.featured,
    year: p.completedAt ? p.completedAt.getFullYear() : null,
    cover: imageExists(p.coverImage)
      ? {
          src: p.coverImage,
          alt: p.coverAlt,
          width: p.coverWidth,
          height: p.coverHeight,
          blurDataURL: p.coverBlur,
        }
      : null,
    technologies: p.technologies,
  }));
}