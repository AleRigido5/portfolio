import { Suspense } from "react";

import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/prisma";

// Tutto ciò che legge cookie o database sta dentro <Suspense>:
// con Cache Components è obbligatorio per i contenuti dinamici.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const newMessages = await prisma.contactMessage.count({ where: { status: "NEW" } });

  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <AdminSidebar email={user.email} newMessages={newMessages} />
      <main id="main" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]" aria-busy="true">
      <div className="h-14 border-b border-border bg-surface lg:h-dvh lg:border-r lg:border-b-0" />
      <div className="space-y-4 px-4 py-10 sm:px-6 lg:px-10">
        <div className="h-7 w-48 animate-pulse rounded-md bg-foreground/5" />
        <div className="h-40 animate-pulse rounded-2xl bg-foreground/5" />
      </div>
      <span className="sr-only">Caricamento…</span>
    </div>
  );
}
