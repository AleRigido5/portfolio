import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

import { siteConfig } from "@/lib/site";
import type { ContactInput } from "@/lib/validations/contact-schema";

/* ------------------------------------------------------------------ */
/* Link pubblici mostrati nel footer delle email: gli stessi del        */
/* footer del sito, presi da siteConfig (policy iubenda).              */
/* ------------------------------------------------------------------ */

const SITE_URL = siteConfig.url;
const PRIVACY_URL = siteConfig.privacyPolicyUrl;
const COOKIE_URL = siteConfig.cookiePolicyUrl;
const SITE_LABEL = SITE_URL.replace(/^https?:\/\//, "");

/* ------------------------------------------------------------------ */
/* Trasporto SMTP                                                      */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Utility                                                             */
/* ------------------------------------------------------------------ */

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

/** Tutto il testo scritto dal visitatore passa da qui prima di finire nell'HTML. */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Testo multilinea → HTML sicuro con gli a capo conservati. */
const multiline = (value: string) => escapeHtml(value.trim()).replace(/\r?\n/g, "<br>");

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

/* ------------------------------------------------------------------ */
/* Stile: colori del sito, font di sistema (i webfont nelle email       */
/* non sono affidabili), tutto inline, layout a tabelle.               */
/* ------------------------------------------------------------------ */

const C = {
  page: "#f4f4f7",
  card: "#ffffff",
  ink: "#0b0b12",
  text: "#1f2937",
  muted: "#6b7280",
  line: "#e5e7eb",
  soft: "#f8f8fb",
  indigo: "#6366f1",
  indigoLight: "#818cf8",
  indigoSoft: "#eef2ff",
};

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** Logo testuale {AR}: niente immagini, quindi visibile anche con le immagini bloccate. */
const logo = `<span style="font-family:${MONO};font-size:20px;font-weight:700;letter-spacing:-0.5px;color:#ffffff;"><span style="color:${C.indigoLight};">{</span>AR<span style="color:${C.indigoLight};">}</span></span>`;

function layout(opts: { preheader: string; badge: string; body: string }) {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="it" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(siteConfig.name)}</title>
<!--[if mso]><style>table,td{font-family:Arial,sans-serif !important;}</style><![endif]-->
<style>
  @media only screen and (max-width:620px){
    .container{width:100% !important;}
    .px{padding-left:22px !important;padding-right:22px !important;}
    .stack td{display:block !important;width:100% !important;box-sizing:border-box !important;}
    .stack td:first-child{border-bottom:0 !important;padding-bottom:2px !important;}
    .btn a{display:block !important;}
  }
  a{color:${C.indigo};}
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.page};">${escapeHtml(opts.preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

      <!-- Header -->
      <tr><td style="background:${C.ink};border-radius:14px 14px 0 0;padding:22px 32px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle;">${logo}</td>
          <td align="right" style="vertical-align:middle;font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${C.indigoLight};">${opts.badge}</td>
        </tr></table>
      </td></tr>
      <tr><td style="height:3px;line-height:3px;font-size:0;background:${C.indigo};">&nbsp;</td></tr>

      <!-- Corpo -->
      <tr><td style="background:${C.card};border:1px solid ${C.line};border-top:0;border-radius:0 0 14px 14px;padding:36px 32px 32px;font-family:${FONT};color:${C.text};" class="px">
        ${opts.body}
      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding:24px 16px 8px;font-family:${FONT};font-size:12px;line-height:20px;color:${C.muted};">
        <a href="${SITE_URL}" style="color:${C.text};font-weight:600;text-decoration:none;">${escapeHtml(SITE_LABEL)}</a>
        &nbsp;·&nbsp;
        <a href="${PRIVACY_URL}" style="color:${C.muted};text-decoration:underline;">Privacy policy</a>
        &nbsp;·&nbsp;
        <a href="${COOKIE_URL}" style="color:${C.muted};text-decoration:underline;">Cookie policy</a>
        <br>
        © ${year} ${escapeHtml(siteConfig.name)} · Full-stack Web Developer
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** Riga etichetta/valore per i riepiloghi. */
function row(label: string, valueHtml: string, last = false) {
  const border = last ? "" : `border-bottom:1px solid ${C.line};`;
  return `<tr class="stack">
    <td width="130" style="padding:12px 16px;${border}font-size:12px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:${C.muted};vertical-align:top;">${label}</td>
    <td style="padding:12px 16px;${border}font-size:15px;line-height:22px;color:${C.text};vertical-align:top;word-break:break-word;">${valueHtml}</td>
  </tr>`;
}

