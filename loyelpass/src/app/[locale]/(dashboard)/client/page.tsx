import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Wallet,
  ArrowRight,
  Ticket,
  ChevronRight,
  CreditCard,
  Plus,
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
    <div className="min-h-screen pb-24 md:pb-10 bg-background text-foreground animate-in fade-in duration-500">
      {/* 🟢 1. Modern Header */}
      <div className="flex items-center justify-between mb-8 px-1 pt-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Hello, {userName}
          </h1>
          <p className="text-sm text-muted-foreground">
            You have{" "}
            <span className="text-primary font-mono font-medium">
              {activeTickets.length}
            </span>{" "}
            active rewards.
          </p>
        </div>

        <Link href="/client/rewards">
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full border-border/60 bg-secondary/50 hover:bg-secondary"
          >
            <Wallet className="h-5 w-5 text-foreground" />
            {activeTickets.length > 0 && (
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
            )}
          </Button>
        </Link>
      </div>

      {/* 🟢 2. The "Engineered" Identity Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B0C0E] border border-white/10 shadow-2xl mb-12 group transition-transform active:scale-[0.98]">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-900/20 blur-[60px] rounded-full opacity-50" />

        {/* Card Content */}
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-8 z-10">
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-white/10 flex items-center justify-center border border-white/5">
                <CreditCard className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
                Universal Pass
              </span>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tighter text-white mb-1">
                Scan ID
              </h2>
              <p className="text-white/50 text-sm font-medium">
                Tap to reveal your unique QR code
              </p>
            </div>
          </div>

          <Link
            href="/client/scan"
            className="w-full md:w-auto self-center md:self-end"
          >
            <Button className="w-full md:w-auto h-12 rounded-lg bg-white text-black hover:bg-gray-100 font-semibold shadow-lg shadow-white/5 transition-all flex items-center justify-center gap-2">
              <QrCode className="h-4 w-4" />
              Open Scanner
            </Button>
          </Link>
        </div>
      </div>

      {/* 🟢 3. Active Rewards (Horizontal Scroll) */}
      {activeTickets.length > 0 && (
        <div className="mb-10 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Ready to Redeem
            </h3>
            <Link
              href="/client/rewards"
              className="group flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
            >
              View all{" "}
              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {activeTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="snap-center shrink-0 w-[85vw] sm:w-[320px]"
              >
                <ActiveTicketCard ticket={ticket} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🟢 4. Memberships Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" />
            Your Programs
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* New Program Button */}
          <Link
            href="/client/scan"
            className="group relative flex flex-col items-center justify-center p-6 h-full min-h-[160px] rounded-xl border border-dashed border-border hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
              Add Membership
            </p>
          </Link>

          {progressList.map((item) => (
            <ClientProgramCard
              key={item.id}
              program={item.program}
              progress={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
