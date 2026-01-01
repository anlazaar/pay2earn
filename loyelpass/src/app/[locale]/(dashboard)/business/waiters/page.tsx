"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Loader2,
  CheckCircle2,
  Users,
  Search,
  ShieldCheck,
  MoreVertical,
  CalendarDays,
} from "lucide-react";
import { WaiterActions } from "@/components/WaiterActions";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function WaitersPage() {
  const t = useTranslations("WaitersPage");
  const format = useFormatter();

  const [waiters, setWaiters] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchWaiters();
  }, []);

  const fetchWaiters = async () => {
    try {
      const res = await fetch("/api/waiters");
      if (res.ok) setWaiters(await res.json());
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/waiters", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: "", email: "", password: "" });
        toast.success(t("alerts.success"));
        fetchWaiters();
      } else {
        toast.error(t("alerts.error"));
      }
    } catch (error) {
      toast.error(t("alerts.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-start">
      {/* 🟢 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-200/50 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* 🟢 Column 1: Create Form (Sticky Control Panel) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Card className="border border-zinc-200 dark:border-white/10 shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-zinc-950/5 dark:ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

            <CardHeader className="pb-6 border-b border-zinc-100 dark:border-white/5 text-start relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/10 text-foreground">
                  <UserPlus className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold">
                  {t("form.card_title")}
                </CardTitle>
              </div>
              <CardDescription className="text-xs font-medium ps-1">
                {t("form.card_desc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-5 text-start">
                {/* Name Input */}
                <div className="space-y-2 group">
                  <Label
                    htmlFor="name"
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors"
                  >
                    {t("form.name_label")}
                  </Label>
                  <div className="relative">
                    <User className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50 group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="name"
                      required
                      className="ps-10 h-11 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 focus:bg-background focus:border-primary/50 rounded-xl transition-all"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t("form.name_placeholder")}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2 group">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors"
                  >
                    {t("form.email_label")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50 group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="email"
                      required
                      type="email"
                      className="ps-10 h-11 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 focus:bg-background focus:border-primary/50 rounded-xl transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t("form.email_placeholder")}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors"
                    >
                      {t("form.password_label")}
                    </Label>
                    <span className="text-[9px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" /> Secure
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground/50 group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="password"
                      required
                      type="password"
                      className="ps-10 h-11 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 focus:bg-background focus:border-primary/50 rounded-xl transition-all font-mono tracking-widest"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground pt-1 opacity-70 ps-1">
                    {t("form.password_help")}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 mt-4 shadow-xl shadow-primary/20 rounded-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="me-2 h-4 w-4 animate-spin rtl:ml-2" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    t("form.submit")
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 🟢 Column 2: Staff List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filters Bar */}
          <div className="flex items-center justify-between gap-4 p-1">
            <div className="relative w-full max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff by name or email..."
                className="ps-10 h-10 rounded-full bg-background border-zinc-200 dark:border-white/10 hover:border-primary/30 transition-colors"
              />
            </div>
            <div className="text-xs font-medium text-muted-foreground hidden sm:block">
              {waiters.length} {t("list.members")}
            </div>
          </div>

          <div className="space-y-4">
            {fetching ? (
              // Premium Loading State
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-zinc-100/50 dark:bg-white/5 animate-pulse border border-zinc-200/50 dark:border-white/5"
                />
              ))
            ) : waiters.length === 0 ? (
              // Premium Empty State
              <div className="py-20 text-center flex flex-col items-center justify-center gap-4 border border-dashed border-zinc-200 dark:border-white/10 rounded-3xl bg-zinc-50/50 dark:bg-white/5 animate-in zoom-in-95">
                <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-inner">
                  <Users className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t("list.empty")}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                    {t("list.empty_desc")}
                  </p>
                </div>
              </div>
            ) : (
              // Premium Staff Cards
              <div className="grid gap-4">
                {waiters.map((waiter) => (
                  <div
                    key={waiter.id}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md"
                  >
                    {/* Active Status Strip */}
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-primary/0 group-hover:bg-primary rounded-r-full transition-all duration-300" />

                    <div className="flex items-center gap-5">
                      {/* Avatar */}
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-base font-bold border border-white/20 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                        {waiter.username?.[0]?.toUpperCase() || "U"}
                      </div>

                      <div className="text-start">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                            {waiter.username || t("list.unknown")}
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] h-5 px-1.5 gap-1"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {t("list.active")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                            {waiter.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-8 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-zinc-100 dark:border-white/5">
                      <div className="text-start sm:text-end">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1 flex items-center gap-1 sm:justify-end">
                          <CalendarDays className="w-3 h-3" />
                          {t("list.added_label")}
                        </p>
                        <p className="text-xs font-mono font-medium text-foreground bg-zinc-100 dark:bg-white/10 px-2.5 py-1 rounded-md">
                          {format.dateTime(new Date(waiter.createdAt), {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="pl-4 border-l border-zinc-200 dark:border-white/10">
                        <WaiterActions
                          waiter={waiter}
                          onSuccess={fetchWaiters}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
