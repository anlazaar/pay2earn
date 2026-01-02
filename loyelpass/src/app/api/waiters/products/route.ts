import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { systemLog } from "@/lib/logger";
import { Session } from "next-auth"; 

export async function GET(req: Request) {
  let session: Session | null = null;

  try {
    session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, employerId: true, email: true }, 
    });

    if (!user || user.role !== "WAITER" || !user.employerId) {
      // 🟡 LOG WARNING (Security Audit)
      void systemLog(
        "WARN",
        `Access Denied: User ${session.user.email} attempted to access POS products without valid Waiter credentials.`
      );

      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      where: { businessId: user.employerId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Fetch POS Products Error:", error);

    const userEmail = session?.user?.email || "Unknown User";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 🔴 LOG ERROR
    void systemLog(
      "ERROR",
      `Failed to fetch POS products for ${userEmail}: ${errorMessage}`
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
