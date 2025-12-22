import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CreditCard } from "lucide-react";
import { redirect } from "next/navigation";

async function getStats() {
  // In a server component, we can call DB directly or fetch API
  // Let's call the API url if absolute, or simpler: direct DB call here
  // For consistency with Next.js App Router patterns, let's direct DB call:
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  const [businesses, clients, purchases] = await Promise.all([
    prisma.business.count(),
    prisma.client.count(),
    prisma.purchase.count(),
  ]);

  return { businesses, clients, purchases };
}

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const stats = await getStats();

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Businesses
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.businesses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.purchases}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
