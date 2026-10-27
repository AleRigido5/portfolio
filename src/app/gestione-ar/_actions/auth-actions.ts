"use server";

import { redirect } from "next/navigation";

import {
  ADMIN_LOGIN_PATH,
  ADMIN_PATH,
  LOGIN_ATTEMPTS_RETENTION_MS,
  LOGIN_MAX_FAILURES,
  LOGIN_MAX_GLOBAL_FAILURES,
  LOGIN_WINDOW_MS,
  MESSAGES_RETENTION_MS,
} from "@/lib/admin/config";
import { getDummyHash, verifyPassword } from "@/lib/admin/password";
import { createSession, destroySession, getClientIpHash } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { loginSchema, type FormState } from "@/lib/validations/admin-schemas";

// Messaggio unico per email o password sbagliate: non rivela quale delle due
const INVALID = "Email o password non corretti.";

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const ipHash = await getClientIpHash();

  // 1. Troppi tentativi falliti di recente → blocco temporaneo
  //    (per questo IP, oppure in totale se qualcuno cambia IP a ogni tentativo)
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const [failures, globalFailures] = await Promise.all([
    prisma.loginAttempt.count({ where: { ipHash, success: false, createdAt: { gte: since } } }),
    prisma.loginAttempt.count({ where: { success: false, createdAt: { gte: since } } }),
  ]);
  if (failures >= LOGIN_MAX_FAILURES || globalFailures >= LOGIN_MAX_GLOBAL_FAILURES) {
    return { status: "error", message: "Troppi tentativi. Riprova tra 15 minuti." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) return { status: "error", message: INVALID };

  // 2. Verifica: con email inesistente si confronta comunque un hash fittizio
  const user = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, passwordHash: true },
  });
  const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? (await getDummyHash()));

  await prisma.loginAttempt.create({ data: { ipHash, success: Boolean(user && valid) } });

  if (!user || !valid) return { status: "error", message: INVALID };

  // 3. Pulizia: sessioni scadute, tentativi di login vecchi e messaggi oltre i 12 mesi
  //    (i dati personali non si tengono più del necessario: GDPR)
  const now = Date.now();
  await Promise.all([
    prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date(now) } } }),
    prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(now - LOGIN_ATTEMPTS_RETENTION_MS) } } }),
    prisma.contactMessage.deleteMany({ where: { createdAt: { lt: new Date(now - MESSAGES_RETENTION_MS) } } }),
  ]);

  // 4. Nuova sessione
  await createSession(user.id);
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  redirect(ADMIN_PATH);
}

export async function logout() {
  await destroySession();
  redirect(ADMIN_LOGIN_PATH);
}
