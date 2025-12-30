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
} from "lucide-react";
import { WaiterActions } from "@/components/WaiterActions";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 text-start">
      {/* 🟢 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 🟢 Column 1: Create Form (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="border border-border/50 shadow-sm bg-card rounded-xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50 text-start">
              <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <UserPlus className="h-4 w-4" />
                </div>
                {t("form.card_title")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("form.card_desc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4 text-start">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {t("form.name_label")}
                  </Label>
                  <div className="relative">
                    {/* Changed left-3 to start-3 for RTL support */}
                    <User className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    {/* Changed pl-9 to ps-9 for RTL support */}
                    <Input
                      id="name"
                      required
                      className="ps-9 h-10 bg-secondary/20 text-start"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t("form.name_placeholder")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {t("form.email_label")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      required
                      type="email"
                      className="ps-9 h-10 bg-secondary/20 text-start"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t("form.email_placeholder")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {t("form.password_label")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      required
                      type="password"
                      className="ps-9 h-10 bg-secondary/20 text-start"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder={t("form.password_placeholder")}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground pt-1">
                    {t("form.password_help")}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-sm font-medium h-10 mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      {/* Changed mr-2 to me-2 for RTL */}
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

        {/* 🟢 Column 2: Staff List (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Card className="h-full border border-border/50 shadow-sm bg-card rounded-xl flex flex-col">
            <CardContent className="flex-1 p-0">
              {fetching ? (
                <div className="p-10 text-center flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t("list.loading")}
                  </span>
                </div>
              ) : waiters.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  {t("list.empty")}
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {waiters.map((waiter) => (
                    <div
                      key={waiter.id}
                      className="group flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="h-9 w-9 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold border border-white/10 shadow-sm">
                          {waiter.username?.[0]?.toUpperCase() || "U"}
                        </div>

                        <div className="text-start">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm text-foreground">
                              {waiter.username || t("list.unknown")}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />{" "}
                              {t("list.active")}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {waiter.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-end hidden sm:block">
                          <p className="text-[10px] uppercase text-muted-foreground tracking-wider mb-0.5">
                            {t("list.added_label")}
                          </p>
                          <p className="text-xs font-mono text-foreground">
                            {/* Localized Date */}
                            {format.dateTime(new Date(waiter.createdAt), {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        <WaiterActions
                          waiter={waiter}
                          onSuccess={fetchWaiters}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
