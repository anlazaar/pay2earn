import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { systemLog } from "@/lib/logger";
import { Session } from "next-auth";

export async function POST(req: Request) {
  let session: Session | null = null;

  try {
    session = await auth();

    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password } = await req.json();

    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const waiter = await prisma.user.create({
      data: {
        username: name,
        email,
        passwordHash: hashedPassword,
        role: "WAITER",
        employerId: business.id,
      },
    });

    // 🟢 LOG SUCCESS
    void systemLog(
      "INFO",
      `Staff Member Added: '${waiter.username}' (${waiter.email}) added to ${business.name}`
    );

    return NextResponse.json({
      id: waiter.id,
      username: waiter.username,
      email: waiter.email,
    });
  } catch (error: any) {
    console.error("Error creating waiter:", error);

    const userEmail = session?.user?.email || "Unknown User";

    if (error.code === "P2002") {
      // 🟡 LOG WARNING (Duplicate attempt)
      void systemLog(
        "WARN",
        `Failed to add staff: Email ${error?.meta?.target} already exists.`
      );
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // 🔴 LOG ERROR
    void systemLog(
      "ERROR",
      `Staff creation error for ${userEmail}: ${error.message}`
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "BUSINESS") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!business) return NextResponse.json([], { status: 404 });

    const waiters = await prisma.user.findMany({
      where: {
        employerId: business.id,
        role: "WAITER",
      },
      select: { id: true, username: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(waiters);
  } catch (error) {
    console.error("Error fetching waiters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
