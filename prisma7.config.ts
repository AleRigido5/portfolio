import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Configurazione della CLI Prisma 7 (migrate, generate, seed, studio)
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});