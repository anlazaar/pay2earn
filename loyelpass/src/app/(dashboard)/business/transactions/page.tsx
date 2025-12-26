import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
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
import { History, ArrowUpRight, User, CalendarClock } from "lucide-react";

const prisma = new PrismaClient();

async function getTransactions(userId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
  });

  if (!business) return [];

  return await prisma.purchase.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 50, // Limit to last 50 for performance
    include: {
      waiter: { select: { username: true, email: true } },
      client: { select: { name: true, email: true } },
    },
  });
}

export default async function TransactionsPage() {
  const session = await auth();
  const transactions = await getTransactions(session?.user?.id as string);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="border-b border-border/50 pb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Transaction History
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Audit log of all points awarded by your staff.
        </p>
      </div>

      <Card className="border border-border/50 shadow-sm bg-card">
        <CardHeader className="border-b border-border/50 bg-secondary/10 pb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">
              Recent Activity
            </CardTitle>
          </div>
          <CardDescription>Showing the last 50 transactions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[180px]">Date & Time</TableHead>
                <TableHead>Staff Member</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="hover:bg-secondary/20 border-border/50"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-3 w-3" />
                      {new Date(tx.createdAt).toLocaleDateString()}
                      <span className="opacity-50">
                        {new Date(tx.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-600 flex items-center justify-center text-[10px] font-bold border border-indigo-500/30">
                        {tx.waiter.username?.[0] || "S"}
                      </div>
                      <span className="text-sm font-medium">
                        {tx.waiter.username || "Unknown"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
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
                        Guest
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {/* Assuming products is stored as JSON array of names */}
                    {Array.isArray(tx.products)
                      ? (tx.products as any[]).map((p) => p.name).join(", ")
                      : "Custom Amount"}
                  </TableCell>

                  <TableCell className="text-right font-mono text-sm">
                    ${Number(tx.totalAmount).toFixed(2)}
                  </TableCell>

                  <TableCell className="text-right">
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
                    No transactions recorded yet.
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
