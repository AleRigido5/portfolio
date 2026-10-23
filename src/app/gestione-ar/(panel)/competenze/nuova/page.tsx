import type { Metadata } from "next";

import { PageHeader } from "@/components/admin/page-header";
import { TechnologyForm } from "@/components/admin/technology-form";
import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Nuova tecnologia" };

export default async function NewTechnologyPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Nuova tecnologia" back={{ href: `${ADMIN_PATH}/competenze`, label: "Competenze" }} />
      <TechnologyForm />
    </>
  );
}
