import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalBusinesses, totalClients, totalTransactions] = await Promise.all([
    prisma.business.count(),
    prisma.client.count(),
    prisma.purchase.count(),
  ]);

  return NextResponse.json({
    businesses: totalBusinesses,
    clients: totalClients,
    transactions: totalTransactions,
  });
}
