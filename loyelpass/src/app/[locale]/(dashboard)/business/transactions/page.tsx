import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Use the singleton instance
import { getFormatter, getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, User, CalendarClock } from "lucide-react";

async function getTransactions(userId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
  });

  if (!business) return [];

  return await prisma.purchase.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      waiter: { select: { username: true, email: true } },
      client: { select: { name: true, email: true } },
    },
  });
}

export default async function TransactionsPage() {
  // 1. Initialize Internationalization
  const t = await getTranslations("TransactionsPage");
  const format = await getFormatter();

  const session = await auth();
  const transactions = await getTransactions(session?.user?.id as string);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="border-b border-border/50 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <Card className="border border-border/50 shadow-sm bg-card">
        <CardHeader className="border-b border-border/50 bg-secondary/10 pb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">
              {t("recent_activity")}
            </CardTitle>
          </div>
          <CardDescription>{t("showing_count")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[200px] text-start">
                  {t("table.date")}
                </TableHead>
                <TableHead className="text-start">{t("table.staff")}</TableHead>
                <TableHead className="text-start">
                  {t("table.customer")}
                </TableHead>
                <TableHead className="text-start">{t("table.items")}</TableHead>
                <TableHead className="text-end">{t("table.amount")}</TableHead>
                <TableHead className="text-end">{t("table.points")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="hover:bg-secondary/20 border-border/50"
                >
                  {/* Date Column */}
                  <TableCell className="font-mono text-xs text-muted-foreground text-start">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-3 w-3" />
                      {format.dateTime(tx.createdAt, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      <span className="opacity-50">
                        {format.dateTime(tx.createdAt, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </TableCell>

                  {/* Staff Column */}
                  <TableCell className="text-start">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-600 flex items-center justify-center text-[10px] font-bold border border-indigo-500/30">
                        {tx.waiter?.username?.[0] || "S"}
                      </div>
                      <span className="text-sm font-medium">
                        {tx.waiter?.username || t("unknown")}
                      </span>
                    </div>
                  </TableCell>

                  {/* Customer Column */}
                  <TableCell className="text-start">
                    {tx.client ? (
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{tx.client.name}</span>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground"
                      >
                        {t("guest")}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Items Column */}
                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground text-start">
                    {Array.isArray(tx.products) &&
                    (tx.products as any[]).length > 0
                      ? (tx.products as any[]).map((p) => p.name).join(", ")
                      : t("custom_amount")}
                  </TableCell>

                  {/* Amount Column - Localized Currency */}
                  <TableCell className="text-end font-mono text-sm">
                    {format.number(Number(tx.totalAmount), {
                      style: "currency",
                      currency: "MAD",
                    })}
                  </TableCell>

                  {/* Points Column */}
                  <TableCell className="text-end">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                    >
                      +{tx.pointsAwarded} pts
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}

              {transactions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t("empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
