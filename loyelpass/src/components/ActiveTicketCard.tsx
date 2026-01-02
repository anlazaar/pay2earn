"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Ticket, Clock, CheckCircle2, ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function ActiveTicketCard({ ticket }: { ticket: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [isRedeemed, setIsRedeemed] = useState(false);

  // Generate QR when opening
  const showQr = async () => {
    const url = await QRCode.toDataURL(ticket.ticketId, {
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    setQrUrl(url);
    setIsOpen(true);
  };

  // 🟢 POLLING LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOpen && !isRedeemed) {
      // Check status every 2 seconds
      interval = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/tickets/status?ticketId=${ticket.ticketId}`
          );
          const data = await res.json();

          if (data.used) {
            setIsRedeemed(true);
            // Wait 1.5s to show success message, then close & refresh
            setTimeout(() => {
              setIsOpen(false);
              router.refresh();
            }, 1500);
          }
        } catch (error) {
          console.error("Polling error", error);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isOpen, isRedeemed, ticket.ticketId, router]);

  return (
    <>
      {/* Card Container - Glassmorphism & Gold Theme */}
      <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Subtle Gradient Glow on Hover */}
        <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {/* Icon Box */}
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Ticket className="h-6 w-6" />
            </div>

            {/* Text Info */}
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground tracking-tight">
                {ticket.program.rewardValue}
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {ticket.business.name}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={showQr}
            className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary-foreground transition-colors"
          >
            <ScanLine className="w-4 h-4 mr-2" />
            View QR
          </Button>
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex flex-col items-center sm:max-w-xs border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="items-center">
            <DialogTitle className="text-xl font-bold bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Redeem Reward
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Show this QR code to the staff
            </DialogDescription>
          </DialogHeader>

          {/* QR Container - Pure White for scanning contrast */}
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-border/50 mt-6 relative transition-all duration-500">
            {/* Success Overlay */}
            {isRedeemed ? (
              <div className="flex flex-col items-center justify-center w-56 h-56 animate-in zoom-in duration-300">
                <div className="rounded-full bg-green-100 p-3 mb-3">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <p className="text-foreground font-bold text-lg">Redeemed!</p>
                <p className="text-xs text-muted-foreground">
                  Enjoy your reward
                </p>
              </div>
            ) : (
              qrUrl && (
                <div className="relative">
                  <img
                    src={qrUrl}
                    alt="QR"
                    className="w-56 h-56 mix-blend-multiply"
                  />
                  {/* Decorative corner accents for scanner look */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary/50 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />
                </div>
              )
            )}
          </div>

          {!isRedeemed && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-6 bg-secondary/50 px-3 py-1 rounded-full border border-white/5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>
                Expires:{" "}
                {new Date(ticket.expiresAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
