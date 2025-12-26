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
import {
  Gift,
  Users,
  TrendingUp,
  Sparkles,
  Store,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BoostToggle } from "./BoostToggle";

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

  const multiplier = business.pointsMultiplier || 1.0;

  // 1. Fetch Stats
  const distinctClients = await prisma.clientProgress.groupBy({
    by: ["clientId"],
    where: { program: { businessId: business.id } },
  });

  // 🟢 UPDATE: Fetch transactions with Waiter details for the charts
  const purchases = await prisma.purchase.findMany({
    where: { businessId: business.id, redeemed: true },
    include: {
      waiter: { select: { username: true } }, // Get waiter name
    },
    orderBy: { createdAt: "asc" },
  });

  // Calculate Totals
  const totalClients = distinctClients.length;
  const totalPoints = purchases.reduce(
    (acc, curr) => acc + curr.pointsAwarded,
    0
  );

  // --- DATA PROCESSING FOR CHARTS ---

  // A. Area Chart (Last 7 Days) - Existing Logic
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

  // B. Hourly Activity (New)
  const hoursArray = new Array(24).fill(0);
  purchases.forEach((p) => {
    // Determine hour (0-23). Note: This uses server time.
    // Ideally, convert to business timezone.
    const hour = p.createdAt.getHours();
    hoursArray[hour]++;
  });

  // Format for Chart (only showing 10am to 10pm usually matters, but let's show all or filtered)
  const hourlyData = hoursArray
    .map((count, i) => ({
      hour: `${i}:00`,
      count,
    }))
    .filter((_, i) => i >= 8 && i <= 23); // Showing 8AM to 11PM for cleanliness

  // C. Top Waiters (New)
  const waiterMap = new Map<string, number>();
  purchases.forEach((p) => {
    const name = p.waiter?.username || "Unknown";
    const current = waiterMap.get(name) || 0;
    waiterMap.set(name, current + Number(p.totalAmount));
  });

  // Sort by revenue descending and take top 5
  const waiterData = Array.from(waiterMap.entries())
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    businessName: business.name,
    programs: business.loyaltyPrograms,
    totalClients,
    totalPoints,
    chartData, // Area Chart
    hourlyData, // New Bar Chart
    waiterData, // New Horizontal Bar Chart
    multiplier,
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
      {/* 1. Header (Keep existing) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          {/* ... existing header code ... */}
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {data.businessName}
          </h2>
          {/* ... */}
        </div>
        <CreateProgramModal />
      </div>

      {/* 2. Stats Grid (Keep existing) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* ... existing stats cards for Clients, Points, Programs ... */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
          {/* Example Card Content */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Clients
            </span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-3xl font-semibold tracking-tight">
            {data.totalClients}
          </span>
        </div>
        {/* Repeat for other 2 cards... */}
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: Main Chart (Takes 2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Area Chart */}
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
              </div>
            </CardHeader>
            <CardContent className="pt-2 pl-0">
              <OverviewChart data={data.chartData} />
            </CardContent>
          </Card>

          {/* 🟢 NEW: Secondary Charts Grid (Nested inside left column) */}
          <div className="grid gap-6 md:grid-cols-2">
            <HourlyActivityChart data={data.hourlyData} />
            <TopWaitersChart data={data.waiterData} />
          </div>
        </div>

        {/* RIGHT COLUMN: Boost Toggle + Programs List (Takes 1/3 width) */}
        <div className="space-y-6">
          <BoostToggle initialMultiplier={data.multiplier} />

          {/* Programs List (Keep existing) */}
          <Card className="border border-border/50 shadow-sm bg-card rounded-xl h-fit">
            <CardHeader className="pb-2 border-b border-border/50 mb-4">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Active Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* ... existing programs map logic ... */}
              <div className="space-y-3">
                {data.programs.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between p-2 border rounded text-sm"
                  >
                    <span>{p.name}</span>
                    <Badge variant="outline">
                      {p.active ? "Active" : "Off"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
