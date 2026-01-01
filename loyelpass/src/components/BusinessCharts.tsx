"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { TrendingUp, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

// --- SHARED: GLASS TOOLTIP ---
const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl p-3 min-w-[120px] animate-in zoom-in-95">
        <p className="text-muted-foreground mb-1 text-[10px] uppercase tracking-widest font-bold">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          <span className="font-mono font-bold text-foreground">
            {payload[0].value?.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
    );
  }
  return null;
};

// --- CHART 1: HOURLY ACTIVITY ---
interface HourlyProps {
  data: { hour: string; count: number }[];
}

export function HourlyActivityChart({ data }: HourlyProps) {
  const t = useTranslations("BusinessCharts.hourly");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-zinc-200/50 dark:border-white/10 shadow-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 text-start border-b border-zinc-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                {t("desc")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[250px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeOpacity={0.2}
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="hour"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)" }}
                  dy={10}
                />
                <YAxis
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)" }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--primary)", opacity: 0.1 }}
                  content={<CustomTooltip unit={t("unit")} />}
                />
                <Bar
                  dataKey="count"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- CHART 2: TOP WAITERS ---
interface WaiterProps {
  data: { name: string; revenue: number }[];
}

export function TopWaitersChart({ data }: WaiterProps) {
  const t = useTranslations("BusinessCharts.waiters");
  const tDash = useTranslations("BusinessDashboard.stats");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const currency = tDash("totalPoints").split(" ")[1] || "MAD";

  // Find max for highlighting logic
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);
  const maxVal = sortedData[0]?.revenue || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <Card className="border border-zinc-200/50 dark:border-white/10 shadow-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl overflow-hidden h-full">
        <CardHeader className="pb-4 text-start border-b border-zinc-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                {t("desc")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[250px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  left: isRtl ? 10 : 0,
                  right: isRtl ? 0 : 10,
                  top: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={1}
                    />
                  </linearGradient>
                </defs>

                <XAxis type="number" hide />

                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={110} // Increased width to fit Icon + Text
                  orientation={isRtl ? "right" : "left"}
                  tick={({ x, y, payload }) => (
                    // 🟢 FIX: Use foreignObject to allow Flexbox alignment
                    <foreignObject
                      x={isRtl ? x : x - 110}
                      y={y - 12} // Vertically center (height is 24)
                      width={100}
                      height={24}
                    >
                      <div
                        className={cn(
                          "flex items-center h-full gap-2 w-full",
                          isRtl
                            ? "justify-start flex-row"
                            : "justify-end flex-row"
                        )}
                      >
                        {/* LTR: Icon First */}
                        {!isRtl && (
                          <div className="flex items-center justify-center w-5 h-5 rounded bg-zinc-100 dark:bg-white/10 shrink-0">
                            <User className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}

                        <span className="truncate text-xs font-medium text-foreground/80">
                          {payload.value}
                        </span>

                        {/* RTL: Icon Last */}
                        {isRtl && (
                          <div className="flex items-center justify-center w-5 h-5 rounded bg-zinc-100 dark:bg-white/10 shrink-0">
                            <User className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </foreignObject>
                  )}
                />

                <Tooltip
                  cursor={{ fill: "var(--primary)", opacity: 0.05 }}
                  content={<CustomTooltip unit={currency} />}
                />

                <Bar
                  dataKey="revenue"
                  radius={isRtl ? [4, 0, 0, 4] : [0, 4, 4, 0]}
                  barSize={20}
                  animationDuration={1500}
                >
                  {data.map((entry, index) => {
                    const isWinner = entry.revenue === maxVal;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isWinner ? "url(#goldGradient)" : "var(--muted)"}
                        style={{
                          opacity: isWinner ? 1 : 0.4,
                          transition: "all 0.3s",
                        }}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
