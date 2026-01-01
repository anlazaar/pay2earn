"use client";

import { Product } from "@prisma/client";
import {
  Package,
  Coins,
  Trash2,
  Tag,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProduct } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
        toast.error(t("toasts.error_title"));
      } else {
        toast.success(t("toasts.success_title"), {
          description: t("toasts.deleted_desc"),
        });
        router.refresh();
      }
    } catch {
      toast.error(t("toasts.error_title"));
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  if (initialProducts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Package className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          {t("empty.title")}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mt-2 px-4 leading-relaxed">
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
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 backdrop-blur-sm"
          >
            {/* Top Section */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                {/* Icon Box */}
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-primary border border-zinc-200 dark:border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <Package className="h-6 w-6 opacity-80" />
                </div>

                {/* Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => setProductToDelete(product.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("actions.delete", { defaultValue: "Delete" })}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h3 className="font-bold text-lg leading-tight line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-white/10 px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-zinc-500/10">
                    Standard
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Section */}
            <div className="bg-zinc-50/50 dark:bg-white/5 px-6 py-4 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between mt-auto">
              <div className="text-lg font-bold font-mono tracking-tight">
                {format.number(product.price, {
                  style: "currency",
                  currency: "MAD",
                })}
              </div>

              {/* Points Badge */}
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                <Coins className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">
                  {product.points || 0} pts
                </span>
              </div>
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
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete
              <span className="font-bold text-foreground">
                {" "}
                "{
                  initialProducts.find((p) => p.id === productToDelete)?.name
                }"{" "}
              </span>
              from your menu.
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
              {isDeleting ? (
                <span className="animate-pulse">Deleting...</span>
              ) : (
                "Delete Product"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
