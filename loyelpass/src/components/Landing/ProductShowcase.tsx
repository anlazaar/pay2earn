"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Smartphone,
  MoreVertical,
  Wifi,
  QrCode,
} from "lucide-react";

export function ProductShowcase() {
  const t = useTranslations("ProductShowcase");
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScan, setActiveScan] = useState(0);

  // Dynamic Recent Scans using translations for time
  const recentScans = [
    {
      id: 1,
      client: "Amine T.",
      amount: `150 ${t("dashboard.currency")}`,
      points: "+15",
      time: t("dashboard.just_now"),
    },
    {
      id: 2,
      client: "Sara B.",
      amount: `45 ${t("dashboard.currency")}`,
      points: "+4",
      time: t("dashboard.mins_ago", { count: 2 }),
    },
    {
      id: 3,
      client: "Omar K.",
      amount: `220 ${t("dashboard.currency")}`,
      points: "+22",
      time: t("dashboard.mins_ago", { count: 5 }),
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [20, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 0.5], [100, -40]);

  useEffect(() => {
    const interval = setInterval(
      () => setActiveScan((prev) => (prev + 1) % recentScans.length),
      3000
    );
    return () => clearInterval(interval);
  }, [recentScans.length]);

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-40 relative perspective-[2000px] overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-60" />

      <div className="container mx-auto px-6 text-center mb-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {t("title_start")} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
            {t("title_gradient")}
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto h-[600px] md:h-[700px] flex justify-center items-center">
        {/* DASHBOARD LAYER */}
        <motion.div
          style={{ rotateX, scale, opacity }}
          className="absolute inset-0 z-0 origin-bottom"
        >
          <div className="w-full h-full bg-background border border-border/60 rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
            <div className="h-10 border-b border-border/50 bg-secondary/20 flex items-center px-4 gap-2">
              <div className="flex gap-1.5 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="ms-4 flex items-center gap-2 px-3 py-1 bg-background rounded-md border border-border/50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
                  LIVE_CONNECTED
                </span>
              </div>
            </div>

            <div className="flex-1 flex bg-background/80 backdrop-blur-sm">
              {/* Sidebar */}
              <div className="w-16 md:w-60 border-e border-border/50 p-4 hidden md:flex flex-col gap-1">
                {[
                  "overview",
                  "live_feed",
                  "campaigns",
                  "staff",
                  "settings",
                ].map((key, i) => (
                  <div
                    key={key}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      i === 1
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t(`sidebar.${key}`)}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8">
                <div className="flex justify-between items-end mb-8">
                  <div className="text-start">
                    <h3 className="text-2xl font-bold">
                      {t("dashboard.live_activity")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("dashboard.branch_info")}
                    </p>
                  </div>
                  <div className="text-end">
                    <div className="text-3xl font-bold tabular-nums">
                      12,450{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        {t("dashboard.currency")}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-500 font-medium flex justify-end items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 rtl:-scale-x-100" />{" "}
                      {t("dashboard.stats_growth")}
                    </div>
                  </div>
                </div>

                {/* Bars Chart */}
                <div className="h-48 w-full bg-secondary/10 border border-border/50 rounded-lg mb-8 flex items-end justify-between px-4 pb-0 pt-8 gap-2 overflow-hidden">
                  {[
                    40, 65, 45, 80, 55, 70, 45, 60, 75, 50, 85, 90, 60, 75, 50,
                  ].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="flex-1 bg-gradient-to-t from-primary/10 to-primary/60 rounded-t-sm"
                    />
                  ))}
                </div>

                {/* Table */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-start">
                    {t("dashboard.recent_scans")}
                  </h4>
                  <AnimatePresence mode="popLayout">
                    {[
                      recentScans[activeScan],
                      ...recentScans.filter((_, i) => i !== activeScan),
                    ].map((scan) => (
                      <motion.div
                        layout
                        key={scan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-[10px] font-bold text-black">
                            {scan.client.charAt(0)}
                          </div>
                          <div className="text-start">
                            <div className="text-sm font-medium">
                              {scan.client}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {scan.time}
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
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

        {/* PHONE LAYER */}
        <motion.div
          style={{ y: phoneY }}
          className="absolute end-4 md:end-20 top-20 z-20 w-[280px] md:w-[320px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden"
        >
          <div className="h-8 bg-black w-full flex justify-between items-center px-6 text-white text-[10px] font-medium z-20 relative">
            <span className="rtl:order-2">9:41</span>
            <div className="flex gap-1.5 rtl:order-1">
              <Wifi className="w-3 h-3" />
              <div className="w-4 h-2 bg-white rounded-[2px]" />
            </div>
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />

          <div className="h-full bg-background flex flex-col relative">
            <div className="p-6 pb-2 pt-10 flex justify-between items-center">
              <h3 className="text-xl font-bold">{t("phone.new_sale")}</h3>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <MoreVertical className="w-4 h-4" />
              </div>
            </div>

            <div className="px-6 py-4 text-start">
              <div className="text-xs text-muted-foreground mb-1">
                {t("phone.total_amount")}
              </div>
              <div className="text-4xl font-mono font-bold text-foreground">
                150.00{" "}
                <span className="text-lg text-muted-foreground">
                  {t("dashboard.currency")}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center bg-secondary/20 m-4 rounded-3xl border border-dashed border-border">
              <div className="w-40 h-40 bg-white rounded-2xl p-2 relative shadow-sm">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LoyelpassDemo"
                  alt="QR"
                  className="w-full h-full opacity-90"
                />
              </div>
              <p className="mt-6 text-sm font-medium text-muted-foreground animate-pulse">
                {t("phone.scan_prompt")}
              </p>
            </div>

            <div className="p-6 bg-background border-t border-border">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <Smartphone className="w-4 h-4" />
                <span>{t("phone.table_link")}</span>
              </div>
              <button className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />{" "}
                {t("phone.btn_transaction")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
