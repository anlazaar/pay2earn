import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { systemLog } from "@/lib/logger";
import { Session } from "next-auth";

export async function POST(req: Request) {
  let session: Session | null = null;

  try {
    session = await auth();

    if (!session || session.user.role !== "WAITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, products } = await req.json();

    // Get Waiter Details
    const waiter = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            pointsMultiplier: true,
          },
        },
      },
    });

    if (!waiter || !waiter.employerId || !waiter.employer) {
      return NextResponse.json(
        { error: "Configuration Error: No employer found" },
        { status: 400 }
      );
    }

    // Generate Unique Code
    const uniqueString = crypto.randomBytes(32).toString("hex");

    // Create Purchase Record
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const multiplier = waiter.employer.pointsMultiplier || 1.0;
    const pointsAwarded = Math.floor(amount * multiplier);

    const purchase = await prisma.purchase.create({
      data: {
        businessId: waiter.employerId,
        waiterId: waiter.id,
        totalAmount: amount,
        pointsAwarded: pointsAwarded,
        products: products || [],
        qrCode: uniqueString,
        expiresAt: expiresAt,
        redeemed: false,
      },
    });

    // 🟢 LOG SUCCESS
    void systemLog(
      "INFO",
      `QR Generated: ${amount} currency -> ${pointsAwarded} pts by ${waiter.username} at ${waiter.employer.name}`
    );

    return NextResponse.json({
      qrData: JSON.stringify({
        pid: purchase.id,
        sec: uniqueString,
        bid: waiter.employerId,
      }),
    });
  } catch (error: any) {
    console.error("QR Gen Error:", error);

    const userEmail = session?.user?.email || "Unknown User";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 🔴 LOG ERROR
    void systemLog("ERROR", `QR Gen failed for ${userEmail}: ${errorMessage}`);

    return NextResponse.json(
      { error: "Failed to generate QR" },
      { status: 500 }
    );
  }
}
