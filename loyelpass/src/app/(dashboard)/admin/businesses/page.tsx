"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Ensure you have shadcn table or use standard divs
import { Loader2, ShieldAlert, CheckCircle } from "lucide-react";

// Helper for table structure if shadcn table not installed:
// You can just use standard HTML <table> with tailwind classes.

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    const res = await fetch("/api/admin/businesses");
    if (res.ok) {
      setBusinesses(await res.json());
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const updateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    // Optimistic update
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, subscriptionStatus: newStatus } : b
      )
    );

    await fetch("/api/admin/businesses", {
      method: "PATCH",
      body: JSON.stringify({ businessId: id, status: newStatus }),
    });
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle>Business Registry</CardTitle>
        <CardDescription>
          Manage registered businesses and subscriptions.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border bg-card">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 font-medium">Business Name</th>
                <th className="p-4 font-medium">Owner Email</th>
                <th className="p-4 font-medium">Tier</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((biz) => (
                <tr
                  key={biz.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 font-medium">{biz.name}</td>
                  <td className="p-4 text-muted-foreground">
                    {biz.owner.email}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{biz.tier}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        biz.subscriptionStatus === "active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {biz.subscriptionStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateStatus(biz.id, biz.subscriptionStatus)
                      }
                      className={
                        biz.subscriptionStatus === "active"
                          ? "text-red-500 hover:text-red-600"
                          : "text-green-500 hover:text-green-600"
                      }
                    >
                      {biz.subscriptionStatus === "active" ? (
                        <>
                          <ShieldAlert className="w-4 h-4 mr-2" /> Block
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" /> Unblock
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
