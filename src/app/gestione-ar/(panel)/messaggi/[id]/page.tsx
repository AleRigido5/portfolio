import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/form-ui";
import { MessageStatusBadge } from "@/components/admin/message-status";
import { PageHeader } from "@/components/admin/page-header";
import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { deleteMessage, setMessageStatus } from "../../../_actions/message-actions";

export const metadata: Metadata = { title: "Messaggio" };

const ACTIONS = [
  { status: "REPLIED", label: "Segna come risposto" },
  { status: "ARCHIVED", label: "Archivia" },
  { status: "READ", label: "Segna come letto" },
  { status: "NEW", label: "Segna come nuovo" },
  { status: "SPAM", label: "È spam" },
] as const;

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const found = await prisma.contactMessage.findUnique({ where: { id } });
  if (!found) notFound();

  // Aprendo un messaggio nuovo lo si considera letto
  const message =
    found.status === "NEW"
      ? await prisma.contactMessage.update({ where: { id }, data: { status: "READ" } })
      : found;

  const replySubject = encodeURIComponent(`Re: ${message.subject ?? "La tua richiesta"}`);

  return (
    <>
      <PageHeader
        title={message.subject ?? `Messaggio da ${message.name}`}
        back={{ href: `${ADMIN_PATH}/messaggi`, label: "Messaggi" }}
      >
        <a
          href={`mailto:${message.email}?subject=${replySubject}`}
          className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Rispondi via email
        </a>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
        <article className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
        </article>

        <aside className="space-y-6">
          <dl className="space-y-3 rounded-2xl border border-border bg-surface p-5 text-sm">
            <div>
              <dt className="text-xs text-muted">Da</dt>
              <dd className="font-medium">{message.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Email</dt>
              <dd className="break-all">{message.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Ricevuto</dt>
              <dd>{formatDateTime(message.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Stato</dt>
              <dd className="mt-1"><MessageStatusBadge status={message.status} /></dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Notifica email</dt>
              <dd>{message.notifiedAt ? "Inviata" : message.notifyError ? "Non riuscita" : "—"}</dd>
            </div>
          </dl>

          <div className="space-y-2">
            {ACTIONS.filter((a) => a.status !== message.status).map((action) => (
              <form key={action.status} action={setMessageStatus.bind(null, message.id, action.status)}>
                <button
                  type="submit"
                  className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  {action.label}
                </button>
              </form>
            ))}
            <div className="pt-2">
              <DeleteButton action={deleteMessage.bind(null, message.id)} label="Elimina messaggio" />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
