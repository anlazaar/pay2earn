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
  User,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useFormatter } from "next-intl";

// Interface for type safety
interface Business {
  id: string;
  name: string;
  owner: { email: string; username: string };
  tier: string;
  subscriptionStatus: "active" | "blocked" | "pending";
  createdAt: string;
}

export default function AdminBusinessesPage() {
  const format = useFormatter();
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-start">
      {/* 🟢 Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200/50 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Business Registry
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Manage registered partners and their subscription status.
            </p>
          </div>
        </div>

        {/* Search Input (Engineered) */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-10 h-10 bg-background border-zinc-200 dark:border-white/10 focus:border-primary/50 rounded-full transition-all"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-zinc-200 dark:border-white/10"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* 🟢 Data Grid */}
      <div className="rounded-3xl border border-zinc-200/50 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-white/5">
            <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-white/5">
              <TableHead className="w-75 ps-6 h-12 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Company
              </TableHead>
              <TableHead className="h-12 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Owner
              </TableHead>
              <TableHead className="h-12 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Plan
              </TableHead>
              <TableHead className="h-12 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-end pe-6 h-12 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading Skeleton
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow
                  key={i}
                  className="border-zinc-100 dark:border-white/5"
                >
                  <TableCell colSpan={5} className="h-16 px-6">
                    <div className="h-full w-full rounded-lg bg-zinc-100 dark:bg-white/5 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredBusinesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Building2 className="h-6 w-6 opacity-30" />
                    </div>
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
                  className="group hover:bg-zinc-50/80 dark:hover:bg-white/5 border-b border-zinc-100 dark:border-white/5 transition-all duration-200"
                >
                  <TableCell className="ps-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-xs font-bold border border-zinc-200 dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                        {biz.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground tracking-tight">
                          {biz.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          ID: {biz.id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">
                          {biz.owner.username || "Unknown"}
                        </span>
                        <span className="text-[10px] text-muted-foreground opacity-70">
                          {biz.owner.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-mono text-[10px] h-5 border px-1.5",
                        biz.tier === "PREMIUM"
                          ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                          : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:border-white/10"
                      )}
                    >
                      {biz.tier}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          biz.subscriptionStatus === "active"
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                        )}
                      />
                      <span className="text-xs text-foreground capitalize font-bold">
                        {biz.subscriptionStatus}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-end pe-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateStatus(biz.id, biz.subscriptionStatus)
                      }
                      className={cn(
                        "h-8 px-3 text-xs font-bold rounded-lg border transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
                        biz.subscriptionStatus === "active"
                          ? "text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/30"
                          : "text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/30 dark:hover:bg-emerald-950/30"
                      )}
                    >
                      {biz.subscriptionStatus === "active" ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Block
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Unblock
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
