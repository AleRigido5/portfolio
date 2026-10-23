"use server";

import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH, ADMIN_PATH, LOGIN_MAX_FAILURES, LOGIN_WINDOW_MS } from "@/lib/admin/config";
import { getDummyHash, verifyPassword } from "@/lib/admin/password";
import { createSession, destroySession, getClientIpHash } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { loginSchema, type FormState } from "@/lib/validations/admin-schemas";

// Messaggio unico per email o password sbagliate: non rivela quale delle due
const INVALID = "Email o password non corretti.";

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const ipHash = await getClientIpHash();

  // 1. Troppi tentativi falliti di recente da questo IP → blocco temporaneo
  const failures = await prisma.loginAttempt.count({
    where: { ipHash, success: false, createdAt: { gte: new Date(Date.now() - LOGIN_WINDOW_MS) } },
  });
  if (failures >= LOGIN_MAX_FAILURES) {
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

  // 3. Sessione: pulizia di quelle scadute, poi una nuova
  await prisma.adminSession.deleteMany({ where: { userId: user.id, expiresAt: { lt: new Date() } } });
  await createSession(user.id);
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  redirect(ADMIN_PATH);
}

export async function logout() {
  await destroySession();
  redirect(ADMIN_LOGIN_PATH);
}
