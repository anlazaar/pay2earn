import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await auth();

  // 1. Ensure User is a Client
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { qrData } = await req.json();

    // Parse the QR data (we stored it as JSON string: { pid, sec, bid })
    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (e) {
      return NextResponse.json({ error: "Invalid QR format" }, { status: 400 });
    }

    const { pid, sec, bid } = parsedData;

    // 2. Database Transaction
    // We use a transaction to ensure points aren't added if the purchase update fails
    const result = await prisma.$transaction(async (tx) => {
      // A. Find the purchase
      const purchase = await tx.purchase.findUnique({
        where: { id: pid },
      });

      // B. Validation Checks
      if (!purchase) throw new Error("Purchase not found");
      if (purchase.qrCode !== sec) throw new Error("Invalid QR Security Token");
      if (purchase.redeemed) throw new Error("QR Code already used");
      if (new Date() > purchase.expiresAt) throw new Error("QR Code expired");

      // C. Get Client Profile
      const client = await tx.client.findUnique({
        where: { userId: session.user.id },
      });
      if (!client) throw new Error("Client profile not found");

      // D. Find Active Loyalty Program for this Business
      // (For simplicity, we grab the first active 'by_amount' or 'flat' program of the business)
      // In a complex app, you might select which program the points apply to.
      const program = await tx.loyaltyProgram.findFirst({
        where: { businessId: bid, active: true },
      });

      if (!program)
        throw new Error("No active loyalty program found for this business");

      // E. Update or Create Client Progress
      await tx.clientProgress.upsert({
        where: {
          clientId_programId: {
            clientId: client.id,
            programId: program.id,
          },
        },
        update: {
          pointsAccumulated: { increment: purchase.pointsAwarded },
          lastUpdated: new Date(),
        },
        create: {
          clientId: client.id,
          programId: program.id,
          pointsAccumulated: purchase.pointsAwarded,
        },
      });

      // F. Mark Purchase as Redeemed
      await tx.purchase.update({
        where: { id: pid },
        data: {
          redeemed: true,
          clientId: client.id,
        },
      });

      return { points: purchase.pointsAwarded, businessId: bid };
    });

    return NextResponse.json({
      success: true,
      pointsAdded: result.points,
    });
  } catch (error: any) {
    console.error("Scan Error:", error);
    return NextResponse.json(
      { error: error.message || "Scan failed" },
      { status: 400 }
    );
  }
}
