import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";
import { systemLog } from "@/lib/logger"; 
import { Session } from "next-auth"; 

// Helper: verify ownership
async function verifyOwnership(userId: string, programId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
  });

  if (!business) return null;

  const program = await prisma.loyaltyProgram.findFirst({
    where: {
      id: programId,
      businessId: business.id,
    },
  });

  return program;
}

// 1. PATCH: Update a Program
export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  let session: Session | null = null;

  try {
    session = await auth();
    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const programId = params.id;

    const body = await req.json();

    // Verify ownership
    const existingProgram = await verifyOwnership(session.user.id, programId);
    if (!existingProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const updateData: any = {
      name: body.name,
      rewardValue: body.rewardValue,
      active: body.active,
    };

    if (body.pointsThreshold !== undefined && body.pointsThreshold !== null) {
      const threshold = parseInt(body.pointsThreshold);
      if (!isNaN(threshold)) {
        updateData.pointsThreshold = threshold;
      }
    }

    const updatedProgram = await prisma.loyaltyProgram.update({
      where: { id: programId },
      data: updateData,
    });

    // 🟢 LOG SUCCESS
    void systemLog(
      "INFO",
      `Program updated: '${updatedProgram.name}' by ${session.user.email}`
    );

    return NextResponse.json(updatedProgram);
  } catch (error: any) {
    console.error("Error updating program:", error);

    const userEmail = session?.user?.email || "Unknown User";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 🔴 LOG ERROR
    void systemLog(
      "ERROR",
      `Failed to update program by ${userEmail}: ${errorMessage}`
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  let session: Session | null = null;

  try {
    session = await auth();
    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const programId = params.id;

    // Verify ownership
    const existingProgram = await verifyOwnership(session.user.id, programId);
    if (!existingProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    await prisma.$transaction([
      // Delete Redemptions
      prisma.redemptionTicket.deleteMany({
        where: { programId: programId },
      }),
      // Delete Client Progress
      prisma.clientProgress.deleteMany({
        where: { programId: programId },
      }),
      // Delete Program
      prisma.loyaltyProgram.delete({
        where: { id: programId },
      }),
    ]);

    // 🟢 LOG WARNING (Deletion is significant)
    void systemLog(
      "WARN",
      `Program deleted: '${existingProgram.name}' (ID: ${programId}) by ${session.user.email}`
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting program:", error);

    const userEmail = session?.user?.email || "Unknown User";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 🔴 LOG ERROR
    void systemLog(
      "ERROR",
      `Failed to delete program by ${userEmail}: ${errorMessage}`
    );

    return NextResponse.json(
      { error: "Failed to delete program." },
      { status: 500 }
    );
  }
}
