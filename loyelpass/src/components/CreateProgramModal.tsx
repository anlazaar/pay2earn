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
import {
  Settings2,
  ChevronDown,
  Plus,
  Tag,
  Gift,
  Target,
  Coins,
  Percent,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
        setShowAdvanced(false);
      } else {
        // In a real app, use toast here
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
        <Button className="h-10 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 rounded-full px-5 transition-all hover:scale-105">
          <Plus className="h-4 w-4 stroke-3" />
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-112.5 border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-white/5 text-start bg-zinc-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                {t("title")}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                {t("description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="grid gap-5 text-start">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ps-1"
              >
                {t("label_name")}
              </Label>
              <div className="relative group">
                <Tag className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  placeholder={t("placeholder_name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="ps-10 h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/10 focus:border-primary/50 rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Reward Type */}
              <div className="grid gap-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ps-1">
                  {t("label_type")}
                </Label>
                <Select onValueChange={setRewardType} defaultValue={rewardType}>
                  <SelectTrigger className="h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/10 rounded-xl focus:ring-primary/20">
                    <SelectValue placeholder={t("placeholder_type")} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border rounded-xl shadow-xl">
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

              {/* Reward Value */}
              <div className="grid gap-2">
                <Label
                  htmlFor="value"
                  className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ps-1"
                >
                  {rewardType === "DISCOUNT"
                    ? t("label_value_percent")
                    : t("label_reward")}
                </Label>
                <div className="relative group">
                  {rewardType === "DISCOUNT" ? (
                    <Percent className="absolute start-3 top-3 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  ) : (
                    <Gift className="absolute start-3 top-3 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  )}
                  <Input
                    id="value"
                    type={rewardType === "DISCOUNT" ? "number" : "text"}
                    placeholder={
                      rewardType === "DISCOUNT" ? "10" : t("placeholder_reward")
                    }
                    value={rewardValue}
                    onChange={(e) => setRewardValue(e.target.value)}
                    required
                    className="ps-10 h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/10 focus:border-primary/50 rounded-xl transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Threshold Input */}
            <div className="grid gap-2">
              <Label
                htmlFor="points"
                className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ps-1"
              >
                {t("label_threshold")}
              </Label>
              <div className="relative group">
                <Target className="absolute start-3 top-3 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <Input
                  id="points"
                  type="number"
                  value={pointsThreshold}
                  onChange={(e) => setPointsThreshold(e.target.value)}
                  className="ps-10 h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/10 focus:border-primary/50 rounded-xl transition-all tabular-nums font-mono font-medium"
                  required
                />
                <span className="absolute inset-y-0 end-4 flex items-center text-xs font-bold text-muted-foreground pointer-events-none">
                  PTS
                </span>
              </div>
            </div>

            {/* Advanced Toggle */}
            <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 overflow-hidden transition-all duration-300">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full p-3.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded bg-zinc-200 dark:bg-white/10">
                    <Settings2 className="h-3.5 w-3.5" />
                  </div>
                  {t("advanced_toggle")}
                </div>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    showAdvanced && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-zinc-200 dark:border-white/5">
                      <div className="grid gap-2 pt-3">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                          {t("label_multiplier")}
                        </Label>
                        <div className="relative group">
                          <Coins className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                          <Input
                            value={pointsPerCurrency}
                            onChange={(e) =>
                              setPointsPerCurrency(e.target.value)
                            }
                            type="number"
                            className="ps-10 h-10 bg-background text-sm tabular-nums rounded-lg"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                          {t("multiplier_help")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 h-11 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                {loading ? t("submitting") : t("submit")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
