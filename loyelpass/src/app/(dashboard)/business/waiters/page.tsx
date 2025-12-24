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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* 🟢 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Staff Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage access for your waiters and POS operators.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* 🟢 Column 1: Create Form (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="border-none shadow-lg bg-white/40 dark:bg-white/5 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 rounded-3xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" />

            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <UserPlus className="h-4 w-4" />
                </div>
                Add New Staff
              </CardTitle>
              <CardDescription>
                Create an account for your staff to access the POS terminal.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      required
                      className="pl-10 bg-background/50 border-white/20 focus-visible:ring-primary"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Alex Johnson"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      required
                      type="email"
                      className="pl-10 bg-background/50 border-white/20 focus-visible:ring-primary"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="staff@restaurant.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="password">Set Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      required
                      type="password"
                      className="pl-10 bg-background/50 border-white/20 focus-visible:ring-primary"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Minimum 6 characters. Must contain at least one number.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full font-bold shadow-md hover:scale-[1.02] transition-transform mt-4s"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
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
          <Card className="h-full border-none shadow-lg bg-white/40 dark:bg-white/5 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Users className="h-4 w-4" />
                  </div>
                  Your Team
                </CardTitle>
                <Badge variant="secondary" className="px-3 py-1">
                  {waiters.length} Active
                </Badge>
              </div>
              <CardDescription>
                List of all employees with access to your system.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {fetching ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                  <p className="text-sm">Loading team members...</p>
                </div>
              ) : waiters.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border-2 border-dashed border-muted bg-muted/20">
                  <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">No staff found</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Get started by adding your first waiter using the form on
                    the left.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {waiters.map((waiter) => (
                    <div
                      key={waiter.id}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-border/50 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar Placeholder */}
                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                          {waiter.username?.[0]?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-foreground">
                              {waiter.username || "Unknown"}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 px-1.5 border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900"
                            >
                              Active
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" /> {waiter.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-muted-foreground">
                            Joined
                          </p>
                          <p className="text-xs font-medium">
                            {new Date(waiter.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Action Menu Placeholder */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
