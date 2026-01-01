import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  History,
  User,
  CalendarClock,
  Receipt,
  ShoppingBag,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

// --- TYPES ---
interface ProductItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

// --- DATA FETCHING ---
async function getTransactions(userId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  });

  if (!business) return [];

  return await prisma.purchase.findMany({
    where: {
      businessId: business.id,
      redeemed: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      waiter: { select: { username: true, email: true } },
      client: { select: { name: true, email: true } },
    },
  });
}

export default async function TransactionsPage() {
  const t = await getTranslations("TransactionsPage");
  const format = await getFormatter();
  const session = await auth();

  if (!session?.user) redirect("/api/auth/signin");

  const transactions = await getTransactions(session.user.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-start">
      {/* 🟢 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-200/50 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Export Button Placeholder */}
        <Button variant="outline" className="gap-2 hidden md:flex rounded-full">
          <ArrowUpRight className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* 🟢 Main Card */}
      <Card className="border border-zinc-200 dark:border-white/10 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl overflow-hidden rounded-3xl">
        <CardHeader className="border-b border-zinc-100 dark:border-white/5 bg-white/40 dark:bg-white/5 pb-4 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-muted-foreground">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold uppercase tracking-wide text-foreground">
                  {t("recent_activity")}
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs font-medium">
                  {t("showing_count")}
                </CardDescription>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono bg-zinc-100 dark:bg-white/10 px-2 py-1 rounded-md">
              Live Data
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-white/5">
                <TableRow className="hover:bg-transparent border-zinc-200 dark:border-white/5">
                  <TableHead className="w-[180px] text-start whitespace-nowrap ps-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("table.date")}
                  </TableHead>
                  <TableHead className="text-start whitespace-nowrap py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("table.staff")}
                  </TableHead>
                  <TableHead className="text-start whitespace-nowrap py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("table.customer")}
                  </TableHead>
                  <TableHead className="text-start min-w-[200px] py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("table.items")}
                  </TableHead>
                  <TableHead className="text-end whitespace-nowrap py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("table.amount")}
                  </TableHead>
                  <TableHead className="text-end whitespace-nowrap pe-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("table.points")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, i) => {
                  const products =
                    (tx.products as unknown as ProductItem[]) || [];
                  const isGuest = !tx.client;

                  return (
                    <TableRow
                      key={tx.id}
                      className="group hover:bg-zinc-50/80 dark:hover:bg-white/5 transition-all duration-200 border-zinc-100 dark:border-white/5"
                    >
                      {/* Date */}
                      <TableCell className="font-mono text-xs text-muted-foreground text-start ps-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center border border-zinc-200 dark:border-white/5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-0.5">
                              {format.dateTime(tx.createdAt, {
                                month: "short",
                              })}
                            </span>
                            <span className="text-sm font-bold text-foreground leading-none">
                              {format.dateTime(tx.createdAt, {
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground">
                              {format.dateTime(tx.createdAt, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50 uppercase">
                              #{tx.id.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Staff */}
                      <TableCell className="text-start py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-200 dark:border-indigo-500/30">
                            {tx.waiter?.username?.[0]?.toUpperCase() || "S"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                              {tx.waiter?.username || t("unknown")}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Waiter
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Customer */}
                      <TableCell className="text-start py-4">
                        {isGuest ? (
                          <Badge
                            variant="secondary"
                            className="bg-zinc-100 dark:bg-white/10 text-muted-foreground border-zinc-200 dark:border-white/10 text-[10px] font-medium"
                          >
                            {t("guest")}
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30 shadow-sm">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {tx.client?.name}
                            </span>
                          </div>
                        )}
                      </TableCell>

                      {/* Items */}
                      <TableCell className="text-start py-4">
                        {products.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-zinc-100 dark:bg-white/5 rounded text-muted-foreground">
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm text-foreground/80 font-medium">
                              {products[0].name}
                            </span>
                            {products.length > 1 && (
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="h-5 px-1.5 rounded bg-zinc-100 dark:bg-white/10 text-[10px] font-bold text-muted-foreground border border-zinc-200 dark:border-white/10 flex items-center gap-0.5 cursor-help hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors">
                                      <span>+{products.length - 1}</span>
                                      <MoreHorizontal className="w-2.5 h-2.5" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-zinc-900 text-white border-zinc-800 p-2">
                                    <ul className="text-xs space-y-1">
                                      {products.slice(1).map((p, j) => (
                                        <li
                                          key={j}
                                          className="flex justify-between gap-4"
                                        >
                                          <span>{p.name}</span>
                                          <span className="opacity-50">
                                            x{p.qty}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic flex items-center gap-1.5 opacity-60">
                            <Receipt className="w-3.5 h-3.5" />
                            {t("custom_amount")}
                          </span>
                        )}
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="text-end font-mono text-sm font-bold text-foreground py-4">
                        {format.number(Number(tx.totalAmount), {
                          style: "currency",
                          currency: "MAD",
                        })}
                      </TableCell>

                      {/* Points */}
                      <TableCell className="text-end pe-6 py-4">
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-mono font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                        >
                          +{tx.pointsAwarded} pts
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-48 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <History className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <p className="font-medium">{t("empty")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
