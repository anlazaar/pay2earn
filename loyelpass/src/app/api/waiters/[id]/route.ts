import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { systemLog } from "@/lib/logger"; 
import { Session } from "next-auth"; 

async function verifyOwnership(businessOwnerId: string, waiterId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: businessOwnerId },
  });

  if (!business) return null;

  const waiter = await prisma.user.findFirst({
    where: {
      id: waiterId,
      employerId: business.id,
      role: "WAITER",
    },
  });

  return waiter;
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  let session: Session | null = null;
  let waiterId = ""; 

  try {
    session = await auth();
    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    waiterId = params.id;

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

    if (password && password.length >= 6) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedWaiter = await prisma.user.update({
      where: { id: waiterId },
      data: updateData,
    });

    void systemLog(
      "INFO",
      `Staff details updated: '${updatedWaiter.username}' by ${session.user.email}`
    );

    return NextResponse.json({
      id: updatedWaiter.id,
      username: updatedWaiter.username,
      email: updatedWaiter.email,
    });
  } catch (error: any) {
    console.error("Error updating waiter:", error);
    const userEmail = session?.user?.email || "Unknown User";

    if (error.code === "P2002") {
      void systemLog(
        "WARN",
        `Staff update failed (Duplicate Email) for ${userEmail}`
      );
      return NextResponse.json(
        { error: "Email already taken" },
        { status: 400 }
      );
    }

    void systemLog(
      "ERROR",
      `Staff update failed for ${userEmail}: ${error.message}`
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
  let waiterId = "";

  try {
    session = await auth();
    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    waiterId = params.id;

    const existingWaiter = await verifyOwnership(session.user.id, waiterId);
    if (!existingWaiter) {
      return NextResponse.json({ error: "Waiter not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: waiterId },
    });

    void systemLog(
      "WARN",
      `Staff member removed: '${existingWaiter.username}' (ID: ${waiterId}) by ${session.user.email}`
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting waiter:", error);
    const userEmail = session?.user?.email || "Unknown User";

    if (error.code === "P2003") {
      void systemLog(
        "WARN",
        `Failed to delete staff ${
          waiterId || "unknown"
        }: User has sales history.`
      );
      return NextResponse.json(
        {
          error:
            "Cannot delete waiter because they have sales history. Disable their account instead.",
        },
        { status: 400 }
      );
    }

    void systemLog(
      "ERROR",
      `Staff deletion failed for ${userEmail}: ${error.message}`
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
