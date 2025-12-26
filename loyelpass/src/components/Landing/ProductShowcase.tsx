"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  QrCode,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Smartphone,
  MoreVertical,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for the "Live Feed" animation
const recentScans = [
  {
    id: 1,
    client: "Amine T.",
    amount: "150 MAD",
    points: "+15",
    time: "Just now",
  },
  { id: 2, client: "Sara B.", amount: "45 MAD", points: "+4", time: "2m ago" },
  {
    id: 3,
    client: "Omar K.",
    amount: "220 MAD",
    points: "+22",
    time: "5m ago",
  },
];

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScan, setActiveScan] = useState(0);

  // Scroll Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.4], [20, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 0.5], [100, -40]);

  // Simulate Live Transactions
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScan((prev) => (prev + 1) % recentScans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-40 relative perspective-[2000px] overflow-hidden"
    >
      {/* 🟢 Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-60" />

      <div className="container mx-auto px-6 text-center mb-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          From Table to Dashboard, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 animate-gradient">
            Instantly.
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          See how waiter actions sync with your analytics in real-time.
        </p>
      </div>

      {/* 🟢 3D Composition Wrapper */}
      <div className="relative w-full max-w-6xl mx-auto h-[600px] md:h-[700px] flex justify-center items-center">
        {/* ==============================================
            LAYER 1: THE DASHBOARD (Tilted Background)
           ============================================== */}
        <motion.div
          style={{ rotateX, scale, opacity }}
          className="absolute inset-0 z-0 origin-bottom"
        >
          <div className="w-full h-full bg-background border border-border/60 rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
            {/* Window Controls */}
            <div className="h-10 border-b border-border/50 bg-secondary/20 flex items-center px-4 gap-2">
              <div className="flex gap-1.5 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="ml-4 flex items-center gap-2 px-3 py-1 bg-background rounded-md border border-border/50 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-muted-foreground">
                  LIVE_SOCKET_CONNECTED
                </span>
              </div>
            </div>

            {/* Dashboard Layout */}
            <div className="flex-1 flex bg-background/80 backdrop-blur-sm">
              {/* Sidebar */}
              <div className="w-16 md:w-60 border-r border-border/50 p-4 hidden md:flex flex-col gap-1">
                {[
                  "Overview",
                  "Live Feed",
                  "Campaigns",
                  "Staff",
                  "Settings",
                ].map((item, i) => (
                  <div
                    key={item}
                    className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                      i === 1
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-2xl font-bold">Live Activity</h3>
                    <p className="text-sm text-muted-foreground">
                      Casablanca Branch • Today
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold tabular-nums">
                      12,450{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        MAD
                      </span>
                    </div>
                    <div className="text-xs text-emerald-500 font-medium flex justify-end items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> +12% vs yesterday
                    </div>
                  </div>
                </div>

                {/* Big Chart Area */}
                <div className="h-48 w-full bg-secondary/10 border border-border/50 rounded-lg mb-8 relative flex items-end justify-between px-4 pb-0 pt-8 gap-2 overflow-hidden">
                  {/* Grid Lines */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, transparent 49%, var(--color-border) 50%, transparent 51%)",
                      backgroundSize: "100% 40px",
                      opacity: 0.1,
                    }}
                  ></div>

                  {/* Bars */}
                  {[
                    40, 65, 45, 80, 55, 70, 45, 60, 75, 50, 85, 90, 60, 75, 50,
                  ].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="flex-1 bg-gradient-to-t from-primary/10 to-primary/60 rounded-t-sm relative group"
                    >
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-primary/50 shadow-[0_0_10px_var(--color-primary)]" />
                    </motion.div>
                  ))}
                </div>

                {/* Live Feed Table */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Scans
                  </h4>
                  <AnimatePresence mode="popLayout">
                    {[
                      recentScans[activeScan],
                      ...recentScans.filter((_, i) => i !== activeScan),
                    ].map((scan, i) => (
                      <motion.div
                        layout
                        key={`${scan.id}-${scan.time}`} // Unique key trick to force animation
                        initial={{
                          opacity: 0,
                          x: -20,
                          backgroundColor: "rgba(var(--primary), 0.1)",
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          backgroundColor: "transparent",
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card hover:bg-secondary/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-[10px] font-bold text-black">
                            {scan.client.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {scan.client}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {scan.time}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{scan.amount}</div>
                          <div className="text-xs text-primary font-medium">
                            {scan.points} pts
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==============================================
            LAYER 2: THE WAITER'S PHONE (Floating Foreground)
           ============================================== */}
        <motion.div
          style={{ y: phoneY }}
          className="absolute right-4 md:right-20 top-20 z-20 w-[280px] md:w-[320px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden"
        >
          {/* Status Bar */}
          <div className="h-8 bg-black w-full flex justify-between items-center px-6 text-white text-[10px] font-medium z-20 relative">
            <span>9:41</span>
            <div className="flex gap-1.5">
              <Wifi className="w-3 h-3" />
              <div className="w-4 h-2 bg-white rounded-[2px]" />
            </div>
          </div>

          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />

          {/* App Content */}
          <div className="h-full bg-background flex flex-col relative">
            {/* Header */}
            <div className="p-6 pb-2 pt-10 flex justify-between items-center">
              <h3 className="text-xl font-bold">New Sale</h3>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <MoreVertical className="w-4 h-4" />
              </div>
            </div>

            {/* Amount Input */}
            <div className="px-6 py-4">
              <div className="text-xs text-muted-foreground mb-1">
                Total Amount
              </div>
              <div className="text-4xl font-mono font-bold text-foreground">
                150.00{" "}
                <span className="text-lg text-muted-foreground">MAD</span>
              </div>
            </div>

            {/* Central QR Area */}
            <div className="flex-1 flex flex-col items-center justify-center bg-secondary/20 m-4 rounded-3xl border border-dashed border-border relative">
              {/* 🟢 The "Scan" Pulse Animation */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                />
                <div className="w-40 h-40 bg-white rounded-2xl p-2 shadow-sm relative z-10">
                  {/* Valid QR Code Image (Static) */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LoyelpassDemo"
                    alt="QR"
                    className="w-full h-full mix-blend-multiply opacity-90"
                  />
                  {/* Logo Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <QrCode className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm font-medium text-muted-foreground animate-pulse">
                Show to client to scan
              </p>
            </div>

            {/* Bottom Action */}
            <div className="p-6 bg-background border-t border-border">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <Smartphone className="w-4 h-4" />
                <span>Linked to Table 5</span>
              </div>
              <button className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                New Transaction
              </button>
            </div>
          </div>
        </motion.div>

        {/* ==============================================
            LAYER 3: CONNECTION BEAM (The Sync Effect)
           ============================================== */}
        <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full overflow-visible">
          <motion.path
            d="M 800 200 Q 500 200 400 350" // Approximate path from phone to dashboard
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="10 10"
            className="opacity-50 hidden md:block" // Hide on mobile
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
