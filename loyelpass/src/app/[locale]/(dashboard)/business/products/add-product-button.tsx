"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Package, Coins, Tag } from "lucide-react";
import { createProduct } from "./actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function AddProductButton() {
  const t = useTranslations("ProductsPage");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await createProduct(formData);

      if (result.success) {
        setOpen(false);
        toast.success(t("toasts.success_title"), {
          description: t("toasts.created_desc"),
        });
        // Refresh the Server Component to show the new product
        router.refresh();
      } else {
        toast.error(t("toasts.error_title"), {
          description: result.error || "Something went wrong.",
        });
      }
    } catch (error) {
      toast.error(t("toasts.error_title"), { description: "Network error" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm hover:shadow-md transition-all">
          <Plus className="h-4 w-4" />
          <span>{t("add_button")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-425px text-start">
        <DialogHeader className="text-start">
          <DialogTitle>{t("form.title")}</DialogTitle>
          <DialogDescription>{t("form.desc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 py-4">
          {/* Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="name">{t("form.label_name")}</Label>
            <div className="relative">
              {/* Icon positioned at start (left in EN, right in AR) */}
              <Package className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder={t("form.placeholder_name")}
                required
                className="ps-9" // Padding start ensures text doesn't overlap icon
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price Input */}
            <div className="grid gap-2">
              <Label htmlFor="price">{t("form.label_price")}</Label>
              <div className="relative">
                <span className="absolute start-3 top-2.5 text-xs font-bold text-muted-foreground">
                  MAD
                </span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                  className="ps-11" // Extra padding for "MAD" text
                />
              </div>
            </div>

            {/* Points Input */}
            <div className="grid gap-2">
              <Label htmlFor="points">{t("form.label_points")}</Label>
              <div className="relative">
                <Coins className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="points"
                  name="points"
                  type="number"
                  min="0"
                  placeholder="10"
                  className="ps-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading && (
                <Loader2 className="me-2 h-4 w-4 animate-spin rtl:ml-2" />
              )}
              {isLoading ? t("form.loading") : t("form.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
