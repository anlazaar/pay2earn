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
        router.refresh();
      } else {
        toast.error(t("toasts.error_title"), {
          description: result.error || "Error",
        });
      }
    } catch {
      toast.error(t("toasts.error_title"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full px-6 h-11 bg-primary text-primary-foreground font-semibold">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>{t("add_button")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md text-start p-6 rounded-2xl">
        <DialogHeader className="text-start space-y-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold">
              {t("form.title")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1">
              {t("form.desc")}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="name"
              className="text-xs font-bold uppercase tracking-wide text-muted-foreground"
            >
              {t("form.label_name")}
            </Label>
            <div className="relative">
              <Package className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
              <Input
                id="name"
                name="name"
                placeholder={t("form.placeholder_name")}
                required
                className="ps-10 h-11 rounded-lg bg-secondary/20 border-border/50 focus:bg-background transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="price"
                className="text-xs font-bold uppercase tracking-wide text-muted-foreground"
              >
                {t("form.label_price")}
              </Label>
              <div className="relative">
                <span className="absolute start-3 top-3 text-xs font-bold text-muted-foreground/70">
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
                  className="ps-12 h-11 rounded-lg bg-secondary/20 border-border/50 focus:bg-background transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="points"
                className="text-xs font-bold uppercase tracking-wide text-muted-foreground"
              >
                {t("form.label_points")}
              </Label>
              <div className="relative">
                <Coins className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="points"
                  name="points"
                  type="number"
                  min="0"
                  placeholder="10"
                  className="ps-10 h-11 rounded-lg bg-secondary/20 border-border/50 focus:bg-background transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto rounded-full h-11 px-8 font-semibold"
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
