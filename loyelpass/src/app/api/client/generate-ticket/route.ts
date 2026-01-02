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

    if (!session || !session.user || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { programId } = await req.json();

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get Client ID
      const client = await tx.client.findUnique({
        where: { userId: session!.user!.id },
      });
      if (!client) throw new Error("Client profile not found");

      // Get Program & Progress
      const progress = await tx.clientProgress.findUnique({
        where: {
          clientId_programId: {
            clientId: client.id,
            programId: programId,
          },
        },
        include: {
          program: {
            include: { business: { select: { name: true } } },
          },
        },
      });

      if (!progress) throw new Error("No progress found for this program");

      // Check Balance
      if (progress.pointsAccumulated < progress.program.pointsThreshold) {
        throw new Error("Insufficient points");
      }

      // Deduct Points
      await tx.clientProgress.update({
        where: { id: progress.id },
        data: {
          pointsAccumulated: {
            decrement: progress.program.pointsThreshold,
          },
        },
      });

      // 5. Create Ticket
      const uniqueString = crypto.randomBytes(32).toString("hex");

      await tx.redemptionTicket.create({
        data: {
          ticketId: uniqueString,
          clientId: client.id,
          businessId: progress.program.businessId,
          programId: programId,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      return {
        ticketId: uniqueString,
        clientName: client.name,
        reward: progress.program.rewardValue,
        businessName: progress.program.business.name,
      };
    });

    // 🟢 LOG SUCCESS
    void systemLog(
      "SUCCESS",
      `Reward Claimed: ${result.clientName} redeemed '${result.reward}' at ${result.businessName}`
    );

    return NextResponse.json({ ticketId: result.ticketId });
  } catch (error: any) {
    console.error("Redemption Error:", error);

    const userEmail = session?.user?.email || "Unknown User";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 🔴 LOG ERROR
    void systemLog(
      "WARN",
      `Redemption failed for ${userEmail}: ${errorMessage}`
    );

    return NextResponse.json(
      { error: errorMessage || "Error processing redemption" },
      { status: 400 }
    );
  }
}
