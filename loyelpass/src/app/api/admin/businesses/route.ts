import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: List all businesses
export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const businesses = await prisma.business.findMany({
    include: { owner: { select: { email: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(businesses);
}

// PATCH: Update Status (Block/Unblock) or Tier
export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { businessId, status, tier } = await req.json();

    const updated = await prisma.business.update({
      where: { id: businessId },
      data: {
        subscriptionStatus: status, // 'active', 'blocked'
        tier: tier, // 'BASIC', 'PREMIUM'
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
