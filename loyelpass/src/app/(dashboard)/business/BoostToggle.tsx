"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Zap, Loader2 } from "lucide-react";
import { toggleBoost } from "@/app/actions/business";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  initialMultiplier: number;
}

export function BoostToggle({ initialMultiplier }: Props) {
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update boost settings.",
      });
    } else {
      toast({
        title: checked ? "🚀 Boost Activated!" : "Boost Deactivated",
        description: checked
          ? "Customers will now earn 2x points."
          : "Points returned to normal rate.",
        className: checked
          ? "border-indigo-500 bg-indigo-50 text-indigo-900"
          : "",
      });
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
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center transition-all",
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
          <h3 className="font-semibold text-sm">Happy Hour Boost</h3>
          <p
            className={cn(
              "text-xs",
              isBoosted ? "text-indigo-100" : "text-muted-foreground"
            )}
          >
            {isBoosted
              ? "Active: 2x Points Multiplier"
              : "Off: Normal Points Rate"}
          </p>
        </div>
      </div>

      <Switch
        checked={isBoosted}
        onCheckedChange={handleToggle}
        disabled={loading}
        className={cn(
          "data-[state=checked]:bg-white data-[state=checked]:text-indigo-600",
          // Customizing the switch thumb color when checked requires deep css or className override depending on shadcn version
          // If default shadcn: data-[state=checked]:bg-primary.
          // We override for the purple theme:
          isBoosted && "data-[state=checked]:bg-indigo-400"
        )}
      />
    </div>
  );
}
