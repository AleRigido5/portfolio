"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";

const STATUSES = ["NEW", "READ", "REPLIED", "ARCHIVED", "SPAM"] as const;
type Status = (typeof STATUSES)[number];

export async function setMessageStatus(id: string, status: Status) {
  await requireAdmin();
  if (!STATUSES.includes(status)) return;
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath(ADMIN_PATH, "layout"); // aggiorna contatori e liste del pannello
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.deleteMany({ where: { id } }); // nessun errore se già eliminato
  revalidatePath(ADMIN_PATH, "layout");
  redirect(`${ADMIN_PATH}/messaggi`);
}
