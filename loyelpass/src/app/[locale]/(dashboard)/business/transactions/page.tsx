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
} from "lucide-react";
import { redirect } from "next/navigation";

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
    select: { id: true }, // Optimization: Only select ID
  });

  if (!business) return [];

  return await prisma.purchase.findMany({
    where: {
      businessId: business.id,
      redeemed: true, // Only show completed transactions
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 text-start">
      {/* 🟢 Header */}
      <div className="flex flex-col gap-1 border-b border-border/50 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* 🟢 Main Card */}
      <Card className="border border-border/50 shadow-sm bg-card overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-secondary/5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <History className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  {t("recent_activity")}
                </CardTitle>
                <CardDescription className="mt-1">
                  {t("showing_count")}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Scrollable Container for Mobile Responsiveness */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="w-[180px] text-start whitespace-nowrap ps-6">
                    {t("table.date")}
                  </TableHead>
                  <TableHead className="text-start whitespace-nowrap">
                    {t("table.staff")}
                  </TableHead>
                  <TableHead className="text-start whitespace-nowrap">
                    {t("table.customer")}
                  </TableHead>
                  <TableHead className="text-start min-w-[200px]">
                    {t("table.items")}
                  </TableHead>
                  <TableHead className="text-end whitespace-nowrap">
                    {t("table.amount")}
                  </TableHead>
                  <TableHead className="text-end whitespace-nowrap pe-6">
                    {t("table.points")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  // Safe cast for JSON data
                  const products =
                    (tx.products as unknown as ProductItem[]) || [];
                  const isGuest = !tx.client;

                  return (
                    <TableRow
                      key={tx.id}
                      className="group hover:bg-secondary/30 transition-colors border-border/50"
                    >
                      {/* Date */}
                      <TableCell className="font-mono text-xs text-muted-foreground text-start ps-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">
                            {format.dateTime(tx.createdAt, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1 opacity-70">
                            <CalendarClock className="h-3 w-3" />
                            {format.dateTime(tx.createdAt, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>

                      {/* Staff */}
                      <TableCell className="text-start">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-[10px] font-bold border border-indigo-500/20 shadow-sm">
                            {tx.waiter?.username?.[0]?.toUpperCase() || "S"}
                          </div>
                          <span className="text-sm font-medium">
                            {tx.waiter?.username || t("unknown")}
                          </span>
                        </div>
                      </TableCell>

                      {/* Customer */}
                      <TableCell className="text-start">
                        {isGuest ? (
                          <Badge
                            variant="outline"
                            className="bg-secondary/50 text-[10px] text-muted-foreground font-normal border-dashed"
                          >
                            {t("guest")}
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                              <User className="h-3 w-3" />
                            </div>
                            <span className="text-sm">{tx.client?.name}</span>
                          </div>
                        )}
                      </TableCell>

                      {/* Items (With Tooltip Logic) */}
                      <TableCell className="text-start">
                        {products.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm text-foreground/80">
                              {products[0].name}
                            </span>
                            {products.length > 1 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="secondary"
                                      className="h-5 px-1.5 text-[10px] cursor-help hover:bg-secondary"
                                    >
                                      {t("more_items", {
                                        count: products.length - 1,
                                      })}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <ul className="text-xs space-y-1">
                                      {products.slice(1).map((p, i) => (
                                        <li key={i}>
                                          {p.qty}x {p.name}
                                        </li>
                                      ))}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                            <Receipt className="w-3 h-3" />
                            {t("custom_amount")}
                          </span>
                        )}
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="text-end font-mono text-sm font-medium">
                        {format.number(Number(tx.totalAmount), {
                          style: "currency",
                          currency: "MAD", // Or dynamic currency if available
                        })}
                      </TableCell>

                      {/* Points */}
                      <TableCell className="text-end pe-6">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono"
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
                      className="h-32 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <History className="h-5 w-5 opacity-40" />
                        </div>
                        <p>{t("empty")}</p>
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
