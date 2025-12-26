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

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover/95 backdrop-blur shadow-xl px-3 py-2 text-xs">
        <p className="text-muted-foreground mb-1 uppercase tracking-wider font-semibold text-[10px]">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="font-mono font-medium text-foreground text-sm">
            {payload[0].value?.toLocaleString()}
          </span>
          <span className="text-muted-foreground">pts</span>
        </div>
      </div>
    );
  }
  return null;
};

export function OverviewChart({ data, className }: Props) {
  return (
    // 🟢 FIX: Add 'min-w-0' to prevent grid collapse issues
    <div className={cn("w-full h-[300px] min-w-0", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
            strokeOpacity={0.4}
          />

          <XAxis
            dataKey="displayDate"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            minTickGap={30}
            style={{ fontSize: 10, fontWeight: 500 }}
            tick={{ fill: "var(--muted-foreground)" }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}`}
            style={{ fontSize: 10, fontFamily: "monospace" }}
            tick={{ fill: "var(--muted-foreground)" }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "var(--border)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />

          <Area
            type="monotone"
            dataKey="points"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#colorPoints)"
            animationDuration={1000}
            activeDot={{
              r: 4,
              strokeWidth: 0,
              fill: "var(--primary)",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
