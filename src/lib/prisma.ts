import "server-only"; // impedisce di importare il client in un Client Component
import { PrismaClient } from "@/generated/prisma/client";
import { createDbAdapter } from "@/lib/db-adapter";

function createPrismaClient() {
  // Connessione (con SSL se configurato): vedi src/lib/db-adapter.ts
  const adapter = createDbAdapter();

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

// Singleton: in sviluppo l'HMR di Next.js ricarica i moduli e,
// senza cache su globalThis, aprirebbe un nuovo pool a ogni salvataggio
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}