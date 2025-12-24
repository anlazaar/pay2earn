import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (
      !session ||
      (session.user.role !== "WAITER" && session.user.role !== "BUSINESS")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { qrData } = await req.json();

    // 1. Get the Scanner's details (Waiter or Owner)
    const scannerUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { businessOwned: true }, // In case it's the owner scanning
    });

    if (!scannerUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Determine the Scanner's Business ID
    let scannerBusinessId = "";
    if (session.user.role === "WAITER") {
      scannerBusinessId = scannerUser.employerId || "";
    } else if (session.user.role === "BUSINESS") {
      scannerBusinessId = scannerUser.businessOwned?.id || "";
    }

    if (!scannerBusinessId) {
      return NextResponse.json(
        { error: "Scanner not linked to any business" },
        { status: 400 }
      );
    }

    // 2. Find the ticket
    const ticket = await prisma.redemptionTicket.findUnique({
      where: { ticketId: qrData },
      include: { program: true, client: true },
    });

    if (!ticket)
      return NextResponse.json({ error: "Invalid Ticket" }, { status: 404 });

    // 🔴 3. SECURITY CHECK: Match Business IDs
    if (ticket.businessId !== scannerBusinessId) {
      return NextResponse.json(
        {
          error: "WRONG BUSINESS: This ticket is for a different store!",
        },
        { status: 403 }
      );
    }

    // 4. Check Used/Expired
    if (ticket.used)
      return NextResponse.json(
        { error: "Ticket already used!" },
        { status: 400 }
      );
    if (new Date() > ticket.expiresAt)
      return NextResponse.json({ error: "Ticket expired" }, { status: 400 });

    // 5. Burn it
    await prisma.redemptionTicket.update({
      where: { id: ticket.id },
      data: { used: true },
    });

    return NextResponse.json({
      success: true,
      rewardName: ticket.program.rewardValue,
      clientName: ticket.client.name,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
