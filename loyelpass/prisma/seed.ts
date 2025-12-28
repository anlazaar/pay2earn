// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const password = await bcrypt.hash("password123", 10);

  // 1. Create a Business Owner
  const businessOwner = await prisma.user.upsert({
    where: { email: "owner@loyelpass.com" },
    update: {},
    create: {
      email: "owner@loyelpass.com",
      username: "OwnerUser",
      passwordHash: password,
      role: "BUSINESS",
      businessOwned: {
        create: {
          name: "Coffee House Demo",
          tier: "STANDARD",
          subscriptionStatus: "active",
        },
      },
    },
  });
  console.log("✅ Created Business Owner:", businessOwner.email);

  // 2. Create a Waiter
  const business = await prisma.business.findUnique({
    where: { ownerId: businessOwner.id },
  });

  if (business) {
    const waiter = await prisma.user.upsert({
      where: { email: "waiter@loyelpass.com" },
      update: {},
      create: {
        email: "waiter@loyelpass.com",
        username: "JohnWaiter",
        passwordHash: password,
        role: "WAITER",
        employerId: business.id,
      },
    });
    console.log("✅ Created Waiter:", waiter.email);
  }

  // 3. Create a Client
  const client = await prisma.user.upsert({
    where: { email: "client@loyelpass.com" },
    update: {},
    create: {
      email: "client@loyelpass.com",
      username: "AliceClient",
      passwordHash: password,
      role: "CLIENT",
      clientProfile: {
        create: {
          name: "Alice Client",
          email: "client@loyelpass.com",
        },
      },
    },
  });
  console.log("✅ Created Client:", client.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
