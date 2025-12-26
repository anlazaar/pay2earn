import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import {
  Building2,
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
  MoreHorizontal,
  Server,
} from "lucide-react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

// Singleton pattern for Prisma
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function getStats() {
  const [businesses, clients, purchases] = await Promise.all([
    prisma.business.count(),
    prisma.client.count(),
    prisma.purchase.count(),
  ]);

  return { businesses, clients, purchases };
}

// 🟢 Engineered Stat Card
function StatCard({
  title,
  value,
  icon: Icon,
  delay,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  delay: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-border/80",
        delay
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
          {value.toLocaleString()}
        </h3>
        <div className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          <ArrowUpRight className="h-3 w-3" />
          <span>Active</span>
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const stats = await getStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      {/* 🟢 Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            System Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time platform metrics and global performance.
          </p>
        </div>

        {/* Technical Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs font-mono text-muted-foreground">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span>SYSTEM_ONLINE</span>
          <span className="text-border mx-1">|</span>
          <span>98ms</span>
        </div>
      </div>

      {/* 🟢 Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Businesses"
          value={stats.businesses}
          icon={Building2}
          delay="animate-in fade-in duration-500"
        />
        <StatCard
          title="Total Clients"
          value={stats.clients}
          icon={Users}
          delay="animate-in fade-in duration-500 delay-100"
        />
        <StatCard
          title="Transactions"
          value={stats.purchases}
          icon={CreditCard}
          delay="animate-in fade-in duration-500 delay-200"
        />
      </div>

      {/* 🟢 Activity Feed Placeholder (Wireframe Style) */}
      <div className="rounded-xl border border-border/50 bg-card shadow-sm flex flex-col">
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Live Activity
            </h3>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-lg bg-secondary/50 border border-dashed border-border flex items-center justify-center mb-4">
            <Server className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <h3 className="text-sm font-medium text-foreground">
            No recent alerts
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            The system is running smoothly. Detailed logs and anomalies will
            appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
