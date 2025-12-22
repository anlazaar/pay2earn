import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await auth();

  // 1. Auth Check
  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, password } = await req.json();

    // 2. Get Business ID
    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // 3. Create Waiter User
    const hashedPassword = await bcrypt.hash(password, 10);

    const waiter = await prisma.user.create({
      data: {
        username: name,
        email,
        passwordHash: hashedPassword,
        role: "WAITER",
        employerId: business.id, // Link to business
      },
    });

    return NextResponse.json({
      id: waiter.id,
      username: waiter.username,
      email: waiter.email,
    });
  } catch (error: any) {
    console.error("Error creating waiter:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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
  });

  return NextResponse.json(waiters);
}
