// app/api/loyalty-programs/[id]/route.ts
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
  try {
    const session = await auth();
    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ★ FIX: Await the params object before accessing id
    const params = await props.params;
    const programId = params.id;

    const body = await req.json();

    // Verify ownership
    const existingProgram = await verifyOwnership(session.user.id, programId);
    if (!existingProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Build update object safely
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

    return NextResponse.json(updatedProgram);
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 2. DELETE: Remove a Program
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ★ FIX: Await the params object before accessing id
    const params = await props.params;
    const programId = params.id;

    // Verify ownership
    const existingProgram = await verifyOwnership(session.user.id, programId);
    if (!existingProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Execute Transaction
    // We must use 'programId' variable which is now guaranteed to be a string
    await prisma.$transaction([
      // 1. Delete Redemptions (field: programId)
      prisma.redemptionTicket.deleteMany({
        where: { programId: programId },
      }),
      // 2. Delete Client Progress (field: programId)
      prisma.clientProgress.deleteMany({
        where: { programId: programId },
      }),
      // 3. Delete Program (field: id)
      prisma.loyaltyProgram.delete({
        where: { id: programId },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { error: "Failed to delete program." },
      { status: 500 }
    );
  }
}
