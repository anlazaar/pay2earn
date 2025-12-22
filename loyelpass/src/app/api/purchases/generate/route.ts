import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "WAITER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, products } = await req.json();

    // 1. Get Waiter Details (and their employer)
    const waiter = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { employer: true },
    });

    if (!waiter || !waiter.employerId) {
      return NextResponse.json(
        { error: "Configuration Error: No employer found" },
        { status: 400 }
      );
    }

    // 2. Generate Unique Code
    const uniqueString = crypto.randomBytes(32).toString("hex");

    // 3. Create Purchase Record (Pending state)
    // Expiration: 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Calculate potential points (Simple logic: 1 point per $1 for now, or fetch program rules)
    const pointsAwarded = Math.floor(amount);

    const purchase = await prisma.purchase.create({
      data: {
        businessId: waiter.employerId,
        waiterId: waiter.id,
        totalAmount: amount,
        pointsAwarded: pointsAwarded,
        products: products || [],
        qrCode: uniqueString, // This is the secret token
        expiresAt: expiresAt,
        redeemed: false,
      },
    });

    // Return the Purchase ID and the Secret Code to generate QR
    return NextResponse.json({
      qrData: JSON.stringify({
        pid: purchase.id,
        sec: uniqueString,
        bid: waiter.employerId,
      }),
    });
  } catch (error) {
    console.error("QR Gen Error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR" },
      { status: 500 }
    );
  }
}
