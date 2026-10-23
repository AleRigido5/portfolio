"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { deleteImage, saveImage, validateImage, type StoredImage } from "@/lib/admin/storage";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { projectSchema, zodErrorState, type FormState } from "@/lib/validations/admin-schemas";

const LIST_PATH = `${ADMIN_PATH}/progetti`;

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = formData.get("id")?.toString() || null;

  const parsed = projectSchema.safeParse({
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    summary: formData.get("summary") ?? "",
    description: formData.get("description") ?? "",
    coverAlt: formData.get("coverAlt") ?? "",
    liveUrl: formData.get("liveUrl") ?? "",
    repoUrl: formData.get("repoUrl") ?? "",
    role: formData.get("role") ?? "",
    client: formData.get("client") ?? "",
    featured: formData.get("featured") ?? undefined,
    published: formData.get("published") ?? undefined,
    sortOrder: formData.get("sortOrder") ?? "0",
    completedAt: formData.get("completedAt") ?? "",
    technologies: formData.getAll("technologies").map(String),
  });
  if (!parsed.success) return zodErrorState(parsed.error);

  const { technologies, slug: rawSlug, ...data } = parsed.data;
  const slug = rawSlug || slugify(data.title);

  // Slug univoco (è l'URL del progetto)
  const clash = await prisma.project.findFirst({
    where: { slug, ...(id && { NOT: { id } }) },
    select: { id: true },
  });
  if (clash) {
    return { status: "error", message: "Controlla i campi evidenziati.", fieldErrors: { slug: ["Esiste già un progetto con questo slug."] } };
  }

  const existing = id
    ? await prisma.project.findUnique({ where: { id }, select: { coverImage: true } })
    : null;
  if (id && !existing) return { status: "error", message: "Progetto non trovato." };

  // Immagine: obbligatoria alla creazione, facoltativa in modifica (resta quella attuale)
  const file = formData.get("cover");
  let image: StoredImage | null = null;

  if (file instanceof File && file.size > 0) {
    const invalid = validateImage(file);
    if (invalid) return { status: "error", message: "Controlla i campi evidenziati.", fieldErrors: { cover: [invalid] } };
    try {
      image = await saveImage(file, slug);
    } catch (error) {
      console.error("[admin] upload immagine fallito", error);
      return { status: "error", message: "Caricamento dell'immagine non riuscito. Riprova." };
    }
  } else if (!id) {
    return { status: "error", message: "Controlla i campi evidenziati.", fieldErrors: { cover: ["Carica un'immagine di copertina."] } };
  }

  const cover = image && {
    coverImage: image.url,
    coverWidth: image.width,
    coverHeight: image.height,
    coverBlur: image.blurDataURL,
  };
  const techIds = technologies.map((techId) => ({ id: techId }));

  try {
    if (id) {
      await prisma.project.update({
        where: { id },
        data: { ...data, slug, ...cover, technologies: { set: techIds } },
      });
    } else if (cover) {
      await prisma.project.create({
        data: { ...data, slug, ...cover, technologies: { connect: techIds } },
      });
    }
  } catch (error) {
    console.error("[admin] salvataggio progetto fallito", error);
    if (image) await deleteImage(image.url); // niente file orfani
    return { status: "error", message: "Salvataggio non riuscito. Riprova." };
  }

  // La vecchia copertina, se sostituita, non serve più
  if (image && existing?.coverImage) await deleteImage(existing.coverImage);

  updateTag("projects"); // il sito pubblico mostra subito le modifiche
  revalidatePath(ADMIN_PATH, "layout"); // liste e contatori dell'admin aggiornati
  redirect(LIST_PATH);
}

export async function toggleProjectPublished(id: string, published: boolean) {
  await requireAdmin();
  await prisma.project.update({ where: { id }, data: { published } });
  updateTag("projects");
  revalidatePath(ADMIN_PATH, "layout");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const project = await prisma.project.findUnique({ where: { id }, select: { coverImage: true } });
  if (project) {
    await prisma.project.deleteMany({ where: { id } });
    await deleteImage(project.coverImage);
  }
  updateTag("projects");
  revalidatePath(ADMIN_PATH, "layout"); // liste e contatori dell'admin aggiornati
  redirect(LIST_PATH);
}
