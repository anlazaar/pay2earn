"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, motion, useMotionValueEvent } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Repeat,
  PieChart,
  Zap,
  ArrowRight,
  User,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    key: "retention",
    icon: Repeat,
    color: "from-blue-600 to-cyan-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-600 dark:text-blue-500", // Adapted for contrast
  },
  {
    key: "analytics",
    icon: PieChart,
    color: "from-amber-400 to-orange-500",
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-amber-600 dark:text-primary",
  },
  {
    key: "automation",
    icon: Zap,
    color: "from-violet-600 to-purple-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-600 dark:text-violet-500",
  },
];

export function BusinessImpact() {
  const t = useTranslations("BusinessImpact");
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardIndex = Math.floor(latest * FEATURES.length);
    const clampedIndex = Math.min(Math.max(cardIndex, 0), FEATURES.length - 1);
    if (clampedIndex !== activeCard) setActiveCard(clampedIndex);
  });

  return (
    <section
      ref={containerRef}
      className="relative lg:h-[300vh] w-full bg-background"
    >
      <div className="lg:sticky lg:top-0 lg:h-screen w-full flex flex-col justify-center overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <motion.div
            animate={{
              background:
                activeCard === 0
                  ? "var(--blue-500)"
                  : activeCard === 1
                  ? "var(--primary)"
                  : "var(--violet-500)",
              opacity: 0.08,
            }}
            className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000 hidden lg:block"
          />
        </div>

        <div className="container mx-auto px-6 py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LEFT COLUMN: Text */}
            <div className="space-y-16 lg:space-y-0 relative z-10 order-2 lg:order-1">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.key}
                  className={cn(
                    "lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-full transition-all duration-500",
                    isMobile
                      ? "block mb-24 last:mb-0"
                      : activeCard === index
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  )}
                >
                  {/* MOBILE: Visual Injection (Kept your logic) */}
                  {isMobile && (
                    <div className="mb-8 aspect-[4/5] w-full max-w-sm mx-auto">
                      {/* We pass forceActive so it shows statically without scroll logic on mobile */}
                      <CardVisual
                        feature={feature}
                        index={index}
                        activeCard={index}
                        t={t}
                        forceActive={true}
                      />
                    </div>
                  )}

                  <div className="max-w-xl">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border uppercase tracking-wider",
                        feature.bg,
                        feature.text,
                        feature.border
                      )}
                    >
                      <feature.icon className="w-4 h-4" />
                      <span>{t(`${feature.key}.tag`)}</span>
                    </div>

                    <h3 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-foreground">
                      {t(`${feature.key}.title`)}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {t(`${feature.key}.description`)}
                    </p>

                    <div className="mt-8 flex items-center gap-2 text-sm font-bold text-foreground group cursor-pointer hover:text-primary transition-colors">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN: 3D Visual Stack (Desktop Only) */}
            <div className="hidden lg:flex relative h-[600px] w-full items-center justify-center perspective-[1200px] order-1 lg:order-2">
              {FEATURES.map((feature, index) => (
                <CardVisual
                  key={feature.key}
                  feature={feature}
                  index={index}
                  activeCard={activeCard}
                  t={t}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- The Premium Card Component ---

function CardVisual({
  feature,
  index,
  activeCard,
  t,
  forceActive = false,
}: any) {
  const isActive = forceActive || activeCard === index;
  const isPast = !forceActive && activeCard > index;

  const variants = {
    active: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      z: 0,
      filter: "blur(0px)",
    },
    inactive: (custom: number) => ({
      opacity: 0,
      scale: 0.85,
      rotateX: custom > index ? 15 : -15,
      y: custom > index ? -100 : 300,
      z: -200,
      filter: "blur(10px)",
    }),
  };

  return (
    <motion.div
      custom={activeCard}
      variants={forceActive ? {} : variants}
      initial={forceActive ? {} : "inactive"}
      animate={isActive ? "active" : "inactive"}
      transition={{ type: "spring", stiffness: 45, damping: 15, mass: 1.2 }}
      className={cn(
        "flex items-center justify-center w-full h-full",
        !forceActive && "absolute lg:inset-0" // Crucial Fix: Only absolute on desktop
      )}
      style={{ zIndex: isActive ? 20 : 0 }}
    >
      {/* 
        GLASS CARD CONTAINER 
        Fixed: Now supports Light Mode (White Glass) and Dark Mode (Dark Glass)
      */}
      <div className="w-full max-w-[400px] aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-white/80 via-white/40 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent border border-white/40 dark:border-white/20 shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] backdrop-blur-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

        {/* Dynamic Glow Blob */}
        <div
          className={cn(
            "absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-30 dark:opacity-40 mix-blend-screen transition-colors duration-500",
            feature.color
          )}
        />

        {/* --- Card Header --- */}
        <div className="relative z-10 p-6 flex justify-between items-center border-b border-zinc-200/50 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border backdrop-blur-md",
                "bg-white/60 border-white/50 text-zinc-700", // Light
                "dark:bg-white/5 dark:border-white/10 dark:text-white" // Dark
              )}
            >
              <feature.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Module
              </span>
              <span className="text-sm font-bold text-foreground dark:text-white">
                {t(`${feature.key}.tag`)}
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400/80" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/80" />
            <div className="w-2 h-2 rounded-full bg-green-400/80" />
          </div>
        </div>

        {/* --- Card Body --- */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {feature.key === "retention" && <RetentionUI color={feature.text} />}
          {feature.key === "analytics" && <AnalyticsUI />}
          {feature.key === "automation" && <AutomationUI />}
        </div>

        {/* Reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

// ==========================================
// MICRO-INTERACTION COMPONENTS
// ==========================================

function RetentionUI({ color }: { color: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full pb-12 gap-6">
      <div className="relative">
        {/* Spinning Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="w-48 h-48 rounded-full border border-dashed border-zinc-300 dark:border-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          className="w-36 h-36 rounded-full border border-zinc-200 dark:border-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        {/* Central User Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-800 dark:to-zinc-950 border border-zinc-200 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-10">
          <User className="w-8 h-8 text-zinc-700 dark:text-white" />
          {/* Notification Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900"
          >
            <span className="text-[10px] font-bold text-white">1</span>
          </motion.div>
        </div>

        {/* Floating Avatars */}
        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.2 }}
            className="absolute w-10 h-10 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/20 flex items-center justify-center shadow-sm"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${deg}deg) translate(80px) rotate(-${deg}deg)`,
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 opacity-90" />
          </motion.div>
        ))}
      </div>

      <div className="bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-xl p-4 w-full flex items-center justify-between backdrop-blur-md shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Return Rate</span>
          <span className="text-xl font-bold text-foreground dark:text-white">
            +42.5%
          </span>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-bold border",
            "bg-blue-100 text-blue-600 border-blue-200", // Light
            "dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30" // Dark
          )}
        >
          High
        </div>
      </div>
    </div>
  );
}

function AnalyticsUI() {
  return (
    <div className="flex flex-col h-full justify-end pb-8">
      {/* Floating Card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-4 p-3 rounded-xl shadow-xl z-20 backdrop-blur-md w-32 bg-white/80 dark:bg-zinc-900/90 border border-white/50 dark:border-white/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] text-muted-foreground uppercase">
            Revenue
          </span>
        </div>
        <div className="text-lg font-bold text-foreground dark:text-white">
          $12,405
        </div>
      </motion.div>

      {/* Chart */}
      <div className="w-full h-48 flex items-end justify-between gap-2 px-2">
        {[35, 55, 45, 70, 60, 85, 95].map((height, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
            className="relative flex-1 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-primary/60 dark:from-primary/10 dark:to-primary/60 rounded-t-sm group-hover:to-primary/80 transition-all" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
              ${height}k
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/10 flex justify-between text-xs text-muted-foreground">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

function AutomationUI() {
  return (
    <div className="flex flex-col h-full justify-center gap-4">
      <div className="space-y-4">
        {/* Trigger Block */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl flex items-center gap-3 relative z-10 shadow-sm bg-white/60 dark:bg-zinc-800/80 border border-white/50 dark:border-white/10"
        >
          <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-mono">
              TRIGGER
            </div>
            <div className="text-sm font-bold text-foreground dark:text-white">
              New Customer Joins
            </div>
          </div>
        </motion.div>

        {/* Connection Line */}
        <div className="h-8 w-[2px] bg-zinc-200 dark:bg-white/10 mx-auto relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 30] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-violet-500"
          />
        </div>

        {/* Action Block */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl flex items-center gap-3 relative z-10 shadow-md bg-white/60 dark:bg-zinc-800/80 border border-white/50 dark:border-white/10"
        >
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-mono">
              ACTION
            </div>
            <div className="text-sm font-bold text-foreground dark:text-white">
              Send Welcome Gift
            </div>
          </div>
          <div className="absolute right-3 top-3">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
        </motion.div>
      </div>

      <div className="mt-4 p-3 rounded-lg text-xs text-center font-mono bg-violet-50 border border-violet-100 text-violet-600 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300">
        System Status: Active
      </div>
    </div>
  );
}
