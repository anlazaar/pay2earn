import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductList } from "./product-list";
import { AddProductButton } from "./add-product-button";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// --- DATA FETCHING ---
async function getProducts(userId: string) {
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
        },
      },
    },
  });

  if (!business || !business.products) return [];

  return business.products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
  }));
}

export default async function ProductsPage() {
  const t = await getTranslations("ProductsPage");
  const session = await auth();

  if (!session?.user) return redirect("/api/auth/signin");

  const products = await getProducts(session.user.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-start">
      {/* 🟢 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto flex items-center gap-3">
          {/* Optional Search Bar Placeholder - Visual Only for now */}
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors rounded-full"
            />
          </div>
          <AddProductButton />
        </div>
      </div>

      {/* 🟢 Main Content */}
      <div className="min-h-[400px]">
        <ProductList initialProducts={products} />
      </div>
    </div>
  );
}
