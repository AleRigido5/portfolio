import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/form-ui";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { ADMIN_PATH } from "@/lib/admin/config";
import { imageExists } from "@/lib/admin/uploads-dir";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { deleteProject } from "../../../_actions/project-actions";

export const metadata: Metadata = { title: "Modifica progetto" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const [project, technologies] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { technologies: { select: { id: true } } },
    }),
    prisma.technology.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      select: { id: true, name: true },
    }),
  ]);
  if (!project) notFound();

  const { technologies: linked, ...rest } = project;

  return (
    <>
      <PageHeader title={project.title} back={{ href: `${ADMIN_PATH}/progetti`, label: "Progetti" }}>
        <DeleteButton action={deleteProject.bind(null, project.id)} label="Elimina progetto" />
      </PageHeader>
      <ProjectForm
        project={{
          ...rest,
          coverImage: imageExists(rest.coverImage) ? rest.coverImage : null,
          technologyIds: linked.map((t) => t.id),
        }}
        technologies={technologies}
      />
    </>
  );
}
