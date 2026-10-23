// =============================================================
//  Crea (o aggiorna la password di) l'utente admin.
//  Uso:  npm run admin:create
//  La password viene chiesta nel terminale, non viene mostrata
//  mentre la scrivi e non resta nella cronologia dei comandi.
// =============================================================

import "dotenv/config";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/admin/password";

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL!) });

// Legge una riga dal terminale (o dall'input reindirizzato, es. in script automatici)
const rl = createInterface({ input: stdin, output: stdout, terminal: false });
const lines = rl[Symbol.asyncIterator]();

async function ask(question: string) {
  stdout.write(question);
  const { value } = await lines.next();
  return (value as string | undefined) ?? "";
}

// Password: nel terminale i caratteri digitati non vengono mostrati
async function askHidden(question: string): Promise<string> {
  if (!stdin.isTTY) return ask(question);

  stdout.write(question);
  rl.pause();
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  return new Promise((resolve) => {
    let value = "";
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n") {
          stdin.setRawMode(false);
          stdin.off("data", onData);
          stdout.write("\n");
          resolve(value);
          return;
        }
        if (char === "\u0003") process.exit(130); // Ctrl+C
        value = char === "\u007f" || char === "\b" ? value.slice(0, -1) : value + char;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const email = (await ask("Email admin: ")).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email non valida");

  const password = await askHidden("Password (min 12 caratteri): ");
  if (password.length < 12) throw new Error("La password deve avere almeno 12 caratteri");

  const confirm = await askHidden("Ripeti la password: ");
  if (password !== confirm) throw new Error("Le password non coincidono");

  const passwordHash = await hashPassword(password);
  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  // Cambiando password si chiudono tutte le sessioni aperte
  await prisma.adminSession.deleteMany({ where: { userId: user.id } });

  console.log(`✅ Utente admin pronto: ${email}`);
}

main()
  .catch((error) => {
    console.error(`❌ ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    stdin.pause();
    await prisma.$disconnect();
  });
