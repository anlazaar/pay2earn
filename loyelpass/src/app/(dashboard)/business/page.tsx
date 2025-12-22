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
import { Gift, CreditCard, Users, TrendingUp } from "lucide-react";

const prisma = new PrismaClient();

// 🟢 Helper to get the last 7 days dates formatted as YYYY-MM-DD
function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Promise((resolve) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      resolve(date.toISOString().split("T")[0]);
    });
    // @ts-ignore - simplistic approach for non-async demo
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

  // 1. Total Unique Clients
  const distinctClients = await prisma.clientProgress.groupBy({
    by: ["clientId"],
    where: {
      program: {
        businessId: business.id,
      },
    },
  });
  const totalClients = distinctClients.length;

  // 2. Points Issued (ONLY REDEEMED)
  // 🔴 FIX: Added `redeemed: true` to ignore test codes that weren't scanned
  const purchases = await prisma.purchase.findMany({
    where: {
      businessId: business.id,
      redeemed: true,
    },
    select: { pointsAwarded: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const totalPoints = purchases.reduce(
    (acc, curr) => acc + curr.pointsAwarded,
    0
  );

  // 3. Chart Data (Fill in missing days)
  const last7Days = getLast7Days(); // ["2025-12-16", "2025-12-17", ...]

  // Group actual data by date
  const rawDataMap = new Map<string, number>();
  purchases.forEach((p) => {
    const date = p.createdAt.toISOString().split("T")[0];
    const current = rawDataMap.get(date) || 0;
    rawDataMap.set(date, current + p.pointsAwarded);
  });

  // Merge with 7-day timeline (fill 0s)
  const chartData = last7Days.map((date) => ({
    date: date, // Keep YYYY-MM-DD for sorting
    displayDate: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }), // "Dec 22"
    points: rawDataMap.get(date) || 0,
  }));

  return {
    programs: business.loyaltyPrograms,
    totalClients,
    totalPoints,
    chartData,
  };
}

export default async function BusinessDashboard() {
  const session = await auth();
  const data = await getDashboardData(session?.user?.id as string);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <CreateProgramModal />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Total Clients
            </span>
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{data.totalClients}</span>
            <span className="text-xs text-muted-foreground">unique</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Points Claimed
            </span>
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{data.totalPoints}</span>
            <span className="text-xs text-muted-foreground">lifetime</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Active Programs
            </span>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {data.programs.filter((p) => p.active).length}
            </span>
            <span className="text-xs text-muted-foreground">programs</span>
          </div>
        </div>
      </div>

      {/* Charts & List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4 border-none shadow-md bg-card/40">
          <CardHeader>
            <CardTitle>Points Activity</CardTitle>
            <CardDescription>
              Redeemed points over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* 🔴 Pass the processed chart data */}
            <OverviewChart data={data.chartData} />
          </CardContent>
        </Card>

        {/* Programs List */}
        <Card className="col-span-3 border-none shadow-md bg-card/40">
          <CardHeader>
            <CardTitle>Active Programs</CardTitle>
            <CardDescription>Your current loyalty campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.programs.slice(0, 3).map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-3 bg-background rounded-xl border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Gift className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{program.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {program.rewardValue}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {program.pointsThreshold} pts
                    </p>
                    <Badge variant="secondary" className="text-[10px]">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
              {data.programs.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No programs yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
