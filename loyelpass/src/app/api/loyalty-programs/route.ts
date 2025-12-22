import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Fetch all programs for the logged-in business
export async function GET(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Get the Business ID associated with this user
  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // 2. Fetch programs
  const programs = await prisma.loyaltyProgram.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(programs);
}

// POST: Create a new Loyalty Program
export async function POST(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      rewardType,
      rewardValue,
      pointsThreshold,
      pointsPerCurrency, // Get this from body
    } = body;

    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const newProgram = await prisma.loyaltyProgram.create({
      data: {
        name,
        rewardType,
        rewardValue,
        pointsThreshold: parseInt(pointsThreshold),
        pointsPerCurrency: parseFloat(pointsPerCurrency || "1.0"),
        calculationMethod: "by_amount",
        businessId: business.id,
      },
    });

    return NextResponse.json(newProgram);
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { error: "Failed to create program" },
      { status: 500 }
    );
  }
}
