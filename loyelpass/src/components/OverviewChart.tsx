"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { date: string; displayDate: string; points: number }[];
}

export function OverviewChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        {/* Add a subtle grid for better readability */}
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
        />

        <XAxis
          dataKey="displayDate" // 🟢 Use the pretty date (Dec 22)
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--foreground))",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          itemStyle={{ color: "hsl(var(--primary))" }}
          labelStyle={{ fontWeight: "bold", marginBottom: "0.25rem" }}
        />
        <Area
          type="monotone"
          dataKey="points"
          stroke="hsl(var(--primary))"
          fill="url(#colorPoints)"
          strokeWidth={2}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
