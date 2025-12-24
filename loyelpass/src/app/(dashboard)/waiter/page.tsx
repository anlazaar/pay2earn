"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCcw,
  ScanLine,
  CheckCircle2,
  XCircle,
  Loader2,
  Receipt,
  QrCode,
  ArrowLeftRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function WaiterDashboard() {
  const [mounted, setMounted] = useState(false);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("give-points");

  // Tab 1: New Sale
  const [amount, setAmount] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loadingGen, setLoadingGen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tab 2: Scan Reward
  const [scanStatus, setScanStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Focus input on mount
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // --- LOGIC: GENERATE ---
  const generateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setLoadingGen(true);
    setQrImage(null);

    try {
      const res = await fetch("/api/purchases/generate", {
        method: "POST",
        body: JSON.stringify({ amount: parseFloat(amount), products: [] }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      // Generate High-Res QR
      const qrDataUrl = await QRCode.toDataURL(data.qrData, {
        width: 600,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrImage(qrDataUrl);
    } catch (err) {
      alert("Error generating code");
    } finally {
      setLoadingGen(false);
    }
  };

  const resetGen = () => {
    setAmount("");
    setQrImage(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // --- LOGIC: SCAN ---
  const handleScanTicket = async (text: string) => {
    if (scanStatus !== "idle") return;

    if (text) {
      if (typeof navigator !== "undefined" && navigator.vibrate)
        navigator.vibrate(50);
      setScanStatus("processing");

      try {
        const res = await fetch("/api/waiters/validate-reward", {
          method: "POST",
          body: JSON.stringify({ qrData: text }),
        });

        const data = await res.json();

        if (res.ok) {
          setScanStatus("success");
          setScanResult(data);
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate([100, 50, 100]);
        } else {
          setScanStatus("error");
          setScanResult({ error: data.error });
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate(200);
        }
      } catch (err) {
        setScanStatus("error");
        setScanResult({ error: "Connection failed" });
      }
    }
  };

  const resetScan = () => {
    setScanStatus("idle");
    setScanResult(null);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-md mx-auto py-4 animate-in fade-in duration-500 px-4 min-h-screen flex flex-col justify-center">
      {/* 🟢 Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-secondary/50 rounded-2xl mb-3 shadow-inner">
          <Zap className="w-6 h-6 text-primary fill-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          POS Terminal
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Ready for action
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-8"
      >
        {/* 🟢 Tabs List (Glass Segmented Control) */}
        <TabsList className="bg-background/40 backdrop-blur-md p-1.5 rounded-full grid grid-cols-2 gap-2 w-full h-14 border border-border/50 shadow-sm relative overflow-hidden">
          <TabsTrigger
            value="give-points"
            className="rounded-full h-full text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300 z-10"
          >
            <Receipt className="w-4 h-4 mr-2" />
            New Sale
          </TabsTrigger>
          <TabsTrigger
            value="redeem-reward"
            className="rounded-full h-full text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300 z-10"
          >
            <ScanLine className="w-4 h-4 mr-2" />
            Validate
          </TabsTrigger>
        </TabsList>

        {/* 🟢 TAB 1: NEW SALE */}
        <TabsContent value="give-points" className="mt-0 outline-none">
          <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl ring-1 ring-white/10 overflow-hidden rounded-[2rem]">
            <CardContent className="p-0">
              {!qrImage ? (
                <form
                  onSubmit={generateCode}
                  className="flex flex-col min-h-[420px]"
                >
                  {/* Display Screen */}
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-transparent to-black/5">
                    <label className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
                      Total Bill Amount
                    </label>

                    <div className="flex items-center justify-center gap-1 w-full relative group">
                      <span className="text-4xl md:text-5xl font-medium text-muted-foreground self-center mt-2 group-focus-within:text-primary transition-colors">
                        $
                      </span>
                      <Input
                        ref={inputRef}
                        type="number"
                        placeholder="0.00"
                        className="text-6xl md:text-7xl font-bold text-center border-none shadow-none focus-visible:ring-0 p-0 h-auto placeholder:text-muted/10 bg-transparent w-full max-w-[240px] text-foreground caret-primary selection:bg-primary/30"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        step="0.01"
                        min="0.01"
                        inputMode="decimal"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* Keypad / Actions Area */}
                  <div className="bg-muted/10 p-6 border-t border-border/30">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-16 text-lg font-bold rounded-2xl shadow-[0_0_20px_-5px_var(--primary)] bg-gradient-to-r from-yellow-500 to-primary text-black hover:opacity-90 hover:scale-[1.02] transition-all active:scale-[0.98]"
                      disabled={loadingGen || !amount}
                    >
                      {loadingGen ? (
                        <Loader2 className="animate-spin mr-2 h-6 w-6" />
                      ) : (
                        <QrCode className="mr-2 h-6 w-6" />
                      )}
                      {loadingGen ? "Processing..." : "Generate Code"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col min-h-[420px] animate-in zoom-in duration-300">
                  {/* Receipt Header */}
                  <div className="bg-primary p-8 text-black text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-20"></div>
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-black drop-shadow-sm" />
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      Code Ready
                    </h3>
                    <p className="text-black/70 font-medium text-sm">
                      Present to customer
                    </p>
                  </div>

                  {/* Receipt Body */}
                  <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 relative">
                    {/* Jagged Edge Top */}
                    <div
                      className="absolute top-0 left-0 w-full h-3 bg-primary"
                      style={{
                        clipPath:
                          "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)",
                      }}
                    ></div>

                    <div className="p-2 bg-white rounded-lg mb-4">
                      <img
                        src={qrImage}
                        alt="QR"
                        className="w-56 h-56 mix-blend-multiply"
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">
                        Sale Value
                      </p>
                      <p className="text-4xl font-black tracking-tighter text-black">
                        ${parseFloat(amount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-6 bg-white border-t border-dashed border-gray-200">
                    <Button
                      variant="outline"
                      onClick={resetGen}
                      className="w-full h-14 text-base font-bold rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-900 hover:bg-gray-100 hover:border-gray-200"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Next Customer
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🟢 TAB 2: VALIDATE REWARD */}
        <TabsContent
          value="redeem-reward"
          className="mt-0 focus-visible:ring-0 outline-none"
        >
          <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem] bg-black ring-4 ring-black/10">
            <CardContent className="p-0">
              <div className="relative h-[520px] w-full overflow-hidden bg-black">
                {/* Scanner Component */}
                <div className="absolute inset-0 z-0">
                  {activeTab === "redeem-reward" && (
                    <Scanner
                      onScan={(res) =>
                        res[0] && handleScanTicket(res[0].rawValue)
                      }
                      styles={{
                        container: { height: "100%", width: "100%" },
                        video: { objectFit: "cover", height: "100%" },
                      }}
                      components={{ audio: false, torch: true }}
                    />
                  )}
                </div>

                {/* IDLE OVERLAY */}
                {scanStatus === "idle" && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                    {/* Viewfinder corners */}
                    <div className="w-64 h-64 relative">
                      <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-3xl shadow-[0_0_10px_var(--primary)]"></div>
                      <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-3xl shadow-[0_0_10px_var(--primary)]"></div>
                      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-3xl shadow-[0_0_10px_var(--primary)]"></div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-3xl shadow-[0_0_10px_var(--primary)]"></div>

                      {/* Scanning Line */}
                      <div className="absolute top-0 left-4 right-4 h-0.5 bg-primary/80 shadow-[0_0_20px_var(--primary)] animate-scan-down"></div>
                    </div>
                    <p className="mt-12 text-white font-semibold bg-black/60 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-xl">
                      Align Ticket QR
                    </p>
                  </div>
                )}

                {/* PROCESSING OVERLAY */}
                {scanStatus === "processing" && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center">
                      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                      <p className="text-white font-bold text-lg tracking-wide">
                        Verifying...
                      </p>
                    </div>
                  </div>
                )}

                {/* SUCCESS OVERLAY */}
                {scanStatus === "success" && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-emerald-600 animate-in zoom-in duration-300 p-8 text-center">
                    <div className="bg-white p-5 rounded-full mb-6 shadow-2xl shadow-black/20 animate-bounce">
                      <CheckCircle2 className="h-16 w-16 text-emerald-600" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tight">
                      APPROVED
                    </h3>

                    <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl w-full border border-white/10 mb-8 shadow-inner">
                      <p className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">
                        Reward to Provide
                      </p>
                      <p className="text-2xl font-bold text-white mb-4 leading-tight">
                        {scanResult?.rewardName}
                      </p>
                      <div className="h-px bg-white/20 w-full mb-3" />
                      <div className="flex justify-between items-center text-white/90 text-sm font-medium">
                        <span>Client</span>
                        <span>{scanResult?.clientName}</span>
                      </div>
                    </div>

                    <Button
                      onClick={resetScan}
                      className="w-full bg-white text-emerald-800 hover:bg-white/90 font-bold h-14 rounded-2xl shadow-lg"
                    >
                      Scan Next
                    </Button>
                  </div>
                )}

                {/* ERROR OVERLAY */}
                {scanStatus === "error" && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-rose-600 animate-in slide-in-from-bottom-10 duration-300 p-8 text-center">
                    <div className="bg-white p-5 rounded-full mb-6 shadow-2xl shadow-black/20">
                      <XCircle className="h-16 w-16 text-rose-600" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                      DECLINED
                    </h3>
                    <p className="text-white/90 font-medium mb-10 text-lg max-w-[250px] mx-auto leading-relaxed">
                      {scanResult?.error || "Invalid Code"}
                    </p>

                    <Button
                      onClick={resetScan}
                      className="w-full bg-white text-rose-700 hover:bg-white/90 font-bold h-14 rounded-2xl shadow-lg"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <style jsx global>{`
        @keyframes scan-down {
          0% {
            top: 10%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 90%;
            opacity: 0;
          }
        }
        .animate-scan-down {
          animation: scan-down 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
