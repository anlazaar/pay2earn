import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password, role, businessName } = await req.json();

    // 1. Basic Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Check if user exists (email must be unique across system)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Transaction: Create User + (Business OR Client Profile)
    await prisma.$transaction(async (tx) => {
      // A. Create the base User record
      const user = await tx.user.create({
        data: {
          username: name,
          email,
          passwordHash,
          role: role === "BUSINESS" ? "BUSINESS" : "CLIENT",
        },
      });

      // B. Handle Role Specific Logic
      if (role === "BUSINESS") {
        if (!businessName) throw new Error("Business name is required");

        await tx.business.create({
          data: {
            name: businessName,
            ownerId: user.id,
            tier: "BASIC",
            subscriptionStatus: "active",
          },
        });
      } else if (role === "CLIENT") {
        await tx.client.create({
          data: {
            name: name,
            email: email,
            userId: user.id,
          },
        });
      }
    });

    return NextResponse.json({ message: "Account created successfully" });
  } catch (error: any) {
    console.error("Registration Error:", error);
    // Return specific error message if available
    const msg =
      error.message === "Business name is required"
        ? "Business name is required"
        : "Internal Server Error";

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
