import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { systemLog } from "@/lib/logger";

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
      // 🟡 LOG WARNING
      await systemLog(
        "WARN",
        `Registration attempt with existing email: ${email}`
      );
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
        let birthdayDate: Date | undefined;
        if (birthday) {
          birthdayDate = new Date(birthday);
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

    // 🟢 LOG SUCCESS
    void systemLog("SUCCESS", `New ${role} registered: ${name} (${email})`);

    return NextResponse.json({ message: "Account created successfully" });
  } catch (error: any) {
    console.error("Registration Error:", error);

    // 🔴 LOG ERROR
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    void systemLog(
      "ERROR",
      `Registration failed for ${email || "unknown"}: ${errorMessage}`
    );

    const msg =
      error.message === "Business name is required"
        ? "Business name is required"
        : "Internal Server Error";

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
