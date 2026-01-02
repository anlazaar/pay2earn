"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Tag,
  Target,
  Gift,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface Program {
  id: string;
  name: string;
  rewardValue: string;
  pointsThreshold: number;
  active: boolean;
}

export function ProgramActions({ program }: { program: Program }) {
  const router = useRouter();
  const t = useTranslations("ProgramActions");

  const [openMenu, setOpenMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: program.name,
    rewardValue: program.rewardValue,
    pointsThreshold: program.pointsThreshold,
    active: program.active,
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/loyalty-programs/${program.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success(t("toasts.update_success"));
      setShowEdit(false);
      router.refresh();
    } catch (error) {
      toast.error(t("toasts.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/loyalty-programs/${program.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      toast.success(t("toasts.delete_success"));
      setShowDelete(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("toasts.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. Dropdown Trigger */}
      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setShowEdit(true)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-3.5 w-3.5" /> {t("menu.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDelete(true)}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" /> {t("menu.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 2. Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader className="text-start">
            <DialogTitle className="text-xl font-bold">
              {t("edit.title")}
            </DialogTitle>
            <DialogDescription>{t("edit.desc")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Name Input */}
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                {t("form.label_name")}
              </Label>
              <div className="relative">
                <Tag className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="name"
                  className="ps-10"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Points Input */}
              <div className="grid gap-2">
                <Label
                  htmlFor="threshold"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {t("form.label_points")}
                </Label>
                <div className="relative">
                  <Target className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="threshold"
                    type="number"
                    className="ps-10"
                    value={formData.pointsThreshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pointsThreshold: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              {/* Reward Input */}
              <div className="grid gap-2">
                <Label
                  htmlFor="reward"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {t("form.label_reward")}
                </Label>
                <div className="relative">
                  <Gift className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="reward"
                    className="ps-10"
                    value={formData.rewardValue}
                    onChange={(e) =>
                      setFormData({ ...formData, rewardValue: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status Switch */}
            <div
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-colors",
                formData.active
                  ? "bg-primary/5 border-primary/20"
                  : "bg-secondary/20 border-border/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    formData.active
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Power className="h-4 w-4" />
                </div>
                <div className="space-y-0.5 text-start">
                  <Label
                    htmlFor="active-mode"
                    className="text-sm font-semibold"
                  >
                    {t("form.label_active")}
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    {formData.active
                      ? t("form.status_on")
                      : t("form.status_off")}
                  </p>
                </div>
              </div>
              <Switch
                id="active-mode"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowEdit(false)}
              disabled={loading}
            >
              {t("form.cancel")}
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {t("form.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Delete Alert */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              {t("delete.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>{t("delete.desc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              {t("delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("delete.confirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
