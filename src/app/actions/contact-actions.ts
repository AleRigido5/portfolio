"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";

import { sendContactConfirmation, sendContactNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { contactSchema, type ContactState } from "@/lib/validations/contact-schema";

const RATE_LIMIT_MAX = 3; // messaggi massimi per IP...
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // ...in un'ora
const GLOBAL_LIMIT_MAX = 20; // messaggi massimi in totale (tutti gli IP) in un'ora
const MIN_FILL_TIME_MS = 3000; // un umano non compila il form in meno di 3 secondi

const SUCCESS: ContactState = {
  status: "success",
  message: "Messaggio inviato. Ti risponderò il prima possibile.",
};

// L'IP non viene mai salvato in chiaro (GDPR): solo un hash con salt segreto
function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${process.env.IP_HASH_SALT ?? ""}:${ip}`)
    .digest("hex");
}

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1. Honeypot: campo invisibile agli utenti, i bot lo compilano.
  //    Rispondiamo "successo" così il bot non capisce di essere stato bloccato.
  if (formData.get("company_website")) {
    return SUCCESS;
  }

  // 2. Validazione lato server (l'unica di cui fidarsi)
  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? undefined,
    email: formData.get("email") ?? undefined,
    subject: formData.get("subject") ?? undefined,
    message: formData.get("message") ?? undefined,
    consent: formData.get("consent") ?? undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Controlla i campi evidenziati.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const data = parsed.data;
  const requestHeaders = await headers();

  // 3. Rate limiting per IP
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    null;
  const ipHash = ip ? hashIp(ip) : null;

  if (ipHash) {
    const recent = await prisma.contactMessage.count({
      where: {
        ipHash,
        createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
      },
    });

    if (recent >= RATE_LIMIT_MAX) {
      return {
        status: "error",
        message: "Hai già inviato diversi messaggi. Riprova tra un'ora oppure scrivimi direttamente via email.",
      };
    }
  }

  // 3b. Freno globale: se qualcuno falsifica l'IP per aggirare il limite,
  //     il form si ferma comunque dopo 20 messaggi in un'ora (protegge anche
  //     la casella Gmail che invia le conferme dal finire tra gli spammer)
  const recentTotal = await prisma.contactMessage.count({
    where: { createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) } },
  });
  if (recentTotal >= GLOBAL_LIMIT_MAX) {
    return {
      status: "error",
      message: "Il modulo è momentaneamente non disponibile. Scrivimi direttamente via email.",
    };
  }

  // 4. Compilazione troppo veloce → probabile bot: salvato come SPAM, senza notifica
  const elapsed = Number(formData.get("elapsed"));
  const tooFast = Number.isFinite(elapsed) && elapsed > 0 && elapsed < MIN_FILL_TIME_MS;

  // 5. Salvataggio su MySQL
  let messageId: string;
  try {
    const saved = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject ?? null,
        message: data.message,
        status: tooFast ? "SPAM" : "NEW",
        ipHash,
        userAgent: requestHeaders.get("user-agent")?.slice(0, 255) ?? null,
      },
      select: { id: true },
    });
    messageId = saved.id;
  } catch (error) {
    console.error("[contact] salvataggio fallito", error);
    return {
      status: "error",
      message: "Si è verificato un errore. Riprova tra qualche minuto oppure scrivimi direttamente via email.",
    };
  }

  // 6. Notifica email DOPO aver risposto all'utente: l'invio SMTP (1-2 secondi)
  //    non rallenta il form. L'esito viene salvato sul messaggio.
  if (!tooFast) {
    after(async () => {
      try {
        await sendContactNotification(data);
        await prisma.contactMessage.update({
          where: { id: messageId },
          data: { notifiedAt: new Date(), notifyError: null },
        });
      } catch (error) {
        console.error("[contact] notifica email fallita", error);
        await prisma.contactMessage.update({
          where: { id: messageId },
          data: { notifyError: String(error).slice(0, 500) },
        });
      }

      // Conferma al visitatore: se fallisce non blocca nulla (il messaggio è già salvato)
      try {
        await sendContactConfirmation(data);
      } catch (error) {
        console.error("[contact] email di conferma fallita", error);
      }
    });
  }

  return SUCCESS;
}
