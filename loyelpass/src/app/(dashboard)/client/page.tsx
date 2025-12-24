import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Trophy,
  Sparkles,
  Wallet,
  ArrowRight,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { ClientProgramCard } from "@/components/ClientProgramCard";
import { ActiveTicketCard } from "@/components/ActiveTicketCard";
import { cn } from "@/lib/utils";

const prisma = new PrismaClient();

async function getClientProgress(userId: string) {
  const client = await prisma.client.findUnique({
    where: { userId },
    include: {
      progress: {
        include: { program: { include: { business: true } } },
        orderBy: { lastUpdated: "desc" },
      },
    },
  });
  return client?.progress || [];
}

async function getActiveTickets(userId: string) {
  const client = await prisma.client.findUnique({ where: { userId } });
  if (!client) return [];

  return await prisma.redemptionTicket.findMany({
    where: {
      clientId: client.id,
      used: false,
      expiresAt: { gt: new Date() },
    },
    include: { program: true, business: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ClientDashboard() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return <div>Unauthorized</div>;

  const [progressList, activeTickets] = await Promise.all([
    getClientProgress(userId),
    getActiveTickets(userId),
  ]);

  const userName = session.user.name?.split(" ")[0] || "Member";

  return (
    <div className="min-h-screen pb-24 md:pb-10 animate-in fade-in duration-700">
      {/* 🟢 1. Header Section */}
      <div className="flex items-end justify-between mb-8 px-1">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Welcome Back
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hi, {userName}{" "}
            <span className="inline-block hover:animate-spin">👋</span>
          </h1>
        </div>

        <Link href="/client/rewards">
          <div className="group relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-background border border-primary/20 flex items-center justify-center shadow-sm hover:shadow-primary/20 transition-all duration-300">
            <Wallet className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />

            {/* Notification Dot if tickets exist */}
            {activeTickets.length > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-background animate-pulse" />
            )}
          </div>
        </Link>
      </div>

      {/* 🟢 2. Hero Card (Luxury Gold Gradient) */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-yellow-300 via-primary to-yellow-600 shadow-2xl shadow-yellow-500/20 mb-12 group">
        {/* Texture Overlay (Noise) */}
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>

        {/* Abstract Glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/30 blur-3xl mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black/10 blur-2xl"></div>

        <div className="relative p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/70 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" /> Priority Pass
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black drop-shadow-sm">
              Scan & Collect
            </h2>
            <p className="text-black/80 max-w-sm text-sm sm:text-base font-medium leading-relaxed">
              Present your QR code to the waiter to instantly collect points or
              redeem rewards.
            </p>
          </div>

          <Link href="/client/scan" className="w-full md:w-auto">
            <Button
              size="lg"
              className="w-full md:w-auto min-w-[180px] h-14 rounded-full gap-3 font-bold text-lg bg-black text-white hover:bg-black/80 hover:scale-105 border border-white/10 shadow-xl transition-all duration-300"
            >
              <QrCode className="h-5 w-5" />
              Open ID
            </Button>
          </Link>
        </div>
      </div>

      {/* 🟢 3. Active Rewards (Horizontal Scroll) */}
      {activeTickets.length > 0 && (
        <div className="mb-12 space-y-5 animate-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Ready to Redeem
              </h3>
            </div>
            <Link href="/client/rewards">
              <span className="text-xs font-bold text-primary hover:underline cursor-pointer">
                View All
              </span>
            </Link>
          </div>

          {/* Scroll Container */}
          <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory -mx-6 px-6 sm:mx-0 sm:px-0 scrollbar-hide">
            {activeTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="snap-center shrink-0 w-[85vw] sm:w-[350px]"
              >
                <ActiveTicketCard ticket={ticket} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🟢 4. Wallets Grid */}
      <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Ticket className="h-4 w-4 text-primary" />
            My Memberships
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 gap-1 text-muted-foreground hover:text-primary"
          >
            Sort by Recent <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {progressList.length === 0 ? (
            // Improved Empty State
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-primary/20 rounded-[2rem] bg-secondary/20 hover:bg-secondary/40 transition-colors">
              <div className="h-20 w-20 bg-background rounded-full flex items-center justify-center shadow-lg shadow-black/5 mb-6 ring-1 ring-border">
                <Trophy className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-2">
                No memberships yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                You haven't visited any partners yet. Scan a code at a location
                to start your first card!
              </p>
              <Link href="/client/scan">
                <Button
                  variant="outline"
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/10"
                >
                  Scan First Code
                </Button>
              </Link>
            </div>
          ) : (
            progressList.map((item) => (
              <ClientProgramCard
                key={item.id}
                program={item.program}
                progress={item}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
