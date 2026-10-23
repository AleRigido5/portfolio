import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { ADMIN_LOGIN_PATH, SESSION_COOKIE, SESSION_DURATION_MS } from "./config";

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

/** Hash dell'IP del client (mai salvato in chiaro), usato per il rate limiting */
export async function getClientIpHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return sha256(`${process.env.IP_HASH_SALT ?? ""}:${ip}`);
}

/** Crea la sessione nel database e imposta il cookie (solo in Server Action) */
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const userAgent = (await headers()).get("user-agent")?.slice(0, 255) ?? null;

  await prisma.adminSession.create({
    data: { tokenHash: sha256(token), userId, expiresAt, userAgent },
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // non leggibile da JavaScript
    secure: process.env.NODE_ENV === "production", // solo HTTPS in produzione
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Elimina la sessione corrente dal database e il cookie (solo in Server Action) */
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.adminSession.deleteMany({ where: { tokenHash: sha256(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Sessione valida corrente, oppure null.
 * cache(): nella stessa richiesta la query viene eseguita una sola volta
 * anche se più componenti/azioni la chiedono.
 */
export const getAdminSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // Il controllo di scadenza usa l'ora attuale: connection() dice a Next.js
  // che questa parte va eseguita a ogni richiesta, mai prerenderizzata
  await connection();

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: sha256(token) },
    select: { expiresAt: true, user: { select: { id: true, email: true } } },
  });

  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
});

/**
 * Da chiamare in OGNI pagina, query e Server Action dell'admin.
 * Il proxy fa solo un controllo veloce sul cookie: la verifica vera è questa.
 */
export async function requireAdmin() {
  const user = await getAdminSession();
  if (!user) redirect(ADMIN_LOGIN_PATH);
  return user;
}
