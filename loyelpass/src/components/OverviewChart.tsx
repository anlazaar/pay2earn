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

interface Props {
  data: { date: string; displayDate: string; points: number }[];
  className?: string;
}

/**
 * Custom Tooltip Component
 * Renders a glassmorphism card with the Golden/Black theme
 */
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-primary/20 bg-background/80 backdrop-blur-xl px-4 py-3 shadow-2xl shadow-black/10 ring-1 ring-white/10">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          <span className="text-xl font-bold text-foreground font-mono">
            {payload[0].value?.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground font-medium">pts</span>
        </div>
      </div>
    );
  }
  return null;
};

export function OverviewChart({ data, className }: Props) {
  return (
    <div className={cn("w-full h-[350px] relative group", className)}>
      {/* Optional: Add a subtle glow behind the chart for extra 'pop' in dark mode */}
      <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            {/* 
              GOLDEN GRADIENT DEFINITION 
              We use CSS variables directly. Note: 'var(--primary)' works because 
              modern browsers support CSS vars in SVG attributes.
            */}
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
              <stop offset="50%" stopColor="var(--primary)" stopOpacity={0.1} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
            opacity={0.4}
          />

          <XAxis
            dataKey="displayDate"
            stroke="var(--muted-foreground)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickMargin={15}
            minTickGap={30}
            className="uppercase tracking-wider font-semibold"
          />

          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            className="font-mono"
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "var(--primary)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
              opacity: 0.5,
            }}
          />

          <Area
            type="monotone"
            dataKey="points"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#colorPoints)"
            animationDuration={1500}
            animationEasing="ease-in-out"
            activeDot={{
              r: 6,
              style: {
                fill: "var(--background)",
                stroke: "var(--primary)",
                strokeWidth: 2,
              },
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
