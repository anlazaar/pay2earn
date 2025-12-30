import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  QrCode,
  Wallet,
  Ticket,
  ChevronRight,
  CreditCard,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ClientProgramCard } from "@/components/ClientProgramCard";
import { ActiveTicketCard } from "@/components/ActiveTicketCard";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

// --- 1. OPTIMIZED DATA FETCHING ---
async function getDashboardData(userId: string) {
  // Fetch Client ID first (Single DB call)
  const client = await prisma.client.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!client) return null;

  // Run independent queries in parallel using the known clientId
  const [progress, tickets] = await Promise.all([
    // Fetch Programs
    prisma.clientProgress.findMany({
      where: { clientId: client.id },
      include: {
        program: {
          include: { business: { select: { name: true, tier: true } } },
        },
      },
      orderBy: { lastUpdated: "desc" },
    }),
    // Fetch Active Tickets
    prisma.redemptionTicket.findMany({
      where: {
        clientId: client.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        program: { select: { name: true, rewardValue: true } },
        business: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { progress, tickets };
}

// --- 2. MAIN PAGE COMPONENT ---
export default async function ClientDashboard() {
  const t = await getTranslations("ClientDashboard");
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    // Best Practice: Redirect instead of showing static text for unauthorized users
    redirect("/api/auth/signin");
  }

  const data = await getDashboardData(userId);

  // Handle case where user exists in Auth but not in Client DB (New User)
  if (!data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Setting up your profile...</h2>
        <p className="text-muted-foreground">Please refresh the page.</p>
      </div>
    );
  }

  const { progress, tickets } = data;
  const userName = session.user?.name?.split(" ")[0] || "Member";

  return (
    <div className="min-h-screen pb-24 md:pb-10 bg-background text-foreground animate-in fade-in duration-500">
      {/* SECTION A: Header & Stats */}
      <DashboardHeader userName={userName} ticketCount={tickets.length} t={t} />

      {/* SECTION B: Digital ID Card */}
      <DigitalPass t={t} />

      {/* SECTION C: Active Rewards Rail */}
      {tickets.length > 0 && (
        <section className="mb-10 space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {t("ready_redeem")}
            </h3>
            <Link
              href="/client/rewards"
              className="group flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {t("view_all")}
              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="snap-center shrink-0 w-[85vw] sm:w-[340px] transition-transform hover:scale-[1.01]"
              >
                <ActiveTicketCard ticket={ticket as any} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION D: Memberships Grid */}
      <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 delay-200">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" />
            {t("your_programs")}
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Add New Membership CTA */}
          <Link
            href="/client/scan"
            className="group relative flex flex-col items-center justify-center p-6 h-full min-h-[160px] rounded-xl border border-dashed border-border/60 hover:border-primary/50 bg-secondary/5 hover:bg-secondary/20 transition-all duration-300 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {t("add_membership")}
            </p>
          </Link>

          {/* Program Cards */}
          {progress.map((item) => (
            <ClientProgramCard
              key={item.id}
              program={item.program as any}
              progress={item as any}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// --- 3. SUB-COMPONENTS (Clean & Isolated) ---

function DashboardHeader({
  userName,
  ticketCount,
  t,
}: {
  userName: string;
  ticketCount: number;
  t: any;
}) {
  return (
    <div className="flex items-center justify-between mb-8 px-1 pt-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("hello_user", { name: userName })}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.rich("active_rewards_text", {
            count: ticketCount,
            bold: (chunks: any) => (
              <span
                className={cn(
                  "font-mono font-bold",
                  ticketCount > 0 ? "text-primary" : ""
                )}
              >
                {chunks}
              </span>
            ),
          })}
        </p>
      </div>

      <Link href="/client/rewards">
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-full border-border/60 bg-background shadow-sm hover:bg-secondary transition-all"
        >
          <Wallet className="h-5 w-5 text-foreground/80" />
          {ticketCount > 0 && (
            <span className="absolute top-0 end-0 -mt-1 -me-1 h-3 w-3 rounded-full bg-primary ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </Link>
    </div>
  );
}

function DigitalPass({ t }: { t: any }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0F1115] border border-white/5 shadow-2xl mb-12 group select-none">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 end-0 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
      <div className="absolute bottom-0 start-0 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full opacity-30" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] pointer-events-none" />

      {/* Card Content */}
      <div className="relative p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-8 z-10">
        <div className="flex flex-col justify-between h-full space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-10 rounded bg-white/10 flex items-center justify-center border border-white/5 backdrop-blur-md shadow-inner">
              <CreditCard className="w-4 h-4 text-white/90" />
            </div>
            <span className="text-[10px] font-mono font-medium text-white/50 uppercase tracking-[0.2em]">
              {t("universal_pass")}
            </span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white mb-2 drop-shadow-lg">
              {t("scan_id")}
            </h2>
            <p className="text-white/40 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {t("tap_reveal")}
            </p>
          </div>
        </div>

        <div className="self-center md:self-end w-full md:w-auto">
          <Link href="/client/scan" className="block w-full">
            <Button className="w-full md:w-auto h-12 px-6 rounded-xl bg-white text-black hover:bg-white/90 font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all transform active:scale-95 flex items-center justify-center gap-2">
              <QrCode className="h-4 w-4" />
              {t("open_scanner")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
