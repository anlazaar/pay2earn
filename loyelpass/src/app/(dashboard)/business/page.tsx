import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
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
  Gift,
  CreditCard,
  Users,
  TrendingUp,
  Sparkles,
  Store,
} from "lucide-react";

const prisma = new PrismaClient();

function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

async function getDashboardData(userId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    include: {
      loyaltyPrograms: true,
    },
  });

  if (!business) return null;

  const distinctClients = await prisma.clientProgress.groupBy({
    by: ["clientId"],
    where: { program: { businessId: business.id } },
  });
  const totalClients = distinctClients.length;

  const purchases = await prisma.purchase.findMany({
    where: { businessId: business.id, redeemed: true },
    select: { pointsAwarded: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const totalPoints = purchases.reduce(
    (acc, curr) => acc + curr.pointsAwarded,
    0
  );

  const last7Days = getLast7Days();
  const rawDataMap = new Map<string, number>();

  purchases.forEach((p) => {
    const date = p.createdAt.toISOString().split("T")[0];
    const current = rawDataMap.get(date) || 0;
    rawDataMap.set(date, current + p.pointsAwarded);
  });

  const chartData = last7Days.map((date) => ({
    date: date,
    displayDate: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    points: rawDataMap.get(date) || 0,
  }));

  return {
    businessName: business.name,
    programs: business.loyaltyPrograms,
    totalClients,
    totalPoints,
    chartData,
  };
}

export default async function BusinessDashboard() {
  const session = await auth();
  const data = await getDashboardData(session?.user?.id as string);

  if (!data)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Store className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {data.businessName}
          </h2>
          <p className="text-muted-foreground mt-1 text-base">
            Here's your loyalty performance overview.
          </p>
        </div>
        <CreateProgramModal />
      </div>

      {/* 2. Stats Grid (Equal Widths) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Clients */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Total Clients
            </span>
            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground">
              {data.totalClients}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              unique
            </span>
          </div>
        </div>

        {/* Points */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-500/10 blur-2xl group-hover:bg-green-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Points Issued
            </span>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground">
              {data.totalPoints.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              pts
            </span>
          </div>
        </div>

        {/* Programs */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Active Campaigns
            </span>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground">
              {data.programs.filter((p) => p.active).length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              live
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Content (Fixed: Equal Width Split) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart Section */}
        <Card className="border-none shadow-lg bg-white/40 dark:bg-white/5 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 rounded-3xl h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Activity Trend
            </CardTitle>
            <CardDescription>Points redeemed last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart data={data.chartData} />
          </CardContent>
        </Card>

        {/* Programs List Section */}
        <Card className="border-none shadow-lg bg-white/40 dark:bg-white/5 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 rounded-3xl h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Active Programs
            </CardTitle>
            <CardDescription>Top performing campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.programs.slice(0, 4).map((program) => (
                <div
                  key={program.id}
                  className="group flex items-center justify-between p-3 rounded-2xl border border-transparent hover:border-border/50 hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                      <Gift className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {program.name}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground/80">
                        Reward: {program.rewardValue}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      {program.pointsThreshold}{" "}
                      <span className="text-[10px] text-muted-foreground uppercase">
                        pts
                      </span>
                    </p>
                    <Badge
                      variant={program.active ? "default" : "secondary"}
                      className="text-[10px] h-5 px-2"
                    >
                      {program.active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                </div>
              ))}

              {data.programs.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                    <Gift className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    No programs yet.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
