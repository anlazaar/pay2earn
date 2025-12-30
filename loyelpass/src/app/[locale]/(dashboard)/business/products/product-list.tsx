"use client";

import { Product } from "@prisma/client";
import { Package, Coins, Trash2, Tag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

// 🔴 FIX: Use Pick<> instead of Omit<>
// This ensures we only require the fields we actually fetched from the DB
type SerializedProduct = Pick<Product, "id" | "name" | "points"> & {
  price: number;
};

interface ProductListProps {
  initialProducts: SerializedProduct[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  const t = useTranslations("ProductsPage");
  const format = useFormatter();
  const router = useRouter();

  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const res = await deleteProduct(productToDelete);

      if (res.error) {
        toast.error(t("toasts.error_title"), {
          description: "Could not delete product.",
        });
      } else {
        toast.success(t("toasts.success_title"), {
          description: t("toasts.deleted_desc"),
        });
        router.refresh();
      }
    } catch (err) {
      toast.error(t("toasts.error_title"));
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  if (initialProducts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-secondary/5 animate-in fade-in zoom-in-95 duration-500">
        <div className="h-16 w-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold">{t("empty.title")}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mt-1 px-4">
          {t("empty.desc")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {initialProducts.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:-translate-y-1"
          >
            {/* Top Section */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 bg-background border border-border px-2.5 py-1 rounded-full shadow-sm">
                  <span className="text-sm font-mono font-semibold text-foreground">
                    {format.number(product.price, {
                      style: "currency",
                      currency: "MAD",
                    })}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  <span>{t("standard_item")}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Section */}
            <div className="bg-secondary/20 px-5 py-3 border-t border-border flex items-center justify-between">
              {/* Points Badge */}
              <div className="flex items-center gap-1.5 text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                <Coins className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">
                  {product.points || 0} pts
                </span>
              </div>

              {/* Delete Action */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                onClick={() => setProductToDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("toasts.confirm_delete")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
