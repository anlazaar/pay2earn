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
import { Users, Store, Layers, TrendingUp, DollarSign } from "lucide-react";
import { BoostToggle } from "./BoostToggle";
import { ProgramActions } from "@/components/ProgramActions";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

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
  // 1. Fetch Business Context
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    select: { id: true, name: true, pointsMultiplier: true }, // Select only needed fields
  });

  if (!business) return null;

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 2. Parallel Data Fetching
  const [
    programs,
    totalClientsCount,
    recentPurchases,
    todayPurchases,
    totalPointsAgg,
  ] = await Promise.all([
    // A. Loyalty Programs
    prisma.loyaltyProgram.findMany({
      where: { businessId: business.id },
    }),

    // B. Total Distinct Clients (Optimized GroupBy)
    prisma.clientProgress
      .groupBy({
        by: ["clientId"],
        where: { program: { businessId: business.id } },
      })
      .then((res) => res.length),

    // C. Purchases for Chart (Last 7 Days Only)
    prisma.purchase.findMany({
      where: {
        businessId: business.id,
        redeemed: true,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true, pointsAwarded: true },
    }),

    // D. Purchases for Hourly & Waiter Stats (Limit to recent/today for relevance)
    // Note: Fetching ALL history for waiters might be heavy, limiting to last 30 days is safer
    prisma.purchase.findMany({
      where: {
        businessId: business.id,
        redeemed: true,
        createdAt: { gte: sevenDaysAgo }, // Using 7 days for waiter stats too
      },
      include: { waiter: { select: { username: true } } },
    }),

    // E. Total Points Ever (Aggregation)
    prisma.purchase.aggregate({
      _sum: { pointsAwarded: true },
      where: { businessId: business.id, redeemed: true },
    }),
  ]);

  // 3. Process Chart Data
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

  // 4. Process Hourly Activity (Using Today's/Recent Data)
  const hoursArray = new Array(24).fill(0);
  todayPurchases.forEach((p) => {
    const hour = p.createdAt.getHours();
    hoursArray[hour]++;
  });

  const hourlyData = hoursArray
    .map((count, i) => ({ hour: `${i}:00`, count }))
    .filter((_, i) => i >= 8 && i <= 23); // Business hours

  // 5. Process Top Waiters
  const waiterMap = new Map<string, number>();
  todayPurchases.forEach((p) => {
    const name = p.waiter?.username || "Unknown";
    // We count transactions here, but could sum 'totalAmount' if available in select
    waiterMap.set(name, (waiterMap.get(name) || 0) + 1);
  });

  const waiterData = Array.from(waiterMap.entries())
    .map(([name, count]) => ({ name, revenue: count })) // Using count as metric
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
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center animate-pulse">
        <Store className="h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">
          {t("loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 text-start">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {data.businessName}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
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
          trend="+5% vs last week" // You can calculate this dynamically later
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
        />
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart */}
          <Card className="border border-border/50 shadow-sm bg-card rounded-xl">
            <CardHeader className="pb-2 border-b border-border/50 mb-4 text-start">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t("charts.activityTrend")}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {t("charts.activityTrendDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 ps-0">
              <OverviewChart data={data.chartData} />
            </CardContent>
          </Card>

          {/* Secondary Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <HourlyActivityChart
              data={data.hourlyData}
              title={t("charts.hourlyActivity")}
            />
            <TopWaitersChart
              data={data.waiterData}
              title={t("charts.topWaiters")}
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <BoostToggle initialMultiplier={data.multiplier} />

          <Card className="border border-border/50 shadow-sm bg-card rounded-xl h-fit">
            <CardHeader className="pb-2 border-b border-border/50 mb-4 text-start">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="w-4 h-4" />
                {t("programs.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.programs.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-background text-start hover:border-primary/20 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{p.name}</span>
                        <Badge
                          variant={p.active ? "default" : "secondary"}
                          className="text-[10px] h-5"
                        >
                          {p.active
                            ? t("programs.active")
                            : t("programs.inactive")}
                        </Badge>
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
                  <div className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded-lg">
                    {t("programs.empty")}
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
}: {
  title: string;
  value: number | string;
  icon: any;
  trend?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
      </div>
      {trend && (
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          {trend}
        </div>
      )}
    </div>
  );
}
