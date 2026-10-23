"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { technologySchema, zodErrorState, type FormState } from "@/lib/validations/admin-schemas";

const LIST_PATH = `${ADMIN_PATH}/competenze`;

// Le tecnologie compaiono in "Chi sono", nei progetti e nelle esperienze
function refreshPublicSite() {
  updateTag("technologies");
  updateTag("projects");
  updateTag("experiences");
}

export async function saveTechnology(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = formData.get("id")?.toString() || null;
  const parsed = technologySchema.safeParse({
    name: formData.get("name") ?? "",
    slug: formData.get("slug") ?? "",
    category: formData.get("category") ?? "",
    showInAbout: formData.get("showInAbout") ?? undefined,
    sortOrder: formData.get("sortOrder") ?? "0",
  });
  if (!parsed.success) return zodErrorState(parsed.error);

  const data = { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.name).slice(0, 60) };

  const clash = await prisma.technology.findFirst({
    where: { OR: [{ name: data.name }, { slug: data.slug }], ...(id && { NOT: { id } }) },
    select: { name: true },
  });
  if (clash) {
    const field = clash.name === data.name ? "name" : "slug";
    return {
      status: "error",
      message: "Controlla i campi evidenziati.",
      fieldErrors: { [field]: ["Esiste già una tecnologia con questo valore."] },
    };
  }

  try {
    if (id) await prisma.technology.update({ where: { id }, data });
    else await prisma.technology.create({ data });
  } catch (error) {
    console.error("[admin] salvataggio tecnologia fallito", error);
    return { status: "error", message: "Salvataggio non riuscito. Riprova." };
  }

  refreshPublicSite();
  revalidatePath(ADMIN_PATH, "layout"); // liste e contatori dell'admin aggiornati
  redirect(LIST_PATH);
}

export async function deleteTechnology(id: string) {
  await requireAdmin();
  // I collegamenti con progetti ed esperienze vengono rimossi in automatico
  await prisma.technology.deleteMany({ where: { id } }); // deleteMany: nessun errore se già eliminata
  refreshPublicSite();
  revalidatePath(ADMIN_PATH, "layout"); // liste e contatori dell'admin aggiornati
  redirect(LIST_PATH);
}
