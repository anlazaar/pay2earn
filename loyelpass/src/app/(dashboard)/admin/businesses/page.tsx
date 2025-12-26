"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  ShieldAlert,
  CheckCircle,
  Search,
  Building2,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Interface for type safety
interface Business {
  id: string;
  name: string;
  owner: { email: string };
  tier: string;
  subscriptionStatus: "active" | "blocked" | "pending";
  createdAt: string;
}

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBusinesses = async () => {
    try {
      const res = await fetch("/api/admin/businesses");
      if (res.ok) {
        setBusinesses(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const updateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    // Optimistic update
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, subscriptionStatus: newStatus as any } : b
      )
    );

    try {
      await fetch("/api/admin/businesses", {
        method: "PATCH",
        body: JSON.stringify({ businessId: id, status: newStatus }),
      });
    } catch (e) {
      // Revert logic would go here
    }
  };

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground font-medium">
            Loading Registry...
          </span>
        </div>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* 🟢 Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Business Registry
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage registered partners and their subscription status.
          </p>
        </div>

        {/* Search Input (Engineered) */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-background border-border focus-visible:ring-1 focus-visible:ring-primary text-sm"
          />
        </div>
      </div>

      {/* 🟢 Data Grid */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="w-[300px] pl-6 h-10 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Company
              </TableHead>
              <TableHead className="h-10 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Plan
              </TableHead>
              <TableHead className="h-10 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-right pr-6 h-10 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Building2 className="h-8 w-8 mb-2 opacity-20" />
                    <span className="text-sm font-medium">
                      No businesses found
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBusinesses.map((biz) => (
                <TableRow
                  key={biz.id}
                  className="group hover:bg-secondary/30 border-b border-border/40 transition-colors"
                >
                  <TableCell className="pl-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground tracking-tight">
                          {biz.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {biz.owner.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-normal text-[10px] h-5 border-border bg-background"
                    >
                      {biz.tier}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          biz.subscriptionStatus === "active"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        )}
                      />
                      <span className="text-xs text-foreground capitalize font-medium">
                        {biz.subscriptionStatus}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateStatus(biz.id, biz.subscriptionStatus)
                      }
                      className={cn(
                        "h-7 px-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200",
                        biz.subscriptionStatus === "active"
                          ? "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      )}
                    >
                      {biz.subscriptionStatus === "active" ? (
                        <>
                          <ShieldAlert className="w-3 h-3 mr-1.5" /> Block
                          Access
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1.5" /> Unblock
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
