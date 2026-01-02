"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Gift,
  Loader2,
  Sparkles,
  Store,
  Ticket,
  Lock,
  PartyPopper,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  program: {
    id: string;
    name: string;
    pointsThreshold: number;
    business: { name: string };
  };
  progress: {
    pointsAccumulated: number;
  };
}

export function ClientProgramCard({ program, progress }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Calculations
  const percentage = Math.min(
    (progress.pointsAccumulated / program.pointsThreshold) * 100,
    100
  );
  const canRedeem = progress.pointsAccumulated >= program.pointsThreshold;
  const pointsRemaining = program.pointsThreshold - progress.pointsAccumulated;

  const handleClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/client/generate-ticket", {
        method: "POST",
        body: JSON.stringify({ programId: program.id }),
      });

      const data = await res.json();

      if (res.ok) {
        // Generate a high-contrast QR for scanning
        const url = await QRCode.toDataURL(data.ticketId, {
          width: 400,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrUrl(url);
        setIsOpen(true);
        router.refresh();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Failed to generate ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🟢 Card Container */}
      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-4xl border transition-all duration-500",
          "bg-card/60 backdrop-blur-xl text-card-foreground shadow-sm",
          canRedeem
            ? "border-primary/50 shadow-2xl shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-1"
            : "border-border/60 hover:border-border hover:shadow-md"
        )}
      >
        {/* Decorative Gradients */}
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 pointer-events-none",
            canRedeem
              ? "from-primary/10 via-transparent to-transparent opacity-100"
              : ""
          )}
        />

        {/* Unlock Texture Pattern (Only when redeemable) */}
        {canRedeem && (
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] mix-blend-overlay" />
        )}

        <div className="relative p-6 sm:p-7 flex flex-col h-full justify-between gap-6 z-10">
          {/* 1. Header: Business & Status */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-background/50 border border-border/50 flex items-center justify-center shadow-sm">
                <Store className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                {program.business.name}
              </span>
            </div>

            {canRedeem && (
              <Badge className="bg-linear-to-r from-primary to-yellow-500 text-black border-0 px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20 animate-pulse">
                Reward Unlocked
              </Badge>
            )}
          </div>

          {/* 2. Main Content: Points */}
          <div>
            <h3 className="text-lg font-bold tracking-tight mb-5 leading-snug text-foreground/90 min-h-12">
              {program.name}
            </h3>

            <div className="flex items-end justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Accumulated
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-5xl font-mono font-bold tracking-tighter",
                      canRedeem
                        ? "text-primary drop-shadow-sm"
                        : "text-foreground"
                    )}
                  >
                    {progress.pointsAccumulated}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground/60">
                    / {program.pointsThreshold}
                  </span>
                </div>
              </div>

              {/* Icon Bubble */}
              <div
                className={cn(
                  "h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-inner border",
                  canRedeem
                    ? "bg-primary text-black border-primary scale-110 shadow-primary/50"
                    : "bg-secondary/50 border-border text-muted-foreground"
                )}
              >
                {canRedeem ? (
                  <Sparkles className="h-6 w-6 animate-pulse" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </div>
            </div>

            {/* 3. Progress Bar */}
            <div className="space-y-2.5">
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden relative shadow-inner">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.2)]",
                    canRedeem
                      ? "bg-linear-to-r from-primary via-yellow-300 to-primary"
                      : "bg-foreground/20 dark:bg-foreground/40"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {!canRedeem && (
                <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Action Footer */}
          <div className="pt-2">
            {canRedeem ? (
              <Button
                className="w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_20px_-5px_var(--primary)] bg-linear-to-r from-primary to-yellow-600 hover:from-yellow-400 hover:to-primary border border-white/20 transition-all active:scale-[0.98]"
                onClick={handleClaim}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : (
                  <>
                    <Ticket className="mr-2 h-5 w-5" />
                    Reveal Ticket
                  </>
                )}
              </Button>
            ) : (
              <div className="h-12 flex items-center justify-center gap-2 rounded-xl bg-secondary/30 border border-border/50 text-xs text-muted-foreground font-medium select-none">
                <span className="opacity-50">
                  Earn {pointsRemaining} more pts to unlock
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🟢 GOLDEN TICKET MODAL */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm p-0 overflow-hidden border-none bg-transparent shadow-none">
          <div className="relative flex flex-col items-center">
            {/* Top Half: Gold Header */}
            <div className="w-full bg-linear-to-br from-yellow-300 via-primary to-yellow-600 p-8 text-black relative overflow-hidden rounded-t-4xl">
              {/* Noise Texture */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')] mix-blend-overlay"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-black/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-black/10">
                  <Gift className="h-7 w-7 text-black drop-shadow-sm" />
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight uppercase">
                  Reward Unlocked
                </DialogTitle>
                <DialogDescription className="text-black/70 mt-1 font-bold text-xs uppercase tracking-widest">
                  Scan this code at the counter
                </DialogDescription>
              </div>
            </div>

            {/* Jagged Edge Connector */}
            <div className="w-full h-4 relative z-10 -mt-px">
              <div
                className="w-full h-full bg-white dark:bg-zinc-900"
                style={{
                  clipPath:
                    "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)",
                }}
              ></div>
            </div>

            {/* Bottom Half: QR Code */}
            <div className="w-full bg-white dark:bg-zinc-900 p-8 pb-10 flex flex-col items-center gap-6 rounded-b-4xl">
              <div className="p-3 bg-white rounded-xl shadow-lg border border-black/5">
                {qrUrl && (
                  <img
                    src={qrUrl}
                    alt="Reward Ticket"
                    className="w-48 h-48 mix-blend-multiply opacity-90"
                  />
                )}
              </div>

              <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-700"></div>

              <div className="flex items-center gap-3 px-5 py-2.5 bg-red-50 dark:bg-red-900/10 rounded-full border border-red-100 dark:border-red-900/20">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase tracking-widest">
                  One-time use only
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
