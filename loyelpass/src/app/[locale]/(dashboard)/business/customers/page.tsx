import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Trophy, CalendarDays, Wallet } from "lucide-react";

const prisma = new PrismaClient();

async function getCustomers(userId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
  });

  if (!business) return [];

  // Fetch clients who have progress in this business's programs
  // We also aggregate their purchases to calculate "Life Time Value" (LTV)
  const clients = await prisma.client.findMany({
    where: {
      progress: {
        some: {
          program: { businessId: business.id },
        },
      },
    },
    include: {
      purchases: {
        where: { businessId: business.id },
        select: { totalAmount: true, createdAt: true },
      },
      progress: {
        where: { program: { businessId: business.id } },
        select: { pointsAccumulated: true },
      },
    },
  });

  // Transform data for the UI
  return clients
    .map((c) => {
      const totalSpent = c.purchases.reduce(
        (acc, curr) => acc + Number(curr.totalAmount),
        0
      );
      const totalPoints = c.progress.reduce(
        (acc, curr) => acc + curr.pointsAccumulated,
        0
      );
      const lastVisit =
        c.purchases.length > 0
          ? c.purchases.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            )[0].createdAt
          : null;

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        totalSpent,
        totalPoints,
        lastVisit,
        visitCount: c.purchases.length,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent); // Sort by highest spender
}

export default async function CustomersPage() {
  const session = await auth();
  const customers = await getCustomers(session?.user?.id as string);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Customer Insights
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze your most loyal clients and their spending habits.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name or email..."
            className="pl-9 bg-card"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer, index) => (
          <Card
            key={customer.id}
            className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                  {customer.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <CardTitle className="text-base truncate">
                  {customer.name}
                </CardTitle>
                <CardDescription className="truncate text-xs">
                  {customer.email}
                </CardDescription>
              </div>
              {index < 3 && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-700 border-amber-200"
                >
                  <Trophy className="w-3 h-3 mr-1" /> Top {index + 1}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    Total Spent
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Wallet className="w-3.5 h-3.5 text-emerald-500" />$
                    {customer.totalSpent.toFixed(2)}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    Total Points
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <div className="h-3.5 w-3.5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    {customer.totalPoints} pts
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Last visit:{" "}
                  {customer.lastVisit
                    ? new Date(customer.lastVisit).toLocaleDateString()
                    : "Never"}
                </div>
                <div>{customer.visitCount} visits</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
