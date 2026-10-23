import Link from "next/link";
import type { Metadata } from "next";

import { Badge, EmptyState, PageHeader } from "@/components/admin/page-header";
import { ADMIN_PATH } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  await requireAdmin();

  const [newMessages, totalMessages, published, drafts, technologies, experiences, latest] =
    await Promise.all([
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count({ where: { status: { not: "SPAM" } } }),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { published: false } }),
      prisma.technology.count(),
      prisma.experience.count(),
      prisma.contactMessage.findMany({
        where: { status: { not: "SPAM" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, subject: true, message: true, status: true, createdAt: true },
      }),
    ]);

  const stats = [
    { label: "Messaggi nuovi", value: newMessages, detail: `${totalMessages} in totale`, href: `${ADMIN_PATH}/messaggi?stato=NEW` },
    { label: "Progetti pubblicati", value: published, detail: `${drafts} in bozza`, href: `${ADMIN_PATH}/progetti` },
    { label: "Competenze", value: technologies, detail: "tecnologie", href: `${ADMIN_PATH}/competenze` },
    { label: "Esperienze", value: experiences, detail: "nella timeline", href: `${ADMIN_PATH}/esperienze` },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Panoramica dei contenuti del sito." />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link
              href={stat.href}
              className="block rounded-2xl border border-border bg-surface p-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-accent/40"
            >
              <p className="text-xs font-medium tracking-wider text-muted uppercase">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs text-muted">{stat.detail}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-10" aria-labelledby="latest-title">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="latest-title" className="text-lg font-semibold tracking-tight">Ultimi messaggi</h2>
          <Link href={`${ADMIN_PATH}/messaggi`} className="text-sm font-medium text-accent hover:underline">
            Vedi tutti
          </Link>
        </div>

        {latest.length === 0 ? (
          <EmptyState>Nessun messaggio ricevuto.</EmptyState>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {latest.map((msg) => (
              <li key={msg.id}>
                <Link
                  href={`${ADMIN_PATH}/messaggi/${msg.id}`}
                  className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-background"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm">
                      <span className={msg.status === "NEW" ? "font-semibold" : "font-medium"}>{msg.name}</span>
                      {msg.status === "NEW" && <Badge tone="accent">Nuovo</Badge>}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-muted">{msg.subject ?? msg.message}</p>
                  </div>
                  <time className="shrink-0 text-xs text-muted" dateTime={msg.createdAt.toISOString()}>
                    {formatDateTime(msg.createdAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
