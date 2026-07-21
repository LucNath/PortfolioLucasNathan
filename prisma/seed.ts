import { PrismaClient } from "@prisma/client";
import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";


loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  const email = requiredEnv("ADMIN_EMAIL");
  const password = requiredEnv("ADMIN_PASSWORD");
  const name = requiredEnv("ADMIN_NAME");
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.adminUser.deleteMany({
      where: {
        email: {
          not: email,
        },
      },
    }),
    prisma.adminUser.upsert({
      where: { email },
      create: {
        email,
        passwordHash,
        name,
      },
      update: {
        passwordHash,
        name,
      },
    }),
  ]);

  console.log(`Admin user seeded: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
