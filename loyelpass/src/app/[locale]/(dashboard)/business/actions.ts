"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBirthdayReward(points: number) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await prisma.business.update({
      where: { ownerId: session.user.id },
      data: { birthdayRewardPoints: points },
    });
    revalidatePath("/business");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
}
