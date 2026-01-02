import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { systemLog } from "@/lib/logger";
import { Session } from "next-auth";

export async function POST(req: Request) {
  let session: Session | null = null;

  try {
    session = await auth();

    if (!session || !session.user || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { qrData } = await req.json();

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (e) {
      return NextResponse.json({ error: "Invalid QR format" }, { status: 400 });
    }

    const { pid, sec, bid } = parsedData;

    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findUnique({
        where: { id: pid },
        include: { business: { select: { name: true } } },
      });

      // Validation Checks
      if (!purchase) throw new Error("Purchase not found");
      if (purchase.businessId !== bid)
        throw new Error("QR Code does not belong to this business"); // 🟢 Security Check
      if (purchase.qrCode !== sec) throw new Error("Invalid QR Security Token");
      if (purchase.redeemed) throw new Error("QR Code already used");
      if (new Date() > purchase.expiresAt) throw new Error("QR Code expired");

      // Get Client Profile
      const client = await tx.client.findUnique({
        where: { userId: session!.user!.id },
      });
      if (!client) throw new Error("Client profile not found");

      // Find Active Loyalty Program for this Business
      // We attach points to the first active program found. -> next would be the ability the have global points following the business and use them anyware || select which program to take points on
      const program = await tx.loyaltyProgram.findFirst({
        where: { businessId: bid, active: true },
      });

      if (!program)
        throw new Error("No active loyalty program found for this business");

      // Update or Create Client Progress
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

      // Mark Purchase as Redeemed & Link to Client
      await tx.purchase.update({
        where: { id: pid },
        data: {
          redeemed: true,
          clientId: client.id,
        },
      });

      return {
        points: purchase.pointsAwarded,
        businessName: purchase.business.name,
        clientName: client.name,
      };
    });

    // 🟢 LOG SUCCESS
    void systemLog(
      "SUCCESS",
      `Points Added: ${result.clientName} earned ${result.points} pts at ${result.businessName}`
    );

    return NextResponse.json({
      success: true,
      pointsAdded: result.points,
    });
  } catch (error: any) {
    console.error("Scan Error:", error);

    const userEmail = session?.user?.email || "Unknown User";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 🔴 LOG ERROR (Warn level, as user errors are common here)
    void systemLog(
      "WARN",
      `Scan failed for user ${userEmail}: ${errorMessage}`
    );

    return NextResponse.json(
      { error: errorMessage || "Scan failed" },
      { status: 400 }
    );
  }
}
