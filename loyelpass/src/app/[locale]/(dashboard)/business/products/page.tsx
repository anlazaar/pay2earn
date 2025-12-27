import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductList } from "./product-list";
import { AddProductButton } from "./add-product-button";
import { getTranslations } from "next-intl/server";

async function getProducts(userId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    include: { products: { orderBy: { createdAt: "desc" } } },
  });

  if (!business || !business.products) return [];

  // 1. Convert Decimal to Number here
  return business.products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
  }));
}

export default async function ProductsPage() {
  const t = await getTranslations("ProductsPage");
  const session = await auth();
  const products = await getProducts(session?.user?.id as string);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <AddProductButton />
      </div>

      {/* products passed here are now serializable (contain numbers, not Decimals) */}
      <ProductList initialProducts={products} />
    </div>
  );
}
