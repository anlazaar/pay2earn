"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, ArrowLeft, Layers, Command } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("errors.invalid"));
        setIsLoading(false);
      } else {
        // FIX: Using localized router.push is better than window.location.href
        // It automatically stays in the current language
        router.push("/dashboard-router");
        router.refresh();
      }
    } catch {
      setError(t("errors.generic"));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* 🟢 Navigation / Utilities - Using Logical Properties */}
      <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6 z-20">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
          <span>{t("back")}</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 rtl:right-auto rtl:left-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-100 px-6"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto w-10 h-10 mb-6 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border/50 shadow-sm rounded-xl overflow-hidden">
          <form
            onSubmit={handleLogin}
            className="p-6 md:p-8 space-y-5 text-start"
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {t("email_label")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-10 bg-secondary/30 border-border focus:border-primary/50 focus:ring-primary/20 transition-all font-sans"
                placeholder={t("email_placeholder")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {t("password_label")}
                </Label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {t("forgot_password")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-10 bg-secondary/30 border-border focus:border-primary/50 focus:ring-primary/20 transition-all font-sans"
              />
            </div>

            {error && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/5 border border-destructive/20 rounded-md flex items-center gap-2">
                <span className="w-1 h-1 bg-destructive rounded-full" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md transition-all shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("submit")
              )}
            </Button>
          </form>
        </div>

        {/* Demo Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-col items-center gap-2 px-4 py-3 rounded border border-border border-dashed bg-secondary/20">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Command className="w-3 h-3" /> {t("demo_title")}
            </span>
            <div
              className="flex items-center gap-4 text-xs font-mono text-foreground/80"
              dir="ltr"
            >
              <span>user: owner@loyelpass.com</span>
              <span className="w-px h-3 bg-border" />
              <span>pass: password123</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("no_account")}{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t("register_link")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
