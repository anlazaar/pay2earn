import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { programId } = await req.json();

    // Start a transaction to ensure points are deducted ONLY if ticket is created
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get Client ID
      const client = await tx.client.findUnique({
        where: { userId: session.user.id },
      });
      if (!client) throw new Error("Client profile not found");

      // 2. Get Program & Progress
      const progress = await tx.clientProgress.findUnique({
        where: {
          clientId_programId: {
            clientId: client.id,
            programId: programId,
          },
        },
        include: { program: true },
      });

      if (!progress) throw new Error("No progress found for this program");

      // 3. Check Balance
      if (progress.pointsAccumulated < progress.program.pointsThreshold) {
        throw new Error("Insufficient points");
      }

      // 4. Deduct Points
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

      const ticket = await tx.redemptionTicket.create({
        data: {
          ticketId: uniqueString, // The secret string for QR
          clientId: client.id,
          businessId: progress.program.businessId,
          programId: programId,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Valid for 1 hour
        },
      });

      return { ticketId: uniqueString };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Error" },
      { status: 400 }
    );
  }
}
