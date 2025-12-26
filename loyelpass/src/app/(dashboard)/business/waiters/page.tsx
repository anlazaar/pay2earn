"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  UserPlus,
  Users,
  Mail,
  Lock,
  User,
  Loader2,
  MoreVertical,
  Search,
  CheckCircle2,
} from "lucide-react";

export default function WaitersPage() {
  const [waiters, setWaiters] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchWaiters();
  }, []);

  const fetchWaiters = async () => {
    try {
      const res = await fetch("/api/waiters");
      if (res.ok) setWaiters(await res.json());
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/waiters", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: "", email: "", password: "" });
        fetchWaiters();
      } else {
        alert("Failed to create waiter");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      {/* 🟢 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Staff Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage access for your waiters and POS operators.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 🟢 Column 1: Create Form (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="border border-border/50 shadow-sm bg-card rounded-xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <UserPlus className="h-4 w-4" />
                </div>
                Add New Staff
              </CardTitle>
              <CardDescription className="text-xs">
                Create an account for POS access.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      required
                      className="pl-9 h-10 bg-secondary/20"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Alex Johnson"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      required
                      type="email"
                      className="pl-9 h-10 bg-secondary/20"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="staff@restaurant.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Set Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      required
                      type="password"
                      className="pl-9 h-10 bg-secondary/20"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground pt-1">
                    Minimum 6 characters. Must contain at least one number.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-sm font-medium h-10 mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 🟢 Column 2: Staff List (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Card className="h-full border border-border/50 shadow-sm bg-card rounded-xl flex flex-col">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Team Members
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      className="h-7 w-48 rounded bg-secondary/30 border border-border pl-8 text-xs outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Search staff..."
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className="h-6 bg-secondary/50 font-normal"
                  >
                    {waiters.length} Active
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              {fetching ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mb-3 text-primary" />
                  <p className="text-xs">Loading team...</p>
                </div>
              ) : waiters.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-sm text-foreground">
                    No staff found
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
                    Get started by adding your first waiter using the form.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {waiters.map((waiter) => (
                    <div
                      key={waiter.id}
                      className="group flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="h-9 w-9 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold border border-white/10 shadow-sm">
                          {waiter.username?.[0]?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm text-foreground">
                              {waiter.username || "Unknown"}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {waiter.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] uppercase text-muted-foreground tracking-wider mb-0.5">
                            Added
                          </p>
                          <p className="text-xs font-mono text-foreground">
                            {new Date(waiter.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
