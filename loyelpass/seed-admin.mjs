// seed-admin.mjs
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";

// Manually loading .env variables for the script
const envPath = join(process.cwd(), ".env");
const envFile = readFileSync(envPath, "utf-8");
const envVars = Object.fromEntries(
  envFile
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("="))
);

// Prisma 7 requires explicit connection info in standalone scripts
const prisma = new PrismaClient({
  datasourceUrl: envVars.DATABASE_URL,
});

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created successfully:", admin.email);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
