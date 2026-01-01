"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [1, 2, 3, 4, 5];

export function FAQ() {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((i, index) => (
          <div
            key={i}
            className={cn(
              "border rounded-2xl transition-all duration-300 overflow-hidden",
              openIndex === index
                ? "bg-secondary/20 border-primary/20"
                : "bg-transparent border-border/50 hover:border-border"
            )}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex items-center justify-between w-full p-6 text-start"
            >
              <span className="font-semibold text-lg">{t(`q${i}`)}</span>
              <span className="p-2 rounded-full bg-background/50 ml-4 shrink-0">
                {openIndex === index ? (
                  <Minus className="w-4 h-4 text-primary" />
                ) : (
                  <Plus className="w-4 h-4 text-muted-foreground" />
                )}
              </span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                    {t(`a${i}`)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
