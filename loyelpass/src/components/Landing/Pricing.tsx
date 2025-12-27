"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const planSettings = [
  { price: { monthly: 0, yearly: 0 }, popular: false },
  { price: { monthly: 399, yearly: 329 }, popular: true },
  { price: { monthly: "Custom", yearly: "Custom" }, popular: false },
];

export function Pricing() {
  const t = useTranslations("Pricing");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isYearly, setIsYearly] = useState(false);

  // Raw data from JSON
  const translatedPlans = t.raw("plans");

  return (
    <section
      id="pricing"
      className="py-24 md:py-32 border-t border-border/40 relative"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">{t("subtitle")}</p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t("monthly")}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full bg-secondary border border-border transition-colors focus:outline-none"
            >
              <motion.div
                className="absolute top-1 inset-inline-start-1 w-5 h-5 bg-primary rounded-full shadow-sm"
                animate={{ x: isYearly ? (isRtl ? -28 : 28) : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t("yearly")}{" "}
              <span className="text-emerald-500 text-xs ms-1 font-mono">
                {t("discount")}
              </span>
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {translatedPlans.map((plan: any, i: number) => {
            const settings = planSettings[i];
            const isMonthlyNumber = typeof settings.price.monthly === "number";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "relative rounded-2xl p-8 flex flex-col",
                  settings.popular
                    ? "bg-background border-2 border-primary shadow-2xl shadow-primary/10 z-10 scale-105 md:scale-110"
                    : "bg-secondary/20 border border-border/50 hover:border-border transition-colors"
                )}
              >
                {settings.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                    {t("popular_badge")}
                  </div>
                )}

                <div className="mb-8 text-start">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-6 h-10">
                    {plan.desc}
                  </p>

                  <div className="flex items-baseline gap-1">
                    {isMonthlyNumber ? (
                      <>
                        <span className="text-4xl font-bold tracking-tight tabular-nums">
                          {isYearly
                            ? settings.price.yearly
                            : settings.price.monthly}
                        </span>
                        <span className="text-lg font-bold text-muted-foreground">
                          {t("currency")}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {t("per_month")}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold tracking-tight">
                        {t("custom")}
                      </span>
                    )}
                  </div>
                  {isYearly &&
                    isMonthlyNumber &&
                    (settings.price.monthly as number) > 0 && (
                      <p className="text-xs text-emerald-500 mt-2 font-medium">
                        {t("billed_annually", {
                          amount: (settings.price.yearly as number) * 12,
                        })}
                      </p>
                    )}
                </div>

                <ul className="space-y-4 mb-8 flex-1 text-start">
                  {plan.features.map((feature: string) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={settings.popular ? "default" : "outline"}
                  className={cn(
                    "w-full rounded-full h-12 font-medium",
                    settings.popular
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-transparent border-border hover:bg-secondary"
                  )}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
