"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings2, ChevronDown, ChevronUp, Plus } from "lucide-react";

export function CreateProgramModal() {
  const t = useTranslations("CreateProgramModal");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [rewardType, setRewardType] = useState("FREE_ITEM");
  const [rewardValue, setRewardValue] = useState("");
  const [pointsThreshold, setPointsThreshold] = useState("100");
  const [pointsPerCurrency, setPointsPerCurrency] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/loyalty-programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          rewardType,
          rewardValue:
            rewardType === "DISCOUNT"
              ? `${rewardValue}${t("discount_suffix")}`
              : rewardValue,
          pointsThreshold: parseInt(pointsThreshold),
          pointsPerCurrency: parseFloat(pointsPerCurrency),
        }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
        setName("");
        setRewardValue("");
        setPointsThreshold("100");
      } else {
        alert(t("error"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 gap-2 bg-primary hover:bg-primary/90 text-sm font-medium shadow-sm">
          <Plus className="h-4 w-4" />
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-border/50 bg-background shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/50 text-start">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 py-4 text-start">
          {/* Name Field */}
          <div className="grid gap-2">
            <Label
              htmlFor="name"
              className="text-xs uppercase font-medium tracking-wider text-muted-foreground"
            >
              {t("label_name")}
            </Label>
            <Input
              id="name"
              placeholder={t("placeholder_name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 bg-secondary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Reward Type Selection */}
            <div className="grid gap-2">
              <Label className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                {t("label_type")}
              </Label>
              <Select onValueChange={setRewardType} defaultValue={rewardType}>
                <SelectTrigger className="h-10 bg-secondary/20">
                  <SelectValue placeholder={t("placeholder_type")} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="FREE_ITEM">
                    {t("types.free_item")}
                  </SelectItem>
                  <SelectItem value="DISCOUNT">
                    {t("types.discount")}
                  </SelectItem>
                  <SelectItem value="CUSTOM">{t("types.custom")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reward Value Input */}
            <div className="grid gap-2">
              <Label
                htmlFor="value"
                className="text-xs uppercase font-medium tracking-wider text-muted-foreground"
              >
                {rewardType === "DISCOUNT"
                  ? t("label_value_percent")
                  : t("label_reward")}
              </Label>
              <Input
                id="value"
                type={rewardType === "DISCOUNT" ? "number" : "text"}
                placeholder={
                  rewardType === "DISCOUNT" ? "10" : t("placeholder_reward")
                }
                value={rewardValue}
                onChange={(e) => setRewardValue(e.target.value)}
                required
                className="h-10 bg-secondary/20"
              />
            </div>
          </div>

          {/* Threshold Input - Fixed for RTL using logical properties */}
          <div className="grid gap-2">
            <Label
              htmlFor="points"
              className="text-xs uppercase font-medium tracking-wider text-muted-foreground"
            >
              {t("label_threshold")}
            </Label>
            <div className="relative">
              <Input
                id="points"
                type="number"
                value={pointsThreshold}
                onChange={(e) => setPointsThreshold(e.target.value)}
                className="ps-28 h-10 bg-secondary/20 tabular-nums"
                required
              />
              <span className="absolute inset-y-0 start-3 flex items-center text-[10px] font-mono text-muted-foreground pointer-events-none">
                {t("threshold_prefix")}
              </span>
            </div>
          </div>

          {/* Advanced Logic Section */}
          <div className="border border-border/50 rounded-lg bg-secondary/10">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full p-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="h-3 w-3" />
                {t("advanced_toggle")}
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>

            {showAdvanced && (
              <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1">
                <div className="grid gap-2 pt-2 border-t border-border/50">
                  <Label className="text-[10px] uppercase text-muted-foreground mt-2">
                    {t("label_multiplier")}
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={pointsPerCurrency}
                        onChange={(e) => setPointsPerCurrency(e.target.value)}
                        type="number"
                        className="h-9 bg-background text-sm pe-20 tabular-nums"
                      />
                      <span className="absolute inset-y-0 end-3 flex items-center text-[10px] text-muted-foreground pointer-events-none">
                        {t("multiplier_suffix")}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {t("multiplier_help")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 font-semibold"
            >
              {loading ? t("submitting") : t("submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
