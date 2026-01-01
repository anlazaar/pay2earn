import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Trophy,
  CalendarDays,
  Wallet,
  Users,
  Star,
  TrendingUp,
} from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

// --- DATA FETCHING ---
async function getCustomers(userId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  });

  if (!business) return [];

  const clients = await prisma.client.findMany({
    where: {
      progress: { some: { program: { businessId: business.id } } },
    },
    include: {
      purchases: {
        where: { businessId: business.id },
        select: { totalAmount: true, createdAt: true },
      },
      progress: {
        where: { program: { businessId: business.id } },
        select: { pointsAccumulated: true },
      },
    },
  });

  return clients
    .map((c) => {
      const totalSpent = c.purchases.reduce(
        (acc, curr) => acc + Number(curr.totalAmount),
        0
      );
      const totalPoints = c.progress.reduce(
        (acc, curr) => acc + curr.pointsAccumulated,
        0
      );
      const lastVisit =
        c.purchases.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[0]?.createdAt || null;

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        totalSpent,
        totalPoints,
        lastVisit,
        visitCount: c.purchases.length,
        joinedAt: c.createdAt,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

export default async function CustomersPage() {
  const t = await getTranslations("CustomersPage");
  const format = await getFormatter();
  const session = await auth();

  if (!session?.user) return redirect("/api/auth/signin");

  const customers = await getCustomers(session.user.id);

  // Helper for Top 3 styling
  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"; // Gold
      case 1:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"; // Silver
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"; // Bronze
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-start">
      {/* 🟢 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-200/50 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
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

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search_placeholder")}
            className="pl-10 h-11 rounded-full bg-background/50 border-zinc-200 dark:border-white/10 focus:bg-background transition-all"
          />
        </div>
      </div>

      {/* 🟢 Grid Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {customers.map((customer, index) => {
          const isTopTier = index < 3;

          return (
            <Card
              key={customer.id}
              className="group relative overflow-hidden border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md rounded-3xl"
            >
              {/* Glow Effect for Top Tier */}
              {isTopTier && (
                <div
                  className={cn(
                    "absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 transition-all group-hover:opacity-40",
                    index === 0
                      ? "bg-amber-500"
                      : index === 1
                      ? "bg-slate-400"
                      : "bg-orange-500"
                  )}
                />
              )}

              <CardHeader className="flex flex-row items-start gap-4 pb-2 pt-6 px-6">
                <Avatar className="h-14 w-14 border-2 border-white dark:border-white/10 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-foreground font-bold text-lg">
                    {customer.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-bold truncate leading-tight">
                        {customer.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {customer.email}
                      </p>
                    </div>
                    {isTopTier && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 h-5 border font-bold shadow-sm",
                          getRankStyle(index)
                        )}
                      >
                        <Trophy className="w-3 h-3 mr-1" /> #{index + 1}
                      </Badge>
                    )}
                  </div>

                  {/* Member Since Tag */}
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground/70 bg-zinc-100/50 dark:bg-white/5 w-fit px-2 py-0.5 rounded-full">
                    <CalendarDays className="w-3 h-3" />
                    <span>
                      {format.dateTime(customer.joinedAt, {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-6 pt-2">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {/* Total Spent */}
                  <div className="p-3 rounded-2xl bg-zinc-50/80 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">
                      <Wallet className="w-3 h-3" /> {t("stats.spent")}
                    </div>
                    <div className="text-lg font-bold font-mono text-foreground">
                      {format.number(customer.totalSpent, {
                        style: "currency",
                        currency: "MAD",
                        notation: "compact",
                      })}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="p-3 rounded-2xl bg-zinc-50/80 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">
                      <Star className="w-3 h-3" /> {t("stats.points")}
                    </div>
                    <div className="text-lg font-bold font-mono text-primary flex items-center gap-1">
                      {customer.totalPoints}
                    </div>
                  </div>
                </div>

                {/* Visit Footer */}
                <div className="mt-4 pt-4 border-t border-zinc-200/50 dark:border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {customer.visitCount} {t("stats.visits")}
                    </span>
                  </div>
                  <div className="text-muted-foreground/60 text-[10px]">
                    {t("stats.last_seen")}:{" "}
                    {customer.lastVisit
                      ? format.relativeTime(customer.lastVisit)
                      : t("stats.never")}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
