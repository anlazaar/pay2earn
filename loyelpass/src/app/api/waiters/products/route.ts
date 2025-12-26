import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await auth();

  // 1. Auth Check
  if (!session || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Get User details to find the Employer
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "WAITER" || !user.employerId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // 3. Fetch Products for that Employer
  const products = await prisma.product.findMany({
    where: { businessId: user.employerId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(products);
}
