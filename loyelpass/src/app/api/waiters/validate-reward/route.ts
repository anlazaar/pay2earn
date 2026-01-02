import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { systemLog } from "@/lib/logger";
import { Session } from "next-auth";

export async function POST(req: Request) {
  let session: Session | null = null;

  try {
    session = await auth();

    if (
      !session ||
      !session.user ||
      (session.user.role !== "WAITER" && session.user.role !== "BUSINESS")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { qrData } = await req.json();

    const scannerUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { businessOwned: true },
    });

    if (!scannerUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let scannerBusinessId = "";
    let scannerBusinessName = "Unknown Business";

    if (session.user.role === "WAITER") {
      scannerBusinessId = scannerUser.employerId || "";
    } else if (session.user.role === "BUSINESS") {
      scannerBusinessId = scannerUser.businessOwned?.id || "";
      scannerBusinessName = scannerUser.businessOwned?.name || "";
    }

    if (!scannerBusinessId) {
      return NextResponse.json(
        { error: "Scanner not linked to any business" },
        { status: 400 }
      );
    }

    const ticket = await prisma.redemptionTicket.findUnique({
      where: { ticketId: qrData },
      include: {
        program: true,
        client: true,
        business: { select: { name: true } },
      },
    });

    if (!ticket) {
      void systemLog(
        "WARN",
        `Invalid ticket scan attempt by ${session.user.email}`
      );
      return NextResponse.json({ error: "Invalid Ticket" }, { status: 404 });
    }

    if (ticket.businessId !== scannerBusinessId) {
      // 🚨 LOG SECURITY ALERT
      void systemLog(
        "WARN",
        `Security Alert: Cross-Business Scan. ${session.user.email} tried to scan a ticket belonging to ${ticket.business.name}`
      );

      return NextResponse.json(
        { error: "WRONG BUSINESS: This ticket is for a different store!" },
        { status: 403 }
      );
    }

    if (ticket.used) {
      return NextResponse.json(
        { error: "Ticket already used!" },
        { status: 400 }
      );
    }

    if (new Date() > ticket.expiresAt) {
      return NextResponse.json({ error: "Ticket expired" }, { status: 400 });
    }

    await prisma.redemptionTicket.update({
      where: { id: ticket.id },
      data: { used: true },
    });

    // 🟢 LOG SUCCESS
    void systemLog(
      "SUCCESS",
      `Ticket Redeemed: ${ticket.client.name} claimed '${ticket.program.rewardValue}' at ${ticket.business.name}`
    );

    return NextResponse.json({
      success: true,
      rewardName: ticket.program.rewardValue,
      clientName: ticket.client.name,
    });
  } catch (error: any) {
    console.error("Ticket Redeem Error:", error);

    const userEmail = session?.user?.email || "Unknown User";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 🔴 LOG ERROR
    void systemLog(
      "ERROR",
      `Ticket redemption error for ${userEmail}: ${errorMessage}`
    );

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
