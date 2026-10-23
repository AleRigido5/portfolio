import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExperienceForm } from "@/components/admin/experience-form";
import { DeleteButton } from "@/components/admin/form-ui";
import { PageHeader } from "@/components/admin/page-header";
import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { deleteExperience } from "../../../_actions/experience-actions";

export const metadata: Metadata = { title: "Modifica esperienza" };

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const [experience, technologies] = await Promise.all([
    prisma.experience.findUnique({
      where: { id },
      include: { technologies: { select: { id: true } } },
    }),
    prisma.technology.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      select: { id: true, name: true },
    }),
  ]);
  if (!experience) notFound();

  const highlights = Array.isArray(experience.highlights)
    ? experience.highlights.filter((h): h is string => typeof h === "string")
    : [];

  return (
    <>
      <PageHeader title={experience.role} back={{ href: `${ADMIN_PATH}/esperienze`, label: "Esperienze" }}>
        <DeleteButton action={deleteExperience.bind(null, experience.id)} label="Elimina esperienza" />
      </PageHeader>
      <ExperienceForm
        experience={{
          id: experience.id,
          type: experience.type,
          role: experience.role,
          organization: experience.organization,
          location: experience.location,
          url: experience.url,
          startDate: experience.startDate,
          endDate: experience.endDate,
          description: experience.description,
          highlights,
          sortOrder: experience.sortOrder,
          technologyIds: experience.technologies.map((t) => t.id),
        }}
        technologies={technologies}
      />
    </>
  );
}
