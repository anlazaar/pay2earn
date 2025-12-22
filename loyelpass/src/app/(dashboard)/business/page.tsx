import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateProgramModal } from "@/components/CreateProgramModal";
import {
  Gift,
  CreditCard,
  Users,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

async function getPrograms(userId: string) {
  const business = await prisma.business.findUnique({
    where: { ownerId: userId },
    include: { loyaltyPrograms: true },
  });
  return business?.loyaltyPrograms || [];
}

export default async function BusinessDashboard() {
  const session = await auth();
  const programs = await getPrograms(session?.user?.id as string);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 🟢 Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground text-sm">
            Manage your loyalty ecosystem.
          </p>
        </div>
        <CreateProgramModal />
      </div>

      {/* 🟢 Quick Stats (Apple Widget Style) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Active Programs Widget */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Active Programs
            </span>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {programs.filter((p) => p.active).length}
            </span>
            <span className="text-xs text-muted-foreground">active</span>
          </div>
        </div>

        {/* Clients Widget */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Total Clients
            </span>
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">0</span>
            <span className="text-xs text-muted-foreground">clients</span>
          </div>
        </div>

        {/* Points Widget */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Points Issued
            </span>
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">0</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
        </div>
      </div>

      {/* 🟢 Loyalty Cards (Apple Wallet Style) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Passes</h3>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View All
          </Button>
        </div>

        {programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-3xl border border-dashed border-border/60 bg-card/30">
            <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="text-base font-medium mb-1">No passes created</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first loyalty pass.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <div
                key={program.id}
                className="group relative h-48 rounded-3xl overflow-hidden border border-border/40 bg-gradient-to-br from-zinc-900 to-black text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 left-0 h-24 w-24 bg-white/5 rounded-full blur-xl transform -translate-x-5 translate-y-5"></div>

                <div className="relative h-full flex flex-col justify-between p-6 z-10">
                  {/* Card Top */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <Gift className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold tracking-wide text-sm opacity-90">
                        {program.name}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`border-white/20 text-white ${
                        program.active ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      {program.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {/* Card Bottom */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
                      Reward
                    </div>
                    <div className="text-2xl font-bold tracking-tight">
                      {program.rewardValue}
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-sm text-white/80">
                        Target:{" "}
                        <span className="font-semibold">
                          {program.pointsThreshold} pts
                        </span>
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full hover:bg-white/10 text-white/80"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
