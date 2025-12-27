"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema for validation
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  points: z.coerce
    .number()
    .int()
    .min(0, "Points cannot be negative")
    .optional(),
});

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // 1. Validate Form Data
  const rawData = {
    name: formData.get("name"),
    price: formData.get("price"),
    points: formData.get("points") || 0,
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  // 2. Find the Business ID belonging to this user
  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!business) {
    return { error: "Business not found" };
  }

  // 3. Create the Product
  try {
    await prisma.product.create({
      data: {
        name: validatedFields.data.name,
        price: validatedFields.data.price,
        points: validatedFields.data.points,
        businessId: business.id,
      },
    });

    // 4. Refresh the page data
    revalidatePath("/business/products");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create product" };
  }
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  // Verify ownership before deleting
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { business: true },
  });

  if (!product || product.business.ownerId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/business/products");
  return { success: true };
}
