"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation"; 
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 dark:opacity-20 opacity-40" />

      <div className="container mx-auto px-6 text-center z-10">
        {/* 1. Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer">
            <span className="font-medium text-primary">{t("badge_new")}</span>
            <span className="h-3 w-px bg-border mx-1" />
            <span>{t("badge")}</span>
            {/* rtl:rotate-180 ensures the arrow points the correct way in Arabic */}
            <ChevronRight className="w-3 h-3 ms-1 rtl:rotate-180" />
          </div>
        </motion.div>

        {/* 2. Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.1]"
        >
          {t("title_start")} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
            {t("title_gradient")}
          </span>
        </motion.h1>

        {/* 3. Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* 4. CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register">
            <Button
              size="lg"
              className="h-12 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium text-base"
            >
              {t("cta_primary")}
              <ArrowRight className="ms-2 w-4 h-4 rtl:rotate-180" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 rounded-full border-border bg-background hover:bg-secondary text-base font-medium"
            >
              {t("cta_secondary")}
            </Button>
          </Link>
        </motion.div>

        {/* 5. Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-border/40 max-w-4xl mx-auto"
        >
          <p className="text-sm text-muted-foreground mb-6">
            {t("trusted_by")}
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-lg font-bold">Acme Corp</span>
            <span className="text-lg font-bold">Vercel</span>
            <span className="text-lg font-bold">Stripe</span>
            <span className="text-lg font-bold">Linear</span>
            <span className="text-lg font-bold">Raycast</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
