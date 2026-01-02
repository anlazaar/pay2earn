import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  Building2,
  Users,
  CreditCard,
  Server,
  ShieldCheck,
  Activity,
  Search,
  ArrowUpRight,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
} from "lucide-react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// --- REAL DATA FETCHING ---
async function getAdminData() {
  const start = performance.now();
  let status = "ONLINE";

  try {
    const [
      businessesCount,
      clientsCount,
      purchasesCount,
      recentBusinesses,
      logs,
    ] = await Promise.all([
      prisma.business.count(),
      prisma.client.count(),
      prisma.purchase.count(),
      prisma.business.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          owner: { select: { email: true, username: true } },
          _count: { select: { products: true, purchases: true } },
        },
      }),
      // Fetching the ACTUAL logs
      prisma.systemLog.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const end = performance.now();
    const latency = Math.round(end - start);

    return {
      stats: { businessesCount, clientsCount, purchasesCount },
      recentBusinesses,
      logs,
      latency,
      status,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      stats: { businessesCount: 0, clientsCount: 0, purchasesCount: 0 },
      recentBusinesses: [],
      logs: [],
      latency: 0,
      status: "ERROR",
    };
  }
}

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const data = await getAdminData();

  // Color logic based on REAL latency
  const latencyColor =
    data.latency < 50
      ? "text-emerald-500"
      : data.latency < 200
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-start">
      {/* 🟢 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-200/50 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Admin Console
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              System performance and global registry.
            </p>
          </div>
        </div>

        {/* 🟢 REAL SERVER STATUS BADGE (Fixed JSX Syntax) */}
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur-md shadow-sm">
          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span
                className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  data.status === "ONLINE" ? "bg-emerald-500" : "bg-red-500"
                )}
              ></span>
              <span
                className={cn(
                  "relative inline-flex rounded-full h-3 w-3",
                  data.status === "ONLINE" ? "bg-emerald-500" : "bg-red-500"
                )}
              ></span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                System
              </span>
              <span
                className={cn(
                  "text-xs font-bold tracking-tight",
                  data.status === "ONLINE"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600"
                )}
              >
                {data.status}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-200 dark:bg-white/10" />

          {/* Real Latency Meter */}
          <div className="flex flex-col items-end leading-none min-w-12.5">
            <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              <Activity className="w-3 h-3" /> Latency
            </div>
            <span
              className={cn("text-xs font-mono font-bold mt-0.5", latencyColor)}
            >
              {data.latency}ms
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Businesses"
          value={data.stats.businessesCount}
          icon={Building2}
          trend="+12%"
          color="blue"
        />
        <StatCard
          title="Total End Users"
          value={data.stats.clientsCount}
          icon={Users}
          trend="+84%"
          color="indigo"
        />
        <StatCard
          title="Global Transactions"
          value={data.stats.purchasesCount}
          icon={CreditCard}
          trend="+205%"
          color="emerald"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Businesses */}
        <Card className="lg:col-span-2 border border-zinc-200/50 dark:border-white/10 shadow-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-zinc-100 dark:border-white/5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  New Businesses
                </CardTitle>
                <CardDescription>Latest platform onboarding</CardDescription>
              </div>
              <div className="relative w-48 hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="h-9 pl-8 bg-background/50 border-transparent focus:bg-background rounded-full text-xs transition-all"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-white/5">
                <TableRow className="border-zinc-200 dark:border-white/5 hover:bg-transparent">
                  <TableHead className="ps-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Business
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Owner
                  </TableHead>
                  <TableHead className="text-end font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Stats
                  </TableHead>
                  <TableHead className="text-end pe-6 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentBusinesses.map((biz) => (
                  <TableRow
                    key={biz.id}
                    className="border-zinc-100 dark:border-white/5 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <TableCell className="ps-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold border border-zinc-200 dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                          {biz.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-foreground">
                            {biz.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-25">
                            {biz.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-medium text-foreground">
                          {biz.owner.username}
                        </p>
                        <p className="text-muted-foreground opacity-70">
                          {biz.owner.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-5 px-1.5 bg-zinc-100 dark:bg-white/10 text-muted-foreground border-zinc-200 dark:border-white/10"
                        >
                          {biz._count.products} Items
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-end pe-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 🟢 SYSTEM LOGS */}
        <div className="space-y-6">
          <Card className="h-full border border-zinc-200/50 dark:border-white/10 shadow-xl bg-zinc-50 dark:bg-zinc-950 rounded-3xl overflow-hidden flex flex-col transition-colors">
            <CardHeader className="bg-white/50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5 pb-3 pt-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-mono font-medium text-foreground">
                  SYSTEM_LOGS
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 font-mono text-[10px] space-y-4 overflow-y-auto max-h-100 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 relative bg-zinc-100/50 dark:bg-transparent">
              {data.logs.length === 0 && (
                <div className="text-muted-foreground text-center py-10 opacity-50 flex flex-col items-center">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  No logs found in DB.
                </div>
              )}

              {data.logs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-3 opacity-90 hover:opacity-100 transition-opacity"
                >
                  {/* Time */}
                  <span className="text-muted-foreground shrink-0 select-none w-12">
                    {new Date(log.createdAt).toLocaleTimeString([], {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>

                  <div className="flex flex-col gap-0.5">
                    {/* Level Indicator */}
                    <div className="flex items-center gap-1.5">
                      {log.level === "SUCCESS" && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      )}
                      {log.level === "INFO" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                      {log.level === "WARN" && (
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                      )}
                      {log.level === "ERROR" && (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}

                      <span
                        className={cn(
                          "font-bold",
                          log.level === "SUCCESS" &&
                            "text-emerald-600 dark:text-emerald-400",
                          log.level === "INFO" &&
                            "text-blue-600 dark:text-blue-400",
                          log.level === "WARN" &&
                            "text-amber-600 dark:text-amber-400",
                          log.level === "ERROR" &&
                            "text-red-600 dark:text-red-400"
                        )}
                      >
                        [{log.level}]
                      </span>
                    </div>

                    {/* Message */}
                    <span className="text-foreground/80 dark:text-zinc-300 wrap-break-word leading-tight">
                      {log.message}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>

            <div className="p-3 bg-white/50 dark:bg-white/5 border-t border-zinc-200 dark:border-white/5 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground">
                  Live Stream Connected
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- STAT CARD COMPONENT ---
function StatCard({ title, value, icon: Icon, trend, color }: any) {
  const colorStyles =
    {
      blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      indigo:
        "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      emerald:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    }[color as string] || "bg-zinc-100 text-zinc-600";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
            colorStyles
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-black tracking-tight text-foreground">
          {value.toLocaleString()}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          <ArrowUpRight className="h-3 w-3" />
          {trend}
        </div>
      </div>
    </div>
  );
}
