import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password, role, businessName, birthday } =
      await req.json();


    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
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
        // Parse birthday if it exists
        let birthdayDate: Date | undefined;
        if (birthday) {
          birthdayDate = new Date(birthday);
          // Simple check to ensure date is valid
          if (isNaN(birthdayDate.getTime())) {
            birthdayDate = undefined;
          }
        }

        await tx.client.create({
          data: {
            name: name,
            email: email,
            userId: user.id,
            birthday: birthdayDate,
          },
        });
      }
    });

    return NextResponse.json({ message: "Account created successfully" });
  } catch (error: any) {
    console.error("Registration Error:", error);
    const msg =
      error.message === "Business name is required"
        ? "Business name is required"
        : "Internal Server Error";

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
