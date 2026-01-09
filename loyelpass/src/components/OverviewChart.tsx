"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  data: { date: string; displayDate: string; points: number }[];
  className?: string;
}

type CustomTooltip = {
  active?: boolean;
  payload?: {
    value?: number;
  }[];
  label?: string;
};

// 1. A Helper to make axis numbers look pro (e.g., 1500 -> 1.5k)
const formatNumber = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

const CustomTooltip = ({ active, payload, label }: CustomTooltip) => {
  if (active && payload && payload.length) {
    return (
      // 2. Glassmorphism Tooltip
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl p-3 min-w-35 animate-in zoom-in-95 duration-200">
        <p className="text-muted-foreground mb-2 text-[10px] uppercase tracking-widest font-bold">
          {label}
        </p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Issued
            </span>
          </div>
          <div className="text-right">
            <span className="block font-mono text-lg font-bold text-foreground leading-none">
              {payload[0].value?.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">pts</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function OverviewChart({ data, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full h-75 min-w-0 select-none", className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          {/* 3. Rich Gradient Definition */}
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop
                offset="50%"
                stopColor="var(--primary)"
                stopOpacity={0.05}
              />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* 4. Subtle Grid */}
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="var(--border)"
            strokeOpacity={0.3}
          />

          <XAxis
            dataKey="displayDate"
            axisLine={false}
            tickLine={false}
            tickMargin={12}
            minTickGap={30}
            style={{ fontSize: 11, fontWeight: 500 }}
            tick={{ fill: "var(--muted-foreground)" }}
            dy={5}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatNumber}
            tickMargin={10}
            style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
            tick={{ fill: "var(--muted-foreground)" }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "var(--primary)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
              strokeOpacity: 0.5,
            }}
            isAnimationActive={true} // Smooth tooltip movement
          />

          <Area
            type="monotone"
            dataKey="points"
            stroke="var(--primary)"
            strokeWidth={3}
            fill="url(#colorPoints)"
            animationDuration={1500}
            animationEasing="ease-out"
            // 5. "Hollow" Active Dot (Premium feel)
            activeDot={{
              r: 6,
              style: {
                fill: "var(--background)",
                stroke: "var(--primary)",
                strokeWidth: 3,
                boxShadow: "0 0 10px var(--primary)",
              },
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
