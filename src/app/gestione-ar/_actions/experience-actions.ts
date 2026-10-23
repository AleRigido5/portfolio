"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { experienceSchema, zodErrorState, type FormState } from "@/lib/validations/admin-schemas";

const LIST_PATH = `${ADMIN_PATH}/esperienze`;

export async function saveExperience(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = formData.get("id")?.toString() || null;
  const parsed = experienceSchema.safeParse({
    type: formData.get("type") ?? "",
    role: formData.get("role") ?? "",
    organization: formData.get("organization") ?? "",
    location: formData.get("location") ?? "",
    url: formData.get("url") ?? "",
    startDate: formData.get("startDate") ?? "",
    endDate: formData.get("endDate") ?? "",
    current: formData.get("current") ?? undefined,
    description: formData.get("description") ?? "",
    highlights: formData.get("highlights") ?? "",
    sortOrder: formData.get("sortOrder") ?? "0",
    technologies: formData.getAll("technologies").map(String),
  });
  if (!parsed.success) return zodErrorState(parsed.error);

  // "current" serve solo al form: non è una colonna del database
  const { technologies, current: _current, ...data } = parsed.data;
  const techIds = technologies.map((techId) => ({ id: techId }));

  try {
    if (id) {
      await prisma.experience.update({
        where: { id },
        data: { ...data, technologies: { set: techIds } },
      });
    } else {
      await prisma.experience.create({
        data: { ...data, technologies: { connect: techIds } },
      });
    }
  } catch (error) {
    console.error("[admin] salvataggio esperienza fallito", error);
    return { status: "error", message: "Salvataggio non riuscito. Riprova." };
  }

  updateTag("experiences");
  revalidatePath(ADMIN_PATH, "layout"); // liste e contatori dell'admin aggiornati
  redirect(LIST_PATH);
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await prisma.experience.deleteMany({ where: { id } }); // nessun errore se già eliminata
  updateTag("experiences");
  revalidatePath(ADMIN_PATH, "layout"); // liste e contatori dell'admin aggiornati
  redirect(LIST_PATH);
}
