import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { systemLog } from "@/lib/logger";
import { Session } from "next-auth";

// GET: Fetch all programs for the logged-in business
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get the Business ID associated with this user
    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // 2. Fetch programs
    const programs = await prisma.loyaltyProgram.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error("Fetch Programs Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Create a new Loyalty Program
export async function POST(req: Request) {
  let session: Session | null = null;

  try {
    session = await auth();

    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      rewardType,
      rewardValue,
      pointsThreshold,
      pointsPerCurrency,
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

    // 🟢 LOG SUCCESS
    void systemLog(
      "INFO",
      `Loyalty Program Created: '${newProgram.name}' by ${session.user.email}`
    );

    return NextResponse.json(newProgram);
  } catch (error: any) {
    console.error("Error creating program:", error);

    const userEmail = session?.user?.email || "Unknown User";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 🔴 LOG ERROR
    void systemLog(
      "ERROR",
      `Failed to create program for ${userEmail}: ${errorMessage}`
    );

    return NextResponse.json(
      { error: "Failed to create program" },
      { status: 500 }
    );
  }
}
