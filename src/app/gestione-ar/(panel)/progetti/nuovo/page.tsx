import type { Metadata } from "next";

import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Nuovo progetto" };

export default async function NewProjectPage() {
  await requireAdmin();
  const technologies = await prisma.technology.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <>
      <PageHeader title="Nuovo progetto" back={{ href: `${ADMIN_PATH}/progetti`, label: "Progetti" }} />
      <ProjectForm technologies={technologies} />
    </>
  );
}
