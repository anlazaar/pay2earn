import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Gift, Trophy } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const prisma = new PrismaClient();

async function getClientProgress(userId: string) {
  const client = await prisma.client.findUnique({
    where: { userId },
    include: {
      progress: {
        include: {
          program: {
            include: { business: true },
          },
        },
      },
    },
  });
  return client?.progress || [];
}

export default async function ClientDashboard() {
  const session = await auth();
  const progressList = await getClientProgress(session?.user?.id as string);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 🟢 Hero / Scan Action */}
      <div className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground shadow-lg flex flex-col items-center text-center space-y-4">
        <h2 className="text-2xl font-bold">Collect Points</h2>
        <p className="opacity-90 max-w-sm">
          Scan the QR code presented by the waiter to earn points instantly.
        </p>
        <Link href="/client/scan">
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 font-bold shadow-md"
          >
            <QrCode className="h-5 w-5" /> Scan QR Code
          </Button>
        </Link>
      </div>

      <h3 className="text-lg font-semibold mt-8 px-1">My Wallets</h3>

      {/* 🟢 Wallet List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {progressList.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            <Trophy className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>No points yet. Visit a partner business!</p>
          </div>
        ) : (
          progressList.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm ring-1 ring-white/10"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-bold">
                  {item.program.business.name}
                </CardTitle>
                <Badge variant="outline">{item.program.name}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-4xl font-extrabold tracking-tighter">
                      {item.pointsAccumulated}
                    </span>
                    <span className="text-muted-foreground text-sm ml-1">
                      pts
                    </span>
                  </div>
                  <Gift className="h-8 w-8 text-muted-foreground/20" />
                </div>
                <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{
                      width: `${Math.min(
                        (item.pointsAccumulated /
                          item.program.pointsThreshold) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  Target: {item.program.pointsThreshold} pts
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
