// app/api/waiters/[id]/route.ts
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper: Ensure the logged-in business owns this waiter
async function verifyOwnership(businessOwnerId: string, waiterId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: businessOwnerId },
  });

  if (!business) return null;

  const waiter = await prisma.user.findFirst({
    where: {
      id: waiterId,
      employerId: business.id, // Must be employed by this business
      role: "WAITER",
    },
  });

  return waiter;
}

// 1. PATCH: Update Waiter Details
export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const waiterId = params.id;

    const existingWaiter = await verifyOwnership(session.user.id, waiterId);
    if (!existingWaiter) {
      return NextResponse.json(
        { error: "Waiter not found or unauthorized" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, email, password } = body;

    const updateData: any = {
      username: name,
      email: email,
    };

    // Only hash and update password if provided
    if (password && password.length >= 6) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedWaiter = await prisma.user.update({
      where: { id: waiterId },
      data: updateData,
    });

    // Return safe data (no password hash)
    return NextResponse.json({
      id: updatedWaiter.id,
      username: updatedWaiter.username,
      email: updatedWaiter.email,
    });
  } catch (error: any) {
    console.error("Error updating waiter:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already taken" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 2. DELETE: Remove Waiter
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const waiterId = params.id;

    const existingWaiter = await verifyOwnership(session.user.id, waiterId);
    if (!existingWaiter) {
      return NextResponse.json({ error: "Waiter not found" }, { status: 404 });
    }

    // Attempt delete
    // Note: If the waiter has 'Purchases' linked to them, this will fail
    // unless you delete purchases first or have cascade delete.
    // For financial safety, we usually don't delete history, but here we try the delete.
    await prisma.user.delete({
      where: { id: waiterId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting waiter:", error);
    return NextResponse.json(
      { error: "Cannot delete waiter. They may have sales history." },
      { status: 400 }
    );
  }
}
