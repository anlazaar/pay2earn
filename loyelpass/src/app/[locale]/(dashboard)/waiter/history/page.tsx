import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Banknote,
  Clock,
  Receipt,
  CalendarDays,
} from "lucide-react";

async function getWaiterStats(userId: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 1. Calculate Today's Total Income
  const todayStats = await prisma.purchase.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      waiterId: userId,
      redeemed: true, // Only count completed/redeemed sales
      createdAt: {
        gte: startOfDay,
      },
    },
  });

  // 2. Fetch Recent History (Last 50)
  const history = await prisma.purchase.findMany({
    where: {
      waiterId: userId,
      redeemed: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    include: {
      client: {
        select: { name: true },
      },
    },
  });

  return {
    dailyTotal: Number(todayStats._sum.totalAmount) || 0,
    history,
  };
}

export default async function WaiterHistoryPage() {
  const session = await auth();
  const t = await getTranslations("WaiterHistory");
  const locale = await getLocale();

  // Security Check
  if (!session || session.user.role !== "WAITER") {
    redirect("/");
  }

  const { dailyTotal, history } = await getWaiterStats(session.user.id);

  // Date formatter for the list
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-background text-foreground max-w-md mx-auto flex flex-col">
      {/* 🟢 1. Header */}
      <div className="p-4 border-b border-border/50 bg-card sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/waiter">
            <Button variant="ghost" size="icon" className="rounded-full">
              {/* rtl:rotate-180 flips arrow for Arabic */}
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        {/* 🟢 2. Daily Total Card */}
        <Card className="bg-primary/5 border-primary/20 shadow-sm overflow-hidden relative">
          <div className="absolute right-0 top-0 p-3 opacity-10">
            <Banknote className="w-24 h-24 text-primary rtl:-scale-x-100" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {t("daily_total_label")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-mono font-bold tracking-tighter text-primary">
              {dailyTotal.toFixed(2)}{" "}
              <span className="text-lg text-primary/70">{t("currency")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🟢 3. History List */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background/50">
        <div className="px-4 py-3 bg-secondary/20 border-b border-border/50 backdrop-blur-sm">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-start">
            <Clock className="w-4 h-4 text-muted-foreground" />
            {t("transaction_history_label")}
          </h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/40">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                <Receipt className="w-10 h-10 opacity-20" />
                <p className="text-sm">{t("empty_history")}</p>
              </div>
            ) : (
              history.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group"
                >
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                        {timeFormatter.format(tx.createdAt)}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {t("ticket_id", {
                          id: tx.qrCode.slice(-4).toUpperCase(),
                        })}
                      </span>
                    </div>
                    {/* Optional: Show client name if available */}
                    {tx.client ? (
                      <span className="text-xs text-muted-foreground">
                        Client: {tx.client.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground opacity-50">
                        Guest
                      </span>
                    )}
                  </div>

                  <div className="text-end">
                    <div className="font-bold text-sm">
                      +{Number(tx.totalAmount).toFixed(2)}{" "}
                      <span className="text-[10px] text-muted-foreground">
                        {t("currency")}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-600 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                      +{tx.pointsAwarded} {t("col_points")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom padding for safe area */}
      <div className="h-6 bg-background" />
    </div>
  );
}
