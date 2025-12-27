"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";

// --- CHART 1: HOURLY ACTIVITY ---
interface HourlyProps {
  data: { hour: string; count: number }[];
}

export function HourlyActivityChart({ data }: HourlyProps) {
  const t = useTranslations("BusinessCharts.hourly");

  return (
    <Card className="border border-border/50 shadow-sm bg-card rounded-xl">
      <CardHeader className="pb-2 text-start">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-xs">{t("desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="hour"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                cursor={{ fill: "var(--secondary)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded border border-border bg-popover px-2 py-1 text-xs shadow-sm flex gap-1">
                        <span className="font-bold text-foreground tabular-nums">
                          {payload[0].value}
                        </span>
                        <span className="text-muted-foreground">
                          {t("unit")}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={entry.count > 0 ? 1 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// --- CHART 2: TOP WAITERS ---
interface WaiterProps {
  data: { name: string; revenue: number }[];
}

export function TopWaitersChart({ data }: WaiterProps) {
  const t = useTranslations("BusinessCharts.waiters");
  const tDash = useTranslations("BusinessDashboard.stats"); // Reuse currency key
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <Card className="border border-border/50 shadow-sm bg-card rounded-xl">
      <CardHeader className="pb-2 text-start">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-xs">{t("desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              // In RTL, we swap the margins so the bar grows correctly from the labels
              margin={{
                left: isRtl ? 30 : 0,
                right: isRtl ? 0 : 30,
              }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={80}
                // Moves labels to the right side in Arabic
                orientation={isRtl ? "right" : "left"}
                tick={{ fill: "var(--foreground)" }}
              />
              <Tooltip
                cursor={{ fill: "var(--secondary)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded border border-border bg-popover px-2 py-1 text-xs shadow-sm tabular-nums">
                        <span className="font-bold text-foreground">
                          {payload[0].value}{" "}
                          {tDash("totalPoints").split(" ")[1] || "MAD"}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="revenue"
                fill="var(--primary)"
                // Swaps the corner radius for the bars in RTL
                radius={isRtl ? [4, 0, 0, 4] : [0, 4, 4, 0]}
                barSize={15}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0 ? "var(--primary)" : "var(--muted-foreground)"
                    }
                    opacity={index === 0 ? 1 : 0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
