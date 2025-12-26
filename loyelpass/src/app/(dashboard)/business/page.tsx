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
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-xl bg-secondary animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Store className="h-6 w-6 text-muted-foreground/50" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Initializing Dashboard...
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {data.businessName}
            </h2>
            <Badge
              variant="outline"
              className="text-[10px] h-5 border-green-500/20 text-green-600 bg-green-500/10"
            >
              Live
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Overview of your loyalty performance.
          </p>
        </div>
        <CreateProgramModal />
      </div>

      {/* 2. Stats Grid (Engineered) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Clients */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-border/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Clients
            </span>
            <Users className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {data.totalClients}
            </span>
            <span className="text-xs font-medium text-emerald-500 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +12% <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Points */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-border/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Points Issued
            </span>
            <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
              {data.totalPoints.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Programs */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-border/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Campaigns
            </span>
            <Sparkles className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {data.programs.filter((p) => p.active).length}
            </span>
            <span className="text-sm text-muted-foreground">
              / {data.programs.length} total
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart Section */}
        <Card className="border border-border/50 shadow-sm bg-card rounded-xl">
          <CardHeader className="pb-2 border-b border-border/50 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Activity Trend
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Points redeemed (last 7 days)
                </CardDescription>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pl-0">
            <OverviewChart data={data.chartData} />
          </CardContent>
        </Card>

        {/* Programs List Section */}
        <Card className="border border-border/50 shadow-sm bg-card rounded-xl">
          <CardHeader className="pb-2 border-b border-border/50 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Active Programs
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Top performing campaigns
                </CardDescription>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.programs.slice(0, 4).map((program) => (
                <div
                  key={program.id}
                  className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-secondary/50 hover:border-border/50 transition-all cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Gift className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate max-w-[140px]">
                        {program.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Reward: {program.rewardValue}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-foreground tabular-nums">
                      {program.pointsThreshold}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] h-4 px-1.5 border-0 font-normal",
                        program.active
                          ? "bg-green-500/10 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {program.active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                </div>
              ))}

              {data.programs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border/50 rounded-lg bg-secondary/20">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <Gift className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No programs yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Create your first campaign to start.
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