function box(rows: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.line};border-radius:10px;border-collapse:separate;background:${C.soft};">${rows}</table>`;
}

function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn"><tr>
    <td style="border-radius:8px;background:${C.indigo};">
      <a href="${href}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${label}</a>
    </td>
  </tr></table>`;
}

const textFooter = [
  "",
  "—",
  `Sito: ${SITE_URL}`,
  `Privacy policy: ${PRIVACY_URL}`,
  `Cookie policy: ${COOKIE_URL}`,
];

/* ------------------------------------------------------------------ */
/* Email per te: notifica di un nuovo messaggio                        */
/* ------------------------------------------------------------------ */

/**
 * Notifica a te il nuovo messaggio.
 * Tutto il contenuto scritto dal visitatore viene escapato: non può iniettare
 * markup o link nascosti. "replyTo" permette di rispondere direttamente.
 */
export async function sendContactNotification(data: ContactInput) {
  const from = process.env.SMTP_USER!;
  const to = process.env.CONTACT_TO_EMAIL || from;
  const receivedAt = formatDate(new Date());

  const name = oneLine(data.name);
  const subject = data.subject ? oneLine(data.subject) : "";
  const mailSubject = oneLine(`Nuovo messaggio: ${subject || `da ${name}`}`).slice(0, 200);

  const replyHref = `mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent(
    `Re: ${subject || "il tuo messaggio"}`,
  )}`;

  const body = `
    <p style="margin:0 0 6px;font-size:13px;color:${C.muted};">${escapeHtml(receivedAt)}</p>
    <h1 style="margin:0 0 8px;font-size:24px;line-height:30px;font-weight:700;color:${C.ink};">Nuova richiesta ricevuta</h1>
    <p style="margin:0 0 26px;font-size:15px;line-height:23px;color:${C.muted};">
      <strong style="color:${C.text};">${escapeHtml(name)}</strong> ti ha scritto dal modulo contatti del sito.
    </p>

    ${box(
      row("Nome", escapeHtml(name)) +
        row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:${C.indigo};text-decoration:none;">${escapeHtml(data.email)}</a>`) +
        row("Oggetto", subject ? escapeHtml(subject) : `<span style="color:${C.muted};">Non indicato</span>`, true),
    )}

    <p style="margin:28px 0 10px;font-size:12px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:${C.muted};">Messaggio</p>
    <div style="border-left:3px solid ${C.indigo};background:${C.indigoSoft};border-radius:0 8px 8px 0;padding:16px 18px;font-size:15px;line-height:24px;color:${C.text};word-break:break-word;">
      ${multiline(data.message)}
    </div>

    <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
    ${button(replyHref, `Rispondi a ${escapeHtml(name.split(" ")[0].slice(0, 30))}`)}
    <p style="margin:14px 0 0;font-size:13px;line-height:20px;color:${C.muted};">
      Oppure premi semplicemente “Rispondi”: la risposta arriva direttamente a ${escapeHtml(data.email)}.
    </p>`;

  await getTransporter().sendMail({
    from: { name: "Portfolio — Contatti", address: from },
    to,
    replyTo: { name, address: data.email },
    subject: mailSubject,
    html: layout({
      preheader: `${name}: ${oneLine(data.message).slice(0, 90)}`,
      badge: "Nuova richiesta",
      body,
    }),
    text: [
      "NUOVA RICHIESTA RICEVUTA",
      `Ricevuta: ${receivedAt}`,
      "",
      `Nome: ${data.name}`,
      `Email: ${data.email}`,
      `Oggetto: ${data.subject ?? "—"}`,
      "",
      "Messaggio:",
      data.message,
      "",
      "Rispondi a questa email per scrivere direttamente al mittente.",
      ...textFooter,
    ].join("\n"),
  });
}

/* ------------------------------------------------------------------ */
/* Email per chi ha compilato il form: conferma di ricezione            */
/* ------------------------------------------------------------------ */

/**
 * Email di conferma a chi ha compilato il form.
 * Volutamente NON contiene il testo del messaggio né l'oggetto: altrimenti
 * chiunque potrebbe usare il form per far arrivare contenuti a indirizzi altrui
 * (spam "riflesso"). Del nome si usa solo la prima parola, accorciata.
 */
export async function sendContactConfirmation(data: ContactInput) {
  const from = process.env.SMTP_USER!;
  const replyTo = process.env.CONTACT_TO_EMAIL || from;
  const firstName = oneLine(data.name).split(" ")[0].slice(0, 30);
  const sentAt = formatDate(new Date());

  const body = `
    <h1 style="margin:0 0 14px;font-size:24px;line-height:31px;font-weight:700;color:${C.ink};">Ho ricevuto il tuo messaggio</h1>
    <p style="margin:0 0 14px;font-size:16px;line-height:25px;">Ciao ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 26px;font-size:16px;line-height:25px;">
      grazie per avermi scritto. Il tuo messaggio è arrivato correttamente e lo leggerò con attenzione.
    </p>

    ${box(
      row("Inviato", escapeHtml(sentAt)) +
        row("Risposta a", escapeHtml(data.email), true),
    )}

    <p style="margin:30px 0 12px;font-size:12px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:${C.muted};">Cosa succede ora</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${[
        "Leggo il tuo messaggio e valuto la richiesta.",
        "Ti rispondo a questo indirizzo email, di norma entro 24-48 ore lavorative.",
        "Se vuoi aggiungere dettagli, rispondi pure a questa email.",
      ]
        .map(
          (step, i) => `<tr>
        <td width="34" style="padding:0 0 12px;vertical-align:top;">
          <div style="width:24px;height:24px;line-height:24px;border-radius:12px;background:${C.indigoSoft};color:${C.indigo};font-size:12px;font-weight:700;text-align:center;">${i + 1}</div>
        </td>
        <td style="padding:2px 0 12px;font-size:15px;line-height:22px;color:${C.text};">${step}</td>
      </tr>`,
        )
        .join("")}
    </table>

    <div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>
    ${button(SITE_URL, "Visita il sito")}

    <p style="margin:30px 0 0;font-size:15px;line-height:23px;">
      A presto,<br>
      <strong style="color:${C.ink};">${escapeHtml(siteConfig.name)}</strong><br>
      <span style="color:${C.muted};">Full-stack Web Developer</span>
    </p>

    <p style="margin:28px 0 0;padding-top:18px;border-top:1px solid ${C.line};font-size:12px;line-height:19px;color:${C.muted};">
      Ricevi questa email perché il tuo indirizzo è stato inserito nel modulo di contatto del sito.
      Se non hai inviato tu la richiesta, puoi ignorarla.
    </p>`;

  await getTransporter().sendMail({
    from: { name: siteConfig.name, address: from },
    to: data.email,
    replyTo,
    subject: "Ho ricevuto il tuo messaggio",
    html: layout({
      preheader: "Grazie per avermi scritto: ti rispondo il prima possibile.",
      badge: "Conferma",
      body,
    }),
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
      ...textFooter,
      "",
      "Ricevi questa email perché il tuo indirizzo è stato inserito nel modulo di contatto del sito.",
      "Se non hai inviato tu la richiesta, puoi ignorarla.",
    ].join("\n"),
  });
}