"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function CallToAction() {
  const t = useTranslations("CTA");

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative rounded-[2.5rem] bg-gradient-to-b from-zinc-900 to-black border border-white/10 p-12 md:p-24 text-center overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 mb-6">
              <Sparkles className="w-3 h-3" />
              <span>{t("badge")}</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-full text-base bg-white text-black hover:bg-zinc-200"
                >
                  {t("btn_primary")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-full text-base border-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
                >
                  {t("btn_secondary")}
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-zinc-500">{t("footer_note")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
