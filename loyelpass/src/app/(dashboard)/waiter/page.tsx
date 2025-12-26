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
  Zap,
  Check,
  AlertCircle,
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

      const qrDataUrl = await QRCode.toDataURL(data.qrData, {
        width: 600,
        margin: 1,
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
    <div className="max-w-md mx-auto py-6 px-4 min-h-screen flex flex-col animate-in fade-in duration-500">
      {/* 🟢 Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Terminal</h1>
          <p className="text-xs text-muted-foreground">Connected as Staff</p>
        </div>
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Zap className="w-4 h-4" />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex-1 flex flex-col"
      >
        {/* 🟢 Tabs (Segmented Control) */}
        <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1 mb-6 rounded-lg border border-border/50">
          <TabsTrigger
            value="give-points"
            className="rounded-md text-sm font-medium transition-all"
          >
            <Receipt className="w-4 h-4 mr-2" />
            New Sale
          </TabsTrigger>
          <TabsTrigger
            value="redeem-reward"
            className="rounded-md text-sm font-medium transition-all"
          >
            <ScanLine className="w-4 h-4 mr-2" />
            Validate
          </TabsTrigger>
        </TabsList>

        {/* 🟢 TAB 1: NEW SALE */}
        <TabsContent value="give-points" className="flex-1 outline-none">
          <Card className="h-[500px] border border-border/50 shadow-sm bg-card rounded-xl overflow-hidden flex flex-col">
            <CardContent className="p-0 flex-1 flex flex-col">
              {!qrImage ? (
                <form onSubmit={generateCode} className="flex-1 flex flex-col">
                  {/* Amount Display */}
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-secondary/10">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">
                      Enter Amount
                    </label>

                    <div className="flex items-baseline justify-center gap-1 w-full">
                      <Input
                        ref={inputRef}
                        type="number"
                        placeholder="0"
                        className="text-6xl font-mono font-medium text-center border-none shadow-none focus-visible:ring-0 p-0 h-auto placeholder:text-muted/20 bg-transparent w-full max-w-[200px] text-foreground caret-primary"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        step="0.01"
                        min="0.01"
                        inputMode="decimal"
                        autoComplete="off"
                      />
                      <span className="text-xl font-medium text-muted-foreground self-end mb-2">
                        MAD
                      </span>
                    </div>
                  </div>

                  {/* Keypad Actions */}
                  <div className="p-6 border-t border-border/50 bg-background">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
                      disabled={loadingGen || !amount}
                    >
                      {loadingGen ? (
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      ) : (
                        <QrCode className="mr-2 h-4 w-4" />
                      )}
                      Generate Code
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex-1 flex flex-col animate-in fade-in zoom-in duration-300">
                  {/* Digital Receipt View */}
                  <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 relative">
                    {/* Dashed Border Top */}
                    <div className="absolute top-0 left-0 right-0 h-px border-t border-dashed border-gray-300" />

                    <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm mb-6">
                      <img
                        src={qrImage}
                        alt="QR"
                        className="w-48 h-48 mix-blend-multiply"
                      />
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-2">
                        <Receipt className="w-3 h-3" /> Sale Generated
                      </div>
                      <p className="text-4xl font-mono font-bold text-black tracking-tight">
                        {parseFloat(amount).toFixed(2)}{" "}
                        <span className="text-lg text-gray-400">MAD</span>
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={resetGen}
                      className="w-full h-12 border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:text-black font-medium"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      New Transaction
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🟢 TAB 2: VALIDATE REWARD */}
        <TabsContent value="redeem-reward" className="flex-1 outline-none">
          <Card className="h-[500px] border border-border/50 shadow-sm bg-black rounded-xl overflow-hidden relative">
            <CardContent className="p-0 h-full">
              <div className="relative h-full w-full">
                {/* Scanner Layer */}
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

                {/* HUD Overlay (Idle) */}
                {scanStatus === "idle" && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-56 h-56 relative border-2 border-white/30 rounded-lg">
                      {/* Corners */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary -mt-0.5 -ml-0.5" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary -mt-0.5 -mr-0.5" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary -mb-0.5 -ml-0.5" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary -mb-0.5 -mr-0.5" />

                      {/* Scan Line */}
                      <div className="absolute top-0 left-2 right-2 h-px bg-primary shadow-[0_0_10px_var(--primary)] animate-scan-down" />
                    </div>
                    <div className="mt-8 bg-black/60 backdrop-blur px-4 py-1.5 rounded-full border border-white/10">
                      <p className="text-xs text-white/80 font-medium">
                        Scan Customer Ticket
                      </p>
                    </div>
                  </div>
                )}

                {/* Result Overlay (Drawer Style) */}
                {scanStatus !== "idle" && (
                  <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="w-full bg-background border border-border rounded-xl p-6 shadow-2xl">
                      {/* Processing */}
                      {scanStatus === "processing" && (
                        <div className="flex flex-col items-center py-8">
                          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                          <p className="font-medium text-foreground">
                            Verifying code...
                          </p>
                        </div>
                      )}

                      {/* Success */}
                      {scanStatus === "success" && (
                        <div className="text-center">
                          <div className="h-12 w-12 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                            <Check className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-bold text-foreground mb-1">
                            Valid Reward
                          </h3>

                          <div className="bg-secondary/30 rounded-lg p-4 my-4 border border-border/50">
                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1">
                              Provide Item
                            </p>
                            <p className="text-xl font-bold text-primary mb-3">
                              {scanResult?.rewardName}
                            </p>
                            <div className="h-px bg-border w-full mb-3" />
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Client
                              </span>
                              <span className="font-medium">
                                {scanResult?.clientName}
                              </span>
                            </div>
                          </div>

                          <Button
                            onClick={resetScan}
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                          >
                            Scan Next
                          </Button>
                        </div>
                      )}

                      {/* Error */}
                      {scanStatus === "error" && (
                        <div className="text-center">
                          <div className="h-12 w-12 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <AlertCircle className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-bold text-foreground mb-1">
                            Invalid Code
                          </h3>
                          <p className="text-sm text-muted-foreground mb-6">
                            {scanResult?.error ||
                              "This code is not valid or has expired."}
                          </p>

                          <Button
                            onClick={resetScan}
                            variant="outline"
                            className="w-full"
                          >
                            Try Again
                          </Button>
                        </div>
                      )}
                    </div>
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
            top: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
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
