"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ScanLine, Users, Settings2, ShieldAlert, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturesGrid() {
  const t = useTranslations("FeaturesGrid");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Helper to calculate Framer Motion X values based on LTR/RTL
  // In RTL, "out of bounds" is negative (left), in LTR it is positive (right)
  const getAnimX = (rest: number, hover: number) => {
    return {
      rest: isRtl ? -rest : rest,
      hover: isRtl ? -hover : hover,
    };
  };

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            {t.rich("title", {
              line: () => <br className="hidden md:block" />,
            })}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          {/* CARD 1: The Waiter Workflow (Wide) */}
          <motion.div
            whileHover="hover"
            initial="rest"
            className="group md:col-span-2 relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors"
          >
            {/* 1. TEXT SIDE: Forced to one half */}
            <div
              className={cn(
                "absolute inset-y-0 w-full md:w-[50%] p-8 flex flex-col justify-between z-20 pointer-events-none text-start",
                isRtl ? "right-0" : "left-0"
              )}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">
                  {t("card1.title")}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {t("card1.description")}
                </p>
              </div>
            </div>

            {/* 2. VISUAL SIDE: Forced to the opposite half */}
            <div
              className={cn(
                "absolute inset-y-0 w-full md:w-1/2 hidden md:flex items-center justify-center z-10",
                isRtl ? "left-0" : "right-0"
              )}
            >
              {/* Phone 1: Waiter (Bottom Layer) */}
              <motion.div
                variants={{
                  rest: { x: 0, opacity: 1 },
                  hover: { x: isRtl ? 20 : -20, opacity: 0.8 },
                }}
                className={cn(
                  "absolute w-40 h-64 bg-background border border-border rounded-xl shadow-2xl p-3 z-10",
                  isRtl ? "left-10" : "right-10"
                )}
              >
                <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {t("card1.waiter_mode")}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-primary/10 rounded flex items-center justify-center text-[10px] font-medium text-primary">
                    {t("card1.btn_generate")}
                  </div>
                  <div className="h-2 w-full bg-secondary rounded" />
                  <div className="h-2 w-2/3 bg-secondary rounded" />
                </div>
              </motion.div>

              {/* Phone 2: Client (Top Layer) */}
              <motion.div
                variants={{
                  rest: { x: getAnimX(80, 80).rest, opacity: 0 },
                  hover: { x: getAnimX(80, 45).hover, opacity: 1 },
                }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "absolute w-40 h-64 bg-foreground text-background border border-border rounded-xl shadow-2xl p-4 flex flex-col items-center justify-center z-20",
                  isRtl ? "left-0" : "right-0"
                )}
              >
                <div className="w-20 h-20 bg-white rounded-lg mb-3 p-1">
                  <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example')] bg-cover opacity-80 mix-blend-multiply" />
                </div>
                <div className="text-[10px] font-mono opacity-70 text-center">
                  {t("card1.scan_to_claim")}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CARD 2: Smart Reward Logic (Tall) */}
          <motion.div
            whileHover="hover"
            className="md:row-span-2 relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors p-8 flex flex-col text-start"
          >
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6 border border-indigo-500/20">
              <Settings2 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{t("card2.title")}</h3>
            <p className="text-muted-foreground mb-8">
              {t("card2.description")}
            </p>
            <div className="flex-1 space-y-3">
              {Array.isArray(t.raw("card2.rules")) &&
                t.raw("card2.rules").map((rule: any, i: number) => (
                  <motion.div
                    key={i}
                    variants={{ hover: { scale: i === 0 ? 1.05 : 1 } }}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      i === 0
                        ? "bg-background border-primary/50 shadow-sm"
                        : "bg-transparent border-border opacity-50"
                    )}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold">
                        {rule.label}
                      </span>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          i === 0 ? "bg-primary" : "bg-muted-foreground"
                        )}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {rule.val}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* CARD 3: Fraud Prevention */}
          <motion.div
            whileHover="hover"
            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors p-8 text-start"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="px-2 py-1 bg-background/50 backdrop-blur rounded border border-orange-500/30 text-[10px] font-mono text-orange-600 dark:text-orange-400">
                {t("card3.badge")}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("card3.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("card3.description")}
            </p>
            <div className="mt-6 w-full bg-muted h-1 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                whileInView={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                className="h-full bg-orange-500"
              />
            </div>
          </motion.div>

          {/* CARD 4: Staff Tracking */}
          <motion.div
            whileHover="hover"
            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors p-8 text-start"
          >
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("card4.title")}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("card4.description")}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("card4.performance")}
              </div>
            </div>
          </motion.div>

          {/* CARD 5: Client Experience (Wide) */}
          <motion.div
            whileHover="hover"
            className="md:col-span-2 relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors flex flex-col md:flex-row text-start"
          >
            <div className="p-8 flex-1">
              <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 mb-6 border border-pink-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                {t("card5.title")}
              </h3>
              <p className="text-muted-foreground">{t("card5.description")}</p>
            </div>
            <div className="p-8 flex items-center gap-4">
              {Array.isArray(t.raw("card5.tiers")) &&
                t.raw("card5.tiers").map((tier: any, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full opacity-80 shadow-lg border-2 border-background",
                        i === 0
                          ? "bg-slate-300"
                          : i === 1
                          ? "bg-yellow-500"
                          : "bg-indigo-500"
                      )}
                    />
                    <div className="text-center">
                      <div className="text-xs font-bold">{tier.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {tier.points}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
