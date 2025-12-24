"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      // Revert on error (omitted for brevity)
    }
  };

  // Filter logic
  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* 🟢 Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Business Registry
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage registered partners and their subscription status.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/30 rounded-xl"
          />
        </div>
      </div>

      {/* 🟢 Premium Data Grid */}
      <div className="rounded-[1.5rem] border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b border-border/40">
              <TableHead className="w-[300px] pl-6 h-12 text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                Business Details
              </TableHead>
              <TableHead className="h-12 text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                Plan
              </TableHead>
              <TableHead className="h-12 text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-right pr-6 h-12 text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No businesses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBusinesses.map((biz) => (
                <TableRow
                  key={biz.id}
                  className="group hover:bg-primary/5 border-b border-border/30 transition-colors"
                >
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border border-border/50">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground tracking-tight">
                          {biz.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {biz.owner.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        biz.tier === "PRO"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {biz.tier}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "relative flex h-2.5 w-2.5 rounded-full",
                          biz.subscriptionStatus === "active"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        )}
                      >
                        {biz.subscriptionStatus === "active" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                      </span>
                      <span className="text-sm font-medium capitalize">
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
                        "h-8 px-3 rounded-lg transition-all duration-300 font-medium",
                        biz.subscriptionStatus === "active"
                          ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                      )}
                    >
                      {biz.subscriptionStatus === "active" ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 mr-2" /> Block
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 mr-2" /> Unblock
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
