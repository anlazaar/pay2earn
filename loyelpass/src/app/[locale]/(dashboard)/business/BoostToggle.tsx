"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Zap, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { toggleBoost } from "@/app/actions/business";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  initialMultiplier: number;
}

export function BoostToggle({ initialMultiplier }: Props) {
  const t = useTranslations("BoostToggle");
  const [isBoosted, setIsBoosted] = useState(initialMultiplier > 1.0);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    // Optimistic Update
    setIsBoosted(checked);

    try {
      const result = await toggleBoost(checked);

      if (result?.error) {
        throw new Error("Failed to toggle");
      }

      if (checked) {
        toast.success(t("toast.on_title"), {
          description: t("toast.on_desc"),
          // Styling toast to match theme
          className:
            "group border-primary/20 bg-primary/10 text-primary-foreground backdrop-blur-md",
        });
      } else {
        toast(t("toast.off_title"), {
          description: t("toast.off_desc"),
        });
      }
    } catch (error) {
      // Revert on error
      setIsBoosted(!checked);
      toast.error(t("toast.error_title"), {
        description: t("toast.error_desc"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 overflow-hidden group",
        isBoosted
          ? "border-primary/50 bg-primary shadow-[0_8px_30px_-10px_rgba(0,0,0,0.3)] shadow-primary/30"
          : "border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-white/5"
      )}
    >
      {/* Background Texture (Noise) for Active State */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none mix-blend-overlay",
          isBoosted &&
            "opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"
        )}
      />

      {/* Animated Glow Gradient for Active State */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-500",
          isBoosted && "opacity-100"
        )}
      />

      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-4 text-start">
          {/* Icon Box */}
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0 relative",
              isBoosted
                ? "bg-white/20 text-white shadow-inner ring-1 ring-white/30"
                : "bg-zinc-100 dark:bg-white/5 text-muted-foreground border border-zinc-200 dark:border-white/10"
            )}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="icon"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="relative flex items-center justify-center"
                >
                  <Zap
                    className={cn(
                      "h-6 w-6 transition-all",
                      isBoosted && "fill-white drop-shadow-md"
                    )}
                  />

                  {/* Magic Sparkles when Active */}
                  {isBoosted && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute -bottom-1 -left-1"
                      >
                        <TrendingUp className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <h3
              className={cn(
                "font-bold text-sm leading-tight mb-1 transition-colors",
                isBoosted ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {t("title")}
            </h3>
            <p
              className={cn(
                "text-xs font-medium transition-colors",
                isBoosted
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
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
            "transition-all data-[state=checked]:bg-white/20 data-[state=checked]:hover:bg-white/30 border-2 border-transparent",
            !isBoosted &&
              "data-[state=unchecked]:bg-zinc-200 dark:data-[state=unchecked]:bg-zinc-700"
          )}
        />
      </div>
    </motion.div>
  );
}
