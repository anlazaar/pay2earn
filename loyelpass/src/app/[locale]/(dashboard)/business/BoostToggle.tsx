"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Zap, Loader2 } from "lucide-react";
import { toggleBoost } from "@/app/actions/business";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  initialMultiplier: number;
}

export function BoostToggle({ initialMultiplier }: Props) {
  const t = useTranslations("BoostToggle");

  // If multiplier is > 1.0, it means boost is ON
  const [isBoosted, setIsBoosted] = useState(initialMultiplier > 1.0);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);

    // Optimistic update
    setIsBoosted(checked);

    const result = await toggleBoost(checked);

    setLoading(false);

    if (result.error) {
      // Revert if failed
      setIsBoosted(!checked);
      toast.error(t("toast.error_title"), {
        description: t("toast.error_desc"),
      });
    } else {
      if (checked) {
        toast.success(t("toast.on_title"), {
          description: t("toast.on_desc"),
          className: "border-indigo-500 bg-indigo-50 text-indigo-900",
        });
      } else {
        toast(t("toast.off_title"), {
          description: t("toast.off_desc"),
        });
      }
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
        isBoosted
          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
          : "bg-card border-border text-card-foreground"
      )}
    >
      <div className="flex items-center gap-4 text-start">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center transition-all shrink-0",
            isBoosted
              ? "bg-white/20 text-white"
              : "bg-secondary text-muted-foreground"
          )}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Zap className={cn("h-5 w-5", isBoosted && "fill-current")} />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-sm leading-none mb-1">
            {t("title")}
          </h3>
          <p
            className={cn(
              "text-xs font-medium",
              isBoosted ? "text-indigo-100" : "text-muted-foreground"
            )}
          >
            {isBoosted ? t("desc_on") : t("desc_off")}
          </p>
        </div>
      </div>

      <Switch
        checked={isBoosted}
        onCheckedChange={handleToggle}
        disabled={loading}
        className={cn(
          "data-[state=checked]:bg-indigo-400",
          isBoosted && "bg-white/20"
        )}
      />
    </div>
  );
}
