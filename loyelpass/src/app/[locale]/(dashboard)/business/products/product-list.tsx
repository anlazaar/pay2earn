"use client";

import { Product } from "@prisma/client";
import { Package, Coins, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

// 1. Define a "Safe" type that replaces Decimal with number
type SerializedProduct = Omit<Product, "price"> & {
  price: number;
};

interface ProductListProps {
  initialProducts: SerializedProduct[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  const t = useTranslations("ProductsPage");
  const format = useFormatter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t("toasts.confirm_delete"))) return;

    setDeletingId(id);
    const res = await deleteProduct(id);
    setDeletingId(null);

    if (res.error) {
      toast.error(t("toasts.error_title"), {
        description: "Could not delete product.",
      });
    } else {
      toast.success(t("toasts.success_title"), {
        description: t("toasts.deleted_desc"),
      });
    }
  };

  if (initialProducts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-secondary/10">
        <Package className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t("empty.title")}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
          {t("empty.desc")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {initialProducts.map((product) => (
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
                  {/* Currency Formatter (MAD) */}
                  {format.number(product.price, {
                    style: "currency",
                    currency: "MAD",
                  })}
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>

            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Tag className="h-3.5 w-3.5" />
              <span>{t("standard_item")}</span>
            </div>
          </div>

          <div className="bg-secondary/30 px-6 py-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-500">
              <Coins className="h-4 w-4" />
              <span className="text-sm font-bold">
                {product.points || 0} pts
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider hidden sm:inline-block">
                {t("reward_value")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                disabled={deletingId === product.id}
                onClick={() => handleDelete(product.id)}
              >
                {deletingId === product.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
