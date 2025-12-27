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
import { Users, Store, Layers } from "lucide-react";
import { BoostToggle } from "./BoostToggle";
import { ProgramActions } from "@/components/ProgramActions";
import { getLocale, getTranslations } from "next-intl/server";

function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

async function getDashboardData(userId: string, locale: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    include: {
      loyaltyPrograms: true,
    },
  });

  if (!business) return null;

  const multiplier = business.pointsMultiplier || 1.0;

  const distinctClients = await prisma.clientProgress.groupBy({
    by: ["clientId"],
    where: { program: { businessId: business.id } },
  });

  const purchases = await prisma.purchase.findMany({
    where: { businessId: business.id, redeemed: true },
    include: {
      waiter: { select: { username: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const totalClients = distinctClients.length;
  const totalPoints = purchases.reduce(
    (acc, curr) => acc + curr.pointsAwarded,
    0
  );

  // Area Chart with Localized Dates
  const last7Days = getLast7Days();
  const rawDataMap = new Map<string, number>();
  purchases.forEach((p) => {
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

  // Hourly Activity
  const hoursArray = new Array(24).fill(0);
  purchases.forEach((p) => {
    const hour = p.createdAt.getHours();
    hoursArray[hour]++;
  });

  const hourlyData = hoursArray
    .map((count, i) => ({
      hour: `${i}:00`,
      count,
    }))
    .filter((_, i) => i >= 8 && i <= 23);

  // Top Waiters
  const waiterMap = new Map<string, number>();
  purchases.forEach((p) => {
    const name = p.waiter?.username || "Unknown";
    const current = waiterMap.get(name) || 0;
    waiterMap.set(name, current + Number(p.totalAmount));
  });

  const waiterData = Array.from(waiterMap.entries())
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    businessName: business.name,
    programs: business.loyaltyPrograms,
    totalClients,
    totalPoints,
    chartData,
    hourlyData,
    waiterData,
    multiplier,
  };
}

export default async function BusinessDashboard() {
  const locale = await getLocale();
  const t = await getTranslations("BusinessDashboard");
  const session = await auth();
  const data = await getDashboardData(session?.user?.id as string, locale);

  if (!data)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="h-12 w-12 rounded-xl bg-secondary animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Store className="h-6 w-6 text-muted-foreground/50" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {t("loading")}
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 text-start">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {data.businessName}
          </h2>
        </div>
        <CreateProgramModal />
      </div>

      {/* 2. Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Clients Card */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("stats.totalClients")}
            </span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {data.totalClients}
          </span>
        </div>

        {/* Points Card */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("stats.totalPoints")}
            </span>
            <Store className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {data.totalPoints}
          </span>
        </div>

        {/* Programs Count Card */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("stats.activePrograms")}
            </span>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {data.programs.filter((p) => p.active).length}
          </span>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/50 shadow-sm bg-card rounded-xl">
            <CardHeader className="pb-2 border-b border-border/50 mb-4 text-start">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
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

        <div className="space-y-6">
          <BoostToggle initialMultiplier={data.multiplier} />

          <Card className="border border-border/50 shadow-sm bg-card rounded-xl h-fit">
            <CardHeader className="pb-2 border-b border-border/50 mb-4 text-start">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {t("programs.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.programs.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-background text-start"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.name}</span>
                        <Badge variant={p.active ? "default" : "secondary"}>
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
                  <div className="text-center text-sm text-muted-foreground py-4">
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
