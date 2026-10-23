import Link from "next/link";
import type { Metadata } from "next";

import { EmptyState, PageHeader } from "@/components/admin/page-header";
import { MessageStatusBadge, STATUS_LABELS } from "@/components/admin/message-status";
import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Messaggi" };

const FILTERS = [
  { value: "", label: "Tutti" },
  { value: "NEW", label: "Nuovi" },
  { value: "READ", label: "Letti" },
  { value: "REPLIED", label: "Risposti" },
  { value: "ARCHIVED", label: "Archiviati" },
  { value: "SPAM", label: "Spam" },
] as const;

type Status = keyof typeof STATUS_LABELS;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ stato?: string }>;
}) {
  await requireAdmin();
  const { stato } = await searchParams;
  const status = stato && stato in STATUS_LABELS ? (stato as Status) : null;

  const messages = await prisma.contactMessage.findMany({
    // "Tutti" nasconde lo spam: si vede solo nel suo filtro
    where: status ? { status } : { status: { not: "SPAM" } },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, name: true, email: true, subject: true, message: true, status: true, createdAt: true },
  });

  return (
    <>
      <PageHeader title="Messaggi" description="Richieste arrivate dal form di contatto." />

      <nav aria-label="Filtra per stato" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = (status ?? "") === filter.value;
          return (
            <Link
              key={filter.value}
              href={filter.value ? `${ADMIN_PATH}/messaggi?stato=${filter.value}` : `${ADMIN_PATH}/messaggi`}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      {messages.length === 0 ? (
        <EmptyState>Nessun messaggio in questa vista.</EmptyState>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {messages.map((msg) => (
            <li key={msg.id}>
              <Link
                href={`${ADMIN_PATH}/messaggi/${msg.id}`}
                className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-background sm:flex-row sm:items-start sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm">
                    <span className={msg.status === "NEW" ? "font-semibold" : "font-medium"}>{msg.name}</span>
                    <span className="text-xs text-muted">{msg.email}</span>
                  </p>
                  {msg.subject && <p className="mt-1 text-sm font-medium">{msg.subject}</p>}
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted">{msg.message}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                  <MessageStatusBadge status={msg.status} />
                  <time className="text-xs text-muted" dateTime={msg.createdAt.toISOString()}>
                    {formatDateTime(msg.createdAt)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
