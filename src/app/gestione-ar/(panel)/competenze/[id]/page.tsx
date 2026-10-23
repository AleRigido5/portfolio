import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/form-ui";
import { PageHeader } from "@/components/admin/page-header";
import { TechnologyForm } from "@/components/admin/technology-form";
import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { deleteTechnology } from "../../../_actions/technology-actions";

export const metadata: Metadata = { title: "Modifica tecnologia" };

export default async function EditTechnologyPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const technology = await prisma.technology.findUnique({
    where: { id },
    select: { id: true, name: true, slug: true, category: true, showInAbout: true, sortOrder: true },
  });
  if (!technology) notFound();

  return (
    <>
      <PageHeader title={technology.name} back={{ href: `${ADMIN_PATH}/competenze`, label: "Competenze" }}>
        <DeleteButton action={deleteTechnology.bind(null, technology.id)} label="Elimina tecnologia" />
      </PageHeader>
      <TechnologyForm technology={technology} />
    </>
  );
}
