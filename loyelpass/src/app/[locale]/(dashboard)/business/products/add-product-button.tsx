"use client";

import { useState } from "react";
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
import { Plus, Loader2 } from "lucide-react";
import { createProduct } from "./actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function AddProductButton() {
  const t = useTranslations("ProductsPage");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await createProduct(formData);

    setIsLoading(false);

    if (result.success) {
      setOpen(false);
      toast.success(t("toasts.success_title"), {
        description: t("toasts.created_desc"),
      });
    } else {
      toast.error(t("toasts.error_title"), {
        description: result.error || "Something went wrong.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> {t("add_button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("form.title")}</DialogTitle>
          <DialogDescription>{t("form.desc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="name">{t("form.label_name")}</Label>
            <Input
              id="name"
              name="name"
              placeholder={t("form.placeholder_name")}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price Input */}
            <div className="grid gap-2">
              <Label htmlFor="price">{t("form.label_price")}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>

            {/* Points Input */}
            <div className="grid gap-2">
              <Label htmlFor="points">{t("form.label_points")}</Label>
              <Input
                id="points"
                name="points"
                type="number"
                min="0"
                placeholder="10"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t("form.loading") : t("form.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
