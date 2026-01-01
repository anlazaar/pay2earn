import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateProgramModal } from "@/components/CreateProgramModal";
import { OverviewChart } from "@/components/OverviewChart";
import {
  HourlyActivityChart,
  TopWaitersChart,
} from "@/components/BusinessCharts";
import { Users, Store, Layers, TrendingUp, ArrowUpRight } from "lucide-react";
import { BoostToggle } from "./BoostToggle";
import { ProgramActions } from "@/components/ProgramActions";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

// --- HELPERS ---
function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

// --- DATA ACCESS LAYER ---
async function getDashboardData(userId: string, locale: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    select: { id: true, name: true, pointsMultiplier: true },
  });

  if (!business) return null;

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Parallel Data Fetching
  const [
    programs,
    totalClientsCount,
    recentPurchases,
    todayPurchases, // Actually fetching last 7 days for better demo data
    totalPointsAgg,
  ] = await Promise.all([
    // A. Loyalty Programs
    prisma.loyaltyProgram.findMany({
      where: { businessId: business.id },
    }),

    // B. Total Distinct Clients
    prisma.clientProgress
      .groupBy({
        by: ["clientId"],
        where: { program: { businessId: business.id } },
      })
      .then((res) => res.length),

    // C. Purchases for Main Chart (Last 7 Days)
    prisma.purchase.findMany({
      where: {
        businessId: business.id,
        redeemed: true,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true, pointsAwarded: true },
      orderBy: { createdAt: "asc" },
    }),

    // D. Purchases for Hourly & Waiter (Last 7 Days for robustness)
    prisma.purchase.findMany({
      where: {
        businessId: business.id,
        redeemed: true,
        createdAt: { gte: sevenDaysAgo },
      },
      include: { waiter: { select: { username: true } } },
    }),

    // E. Total Points
    prisma.purchase.aggregate({
      _sum: { pointsAwarded: true },
      where: { businessId: business.id, redeemed: true },
    }),
  ]);

  // 1. Process Main Chart Data
  const last7Days = getLast7Days();
  const rawDataMap = new Map<string, number>();

  recentPurchases.forEach((p) => {
    const date = p.createdAt.toISOString().split("T")[0];
    rawDataMap.set(date, (rawDataMap.get(date) || 0) + p.pointsAwarded);
  });

  const chartData = last7Days.map((date) => ({
    date: date,
    displayDate: new Date(date).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    }),
    points: rawDataMap.get(date) || 0,
  }));

  // 2. Process Hourly Activity (Simple Aggregation)
  const hoursArray = new Array(24).fill(0);
  todayPurchases.forEach((p) => {
    const hour = p.createdAt.getHours();
    hoursArray[hour]++;
  });

  const hourlyData = hoursArray
    .map((count, i) => ({ hour: `${i}:00`, count }))
    .filter((_, i) => i >= 9 && i <= 23); // Filter logical business hours

  // 3. Process Top Waiters
  const waiterMap = new Map<string, number>();
  todayPurchases.forEach((p) => {
    const name = p.waiter?.username || "Admin"; // Default to Admin if null
    waiterMap.set(name, (waiterMap.get(name) || 0) + 1);
  });

  const waiterData = Array.from(waiterMap.entries())
    .map(([name, count]) => ({ name, revenue: count }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    businessName: business.name,
    programs: programs,
    totalClients: totalClientsCount,
    totalPoints: totalPointsAgg._sum.pointsAwarded || 0,
    chartData,
    hourlyData,
    waiterData,
    multiplier: business.pointsMultiplier || 1.0,
  };
}

// --- MAIN COMPONENT ---
export default async function BusinessDashboard() {
  const locale = await getLocale();
  const t = await getTranslations("BusinessDashboard");
  const session = await auth();

  if (!session?.user?.id) return redirect("/api/auth/signin");

  const data = await getDashboardData(session.user.id, locale);

  if (!data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center animate-pulse">
        <div className="p-4 rounded-full bg-muted/50">
          <Store className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {t("loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {data.businessName}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {new Date().toLocaleDateString(locale, { dateStyle: "full" })}
          </p>
        </div>
        <CreateProgramModal />
      </div>

      {/* 2. Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title={t("stats.totalClients")}
          value={data.totalClients}
          icon={Users}
          trend="+12%" // Demo trend
          trendUp={true}
        />
        <StatCard
          title={t("stats.totalPoints")}
          value={data.totalPoints}
          icon={Store}
          trend="Lifetime"
        />
        <StatCard
          title={t("stats.activePrograms")}
          value={data.programs.filter((p) => p.active).length}
          icon={Layers}
          subValue={`${data.programs.length} Total`}
        />
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN (Charts) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Area Chart */}
          <Card className="border border-zinc-200/50 dark:border-white/10 shadow-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-0 border-b border-zinc-100 dark:border-white/5 pt-6 px-6 text-start">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    {t("charts.activityTrend")}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1.5 font-medium">
                    {t("charts.activityTrendDesc")}
                  </CardDescription>
                </div>
                {/* Optional: Filter Dropdown could go here */}
              </div>
            </CardHeader>
            <CardContent className="pt-6 ps-2 pe-6">
              <OverviewChart data={data.chartData} />
            </CardContent>
          </Card>

          {/* Secondary Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <HourlyActivityChart data={data.hourlyData} />
            <TopWaitersChart data={data.waiterData} />
          </div>
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="space-y-6">
          {/* Boost Toggle */}
          <BoostToggle initialMultiplier={data.multiplier} />

          {/* Programs List */}
          <Card className="border border-zinc-200/50 dark:border-white/10 shadow-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl overflow-hidden h-fit">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-white/5 pt-5 px-5 text-start">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                {t("programs.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100 dark:divide-white/5">
                {data.programs.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex flex-col gap-1 text-start">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{p.name}</span>
                        {p.active && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t("programs.logic", {
                          threshold: p.pointsThreshold,
                          value: p.rewardValue,
                        })}
                      </span>
                    </div>
                    <ProgramActions program={p} />
                  </div>
                ))}

                {data.programs.length === 0 && (
                  <div className="text-center py-12 px-6">
                    <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                      <Layers className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {t("programs.empty")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  subValue,
}: {
  title: string;
  value: number | string;
  icon: any;
  trend?: string;
  trendUp?: boolean;
  subValue?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 backdrop-blur-md">
      {/* Background Gradient Blob */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors blur-2xl" />

      <div className="relative z-10 flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all border border-zinc-200 dark:border-white/10">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="relative z-10 flex items-end gap-2">
        <span className="text-3xl font-black tracking-tight tabular-nums text-foreground">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {subValue && (
          <span className="text-sm font-medium text-muted-foreground mb-1">
            / {subValue}
          </span>
        )}
      </div>

      {(trend || trendUp !== undefined) && (
        <div className="relative z-10 mt-2 flex items-center gap-1 text-xs font-medium">
          {trendUp ? (
            <span className="text-green-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> {trend}
            </span>
          ) : (
            <span className="text-muted-foreground">{trend}</span>
          )}
        </div>
      )}
    </div>
  );
}
