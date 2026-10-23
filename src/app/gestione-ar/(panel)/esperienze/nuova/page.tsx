import type { Metadata } from "next";

import { ExperienceForm } from "@/components/admin/experience-form";
import { PageHeader } from "@/components/admin/page-header";
import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Nuova esperienza" };

export default async function NewExperiencePage() {
  await requireAdmin();
  const technologies = await prisma.technology.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <>
      <PageHeader title="Nuova esperienza" back={{ href: `${ADMIN_PATH}/esperienze`, label: "Esperienze" }} />
      <ExperienceForm technologies={technologies} />
    </>
  );
}
