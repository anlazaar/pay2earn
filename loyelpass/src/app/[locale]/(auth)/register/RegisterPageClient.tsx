"use client";

import { useState } from "react";
import { useRouter, Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, ArrowLeft, Layers, Store, User, Cake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPageClient() {
  const t = useTranslations("Register");
  const router = useRouter();

  const [role, setRole] = useState<"BUSINESS" | "CLIENT">("CLIENT");
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    birthday: "", // New Field
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.error || t("error_generic"));
      }
    } catch (err) {
      setError(t("error_network"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* 🟢 Navigation / Utilities - RTL Fixed */}
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
        className="w-full max-w-[400px] px-6"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto w-10 h-10 mb-6 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* 🟢 Segmented Control */}
        <div className="grid grid-cols-2 p-1 mb-6 bg-secondary/50 rounded-lg border border-border/50">
          <button
            onClick={() => setRole("CLIENT")}
            className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
              role === "CLIENT"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4" /> {t("role_customer")}
          </button>
          <button
            onClick={() => setRole("BUSINESS")}
            className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
              role === "BUSINESS"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Store className="w-4 h-4" /> {t("role_business")}
          </button>
        </div>

        <div className="bg-card border border-border/50 shadow-sm rounded-xl overflow-hidden">
          <form
            onSubmit={handleRegister}
            className="p-6 md:p-8 space-y-4 text-start"
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {t("label_name")}
              </Label>
              <Input
                id="name"
                placeholder={t("placeholder_name")}
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-10 bg-secondary/30 border-border focus:ring-primary/20"
              />
            </div>

            <AnimatePresence initial={false}>
              {/* Business Name Field */}
              {role === "BUSINESS" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label
                    htmlFor="businessName"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {t("label_business_name")}
                  </Label>
                  <Input
                    id="businessName"
                    placeholder={t("placeholder_business")}
                    value={formData.businessName}
                    onChange={handleChange}
                    required={role === "BUSINESS"}
                    disabled={isLoading}
                    className="h-10 bg-secondary/30 border-border"
                  />
                </motion.div>
              )}

              {/* NEW: Birthday Field (Clients Only) */}
              {role === "CLIENT" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label
                    htmlFor="birthday"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center justify-between"
                  >
                    <span>{t("label_birthday")}</span>
                    <Cake className="w-3 h-3 text-pink-500" />
                  </Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-10 bg-secondary/30 border-border"
                  />
                  <p className="text-[10px] text-muted-foreground/80">
                    {t("birthday_help")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {t("label_email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-10 bg-secondary/30 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {t("label_password")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-10 bg-secondary/30 border-border"
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
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {t("processing")}
                </>
              ) : role === "BUSINESS" ? (
                t("submit_business")
              ) : (
                t("submit_customer")
              )}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("already_have_account")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t("sign_in")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}