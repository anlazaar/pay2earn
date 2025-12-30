import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductList } from "./product-list";
import { AddProductButton } from "./add-product-button";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

// --- DATA FETCHING ---
async function getProducts(userId: string) {
  // Fetch only necessary fields to reduce payload size
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    select: {
      id: true,
      products: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          price: true,
          points: true,
          // Add other fields if needed by ProductList
        },
      },
    },
  });

  if (!business || !business.products) return [];

  // Serialization: Convert Prisma Decimal to JavaScript Number
  return business.products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
  }));
}

export default async function ProductsPage() {
  const t = await getTranslations("ProductsPage");
  const session = await auth();

  // 1. Secure the route
  if (!session?.user) return redirect("/api/auth/signin");

  const products = await getProducts(session.user.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 text-start">
      {/* 🟢 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto">
          <AddProductButton />
        </div>
      </div>

      {/* 🟢 Main Content */}
      <div className="min-h-[400px]">
        {/* passed products are now safe plain objects */}
        <ProductList initialProducts={products} />
      </div>
    </div>
  );
}
