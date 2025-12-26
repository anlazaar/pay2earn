"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Importing from the file we created in Step 1
import { revalidatePath } from "next/cache";

export async function toggleBoost(isActive: boolean) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // 1. Find business owned by this user
  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!business) {
    return { error: "Business not found" };
  }

  // 2. Set multiplier: 2.0 if active, 1.0 if not
  const multiplier = isActive ? 2.0 : 1.0;

  try {
    await prisma.business.update({
      where: { id: business.id },
      data: { pointsMultiplier: multiplier },
    });

    revalidatePath("/business");
    return { success: true, multiplier };
  } catch (error) {
    return { error: "Failed to update boost mode" };
  }
}
