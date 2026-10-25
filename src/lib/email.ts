import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

import { siteConfig } from "@/lib/site";
import type { ContactInput } from "@/lib/validations/contact-schema";

let transporter: Transporter | null = null;

// Creato solo al primo invio e poi riusato
function getTransporter(): Transporter {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error("SMTP non configurato: controlla SMTP_HOST, SMTP_USER e SMTP_PASSWORD");
  }

  const port = Number(SMTP_PORT ?? 465);

  transporter ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL diretto, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  return transporter;
}

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

/**
 * Notifica a te il nuovo messaggio.
 * Solo testo semplice (niente HTML): il contenuto scritto dal visitatore
 * non può iniettare markup o link nascosti nell'email.
 * "replyTo" permette di rispondere direttamente al visitatore.
 */
export async function sendContactNotification(data: ContactInput) {
  const from = process.env.SMTP_USER!;
  const to = process.env.CONTACT_TO_EMAIL || from;

  await getTransporter().sendMail({
    from: { name: "Portfolio — Contatti", address: from },
    to,
    replyTo: { name: oneLine(data.name), address: data.email },
    subject: oneLine(`Nuovo messaggio: ${data.subject ?? `da ${data.name}`}`).slice(0, 200),
    text: [
      `Nome: ${data.name}`,
      `Email: ${data.email}`,
      `Oggetto: ${data.subject ?? "—"}`,
      "",
      "Messaggio:",
      data.message,
      "",
      "—",
      "Rispondi a questa email per scrivere direttamente al mittente.",
    ].join("\n"),
  });
}

/**
 * Email di conferma a chi ha compilato il form.
 * Volutamente NON contiene il testo del messaggio: altrimenti chiunque potrebbe
 * usare il form per far arrivare contenuti a indirizzi altrui (spam "riflesso").
 * Del nome si usa solo la prima parola, accorciata, per lo stesso motivo.
 */
export async function sendContactConfirmation(data: ContactInput) {
  const from = process.env.SMTP_USER!;
  const replyTo = process.env.CONTACT_TO_EMAIL || from;
  const firstName = oneLine(data.name).split(" ")[0].slice(0, 30);

  await getTransporter().sendMail({
    from: { name: siteConfig.name, address: from },
    to: data.email,
    replyTo,
    subject: "Ho ricevuto il tuo messaggio",
    text: [
      `Ciao ${firstName},`,
      "",
      "grazie per avermi scritto. Ho ricevuto il tuo messaggio e ti risponderò il prima possibile, di norma entro 24-48 ore lavorative.",
      "",
      "Se desideri aggiungere altre informazioni, puoi rispondere direttamente a questa email.",
      "",
      "A presto,",
      siteConfig.name,
      "Full-stack Web Developer",
      "",
      "—",
      "Ricevi questa email perché il tuo indirizzo è stato inserito nel modulo di contatto del sito.",
      "Se non hai inviato tu la richiesta, puoi ignorarla.",
    ].join("\n"),
  });
}