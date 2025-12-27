"use client";

// FIX: Use localized Link
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Layers } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";

export function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight">loylpass</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            {t("links.product")}
          </Link>
          <Link
            href="#pricing"
            className="hover:text-foreground transition-colors"
          >
            {t("links.pricing")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageSwitcher />
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                {t("login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary text-white">
                {t("register")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
