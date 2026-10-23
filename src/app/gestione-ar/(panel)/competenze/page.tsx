import Link from "next/link";
import type { Metadata } from "next";

import { Badge, EmptyState, PageHeader, PrimaryLink } from "@/components/admin/page-header";
import { ADMIN_PATH } from "@/lib/admin/config";
import { CATEGORY_OPTIONS } from "@/lib/admin/options";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Competenze" };

export default async function TechnologiesAdminPage() {
  await requireAdmin();

  const technologies = await prisma.technology.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      category: true,
      showInAbout: true,
      sortOrder: true,
      _count: { select: { projects: true, experiences: true } },
    },
  });

  return (
    <>
      <PageHeader title="Competenze" description="Tecnologie mostrate in Chi sono e usate come filtri dei progetti.">
        <PrimaryLink href={`${ADMIN_PATH}/competenze/nuova`}>Nuova tecnologia</PrimaryLink>
      </PageHeader>

      {technologies.length === 0 ? (
        <EmptyState>Nessuna tecnologia.</EmptyState>
      ) : (
        <div className="space-y-8">
          {CATEGORY_OPTIONS.map((category) => {
            const items = technologies.filter((t) => t.category === category.value);
            if (items.length === 0) return null;
            return (
              <section key={category.value} aria-labelledby={`cat-${category.value}`}>
                <h2 id={`cat-${category.value}`} className="mb-3 text-xs font-medium tracking-wider text-muted uppercase">
                  {category.label}
                </h2>
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
                  {items.map((tech) => (
                    <li key={tech.id}>
                      <Link
                        href={`${ADMIN_PATH}/competenze/${tech.id}`}
                        className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-background"
                      >
                        <span className="font-medium">{tech.name}</span>
                        {!tech.showInAbout && <Badge>Nascosta in Chi sono</Badge>}
                        <span className="ml-auto text-xs text-muted">
                          {tech._count.projects} progetti · {tech._count.experiences} esperienze · ordine {tech.sortOrder}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
