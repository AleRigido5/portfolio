import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { Badge, EmptyState, PageHeader, PrimaryLink } from "@/components/admin/page-header";
import { ADMIN_PATH } from "@/lib/admin/config";
import { imageExists } from "@/lib/admin/uploads-dir";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { toggleProjectPublished } from "../../_actions/project-actions";

export const metadata: Metadata = { title: "Progetti" };

export default async function ProjectsAdminPage() {
  await requireAdmin();

  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      summary: true,
      coverImage: true,
      published: true,
      featured: true,
      sortOrder: true,
      _count: { select: { technologies: true } },
    },
  });

  return (
    <>
      <PageHeader title="Progetti" description="I lavori mostrati nella sezione Progetti del sito.">
        <PrimaryLink href={`${ADMIN_PATH}/progetti/nuovo`}>Nuovo progetto</PrimaryLink>
      </PageHeader>

      {projects.length === 0 ? (
        <EmptyState>Nessun progetto. Crea il primo!</EmptyState>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-3 pr-4 transition-colors hover:border-accent/40"
            >
              <div className="relative hidden aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-background sm:block">
                {imageExists(project.coverImage) && (
                  <Image src={project.coverImage} alt="" fill sizes="112px" className="object-cover" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`${ADMIN_PATH}/progetti/${project.id}`}
                    className="font-medium hover:text-accent"
                  >
                    {project.title}
                  </Link>
                  {project.featured && <Badge tone="accent">In evidenza</Badge>}
                  {!project.published && <Badge tone="warning">Bozza</Badge>}
                </p>
                <p className="mt-0.5 truncate text-sm text-muted">{project.summary}</p>
                <p className="mt-1 text-xs text-muted">
                  Ordine {project.sortOrder} · {project._count.technologies} tecnologie
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                <form action={toggleProjectPublished.bind(null, project.id, !project.published)}>
                  <button
                    type="submit"
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
                  >
                    {project.published ? "Nascondi" : "Pubblica"}
                  </button>
                </form>
                <Link
                  href={`${ADMIN_PATH}/progetti/${project.id}`}
                  className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
                >
                  Modifica
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
