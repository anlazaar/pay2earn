import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import {
  Building2,
  Users,
  CreditCard,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

// Singleton pattern for Prisma to prevent connection exhaustion in dev
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

// Reusable Premium Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  delay,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: string;
  delay: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-card/60 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5",
        delay
      )}
    >
      {/* Background Gradient Glow */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold tracking-tight text-foreground font-mono">
              {value.toLocaleString()}
            </h3>
          </div>
          {/* Fake Trend Indicator for visuals */}
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-full border border-emerald-500/20">
            <ArrowUpRight className="h-3 w-3" />
            <span>Active</span>
          </div>
        </div>

        {/* Floating Icon Container */}
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-primary" />
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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 🟢 Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            System Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time platform metrics and performance.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/50 text-xs font-mono text-muted-foreground backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          SYSTEM OPERATIONAL
        </div>
      </div>

      {/* 🟢 Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Businesses"
          value={stats.businesses}
          icon={Building2}
          delay="animate-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-forwards"
        />
        <StatCard
          title="Total Clients"
          value={stats.clients}
          icon={Users}
          delay="animate-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-forwards"
        />
        <StatCard
          title="Transactions"
          value={stats.purchases}
          icon={CreditCard}
          delay="animate-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-forwards"
        />
      </div>

      {/* 🟢 Secondary Content Area (Placeholder for future charts) */}
      <div className="rounded-[2rem] border border-border/50 bg-secondary/10 p-8 flex flex-col items-center justify-center text-center min-h-[300px] animate-in fade-in delay-500">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Activity className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Activity Feed</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
          Detailed analytics and activity logs will appear here in the next
          update.
        </p>
      </div>
    </div>
  );
}
