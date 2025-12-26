import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { ProductList } from "./product-list"; // Client component
import { AddProductButton } from "./add-product-button"; // Client component
import { Package, Tag, Coins } from "lucide-react";

const prisma = new PrismaClient();

async function getProducts(userId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    include: { products: { orderBy: { createdAt: "desc" } } },
  });
  return business?.products || [];
}

export default async function ProductsPage() {
  const session = await auth();
  const products = await getProducts(session?.user?.id as string);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Menu & Products
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage items eligible for loyalty points.
          </p>
        </div>
        {/* We pass the businessID implicitly via server action later, or fetch it in the client component via session */}
        <AddProductButton />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/50"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                  <span className="text-xs font-mono font-medium">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>

              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                <span>Standard Item</span>
              </div>
            </div>

            <div className="bg-secondary/30 px-6 py-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-500">
                <Coins className="h-4 w-4" />
                <span className="text-sm font-bold">
                  {product.points || 0} pts
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Reward Value
              </span>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-secondary/10">
            <Package className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No products yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
              Add your best sellers here to automatically calculate points when
              waiters checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
