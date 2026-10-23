import Link from "next/link";
import type { Metadata } from "next";

import { Badge, EmptyState, PageHeader, PrimaryLink } from "@/components/admin/page-header";
import { ADMIN_PATH } from "@/lib/admin/config";
import { EXPERIENCE_TYPE_OPTIONS } from "@/lib/admin/options";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Esperienze" };

const monthYear = new Intl.DateTimeFormat("it-IT", { month: "short", year: "numeric", timeZone: "UTC" });

export default async function ExperiencesAdminPage() {
  await requireAdmin();

  const experiences = await prisma.experience.findMany({
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
    select: { id: true, type: true, role: true, organization: true, startDate: true, endDate: true },
  });

  return (
    <>
      <PageHeader title="Esperienze" description="Le voci della timeline. Sul sito sono mostrate solo quelle di tipo Lavoro.">
        <PrimaryLink href={`${ADMIN_PATH}/esperienze/nuova`}>Nuova esperienza</PrimaryLink>
      </PageHeader>

      {experiences.length === 0 ? (
        <EmptyState>Nessuna esperienza.</EmptyState>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {experiences.map((exp) => (
            <li key={exp.id}>
              <Link
                href={`${ADMIN_PATH}/esperienze/${exp.id}`}
                className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-background sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{exp.role}</p>
                  <p className="text-sm text-muted">{exp.organization}</p>
                </div>
                <Badge tone={exp.type === "WORK" ? "accent" : "neutral"}>
                  {EXPERIENCE_TYPE_OPTIONS.find((o) => o.value === exp.type)?.label}
                </Badge>
                <span className="text-xs text-muted">
                  {monthYear.format(exp.startDate)} — {exp.endDate ? monthYear.format(exp.endDate) : "in corso"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
